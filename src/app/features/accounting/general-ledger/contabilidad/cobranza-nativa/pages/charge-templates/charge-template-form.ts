import { Component, effect, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { ChargeTypeCatalogResponseDTO } from "../../models/charge-type-catalog.dto";
import {
  CreateChargeTemplateDTO,
  UpdateChargeTemplateDTO,
} from "../../models/charge-template.dto";
import {
  ECalculationMethod,
  EDiscountType,
  ERecurrence,
} from "../../models/enums";

// Custom Inputs
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";

interface IChargeTemplateForm {
  name: FormControl<string>;
  calculationMethod: FormControl<ECalculationMethod>;
  chargeTypeId: FormControl<string>;
  amount: FormControl<number>;
  recurrence: FormControl<ERecurrence>;
  dayOfMonth: FormControl<number>;
  startDate: FormControl<Date | string | null>;
  endDate: FormControl<Date | string | null>;
  earlyPaymentDiscount: FormControl<number | null>;
  earlyPaymentDiscountType: FormControl<EDiscountType | null>;
  earlyPaymentGraceDays: FormControl<number | null>;
  applyToAllProperties: FormControl<boolean>;
  isRetroactive: FormControl<boolean>;
  retroactiveStartDate: FormControl<Date | string | null>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: "app-charge-template-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputCurrencySignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    WebButtonLabelSave,
    ButtonModule,
  ],
  templateUrl: "./charge-template-form.html",
})
export class ChargeTemplateForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id: string = "";
  customerId: string = "";
  form: FormGroup<IChargeTemplateForm>;
  submitting = signal(false);
  chargeTypes = signal<{ label: string; value: string }[]>([]);

  constructor() {
    effect(() => {
      const isRetroactive = this.form?.controls.isRetroactive.value;
      const control = this.form?.controls.retroactiveStartDate;
      if (!control) return;

      if (isRetroactive) {
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  recurrenceOptions = [
    { label: "Eventual", value: ERecurrence.Eventual },
    { label: "Mensual", value: ERecurrence.Mensual },
    { label: "Bimestral", value: ERecurrence.Bimestral },
    { label: "Trimestral", value: ERecurrence.Trimestral },
    { label: "Cuatrimestral", value: ERecurrence.Cuatrimestral },
    { label: "Quimestral", value: ERecurrence.Quimestral },
    { label: "Semestral", value: ERecurrence.Semestral },
    { label: "Anual", value: ERecurrence.Anual },
  ];

  calculationMethods = [
    { label: "Monto Fijo por Depto", value: ECalculationMethod.FixedAmount },
    { label: "Prorrateo por Indiviso", value: ECalculationMethod.Indiviso },
  ];

  discountTypes = [
    { label: "Monto Fijo ($)", value: EDiscountType.FixedValue },
    { label: "Porcentaje (%)", value: EDiscountType.Percentage },
  ];

  async ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;

    this.form = new FormGroup<IChargeTemplateForm>({
      name: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      calculationMethod: new FormControl(ECalculationMethod.FixedAmount, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      chargeTypeId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      recurrence: new FormControl(ERecurrence.Mensual, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      dayOfMonth: new FormControl(1, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(31),
        ],
      }),
      startDate: new FormControl(new Date(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endDate: new FormControl(null),
      earlyPaymentDiscount: new FormControl(null, {
        validators: [Validators.min(0)],
      }),
      earlyPaymentDiscountType: new FormControl(null),
      earlyPaymentGraceDays: new FormControl(null, {
        validators: [Validators.min(0)],
      }),
      applyToAllProperties: new FormControl(false, { nonNullable: true }),
      isRetroactive: new FormControl(false, { nonNullable: true }),
      retroactiveStartDate: new FormControl(null),
      isActive: new FormControl(true, { nonNullable: true }),
    });

    await this.loadChargeTypes();

    if (this.id) {
      this.loadData();
    }
  }

  async loadChargeTypes() {
    const res = await this.apiResponseS.onGetItem<ChargeTypeCatalogResponseDTO[]>(
      Endpoints.AccountingCoi.NativeCollection.ChargeTypes.customer(this.customerId),
    );

    this.chargeTypes.set(
      (res ?? [])
        .filter((x) => x.isActive)
        .map((x) => ({
          label: `${x.name} · ${x.accountNumber}`,
          value: x.id,
        })),
    );

    if (!this.id && this.chargeTypes().length > 0 && !this.form.controls.chargeTypeId.value) {
      this.form.controls.chargeTypeId.setValue(this.chargeTypes()[0].value);
    }
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.Templates.getById(this.id),
    );
    if (res) {
      if (res.startDate) res.startDate = this.dateS.parseDate(res.startDate);
      if (res.endDate) res.endDate = this.dateS.parseDate(res.endDate);
      if (res.retroactiveStartDate)
        res.retroactiveStartDate = this.dateS.parseDate(
          res.retroactiveStartDate,
        );
      this.form.patchValue(res);
    }
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id
        ? Endpoints.AccountingCoi.NativeCollection.Templates.update(this.id)
        : Endpoints.AccountingCoi.NativeCollection.Templates.create,
      method: this.id ? "PUT" : "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        const payloadBase = {
          ...raw,
          startDate: this.dateS.getDateFormat(raw.startDate) ?? "",
          endDate: this.dateS.getDateFormat(raw.endDate),
          retroactiveStartDate: this.dateS.getDateFormat(
            raw.retroactiveStartDate,
          ),
        };
        if (this.id) {
          return {
            id: this.id,
            ...payloadBase,
            chargeType: null,
          } as UpdateChargeTemplateDTO;
        } else {
          return {
            customerId: this.customerId,
            ...payloadBase,
            chargeType: null,
          } as CreateChargeTemplateDTO;
        }
      },
    });
  }

  async onPreviewFees() {
    // Collect what we need from the form
    const formValue = this.form.getRawValue();
    const payload = {
      customerId: this.customerId,
      calculationMethod: formValue.calculationMethod,
      amount: formValue.amount,
      applyToAllProperties: formValue.applyToAllProperties,
      startDate: this.dateS.getDateFormat(this.form.getRawValue().startDate),
      endDate: this.dateS.getDateFormat(this.form.getRawValue().endDate),
      earlyPaymentDiscount: this.form.getRawValue().earlyPaymentDiscount,
      earlyPaymentDiscountType:
        this.form.getRawValue().earlyPaymentDiscountType,
      earlyPaymentGraceDays: this.form.getRawValue().earlyPaymentGraceDays,
      isRetroactive: this.form.getRawValue().isRetroactive,
      retroactiveStartDate: this.dateS.getDateFormat(
        this.form.getRawValue().retroactiveStartDate,
      ),
      isActive: this.form.getRawValue().isActive,
    };

    // NOTE: This will require the backend endpoint to be implemented first!
    // Modal will display based on the selected calculation method.

    this.apiResponseS
      .onPost(
        Endpoints.AccountingCoi.NativeCollection.Templates.preview,
        payload,
      )
      .then((res) => {
        if (res) {
          // Open Modal displaying result
          console.log("Preview Response: ", res);
        }
      })
      .catch((e) => {
        console.error(
          "Preview execution failed - backend endpoint likely missing",
          e,
        );
      });
  }
}

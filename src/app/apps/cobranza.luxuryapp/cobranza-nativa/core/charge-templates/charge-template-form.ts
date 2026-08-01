import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import {
  ChargeTemplateResponseDTO,
  CreateChargeTemplateDTO,
  UpdateChargeTemplateDTO,
} from "../../interfaces/charge-template.dto";
import { ChargeTypeCatalogResponseDTO } from "../../interfaces/charge-type-catalog.dto";
import {
  ECalculationMethod,
  EDiscountType,
  Recurrence,
} from "../../interfaces/enums";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";

interface IChargeTemplateForm {
  name: FormControl<string>;
  calculationMethod: FormControl<ECalculationMethod>;
  chargeTypeId: FormControl<string>;
  amount: FormControl<number>;
  recurrence: FormControl<Recurrence>;
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
    LxCard,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-template-form.html",
})
export class ChargeTemplateForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private toastS = inject(CustomToastService);

  id = "";
  customerId = "";
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
    { label: "Eventual", value: Recurrence.Eventual },
    { label: "Mensual", value: Recurrence.Mensual },
    { label: "Bimestral", value: Recurrence.Bimestral },
    { label: "Trimestral", value: Recurrence.Trimestral },
    { label: "Cuatrimestral", value: Recurrence.Cuatrimestral },
    { label: "Quimestral", value: Recurrence.Quimestral },
    { label: "Semestral", value: Recurrence.Semestral },
    { label: "Anual", value: Recurrence.Anual },
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
      recurrence: new FormControl(Recurrence.Mensual, {
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
    const res = await this.apiResponseS.onGetItem<
      ChargeTypeCatalogResponseDTO[]
    >(
      Endpoints.CobranzaCore.ChargeTypes.customer(
        this.customerId,
      ),
    );

    this.chargeTypes.set(
      (res ?? []).map((x) => ({
        label: `${x.name} · ${x.code}`,
        value: x.id,
      })),
    );

    if (
      !this.id &&
      this.chargeTypes().length > 0 &&
      !this.form.controls.chargeTypeId.value
    ) {
      this.form.controls.chargeTypeId.setValue(this.chargeTypes()[0].value);
    }
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<ChargeTemplateResponseDTO>(
      Endpoints.CobranzaCore.Templates.getById(this.id),
    );
    if (res) {
      this.form.patchValue({
        ...res,
        startDate: this.dateS.parseDate(res.startDate),
        endDate: this.dateS.parseDate(res.endDate),
        retroactiveStartDate: this.dateS.parseDate(res.retroactiveStartDate),
      });
    }
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id
        ? Endpoints.CobranzaCore.Templates.update(this.id)
        : Endpoints.CobranzaCore.Templates.create,
      method: this.id ? "PUT" : "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        const payloadBase = {
          ...raw,
          startDate: this.dateS.getDateFormat(raw.startDate) ?? "",
          endDate: this.dateS.getDateFormat(raw.endDate),
          retroactiveStartDate: this.dateS.getDateFormat(raw.retroactiveStartDate),
        };
        if (this.id) {
          return {
            id: this.id,
            customerId: this.customerId,
            ...payloadBase,
          } as UpdateChargeTemplateDTO;
        } else {
          return {
            customerId: this.customerId,
            ...payloadBase,
          } as CreateChargeTemplateDTO;
        }
      },
    });
  }

  async onPreviewFees() {
    const formValue = this.form.getRawValue();
    const payload = {
      customerId: this.customerId,
      calculationMethod: formValue.calculationMethod,
      amount: formValue.amount,
      applyToAllProperties: formValue.applyToAllProperties,
      startDate: this.dateS.getDateFormat(this.form.getRawValue().startDate),
      endDate: this.dateS.getDateFormat(this.form.getRawValue().endDate),
      earlyPaymentDiscount: this.form.getRawValue().earlyPaymentDiscount,
      earlyPaymentDiscountType: this.form.getRawValue().earlyPaymentDiscountType,
      earlyPaymentGraceDays: this.form.getRawValue().earlyPaymentGraceDays,
      isRetroactive: this.form.getRawValue().isRetroactive,
      retroactiveStartDate: this.dateS.getDateFormat(
        this.form.getRawValue().retroactiveStartDate,
      ),
      isActive: this.form.getRawValue().isActive,
    };

    this.apiResponseS
      .onPost(
        Endpoints.CobranzaCore.Templates.preview,
        payload,
      )
      .then((res) => {
        if (res) {
          this.toastS.showSuccess(
            "Vista previa generada",
            "El cálculo se ejecutó correctamente. El visor detallado será el siguiente paso de esta pantalla.",
          );
        }
      })
      .catch(() => {
        this.toastS.showWarn(
          "Vista previa no disponible",
          "No fue posible mostrar la vista previa en este momento.",
        );
      });
  }
}

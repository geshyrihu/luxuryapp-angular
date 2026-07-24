import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { ChargeTypeCatalogResponseDTO } from "../interfaces/charge-type-catalog.dto";
import { CreateChargeDTO, UpdateChargeDTO } from "../interfaces/charge.dto";
import { EChargeStatus } from "../interfaces/enums";

// Custom Inputs
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";

interface IChargeForm {
  propertyId: FormControl<string>;
  chargeTypeId: FormControl<string>;
  concept: FormControl<string>;
  amount: FormControl<number>;
  dueDate: FormControl<Date>;
  periodStart: FormControl<Date | null>;
  periodEnd: FormControl<Date | null>;
  status: FormControl<EChargeStatus>;
  generatedAutomatically: FormControl<boolean>;
  chargeTemplateId: FormControl<string | null>;
  discountAvailable: FormControl<number | null>;
  discountDeadline: FormControl<Date | null>;
}

@Component({
  selector: "app-charge-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputCurrencySignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-form.html",
})
export class ChargeForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id: string = "";
  customerId: string = "";
  form: FormGroup<IChargeForm>;
  submitting = signal(false);
  formInvalid = signal(true);

  propertiesOptions = signal<any[]>([]);
  templatesOptions = signal<any[]>([]);
  chargeTypeOptions = signal<{ label: string; value: string }[]>([]);

  // Pagado y PagoParcial solo los asigna el sistema via aplicacion de pago.
  // No se exponen en el formulario manual para evitar mutacion directa de estados financieros.
  statusOptions = [
    { label: "Pendiente", value: EChargeStatus.Pendiente },
    { label: "Vencido", value: EChargeStatus.Vencido },
    { label: "Cancelado", value: EChargeStatus.Cancelado },
  ];

  async ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;

    this.form = this.fb.group({
      propertyId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      chargeTypeId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      concept: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      dueDate: new FormControl(new Date(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      periodStart: new FormControl<Date | null>(null),
      periodEnd: new FormControl<Date | null>(null),
      status: new FormControl(EChargeStatus.Pendiente, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      generatedAutomatically: new FormControl(false, { nonNullable: true }),
      chargeTemplateId: new FormControl<string | null>(null),
      discountAvailable: new FormControl<number | null>(null, {
        validators: [Validators.min(0)],
      }),
      discountDeadline: new FormControl<Date | null>(null),
    });

    this.form.statusChanges.subscribe((status) => {
      this.formInvalid.set(status !== "VALID");
    });
    this.formInvalid.set(this.form.status !== "VALID");

    await Promise.all([
      this.loadProperties(),
      this.loadTemplates(),
      this.loadChargeTypes(),
    ]);

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

    this.chargeTypeOptions.set(
      (res ?? [])
        .filter((x) => x.isActive)
        .map((x) => ({
          label: `${x.name} · ${x.accountNumber}`,
          value: x.id,
        })),
    );

    if (
      !this.id &&
      this.chargeTypeOptions().length > 0 &&
      !this.form.controls.chargeTypeId.value
    ) {
      this.form.controls.chargeTypeId.setValue(
        this.chargeTypeOptions()[0].value,
      );
    }
  }

  async loadProperties() {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      Endpoints.Properties.listByCustomer(this.customerId),
    );
    if (res) this.propertiesOptions.set(res);
  }

  async loadTemplates() {
    const res = await this.apiResponseS.onGetItem<any[]>(
      Endpoints.CobranzaCore.Templates.customer(
        this.customerId,
      ),
    );
    if (res)
      this.templatesOptions.set(
        res.map((t) => ({
          label: `${t.name} - ${t.amount}`,
          value: t.id,
        })),
      );
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.CobranzaCore.Charges.getById(this.id),
    );
    if (res) {
      if (res.dueDate) res.dueDate = this.dateS.parseDate(res.dueDate);
      if (res.periodStart)
        res.periodStart = this.dateS.parseDate(res.periodStart);
      if (res.periodEnd) res.periodEnd = this.dateS.parseDate(res.periodEnd);
      if (res.discountDeadline)
        res.discountDeadline = this.dateS.parseDate(res.discountDeadline);
      this.form.patchValue(res);

      // Si el cargo ya tiene pagos aplicados, bloquear edicion del formulario.
      // El estado Pagado o PagoParcial solo lo asigna el sistema.
      const estadosConPago = [EChargeStatus.Pagado, EChargeStatus.PagoParcial];
      if (estadosConPago.includes(res.status)) {
        this.form.disable();
        // Agregar la opcion del estado actual para que el select lo muestre correctamente
        if (!this.statusOptions.some((o) => o.value === res.status)) {
          this.statusOptions = [
            ...this.statusOptions,
            {
              label:
                res.status === EChargeStatus.Pagado ? "Pagado" : "Pago Parcial",
              value: res.status,
            },
          ];
        }
      }
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CobranzaCore.Charges.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        const payload = {
          ...raw,
          dueDate: this.dateS.getDateFormat(raw.dueDate) ?? "",
          periodStart: this.dateS.getDateFormat(raw.periodStart),
          periodEnd: this.dateS.getDateFormat(raw.periodEnd),
          discountDeadline: this.dateS.getDateFormat(raw.discountDeadline),
        };
        return this.id
          ? ({ id: this.id, type: null, ...payload } as UpdateChargeDTO)
          : ({
              customerId: this.customerId,
              sourcePolicyId: null,
              type: null,
              ...payload,
            } as CreateChargeDTO);
      },
    });
  }
}


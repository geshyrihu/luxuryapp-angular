import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CreateChargeDTO, UpdateChargeDTO } from "../../models/charge.dto";
import { EChargeStatus, EChargeType } from "../../models/enums";

// Custom Inputs
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";

interface IChargeForm {
  propertyId: FormControl<string>;
  type: FormControl<EChargeType>;
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
    CustomButtonSave,
  ],
  templateUrl: "./charge-form.html",
})
export class ChargeForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id: string = "";
  customerId: string = "";
  form: FormGroup<IChargeForm>;
  submitting = signal(false);
  formInvalid = signal(true);

  propertiesOptions = signal<any[]>([]);
  templatesOptions = signal<any[]>([]);

  typeOptions = [
    {
      label: "Mantenimiento Ordinario",
      value: EChargeType.MantenimientoOrdinario,
    },
    { label: "Cuota Extraordinaria", value: EChargeType.CuotaExtraordinaria },
    { label: "Recargo por Mora", value: EChargeType.RecargoMora },
    { label: "Saldo Inicial", value: EChargeType.SaldoInicial },
    { label: "Otros", value: EChargeType.Otros },
  ];

  // Pagado y PagoParcial solo los asigna el sistema via aplicacion de pago.
  // No se exponen en el formulario manual para evitar mutacion directa de estados financieros.
  statusOptions = [
    { label: "Pendiente", value: EChargeStatus.Pendiente },
    { label: "Vencido", value: EChargeStatus.Vencido },
    { label: "Cancelado", value: EChargeStatus.Cancelado },
  ];

  ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;

    this.form = this.fb.group({
      propertyId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      type: new FormControl(EChargeType.MantenimientoOrdinario, {
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

    this.loadProperties();
    this.loadTemplates();

    if (this.id) {
      this.loadData();
    }
  }

  async loadProperties() {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      `properties/${this.customerId}`,
    );
    if (res) this.propertiesOptions.set(res);
  }

  async loadTemplates() {
    const res = await this.apiResponseS.onGetItem<any[]>(
      Endpoints.AccountingCoi.NativeCollection.Templates.customer(this.customerId),
    );
    if (res) this.templatesOptions.set(res.map((t) => ({
      label: `${t.name} - ${t.amount}`,
      value: t.id,
    })));
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.Charges.getById(this.id),
    );
    if (res) {
      if (res.dueDate) res.dueDate = new Date(res.dueDate);
      if (res.periodStart) res.periodStart = new Date(res.periodStart);
      if (res.periodEnd) res.periodEnd = new Date(res.periodEnd);
      if (res.discountDeadline)
        res.discountDeadline = new Date(res.discountDeadline);
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
            { label: res.status === EChargeStatus.Pagado ? "Pagado" : "Pago Parcial", value: res.status },
          ];
        }
      }
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AccountingCoi.NativeCollection.Charges.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        return this.id
          ? ({ id: this.id, ...raw } as UpdateChargeDTO)
          : ({ customerId: this.customerId, sourcePolicyId: null, ...raw } as CreateChargeDTO);
      },
    });
  }
}

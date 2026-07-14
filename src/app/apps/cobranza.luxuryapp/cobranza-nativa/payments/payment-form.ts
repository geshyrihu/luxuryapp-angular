import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import {
  CreateCobranzaPaymentDTO,
  UpdateCobranzaPaymentDTO,
} from "../interfaces/cobranza-payment.dto";
import { EPaymentMethod, EPaymentStatus } from "../interfaces/enums";

import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";

interface IPaymentEditForm {
  propertyId: FormControl<string>;
  amount: FormControl<number>;
  paymentDate: FormControl<Date | null>;
  method: FormControl<EPaymentMethod>;
  reference: FormControl<string>;
  status: FormControl<EPaymentStatus>;
}

@Component({
  selector: "app-payment-form",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputTextSignal,
    WebButtonLabelSave,
  ],
  templateUrl: "./payment-form.html",
})
export class PaymentForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id = "";
  customerId = "";
  submitting = signal(false);

  propertiesOptions = signal<{ label: string; value: string }[]>([]);

  statusOptions = signal([
    { label: "Registrado", value: EPaymentStatus.Registrado },
    { label: "Verificado", value: EPaymentStatus.Verificado },
  ]);

  methodOptions = [
    {
      label: "Transferencia electrónica",
      value: EPaymentMethod.ElectronicTransfer,
    },
    { label: "Efectivo", value: EPaymentMethod.Cash },
    { label: "Cheque nominativo", value: EPaymentMethod.NominativeCheck },
    { label: "Tarjeta de crédito", value: EPaymentMethod.CreditCard },
    { label: "Tarjeta de débito", value: EPaymentMethod.DebitCard },
    { label: "Por definir (otros)", value: EPaymentMethod.ToBeDefined },
  ];

  form = new FormGroup<IPaymentEditForm>({
    propertyId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    paymentDate: new FormControl<Date | null>(new Date(), {
      validators: [Validators.required],
    }),
    method: new FormControl(EPaymentMethod.ElectronicTransfer, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reference: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    status: new FormControl(EPaymentStatus.Registrado, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;
    this.loadProperties();
    if (this.id) this.loadData();
  }

  async loadProperties() {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      Endpoints.RefactorResident.propertyListById(this.customerId),
    );
    if (res) this.propertiesOptions.set(res);
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.Payments.getById(this.id),
    );
    if (!res) return;
    if (res.paymentDate) {
      res.paymentDate = this.dateS.parseDate(res.paymentDate);
    }
    this.form.patchValue(res);

    const lockedStatuses: Partial<Record<EPaymentStatus, string>> = {
      [EPaymentStatus.Rechazado]: "Rechazado",
      [EPaymentStatus.Cancelado]: "Cancelado",
      [EPaymentStatus.Revertido]: "Revertido",
      [EPaymentStatus.NoIdentificado]: "No identificado",
    };

    if (res.status in lockedStatuses) {
      this.form.disable();
      if (!this.statusOptions().some((o) => o.value === res.status)) {
        this.statusOptions.update((opts) => [
          ...opts,
          {
            label: lockedStatuses[res.status] ?? String(res.status),
            value: res.status,
          },
        ]);
      }
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AccountingCoi.NativeCollection.Payments.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        const payload = {
          ...raw,
          paymentDate: this.dateS.getDateFormat(raw.paymentDate),
        };
        return this.id
          ? ({ id: this.id, ...payload } as UpdateCobranzaPaymentDTO)
          : ({
              customerId: this.customerId,
              ...payload,
            } as CreateCobranzaPaymentDTO);
      },
    });
  }
}

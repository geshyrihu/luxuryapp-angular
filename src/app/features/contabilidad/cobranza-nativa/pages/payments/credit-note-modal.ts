import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EPaymentMethod } from "../../models/enums";

interface ICreditNoteForm {
  propertyId: FormControl<string>;
  amount: FormControl<number>;
  paymentDate: FormControl<Date>;
  reference: FormControl<string>;
  notes: FormControl<string>;
}

interface CreditNoteRequestDTO {
  customerId: string;
  propertyId: string;
  amount: number;
  paymentDate: string;
  method: number;
  reference: string;
  notes: string;
}

@Component({
  selector: "app-credit-note-modal",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
  templateUrl: "./credit-note-modal.html",
})
export default class CreditNoteModalComponent implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  customerId = "";
  submitting = signal(false);
  propertiesOptions = signal<{ label: string; value: string }[]>([]);

  form = new FormGroup<ICreditNoteForm>({
    propertyId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    paymentDate: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reference: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    notes: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
  });

  reasonOptions = [
    { label: "Acuerdo de Asamblea", value: "Acuerdo de Asamblea" },
    { label: "Error en cobro duplicado", value: "Error en cobro duplicado" },
    { label: "Período de cortesía", value: "Período de cortesía" },
    { label: "Acuerdo de pago (quita)", value: "Acuerdo de pago (quita)" },
    { label: "Condonación por siniestro", value: "Condonación por siniestro" },
    { label: "Otro motivo", value: "Otro motivo" },
  ];

  ngOnInit() {
    this.customerId = this.config.data?.customerId;
    this.loadProperties();
  }

  async loadProperties() {
    const res = await this.apiResponseS.onGetSelectItem<{ label: string; value: string }[]>(
      `properties/${this.customerId}`,
    );
    if (res) this.propertiesOptions.set(res);
  }

  async onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const raw = this.form.getRawValue();
    const payload: CreditNoteRequestDTO = {
      customerId: this.customerId,
      propertyId: raw.propertyId,
      amount: raw.amount,
      paymentDate: raw.paymentDate.toISOString().split("T")[0],
      method: EPaymentMethod.DebtForgiveness,
      reference: raw.reference,
      notes: raw.notes,
    };

    this.submitting.set(true);
    try {
      const res = await this.apiResponseS.onPost(
        Endpoints.AccountingCoi.NativeCollection.Payments.create,
        payload,
      );
      if (res !== false) this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }
}

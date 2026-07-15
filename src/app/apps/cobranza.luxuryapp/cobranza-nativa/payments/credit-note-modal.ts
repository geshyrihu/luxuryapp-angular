import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { EPaymentMethod } from "../interfaces/enums";

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
    AppIcon,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
  templateUrl: "./credit-note-modal.html",
})
export default class CreditNoteModalComponent implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);
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
    const res = await this.apiResponseS.onGetSelectItem<
      { label: string; value: string }[]
    >(Endpoints.Properties.listByCustomer(this.customerId));
    if (res) this.propertiesOptions.set(res);
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CobranzaNative.Payments.create,
      method: "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (raw) =>
        ({
          customerId: this.customerId,
          propertyId: raw.propertyId,
          amount: raw.amount,
          paymentDate: this.dateS.getDateFormat(raw.paymentDate) ?? "",
          method: EPaymentMethod.DebtForgiveness,
          reference: raw.reference,
          notes: raw.notes,
        }) as CreditNoteRequestDTO,
    });
  }
}


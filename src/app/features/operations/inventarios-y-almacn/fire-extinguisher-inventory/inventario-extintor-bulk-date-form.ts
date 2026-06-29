import { Component, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IBulkDateForm {
  expirationDate: FormControl<string | null>;
}

@Component({
  selector: "app-inventario-extintor-bulk-date-form",
  templateUrl: "./inventario-extintor-bulk-date-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputDateSignal,
    CustomButtonSave,
  ],
})
export class InventarioExtintorBulkDateForm {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  formB = inject(FormBuilder);
  submitting = signal(false);

  form: FormGroup<IBulkDateForm> = this.formB.group({
    expirationDate: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);
    this.apiResponseS
      .onPut(
        `InventarioExtintor/bulk-expiration/${this.customerIdS.customerId()}`,
        {
          expirationDate: this.form.value.expirationDate,
        },
      )
      .then((result: any) => {
        result !== false ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

interface IBulkDateForm {
  expirationDate: FormControl<string | null>;
}

@Component({
  selector: "app-inventario-extintor-bulk-date-form",
  templateUrl: "./inventario-extintor-bulk-date-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputDateSignal,
    WebButtonLabelSave,
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

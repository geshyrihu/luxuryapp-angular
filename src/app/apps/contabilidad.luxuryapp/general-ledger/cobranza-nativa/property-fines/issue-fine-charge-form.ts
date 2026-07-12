import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
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
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  IssueFineChargeDTO,
  PropertyFineResponseDTO,
} from "../interfaces/property-fine.dto";

@Component({
  selector: "app-issue-fine-charge-form",
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    WebButtonLabelSave,
    CurrencyPipe,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./issue-fine-charge-form.html",
})
export class IssueFineChargeForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  fine = signal<PropertyFineResponseDTO | null>(null);
  submitting = signal(false);

  form = new FormGroup({
    dueDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.fine.set(this.config.data.fine);
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint:
        Endpoints.AccountingCoi.NativeCollection.PropertyFines.issueCharge,
      id: "",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (): IssueFineChargeDTO => ({
        fineId: this.fine()!.id,
        dueDate: this.form.controls.dueDate.value,
      }),
    });
  }
}

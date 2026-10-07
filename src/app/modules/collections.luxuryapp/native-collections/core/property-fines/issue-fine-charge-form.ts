import { CurrencyPipe } from "@angular/common";
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
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputDateSignal } from "@ui/inputs/web/lux-input-date-signal";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import {
  IssueFineChargeDTO,
  PropertyFineResponseDTO,
} from "../../interfaces/property-fine.dto";

@Component({
  selector: "app-issue-fine-charge-form",
  imports: [
    ReactiveFormsModule,
    LuxInputDateSignal,
    ButtonWeb,
    CurrencyPipe,
    ApiDatePipe,
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
      endpoint: Endpoints.CobranzaCore.PropertyFines.issueCharge,
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

import { Component, inject, OnInit, signal } from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { IssueFineChargeDTO, PropertyFineResponseDTO } from "../../models/property-fine.dto";

@Component({
  selector: "app-issue-fine-charge-form",
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomButtonSave,
    CurrencyPipe,
    DatePipe,
  ],
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

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    try {
      const payload: IssueFineChargeDTO = {
        fineId: this.fine()!.id,
        dueDate: this.form.controls.dueDate.value,
      };
      const res = await this.apiResponseS.onPost(
        Endpoints.AccountingCoi.NativeCollection.PropertyFines.issueCharge,
        payload,
      );
      if (res) this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }
}

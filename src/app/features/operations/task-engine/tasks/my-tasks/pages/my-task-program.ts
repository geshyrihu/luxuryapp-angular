import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";
@Component({
  selector: "app-my-task-program",
  templateUrl: "./my-task-program.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputDateSignal,
    WebButtonLabelSave,
  ],
})
export class MyTaskProgram implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private formB = inject(FormBuilder);
  private dateS = inject(DateService);
  // private customerIdS = inject(CustomerIdService); // Unused
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  id: string = this.config.data.id;
  submitting = signal(false);

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    scheduledDate: [new Date(), Validators.required],
    assigneeId: ["", Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
  });

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.programation(this.id))
      .then((result: any) => {
        this.form.patchValue({
          assigneeId: result.assigneeId || "", // Ensure string if null
          scheduledDate: result.scheduledDate
            ? (this.dateS.parseDate(result.scheduledDate) ?? new Date())
            : new Date(),
        });
      });
  }
  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    const formValue = this.form.getRawValue();
    const payload = {
      ...formValue,
      scheduledDate: this.dateS.getDateFormat(formValue.scheduledDate),
    };

    this.apiResponseS
      .onPost(Endpoints.Tasks.myTicketProgramation(this.id), payload)
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}

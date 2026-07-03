import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

interface IITaskMessageDTOReopenForm {
  applicationUserId: FormControl<string>;
  ticketMessageId: FormControl<string>;
  description: FormControl<string>;
  userCreateId: FormControl<string>;
}

@Component({
  selector: "app-task-reopen",
  templateUrl: "./task-reopen.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class TaskReopen implements OnInit {
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);

  form: FormGroup<IITaskMessageDTOReopenForm> = this.formB.group({
    applicationUserId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    ticketMessageId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    userCreateId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.form.patchValue({
      applicationUserId: this.authS.applicationUserId,
      ticketMessageId: this.config.data.id,
      userCreateId: this.authS.applicationUserId,
    });
  }

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Tasks.reopen,
      id: null,
      ref: this.ref,
      submitting: this.submitting,
    };
    FormHelper.submitCrud(options);
  }
}

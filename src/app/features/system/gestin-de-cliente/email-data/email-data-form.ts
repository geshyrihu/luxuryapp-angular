import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { WebButtonLabelSendEmail } from "src/app/core/components/buttons/web-label/button-send-email";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { IEmailDataForm } from "src/app/core/interfaces/email-data-form.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-email-data-form",
  templateUrl: "./email-data-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    WebButtonLabelSendEmail,
    CustomInputTextSignal,
    WebButtonLabelSave,
  ],
})
export class EmailDataForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  applicationUserId: string = "";
  testEmailMessage = signal<string>("");
  submitting = signal(false);
  public AspRole = EApplicationRole;

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    applicationUserId: new FormControl<string>(
      this.config.data.applicationUserId,
    ),
    applicationUser: new FormControl<string>(this.config.data.applicationUser),
    port: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    smtp: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id || "";
    if (this.id !== "") {
      this.form.patchValue({ id: this.id });
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<IEmailDataForm>(Endpoints.EmailData.getById(this.id))
      .then((result: any) => {
        if (result !== null) {
          this.form.patchValue(result);
          this.id = result.id;
        }
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.EmailData.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  TestEmail(): void {
    this.submitting.set(true);
    this.apiResponseS
      .onPost(Endpoints.EmailData.sendTestEmail(this.id), null)
      .then((result: any) => {
        this.testEmailMessage.set(result.message);
        this.submitting.set(false);
      });
  }
}

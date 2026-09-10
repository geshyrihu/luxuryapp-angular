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
import { WebButtonLabelSendEmail } from "@ui/buttons/web-label/button-send-email";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EmailDataFormDto, TestEmailResponse } from "src/app/core/interfaces/email-data-form.interface";
@Component({
  selector: "app-email-data-form",
  templateUrl: "./email-data-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
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
  public AspRole = ApplicationRole;

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
      .onGetList<EmailDataFormDto>(Endpoints.Catalogs.EmailData.getById(this.id))
      .then((result) => {
        if (result !== null) {
          this.form.patchValue({ ...result, port: String(result.port) });
          this.id = result.id;
        }
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id
        ? Endpoints.Catalogs.EmailData.update(this.id)
        : Endpoints.Catalogs.EmailData.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  TestEmail(): void {
    this.submitting.set(true);
    this.apiResponseS
      .onPost<TestEmailResponse>(Endpoints.Catalogs.EmailData.sendTestEmail(this.id), null)
      .then((result) => {
        if (result) this.testEmailMessage.set(result.message);
        this.submitting.set(false);
      });
  }
}

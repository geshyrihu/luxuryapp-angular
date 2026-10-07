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
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  EmailDataFormDto,
  TestEmailResponse,
} from "@core/interfaces/email-data-form.interface";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
@Component({
  selector: "app-email-data-form",
  templateUrl: "./email-data-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxInputTextSignal, ButtonWeb],
})
export class EmailDataForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  swalS = inject(SwalService);

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
      .onGetList<EmailDataFormDto>(
        Endpoints.Catalogs.EmailData.getById(this.id),
      )
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

  async TestEmail(): Promise<void> {
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "Deseas enviar el correo electronico ahora?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
    this.submitting.set(true);
    this.apiResponseS
      .onPost<TestEmailResponse>(
        Endpoints.Catalogs.EmailData.sendTestEmail(this.id),
        null,
      )
      .then((result) => {
        if (result) this.testEmailMessage.set(result.message);
        this.submitting.set(false);
      });
  }
}

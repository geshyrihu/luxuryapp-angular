import { Component, HostListener, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputPassword } from "src/app/core/components/inputs/web/custom-input-password-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CredentialDetailDTO } from "../models/password.dto";

/**
 * Formulario para crear o editar credenciales.
 * La plataforma se ingresa como texto libre.
 */
interface ICredentialForm {
  platformName: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  subscriptionExpirationDate: FormControl<string | null>;
}

@Component({
  selector: "app-password-form",
  templateUrl: "./password-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputPassword,
    CustomInputDateSignal,
    CustomButtonSave,
    CustomButtonSave,
  ],
})
export class PasswordForm implements OnInit {
  apiS = inject(ApiResponseService);
  fb = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string | null = null;
  submitting = signal(false);
  isMobile = signal(window.innerWidth <= 768);

  @HostListener("window:resize")
  onResize() {
    this.isMobile.set(window.innerWidth <= 768);
  }

  form: FormGroup<ICredentialForm> = this.fb.group({
    platformName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    username: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    subscriptionExpirationDate: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.loadData();
  }

  async loadData() {
    const res = await this.apiS.onGetItem<CredentialDetailDTO>(
      Endpoints.PasswordManager.Credentials.getById(this.id!),
    );
    if (res) {
      this.form.patchValue({
        platformName: res.platformName,
        username: res.username,
        password: res.password,
        subscriptionExpirationDate: res.subscriptionExpirationDate,
      });
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: "password-manager/credentials",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}

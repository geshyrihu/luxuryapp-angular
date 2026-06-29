import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-vault-secret-form",
  templateUrl: "./vault-secret-form.html",
  imports: [
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSelectSignal,
  ],
})
export class VaultSecretForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  isEditMode = signal(false);

  readonly secretTypeOptions = [
    { label: "API Key", value: "API_KEY" },
    { label: "JWT Key", value: "JWT_KEY" },
    { label: "SMTP Password", value: "SMTP_PASSWORD" },
    { label: "API Password", value: "API_PASSWORD" },
    { label: "Private Key", value: "PRIVATE_KEY" },
    { label: "OAuth Secret", value: "OAUTH_SECRET" },
    { label: "OAuth Token", value: "OAUTH_TOKEN" },
    { label: "DB Connection", value: "DB_CONNECTION" },
  ];

  form = new FormGroup({
    secretName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    secretType: new FormControl<string>("API_KEY", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    plainValue: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tenantId: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    const data = this.config.data;
    if (data?.secretName) {
      this.isEditMode.set(true);
      this.form.controls.secretName.setValue(data.secretName);
      this.form.controls.secretName.disable();
      this.form.controls.secretType.setValue(data.secretType ?? "API_KEY");
      this.form.controls.secretType.disable();
    }
  }

  onSubmit(): void {
    if (this.isEditMode()) {
      this.submitting.set(true);
      const secretName = this.config.data.secretName as string;
      const payload = { plainValue: this.form.controls.plainValue.value };
      this.apiResponseS
        .onPut(Endpoints.VaultSecrets.update(secretName), payload)
        .then((result) => {
          this.submitting.set(false);
          if (result !== false) this.ref.close(true);
        });
    } else {
      FormHelper.submitCrud({
        form: this.form,
        api: this.apiResponseS,
        endpoint: Endpoints.VaultSecrets.store,
        id: "",
        ref: this.ref,
        submitting: this.submitting,
      });
    }
  }
}

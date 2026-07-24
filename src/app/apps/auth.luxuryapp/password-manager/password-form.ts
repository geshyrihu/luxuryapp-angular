import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputPassword } from "@ui/inputs/web/custom-input-password-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CredentialDetailDto } from "./interfaces/credential-detail.dto";
import { CredentialFormGroup } from "./interfaces/password-form.interface";

/**
 * Formulario para crear o editar credenciales de servicios operativos.
 * Solo credenciales de trabajo, no personales.
 */

@Component({
  selector: "app-password-form",
  templateUrl: "./password-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputPassword,
    CustomInputDateSignal,
    WebButtonLabelSave,
    AppIcon,
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

  form: FormGroup<CredentialFormGroup> = this.fb.group({
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
    const res = await this.apiS.onGetItem<CredentialDetailDto>(
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
      transformPayload: (value) => ({
        ...value,
        subscriptionExpirationDate: this.toIsoDate(
          value.subscriptionExpirationDate,
        ),
      }),
    });
  }

  private toIsoDate(value: any): string | null {
    if (!value) return null;
    if (value instanceof Date && !isNaN(value.getTime())) {
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, "0");
      const d = String(value.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    if (typeof value === "string") {
      const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) return isoMatch[0];
      const locMatch = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (locMatch) {
        const [, day, month, year] = locMatch;
        return `${year}-${month}-${day}`;
      }
    }
    return null;
  }
}

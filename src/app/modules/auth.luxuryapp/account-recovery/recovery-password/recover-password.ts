import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
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
import { RouterModule } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DataConnectorService } from "@core/services/data-connector.service";
import { SwalService } from "@core/services/swal.service";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { catchError, finalize, Subject, throwError } from "rxjs";
import { ROUTES } from "src/app/routing/route-paths";
import { RECOVERY_BY_CODE_ENABLED } from "../recovery-code/feature-flag";

interface IRecoverPasswordForm {
  email: FormControl<string>;
}

@Component({
  selector: "app-recover-password",
  templateUrl: "./recover-password.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LuxInputTextSignal,
    ButtonWeb,
    RouterModule,
    LxIcon,
  ],
})
export class RecoverPassword implements OnInit, OnDestroy {
  readonly ROUTES = ROUTES;
  /** Feature flag del flujo por código (rollback: plan §10 Fase 4). */
  readonly recoveryByCodeEnabled = RECOVERY_BY_CODE_ENABLED;
  apiResponseS = inject(ApiResponseService);
  dataConnectorS = inject(DataConnectorService);
  formB = inject(FormBuilder);

  form: FormGroup<IRecoverPasswordForm> = this.formB.group({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  errorMessage = signal<string>("");
  successMessage = signal<string>("");
  submitting = signal(false);
  countdown = signal<number>(0);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.apiResponseS.validateForm(this.form);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set("");
    this.successMessage.set("");

    SwalService.show({
      title: "Procesando...",
      text: "Por favor, espera.",
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        SwalService.openLoadingIndicator();
      },
    });

    const urlApi = Endpoints.Auth.recoverPassword;
    const body = this.form.value;

    this.dataConnectorS
      .post(urlApi, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg =
            error.error?.error?.message ||
            error.error?.message ||
            "Ocurrió un error inesperado";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => {
          SwalService.closeDialog();
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response: any) => {
          const msg =
            response.body?.data?.message ||
            response.body?.message ||
            "Si el correo existe, recibirás instrucciones.";
          this.successMessage.set(msg);
          this.startCountdown();
        },
      });
  }

  startCountdown() {
    this.countdown.set(30);
    const interval = setInterval(() => {
      const current = this.countdown();
      if (current > 0) {
        this.countdown.set(current - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}

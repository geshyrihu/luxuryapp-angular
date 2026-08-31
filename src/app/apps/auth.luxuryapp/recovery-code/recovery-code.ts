import { animate, style, transition, trigger } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { catchError, finalize, throwError } from "rxjs";
import { LoginSliderService } from "src/app/core/auth/services/login-slider.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import Swal from "sweetalert2";
import {
  IValidateRecoveryCodeResponse,
} from "./interfaces/validate-recovery-code.interface";

/** Minutos de validez del código (RN-CRED-003): countdown de la pantalla. */
const CODE_COUNTDOWN_SECONDS = 120;

interface IIdentifierForm {
  identifier: FormControl<string>;
}

interface ICodeForm {
  code: FormControl<string>;
}

@Component({
  selector: "app-recovery-code",
  templateUrl: "./recovery-code.html",
  animations: [
    trigger("slideAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("1500ms ease-in-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        animate("1500ms ease-in-out", style({ opacity: 0 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    WebButtonLabel,
    RouterModule,
    AppIcon,
  ],
})
export class RecoveryCode {
  readonly ROUTES = ROUTES;
  apiResponseS = inject(ApiResponseService);
  dataConnectorS = inject(DataConnectorService);
  formB = inject(FormBuilder);
  sliderService = inject(LoginSliderService);
  private router = inject(Router);

  /** Paso del flujo: identificador → código (RN-CRED-010). */
  step = signal<"identifier" | "code">("identifier");
  identifier = signal("");
  errorMessage = signal("");
  submitting = signal(false);
  countdown = signal(0);
  private countdownInterval?: ReturnType<typeof setInterval>;

  visibleImages = toSignal(this.sliderService.getVisibleImages$(), {
    initialValue: [],
  });

  formIdentifier: FormGroup<IIdentifierForm> = this.formB.group({
    identifier: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  formCode: FormGroup<ICodeForm> = this.formB.group({
    code: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
    }),
  });

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  onInitiate() {
    if (this.formIdentifier.invalid) {
      this.apiResponseS.validateForm(this.formIdentifier);
      return;
    }

    const identifierValue = this.formIdentifier.controls.identifier.value.trim();
    this.submitting.set(true);
    this.errorMessage.set("");

    this.dataConnectorS
      .post(
        Endpoints.Auth.recoverAccount.initiateByCode,
        { identifier: identifierValue },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg =
            error.error?.message || "Ocurrió un error inesperado.";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => {
          // 200 solo cuando el usuario existe, está activo y el código ya se envió.
          this.identifier.set(identifierValue);
          this.step.set("code");
          this.startCountdown();
        },
      });
  }

  onValidate() {
    if (this.formCode.invalid) {
      this.apiResponseS.validateForm(this.formCode);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set("");

    Swal.fire({
      title: "Procesando...",
      text: "Verificando tu código...",
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.dataConnectorS
      .post<IValidateRecoveryCodeResponse>(
        Endpoints.Auth.recoverAccount.validateCode,
        {
          identifier: this.identifier(),
          code: this.formCode.controls.code.value.trim(),
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg =
            error.error?.message || "Código inválido o expirado.";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => {
          Swal.close();
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response: any) => {
          const data =
            response.body?.data ?? response.body ?? ({} as IValidateRecoveryCodeResponse);
          // El token viaja en el state de navegación; nunca en query params.
          this.router.navigate(ROUTES.AUTH.RESET_PASSWORD, {
            state: { email: data.email, token: data.token },
          });
        },
      });
  }

  onResend() {
    if (this.countdown() > 0) return;
    this.formCode.controls.code.reset();
    this.onInitiateResend();
  }

  private onInitiateResend() {
    this.submitting.set(true);
    this.errorMessage.set("");

    this.dataConnectorS
      .post(Endpoints.Auth.recoverAccount.initiateByCode, {
        identifier: this.identifier(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg =
            error.error?.message || "Ocurrió un error inesperado.";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => this.startCountdown(),
      });
  }

  goBackToIdentifier() {
    this.step.set("identifier");
    this.errorMessage.set("");
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  private startCountdown() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdown.set(CODE_COUNTDOWN_SECONDS);
    this.countdownInterval = setInterval(() => {
      const current = this.countdown();
      if (current > 0) {
        this.countdown.set(current - 1);
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }
}

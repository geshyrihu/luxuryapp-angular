import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
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
import { Router } from "@angular/router";
import { catchError, finalize, throwError } from "rxjs";
import { ROUTES } from "src/app/routing/route-paths";
import { MobileButtonLabel } from "@ui/buttons/mobile-label/button";
import { IonInputText } from "@ui/inputs/mobile/ion-input-text";
import { MobilePage } from "@ui/mobile/page/page";
import { LoginSliderService } from "src/app/core/auth/services/login-slider.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { DataConnectorService } from "src/app/core/services/data-connector.service";

/** Minutos de validez del código (RN-CRED-003): countdown de la pantalla. */
const CODE_COUNTDOWN_SECONDS = 120;

interface IIdentifierForm {
  identifier: FormControl<string>;
}

interface ICodeForm {
  code: FormControl<string>;
}

@Component({
  selector: "app-recovery-code-mobile",
  imports: [
    ReactiveFormsModule,
    MobilePage,
    MobileButtonLabel,
    IonInputText,
  ],
  template: `
    <ili-page background="var(--ds-primary)">
      <div class="lm-bg">
        @for (image of sliderImages(); track image) {
          <div
            class="absolute top-0 left-0 w-full h-full"
            [style.background-image]="'url(' + image + ')'"
            style="background-size: cover; background-position: center; opacity: 0.9;"
          ></div>
        }
        <div class="lm-overlay"></div>
      </div>

      <div class="lm-container">
        <div
          class="lm-header flex-1 flex flex-column align-items-center justify-content-center fadein animation-duration-1000"
        >
          <img
            src="assets/oficial/Logo%20Files/png/White%20logo%20-%20no%20background.png"
            alt="Logo Luxury Building Group"
            class="lm-logo drop-shadow-lg"
          />
        </div>

        <div class="lm-card shadow-lg fadeinup animation-duration-500">
          @if (step() === "identifier") {
            <h2 class="lm-title">Recuperar Contraseña</h2>
            <p class="lm-subtitle mb-4">
              Ingresa tu correo o teléfono y te enviaremos un código de verificación.
            </p>

            <form [formGroup]="formIdentifier" (ngSubmit)="onInitiate()" class="lm-form">
              <ion-input-text
                [control]="formIdentifier.controls.identifier"
                label="Correo o Teléfono"
                placeholder="ejemplo@correo.com"
              />

              @if (errorMessage()) {
                <div
                  class="p-3 rounded border-1 border-red-300 bg-red-50 text-red-800 shadow-sm mt-2 flex align-items-center"
                >
                  <span class="text-sm font-medium">{{ errorMessage() }}</span>
                </div>
              }

              <div class="lm-btn-wrapper mt-4">
                <ili-button
                  expand="block"
                  type="submit"
                  label="Enviar Código"
                  [disabled]="formIdentifier.invalid || submitting()"
                  [loading]="submitting()"
                />
              </div>
            </form>
          } @else {
            <h2 class="lm-title">Código de Verificación</h2>
            <p class="lm-subtitle mb-4">
              Ingresa el código de 6 dígitos. Expira en {{ countdown() }}s.
            </p>

            <form [formGroup]="formCode" (ngSubmit)="onValidate()" class="lm-form">
              <ion-input-text
                [control]="formCode.controls.code"
                label="Código de 6 dígitos"
                placeholder="000000"
                maxlength="6"
              />

              @if (errorMessage()) {
                <div
                  class="p-3 rounded border-1 border-red-300 bg-red-50 text-red-800 shadow-sm mt-2 flex align-items-center"
                >
                  <span class="text-sm font-medium">{{ errorMessage() }}</span>
                </div>
              }

              <div class="lm-btn-wrapper mt-4">
                <ili-button
                  expand="block"
                  type="submit"
                  label="Verificar Código"
                  [disabled]="formCode.invalid || submitting()"
                  [loading]="submitting()"
                />
              </div>

              <div class="lm-links mt-2">
                @if (countdown() === 0) {
                  <a (click)="onResend()" class="lm-link">Reenviar código</a>
                }
                <a (click)="goBackToIdentifier()" class="lm-link">
                  Cambiar dato de contacto
                </a>
              </div>
            </form>
          }

          <div class="lm-links mt-4">
            <a (click)="goBack()" class="lm-link">Volver al Login</a>
          </div>
        </div>
      </div>
    </ili-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }

      .lm-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--ds-primary);
        overflow: hidden;
      }

      .lm-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          180deg,
          rgba(27, 54, 93, 0.4) 0%,
          rgba(27, 54, 93, 1) 100%
        );
      }

      .lm-container {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        z-index: 10;
      }

      .lm-header {
        padding-top: 3rem;
        padding-bottom: 2rem;
      }

      .lm-logo {
        width: 180px;
        height: auto;
      }

      .lm-card {
        background: var(--ds-surface-bright);
        border-top-left-radius: 2rem;
        border-top-right-radius: 2rem;
        padding: 2.5rem 1.5rem 3.5rem 1.5rem;
        flex-shrink: 0;
      }

      .lm-title {
        color: var(--ds-primary);
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0 0 0.5rem;
        letter-spacing: -0.5px;
      }

      .lm-subtitle {
        color: var(--ds-on-surface-variant);
        font-size: 1rem;
        margin: 0;
      }

      .lm-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .lm-btn-wrapper ::ng-deep ion-button {
        --background: var(--ds-secondary);
        --background-activated: var(--ds-secondary-hover);
        --color: var(--ds-on-secondary);
        --box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        height: 54px;
        font-weight: 700;
        font-size: 1.1rem;
        letter-spacing: 0.5px;
      }

      .lm-links {
        text-align: center;
      }

      .lm-link {
        color: var(--ds-primary);
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
      }
    `,
  ],
})
export class RecoveryCodeMobile implements OnDestroy {
  private fb = inject(FormBuilder);
  private dataConnectorS = inject(DataConnectorService);
  private router = inject(Router);
  private loginSliderService = inject(LoginSliderService);

  readonly sliderImages = toSignal(this.loginSliderService.getVisibleImages$(), {
    initialValue: [],
  });

  step = signal<"identifier" | "code">("identifier");
  identifier = signal("");
  submitting = signal(false);
  errorMessage = signal("");
  countdown = signal(0);
  private countdownInterval?: ReturnType<typeof setInterval>;

  formIdentifier: FormGroup<IIdentifierForm> = this.fb.group({
    identifier: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  formCode: FormGroup<ICodeForm> = this.fb.group({
    code: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
    }),
  });

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  onInitiate(): void {
    if (this.formIdentifier.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.errorMessage.set("");

    this.dataConnectorS
      .post(Endpoints.Auth.recoverAccount.initiateByCode, {
        identifier: this.formIdentifier.controls.identifier.value.trim(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg = error.error?.message || "Ocurrió un error inesperado.";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => {
          // Respuesta genérica anti-enumeración: se avanza igual (RN-CRED-021).
          this.identifier.set(this.formIdentifier.controls.identifier.value.trim());
          this.step.set("code");
          this.startCountdown();
        },
      });
  }

  onValidate(): void {
    if (this.formCode.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.errorMessage.set("");

    this.dataConnectorS
      .post(Endpoints.Auth.recoverAccount.validateCode, {
        identifier: this.identifier(),
        code: this.formCode.controls.code.value.trim(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg = error.error?.message || "Código inválido o expirado.";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          const data = response.body?.data ?? response.body ?? {};
          // El token viaja en el state de navegación; nunca en query params.
          this.router.navigate(ROUTES.AUTH.RESET_PASSWORD, {
            state: { email: data.email, token: data.token },
          });
        },
      });
  }

  onResend(): void {
    if (this.countdown() > 0 || this.submitting()) return;
    this.formCode.controls.code.reset();
    this.onInitiate();
  }

  goBackToIdentifier(): void {
    this.step.set("identifier");
    this.errorMessage.set("");
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  goBack(): void {
    this.router.navigate(ROUTES.AUTH.LOGIN);
  }

  private startCountdown(): void {
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

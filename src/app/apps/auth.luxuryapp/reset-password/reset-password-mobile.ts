import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MobileButtonLabel } from "@ui/buttons/mobile-label/button";
import { IonInputPassword } from "@ui/inputs/mobile/ion-input-password";
import { MobilePage } from "@ui/mobile/page/page";
import { catchError, finalize, throwError } from "rxjs";
import { LoginSliderService } from "src/app/core/auth/services/login-slider.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { ROUTES } from "src/app/routing/route-paths";

@Component({
  selector: "app-reset-password-mobile",
  imports: [
    ReactiveFormsModule,
    MobilePage,
    MobileButtonLabel,
    IonInputPassword,
  ],
  template: `
    <ili-page background="var(--ds-primary)">
        <!-- Fondo Premium -->
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
          <!-- Logo Header -->
          <div
            class="lm-header flex-1 flex flex-column align-items-center justify-content-center fadein animation-duration-1000"
          >
            <img
              src="assets/oficial/Logo%20Files/png/White%20logo%20-%20no%20background.png"
              alt="Logo Luxury Building Group"
              class="lm-logo drop-shadow-lg"
            />
          </div>

          <!-- Bottom Sheet Card -->
          <div class="lm-card shadow-lg fadeinup animation-duration-500">
            <h2 class="lm-title">Restablecer Contraseña</h2>
            <p class="lm-subtitle mb-4">
              Ingresa tu nueva contraseña para continuar.
            </p>

            <form
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="lm-form"
            >
              <ion-input-password
                [control]="form.controls['newPassword']"
                label="Nueva Contraseña"
                placeholder="••••••••"
              />

              <ion-input-password
                [control]="form.controls['confirmPassword']"
                label="Confirmar Contraseña"
                placeholder="••••••••"
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
                  label="Cambiar Contraseña"
                  [disabled]="form.invalid || submitting() || !isValidLink()"
                  [loading]="submitting()"
                />
              </div>

              <div class="lm-links mt-4">
                <a (click)="goBack()" class="lm-link"> Volver al Login </a>
              </div>
            </form>
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
        background: var(--ds-surface-bright, #ffffff);
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

      .lm-form ::ng-deep ion-input {
        background-color: var(--ds-surface) !important;
        border: 1px solid var(--ds-outline-variant) !important;
        --background: var(--ds-surface) !important;
        --color: var(--ds-on-surface) !important;
        --padding-start: 1rem !important;
        --padding-end: 1rem !important;
      }
      .lm-form ::ng-deep ion-input.ion-focused {
        border-color: var(--ds-primary) !important;
        box-shadow: 0 0 0 3px
          color-mix(in srgb, var(--ds-primary), transparent 85%) !important;
      }
      .lm-form ::ng-deep .field-label {
        color: var(--ds-on-surface-variant);
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
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
        text-decoration: underline;
      }
    `,
  ],
})
export class ResetPasswordMobile implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataConnectorS = inject(DataConnectorService);
  private loginSliderService = inject(LoginSliderService);

  readonly sliderImages = toSignal(
    this.loginSliderService.getVisibleImages$(),
    {
      initialValue: [],
    },
  );

  token = signal("");
  email = signal("");
  submitting = signal(false);
  errorMessage = signal("");
  isValidLink = signal(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group(
      {
        newPassword: [
          "",
          [
            Validators.required,
            // RN-CRED-032: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número.
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit() {
    // El token llega por query params (flujo solo-link) o por navigation state
    // (flujo por código); nunca se exponde en la URL cuando viene del código.
    const stateToken = history.state?.token || "";
    const stateEmail = history.state?.email || "";
    this.token.set(this.route.snapshot.queryParamMap.get("token") || stateToken);
    this.email.set(this.route.snapshot.queryParamMap.get("email") || stateEmail);

    if (!this.token() || !this.email()) {
      this.isValidLink.set(false);
      this.errorMessage.set("Enlace inválido o expirado.");
    } else {
      this.isValidLink.set(true);
    }
  }

  goBack() {
    this.router.navigate(ROUTES.AUTH.LOGIN);
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get("newPassword")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid || this.submitting() || !this.isValidLink()) return;

    this.submitting.set(true);
    this.errorMessage.set("");

    const body = {
      email: this.email(),
      token: this.token(),
      newPassword: this.form.value.newPassword,
    };

    this.dataConnectorS
      .post("Auth/ConfirmRecoverPassword", body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg =
            error.error?.message || "Error al restablecer contraseña.";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => {
          this.router.navigate(ROUTES.AUTH.LOGIN);
        },
      });
  }
}

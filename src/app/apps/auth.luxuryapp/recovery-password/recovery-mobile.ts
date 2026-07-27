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
  FormBuilder,
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
import { DataConnectorService } from "src/app/core/services/data-connector.service";

@Component({
  selector: "app-recovery-mobile",
  imports: [
    ReactiveFormsModule,
    MobilePage,
    MobileButtonLabel,
    IonInputText,
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
              src="assets/images/login/LBG-blanco.png"
              alt="Logo Luxury Building Group"
              class="lm-logo drop-shadow-lg"
            />
          </div>

          <!-- Bottom Sheet Card -->
          <div class="lm-card shadow-lg fadeinup animation-duration-500">
            <h2 class="lm-title">Recuperar Contraseña</h2>
            <p class="lm-subtitle mb-4">
              Ingresa tu correo electrónico y te enviaremos instrucciones.
            </p>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="lm-form">
              <ion-input-text
                [control]="form.controls['email']"
                label="Correo Electrónico"
                placeholder="ejemplo@correo.com"
              />

              @if (errorMessage) {
                <div
                  class="p-3 rounded border-1 border-red-300 bg-red-50 text-red-800 shadow-sm mt-2 flex align-items-center"
                >
                  <span class="text-sm font-medium">{{ errorMessage }}</span>
                </div>
              }

              @if (successMessage) {
                <div
                  class="p-3 rounded border-1 border-green-300 bg-green-50 text-green-800 shadow-sm mt-2 flex align-items-center"
                >
                  <span class="text-sm font-medium">{{ successMessage }}</span>
                </div>
              }

              <div class="lm-btn-wrapper mt-4">
                <ili-button
                  expand="block"
                  type="submit"
                  [disabled]="form.invalid || submitting() || countdown > 0"
                  [loading]="submitting()"
                  [label]="
                    countdown > 0
                      ? 'Reintentar en ' + countdown + 's'
                      : 'Enviar Instrucciones'
                  "
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

      .lm-glow-1 {
        position: absolute;
        top: -10%;
        left: -20%;
        width: 300px;
        height: 300px;
        background: radial-gradient(
          circle,
          var(--ds-secondary) 0%,
          transparent 70%
        );
        opacity: 0.15;
        filter: blur(50px);
      }

      .lm-glow-2 {
        position: absolute;
        bottom: 20%;
        right: -20%;
        width: 250px;
        height: 250px;
        background: radial-gradient(
          circle,
          var(--ds-tertiary) 0%,
          transparent 70%
        );
        opacity: 0.15;
        filter: blur(40px);
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
        text-decoration: none;
      }
    `,
  ],
})
export class RecoveryMobile implements OnInit {
  private fb = inject(FormBuilder);
  private dataConnectorS = inject(DataConnectorService);
  private router = inject(Router);
  private loginSliderService = inject(LoginSliderService);

  readonly sliderImages = toSignal(
    this.loginSliderService.getVisibleImages$(),
    {
      initialValue: [],
    },
  );
  form: FormGroup;
  submitting = signal(false);
  errorMessage = "";
  successMessage = "";
  countdown = 0;

  constructor() {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  goBack() {
    this.router.navigate(ROUTES.AUTH.LOGIN);
  }

  onSubmit() {
    if (this.form.invalid || this.countdown > 0) return;

    this.submitting.set(true);
    this.errorMessage = "";
    this.successMessage = "";

    const urlApi = "Auth/RecoverPassword";
    const body = this.form.value;

    this.dataConnectorS
      .post(urlApi, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.message || "Ocurrió un error inesperado";
          return throwError(() => new Error(this.errorMessage));
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage =
            response.body?.message ||
            "Si el correo existe, recibirás instrucciones.";
          this.startCountdown();
        },
      });
  }

  startCountdown() {
    this.countdown = 30;
    const interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}

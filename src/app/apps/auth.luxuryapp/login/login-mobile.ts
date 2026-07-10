import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  IonApp,
  IonButton,
  IonContent,
  IonSpinner,
} from "@ionic/angular/standalone";
import { IonInputPassword } from "@ui/inputs/mobile/ion-input-password";
import { IonInputText } from "@ui/inputs/mobile/ion-input-text";
import { catchError, finalize, of, startWith, switchMap } from "rxjs";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { LoginSliderService } from "src/app/core/auth/services/login-slider.service";
import { SecurityService } from "src/app/core/auth/services/security.service";
import { UserTokenDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { ROUTES } from "src/app/routing/route-paths";

@Component({
  selector: "app-login-mobile",
  imports: [
    ReactiveFormsModule,
    IonApp,
    IonContent,
    IonInputText,
    IonInputPassword,
    IonButton,
    IonSpinner,
  ],
  template: `
    <ion-app>
      <ion-content fullscreen>
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
          <div class="lm-card shadow-8 fadeinup animation-duration-500">
            <h2 class="lm-title">Bienvenido</h2>
            <p class="lm-subtitle">Ingresa a tu cuenta</p>

            <form
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
              class="lm-form mt-4"
            >
              <ion-input-text
                [control]="loginForm.controls['userName']"
                label="Usuario"
                placeholder="Ej: jperez"
              />

              <ion-input-password
                [control]="loginForm.controls['password']"
                label="Contraseña"
                placeholder="••••••••"
              />

              @if (errorMessage()) {
                <div
                  class="p-3 border-round border-1 border-red-300 bg-red-50 text-red-800 shadow-1 mt-2 flex align-items-center"
                >
                  <span class="text-sm font-medium">{{ errorMessage() }}</span>
                </div>
              }

              <div class="lm-btn-wrapper mt-4">
                <ion-button
                  type="submit"
                  expand="block"
                  [disabled]="isSubmitDisabled()"
                >
                  @if (loading()) {
                    <ion-spinner name="crescent"></ion-spinner>
                  } @else {
                    INICIAR SESIÓN
                  }
                </ion-button>
              </div>

              <div class="lm-links mt-4">
                <a (click)="goToRecovery()" class="lm-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>
          </div>
        </div>
      </ion-content>
    </ion-app>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }

      ion-content {
        --background: var(--ds-primary);
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

      /* Subtle ambient glows for a premium feel */
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

      /* Clean inputs for the white card */
      .lm-form ::ng-deep ion-input {
        background-color: var(--ds-surface) !important;
        border: 1px solid var(--ds-outline-variant) !important;
        /* Shadow DOM */
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

      /* Premium Button: Gold on Dark Navy */
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
export class LoginMobile implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private securityS = inject(SecurityService);
  private authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);
  private loaderService = inject(LoaderService);
  private consoleLogger = inject(ConsoleLoggerService);
  private destroyRef = inject(DestroyRef);
  public aspRoleS = inject(AspRoleService);
  private loginSliderService = inject(LoginSliderService);

  readonly sliderImages = toSignal(
    this.loginSliderService.getVisibleImages$(),
    {
      initialValue: [],
    },
  );

  readonly loading = signal(false);
  readonly errorMessage = signal("");

  loginForm: FormGroup = this.formBuilder.group({
    userName: ["", [Validators.required]],
    password: ["", [Validators.required]],
    rememberMe: [false],
  });

  private readonly formStatus = toSignal(
    this.loginForm.statusChanges.pipe(startWith(this.loginForm.status)),
    { initialValue: this.loginForm.status },
  );

  readonly isSubmitDisabled = computed(
    () => this.formStatus() !== "VALID" || this.loading(),
  );

  private preservedRedirectUrl = "/";

  ngOnInit(): void {
    this.preservedRedirectUrl =
      history.state?.returnUrl ||
      new URLSearchParams(window.location.search).get("returnUrl") ||
      "/";
    this.onLoadForm();
    this.securityS.resetAuthData();
    this.loaderService.hide();
  }

  onLoadForm(): void {
    const savedUser = localStorage.getItem("savedUsername");
    const savedPass = localStorage.getItem("savedPassword");
    if (savedUser) {
      this.loginForm.patchValue({
        userName: savedUser,
        ...(savedPass ? { password: savedPass } : {}),
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.loaderService.show();
    this.errorMessage.set("");

    this.authS
      .login(this.loginForm.value)
      .pipe(
        switchMap((userTokenData: UserTokenDTO) => {
          if (userTokenData) {
            return this.customerIdS.initializeCustomerStateAfterLogin(
              userTokenData,
            );
          }
          this.errorMessage.set("No se pudo iniciar la sesion.");
          return of(false);
        }),
        catchError((error) => {
          this.errorMessage.set(this.buildError(error));
          this.consoleLogger.custom("", "#D32F2F", "Error en login:", error);
          return of(false);
        }),
        finalize(() => {
          this.loading.set(false);
          this.loaderService.hide();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (ok: boolean) => {
          if (ok)
            this.router.navigateByUrl(this.preservedRedirectUrl, {
              replaceUrl: true,
            });
        },
      });
  }

  goToRecovery(): void {
    this.router.navigate(ROUTES.AUTH.RECOVERY_PASSWORD);
  }

  private buildError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return "Sin conexion con el servidor.";
      if (error.error?.code === "NoRoles")
        return "Sin permisos. Contacta al administrador.";
      if (typeof error.error?.message === "string") return error.error.message;
    }
    return "Error inesperado al iniciar sesion.";
  }
}

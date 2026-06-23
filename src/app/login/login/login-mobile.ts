import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonApp, IonContent } from "@ionic/angular/standalone";
import { catchError, finalize, of, switchMap } from "rxjs";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputPassword } from "src/app/core/components/inputs/web/custom-input-password-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { UserTokenDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { SecurityService } from "src/app/core/services/security.service";

@Component({
  selector: "app-login-mobile",
  imports: [
    ReactiveFormsModule,
    IonApp,
    IonContent,
    CustomInputTextSignal,
    CustomInputPassword,
    CustomButton,
  ],
  template: `
    <ion-app>
      <ion-content class="ion-padding">
        <div class="lm-container">

          <div class="lm-header">
            <img
              src="assets/images/login/LBG-blanco.png"
              alt="Logo Luxury Building Group"
              class="lm-logo"
            />
            <h2 class="lm-title">Bienvenido</h2>
            <p class="lm-subtitle">Ingresa tus credenciales para continuar.</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="lm-form">

            <custom-input-text-signal
              [control]="loginForm.controls['userName']"
              label="Usuario"
              placeholder="Ej: jperez"
              [horizontal]="false"
              [noMargin]="true"
            />

            <custom-input-password-signal
              [control]="loginForm.controls['password']"
              label="Contrasena"
              placeholder="********"
              [horizontal]="false"
              [noMargin]="true"
              [showStrengthIndicator]="false"
            />

            @if (errorMessage()) {
              <p class="lm-error">{{ errorMessage() }}</p>
            }

            <div class="lm-btn-wrapper">
              <custom-button
                type="submit"
                label="Iniciar Sesion"
                ionicIcon="log-in-outline"
                [fluid]="true"
                [loading]="loading()"
                [disabled]="isSubmitDisabled()"
                [showLabelOnDesktop]="true"
              />
            </div>

            <div class="lm-links">
              <a (click)="goToRecovery()" class="lm-link">
                Olvide mi contrasena
              </a>
            </div>

          </form>
        </div>
      </ion-content>
    </ion-app>
  `,
  styles: [`
    :host { display: block; height: 100vh; width: 100vw; }

    ion-content { --background: linear-gradient(160deg, #0b3164 0%, #051831 100%); }

    .lm-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
      padding: 2rem 1.25rem;
    }

    .lm-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .lm-logo { width: 160px; height: auto; margin-bottom: 1.25rem; }

    .lm-title {
      color: #ffffff;
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
    }

    .lm-subtitle {
      color: rgba(255,255,255,0.65);
      font-size: 0.875rem;
      margin: 0;
    }

    .lm-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Adapt unified inputs to the dark background */
    .lm-form ::ng-deep ion-input {
      /* Host element background — overrides the global white set by _ionic-rn-theme */
      background-color: rgba(255,255,255,0.1) !important;
      border: 1px solid rgba(255,255,255,0.2) !important;
      /* Shadow DOM variables */
      --background: rgba(255,255,255,0.1) !important;
      --color: #ffffff !important;
      --placeholder-color: rgba(255,255,255,0.45) !important;
    }
    .lm-form ::ng-deep ion-input.ion-focused {
      border-color: rgba(255,255,255,0.6) !important;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.15) !important;
    }
    .lm-form ::ng-deep .field-label {
      color: rgba(255,255,255,0.8);
      font-size: 0.82rem;
    }

    /* Button: white on dark background */
    .lm-btn-wrapper {
      margin-top: 0.5rem;
    }
    .lm-btn-wrapper ::ng-deep ion-button {
      --background: #ffffff;
      --background-activated: rgba(255,255,255,0.85);
      --color: #0b3164;
      --border-radius: 12px;
      --box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      height: 50px;
      font-weight: 700;
      font-size: 1rem;
    }

    .lm-error {
      color: #fca5a5;
      font-size: 0.82rem;
      margin: 0;
      padding: 0 0.25rem;
    }

    .lm-links { text-align: center; }

    .lm-link {
      color: rgba(255,255,255,0.65);
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: underline;
    }
  `],
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

  readonly loading = signal(false);
  readonly errorMessage = signal("");

  loginForm: FormGroup = this.formBuilder.group({
    userName: ["", [Validators.required]],
    password: ["", [Validators.required]],
    rememberMe: [false],
  });

  readonly isSubmitDisabled = computed(() => this.loginForm.invalid || this.loading());

  private preservedRedirectUrl = "/";

  ngOnInit(): void {
    this.preservedRedirectUrl =
      history.state?.returnUrl ||
      new URLSearchParams(window.location.search).get("returnUrl") ||
      "/";
    this.onLoadForm();
    this.securityS.resetAuthData();
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
            return this.customerIdS.initializeCustomerStateAfterLogin(userTokenData);
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
          if (ok) this.router.navigateByUrl(this.preservedRedirectUrl, { replaceUrl: true });
        },
      });
  }

  goToRecovery(): void {
    this.router.navigate(["/auth/recovery-password"]);
  }

  private buildError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return "Sin conexion con el servidor.";
      if (error.error?.code === "NoRoles") return "Sin permisos. Contacta al administrador.";
      if (typeof error.error?.message === "string") return error.error.message;
    }
    return "Error inesperado al iniciar sesion.";
  }
}

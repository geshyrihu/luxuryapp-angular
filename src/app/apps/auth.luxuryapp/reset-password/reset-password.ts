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
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputPassword } from "@ui/inputs/web/custom-input-password-signal";
import { MessageModule } from "@ui/web/primeng-message/primeng-message";
import { catchError, finalize, Subject, throwError } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import Swal from "sweetalert2";

interface IResetPasswordForm {
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: "app-reset-password",
  imports: [
    ReactiveFormsModule,
    MessageModule,
    CustomInputPassword,
    WebButtonLabel,
    RouterModule,
    AppIcon,
  ],
  template: `
    <!-- Página de restablecer contraseña — dos paneles claros -->
    <div class="auth-two-panel">
      <!-- Panel izquierdo: formulario -->
      <div class="auth-panel-form">
        <header class="px-4 md:px-6 py-4">
          <img
            src="assets/images/login/LBG-negro.png"
            alt="Logo Luxury Building Group"
            class="h-5rem w-auto"
            width="266"
            height="80"
          />
        </header>

        <main class="flex-1 flex align-items-center px-4 md:px-6 py-6">
          <div class="w-full mx-auto" style="max-width: 400px;">
            <div class="auth-gold-tick mb-4"></div>
            <h2
              class="text-2xl font-bold mb-1 tracking-tight"
              style="color: var(--ds-primary);"
            >
              Restablecer Contraseña
            </h2>
            @if (email()) {
              <p class="text-base m-0 mb-5" style="color: var(--ds-text-secondary);">Para: {{ email() }}</p>
            }

            <form
              class="flex flex-column gap-4"
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
            >
              <div class="p-fluid">
                <custom-input-password-signal
                  [control]="form.controls.newPassword"
                  [horizontal]="false"
                  formControlName="newPassword"
                  id="new-password-global"
                  label="Nueva Contraseña"
                  placeholder="••••••••"
                  [showStrengthIndicator]="true"
                  [noMargin]="true"
                  customClass="h-3rem text-lg"
                />
              </div>

              <div class="p-fluid">
                <custom-input-password-signal
                  [control]="form.controls.confirmPassword"
                  [horizontal]="false"
                  formControlName="confirmPassword"
                  id="confirm-password-global"
                  label="Confirmar Contraseña"
                  placeholder="••••••••"
                  [noMargin]="true"
                  customClass="h-3rem text-lg"
                />
              </div>

              <div class="mt-4">
                <il-button
                  type="submit"
                  label="CAMBIAR CONTRASEÑA"
                  [loading]="submitting()"
                  [disabled]="form.invalid || submitting()"
                  icon="material-symbols-light:lock-reset"
                  [fluid]="true"
                  severity="primary"
                />
              </div>

              <!-- Mensaje Error -->
              @if (errorMessage()) {
                <div class="mt-3 fadein animation-duration-300">
                  <div
                    class="flex align-items-center p-3 rounded border-1 border-red-300 bg-red-50 text-red-800 shadow-sm"
                  >
                    <app-icon
                      icon="material-symbols-light:error-outline"
                      class="text-xl mr-3"
                    />
                    <span class="text-sm font-medium">{{
                      errorMessage()
                    }}</span>
                  </div>
                </div>
              }

              <div class="flex align-items-center justify-content-center mt-2">
                <a
                  [routerLink]="['/auth/login']"
                  class="font-semibold text-sm transition-colors"
                  style="color: var(--ds-text-secondary); text-decoration: none;"
                >
                  Volver al Login
                </a>
              </div>
            </form>
          </div>
        </main>

        <footer class="px-4 md:px-6 py-4 text-sm" style="color: var(--ds-text-secondary);">
          &copy; 2026 Luxury Building Group. Todos los derechos reservados.
        </footer>
      </div>

      <!-- Panel derecho: marca (oculto en pantallas angostas) -->
      <div class="auth-panel-brand">
        <svg class="auth-brand-icon-watermark" viewBox="0 0 512 512" fill="none">
          <rect x="60" y="60" width="392" height="392" rx="8" stroke="#003152" stroke-width="16"/>
          <path d="M150 400 V220 L256 130 L362 220" stroke="#003152" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M160 260 L340 200 M160 300 L340 240 M160 340 L340 280 M160 380 L340 320" stroke="#003152" stroke-width="14" stroke-linecap="round"/>
        </svg>
        <div class="relative text-center px-6" style="max-width: 460px; z-index: 1;">
          <div class="auth-brand-badge mx-auto">
            <app-icon icon="material-symbols-light:apartment" class="text-2xl" style="color: var(--ds-primary);" />
          </div>
          <!-- Slogan provisional: pendiente de definición final del negocio. -->
          <h2 class="text-5xl font-extrabold mb-3" style="color: var(--ds-primary); line-height: 1.15;">
            Excelencia <span style="color: var(--ds-warning);">Inmobiliaria</span>
          </h2>
          <p class="text-base line-height-3" style="color: var(--ds-text-secondary);">
            Gestiona recursos, proyectos y operaciones con la suite tecnológica
            definitiva diseñada para líderes de la industria.
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataConnectorS = inject(DataConnectorService);

  token = signal("");
  email = signal("");
  submitting = signal(false);
  errorMessage = signal("");
  private destroy$ = new Subject<void>();

  form: FormGroup<IResetPasswordForm> = this.fb.group(
    {
      newPassword: new FormControl("", {
        nonNullable: true,
        validators: [
          Validators.required,
          // RN-CRED-032: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número.
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
        ],
      }),
      confirmPassword: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordMatchValidator },
  );

  ngOnInit() {
    // El token llega por query params (flujo solo-link) o por navigation state
    // (flujo por código); nunca se exponde en la URL cuando viene del código.
    const stateToken = history.state?.token || "";
    const stateEmail = history.state?.email || "";
    this.token.set(this.route.snapshot.queryParamMap.get("token") || stateToken);
    this.email.set(this.route.snapshot.queryParamMap.get("email") || stateEmail);

    if (!this.token()) {
      this.errorMessage.set("Enlace inválido o expirado.");
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get("newPassword")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid || !this.token() || !this.email()) {
      if (!this.token() || !this.email())
        this.errorMessage.set("Faltan datos requeridos (token o email).");
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set("");

    Swal.fire({
      title: "Procesando...",
      text: "Actualizando tu contraseña...",
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const body = {
      email: this.email(),
      token: this.token(),
      newPassword: this.form.value.newPassword,
    };

    this.dataConnectorS
      .post(Endpoints.Auth.confirmRecoverPassword, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg =
            error.error?.message || "Error al restablecer contraseña.";
          this.errorMessage.set(msg);
          return throwError(() => new Error(msg));
        }),
        finalize(() => {
          Swal.close();
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión.",
            confirmButtonText: "Ir a Login",
          }).then(() => {
            this.router.navigate(ROUTES.AUTH.LOGIN);
          });
        },
      });
  }
}

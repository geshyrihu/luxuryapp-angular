import { animate, style, transition, trigger } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { MessageModule } from "primeng/message";
import { catchError, finalize, Subject, throwError } from "rxjs";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";
import { CustomInputPassword } from "src/app/core/components/inputs/web/custom-input-password-signal";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { LoginSliderService } from "src/app/core/services/login-slider.service";
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
    <!-- Contenedor principal de la página de restablecer contraseña (Split Layout) -->
    <div class="relative flex h-screen w-full overflow-hidden surface-ground">
      <!-- =============================== -->
      <!-- 1. FULL SCREEN BACKGROUND IMAGE -->
      <!-- =============================== -->
      <div class="absolute top-0 left-0 w-full h-full z-0 bg-black-alpha-90">
        @for (image of visibleImages(); track image) {
          <div
            class="absolute top-0 left-0 w-full h-full"
            [@slideAnimation]
            [style.background-image]="'url(' + image + ')'"
            style="background-size: cover; background-position: center; opacity: 0.9;"
          ></div>
        }
        <div
          class="absolute top-0 left-0 w-full h-full"
          style="background: linear-gradient(135deg, rgba(27, 54, 93, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%);"
        ></div>
      </div>

      <!-- =============================== -->
      <!-- 2. CONTENT (OVER BACKGROUND)    -->
      <!-- =============================== -->
      <div class="relative z-10 flex w-full h-full">
        <!-- Lado Izquierdo: Formulario -->
        <div
          class="w-full lg:w-5 flex flex-column align-items-center justify-content-center relative px-4 md:px-6 py-8 z-20 shadow-8 auth-dark-panel"
        >
          <!-- Barra superior dorada (Accent) -->
          <div
            class="absolute top-0 left-0 w-full h-1rem"
            style="background-color: var(--ds-secondary);"
          ></div>

          <div
            class="w-full max-w-25rem relative z-10 fadein animation-duration-500"
          >
            <!-- Logo y Bienvenida -->
            <div class="text-center mb-6">
              <img
                class="mx-auto mb-4 w-12rem md:w-15rem h-auto drop-shadow-md"
                src="assets/images/login/LBG-blanco.png"
                alt="Logo Luxury Building Group"
                width="240"
                height="92"
              />
              <h2 class="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                Restablecer Contraseña
              </h2>
              @if (email()) {
                <p class="text-base m-0 font-light">Para: {{ email() }}</p>
              }
            </div>

            <!-- Formulario -->
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
                  icon="mdi:lock-reset"
                  [fluid]="true"
                  severity="warning"
                  customClass="shadow-4"
                ></il-button>
              </div>

              <!-- Mensaje Error -->
              @if (errorMessage()) {
                <div class="mt-3 fadein animation-duration-300">
                  <div
                    class="flex align-items-center p-3 border-round border-1 border-red-300 bg-red-50 text-red-800 shadow-1"
                  >
                    <app-icon
                      icon="mdi:alert-circle-outline"
                      class="text-xl mr-3"
                    ></app-icon>
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
                  style="color: var(--ds-secondary); text-decoration: none;"
                >
                  Volver al Login
                </a>
              </div>
            </form>
          </div>

          <!-- Footer / Copyright -->
          <div
            class="absolute bottom-0 left-0 w-full text-center pb-4 text-400 text-xs"
          >
            &copy; 2026 Luxury Building Group. Todos los derechos reservados.
          </div>
        </div>

        <!-- Lado Derecho: Imagen y Branding (Oculto en pantallas pequeñas, visible en lg) -->
        <div
          class="hidden lg:flex lg:w-7 relative align-items-center justify-content-center"
        >
          <!-- Contenido Branding Flotante -->
          <div
            class="relative z-10 text-white max-w-30rem text-center fadein animation-duration-1000"
          >
            <div
              class="mb-5 inline-flex align-items-center justify-content-center w-5rem h-5rem border-circle shadow-6"
              style="background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2);"
            >
              <app-icon
                icon="mdi:star"
                class="text-4xl"
                style="color: var(--ds-secondary);"
              ></app-icon>
            </div>
            <h1
              class="text-6xl font-bold mb-4 line-height-2 text-white drop-shadow-lg"
            >
              Excelencia <br />
              <span style="color: var(--ds-secondary);">Inmobiliaria</span>
            </h1>
            <p
              class="text-xl line-height-3 text-200 mt-4 px-4 font-light drop-shadow-md"
            >
              Gestiona recursos, proyectos y operaciones con la suite
              tecnológica definitiva diseñada para líderes de la industria.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }
    `,
  ],
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
})
export class ResetPassword implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataConnectorS = inject(DataConnectorService);
  private sliderService = inject(LoginSliderService);

  token = signal("");
  email = signal("");
  submitting = signal(false);
  errorMessage = signal("");
  visibleImages = toSignal(this.sliderService.getVisibleImages$(), {
    initialValue: [],
  });
  private destroy$ = new Subject<void>();

  form: FormGroup<IResetPasswordForm> = this.fb.group(
    {
      newPassword: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordMatchValidator },
  );

  ngOnInit() {
    this.token.set(this.route.snapshot.queryParamMap.get("token") || "");
    this.email.set(this.route.snapshot.queryParamMap.get("email") || "");

    if (!this.token()) {
      this.errorMessage.set("Enlace inválido o expirado.");
    }

    // this.initializeSlider(); // Handled by signal
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // private initializeSlider(): void { ... } // Removed

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
      .post("Auth/ConfirmRecoverPassword", body)
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

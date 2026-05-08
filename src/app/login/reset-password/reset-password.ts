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
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { catchError, finalize, Subject, throwError } from "rxjs";
import { CustomInputPassword } from "src/app/core/components/inputs/web/custom-input-password-signal";
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
    ButtonModule,
    RouterModule,
  ],
  template: `
    <!-- Contenedor principal similar al login -->
    <div class="login-container">
      <!-- Carrusel de imógenes de fondo -->
      <div class="background-slider">
        @for (image of visibleImages(); track image) {
          <div
            class="slide"
            [@slideAnimation]
            [style.background-image]="'url(' + image + ')'"
          ></div>
        }
        <div class="overlay"></div>
      </div>

      <!-- Contenido centrado -->
      <div
        class="login-content-wrapper flex align-items-center justify-content-center w-full p-4 min-h-screen"
      >
        <div
          class="login-card surface-card shadow-6 border-round-2xl max-w-40rem w-full"
        >
          <form
            class="theme-form p-4"
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
          >
            <!-- Logo -->
            <div class="text-center mb-4">
              <img
                class="logo w-11rem h-auto shadow-2 mx-auto"
                src="assets/images/login/LBG-negro.png"
                alt="Logo LuxuryApp"
              />
              <h4 class="mt-3 mb-1 font-semibold text-900 tracking-tight">Restablecer Contraseña</h4>
              @if (email()) {
                <p class="text-600">Para: {{ email() }}</p>
              }
            </div>

            <!-- Campos -->
            <custom-input-password-signal
              class="mb-3 block"
              [control]="form.controls.newPassword"
              [horizontal]="false"
              formControlName="newPassword"
              label="Nueva Contraseña"
              placeholder="********"
              [showStrengthIndicator]="true"
              size="large"
            />

            <custom-input-password-signal
              class="mb-3 block"
              [control]="form.controls.confirmPassword"
              [horizontal]="false"
              formControlName="confirmPassword"
              label="Confirmar Contraseña"
              placeholder="********"
              size="large"
            />

            <!-- Botón -->
            <div class="mt-4">
              <p-button
                class="w-full"
                type="submit"
                label="Cambiar Contraseña"
                [disabled]="form.invalid || submitting()"
                styleClass="w-full text-uppercase tracking-wider"
              ></p-button>
            </div>

            <!-- Mensaje Error -->
            @if (errorMessage()) {
              <p-message
                class="mt-3 block"
                severity="error"
                [text]="errorMessage()"
                styleClass="w-full shadow-1"
              ></p-message>
            }

            <div class="text-center mt-3">
              <a
                [routerLink]="['/auth/login']"
                class="font-semibold text-sm text-primary no-underline hover:underline"
              >
                Volver al Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
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
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }
      .login-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .background-slider {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }
      .slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1;
      }
      .login-content-wrapper {
        position: relative;
        z-index: 2;
      }
    `,
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
      this.errorMessage.set("Enlace invólido o expirado.");
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
            title: "óóxito!",
            text: "Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión.",
            confirmButtonText: "Ir a Login",
          }).then(() => {
            this.router.navigate(["/auth/login"]);
          });
        },
      });
  }
}

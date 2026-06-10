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
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
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
    CustomButton,
    RouterModule,
  ],
  template: `
    <!-- Contenedor principal similar al login -->
    <div class="relative w-full overflow-hidden min-h-screen bg-black-alpha-90">
      <!-- Carrusel de imágenes de fondo -->
      <div class="absolute top-0 left-0 w-full h-full z-10">
        @for (image of visibleImages(); track image) {
          <div
            class="absolute top-0 left-0 w-full h-full"
            [@slideAnimation]
            [style.background-image]="'url(' + image + ')'"
            style="background-size: cover; background-position: center"
          ></div>
        }
        <div class="absolute top-0 left-0 w-full h-full bg-black-alpha-80 md:bg-black-alpha-60"></div>
      </div>

      <!-- Contenido centrado -->
      <div
        class="relative z-20 flex align-items-center justify-content-center w-full min-h-screen fadeinup animation-duration-500"
      >
        <div
          class="w-full flex flex-column justify-content-center overflow-hidden glass-auth-card max-w-30rem"
        >
          <form
            class="w-full px-4 py-6 md:p-5"
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
          >
            <!-- Logo -->
            <div class="text-center mb-5">
              <img
                class="mx-auto mb-3 w-13rem h-auto"
                src="assets/images/login/LBG-blanco.png"
                alt="Logo LuxuryApp"
              />
              <h4 class="mb-1 text-2xl font-bold tracking-tight">Restablecer Contraseña</h4>
              @if (email()) {
                <p class="font-medium text-sm text-600">Para: {{ email() }}</p>
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
            <div class="mt-5">
              <custom-button
                customClass="w-full border-round overflow-hidden"
                type="submit"
                label="CAMBIAR CONTRASEÑA"
                [loading]="submitting()"
                [disabled]="form.invalid || submitting()"
                icon="mdi:lock-reset"
                [fluid]="true"
                [showLabelOnDesktop]="true"
              ></custom-button>
            </div>

            <!-- Mensaje Error -->
            @if (errorMessage()) {
              <div class="mt-4 fadein animation-duration-300">
                <p-message
                  severity="error"
                  [text]="errorMessage()"
                  styleClass="w-full shadow-1"
                ></p-message>
              </div>
            }

            <div class="text-center mt-4">
              <a
                [routerLink]="['/auth/login']"
                class="font-semibold text-sm text-primary transition-colors hover:text-white"
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

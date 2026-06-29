import { animate, style, transition, trigger } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MessageModule } from "primeng/message";
import { catchError, finalize, Subject, throwError } from "rxjs";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { LoginSliderService } from "src/app/core/services/login-slider.service";
import Swal from "sweetalert2";
import { AppIcon } from "../../core/components/shared/app-icon/app-icon.component";

interface IRecoverPasswordForm {
  email: FormControl<string>;
}

@Component({
  selector: "app-recover-password",

  templateUrl: "./recover-password.html",
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
  imports: [
    ReactiveFormsModule,
    MessageModule,
    CustomInputTextSignal,
    CustomButton,
    RouterModule,
    AppIcon,
  ],
  styles: [
    `
      .auth-dark-panel {
        background: rgba(11, 49, 100, 0.4);
        color: rgba(255, 255, 255, 0.95);
      }
      .auth-dark-panel ::ng-deep label,
      .auth-dark-panel ::ng-deep h2,
      .auth-dark-panel ::ng-deep p,
      .auth-dark-panel ::ng-deep .text-900,
      .auth-dark-panel ::ng-deep .text-700,
      .auth-dark-panel ::ng-deep .text-600 {
        color: rgba(255, 255, 255, 0.9) !important;
      }
      .auth-dark-panel ::ng-deep input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        color: white !important;
      }
      .auth-dark-panel ::ng-deep input::placeholder {
        color: rgba(255, 255, 255, 0.5) !important;
      }
    `,
  ],
})
export class RecoverPassword implements OnInit, OnDestroy {
  apiResponseS = inject(ApiResponseService);
  dataConnectorS = inject(DataConnectorService);
  formB = inject(FormBuilder);
  sliderService = inject(LoginSliderService);

  form: FormGroup<IRecoverPasswordForm> = this.formB.group({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  errorMessage = signal<string>("");
  successMessage = signal<string>("");
  submitting = signal(false);
  countdown = signal<number>(0);
  visibleImages = toSignal(this.sliderService.getVisibleImages$(), {
    initialValue: [],
  });
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // this.initializeSlider(); // Handled by signal
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // private initializeSlider(): void { ... } // Removed

  onSubmit() {
    if (this.form.invalid) {
      this.apiResponseS.validateForm(this.form);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set("");
    this.successMessage.set("");

    Swal.fire({
      title: "Procesando...",
      text: "Por favor, espera.",
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const urlApi = "Auth/RecoverPassword";
    const body = this.form.value;

    this.dataConnectorS
      .post(urlApi, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const msg =
            error.error?.error?.message ||
            error.error?.message ||
            "Ocurrió un error inesperado";
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
          const msg =
            response.body?.data?.message ||
            response.body?.message ||
            "Si el correo existe, recibirás instrucciones.";
          this.successMessage.set(msg);
          this.startCountdown();
        },
      });
  }

  startCountdown() {
    this.countdown.set(30);
    const interval = setInterval(() => {
      const current = this.countdown();
      if (current > 0) {
        this.countdown.set(current - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
}

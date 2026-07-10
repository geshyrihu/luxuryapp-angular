import { animate, style, transition, trigger } from "@angular/animations";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
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
import { RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MessageModule } from "primeng/message";
import { catchError, finalize, Subject, throwError } from "rxjs";
import { LoginSliderService } from "src/app/core/auth/services/login-slider.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { ROUTES } from "src/app/routing/route-paths";
import Swal from "sweetalert2";

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MessageModule,
    CustomInputTextSignal,
    WebButtonLabel,
    RouterModule,
    AppIcon,
  ],
})
export class RecoverPassword implements OnInit, OnDestroy {
  readonly ROUTES = ROUTES;
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

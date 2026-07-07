import { animate, style, transition, trigger } from "@angular/animations";
import { NgOptimizedImage } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { MessageModule } from "primeng/message";
import { catchError, finalize, of, startWith, switchMap } from "rxjs";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputPassword } from "@ui/inputs/web/custom-input-password-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { UserTokenDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { LoginSliderService } from "src/app/core/services/login-slider.service";
import { SecurityService } from "src/app/core/services/security.service";

import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-login",

  templateUrl: "./login.html",
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
    RouterModule,
    MessageModule,
    WebButtonLabel,
    CustomInputCheckSignal,
    CustomInputTextSignal,
    CustomInputPassword,
    NgOptimizedImage,
    AppIcon,
  ],
})
export class LoginComponent implements OnInit {
  readonly ROUTES = ROUTES;
  private activateRoute = inject(ActivatedRoute);
  public aspRoleS = inject(AspRoleService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private securityS = inject(SecurityService);
  private authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);
  private loaderService = inject(LoaderService);
  private consoleLogger = inject(ConsoleLoggerService);
  private sliderService = inject(LoginSliderService);
  private destroyRef = inject(DestroyRef);

  public readonly loading = signal(false);
  public readonly errorMessage = signal("");
  public show: boolean = false;
  public sliderImages = toSignal(this.sliderService.getVisibleImages$(), {
    initialValue: [],
  });
  loginForm: FormGroup = this.formBuilder.group({
    userName: ["", [Validators.required]],
    password: ["", [Validators.required]],
    rememberMe: [true],
  });
  public readonly formStatus = toSignal(
    this.loginForm.statusChanges.pipe(startWith(this.loginForm.status)),
    { requireSync: true },
  );
  public readonly isSubmitDisabled = computed(
    () => this.formStatus() !== "VALID" || this.loading(),
  );
  private preservedRedirectUrl: string = "/";

  ngOnInit(): void {
    this.consoleLogger.custom("", "#607D8B", "[Login] Iniciando..");
    this.preservedRedirectUrl = this.getRedirectUrl();
    this.consoleLogger.custom(
      "",
      "#2196F3",
      `[Login] URL final de redireccion: ${this.preservedRedirectUrl}`,
    );
    this.onLoadForm();
    this.securityS.resetAuthData();
    this.loaderService.hide();
    this.consoleLogger.custom(
      "",
      "#9E9E9E",
      "[Login] Datos de sesion previa eliminados.",
    );
  }

  showPassword() {
    this.show = !this.show;
  }

  private getRedirectUrl(): string {
    const fromQuery = this.activateRoute.snapshot.queryParams["returnUrl"];
    if (fromQuery && typeof fromQuery === "string") {
      this.consoleLogger.custom(
        "",
        "#2196F3",
        `[Login] Usando URL de queryParams: ${fromQuery}`,
      );
      return fromQuery;
    }
    this.consoleLogger.custom(
      "",
      "#607D8B",
      "[Login] Usando / como redireccion por defecto.",
    );
    return "/";
  }

  onLoadForm(): void {
    const savedUser = localStorage.getItem("savedUsername");
    const savedPass = localStorage.getItem("savedPassword");
    if (savedUser) {
      this.loginForm.patchValue({
        userName: savedUser,
        ...(savedPass ? { password: savedPass } : {}),
      });
      this.consoleLogger.custom("", "#FF9800", "[Login] Usuario recuperado.");
    }
  }

  onSubmit(): void {
    this.consoleLogger.custom("", "#03A9F4", "[Login] Iniciando login...");

    if (this.loginForm.invalid) {
      return;
    }
    this.loading.set(true);
    this.loaderService.show();
    this.errorMessage.set("");

    const rememberMe = this.loginForm.get("rememberMe")?.value;
    this.onRemember(!!rememberMe);

    this.authS
      .login(this.loginForm.value)
      .pipe(
        switchMap((userTokenData: UserTokenDTO) => {
          if (userTokenData) {
            this.consoleLogger.custom(
              "",
              "#3F51B5",
              "[Login] Inicializando estado del cliente...",
            );
            return this.customerIdS.initializeCustomerStateAfterLogin(
              userTokenData,
            );
          }
          this.errorMessage.set(
            "No se pudo iniciar la sesión. Inténtalo nuevamente.",
          );
          return of(false);
        }),
        catchError((error) => {
          this.errorMessage.set(this.buildLoginErrorMessage(error));
          this.consoleLogger.custom("", "#D32F2F", "Error en login:", error);
          return of(false);
        }),
        finalize(() => {
          this.loading.set(false);
          this.loaderService.hide();
          this.consoleLogger.custom("", "#9E9E9E", "[Login] Spinner finalizo.");
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (loginSuccess: boolean) => {
          if (loginSuccess) {
            this.consoleLogger.custom(
              "",
              "#4CAF50",
              "[Login] Login y carga de cliente OK.",
            );
            this.consoleLogger.custom(
              "",
              "#2196F3",
              `[Login] Redirigiendo a: ${this.preservedRedirectUrl}.`,
            );
            this.router.navigateByUrl(this.preservedRedirectUrl, {
              replaceUrl: true,
            });
          }
        },
      });
  }

  private buildLoginErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return "No fue posible conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.";
      }

      if (error.error?.code === "NoRoles") {
        return "No tienes permisos para acceder a la plataforma. Contacta al administrador.";
      }

      if (typeof error.error?.message === "string" && error.error.message) {
        return error.error.message;
      }
    }

    return "Ocurrió un error inesperado al iniciar sesión. Inténtalo más tarde.";
  }

  onRemember(rememberMe: boolean): void {
    if (rememberMe) {
      const username = this.loginForm.get("userName")?.value;
      const password = this.loginForm.get("password")?.value;
      if (username) localStorage.setItem("savedUsername", username);
      if (password) localStorage.setItem("savedPassword", password);
      this.consoleLogger.custom(
        "",
        "#FF9800",
        "[Login] Credenciales guardadas",
      );
    } else {
      localStorage.removeItem("savedUsername");
      localStorage.removeItem("savedPassword");
      this.consoleLogger.custom(
        "",
        "#9E9E9E",
        "[Login] Datos guardados eliminados",
      );
    }
  }
}

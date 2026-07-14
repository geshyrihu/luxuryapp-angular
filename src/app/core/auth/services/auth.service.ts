import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector, NgZone, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  Observable,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  of,
  shareReplay,
  tap,
  throwError,
} from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseDto } from "src/app/core/http/services/api-response.service";
import {
  InfoAccountAuthDto,
  SelectItemCustomerAccessDto,
  UserTokenDto,
} from "src/app/core/interfaces/auth-user-token.dto";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { ROUTES } from "src/app/routing/route-paths";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  // === INYECCIÓN DE DEPENDENCIAS ===
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private zone = inject(NgZone);
  private http = inject(HttpClient); // Cliente HTTP estándar con interceptores
  private injector = inject(Injector); // Injector para inyecciones perezosas
  private consoleLogger = inject(ConsoleLoggerService);

  // Cliente HTTP especial sin interceptores, inyectado con el token que proveímos en app.config
  private httpWithoutInterceptors = inject(
    "HttpClientWithoutInterceptors" as any,
  ) as HttpClient;
  private _signalRService?: SignalRService;

  // === PROPIEDADES DE ESTADO (INTERNAS) ===
  private currentUserSession = new BehaviorSubject<UserTokenDto | null>(null);
  private initialAuthCheckCompleted = new BehaviorSubject<boolean>(false);

  // === OBSERVABLES Y GETTERS PÚBLICOS (PARA COMPATIBILIDAD HACIA ATRÁS) ===
  public initialAuthCheckCompleted$ =
    this.initialAuthCheckCompleted.asObservable();
  public isAuthenticated$ = this.currentUserSession.pipe(
    map((session) => !!session),
    distinctUntilChanged(),
  );
  public userToken$ = this.currentUserSession.asObservable();

  public userRole$ = this.userToken$.pipe(
    map((session) => session?.roles?.[0] ?? null),
    distinctUntilChanged(),
    shareReplay(1),
  );

  public get applicationUserId(): string | null {
    return (
      this.currentUserSession.value?.infoUserAuthDTO.applicationUserId ?? null
    );
  }
  public get infoUserAuth(): InfoAccountAuthDto | null {
    return this.currentUserSession.value?.infoUserAuthDTO ?? null;
  }
  public get userToken(): UserTokenDto | null {
    return this.currentUserSession.value;
  }
  public get customerAccess(): SelectItemCustomerAccessDto[] {
    return this.currentUserSession.value?.customerAccess ?? [];
  }
  public readonly customerAccess$ = this.currentUserSession.pipe(
    map((s) => s?.customerAccess ?? []),
  );

  // === CONSTRUCTOR E INICIALIZACIÓN ===
  constructor() {
    const path = window.location.pathname;
    const isPublicRoute =
      path.startsWith("/publico") || path.startsWith("/auth");

    this.consoleLogger.custom(
      "",
      "#9C27B0",
      `[AuthService] Verificando ruta inicial: ${path} | Es publica: ${isPublicRoute}`,
    );

    if (!isPublicRoute) {
      this.consoleLogger.custom(
        "",
        "#009688",
        "[AuthService] Ruta no publica. Intentando login silencioso...",
      );
      this.trySilentLogin().subscribe();
    } else {
      this.consoleLogger.custom(
        "",
        "#FFC107",
        "[AuthService] Ruta publica detectada. Omitiendo login silencioso.",
      );
      // Si estamos en una ruta pública, simplemente marcamos la comprobación inicial como completa.
      this.initialAuthCheckCompleted.next(true);
    }
  }

  // Inyección perezosa de SignalR para romper el ciclo de dependencias
  private get signalRService(): SignalRService {
    if (!this._signalRService) {
      this._signalRService = this.injector.get(SignalRService);
    }
    return this._signalRService;
  }

  // === MÉTODOS DE AUTENTICACIÓN ===
  login(credentials: {
    userName: string;
    password: string;
  }): Observable<UserTokenDto> {
    return this.http
      .post<ApiResponseDto<UserTokenDto>>(
        `${environment.API_BASE_URL}${Endpoints.Auth.login}`,
        credentials,
        {
          withCredentials: true,
        },
      )
      .pipe(
        map((response) => {
          console.log("🚀 ~ AuthService ~ login ~ response:", response);
          if (response.success) return response.data;
          throw new Error(response.message);
        }),
        tap((session) => {
          this.currentUserSession.next(session);
          this.signalRService.start();
        }),
        catchError(this.handleError),
      );
  }

  logout(): Observable<any> {
    return this.httpWithoutInterceptors
      .post<ApiResponseDto<boolean>>(
        `${environment.API_BASE_URL}${Endpoints.Auth.logout}`,
        {},
        { withCredentials: true },
      )
      .pipe(
        tap(() => this.clearSession()),
        catchError((err) => {
          this.clearSession();
          return of(null);
        }),
      );
  }

  refreshToken(): Observable<UserTokenDto> {
    return this.httpWithoutInterceptors
      .post<ApiResponseDto<UserTokenDto>>(
        `${environment.API_BASE_URL}${Endpoints.Auth.refresh}`,
        {},
        { withCredentials: true }, // <-- ¡ESTA ES LA CLAVE QUE FALTABA!
      )
      .pipe(
        map((response) => {
          if (response.success) return response.data;
          throw new Error(response.message);
        }),
        tap((newSession) => {
          this.consoleLogger.custom(
            "",
            "color: #4CAF50; font-style: italic;",
            "[AuthService] Token renovado. Actualizando sesion en memoria.",
          );
          this.currentUserSession.next(newSession);
          this.signalRService.start();
        }),
        catchError((error) => {
          this.consoleLogger.error(
            "Error en refreshToken, forzando logout local.",
            error,
          );
          this.clearSession();
          return throwError(() => error);
        }),
      );
  }

  trySilentLogin(): Observable<UserTokenDto | null> {
    return this.refreshToken().pipe(
      catchError(() => {
        // Si refreshToken falla (y ya ejecuta clearSession), simplemente devolvemos null para que el flujo continúe.
        return of(null);
      }),
      finalize(() => {
        this.initialAuthCheckCompleted.next(true);
      }),
    );
  }

  // === MÉTODOS DE UTILIDAD Y COMPATIBILIDAD ===
  public notifyLoginSuccess(sessionData: UserTokenDto): Observable<boolean> {
    this.currentUserSession.next(sessionData);
    this.signalRService.start();
    return of(true);
  }

  private clearSession(): void {
    this.signalRService.stop();
    this.currentUserSession.next(null);
    this.customerIdS.clearCustomerData();

    // Limpiar máscaras y clases de PrimeNG (p-drawer, p-dialog) para evitar UI bloqueada
    document.body.classList.remove("p-overflow-hidden");
    const overlays = document.querySelectorAll(
      ".p-component-overlay, .p-dialog-mask, .p-drawer-mask, .p-sidebar-mask",
    );
    overlays.forEach((overlay) => overlay.remove());

    this.zone.run(() => {
      this.router.navigate(ROUTES.AUTH.LOGIN);
    });
  }

  getToken(): string | null {
    return this.currentUserSession.value?.token ?? null;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}

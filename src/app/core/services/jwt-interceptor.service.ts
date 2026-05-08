import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { AuthService } from "src/app/core/services/auth.service";
import { UserTokenDTO } from "../interfaces/auth-user-token.dto";
import { ConsoleLoggerService } from "./console-logger.service";
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private consoleLogger = inject(ConsoleLoggerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Si la ruta es para refrescar el token, la dejamos pasar sin modificar.
    if (request.url.includes("/Auth/Refresh")) {
      return next.handle(request);
    }

    return this.authService.initialAuthCheckCompleted$.pipe(
      filter((completed) => completed === true), // Espera a que la comprobación inicial termine
      take(1), // Toma el primer valor verdadero y se desuscribe
      switchMap(() => {
        // Ahora que sabemos que la auth está lista, procedemos
        this.consoleLogger.custom(
          "🛡️",
          "#FF0000",
          "[JwtInterceptor] Auth check completado. Interceptando ruta:",
          request.url,
        );

        const token = this.authService.getToken();

        if (token) {
          request = this.adDTOken(request, token);
        }

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              return this.handle401Error(request, next);
            }
            return throwError(() => error);
          }),
        );
      }),
    );
  }

  private adDTOken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((newSession: UserTokenDTO) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newSession.token);
          return next.handle(this.adDTOken(request, newSession.token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          // El logout ya se maneja dentro de refreshToken si falla
          return throwError(() => error);
        }),
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.adDTOken(request, jwt));
        }),
      );
    }
  }
}










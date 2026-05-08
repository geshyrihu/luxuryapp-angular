import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConsoleLoggerService } from './console-logger.service';
import { UserTokenDTO } from '../interfaces/auth-user-token.dto';
// State shared across requests (Singleton behavior)
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const consoleLogger = inject(ConsoleLoggerService);

  // Si la ruta es para refrescar el token, la dejamos pasar sin modificar.
  if (req.url.includes('/Auth/Refresh')) {
    return next(req);
  }

  return authService.initialAuthCheckCompleted$.pipe(
    filter((completed) => completed === true), // Espera a que la comprobación inicial termine
    take(1), // Toma el primer valor verdadero y se desuscribe
    switchMap(() => {
      // Ahora que sabemos que la auth está lista, procedemos
      consoleLogger.custom(
        '🛡️',
        '#FF0000',
        '[JwtInterceptorFn] Auth check completado. Interceptando ruta:',
        req.url
      );

      const token = authService.getToken();
      let request = req;

      if (token) {
        request = addToken(req, token);
      }

      return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return handle401Error(request, next, authService);
          }
          return throwError(() => error);
        })
      );
    })
  );
};

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((newSession: UserTokenDTO) => {
        isRefreshing = false;
        refreshTokenSubject.next(newSession.token);
        return next(addToken(request, newSession.token));
      }),
      catchError((error) => {
        isRefreshing = false;
        // El logout ya se maneja dentro de refreshToken si falla
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => {
        return next(addToken(request, jwt!));
      })
    );
  }
}










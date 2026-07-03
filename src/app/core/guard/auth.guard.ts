import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { of } from "rxjs";
import { ROUTES } from "src/app/routing/route-paths";
import { filter, map, switchMap, take } from "rxjs/operators";
import { AuthService } from "src/app/core/services/auth.service";
import { ConnectivityService } from "../services/connectivity.service";
import { ConsoleLoggerService } from "../services/console-logger.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService);
  const router = inject(Router);
  const connectivityService = inject(ConnectivityService);
  const consoleLogger = inject(ConsoleLoggerService);

  // Si la ruta es pública, permitir siempre el acceso.
  if (typeof state.url === "string" && state.url.startsWith("/publico")) {
    return of(true);
  }

  if (!connectivityService.isOnline) {
    consoleLogger.custom(
      "📶",
      "#FF5722",
      "[AuthGuard] Sin conexión. Bloqueando navegación.",
    );
    return of(false);
  }

  return authS.initialAuthCheckCompleted$.pipe(
    filter((isComplete) => isComplete), // 1. Espera hasta que la comprobación inicial esté completa
    take(1),
    switchMap(() => authS.isAuthenticated$), // 2. Una vez completa, comprueba si el usuario está autenticado
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true; // 3. Si está autenticado, permite el acceso
      }

      // 4. Si no, redirige a login
      const attemptedUrl =
        router.getCurrentNavigation()?.extractedUrl.toString() || state.url;
      consoleLogger.custom(
        "🛡️",
        "#FF0000",
        "[AuthGuard] Redirigiendo a /auth/login.",
      );
      router.navigate(ROUTES.AUTH.LOGIN, {
        queryParams: { returnUrl: attemptedUrl },
        replaceUrl: true,
      });
      return false;
    }),
  );
};










import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";

export const hasRolesGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService);
  const router = inject(Router);
  const consoleLogger = inject(ConsoleLoggerService);

  const allowedRoles: string[] = route.data['allowedRoles'] || [];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No roles restricted
  }

  return authS.userRole$.pipe(
    map((userRole) => {
      if (userRole && allowedRoles.includes(userRole)) {
        return true;
      }

      consoleLogger.custom(
        "🚫",
        "#FF0000",
        `[HasRolesGuard] Acceso denegado. Rol actual: ${userRole}. Roles requeridos: ${allowedRoles.join(", ")}.`,
      );
      // Opcionalmente redirigir a unauthorized
      router.navigate(['/']);
      return false;
    })
  );
};

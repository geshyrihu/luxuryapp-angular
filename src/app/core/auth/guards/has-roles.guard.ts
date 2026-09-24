import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { ConsoleLoggerService } from "@core/services/console-logger.service";

export const hasRolesGuard: CanActivateFn = (route, state) => {
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);
  const consoleLogger = inject(ConsoleLoggerService);

  const allowedRoles: string[] = route.data["allowedRoles"] || [];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No roles restricted
  }

  if (aspRoleS.hasAny(allowedRoles as ApplicationRole[])) {
    return true;
  }

  consoleLogger.custom(
    "🚫",
    "#FF0000",
    `[HasRolesGuard] Acceso denegado. Roles requeridos: ${allowedRoles.join(", ")}.`,
  );
  // Opcionalmente redirigir a unauthorized
  router.navigate(["/"]);
  return false;
};

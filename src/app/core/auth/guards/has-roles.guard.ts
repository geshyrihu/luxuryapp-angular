import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";

// SuperUsuario y Direccion quedan exentos de este candado (ver AspRoleService.canAccessAny).
export const hasRolesGuard: CanActivateFn = (route, state) => {
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);
  const consoleLogger = inject(ConsoleLoggerService);

  const allowedRoles: ApplicationRole[] = route.data['allowedRoles'] || [];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No roles restricted
  }

  if (aspRoleS.canAccessAny(allowedRoles)) {
    return true;
  }

  consoleLogger.custom(
    "🚫",
    "#FF0000",
    `[HasRolesGuard] Acceso denegado. Roles del usuario: ${aspRoleS.getUserRoles().join(", ")}. Roles requeridos: ${allowedRoles.join(", ")}.`,
  );
  // Opcionalmente redirigir a unauthorized
  router.navigate(['/']);
  return false;
};

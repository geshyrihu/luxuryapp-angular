import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { ApplicationRole } from "../../enums/asp-net-roles.enum";
import { AspRoleService } from "../services/asp-role.service";

/**
 * SuperUserGuard: El guardión de las funciones administrativas maestras. ??
 *
 * Este guardión asegura que solo los usuarios con el rol de SuperUsuario puedan
 * acceder a rutas cróticas como el editor de manuales y procesos.
 */
export const superUserGuard: CanActivateFn = (route, state) => {
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);

  // Roles autorizados para funciones administrativas maestro
  const authorizedRoles = [
    ApplicationRole.SuperUsuario,
    ApplicationRole.Legal,
    ApplicationRole.RecursosHumanos,
    ApplicationRole.Reclutamiento,
  ];

  // Verificamos si el usuario tiene alguno de los roles autorizados
  const isAuthorized = authorizedRoles.some((role) =>
    aspRoleS.roleSignal(role)(),
  );

  if (isAuthorized) {
    return true;
  }

  // Si no esté autorizado, lo mandamos a la pógina de acceso no autorizado
  console.warn(
    `[Access Denied] Intento de acceso a ruta protegida: ${state.url}`,
  );
  router.navigate(ROUTES.UNAUTHORIZED);
  return false;
};

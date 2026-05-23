import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { EApplicationRole } from "../enums/asp-net-roles.enum";
import { AspRoleService } from "../services/asp-role.service";

/**
 * SuperUserGuard: El guardián de las funciones administrativas maestras. 🔐
 * 
 * Este guardián asegura que solo los usuarios con el rol de SuperUsuario puedan
 * acceder a rutas críticas como el editor de manuales y procesos.
 */
export const superUserGuard: CanActivateFn = (route, state) => {
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);

  // Roles autorizados para funciones administrativas maestro
  const authorizedRoles = [
    EApplicationRole.SuperUsuario,
    EApplicationRole.Legal,
    EApplicationRole.RecursosHumanos,
    EApplicationRole.Reclutamiento,
  ];

  // Verificamos si el usuario tiene alguno de los roles autorizados
  const isAuthorized = authorizedRoles.some((role) =>
    aspRoleS.roleSignal(role)(),
  );

  if (isAuthorized) {
    return true;
  }

  // Si no está autorizado, lo mandamos a la página de acceso no autorizado
  console.warn(
    `[Access Denied] Intento de acceso a ruta protegida: ${state.url}`,
  );
  router.navigate(["/unauthorized"]);
  return false;
};

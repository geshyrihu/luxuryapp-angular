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

  // Verificamos si el usuario tiene el rol de SuperUsuario
  if (aspRoleS.roleSignal(EApplicationRole.SuperUsuario)()) {
    return true;
  }

  // Si no es SuperUsuario, lo mandamos a la página de acceso no autorizado
  console.warn(`[Access Denied] Intento de acceso a ruta protegida: ${state.url}`);
  router.navigate(["/unauthorized"]);
  return false;
};

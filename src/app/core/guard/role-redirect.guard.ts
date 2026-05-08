import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { EApplicationRole } from "../enums/asp-net-roles.enum";
import { AspRoleService } from "../services/asp-role.service";
/**
 * El Portero de la Discoteca (RoleRedirectGuard) 🕴️
 *
 * Este guardián no es como los demás. No decide si puedes entrar o no (eso es trabajo del `AuthGuard`),
 * sino a qué zona de la discoteca vas.
 *
 * Su lógica es simple y ahora síncrona (¡más rápido!):
 *   1. Se activa en la ruta raíz (`''`).
 *   2. Mira tu rol usando `hasRole()`. ¿Eres del "Comité"? A la zona VIP minimalista (`/app/committee`).
 *   3. ¿Eres cualquier otro rol? A la pista de baile principal con todas las luces (`/app/employee`).
 *
 * Devuelve un `UrlTree` para redirigir, cancelando la navegación actual y comenzando una nueva hacia
 * el layout correcto. Es básicamente un GPS para roles. 🗺️
 *
 * @returns Un `UrlTree` para la redirección. ¡No te interpongas en su camino!
 */

export const roleRedirectGuard: CanActivateFn = (): boolean => {
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);

  const url = aspRoleS.hasRole(EApplicationRole.Comite)
    ? "/committee"
    : "/dashboard";

  // Reemplaza /auth/login en el historial
  router.navigate([url], { replaceUrl: true });
  return false; // ya navegamos
};










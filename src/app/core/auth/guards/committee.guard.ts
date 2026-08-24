import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { filter, map, switchMap, take } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
/**
 * Un guardián de ruta para proteger las rutas del comité.
 *
 * Espera a que la comprobación de autenticación inicial se complete,
 * luego se suscribe al token del usuario para verificar el rol.
 * Esto asegura que la comprobación de rol se realiza con datos de sesión actualizados.
 *
 * SuperUsuario y Direccion quedan exentos de este candado (ver AspRoleService.canAccess).
 *
 * @returns Un Observable que resuelve a `true` o una `UrlTree`.
 */
export const committeeGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService);
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);

  return authS.initialAuthCheckCompleted$.pipe(
    filter((isComplete) => isComplete),
    take(1),
    switchMap(() => authS.userToken$), // Cambiar al stream del token de usuario
    map(() => {
      if (aspRoleS.canAccess(ApplicationRole.Comite)) {
        return true;
      }
      // Si la verificación de rol falla, redirigir
      return router.createUrlTree(["/auth/login"]);
    }),
  );
};

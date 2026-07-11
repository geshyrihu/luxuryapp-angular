import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { filter, map, switchMap, take } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
/**
 * Un guardián de ruta para proteger las rutas de empleados.
 *
 * Espera a que la comprobación de autenticación inicial se complete,
 * luego se suscribe al token del usuario para verificar el rol.
 * Si el usuario tiene el rol 'Comite', se le deniega el acceso y se le
 * redirige a la ruta '/committee' que le corresponde.
 *
 * @returns Un Observable que resuelve a `true` o una `UrlTree`.
 */
export const employeeGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService);
  const router = inject(Router);

  return authS.initialAuthCheckCompleted$.pipe(
    filter((isComplete) => isComplete),
    take(1),
    switchMap(() => authS.userToken$), // Cambiar al stream del token de usuario
    map((session) => {
      const roles = new Set(session?.roles ?? []);
      if (roles.has(ApplicationRole.Comite)) {
        return router.createUrlTree(["/committee"]);
      }
      if (roles.has(ApplicationRole.Direccion)) {
        return router.createUrlTree(["/direccion"]);
      }
      return true;
    }),
  );
};

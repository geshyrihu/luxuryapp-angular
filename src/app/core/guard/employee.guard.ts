import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { filter, map, switchMap, take } from "rxjs/operators";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AuthService } from "src/app/core/services/auth.service";
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
      // Verificar directamente los roles de la sesión
      const roles = new Set(session?.roles ?? []);
      if (roles.has(EApplicationRole.Comite)) {
        // Si el usuario es del comité, no debe estar aquí. Redirigir a su dashboard.
        return router.createUrlTree(["/committee"]);
      }

      // Si no es del comité, permitir acceso.
      return true;
    })
  );
};










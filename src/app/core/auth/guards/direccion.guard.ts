import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { filter, map, switchMap, take } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";

// SuperUsuario y Direccion quedan exentos de este candado (ver AspRoleService.canAccess).
export const direccionGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService);
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);

  return authS.initialAuthCheckCompleted$.pipe(
    filter((isComplete) => isComplete),
    take(1),
    switchMap(() => authS.userToken$),
    map(() => {
      if (aspRoleS.canAccess(ApplicationRole.Direccion)) {
        return true;
      }
      return router.createUrlTree(["/unauthorized"]);
    }),
  );
};

import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { filter, map, switchMap, take } from "rxjs/operators";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AuthService } from "src/app/core/services/auth.service";

export const direccionGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService);
  const router = inject(Router);

  return authS.initialAuthCheckCompleted$.pipe(
    filter((isComplete) => isComplete),
    take(1),
    switchMap(() => authS.userToken$),
    map((session) => {
      const roles = new Set(session?.roles ?? []);
      if (roles.has(EApplicationRole.Direccion)) {
        return true;
      }
      return router.createUrlTree(["/unauthorized"]);
    })
  );
};

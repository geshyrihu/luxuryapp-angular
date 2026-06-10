import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { EApplicationRole } from "../enums/asp-net-roles.enum";
import { AspRoleService } from "../services/asp-role.service";

export const superUsuarioGuard: CanActivateFn = () => {
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);

  if (aspRoleS.hasRole(EApplicationRole.SuperUsuario)) {
    return true;
  }

  router.navigate(["/dashboard"], { replaceUrl: true });
  return false;
};

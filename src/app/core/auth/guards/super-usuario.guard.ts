import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { ApplicationRole } from "../../enums/asp-net-roles.enum";
import { AspRoleService } from "../services/asp-role.service";

export const superUsuarioGuard: CanActivateFn = () => {
  const aspRoleS = inject(AspRoleService);
  const router = inject(Router);

  if (aspRoleS.hasRole(ApplicationRole.SuperUsuario)) {
    return true;
  }

  router.navigate(ROUTES.DASHBOARD, { replaceUrl: true });
  return false;
};

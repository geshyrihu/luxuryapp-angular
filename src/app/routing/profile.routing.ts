import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const profileRoutes: Routes = [
  {
    path: "update-user-profile",
    loadComponent: () =>
      import("src/app/features/tenant/user-profile/update-profile").then(
        (m) => m.UpdateProfile
      ),
    canActivate: [authGuard],
    data: {
      title: "Actualizar Perfil",
      breadcrumb: "Actualizar Perfil",
    },
  },
];












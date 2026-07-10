import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const profileRoutes: Routes = [
  {
    path: "update-user-profile",
    loadComponent: () =>
      import("src/app/apps/auth.luxuryapp/user-profile/update-profile-wrapper").then(
        (m) => m.UpdateProfileWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Actualizar Perfil",
      breadcrumb: "Actualizar Perfil",
    },
  },
];

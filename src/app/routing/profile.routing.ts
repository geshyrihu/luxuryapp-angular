import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const profileRoutes: Routes = [
  {
    path: "update-user-profile",
    loadComponent: () =>
      import("@auth.luxuryapp/profile-users/update-profile-wrapper").then(
        (m) => m.UpdateProfileWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Actualizar Perfil",
      breadcrumb: "Actualizar Perfil",
    },
  },
];



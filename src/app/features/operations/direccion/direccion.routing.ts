import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const direccionRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home-direccion/home-direccion").then((m) => m.HomeDireccion),
    canActivate: [authGuard],
    data: {
      title: "Inicio Direccion",
      breadcrumb: "Inicio",
    },
  },
  {
    path: "profile",
    loadChildren: () =>
      import("src/app/routing/profile.routing").then((m) => m.profileRoutes),
  },
];

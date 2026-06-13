import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const operationsRoutes: Routes = [
  {
    path: "my-building", // Ruta anterior: 'mi-edificio'
    loadComponent: () =>
      import("src/app/features/tenant/mi-edificio/mi-edificio").then(
        (m) => m.MiEdificio
      ),
    canActivate: [authGuard],
    data: {
      title: "Mi Edificio",
      breadcrumb: "Mi Edificio",
    },
  },
];












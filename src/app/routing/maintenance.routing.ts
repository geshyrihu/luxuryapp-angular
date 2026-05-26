import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const maintenanceRoutes: Routes = [
  // Ruta anterior: 'calendario-anual'
  {
    path: "annual-calendar",
    loadComponent: () =>
      import("src/app/features/calendar/mantenimiento-preventivo/calendario-mtto-list").then(
        (m) => m.CalendarioMttoList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Calendario Anual de Mantenimiento", // Mejorado para ser más específico
      breadcrumb: "Calendario Anual de Mantenimiento",
    },
  },
];

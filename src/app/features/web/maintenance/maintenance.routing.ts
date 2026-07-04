import { Routes } from "@angular/router";

export const maintenanceRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/features/web/maintenance/maintenance-page").then(
        (m) => m.MaintenancePage,
      ),
    data: { title: "Mantenimiento", breadcrumb: "Mantenimiento" },
  },
  {
    path: "cleaning-classification",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/cleaning/cleaning-procedure"
      ).then((m) => m.CleaningProcedure),
    data: {
      title: "Limpieza de Áreas y Clasificación de Objetos",
      breadcrumb: "Limpieza de Áreas",
    },
  },
];

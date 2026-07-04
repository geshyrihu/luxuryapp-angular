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
  {
    path: "machinery-survey",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/machinery-survey/machinery-survey"
      ).then((m) => m.MachinerySurvey),
    data: {
      title: "Levantamiento de Maquinaria y Equipos",
      breadcrumb: "Levantamiento de Maquinaria",
    },
  },
  {
    path: "budget-preparation",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/budget-preparation/budget-preparation"
      ).then((m) => m.BudgetPreparation),
    data: {
      title: "Preparación de Presupuestos de Mantenimiento",
      breadcrumb: "Presupuestos de Mantenimiento",
    },
  },
];

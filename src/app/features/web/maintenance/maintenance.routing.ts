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
  {
    path: "staff-evaluation",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/staff-evaluation/staff-evaluation"
      ).then((m) => m.StaffEvaluation),
    data: {
      title: "Evaluación de Personal de Mantenimiento",
      breadcrumb: "Evaluación de Personal",
    },
  },
  {
    path: "supplies-inventory",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/supplies-inventory/supplies-inventory"
      ).then((m) => m.SuppliesInventory),
    data: {
      title: "Control de Inventario de Insumos",
      breadcrumb: "Inventario de Insumos",
    },
  },
  {
    path: "tools-inventory",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/tools-inventory/tools-inventory"
      ).then((m) => m.ToolsInventory),
    data: {
      title: "Control de Inventario de Herramientas",
      breadcrumb: "Inventario de Herramientas",
    },
  },
];

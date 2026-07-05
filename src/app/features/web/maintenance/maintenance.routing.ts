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
    path: "common-areas-inventory",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/common-areas-inventory/common-areas-inventory"
      ).then((m) => m.CommonAreasInventory),
    data: {
      title: "Inventario de Áreas Comunes",
      breadcrumb: "Inventario de Áreas Comunes",
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
    path: "inspection-rounds",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/inspection-rounds/inspection-rounds"
      ).then((m) => m.InspectionRounds),
    data: {
      title: "Rutinas y Recorridos de Revisión de Equipos y Áreas",
      breadcrumb: "Rutinas y Recorridos",
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
    path: "supplier-review",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/supplier-review/supplier-review"
      ).then((m) => m.SupplierReview),
    data: {
      title: "Revisión de Contratos y Proveedores",
      breadcrumb: "Contratos y Proveedores",
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
    path: "green-areas",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/green-areas/green-areas"
      ).then((m) => m.GreenAreas),
    data: {
      title: "Mantenimiento de Áreas Verdes",
      breadcrumb: "Áreas Verdes",
    },
  },
  {
    path: "preventive-maintenance",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/preventive-maintenance/preventive-maintenance"
      ).then((m) => m.PreventiveMaintenance),
    data: {
      title: "Mantenimiento Preventivo de Instalaciones",
      breadcrumb: "Mantenimiento Preventivo",
    },
  },
  {
    path: "emergency-response",
    loadComponent: () =>
      import(
        "src/app/features/web/maintenance/procedures/emergency-response/emergency-response"
      ).then((m) => m.EmergencyResponse),
    data: {
      title: "Atención a Emergencias y Averías",
      breadcrumb: "Emergencias y Averías",
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
];

import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const inventoriesRoutes: Routes = [
  {
    path: "inventory-engine-system",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/inventory-engine-system/inventory-engine-system").then(
        (m) => m.InventoryEngineSystem,
      ),
    canActivate: [authGuard],
    data: {
      title: "Sistema de Inventario",
      breadcrumb: "Sistema de Inventario",
    },
  },
  {
    path: "areas-equipment", // Ruta anterior: 'areas-equipos'
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/equipos-y-maquinaria/machinery/equipos-list").then(
        (m) => m.EquiposList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Equipos por Categoría",
      breadcrumb: "Equipos por Categoría",
    },
  },
  {
    // Suggested path: 'gym'
    path: "gimnasio",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/equipos-y-maquinaria/machinery/equipos-list").then(
        (m) => m.EquiposList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Equipos de Gimnasio",
      breadcrumb: "Equipos de Gimnasio",
    },
  },
  {
    path: "tools", // Ruta anterior: 'herramienta'
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/tool-loan/tool-list").then(
        (m) => m.ToolList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Herramientas", // Ajustado para mayor claridad
      breadcrumb: "Inventario de Herramientas",
    },
  },
  {
    // Suggested path: 'paint'
    path: "pintura",
    loadComponent: () =>
      import("src/app/apps/supplier.luxuryapp/paint-inventory/inventario-pintura").then(
        (m) => m.InventarioPintura,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Pintura",
      breadcrumb: "Inventario de Pintura",
    },
  },
  {
    path: "keys", // Ruta anterior: 'llaves'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/key-inventory/inventario-llaves-list").then(
        (m) => m.InventarioLlavesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Llaves",
      breadcrumb: "Inventario de Llaves",
    },
  },
  {
    // Suggested path: 'equipment-report'
    path: "reporte-equipos",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/equipos-y-maquinaria/machinery-asset/reporte-completo-activos").then(
        (m) => m.ReporteCompletoActivos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Equipos",
      breadcrumb: "Reporte de Equipos",
    },
  },

  {
    path: "radios",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/radio-communication-inventory/radio-comunicacion-list").then(
        (m) => m.RadioComunicacionList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Radios de Comunicación", // Ajustado para ser más descriptivo
      breadcrumb: "Radios de Comunicación",
    },
  },
  {
    // Suggested path: 'annual-maintenance-schedule'
    path: "cedula-anual-mantenimientos",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/reports/mantenimiento-presupuesto/gastos-mantenimiento").then(
        (m) => m.GastosMantenimiento,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cédula Anual de Mantenimientos",
      breadcrumb: "Cédula Anual de Mantenimientos",
    },
  },
  {
    path: "extinguishers", // Ruta anterior: 'extintores'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor").then(
        (m) => m.InventarioExtintor,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Extintores", // Ajustado para consistencia
      breadcrumb: "Inventario de Extintores",
    },
  },
  {
    path: "extintores-group",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor-group").then(
        (m) => m.InventarioExtintorGroup,
      ),
    canActivate: [authGuard],
    data: {
      title: "Grupos de Extintores",
      breadcrumb: "Grupos de Extintores",
    },
  },
  {
    path: "hydrants",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/hydrant-inventory/inventario-hidrante").then(
        (m) => m.InventarioHidrante,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Hidrantes",
      breadcrumb: "Inventario de Hidrantes",
    },
  },
  {
    path: "manual-call-points",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/manual-call-point-inventory/inventario-estacion-manual").then(
        (m) => m.InventarioEstacionManual,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Estaciones Manuales",
      breadcrumb: "Inventario de Estaciones Manuales",
    },
  },
  {
    path: "smoke-detectors",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/smoke-detector-inventory/inventario-detector-humo").then(
        (m) => m.InventarioDetectorHumo,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Detectores de Humo",
      breadcrumb: "Inventario de Detectores de Humo",
    },
  },
];

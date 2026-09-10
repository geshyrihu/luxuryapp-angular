import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
export const operationsRoutes: Routes = [
  {
    path: "staff",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/staff-board/staff-board-list").then(
        (m) => m.StaffBoardList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantilla y Personal",
      breadcrumb: "Plantilla y Personal",
    },
  },
  // =============================================================
  // INCIDENCIAS DISCIPLINARIAS
  // =============================================================
  {
    path: "incidents",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/incident-list").then(
        (m) => m.IncidentList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Incidencias Disciplinarias",
      breadcrumb: "Incidencias",
    },
  },
  {
    path: "incident-dashboard",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/incident-dashboard/incident-dashboard").then(
        (m) => m.IncidentDashboardComponent,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
          ApplicationRole.Direccion,
        ]),
    ],
    data: {
      title: "Dashboard de Incidencias",
      breadcrumb: "Dashboard",
    },
  },

  // =============================================================
  // REPORTES DE INCIDENCIAS
  // =============================================================
  {
    path: "incident-reports",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/incidencias-sanciones/incident-report/incident-report").then(
        (m) => m.IncidentReport,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Reportes de Incidencias",
      breadcrumb: "Reportes de Incidencias",
    },
  },

  // =============================================================
  // SANCIONES
  // =============================================================
  {
    path: "sanctions",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/incidencias-sanciones/sanction/sanction-list").then(
        (m) => m.SanctionList,
      ),
    canActivate: [
      () =>
        inject(AspRoleService).hasAny([
          ApplicationRole.SuperUsuario,
          ApplicationRole.RecursosHumanos,
        ]),
    ],
    data: {
      title: "Sanciones",
      breadcrumb: "Sanciones",
    },
  },

  {
    path: "my-building", // Ruta anterior: 'mi-edificio'
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/properties/mi-edificio/mi-edificio").then(
        (m) => m.MiEdificio,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mi Edificio",
      breadcrumb: "Mi Edificio",
    },
  },

  {
    path: "inventario-productos",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/inventarios-y-almacn/stock-por-almacen/warehouse-stock-list").then(
        (m) => m.WarehouseStockList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario Insumos",
      breadcrumb: "Inventario Insumos",
    },
  },
  {
    path: "extintores",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor").then(
        (m) => m.InventarioExtintor,
      ),
    canActivate: [authGuard],
    data: {
      title: "Extintores",
      breadcrumb: "Extintores",
    },
  },
  {
    path: "extintores-group",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor-group").then(
        (m) => m.InventarioExtintorGroup,
      ),
    canActivate: [authGuard],
    data: {
      title: "Grupo de Extintores",
      breadcrumb: "Grupo de Extintores",
    },
  },
  {
    path: "alertas-panico",
    loadComponent: () =>
      import("src/app/modules/operations.luxuryapp/panic-alert/panic-alert-list/panic-alert-list").then(
        (m) => m.PanicAlertList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Alertas de Pánico",
      breadcrumb: "Alertas de Pánico",
    },
  },
];

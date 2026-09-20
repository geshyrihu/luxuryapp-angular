import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
export const operationsRoutes: Routes = [
  {
    path: "staff",
    loadComponent: () =>
      import("@operations.luxuryapp/staff-board/staff-board-list").then(
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
      import("@operations.luxuryapp/administrative-incidents/incident/incident-list").then(
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
      import("@operations.luxuryapp/administrative-incidents/incident/incident-dashboard/incident-dashboard").then(
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
      import("@operations.luxuryapp/administrative-incidents/incident-report/incident-report").then(
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
      import("@operations.luxuryapp/administrative-incidents/sanction/sanction-list").then(
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
      import("@operations.luxuryapp/properties/my-building/mi-edificio").then(
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
      import("@operations.luxuryapp/inventory/stock-by-warehouse/warehouse-stock-list").then(
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
      import("@operations.luxuryapp/inventory/fire-extinguisher-inventory/inventario-extintor").then(
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
      import("@operations.luxuryapp/inventory/fire-extinguisher-inventory/inventario-extintor-group").then(
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
      import("@operations.luxuryapp/panic-alert/panic-alert-list/panic-alert-list").then(
        (m) => m.PanicAlertList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Alertas de Pánico",
      breadcrumb: "Alertas de Pánico",
    },
  },
];



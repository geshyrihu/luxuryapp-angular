import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const operationsRoutes: Routes = [
  {
    path: "my-building", // Ruta anterior: 'mi-edificio'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/properties/mi-edificio/mi-edificio").then(
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
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/stock-por-almacen/warehouse-stock-list").then(
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
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor").then(
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
      import("src/app/apps/operations.luxuryapp/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor-group").then(
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
      import("src/app/apps/operations.luxuryapp/panic-alert/pages/panic-alert-list/panic-alert-list").then(
        (m) => m.PanicAlertList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Alertas de Pánico",
      breadcrumb: "Alertas de Pánico",
    },
  },
];

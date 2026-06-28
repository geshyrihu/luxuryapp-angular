import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const operationsRoutes: Routes = [
  {
    path: "my-building", // Ruta anterior: 'mi-edificio'
    loadComponent: () =>
      import("src/app/features/operations/properties/mi-edificio/mi-edificio").then(
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
      import("src/app/features/operations/inventarios-y-almacn/stock-por-almacen/warehouse-stock-list").then(
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
      import("src/app/features/operations/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor").then(
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
      import("src/app/features/operations/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor-group").then(
        (m) => m.InventarioExtintorGroup,
      ),
    canActivate: [authGuard],
    data: {
      title: "Grupo de Extintores",
      breadcrumb: "Grupo de Extintores",
    },
  },
];

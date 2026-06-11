import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const warehouseRoutes: Routes = [
  {
    path: "list",
    loadComponent: () =>
      import("src/app/features/tenant/warehouse/warehouse-list").then(
        (m) => m.WarehouseList
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de Almacenes",
      breadcrumb: "Listado de Almacenes",
    },
  },
  {
    path: "products/:almacenId",
    loadComponent: () =>
      import(
        "src/app/features/tenant/stock-por-almacen/warehouse-stock-list"
      ).then((m) => m.WarehouseStockList),
    canActivate: [authGuard],
    data: {
      title: "Inventario de Productos", // Ajustado para mayor claridad
      breadcrumb: "Inventario de Productos",
    },
  },
  {
    path: "product-output", // Ruta anterior: 'salida-productos'
    loadComponent: () =>
      import(
        "src/app/features/tenant/product-exit/product-output-list"
      ).then((m) => m.ProductOutputList),
    canActivate: [authGuard],
    data: {
      title: "Salida de Productos", // Ajustado para mayor claridad
      breadcrumb: "Salida de Productos",
    },
  },
  {
    path: "product-entry", // Ruta anterior: 'entrada-productos'
    loadComponent: () =>
      import("src/app/features/tenant/product-entry/product-entry-list").then(
        (m) => m.ProductEntryList
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrada de Productos", // Ajustado para mayor claridad
      breadcrumb: "Entrada de Productos",
    },
  },
  {
    path: "tool-loan", // Ruta anterior: 'prestamo-herramienta'
    loadComponent: () =>
      import(
        "src/app/features/tenant/bitacoras/prestamo-herramienta/prestamo-herramientas-control"
      ).then((m) => m.PrestamoHerramientasControl),
    canActivate: [authGuard],
    data: {
      title: "PrÃ©stamo de Herramientas", // Corregido acento y mayÃºscula
      breadcrumb: "PrÃ©stamo de Herramientas",
    },
  },
];












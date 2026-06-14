import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const operationsRoutes: Routes = [
  {
    path: "my-building", // Ruta anterior: 'mi-edificio'
    loadComponent: () =>
      import("src/app/features/operations/properties/mi-edificio/mi-edificio").then(
        (m) => m.MiEdificio
      ),
    canActivate: [authGuard],
    data: {
      title: "Mi Edificio",
      breadcrumb: "Mi Edificio",
    },
  },
  {
    path: "asamblea-checklist-catalog",
    loadComponent: () =>
      import("src/app/features/operations/asambleas-y-planificacin/asamblea-checklist-template/asamblea-checklist-template-list").then(
        (m) => m.AsambleaChecklistTemplateList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de checklist de asamblea",
      breadcrumb: "Catalogo checklist asamblea",
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
  {
    path: "catalog-asset",
    loadComponent: () =>
      import("src/app/features/operations/inspecciones-y-auditora/inspection/catalogo/catalogo-activo-lista").then(
        (m) => m.CatalogoActivoLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de amenidades",
      breadcrumb: "Catalogo de amenidades",
    },
  },
  {
    path: "inspection-reviews-catalog",
    loadComponent: () =>
      import("src/app/features/operations/inspecciones-y-auditora/inspection/catalogo/catalogo-revisiones-inspeccion").then(
        (m) => m.CatalogoRevisionesInspeccion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de inspecciones",
      breadcrumb: "Catalogo de inspecciones",
    },
  },
  {
    path: "entrega-recepcion-cliente",
    loadComponent: () =>
      import("src/app/features/operations/properties/delivery-reception-catalog/catalogo-descripcion-list").then(
        (m) => m.CatalogoDescripcionList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega y Recepción",
      breadcrumb: "Entrega y Recepción",
    },
  },
  {
    path: "juntas-mensuales-conciliacion",
    loadComponent: () =>
      import("src/app/features/operations/meetings/juntas-mensuales-backfill/juntas-mensuales-backfill").then(
        (m) => m.JuntasMensualesBackfill,
      ),
    canActivate: [authGuard],
    data: {
      title: "Conciliacion de juntas mensuales",
      breadcrumb: "Conciliacion de juntas mensuales",
    },
  },
  {
    path: "ticket-group-category",
    loadComponent: () =>
      import("src/app/features/operations/task-engine/tasks/work-group-categories/pages/task-group-category-list").then(
        (m) => m.TaskGroupCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Categoría de Grupos de Tickets",
      breadcrumb: "Categoría de Grupos de Tickets",
    },
  },
];












import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const deliveryReceptionRoutes: Routes = [
  {
    path: "general",
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion-cliente/entrega-recepcion-cliente").then(
        (m) => m.EntregaRecepcionClienteLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - General",
      breadcrumb: "Entrega RecepciÃ³n - General",
    },
  },
  {
    path: "equipment", // Ruta anterior: 'equipos'
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-equipos").then(
        (m) => m.EntregaRecepcionEquipos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Equipos",
      breadcrumb: "Entrega RecepciÃ³n - Equipos",
    },
  },
  {
    path: "installations", // Ruta anterior: 'instalaciones'
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-instalaciones").then(
        (m) => m.EntregaRecepcionInstalaciones,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Instalaciones",
      breadcrumb: "Entrega RecepciÃ³n - Instalaciones",
    },
  },
  {
    path: "tools", // Ruta anterior: 'herramientas'
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-herramientas").then(
        (m) => m.EntregaRecepcionHerramientas,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Herramientas",
      breadcrumb: "Entrega RecepciÃ³n - Herramientas",
    },
  },
  {
    path: "supplies", // Ruta anterior: 'insumos'
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-insumos").then(
        (m) => m.EntregaRecepcionInsumos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Insumos",
      breadcrumb: "Entrega RecepciÃ³n - Insumos",
    },
  },
  {
    path: "maintenance", // Ruta anterior: 'mantenimientos' (Sincronizado con BD)
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-mantenimientos").then(
        (m) => m.EntregaRecepcionMantenimientos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Mantenimientos",
      breadcrumb: "Entrega RecepciÃ³n - Mantenimientos",
    },
  },
  {
    // Suggested path: 'organization-chart'
    path: "organigrama",
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-organigrama").then(
        (m) => m.EntregaRecepcionOrganigrama,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Organigrama",
      breadcrumb: "Entrega RecepciÃ³n - Organigrama",
    },
  },
  {
    path: "keys", // Ruta anterior: 'llaves'
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-llaves").then(
        (m) => m.EntregaRecepcionLlaves,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Llaves",
      breadcrumb: "Entrega RecepciÃ³n - Llaves",
    },
  },
  {
    path: "hydrants", // Ruta anterior: 'hidrantes'
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-hidrantes").then(
        (m) => m.EntregaRecepcionHidrantes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Hidrantes",
      breadcrumb: "Entrega RecepciÃ³n - Hidrantes",
    },
  },
  {
    // Suggested path: 'pending-maintenances'
    path: "mantenimientos-pendientes",
    loadComponent: () =>
      import("src/app/features/tenant/entrega-recepcion/entrega-recepcion-mantenimientos-pendientes").then(
        (m) => m.EntregaRecepcionMantenimientosPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega RecepciÃ³n - Mantenimientos Pendientes",
      breadcrumb: "Entrega RecepciÃ³n - Mantenimientos Pendientes",
    },
  },
];












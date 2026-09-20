import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const deliveryReceptionRoutes: Routes = [
  {
    path: "general",
    loadComponent: () =>
      import("@operations.luxuryapp/properties/client-delivery-reception/entrega-recepcion-cliente").then(
        (m) => m.EntregaRecepcionClienteLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - General",
      breadcrumb: "Entrega Recepción - General",
    },
  },
  {
    path: "equipment", // Ruta anterior: 'equipos'
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-equipos").then(
        (m) => m.EntregaRecepcionEquipos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Equipos",
      breadcrumb: "Entrega Recepción - Equipos",
    },
  },
  {
    path: "installations", // Ruta anterior: 'instalaciones'
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-instalaciones").then(
        (m) => m.EntregaRecepcionInstalaciones,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Instalaciones",
      breadcrumb: "Entrega Recepción - Instalaciones",
    },
  },
  {
    path: "tools", // Ruta anterior: 'herramientas'
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-herramientas").then(
        (m) => m.EntregaRecepcionHerramientas,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Herramientas",
      breadcrumb: "Entrega Recepción - Herramientas",
    },
  },
  {
    path: "supplies", // Ruta anterior: 'insumos'
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-insumos").then(
        (m) => m.EntregaRecepcionInsumos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Insumos",
      breadcrumb: "Entrega Recepción - Insumos",
    },
  },
  {
    path: "maintenance", // Ruta anterior: 'mantenimientos' (Sincronizado con BD)
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-mantenimientos").then(
        (m) => m.EntregaRecepcionMantenimientos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Mantenimientos",
      breadcrumb: "Entrega Recepción - Mantenimientos",
    },
  },
  {
    // Suggested path: 'organization-chart'
    path: "organigrama",
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-organigrama").then(
        (m) => m.EntregaRecepcionOrganigrama,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Organigrama",
      breadcrumb: "Entrega Recepción - Organigrama",
    },
  },
  {
    path: "keys", // Ruta anterior: 'llaves'
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-llaves").then(
        (m) => m.EntregaRecepcionLlaves,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Llaves",
      breadcrumb: "Entrega Recepción - Llaves",
    },
  },
  {
    path: "hydrants", // Ruta anterior: 'hidrantes'
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-hidrantes").then(
        (m) => m.EntregaRecepcionHidrantes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Hidrantes",
      breadcrumb: "Entrega Recepción - Hidrantes",
    },
  },
  {
    // Suggested path: 'pending-maintenances'
    path: "mantenimientos-pendientes",
    loadComponent: () =>
      import("@operations.luxuryapp/properties/delivery-reception/entrega-recepcion-mantenimientos-pendientes").then(
        (m) => m.EntregaRecepcionMantenimientosPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega Recepción - Mantenimientos Pendientes",
      breadcrumb: "Entrega Recepción - Mantenimientos Pendientes",
    },
  },
];



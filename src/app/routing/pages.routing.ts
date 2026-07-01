import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const pagesRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/features/operations/dashboard/container-dashboard").then(
        (m) => m.ContainerDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Dashboard",
      breadcrumb: "Dashboard",
    },
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("src/app/features/operations/dashboard/container-dashboard").then(
        (m) => m.ContainerDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Dashboard",
      breadcrumb: "Dashboard",
    },
  },

  {
    path: "notifications",
    loadComponent: () =>
      import("src/app/layout/employee-view/notifications-wrapper/notifications-wrapper").then(
        (m) => m.NotificationsWrapper,
      ),
    data: {
      title: "Notificaciones",
      breadcrumb: "Notificaciones",
    },
  },
  {
    path: "home",
    loadComponent: () =>
      import("src/app/layout/employee-view/movil/home-menu-mobile/home-menu-mobile").then(
        (m) => m.HomeMenu,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inicio",
      breadcrumb: "Inicio",
    },
  },

  {
    path: "settings",
    loadChildren: () =>
      import("src/app/routing/settings.routing").then((m) => m.settingsRoutes),

    data: {
      title: "Configuración del sistema",
      breadcrumb: "Configuración del sistema",
    },
  },
  {
    path: "profile",
    loadChildren: () =>
      import("src/app/routing/profile.routing").then((m) => m.profileRoutes),

    data: {
      title: "Perfil",
      breadcrumb: "Perfil",
    },
  },

  {
    // Suggested path: 'announcements'
    path: "announcements",
    loadChildren: () =>
      import("src/app/routing/announcements.routing").then(
        (m) => m.announcementsRoutes,
      ),

    data: {
      title: "Anuncios",
      breadcrumb: "Anuncios",
    },
  },

  {
    path: "warehouse", // Ruta anterior: 'almacen'
    loadChildren: () =>
      import("src/app/routing/warehouse.routing").then(
        (m) => m.warehouseRoutes,
      ),

    data: {
      title: "Almacén",
      breadcrumb: "Almacén",
    },
  },
  {
    path: "calendars",
    loadChildren: () =>
      import("src/app/routing/calendars.routing").then(
        (m) => m.calendarsRoutes,
      ),

    data: {
      title: "Calendario",
      breadcrumb: "Calendario",
    },
  },

  ///INICIO Seccion contabilidad

  // RUTA PRINCIPAL DE CONTABILIDAD - Todas las rutas están centralizadas en contabilidad.routing.ts
  {
    path: "contabilidad",
    loadChildren: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/contabilidad.routing").then(
        (m) => m.CONTABILIDAD_ROUTES,
      ),
    data: {
      title: "Tablero Principal de Contabilidad",
      breadcrumb: "Tablero Principal de Contabilidad",
    },
  },
  {
    path: "cobranza-nativa",
    loadChildren: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/cobranza-nativa.routing").then(
        (m) => m.COBRANZA_NATIVA_ROUTES,
      ),
    data: {
      title: "Cobranza Nativa",
      breadcrumb: "Cobranza Nativa",
    },
  },

  // REDIRECCIONAMIENTO: accounting -> contabilidad (rutas legacy)
  {
    path: "accounting",
    redirectTo: "contabilidad",
    pathMatch: "full",
  },

  // REDIRECCIONAMIENTO: accounting-coi -> contabilidad (rutas legacy)
  {
    path: "accounting-coi",
    redirectTo: "contabilidad",
    pathMatch: "full",
  },

  ///FIN Seccion contabilidad

  {
    path: "funding",
    loadChildren: () =>
      import("src/app/routing/funding.routing").then((m) => m.fundingRoutes),

    data: {
      title: "Fondeos",
      breadcrumb: "Fondeos",
    },
  },
  {
    path: "directory",
    loadChildren: () =>
      import("src/app/routing/directory.routing").then(
        (m) => m.directoryRoutes,
      ),

    data: {
      title: "Directorio",
      breadcrumb: "Directorio",
    },
  },
  {
    path: "library",
    loadChildren: () =>
      import("src/app/routing/library.routing").then((m) => m.libraryRoutes),
    data: {
      title: "Biblioteca",
      breadcrumb: "Biblioteca",
    },
  },
  {
    path: "delivery-reception", // Ruta anterior: 'entrega-recepcion'
    loadChildren: () =>
      import("src/app/routing/delivery-reception.routing").then(
        (m) => m.deliveryReceptionRoutes,
      ),

    data: {
      title: "Entrega Recepción",
      breadcrumb: "Entrega Recepción",
    },
  },
  {
    path: "inspections",
    loadChildren: () =>
      import("src/app/routing/inspection.routing").then(
        (m) => m.inspectionRoutes,
      ),

    data: {
      title: "Inspecciones",
      breadcrumb: "Inspecciones",
    },
  },
  {
    path: "committee-meetings", // Ruta anterior: 'junta-comite'
    loadChildren: () =>
      import("src/app/routing/committee-meetings.routing").then(
        (m) => m.committeeMeetingsRoutes,
      ),

    data: {
      title: "Juntas con comite",
      breadcrumb: "Juntas con comite",
    },
  },
  {
    path: "purchases", // Ruta anterior: 'compras'
    loadChildren: () =>
      import("src/app/routing/compras.routing").then((m) => m.comprasRoutes),

    data: {
      title: "Compras",
      breadcrumb: "Compras",
    },
  },

  {
    path: "legal",
    loadChildren: () =>
      import("src/app/routing/legal.routing").then((m) => m.legalRoutes),

    data: {
      title: "Legal",
      breadcrumb: "Legal",
    },
  },
  {
    path: "logbook",
    loadChildren: () =>
      import("src/app/routing/logbook.routing").then((m) => m.logbookRoutes),

    data: {
      title: "Bitácora",
      breadcrumb: "Bitácora",
    },
  },

  {
    path: "inventory", // Ruta anterior: 'inventario'
    loadChildren: () =>
      import("src/app/routing/inventories.routing").then(
        (m) => m.inventoriesRoutes,
      ),

    data: {
      title: "Inventario",
      breadcrumb: "Inventario",
    },
  },
  {
    path: "maintenance", // Ruta anterior: 'mantenimiento'
    loadChildren: () =>
      import("src/app/routing/maintenance.routing").then(
        (m) => m.maintenanceRoutes,
      ),

    data: {
      title: "Mantenimiento",
      breadcrumb: "Mantenimiento",
    },
  },
  {
    path: "operations", // Ruta anterior: 'operaciones'
    loadChildren: () =>
      import("src/app/routing/operations.routing").then(
        (m) => m.operationsRoutes,
      ),

    data: {
      title: "Operaciones",
      breadcrumb: "Operaciones",
    },
  },
  {
    path: "recruitment", // Ruta anterior: 'reclutamiento'
    loadChildren: () =>
      import("src/app/routing/recruitment.routing").then(
        (m) => m.recruitmentRoutes,
      ),

    data: {
      title: "Reclutamiento",
      breadcrumb: "Reclutamiento",
    },
  },
  {
    path: "report",
    loadChildren: () =>
      import("src/app/routing/reports.routing").then((m) => m.reportsRoutes),

    data: {
      title: "Reportes",
      breadcrumb: "Reportes",
    },
  },
  // Catalogo de reportes dinamicos
  {
    path: "contabilidad/reportes",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/dynamic-reports/pages/report-catalog/report-catalog").then(
        (m) => m.ReportCatalog,
      ),
    data: { title: "Reportes Financieros", breadcrumb: "Reportes" },
  },
  {
    path: "contabilidad/reportes/nuevo",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/dynamic-reports/pages/report-builder/report-builder").then(
        (m) => m.ReportBuilder,
      ),
    data: { title: "Nuevo Reporte", breadcrumb: "Nuevo Reporte" },
  },
  {
    path: "contabilidad/reportes/editar/:id",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/dynamic-reports/pages/report-builder/report-builder").then(
        (m) => m.ReportBuilder,
      ),
    data: { title: "Editar Reporte", breadcrumb: "Editar Reporte" },
  },
  {
    path: "contabilidad/reportes/ver/:id",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/dynamic-reports/pages/report-viewer/report-viewer").then(
        (m) => m.ReportViewer,
      ),
    data: { title: "Ver Reporte", breadcrumb: "Ver Reporte" },
  },
  {
    path: "contabilidad/reportes/guia",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/dynamic-reports/pages/report-guide/report-guide").then(
        (m) => m.ReportGuide,
      ),
    data: { title: "Guía del Módulo de Reportes", breadcrumb: "Guía" },
  },
  {
    path: "report-financial-statements",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/financial-reports-wrapper").then(
        (m) => m.default,
      ),
    data: {
      title: "Estados Financieros",
      breadcrumb: "Estados Financieros",
    },
  },
  {
    path: "catalog-replica",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/validacion-catalogo/catalog-replica").then(
        (m) => m.CatalogReplica,
      ),
    data: {
      title: "Replica Excel",
      breadcrumb: "Replica Excel",
    },
  },
  {
    path: "balance-mensual",
    loadComponent: () =>
      import("src/app/features/accounting/general-ledger/contabilidad/contabilidad-online/pages/monthly-balance/balance-mensual").then(
        (m) => m.BalanceMensual,
      ),
    data: {
      title: "Balance Mensual",
      breadcrumb: "Balance Mensual",
    },
  },

  {
    path: "diagram",
    loadChildren: () =>
      import("src/app/routing/diagram.routing").then((m) => m.diagramRoutes),

    data: {
      title: "Diagramas",
      breadcrumb: "Diagramas",
    },
  },

  {
    path: "supervision",
    loadChildren: () =>
      import("src/app/routing/supervision.routing").then(
        (m) => m.supervisionRoutes,
      ),

    data: {
      title: "Supervision",
      breadcrumb: "Supervision",
    },
  },

  // Se dejan asi las dos porque no se ha definido una ruta principal para contabilidad, y hay rutas legacy que apuntan a /accounting y /accounting-coi
  {
    path: "tickets",
    loadChildren: () =>
      import("src/app/routing/tickets.routing").then((m) => m.ticketsRoutes),

    data: {
      title: "Tickets",
      breadcrumb: "Tickets",
    },
  },
  {
    path: "Tasks",
    loadChildren: () =>
      import("src/app/routing/tickets.routing").then((m) => m.ticketsRoutes),

    data: {
      title: "Tickets",
      breadcrumb: "Tickets",
    },
  },
  {
    path: "tasks",
    loadChildren: () =>
      import("src/app/routing/tickets.routing").then((m) => m.ticketsRoutes),

    data: {
      title: "Tickets",
      breadcrumb: "Tickets",
    },
  },
  // Se dejan asi las dos porque no se ha definido una ruta principal para contabilidad, y hay rutas legacy que apuntan a /accounting y /accounting-coi

  {
    path: "utilities", // Ruta anterior: 'utilidades'
    loadChildren: () =>
      import("src/app/routing/utilities.routing").then(
        (m) => m.utilitiesRoutes,
      ),

    data: {
      title: "Utilidades",
      breadcrumb: "Utilidades",
    },
  },

  {
    path: "employee-evaluation",
    loadChildren: () =>
      import("src/app/routing/employee-evaluation.routing").then(
        (m) => m.employeeEvaluationRoutes,
      ),

    data: {
      title: "Evaluaciones",
      breadcrumb: "Evaluaciones",
    },
  },
  // Ruta canonica actual de RH. Debe convivir con el alias legacy hasta el cierre final del plan.
  {
    path: "recursos-humanos", // Ruta anterior: 'recursos-humanos'
    loadChildren: () =>
      import("src/app/routing/human-resources.routing").then(
        (m) => m.humanResourcesRoutes,
      ),
    data: {
      title: "Recursos Humanos",
      breadcrumb: "Recursos Humanos",
    },
  },
  {
    // Alias legacy temporal. No eliminar hasta cerrar la migracion y actualizar referencias externas/BD.
    path: "human-resources",
    loadChildren: () =>
      import("src/app/routing/human-resources.routing").then(
        (m) => m.humanResourcesRoutes,
      ),
    data: {
      title: "Recursos Humanos",
      breadcrumb: "Recursos Humanos",
    },
  },

  {
    path: "sat-funding",
    loadChildren: () =>
      import("src/app/features/accounting/fondeos-y-reporteo/sat-funding/sat-funding.routes").then(
        (m) => m.SAT_FUNDING_ROUTES,
      ),
    data: {
      title: "Fondeos SAT",
      breadcrumb: "Fondeos SAT",
    },
  },
  {
    path: "recurring-tasks",
    loadChildren: () =>
      import("src/app/routing/recurring-tasks.routing").then(
        (m) => m.recurringTasksRoutes,
      ),
    data: {
      title: "Tareas Recurrentes",
      breadcrumb: "Tareas Recurrentes",
    },
  },
  // --- Wildcard interno para mantener el Layout ---
  // Rutas temporales para check de auditoria
  {
    path: "entrega-recepcion-check",
    loadComponent: () =>
      import("src/app/features/operations/properties/entrega-recepcion-check/entrega-recepcion-check").then(
        (m) => m.EntregaRecepcionCheckComponent,
      ),
    data: {
      title: "entrega-recepcion-check",
      breadcrumb: "entrega-recepcion-check",
    },
  },
  {
    path: "password-manager",
    loadChildren: () =>
      import("src/app/features/system/vault/password-manager/password-manager.routes").then(
        (m) => m.PASSWORD_MANAGER_ROUTES,
      ),
    data: {
      title: "Gestor de Contraseñas",
      breadcrumb: "Gestor de Contraseñas",
    },
  },
  // Rutas temporales para check de auditoria
  // --- RUTAS DE ARQUITECTURA 8 MÓDULOS ---
  {
    path: "system",
    loadChildren: () =>
      import("src/app/features/system/system.routing").then(
        (m) => m.systemRoutes,
      ),
    data: { title: "Sistema", breadcrumb: "Sistema" },
  },
  {
    path: "accounting",
    loadChildren: () =>
      import("src/app/features/accounting/accounting.routing").then(
        (m) => m.accountingRoutes,
      ),
    data: { title: "Contabilidad", breadcrumb: "Contabilidad" },
  },
  {
    path: "hr",
    loadChildren: () =>
      import("src/app/features/hr/hr.routing").then((m) => m.hrRoutes),
    data: { title: "Recursos Humanos", breadcrumb: "Recursos Humanos" },
  },
  {
    path: "legal",
    loadChildren: () =>
      import("src/app/features/legal/legal.routing").then((m) => m.legalRoutes),
    data: { title: "Legal", breadcrumb: "Legal" },
  },
  {
    path: "maintenance",
    loadChildren: () =>
      import("src/app/features/maintenance/maintenance.routing").then(
        (m) => m.maintenanceRoutes,
      ),
    data: { title: "Mantenimiento", breadcrumb: "Mantenimiento" },
  },
  {
    path: "operations",
    loadChildren: () =>
      import("src/app/features/operations/operations.routing").then(
        (m) => m.operationsRoutes,
      ),
    data: { title: "Operaciones", breadcrumb: "Operaciones" },
  },
  {
    path: "initial-implementation",
    loadChildren: () =>
      import(
        "src/app/features/operations/initial-implementation/initial-implementation.routing"
      ).then((m) => m.initialImplementationRoutes),
    data: { title: "Implementación Inicial", breadcrumb: "Implementación Inicial" },
  },
  {
    path: "purchasing",
    loadChildren: () =>
      import("src/app/features/purchasing/purchasing.routing").then(
        (m) => m.purchasingRoutes,
      ),
    data: { title: "Compras", breadcrumb: "Compras" },
  },
  {
    path: "recruitment",
    loadChildren: () =>
      import("src/app/features/recruitment/recruitment.routing").then(
        (m) => m.recruitmentRoutes,
      ),
    data: { title: "Reclutamiento", breadcrumb: "Reclutamiento" },
  },
  // --- FIN RUTAS ARQUITECTURA ---

  {
    path: "**",
    loadComponent: () =>
      import("src/app/core/pages-extras/page404/page404").then(
        (m) => m.Page404,
      ),
    data: {
      title: "Página No Encontrada",
      breadcrumb: "Error 404",
    },
  },
];

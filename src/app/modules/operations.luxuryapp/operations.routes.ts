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
    path: "my-building",
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
    path: "product-inventory",
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
    path: "fire-extinguishers",
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
    path: "fire-extinguisher-groups",
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
    path: "panic-alerts",
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
  {
    path: "announcements",
    children: [
      {
        path: "manage",
        loadComponent: () =>
          import("@operations.luxuryapp/announcements/announcement/announcement-admin-list").then(
            (m) => m.AnnouncementAdminList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Administrar anuncios",
          breadcrumb: "Administrar anuncios",
        },
      },
      {
        path: "list",
        loadComponent: () =>
          import("@operations.luxuryapp/announcements/announcement/announcement-list").then(
            (m) => m.AnnouncementList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Listado de anuncios",
          breadcrumb: "Listado de anuncios",
        },
      },
      {
        path: "detail/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/announcements/announcement/announcement-detail").then(
            (m) => m.announcementDetail,
          ),
        canActivate: [authGuard],
        data: {
          title: "Detalle",
          breadcrumb: "Detalle",
        },
      },
      {
        path: "analytics/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/announcements/announcement/announcement-analytics").then(
            (m) => m.default,
          ),
        canActivate: [authGuard],
        data: {
          title: "Análisis de vistas",
          breadcrumb: "Análisis de vistas",
        },
      },
    ],
  },
  {
    path: "diagrams",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@operations.luxuryapp/diagram/diagram/diagram-list/diagram-list").then(
            (m) => m.DiagramList,
          ),
      },
      {
        path: "editor/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/diagram/diagram/diagram-editor/diagram-editor").then(
            (m) => m.DiagramEditor,
          ),
      },
      {
        path: "gallery",
        loadComponent: () =>
          import("@operations.luxuryapp/diagram/diagram/diagram-gallery/diagram-gallery").then(
            (m) => m.DiagramGallery,
          ),
      },
      {
        path: "view/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/diagram/diagram/diagram-view/diagram-view").then(
            (m) => m.DiagramView,
          ),
      },
    ],
  },
  {
    path: "recurring-tasks",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@operations.luxuryapp/task/recurring-tasks/templates/task-template-list/task-template-list").then(
            (m) => m.TaskTemplateList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Plantillas de Tareas Recurrentes",
          breadcrumb: "Plantillas de Tareas",
        },
      },
      {
        path: ":id/items",
        loadComponent: () =>
          import("@operations.luxuryapp/task/recurring-tasks/templates/task-template-items/task-template-items").then(
            (m) => m.TaskTemplateItems,
          ),
        canActivate: [authGuard],
        data: {
          title: "Items de Plantilla",
          breadcrumb: "Items",
        },
      },
      {
        path: "customer-config",
        loadComponent: () =>
          import("@operations.luxuryapp/task/recurring-tasks/templates/customer-config/customer-config").then(
            (m) => m.CustomerConfig,
          ),
        canActivate: [authGuard],
        data: {
          title: "Configuración por Cliente",
          breadcrumb: "Configuración",
        },
      },
      {
        path: "compliance",
        loadComponent: () =>
          import("@operations.luxuryapp/task/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard").then(
            (m) => m.RecurringTaskComplianceDashboard,
          ),
        canActivate: [authGuard],
        data: {
          title: "Tablero de Cumplimiento Recurrente",
          breadcrumb: "Cumplimiento",
        },
      },
      {
        path: "my-tasks",
        loadComponent: () =>
          import("@operations.luxuryapp/task/recurring-tasks/instances/daily-task-list/daily-task-list").then(
            (m) => m.DailyTaskList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Mis Tareas Diarias",
          breadcrumb: "Mis Tareas",
        },
      },
    ],
  },
  {
    path: "reports",
    children: [
      {
        path: "supervision-report",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision-report/report-supervision").then(
            (m) => m.ReportSupervision,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reporte de Supervisión",
          breadcrumb: "Reporte de Supervisión",
        },
      },
      {
        path: "access-history",
        loadComponent: () =>
          import("@admin.luxuryapp/reports/access-history/bitacora-acceso-list").then(
            (m) => m.BitacoraAcceso,
          ),
        canActivate: [authGuard],
        data: {
          title: "Historial de Acceso",
          breadcrumb: "Historial de Acceso",
        },
      },
      {
        path: "maintenance-report",
        loadChildren: () =>
          import("src/app/routing/maintenance-report.routing").then(
            (m) => m.maintenanceReportRoutes,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reportes de Mantenimiento",
          breadcrumb: "Reportes de Mantenimiento",
        },
      },
      {
        path: "service-orders-summary",
        loadComponent: () =>
          import("@operations.luxuryapp/service-orders/service-order/resumen-ordenes-servicio").then(
            (m) => m.ResumenOrdenesServicio,
          ),
        canActivate: [authGuard],
        data: {
          title: "Resumen de Órdenes de Servicio",
          breadcrumb: "Resumen de Órdenes de Servicio",
        },
      },
      {
        path: "pending-minutes",
        loadComponent: () =>
          import("@operations.luxuryapp/reports/pending-minutes/pending-minutes").then(
            (m) => m.PendingMinutes,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reporte de Minutas Pendientes",
          breadcrumb: "Reporte de Minutas Pendientes",
        },
      },
      {
        path: "financial-statements",
        loadComponent: () =>
          import("@operations.luxuryapp/reports/financial-statements/estados-financieros").then(
            (m) => m.EstadosFinancieros,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reporte de Estados Financieros",
          breadcrumb: "Reporte de Estados Financieros",
        },
      },
    ],
  },
  {
    path: "supervision",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/master-dashboard/master-dashboard").then(
            (m) => m.SupervisionMasterDashboard,
          ),
        canActivate: [authGuard],
        data: {
          title: "Supervision",
          breadcrumb: "Supervision",
        },
      },
      {
        path: "supervision-agenda",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/supervision-agenda/agenda-supervision").then(
            (m) => m.AgendaSupervision,
          ),
        canActivate: [authGuard],
        data: {
          title: "Agenda de Supervisión",
          breadcrumb: "Agenda de Supervisión",
        },
      },
      {
        path: "minutes-summary",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/minutes-summary/minutas-resumen").then(
            (m) => m.MinutasResumen,
          ),
        canActivate: [authGuard],
        data: {
          title: "Resumen de Minutas",
          breadcrumb: "Resumen de Minutas",
        },
      },
      {
        path: "tickets-report",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/ticket-report/reporte-tickets").then(
            (m) => m.ReporteTickets,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reporte de Tickets",
          breadcrumb: "Reporte de Tickets",
        },
      },
      {
        path: "general-result-chart",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/general-result-chart/resultado-general-grafico").then(
            (m) => m.ResultadoGeneralGrafico,
          ),
        canActivate: [authGuard],
        data: {
          title: "Gráfico de Resultado General",
          breadcrumb: "Gráfico de Resultado General",
        },
      },
      {
        path: "general-result-ranking",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/general-result-ranking/resultado-general-posicion").then(
            (m) => m.ResultadoGeneralPosicion,
          ),
        canActivate: [authGuard],
        data: {
          title: "Resultado General por Posición",
          breadcrumb: "Resultado General por Posición",
        },
      },
      {
        path: "areas-evaluation",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/general-result-area-evaluation/resultado-general-evaluacion-areas").then(
            (m) => m.ResultadoGeneralEvaluacionAreas,
          ),
        canActivate: [authGuard],
        data: {
          title: "Evaluación de Áreas",
          breadcrumb: "Evaluación de Áreas",
        },
      },
      {
        path: "general-result-dashboard",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/general-result-dashboard/resultado-general-dashboard").then(
            (m) => m.ResultadoGeneralDashboard,
          ),
        canActivate: [authGuard],
        data: {
          title: "Dashboard de Resultado General",
          breadcrumb: "Dashboard de Resultado General",
        },
      },
      {
        path: "supervision-report",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision-report/report-supervision").then(
            (m) => m.ReportSupervision,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reporte de Supervisión",
          breadcrumb: "Reporte de Supervisión",
        },
      },
      {
        path: "committee-meeting-presentations",
        loadComponent: () =>
          import("@operations.luxuryapp/supervision/supervision/committee-meeting-presentations/presentaciones-juntas-comite").then(
            (m) => m.PresentacionesJuntasComite,
          ),
        canActivate: [authGuard],
        data: {
          title: "Presentaciones de Juntas de Comité",
          breadcrumb: "Presentaciones de Juntas de Comité",
        },
      },
    ],
  },
  {
    path: "utilities/calculate-vat",
    loadComponent: () =>
      import("@operations.luxuryapp/inventory/tools/calculator-list").then(
        (m) => m.CalculatorList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Calcular IVA",
      breadcrumb: "Calcular IVA",
    },
  },
  {
    path: "initial-implementation/machinery-survey",
    loadComponent: () =>
      import("@operations.luxuryapp/initial-implementation/machinery-survey/machinery-survey").then(
        (m) => m.MachinerySurvey,
      ),
    canActivate: [authGuard],
    data: {
      title: "Levantamiento de Maquinaria",
      breadcrumb: "Levantamiento de Maquinaria",
    },
  },
  {
    path: "initial-implementation/staff-evaluation",
    loadComponent: () =>
      import("@operations.luxuryapp/initial-implementation/staff-evaluation/staff-evaluation").then(
        (m) => m.StaffEvaluation,
      ),
    canActivate: [authGuard],
    data: {
      title: "Evaluación del Personal",
      breadcrumb: "Evaluación del Personal",
    },
  },
  {
    path: "initial-implementation/pending-vendor-projects",
    loadComponent: () =>
      import("@operations.luxuryapp/initial-implementation/pending-vendor-projects/pending-vendor-projects").then(
        (m) => m.PendingVendorProjects,
      ),
    canActivate: [authGuard],
    data: {
      title: "Proyectos con Proveedores Pendientes",
      breadcrumb: "Proyectos con Proveedores Pendientes",
    },
  },
  {
    path: "initial-implementation/active-policies",
    loadComponent: () =>
      import("@operations.luxuryapp/initial-implementation/active-policies/active-policies").then(
        (m) => m.ActivePolicies,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pólizas Vigentes",
      breadcrumb: "Pólizas Vigentes",
    },
  },
];

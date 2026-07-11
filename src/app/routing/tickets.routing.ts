import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const ticketsRoutes: Routes = [
  {
    path: "groups-list",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/work-group/pages/task-group-list").then(
        (m) => m.TaskGroupList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Grupos de Trabajo", // Ajustado a mayúsculas
      breadcrumb: "Grupos de Trabajo",
    },
  },
  {
    path: "my-assignments",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/my-tasks/pages/my-assigned-tasks-list").then(
        (m) => m.MyAssignedTasksList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Asignaciones", // Ajustado a mayúsculas
      breadcrumb: "Mis Asignaciones",
    },
  },
  {
    path: "my-requests",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/my-tasks/pages/my-requests-task").then(
        (m) => m.MyRequestsTask,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mis Solicitudes", // Ajustado a mayúsculas
      breadcrumb: "Mis Solicitudes",
    },
  },
  {
    path: "messages/:ticketGroupId",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/pages/task-list").then(
        (m) => m.TaskList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de Tickets", // Mejorado para ser más específico
      breadcrumb: "Listado de Tickets",
    },
  },
  {
    path: "pending-board/:ticketGroupId",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/pages/task-pending-board").then(
        (m) => m.TaskPendingBoard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tablero de Pendientes",
      breadcrumb: "Tablero de Pendientes",
    },
  },
  {
    path: "message/:ticketMessageId/:ticketGroupId",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/pages/task-view").then(
        (m) => m.TaskView,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle del Ticket", // Mejorado para ser más específico
      breadcrumb: "Detalle del Ticket",
    },
  },
  {
    path: "reports",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/pages/task-report").then(
        (m) => m.TaskReport,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reportes de Tickets", // Mejorado para ser más específico
      breadcrumb: "Reportes de Tickets",
    },
  },
  {
    path: "summary", // Ruta anterior: 'resumen'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/reports/pages/task-report-resumen").then(
        (m) => m.TaskMessageReportResumen,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen de Tickets",
      breadcrumb: "Resumen de Tickets",
    },
  },
  {
    path: "work-plan",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/reports/pages/task-report-work-plan").then(
        (m) => m.TaskReportWorkPlan,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plan de Trabajo",
      breadcrumb: "Plan de Trabajo",
    },
  },
  {
    path: "work-plan-preview",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/reports/pages/task-report-work-plan-preview").then(
        (m) => m.TaskReportWorkPlanPreview,
      ),
    canActivate: [authGuard],
    data: {
      title: "Vista Previa del Plan de Trabajo",
      breadcrumb: "Vista Previa del Plan de Trabajo",
    },
  },
  {
    path: "weekly-report",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/reports/pages/task-operation-report").then(
        (m) => m.TaskMessageOperationReport,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte Semanal",
      breadcrumb: "Reporte Semanal",
    },
  },
  {
    path: "weekly-report-preview",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/reports/pages/task-weekly-report-preview").then(
        (m) => m.TaskWeeklyReportPreview,
      ),
    canActivate: [authGuard],
    data: {
      title: "Vista Previa del Reporte Semanal",
      breadcrumb: "Vista Previa del Reporte Semanal",
    },
  },
  {
    // Suggested path: 'legal'
    path: "legal",
    loadComponent: () =>
      import("src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista-cliente").then(
        (m) => m.TicketLegalListaCliente,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tickets Legales",
      breadcrumb: "Tickets Legales",
    },
  },
  {
    path: "legal/:ticketGroupId",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/task-engine/tasks/task-message/pages/task-list").then(
        (m) => m.TaskList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tickets Legales",
      breadcrumb: "Tickets Legales",
    },
  },
];

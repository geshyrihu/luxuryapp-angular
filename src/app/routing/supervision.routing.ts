import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const supervisionRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/features/tenant/supervision/master-dashboard/master-dashboard").then(
        (m) => m.SupervisionMasterDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Supervision",
      breadcrumb: "Supervision",
    },
  },
  {
    path: "supervision-agenda", // Ruta anterior: 'agenda-supervision'
    loadComponent: () =>
      import("src/app/features/tenant/supervision/agenda-supervision/agenda-supervision").then(
        (m) => m.AgendaSupervision,
      ),
    canActivate: [authGuard],
    data: {
      title: "Agenda de Supervisión",
      breadcrumb: "Agenda de Supervisión",
    },
  },
  {
    path: "minutes-summary", // Ruta anterior: 'minutas-resumen'
    loadComponent: () =>
      import("src/app/features/tenant/supervision/minutas-resumen/minutas-resumen").then(
        (m) => m.MinutasResumen,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen de Minutas", // Mejorado para mayor claridad
      breadcrumb: "Resumen de Minutas",
    },
  },
  {
    path: "tickets-report", // Ruta anterior: 'reporte-tickets'
    loadComponent: () =>
      import("src/app/features/tenant/supervision/reporte-tickets/reporte-tickets").then(
        (m) => m.ReporteTickets,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Tickets",
      breadcrumb: "Reporte de Tickets",
    },
  },
  {
    // Suggested path: 'general-result-chart'
    path: "grafico-resultado-general",
    loadComponent: () =>
      import("src/app/features/tenant/supervision/resultado-general-grafico/resultado-general-grafico").then(
        (m) => m.ResultadoGeneralGrafico,
      ),
    canActivate: [authGuard],
    data: {
      title: "Gráfico de Resultado General", // Mejorado para mayor claridad
      breadcrumb: "Gráfico de Resultado General",
    },
  },
  {
    // Suggested path: 'general-result-position'
    path: "resultado-general-posicion",
    loadComponent: () =>
      import("src/app/features/tenant/supervision/resultado-general-posicion/resultado-general-posicion").then(
        (m) => m.ResultadoGeneralPosicion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resultado General por Posición",
      breadcrumb: "Resultado General por Posición",
    },
  },
  {
    path: "areas-evaluation", // Ruta anterior: 'evaluacion-areas'
    loadComponent: () =>
      import("src/app/features/tenant/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas").then(
        (m) => m.ResultadoGeneralEvaluacionAreas,
      ),
    canActivate: [authGuard],
    data: {
      title: "Evaluación de Áreas",
      breadcrumb: "Evaluación de Áreas",
    },
  },
  {
    path: "general-result-dashboard", // Ruta anterior: 'resultado-general-dashboard'
    loadComponent: () =>
      import("src/app/features/tenant/supervision/resultado-general-dashboard/resultado-general-dashboard").then(
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
      import("src/app/features/tenant/supervision-report/report-supervision").then(
        (m) => m.ReportSupervision,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Supervisión",
      breadcrumb: "Reporte de Supervisión",
    },
  },
  {
    // Suggested path: 'committee-meetings-presentations'
    path: "presentaciones-juntas-comite",
    loadComponent: () =>
      import("src/app/features/tenant/supervision/presentaciones-juntas-comite/presentaciones-juntas-comite").then(
        (m) => m.PresentacionesJuntasComite,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presentaciones de Juntas de Comité", // Ajustado para mayor claridad
      breadcrumb: "Presentaciones de Juntas de Comité",
    },
  },
];












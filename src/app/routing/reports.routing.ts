import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const reportsRoutes: Routes = [
  {
    path: "supervision-report", // Ruta anterior: 'report-supervision'
    loadComponent: () =>
      import("src/app/features/tenant/supervision-report/report-supervision").then(
        (m) => m.ReportSupervision,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de SupervisiÃ³n", // Ajustado para consistencia
      breadcrumb: "Reporte de SupervisiÃ³n",
    },
  },
  {
    path: "access-history",
    loadComponent: () =>
      import("src/app/features/tenant/access-history/bitacora-acceso-list").then(
        (m) => m.BitacoraAcceso,
      ),
    canActivate: [authGuard],
    data: {
      title: "Historial de Acceso",
      breadcrumb: "Historial de Acceso",
    },
  },
  // Se combinaron las dos rutas duplicadas 'maintenance-report' en una sola.
  {
    path: "maintenance-report",
    loadChildren: () =>
      import("src/app/routing/maintenance-report.routing").then(
        (m) => m.maintenanceReportRoutes,
      ),
    canActivate: [authGuard],

    data: {
      title: "Reportes de Mantenimiento", // TÃ­tulo mejorado
      breadcrumb: "Reportes de Mantenimiento",
    },
  },
  {
    // Suggested path: 'service-orders-summary'
    path: "resumen-ordenes-servicio",
    loadComponent: () =>
      import("src/app/features/tenant/service-order/resumen-ordenes-servicio").then(
        (m) => m.ResumenOrdenesServicio,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen de Ã“rdenes de Servicio", // Ajustado acento
      breadcrumb: "Resumen de Ã“rdenes de Servicio",
    },
  },
  // Route removed because report is generated directly to PDF
  {
    path: "pending-minutes",
    loadComponent: () =>
      import("src/app/features/tenant/reports/pending-minutes/pending-minutes").then(
        (m) => m.PendingMinutes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Minutas Pendientes", // Ajustado a mayÃºsculas
      breadcrumb: "Reporte de Minutas Pendientes",
    },
  },
  {
    path: "financial-statements", // Ruta anterior: 'estados-financieros'
    loadComponent: () =>
      import("src/app/features/tenant/reports/estados-financieros/estados-financieros").then(
        (m) => m.EstadosFinancieros,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Estados Financieros", // Ajustado para consistencia
      breadcrumb: "Reporte de Estados Financieros",
    },
  },
];


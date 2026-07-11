import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const reportsRoutes: Routes = [
  {
    path: "supervision-report", // Ruta anterior: 'report-supervision'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/supervision/supervision-report/report-supervision").then(
        (m) => m.ReportSupervision,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Supervisión", // Ajustado para consistencia
      breadcrumb: "Reporte de Supervisión",
    },
  },
  {
    path: "access-history",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/reportes/access-history/bitacora-acceso-list").then(
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
      title: "Reportes de Mantenimiento", // Título mejorado
      breadcrumb: "Reportes de Mantenimiento",
    },
  },
  {
    // Suggested path: 'service-orders-summary'
    path: "resumen-ordenes-servicio",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/field-service/service-order/resumen-ordenes-servicio").then(
        (m) => m.ResumenOrdenesServicio,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen de Órdenes de Servicio", // Ajustado acento
      breadcrumb: "Resumen de Órdenes de Servicio",
    },
  },
  // Route removed because report is generated directly to PDF
  {
    path: "pending-minutes",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/reports/pending-minutes/pending-minutes").then(
        (m) => m.PendingMinutes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Minutas Pendientes", // Ajustado a mayúsculas
      breadcrumb: "Reporte de Minutas Pendientes",
    },
  },
  {
    path: "financial-statements", // Ruta anterior: 'estados-financieros'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/reports/estados-financieros/estados-financieros").then(
        (m) => m.EstadosFinancieros,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Estados Financieros", // Ajustado para consistencia
      breadcrumb: "Reporte de Estados Financieros",
    },
  },
];

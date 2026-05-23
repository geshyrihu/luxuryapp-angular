import { Routes } from "@angular/router";
//Si se modifica esta ruta hay que revisar como esta actual ya que aqui entran ligas enviadas por correo
export const publicRoutes: Routes = [
  {
    // Suggested path: 'operation-report/:customer/:start/:end'
    path: "reporte-operacion/:customer/:inicio/:final",
    loadComponent: () =>
      import("src/app/features/reports/report-client/report-client").then(
        (m) => m.ReportClient,
      ),
    data: {
      title: "Reporte de Operación", // Ajustado para consistencia
      breadcrumb: "Reporte de Operación",
    },
  },
  {
    path: "operation-report-client/:customer/:inicio/:final",
    loadComponent: () =>
      import("src/app/features/reports/operation-report-client/operation-report-client").then(
        (m) => m.OperationReportClient,
      ),
    data: {
      title: "Reporte de Operación del Cliente", // Ajustado para mayor claridad
      breadcrumb: "Reporte de Operación del Cliente",
    },
  },
  {
    // publico/reporte-minuta
    // Suggested path: 'minute-report/:customer/:id'
    path: "reporte-minuta/:customer/:id",
    loadComponent: () =>
      import("src/app/features/reports/report-meeting/report-meeting").then(
        (m) => m.ReportMeeting,
      ),
    data: {
      title: "Reporte de Minuta",
      breadcrumb: "Reporte de Minuta",
    },
  },
  {
    // Suggested path: 'provider-pending-tickets-report/:customerId/:departmentId'
    path: "reporte-ticket-pendientes-proveedor/:customerId/:departamentId",
    loadComponent: () =>
      import("src/app/features/reports/reporte-ticket-pendientes-proveedor/reporte-ticket-pendientes-proveedor").then(
        (m) => m.ReporteTicketPendientesProveedor,
      ),
    data: {
      title: "Reporte de Tickets Pendientes de Proveedor", // Ajustado para mayor claridad gramatical
      breadcrumb: "Reporte de Tickets Pendientes de Proveedor",
    },
  },
  {
    path: "contabilidad-cliente/:customerId/:anio/:mes",
    loadComponent: () =>
      import("src/app/features/contabilidad/contabilidad-cliente/pages/contabilidad-cliente-wrapper").then(
        (m) => m.default,
      ),
    data: {
      title: "Estados Financieros Cliente",
      breadcrumb: "Estados Financieros Cliente",
    },
  },
];











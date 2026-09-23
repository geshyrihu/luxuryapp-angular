import { Routes } from "@angular/router";

export const publicRoutes: Routes = [
  {
    path: "operation-report/:customer/:start/:end",
    loadComponent: () =>
      import("@operations.luxuryapp/reports/report-client/report-client").then(
        (m) => m.ReportClient,
      ),
    data: {
      title: "Reporte de Operación",
      breadcrumb: "Reporte de Operación",
    },
  },
  {
    path: "operation-report-client/:customer/:start/:end",
    loadComponent: () =>
      import("@operations.luxuryapp/reports/operation-report-client/operation-report-client").then(
        (m) => m.OperationReportClient,
      ),
    data: {
      title: "Reporte de Operación del Cliente",
      breadcrumb: "Reporte de Operación del Cliente",
    },
  },
  {
    path: "minute-report/:customer/:id",
    loadComponent: () =>
      import("@operations.luxuryapp/reports/report-meeting/report-meeting").then(
        (m) => m.ReportMeeting,
      ),
    data: {
      title: "Reporte de Minuta",
      breadcrumb: "Reporte de Minuta",
    },
  },
  {
    path: "provider-pending-tickets-report/:customerId/:departmentId",
    loadComponent: () =>
      import("@operations.luxuryapp/reports/report-pending-provider-tickets/reporte-ticket-pendientes-proveedor").then(
        (m) => m.ReporteTicketPendientesProveedor,
      ),
    data: {
      title: "Reporte de Tickets Pendientes de Proveedor",
      breadcrumb: "Reporte de Tickets Pendientes de Proveedor",
    },
  },
  {
    path: "client-accounting/:customerId/:anio/:mes",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/financial-reports/client/client-reports-wrapper").then(
        (m) => m.default,
      ),
    data: {
      title: "Estados Financieros Cliente",
      breadcrumb: "Estados Financieros Cliente",
    },
  },
];

import { Routes } from "@angular/router";
export const maintenanceReportRoutes: Routes = [
  {
    path: "panel",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/maintenance-reports-list").then(
        (m) => m.MaintenanceReports,
      ),
    data: {
      title: "Panel de Reportes de Mantenimiento", // Mejorado para mayor claridad
      breadcrumb: "Panel de Reportes de Mantenimiento",
    },
  },
  {
    path: "maintenances-summary", // Ruta anterior: 'resumen-mantenimientos'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/maintenance-summary/resumen-mantenimientos").then(
        (m) => m.ResumenMantenimientos,
      ),
    data: {
      title: "Resumen de Mantenimientos", // Ajustado a mayúsculas
      breadcrumb: "Resumen de Mantenimientos",
    },
  },
  {
    path: "consumptions", // Ruta anterior: 'consumos'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-consumos/report-consumos").then(
        (m) => m.ReportConsumos,
      ),
    data: {
      title: "Reporte de Consumos", // Ajustado para consistencia
      breadcrumb: "Reporte de Consumos",
    },
  },
  {
    path: "warehouse-entry", // Ruta anterior: 'entrada-almacen'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-warehouse-entry/report-entrada-almacen").then(
        (m) => m.ReportEntradaAlmacen,
      ),
    data: {
      title: "Reporte de Entradas a Almacén", // Ajustado para consistencia
      breadcrumb: "Reporte de Entradas a Almacén",
    },
  },
  {
    path: "warehouse-exit", // Ruta anterior: 'salida-almacen'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-warehouse-exit/report-salida-almacen").then(
        (m) => m.ReportSalidaAlmacen,
      ),
    data: {
      title: "Reporte de Salidas de Almacén", // Ajustado para consistencia
      breadcrumb: "Reporte de Salidas de Almacén",
    },
  },
  {
    path: "daily-tour", // Ruta anterior: 'recorrido-diario'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-recorrido-diario/report-recorrido-diario").then(
        (m) => m.ReportRecorridoDiario,
      ),
    data: {
      title: "Reporte de Recorrido Diario", // Ajustado para consistencia
      breadcrumb: "Reporte de Recorrido Diario",
    },
  },
  {
    path: "tool-loan-report", // Ruta anterior: 'prestamo-herramienta'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-prestamo-herramienta/report-prestamo-herramienta").then(
        (m) => m.ReportPrestamoHerramienta,
      ),
    data: {
      title: "Reporte de Préstamo de Herramientas", // Ajustado para consistencia
      breadcrumb: "Reporte de Préstamo de Herramientas",
    },
  },
  {
    path: "purchase-request-report", // Ruta anterior: 'solicitud-compra'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-purchase-request/report-solicitud-compra").then(
        (m) => m.ReportSolicitudCompra,
      ),
    data: {
      title: "Reporte de Solicitudes de Compra", // Ajustado para consistencia
      breadcrumb: "Reporte de Solicitudes de Compra",
    },
  },
  {
    path: "pool-report", // Ruta anterior: 'alberca'
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-bitacora-alberca/report-bitacora-alberca").then(
        (m) => m.ReportBitacoraAlberca,
      ),
    data: {
      title: "Reporte de Bitácora de Alberca", // Ajustado para consistencia
      breadcrumb: "Reporte de Bitácora de Alberca",
    },
  },
  {
    path: "tickets",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-reports/report-ticket/report-ticket").then(
        (m) => m.ReportTicket,
      ),
    data: {
      title: "Reporte de Tickets", // Ajustado para consistencia
      breadcrumb: "Reporte de Tickets",
    },
  },
  {
    path: "elevators", // Ruta anterior: 'elevadores'
    loadComponent: () =>
      import("@maintenance.luxuryapp/logs/elevator-emergency-call/elevators-emergency-call-list").then(
        (m) => m.ElevatorsEmergencyCallList,
      ),
    data: {
      title: "Reporte de Llamados de Elevador", // Ajustado para ser más específico
      breadcrumb: "Reporte de Llamados de Elevador",
    },
  },
  // {
  //   path: "preventive-maintenance-report", // Ruta anterior: 'mantenimiento-preventivo-reporte'
  //   loadComponent: () =>
  //     import(
  //       "@operations.luxuryapp/field-service/reporte-ordenes-servicio"
  //     ).then((m) => m.ReporteOrdenesServicio),
  //   data: {
  //     title: "Reporte de Mantenimiento Preventivo",
  //     breadcrumb: "Reporte de Mantenimiento Preventivo",
  //   },
  // },
  {
    // Suggested path: 'service-order-support/:id'
    path: "soporte-orden-servicio/:id",
    loadComponent: () =>
      import("@operations.luxuryapp/field-service/service-order/soporte-orden-servicio").then(
        (m) => m.SoporteOrdenServicio,
      ),
    data: {
      title: "Soporte a Orden de Servicio",
      breadcrumb: "Soporte a Orden de Servicio",
    },
  },
];


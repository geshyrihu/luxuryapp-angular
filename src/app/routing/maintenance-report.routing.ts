import { Routes } from "@angular/router";
export const maintenanceReportRoutes: Routes = [
  {
    path: "panel",
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/maintenance-reports-list").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/resumen-mantenimientos/resumen-mantenimientos").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-consumos/report-consumos").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-entrada-almacen/report-entrada-almacen").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-salida-almacen/report-salida-almacen").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-recorrido-diario/report-recorrido-diario").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-prestamo-herramienta/report-prestamo-herramienta").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-solicitud-compra/report-solicitud-compra").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-bitacora-alberca/report-bitacora-alberca").then(
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
      import("src/app/apps/operations.luxuryapp/inspecciones-y-auditora/reports-mantenance/report-ticket/report-ticket").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/logs/elevator-emergency-call/elevators-emergency-call-list").then(
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
  //       "src/app/apps/operations.luxuryapp/field-service/reporte-ordenes-servicio"
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
      import("src/app/apps/operations.luxuryapp/field-service/service-order/soporte-orden-servicio").then(
        (m) => m.SoporteOrdenServicio,
      ),
    data: {
      title: "Soporte a Orden de Servicio",
      breadcrumb: "Soporte a Orden de Servicio",
    },
  },
];

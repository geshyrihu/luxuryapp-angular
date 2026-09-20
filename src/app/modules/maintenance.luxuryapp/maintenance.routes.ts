import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { superUserGuard } from "@core/auth/guards/super-user.guard";
import { EDocumentType } from "@legal.luxuryapp/legal/interfaces/document-type.enum";

export const maintenanceRoutes: Routes = [
  {
    path: "annual-calendar",
    loadComponent: () =>
      import("@operations.luxuryapp/google-calendar/calendar/preventive-maintenance/calendario-mtto-list").then(
        (m) => m.CalendarioMttoList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Calendario Anual de Mantenimiento",
      breadcrumb: "Calendario Anual de Mantenimiento",
    },
  },
  {
    path: "inspection",
    children: [
      {
        path: "catalog",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/inspection-list/lista-inspecciones").then(
            (m) => m.ListaInspecciones,
          ),
        canActivate: [authGuard],
        data: {
          title: "Catalogo de inspections",
          breadcrumb: "Catalogo de inspections",
        },
      },
      {
        path: "details/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/inspection-detail/inspection-detalle").then(
            (m) => m.InspectionDetailComponent,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspection detalle",
          breadcrumb: "Inspection detalle",
        },
      },
      {
        path: "inspection-report-list",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/inspection-report-list/lista-informe-inspeccion").then(
            (m) => m.ListaInformeInspeccion,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspections report list",
          breadcrumb: "Inspections report list",
        },
      },
      {
        path: "my-inspection-list",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/logbook/mis-inspecciones-lista").then(
            (m) => m.MisInspeccionesLista,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspections",
          breadcrumb: "Inspections",
        },
      },
      {
        path: "my-inspection",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/logbook/mis-inspecciones-ejecutar").then(
            (m) => m.MisInspeccionesEjecutar,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspections",
          breadcrumb: "Inspections",
        },
      },
      {
        path: "result/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/inspection-result/resultado-inspeccion").then(
            (m) => m.ResultadoInspeccion,
          ),
        canActivate: [authGuard],
        data: {
          title: "Resultado",
          breadcrumb: "Resultado",
        },
      },
    ],
  },
  {
    path: "logbook",
    children: [
      {
        path: "maintenance-orders",
        loadComponent: () =>
          import("@operations.luxuryapp/service-orders/service-order/ordenes-servicio-list").then(
            (m) => m.OrdenesServicio,
          ),
        canActivate: [authGuard],
        data: {
          title: "Órdenes de Mantenimiento",
          breadcrumb: "Órdenes de Mantenimiento",
        },
      },
      {
        path: "inspections-areas",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/inspection-areas/inspections-areas").then(
            (m) => m.InspectionsAreas,
          ),
        canActivate: [authGuard],
        data: {
          title: "Áreas de Inspección",
          breadcrumb: "Áreas de Inspección",
        },
      },
      {
        path: "pool",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/pool/piscina-list").then(
            (m) => m.PiscinaList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Bitácora de Piscinas",
          breadcrumb: "Bitácora de Piscinas",
        },
      },
      {
        path: "pool-logbook/:poolId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/pool-logbook/piscina-bitacora-list").then(
            (m) => m.PiscinaBitacoraList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Registro de Bitácora de Piscina",
          breadcrumb: "Registro de Bitácora de Piscina",
        },
      },
      {
        path: "meter-list",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/logbooks/meters/medidores-list").then(
            (m) => m.MedidoresList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Lista de Medidores",
          breadcrumb: "Lista de Medidores",
        },
      },
      {
        path: "meter-reading-list/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/logbooks/meters/medidor-lectura-list").then(
            (m) => m.MedidorLecturaList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Lectura de Medidor",
          breadcrumb: "Lectura de Medidor",
        },
      },
      {
        path: "chart/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/logbooks/meters/medidor-lectura-chart").then(
            (m) => m.MedidorLecturaChart,
          ),
        canActivate: [authGuard],
        data: {
          title: "Gráfico de Lectura",
          breadcrumb: "Gráfico de Lectura",
        },
      },
      {
        path: "elevator-spare-parts-change",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/elevator-spare-parts/elevator-spare-parts-change-list").then(
            (m) => m.ElevatorSparePartsChangeList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Cambio de Refacciones de Elevador",
          breadcrumb: "Cambio de Refacciones de Elevador",
        },
      },
      {
        path: "elevators-emergency-call",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/elevator-emergency-call/elevators-emergency-call-list").then(
            (m) => m.ElevatorsEmergencyCallList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Llamados de Emergencia de Elevador",
          breadcrumb: "Llamados de Emergencia de Elevador",
        },
      },
      {
        path: "my-inspection-execution/:customerInspectionId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/inspection/logbook/mis-inspecciones-ejecutar").then(
            (m) => m.MisInspeccionesEjecutar,
          ),
        canActivate: [authGuard],
        data: {
          title: "Ejecutar Inspección",
          breadcrumb: "Ejecutar Inspección",
        },
      },
      {
        path: "water-truck-reception",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/water-truck-receipts/recepcion-pipas-agua-list").then(
            (m) => m.RecepcionPipasAguaList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Recepcion de Pipas de Agua",
          breadcrumb: "Recepcion de Pipas de Agua",
        },
      },
      {
        path: "water-truck-reception/report",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/water-truck-receipts/recepcion-pipas-agua-reporte").then(
            (m) => m.RecepcionPipasAguaReporte,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reporte de Pipas de Agua",
          breadcrumb: "Reporte",
        },
      },
      {
        path: "water-truck-reception/analysis",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/water-truck-receipts/recepcion-pipas-agua-analisis").then(
            (m) => m.RecepcionPipasAguaAnalisis,
          ),
        canActivate: [authGuard],
        data: {
          title: "Analisis de Pipas de Agua",
          breadcrumb: "Analisis",
        },
      },
      {
        path: "fire-extinguisher-log/:extinguisherId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/extinguisher-log/extintor-bitacora-list").then(
            (m) => m.ExtintorBitacoraList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Historial de Inspecciones de Extintor",
          breadcrumb: "Historial de Extintor",
        },
      },
      {
        path: "fire-extinguisher-checklist/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/extinguisher-checklist/extintor-checklist").then(
            (m) => m.ExtintorChecklist,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspección de Extintor",
          breadcrumb: "Checklist Extintor",
        },
      },
      {
        path: "fire-equipment-scanner",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/qr-scanner/qr-scanner").then(
            (m) => m.QrScanner,
          ),
        canActivate: [authGuard],
        data: {
          title: "Escanear Equipo Contra Incendio",
          breadcrumb: "Scanner QR",
        },
      },
      {
        path: "equipment-inspection/:code",
        loadComponent: () =>
          import("@maintenance.luxuryapp/machinery/equipment-inspections/equipment-inspection-qr-entry").then(
            (m) => m.EquipmentInspectionQrEntry,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspeccion de Equipo",
          breadcrumb: "Inspeccion de Equipo",
        },
      },
      {
        path: "hydrant-log/:hydrantId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/hydrant-log/hidrante-bitacora-list").then(
            (m) => m.HidranteBitacoraList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Historial de Inspecciones de Hidrante",
          breadcrumb: "Historial de Hidrante",
        },
      },
      {
        path: "hydrant-checklist/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/hydrant-checklist/hidrante-checklist").then(
            (m) => m.HidranteChecklist,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspección de Hidrante",
          breadcrumb: "Checklist Hidrante",
        },
      },
      {
        path: "manual-call-point-log/:stationId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/manual-call-point-log/estacion-manual-bitacora-list").then(
            (m) => m.EstacionManualBitacoraList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Historial de Inspecciones de Estación Manual",
          breadcrumb: "Historial de Estación Manual",
        },
      },
      {
        path: "manual-call-point-checklist/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/manual-call-point-checklist/estacion-manual-checklist").then(
            (m) => m.EstacionManualChecklist,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspección de Estación Manual",
          breadcrumb: "Checklist Estación Manual",
        },
      },
      {
        path: "smoke-detector-log/:detectorId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/smoke-detector-log/detector-humo-bitacora-list").then(
            (m) => m.DetectorHumoBitacoraList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Historial de Inspecciones de Detector de Humo",
          breadcrumb: "Historial de Detector de Humo",
        },
      },
      {
        path: "smoke-detector-checklist/:id",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/smoke-detector-checklist/detector-humo-checklist").then(
            (m) => m.DetectorHumoChecklist,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inspección de Detector de Humo",
          breadcrumb: "Checklist Detector de Humo",
        },
      },
      {
        path: "fire-inspection-periods",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/inspection-periods/period-list/fire-inspection-period-list").then(
            (m) => m.FireInspectionPeriodList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Periodos de Inspección Contra Incendio",
          breadcrumb: "Periodos de Inspección",
        },
      },
      {
        path: "fire-inspection-cycles",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/inspection-periods/cycle-list/fire-inspection-cycle-list").then(
            (m) => m.FireInspectionCycleList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Ciclos de Inspección Contra Incendio",
          breadcrumb: "Ciclos de Inspección",
        },
      },
      {
        path: "fire-inspection-cycle/:cycleId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/inspection-periods/cycle-detail/fire-inspection-cycle-detail").then(
            (m) => m.FireInspectionCycleDetail,
          ),
        canActivate: [authGuard],
        data: {
          title: "Detalle del Ciclo de Inspección",
          breadcrumb: "Detalle del Ciclo",
        },
      },
      {
        path: "fire-inspection-period-extintor/:periodId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail").then(
            (m) => m.FireInspectionPeriodExtintorDetail,
          ),
        canActivate: [authGuard],
        data: {
          title: "Periodo de Inspección — Extintores",
          breadcrumb: "Detalle de Periodo",
        },
      },
      {
        path: "fire-inspection-period-hidrante/:periodId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail").then(
            (m) => m.FireInspectionPeriodHidranteDetail,
          ),
        canActivate: [authGuard],
        data: {
          title: "Periodo de Inspección — Hidrantes",
          breadcrumb: "Detalle de Periodo",
        },
      },
      {
        path: "fire-inspection-period-estacion/:periodId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail").then(
            (m) => m.FireInspectionPeriodEstacionDetail,
          ),
        canActivate: [authGuard],
        data: {
          title: "Periodo de Inspección — Estaciones Manuales",
          breadcrumb: "Detalle de Periodo",
        },
      },
      {
        path: "fire-inspection-period-detector/:periodId",
        loadComponent: () =>
          import("@maintenance.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail").then(
            (m) => m.FireInspectionPeriodDetectorDetail,
          ),
        canActivate: [authGuard],
        data: {
          title: "Periodo de Inspección — Detectores de Humo",
          breadcrumb: "Detalle de Periodo",
        },
      },
    ],
  },
  {
    path: "warehouse",
    children: [
      {
        path: "list",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/warehouse/warehouse-list").then(
            (m) => m.WarehouseList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Listado de Almacenes",
          breadcrumb: "Listado de Almacenes",
        },
      },
      {
        path: "products/:warehouseId",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/stock-by-warehouse/warehouse-stock-list").then(
            (m) => m.WarehouseStockList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Productos",
          breadcrumb: "Inventario de Productos",
        },
      },
      {
        path: "product-output",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/product-exit/product-output-list").then(
            (m) => m.ProductOutputList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Salida de Productos",
          breadcrumb: "Salida de Productos",
        },
      },
      {
        path: "product-entry",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/product-entry/product-entry-list").then(
            (m) => m.ProductEntryList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrada de Productos",
          breadcrumb: "Entrada de Productos",
        },
      },
      {
        path: "tool-loan",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/logbooks/tool-loan/prestamo-herramientas-control").then(
            (m) => m.PrestamoHerramientasControl,
          ),
        canActivate: [authGuard],
        data: {
          title: "Préstamo de Herramientas",
          breadcrumb: "Préstamo de Herramientas",
        },
      },
    ],
  },
  {
    path: "inventory",
    children: [
      {
        path: "inventory-engine-system",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/inventory-engine-system/inventory-engine-system").then(
            (m) => m.InventoryEngineSystem,
          ),
        canActivate: [authGuard],
        data: {
          title: "Sistema de Inventario",
          breadcrumb: "Sistema de Inventario",
        },
      },
      {
        path: "areas-equipment",
        loadComponent: () =>
          import("@maintenance.luxuryapp/machinery/machinery/equipos-list").then(
            (m) => m.EquiposList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Equipos por Categoría",
          breadcrumb: "Equipos por Categoría",
        },
      },
      {
        path: "gym",
        loadComponent: () =>
          import("@maintenance.luxuryapp/machinery/machinery/equipos-list").then(
            (m) => m.EquiposList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Equipos de Gimnasio",
          breadcrumb: "Equipos de Gimnasio",
        },
      },
      {
        path: "tools",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/tool-loan/tool-list").then(
            (m) => m.ToolList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Herramientas",
          breadcrumb: "Inventario de Herramientas",
        },
      },
      {
        path: "paint",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/paint-inventory/inventario-pintura").then(
            (m) => m.InventarioPintura,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Pintura",
          breadcrumb: "Inventario de Pintura",
        },
      },
      {
        path: "keys",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/key-inventory/inventario-llaves-list").then(
            (m) => m.InventarioLlavesList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Llaves",
          breadcrumb: "Inventario de Llaves",
        },
      },
      {
        path: "equipment-report",
        loadComponent: () =>
          import("@maintenance.luxuryapp/machinery/machinery-asset/reporte-completo-activos").then(
            (m) => m.ReporteCompletoActivos,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reporte de Equipos",
          breadcrumb: "Reporte de Equipos",
        },
      },
      {
        path: "radios",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/radio-communication-inventory/radio-comunicacion-list").then(
            (m) => m.RadioComunicacionList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Radios de Comunicación",
          breadcrumb: "Radios de Comunicación",
        },
      },
      {
        path: "annual-maintenance-schedule",
        loadComponent: () =>
          import("@operations.luxuryapp/reports/maintenance-budget/gastos-mantenimiento").then(
            (m) => m.GastosMantenimiento,
          ),
        canActivate: [authGuard],
        data: {
          title: "Cédula Anual de Mantenimientos",
          breadcrumb: "Cédula Anual de Mantenimientos",
        },
      },
      {
        path: "extinguishers",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/fire-extinguisher-inventory/inventario-extintor").then(
            (m) => m.InventarioExtintor,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Extintores",
          breadcrumb: "Inventario de Extintores",
        },
      },
      {
        path: "extinguisher-groups",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/fire-extinguisher-inventory/inventario-extintor-group").then(
            (m) => m.InventarioExtintorGroup,
          ),
        canActivate: [authGuard],
        data: {
          title: "Grupos de Extintores",
          breadcrumb: "Grupos de Extintores",
        },
      },
      {
        path: "hydrants",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/hydrant-inventory/inventario-hidrante").then(
            (m) => m.InventarioHidrante,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Hidrantes",
          breadcrumb: "Inventario de Hidrantes",
        },
      },
      {
        path: "manual-call-points",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/manual-call-point-inventory/inventario-estacion-manual").then(
            (m) => m.InventarioEstacionManual,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Estaciones Manuales",
          breadcrumb: "Inventario de Estaciones Manuales",
        },
      },
      {
        path: "smoke-detectors",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/smoke-detector-inventory/inventario-detector-humo").then(
            (m) => m.InventarioDetectorHumo,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Detectores de Humo",
          breadcrumb: "Inventario de Detectores de Humo",
        },
      },
    ],
  },
  {
    path: "reports",
    children: [
      {
        path: "panel",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/maintenance-reports-list").then(
            (m) => m.MaintenanceReports,
          ),
        data: {
          title: "Panel de Reportes de Mantenimiento",
          breadcrumb: "Panel de Reportes de Mantenimiento",
        },
      },
      {
        path: "maintenances-summary",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/maintenance-summary/resumen-mantenimientos").then(
            (m) => m.ResumenMantenimientos,
          ),
        data: {
          title: "Resumen de Mantenimientos",
          breadcrumb: "Resumen de Mantenimientos",
        },
      },
      {
        path: "consumptions",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/report-consumption/report-consumos").then(
            (m) => m.ReportConsumos,
          ),
        data: {
          title: "Reporte de Consumos",
          breadcrumb: "Reporte de Consumos",
        },
      },
      {
        path: "warehouse-entry",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/report-warehouse-entry/report-entrada-almacen").then(
            (m) => m.ReportEntradaAlmacen,
          ),
        data: {
          title: "Reporte de Entradas a Almacén",
          breadcrumb: "Reporte de Entradas a Almacén",
        },
      },
      {
        path: "warehouse-exit",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/report-warehouse-exit/report-salida-almacen").then(
            (m) => m.ReportSalidaAlmacen,
          ),
        data: {
          title: "Reporte de Salidas de Almacén",
          breadcrumb: "Reporte de Salidas de Almacén",
        },
      },
      {
        path: "daily-tour",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/report-daily-round/report-recorrido-diario").then(
            (m) => m.ReportRecorridoDiario,
          ),
        data: {
          title: "Reporte de Recorrido Diario",
          breadcrumb: "Reporte de Recorrido Diario",
        },
      },
      {
        path: "tool-loan-report",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/report-tool-loan/report-prestamo-herramienta").then(
            (m) => m.ReportPrestamoHerramienta,
          ),
        data: {
          title: "Reporte de Préstamo de Herramientas",
          breadcrumb: "Reporte de Préstamo de Herramientas",
        },
      },
      {
        path: "purchase-request-report",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/report-purchase-request/report-solicitud-compra").then(
            (m) => m.ReportSolicitudCompra,
          ),
        data: {
          title: "Reporte de Solicitudes de Compra",
          breadcrumb: "Reporte de Solicitudes de Compra",
        },
      },
      {
        path: "pool-report",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-reports/report-pool-logbook/report-bitacora-alberca").then(
            (m) => m.ReportBitacoraAlberca,
          ),
        data: {
          title: "Reporte de Bitácora de Alberca",
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
          title: "Reporte de Tickets",
          breadcrumb: "Reporte de Tickets",
        },
      },
      {
        path: "elevators",
        loadComponent: () =>
          import("@maintenance.luxuryapp/logs/elevator-emergency-call/elevators-emergency-call-list").then(
            (m) => m.ElevatorsEmergencyCallList,
          ),
        data: {
          title: "Reporte de Llamados de Elevador",
          breadcrumb: "Reporte de Llamados de Elevador",
        },
      },
      {
        path: "service-order-support/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/service-orders/service-order/soporte-orden-servicio").then(
            (m) => m.SoporteOrdenServicio,
          ),
        data: {
          title: "Soporte a Orden de Servicio",
          breadcrumb: "Soporte a Orden de Servicio",
        },
      },
    ],
  },
  {
    path: "library",
    children: [
      {
        path: "incorporation-deed",
        loadComponent: () =>
          import("@operations.luxuryapp/custom-documents/custom-document/acta-constitutiva-list").then(
            (m) => m.ActaConstitutivaList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Acta constitutiva",
          breadcrumb: "Acta constitutiva",
        },
      },
      {
        path: "financial-report",
        loadComponent: () =>
          import("@operations.luxuryapp/manuals/library/financial-report/informe-financiero-list").then(
            (m) => m.InformeFinanciero,
          ),
        canActivate: [authGuard],
        data: {
          title: "Informe Financiero",
          breadcrumb: "Informe Financiero",
        },
      },
      {
        path: "templates",
        loadComponent: () =>
          import("@operations.luxuryapp/templates/templates-list").then(
            (m) => m.TemplatesList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Formatos",
          breadcrumb: "Formatos",
        },
      },
      {
        path: "manuals-and-processes",
        loadComponent: () =>
          import("@operations.luxuryapp/manuals/library/manuals-and-processes/manuals-and-processes-list").then(
            (m) => m.ManualsAndProcessesList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Manuales y Procesos",
          breadcrumb: "Manuales y Procesos",
        },
      },
      {
        path: "manuals-and-processes/guide",
        loadComponent: () =>
          import("@operations.luxuryapp/manuals/library/manuals-and-processes/manuals-and-processes-guide/manuals-and-processes-guide").then(
            (m) => m.ManualsAndProcessesGuide,
          ),
        canActivate: [authGuard],
        data: {
          title: "Guía del Módulo",
          breadcrumb: "Guía",
        },
      },
      {
        path: "manuals-and-processes/detail/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/manuals/library/manuals-and-processes/manuals-and-processes-detail").then(
            (m) => m.ManualsAndProcessesDetail,
          ),
        canActivate: [authGuard],
        data: {
          title: "Detalle de Manual",
          breadcrumb: "Detalle",
        },
      },
      {
        path: "manuals-and-processes/editor/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/manuals/library/manuals-and-processes/manuals-and-processes-editor/manuals-and-processes-editor").then(
            (m) => m.ManualsAndProcessesEditor,
          ),
        canActivate: [authGuard, superUserGuard],
        data: {
          title: "Editor de Manual",
          breadcrumb: "Editor",
        },
      },
      {
        path: "manuals-and-processes/flowchart-editor/:id",
        loadComponent: () =>
          import("@operations.luxuryapp/manuals/library/manuals-and-processes/manual-flowchart-editor/manual-flowchart-editor").then(
            (m) => m.ManualFlowchartEditor,
          ),
        canActivate: [authGuard, superUserGuard],
        data: {
          title: "Editor de Diagrama",
          breadcrumb: "Diagrama",
        },
      },
      {
        path: "maintenance-policies",
        loadComponent: () =>
          import("@operations.luxuryapp/custom-documents/custom-document/policy-contract/policy-contract-list").then(
            (m) => m.PolicyContractList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Contratos y Pólizas",
          breadcrumb: "Contratos y Pólizas",
        },
      },
      {
        path: "contracts-policies-view-legal",
        loadComponent: () =>
          import("@operations.luxuryapp/reports/contracts-policies/contracts-policies").then(
            (m) => m.ContractsPolicies,
          ),
        canActivate: [authGuard],
        data: {
          title: "Vista de Contratos y Pólizas",
          breadcrumb: "Vista de Contratos y Pólizas",
        },
      },
      {
        path: "assemblies",
        loadComponent: () =>
          import("@operations.luxuryapp/custom-documents/custom-document/asambleas-list").then(
            (m) => m.Asambleas,
          ),
        canActivate: [authGuard],
        data: {
          title: "Asambleas",
          breadcrumb: "Asambleas",
        },
      },
      {
        path: "regulations",
        loadComponent: () =>
          import("@operations.luxuryapp/custom-documents/custom-document/reglamentos-list").then(
            (m) => m.Reglamentos,
          ),
        canActivate: [authGuard],
        data: {
          title: "Reglamentos",
          breadcrumb: "Reglamentos",
        },
      },
      {
        path: "ravine-concession",
        loadComponent: () =>
          import("@operations.luxuryapp/custom-documents/custom-document/special-document-list").then(
            (m) => m.SpecialDocumentList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Concesión Barranca",
          breadcrumb: "Concesión Barranca",
          documentType: EDocumentType.ConcesionBarranca,
        },
      },
      {
        path: "well-concession",
        loadComponent: () =>
          import("@operations.luxuryapp/custom-documents/custom-document/special-document-list").then(
            (m) => m.SpecialDocumentList,
          ),
        canActivate: [authGuard],
        data: {
          title: "Concesión Pozo",
          breadcrumb: "Concesión Pozo",
          documentType: EDocumentType.ConcesionPozo,
        },
      },
      {
        path: "painting",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/paint-inventory/inventario-pintura").then(
            (m) => m.InventarioPintura,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Pintura",
          breadcrumb: "Inventario de Pintura",
        },
      },
      {
        path: "lighting",
        loadComponent: () =>
          import("@operations.luxuryapp/inventory/lighting-inventory/inventario-iluminacion").then(
            (m) => m.InventarioIluminacion,
          ),
        canActivate: [authGuard],
        data: {
          title: "Inventario de Iluminación",
          breadcrumb: "Inventario de Iluminación",
        },
      },
    ],
  },
  {
    path: "calendars",
    children: [
      {
        path: "jewish-holidays",
        loadComponent: () =>
          import("@operations.luxuryapp/google-calendar/calendar/jewish-holidays/fiestas-judias").then(
            (m) => m.FiestasJudias,
          ),
        canActivate: [authGuard],
        data: {
          title: "Fiestas Judías",
          breadcrumb: "Fiestas Judías",
        },
      },
      {
        path: "christian-holidays",
        loadComponent: () =>
          import("@operations.luxuryapp/google-calendar/calendar/christian-holidays/fiestas-cristianas").then(
            (m) => m.FiestasCristianas,
          ),
        canActivate: [authGuard],
        data: {
          title: "Fiestas Cristianas",
          breadcrumb: "Fiestas Cristianas",
        },
      },
      {
        path: "birthdays",
        loadComponent: () =>
          import("@operations.luxuryapp/google-calendar/calendar/birthday/cumpleanos-list").then(
            (m) => m.Cumpleanos,
          ),
        canActivate: [authGuard],
        data: {
          title: "Fiestas Cumpleaños",
          breadcrumb: "Fiestas Cumpleaños",
        },
      },
      {
        path: "maintenance-master",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-planning/maintenance-calendar-master/calendario-maestro-lista").then(
            (m) => m.CalendarioMaestroLista,
          ),
        canActivate: [authGuard],
        data: {
          title: "Mantenimiento Maestro",
          breadcrumb: "Mantenimiento Maestro",
        },
      },
      {
        path: "fundings",
        loadComponent: () =>
          import("@operations.luxuryapp/google-calendar/calendar/fundings/fondeos").then(
            (m) => m.Fondeos,
          ),
        canActivate: [authGuard],
        data: {
          title: "Fondeos",
          breadcrumb: "Fondeos",
        },
      },
      {
        path: "team-master-calendar",
        loadComponent: () =>
          import("@maintenance.luxuryapp/maintenance-planning/master-equipment-calendar/calendario-maestro-equipo").then(
            (m) => m.CalendarioMaestroEquipo,
          ),
        canActivate: [authGuard],
        data: {
          title: "Calendario Maestro Equipo",
          breadcrumb: "Calendario Maestro Equipo",
        },
      },
      {
        path: "google-calendar",
        loadComponent: () =>
          import("@operations.luxuryapp/google-calendar/google-calendar/google-calendar").then(
            (m) => m.GoogleCalendar,
          ),
        canActivate: [authGuard],
        data: {
          title: "Agenda de Comité",
          breadcrumb: "Agenda de Comité",
        },
      },
    ],
  },
  {
    path: "delivery-reception",
    children: [
      {
        path: "general",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/client-delivery-reception/entrega-recepcion-cliente").then(
            (m) => m.EntregaRecepcionClienteLista,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - General",
          breadcrumb: "Entrega Recepción - General",
        },
      },
      {
        path: "equipment",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-equipos").then(
            (m) => m.EntregaRecepcionEquipos,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Equipos",
          breadcrumb: "Entrega Recepción - Equipos",
        },
      },
      {
        path: "installations",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-instalaciones").then(
            (m) => m.EntregaRecepcionInstalaciones,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Instalaciones",
          breadcrumb: "Entrega Recepción - Instalaciones",
        },
      },
      {
        path: "tools",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-herramientas").then(
            (m) => m.EntregaRecepcionHerramientas,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Herramientas",
          breadcrumb: "Entrega Recepción - Herramientas",
        },
      },
      {
        path: "supplies",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-insumos").then(
            (m) => m.EntregaRecepcionInsumos,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Insumos",
          breadcrumb: "Entrega Recepción - Insumos",
        },
      },
      {
        path: "maintenance",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-mantenimientos").then(
            (m) => m.EntregaRecepcionMantenimientos,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Mantenimientos",
          breadcrumb: "Entrega Recepción - Mantenimientos",
        },
      },
      {
        path: "organization-chart",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-organigrama").then(
            (m) => m.EntregaRecepcionOrganigrama,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Organigrama",
          breadcrumb: "Entrega Recepción - Organigrama",
        },
      },
      {
        path: "keys",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-llaves").then(
            (m) => m.EntregaRecepcionLlaves,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Llaves",
          breadcrumb: "Entrega Recepción - Llaves",
        },
      },
      {
        path: "hydrants",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-hidrantes").then(
            (m) => m.EntregaRecepcionHidrantes,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Hidrantes",
          breadcrumb: "Entrega Recepción - Hidrantes",
        },
      },
      {
        path: "pending-maintenances",
        loadComponent: () =>
          import("@operations.luxuryapp/delivery-receptions/delivery-reception/entrega-recepcion-mantenimientos-pendientes").then(
            (m) => m.EntregaRecepcionMantenimientosPendientes,
          ),
        canActivate: [authGuard],
        data: {
          title: "Entrega Recepción - Mantenimientos Pendientes",
          breadcrumb: "Entrega Recepción - Mantenimientos Pendientes",
        },
      },
    ],
  },
];

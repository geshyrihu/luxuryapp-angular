import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const logbookRoutes: Routes = [
  {
    path: "maintenance-orders", // Ruta anterior: 'ordenes-mantenimiento'
    loadComponent: () =>
      import("src/app/apps/operations.luxuryapp/field-service/service-order/ordenes-servicio-list").then(
        (m) => m.OrdenesServicio,
      ),
    canActivate: [authGuard],
    data: {
      title: "Órdenes de Mantenimiento", // Corregido
      breadcrumb: "Órdenes de Mantenimiento",
    },
  },
  {
    path: "inspections-areas",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/inspection/areas-inspeccion/inspections-areas").then(
        (m) => m.InspectionsAreas,
      ),
    canActivate: [authGuard],
    data: {
      title: "Áreas de Inspección", // Corregido
      breadcrumb: "Áreas de Inspección",
    },
  },
  {
    path: "pool", // Ruta anterior: 'piscina'
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/piscina/piscina-list").then(
        (m) => m.PiscinaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Bitácora de Piscinas", // Mejorado
      breadcrumb: "Bitácora de Piscinas",
    },
  },
  {
    // Suggested path: 'pool-logbook/:poolId'
    path: "piscina-bitacora/:piscinaId",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/piscina-bitacora/piscina-bitacora-list").then(
        (m) => m.PiscinaBitacoraList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Registro de Bitácora de Piscina", // Mejorado para ser más específico
      breadcrumb: "Registro de Bitácora de Piscina",
    },
  },
  {
    path: "meter-list", // Ruta anterior: 'lista-medidor'
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/bitacoras/medidores/medidores-list").then(
        (m) => m.MedidoresList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Medidores",
      breadcrumb: "Lista de Medidores",
    },
  },
  {
    // Suggested path: 'meter-reading-list/:id'
    path: "lista-medidor-lectura/:id", // Corregido typo "medidar"
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/bitacoras/medidores/medidor-lectura-list").then(
        (m) => m.MedidorLecturaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lectura de Medidor",
      breadcrumb: "Lectura de Medidor",
    },
  },
  {
    // Suggested path: 'chart/:id'
    path: "grafico/:id",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/bitacoras/medidores/medidor-lectura-chart").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/logs/elevator-spare-parts/elevator-spare-parts-change-list").then(
        (m) => m.ElevatorSparePartsChangeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cambio de Refacciones de Elevador", // Mejorado para ser más específico
      breadcrumb: "Cambio de Refacciones de Elevador",
    },
  },
  {
    path: "elevators-emergency-call",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/elevator-emergency-call/elevators-emergency-call-list").then(
        (m) => m.ElevatorsEmergencyCallList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Llamados de Emergencia de Elevador", // Mejorado para ser más específico
      breadcrumb: "Llamados de Emergencia de Elevador",
    },
  },
  {
    path: "my-inspection/:customerInspectionId",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/inspection/bitacora/mis-inspecciones-ejecutar").then(
        (m) => m.MisInspeccionesEjecutar,
      ),
    canActivate: [authGuard],
    data: {
      title: "Ejecutar Inspección", // Corregido, el título anterior era incorrecto
      breadcrumb: "Ejecutar Inspección",
    },
  },
  {
    path: "water-truck-reception",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list").then(
        (m) => m.RecepcionPipasAguaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Recepcion de Pipas de Agua",
      breadcrumb: "Recepcion de Pipas de Agua",
    },
  },
  {
    path: "water-truck-reception/reporte",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte").then(
        (m) => m.RecepcionPipasAguaReporte,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Pipas de Agua",
      breadcrumb: "Reporte",
    },
  },
  {
    path: "water-truck-reception/analisis",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-analisis").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/extinguisher-log/extintor-bitacora-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/extinguisher-checklist/extintor-checklist").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/qr-scanner/qr-scanner").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/equipos-y-maquinaria/equipment-inspections/equipment-inspection-qr-entry").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/hydrant-log/hidrante-bitacora-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/hydrant-checklist/hidrante-checklist").then(
        (m) => m.HidranteChecklist,
      ),
    canActivate: [authGuard],
    data: { title: "Inspección de Hidrante", breadcrumb: "Checklist Hidrante" },
  },
  {
    path: "manual-call-point-log/:stationId",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/manual-call-point-log/estacion-manual-bitacora-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/manual-call-point-checklist/estacion-manual-checklist").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/smoke-detector-log/detector-humo-bitacora-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/smoke-detector-checklist/detector-humo-checklist").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-list/fire-inspection-period-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/cycle-list/fire-inspection-cycle-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/cycle-detail/fire-inspection-cycle-detail").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail").then(
        (m) => m.FireInspectionPeriodDetectorDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Periodo de Inspección — Detectores de Humo",
      breadcrumb: "Detalle de Periodo",
    },
  },
];

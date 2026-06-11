import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const logbookRoutes: Routes = [
  {
    path: "maintenance-orders", // Ruta anterior: 'ordenes-mantenimiento'
    loadComponent: () =>
      import("src/app/features/tenant/service-order/ordenes-servicio-list").then(
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
      import("src/app/features/tenant/inspection/areas-inspeccion/inspections-areas").then(
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
      import("src/app/features/tenant/piscina/piscina-list").then(
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
      import("src/app/features/tenant/piscina-bitacora/piscina-bitacora-list").then(
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
      import("src/app/features/tenant/bitacoras/medidores/medidores-list").then(
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
      import("src/app/features/tenant/bitacoras/medidores/medidor-lectura-list").then(
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
      import("src/app/features/tenant/bitacoras/medidores/medidor-lectura-chart").then(
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
      import("src/app/features/tenant/elevator-spare-parts/elevator-spare-parts-change-list").then(
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
      import("src/app/features/tenant/elevator-emergency-call/elevators-emergency-call-list").then(
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
      import("src/app/features/tenant/inspection/bitacora/mis-inspecciones-ejecutar").then(
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
      import("src/app/features/tenant/recepcion-pipas-agua/recepcion-pipas-agua-list").then(
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
      import("src/app/features/tenant/recepcion-pipas-agua/recepcion-pipas-agua-reporte").then(
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
      import("src/app/features/tenant/recepcion-pipas-agua/recepcion-pipas-agua-analisis").then(
        (m) => m.RecepcionPipasAguaAnalisis,
      ),
    canActivate: [authGuard],
    data: {
      title: "Analisis de Pipas de Agua",
      breadcrumb: "Analisis",
    },
  },
];












import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const inspectionRoutes: Routes = [
  {
    path: "catalog",
    loadComponent: () =>
      import("src/app/features/operations/inspecciones-y-auditora/inspection/lista-inspecciones/lista-inspecciones").then(
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
      import("src/app/features/operations/inspecciones-y-auditora/inspection/detalles-inspeccion/detalles-inspeccion").then(
        (m) => m.DetallesInspeccion,
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
      import("src/app/features/operations/inspecciones-y-auditora/inspection/lista-reportes-inspeccion/lista-informe-inspeccion").then(
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
      import("src/app/features/operations/inspecciones-y-auditora/inspection/bitacora/mis-inspecciones-lista").then(
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
      import("src/app/features/operations/inspecciones-y-auditora/inspection/bitacora/mis-inspecciones-ejecutar").then(
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
      import("src/app/features/operations/inspecciones-y-auditora/inspection/resultado-inspeccion/resultado-inspeccion").then(
        (m) => m.ResultadoInspeccion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resultado",
      breadcrumb: "Resultado",
    },
  },
];

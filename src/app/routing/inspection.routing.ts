import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const inspectionRoutes: Routes = [
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
];



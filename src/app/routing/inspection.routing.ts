import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
export const inspectionRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@operations.luxuryapp/inspection/inspection-hub/inspection-hub").then(
        (m) => m.InspectionHub,
      ),
    canActivate: [authGuard],
    data: { title: "Inspecciones", breadcrumb: "Inspecciones" },
  },
  {
    path: "catalog",
    loadComponent: () =>
      import("@operations.luxuryapp/inspection/inspection-list/lista-inspecciones").then(
        (m) => m.ListaInspecciones,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de inspections",
      breadcrumb: "Catalogo de inspections",
    },
  },
  {
    path: "approval",
    loadComponent: () =>
      import(
        "@operations.luxuryapp/inspection/inspection-approval/revision-actas-inspeccion"
      ).then((m) => m.RevisionActasInspeccion),
    canActivate: [authGuard],
    data: {
      title: "Revisión de actas",
      breadcrumb: "Revisión de actas",
    },
  },
  {
    path: "details/:id",
    loadComponent: () =>
      import("@operations.luxuryapp/inspection/inspection-detail/inspection-detalle").then(
        (m) => m.InspectionDetailComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inspection detalle",
      breadcrumb: "Inspection detalle",
    },
  },
  {
    path: "inspection-report-list",    loadComponent: () =>
      import("@operations.luxuryapp/inspection/inspection-report-list/lista-informe-inspeccion").then(
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
      import("@operations.luxuryapp/inspection/logbook/mis-inspecciones-lista").then(
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
      import("@operations.luxuryapp/inspection/logbook/mis-inspecciones-ejecutar").then(
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
      import("@operations.luxuryapp/inspection/inspection-result/resultado-inspeccion").then(
        (m) => m.ResultadoInspeccion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resultado",
      breadcrumb: "Resultado",
    },
  },
  {
    path: "qr/:code",
    loadComponent: () =>
      import("@operations.luxuryapp/inspection/inspection-qr-entry").then(
        (m) => m.InspectionQrEntry,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inspección por QR",
      breadcrumb: "Inspección por QR",
    },
  },
];



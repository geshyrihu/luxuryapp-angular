import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const recruitmentRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "plantilla-interna",
  },
  {
    // Suggested path: 'internal-template'
    path: "plantilla-interna",
    loadComponent: () =>
      import("src/app/features/tenant/work-position/pages/work-position-list").then(
        (m) => m.WorkPositionList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantilla Interna",
      breadcrumb: "Plantilla Interna",
    },
  },

  {
    path: "requests", // Ruta anterior: 'solicitudes'
    loadChildren: () =>
      import("src/app/features/tenant/reclutamiento-solicitudes/recruitment-requests.routing").then(
        (m) => m.recruitmentRequestsRoutes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitudes",
      breadcrumb: "Solicitudes",
    },
  },
  {
    path: "solicitudes",
    redirectTo: "requests",
  },
  {
    // Suggested path: 'dismissal-request-status'
    path: "status-solicitud-baja",
    loadComponent: () =>
      import("src/app/features/tenant/reclutamiento-solicitudes/request-dismissal/status-request-dismissal").then(
        (m) => m.StatusRequestDismissal,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estatus de Solicitud de Baja", // Mejorado para mayor claridad
      breadcrumb: "Estatus de Solicitud de Baja",
    },
  },
  {
    // Suggested path: 'salary-modification-request-status'
    path: "status-solicitud-modificacion-salario",
    loadComponent: () =>
      import("src/app/features/tenant/reclutamiento-solicitudes/salary-modification/status-request-salary-modification").then(
        (m) => m.StatusRequestSalaryModification,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estatus de Solicitud de ModificaciÃ³n de Salario", // Mejorado para mayor claridad
      breadcrumb: "Estatus de Solicitud de ModificaciÃ³n de Salario",
    },
  },
  {
    // Suggested path: 'customer-requests'
    path: "solicitudes_cliente",
    loadComponent: () =>
      import("src/app/features/tenant/recruitment/recruitment-client-requests/solicitudes-cliente-list").then(
        (m) => m.SolicitudesClienteList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitudes por Cliente",
      breadcrumb: "Solicitudes por Cliente",
    },
  },
  {
    path: "dismissal-requests", // Ruta anterior: 'solicitudes-baja'
    loadComponent: () =>
      import("src/app/features/tenant/reclutamiento-solicitudes/request-dismissal/pages/solicitud-baja-list").then(
        (m) => m.SolicitudBajaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitudes de Baja",
      breadcrumb: "Solicitudes de Baja",
    },
  },
];


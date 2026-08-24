import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const recruitmentRoutes: Routes = [
  {
    path: "staff-board",
    loadComponent: () =>
      import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board").then(
        (m) => m.RecruitmentStaffBoard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Directorio de Plantilla",
      breadcrumb: "Directorio de Plantilla",
    },
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "plantilla-interna",
  },
  {
    // Suggested path: 'internal-template'
    path: "plantilla-interna",
    loadComponent: () =>
      import("src/app/apps/reclutamiento.luxuryapp/work-position/work-position-list").then(
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
      import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/recruitment-requests.routing").then(
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
      import("src/app/apps/reclutamiento.luxuryapp/solicitud-baja/status-request-dismissal").then(
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
      import("src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/status-request-salary-modification").then(
        (m) => m.StatusRequestSalaryModification,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estatus de Solicitud de Modificación de Salario", // Mejorado para mayor claridad
      breadcrumb: "Estatus de Solicitud de Modificación de Salario",
    },
  },
  {
    // Suggested path: 'customer-requests'
    path: "solicitudes_cliente",
    loadComponent: () =>
      import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/recruitment-client-requests/solicitudes-cliente-list").then(
        (m) => m.SolicitudesClienteList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitudes por Cliente",
      breadcrumb: "Solicitudes por Cliente",
    },
  },
  {
    path: "candidates",
    loadChildren: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates.routing"
      ).then((m) => m.candidatesRoutes),
    canActivate: [authGuard],
    data: {
      title: "Candidatos",
      breadcrumb: "Candidatos",
    },
  },
  {
    path: "dismissal-requests", // Ruta anterior: 'solicitudes-baja'
    loadComponent: () =>
      import("src/app/apps/reclutamiento.luxuryapp/solicitud-baja/solicitud-baja-list").then(
        (m) => m.SolicitudBajaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitudes de Baja",
      breadcrumb: "Solicitudes de Baja",
    },
  },
  {
    path: "empleado/:employeeId/:applicationUserId",
    loadComponent: () =>
      import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/employee-form").then(
        (m) => m.EmployeeForm,
      ),
    canActivate: [authGuard],
    data: {
      title: "Administrar Empleado",
      breadcrumb: "Administrar Empleado",
    },
  },
];



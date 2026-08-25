import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const recruitmentRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("src/app/apps/reclutamiento.luxuryapp/recruitment-shell/recruitment-shell").then(
        (m) => m.RecruitmentShellComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "plantilla-interna",
      },
      {
        path: "staff-board",
        loadComponent: () =>
          import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board").then(
            (m) => m.RecruitmentStaffBoard,
          ),
        data: {
          title: "Directorio de Plantilla",
          breadcrumb: "Directorio de Plantilla",
        },
      },
      {
        path: "plantilla-interna",
        loadComponent: () =>
          import("src/app/apps/reclutamiento.luxuryapp/work-position/work-position-list").then(
            (m) => m.WorkPositionList,
          ),
        data: {
          title: "Plantilla Interna",
          breadcrumb: "Plantilla Interna",
        },
      },
      {
        path: "requests",
        loadChildren: () =>
          import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/recruitment-requests.routing").then(
            (m) => m.recruitmentRequestsRoutes,
          ),
        data: {
          title: "Solicitudes",
        },
      },
      {
        path: "solicitudes",
        redirectTo: "requests",
      },
      {
        path: "status-solicitud-baja",
        loadComponent: () =>
          import("src/app/apps/reclutamiento.luxuryapp/solicitud-baja/status-request-dismissal").then(
            (m) => m.StatusRequestDismissal,
          ),
        data: {
          title: "Estatus de Solicitud de Baja",
          breadcrumb: "Estatus de Solicitud de Baja",
        },
      },
      {
        path: "status-solicitud-modificacion-salario",
        loadComponent: () =>
          import("src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/status-request-salary-modification").then(
            (m) => m.StatusRequestSalaryModification,
          ),
        data: {
          title: "Estatus de Solicitud de Modificación de Salario",
          breadcrumb: "Estatus de Solicitud de Modificación de Salario",
        },
      },
      {
        path: "solicitudes_cliente",
        loadComponent: () =>
          import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/recruitment-client-requests/solicitudes-cliente-list").then(
            (m) => m.SolicitudesClienteList,
          ),
        data: {
          title: "Solicitudes por Cliente",
          breadcrumb: "Solicitudes por Cliente",
        },
      },
      {
        path: "candidates",
        loadChildren: () =>
          import("src/app/apps/reclutamiento.luxuryapp/candidates.routing").then(
            (m) => m.candidatesRoutes,
          ),
        data: {
          title: "Candidatos",
        },
      },
      {
        path: "dismissal-requests",
        loadComponent: () =>
          import("src/app/apps/reclutamiento.luxuryapp/solicitud-baja/solicitud-baja-list").then(
            (m) => m.SolicitudBajaList,
          ),
        data: {
          title: "Solicitudes de Baja",
          breadcrumb: "Solicitudes de Baja",
        },
      },
      {
        path: "document-catalog",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/catalogos-generales/document-catalog/document-catalog-list").then(
            (m) => m.DocumentCatalogList,
          ),
        data: {
          title: "Catálogo de Documentos",
          breadcrumb: "Catálogo de Documentos",
        },
      },
      {
        path: "empleado/:employeeId/:applicationUserId",
        loadComponent: () =>
          import("src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/employee-form").then(
            (m) => m.EmployeeForm,
          ),
        data: {
          title: "Administrar Empleado",
          breadcrumb: "Administrar Empleado",
        },
      },
    ],
  },
];

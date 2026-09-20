import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";

export const recruitmentRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@recruitment.luxuryapp/recruitment-shell/recruitment-shell").then(
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
          import("@recruitment.luxuryapp/recruitment-requests/recruitment-staff-board/recruitment-staff-board").then(
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
          import("@operations.luxuryapp/work-position/work-position-list").then(
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
          import("@recruitment.luxuryapp/recruitment-requests/requests/recruitment-requests.routing").then(
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
          import("@recruitment.luxuryapp/dismissal-requests/status-request-dismissal").then(
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
          import("@recruitment.luxuryapp/salary-modification-requests/status-request-salary-modification").then(
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
          import("@recruitment.luxuryapp/recruitment-requests/recruitment-client-requests/solicitudes-cliente-list").then(
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
          import("@recruitment.luxuryapp/candidates.routing").then(
            (m) => m.candidatesRoutes,
          ),
        data: {
          title: "Candidatos",
        },
      },
      {
        path: "dismissal-requests",
        loadComponent: () =>
          import("@recruitment.luxuryapp/dismissal-requests/solicitud-baja-list").then(
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
          import("@shared.luxuryapp/catalogs/document-catalog/document-catalog-list").then(
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
          import("@recruitment.luxuryapp/recruitment-requests/recruitment-staff-board/employee-form").then(
            (m) => m.EmployeeForm,
          ),
        data: {
          title: "Administrar Empleado",
          breadcrumb: "Administrar Empleado",
        },
      },
      // =============================================================
      // RENOVACIONES DE CONTRATOS (FASE 4)
      // =============================================================
      {
        path: "contract-renewals",
        loadComponent: () =>
          import("@recruitment.luxuryapp/employee-file/employees/contract-renewal-list").then(
            (m) => m.ContractRenewalListComponent,
          ),
        canActivate: [
          () =>
            inject(AspRoleService).hasAny([
              ApplicationRole.SuperUsuario,
              ApplicationRole.RecursosHumanos,
              ApplicationRole.GerenteOperaciones,
            ]),
        ],
        data: {
          title: "Renovaciones de Contratos",
          breadcrumb: "Renovaciones",
        },
      },

      // =============================================================
      // EXPEDIENTE DEL EMPLEADO
      // =============================================================
      {
        path: "employee-files",
        loadComponent: () =>
          import("@recruitment.luxuryapp/employee-file/human-resources/employee-registry/employee-file-list").then(
            (m) => m.EmployeeFileList,
          ),
        data: {
          title: "Expediente del Empleado",
          breadcrumb: "Expedientes",
        },
      },
      {
        path: "employee-files/:employeeId",
        loadComponent: () =>
          import("@recruitment.luxuryapp/employee-file/human-resources/employee-registry/employee-file-detail").then(
            (m) => m.EmployeeFileDetail,
          ),

        data: {
          title: "Expediente del Empleado",
          breadcrumb: "Detalle de Expediente",
        },
      },

      // =============================================================
      // DATOS BANCARIOS DE EMPLEADOS
      // =============================================================
      {
        path: "bank-data",
        loadComponent: () =>
          import("@recruitment.luxuryapp/employee-file/human-resources/employee-bank-data/employee-bank-data-list").then(
            (m) => m.EmployeeBankDataList,
          ),
        canActivate: [
          () =>
            inject(AspRoleService).hasAny([
              ApplicationRole.SuperUsuario,
              ApplicationRole.RecursosHumanos,
            ]),
        ],
        data: {
          title: "Datos Bancarios de Empleados",
          breadcrumb: "Datos Bancarios",
        },
      },
    ],
  },
];

import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { hasRolesGuard } from "@core/auth/guards/has-roles.guard";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";

const candidateRoles = [
  "Reclutamiento",
  "Administrador",
  "GerenteOperaciones",
  "GerenteAtencion",
  "Contador",
  "Legal",
  "RecursosHumanos",
  "GerenteMantenimiento",
  "SupervisionOperativa",
  "SuperUsuario",
];

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
        redirectTo: "internal-staff",
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
        path: "internal-staff",
        loadComponent: () =>
          import("@operations.luxuryapp/work-positions/work-position-list").then(
            (m) => m.WorkPositionList,
          ),
        data: {
          title: "Plantilla Interna",
          breadcrumb: "Plantilla Interna",
        },
      },
      {
        path: "requests",
        loadComponent: () =>
          import("@recruitment.luxuryapp/recruitment-requests/requests/recruitment-requests-shell").then(
            (m) => m.RecruitmentRequestsShell,
          ),
        children: [
          { path: "", pathMatch: "full", redirectTo: "vacancies" },
          {
            path: "vacancies",
            loadComponent: () =>
              import("@recruitment.luxuryapp/vacancy-requests/vacantes-list").then(
                (m) => m.VacantesList,
              ),
            data: { title: "Vacantes", breadcrumb: "Vacantes" },
          },
          {
            path: "hirings",
            loadComponent: () =>
              import("@recruitment.luxuryapp/employee-registration-requests/solicitud-alta-list").then(
                (m) => m.SolicitudAltaList,
              ),
            data: { title: "Altas", breadcrumb: "Altas" },
          },
          {
            path: "dismissals",
            loadComponent: () =>
              import("@recruitment.luxuryapp/employee-dismissal-requests/solicitud-baja-list").then(
                (m) => m.SolicitudBajaList,
              ),
            data: { title: "Bajas", breadcrumb: "Bajas" },
          },
          {
            path: "salary-increase",
            loadComponent: () =>
              import("@recruitment.luxuryapp/salary-modification-requests/solicitud-modificacion-list").then(
                (m) => m.SolicitudModificacionList,
              ),
            data: { title: "Aumento de Sueldo", breadcrumb: "Aumento de Sueldo" },
          },
          { path: "vacantes", redirectTo: "vacancies" },
          { path: "altas", redirectTo: "hirings" },
          { path: "bajas", redirectTo: "dismissals" },
          { path: "aumento-sueldo", redirectTo: "salary-increase" },
        ],
        data: {
          title: "Solicitudes",
        },
      },
      { path: "solicitudes", redirectTo: "requests" },
      {
        path: "dismissal-request-status",
        loadComponent: () =>
          import("@recruitment.luxuryapp/employee-dismissal-requests/status-request-dismissal").then(
            (m) => m.StatusRequestDismissal,
          ),
        data: {
          title: "Estatus de Solicitud de Baja",
          breadcrumb: "Estatus de Solicitud de Baja",
        },
      },
      {
        path: "salary-modification-request-status",
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
        path: "client-requests",
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
        children: [
          { path: "", pathMatch: "full", redirectTo: "list" },
          {
            path: "list",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-core/candidate-list").then(
                (m) => m.CandidateList,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Candidatos",
              breadcrumb: "Candidatos",
            },
          },
          {
            path: "applications",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-applications/candidate-application-list").then(
                (m) => m.CandidateApplicationList,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Procesos de Candidatos",
              breadcrumb: "Procesos de Candidatos",
            },
          },
          {
            path: "former-employees",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/former-employee-talent-pool/former-employee-talent-pool").then(
                (m) => m.FormerEmployeeTalentPool,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Pool de Talento",
              breadcrumb: "Ex-empleados",
            },
          },
          {
            path: "interviews",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-interview/candidate-interview-pending-list").then(
                (m) => m.CandidateInterviewPendingList,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Entrevistas Pendientes",
              breadcrumb: "Entrevistas Pendientes",
            },
          },
          {
            path: "interviews/respond",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-interview/candidate-interview-response").then(
                (m) => m.CandidateInterviewResponse,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Responder Entrevista",
              breadcrumb: "Responder Entrevista",
            },
          },
          {
            path: "interviewer-queue",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue").then(
                (m) => m.CandidateInterviewerQueue,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Entrevistas y Seguimiento",
              breadcrumb: "Entrevistas y Seguimiento",
            },
          },
          {
            path: "work-position/:workPositionId/candidates",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-work-position-candidates/candidate-work-position-candidates").then(
                (m) => m.CandidateWorkPositionCandidates,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Detalle del Puesto y Candidatos",
              breadcrumb: "Detalle del Puesto",
            },
          },
          {
            path: "kpis",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-applications/candidate-application-kpis").then(
                (m) => m.CandidateApplicationKpis,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Indicadores Reclutamiento",
              breadcrumb: "Indicadores",
            },
          },
          {
            path: "recruitment-interviews",
            loadComponent: () =>
              import("@recruitment.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-interviews").then(
                (m) => m.CandidateRecruitmentInterviews,
              ),
            canActivate: [authGuard, hasRolesGuard],
            data: {
              allowedRoles: candidateRoles,
              title: "Entrevistas",
              breadcrumb: "Entrevistas",
            },
          },
        ],
        data: {
          title: "Candidatos",
        },
      },
      {
        path: "dismissal-requests",
        loadComponent: () =>
          import("@recruitment.luxuryapp/employee-dismissal-requests/solicitud-baja-list").then(
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
        path: "employee/:employeeId/:applicationUserId",
        loadComponent: () =>
          import("@recruitment.luxuryapp/recruitment-requests/recruitment-staff-board/employee-form").then(
            (m) => m.EmployeeForm,
          ),
        data: {
          title: "Administrar Empleado",
          breadcrumb: "Administrar Empleado",
        },
      },
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

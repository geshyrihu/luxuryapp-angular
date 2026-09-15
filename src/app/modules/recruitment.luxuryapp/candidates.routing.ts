import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { hasRolesGuard } from "@core/auth/guards/has-roles.guard";

export const candidatesRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "candidates",
  },
  {
    path: "candidates",
    loadComponent: () =>
      import("@recruitment.luxuryapp/candidates/candidate-core/candidate-list").then(
        (m) => m.CandidateList,
      ),
    canActivate: [authGuard, hasRolesGuard],
    data: {
      allowedRoles: [
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
      ],
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
      allowedRoles: [
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
      ],
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
      allowedRoles: [
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
      ],
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
      allowedRoles: [
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
      ],
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
      allowedRoles: [
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
      ],
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
      allowedRoles: [
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
      ],
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
      allowedRoles: [
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
      ],
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
      allowedRoles: [
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
      ],
      title: "Indicadores Reclutamiento",
      breadcrumb: "Indicadores",
    },
  },
  {
    // Entrada operativa principal de Reclutamiento para gestionar entrevistas.
    path: "recruitment-interviews",
    loadComponent: () =>
      import("@recruitment.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-interviews").then(
        (m) => m.CandidateRecruitmentInterviews,
      ),
    canActivate: [authGuard, hasRolesGuard],
    data: {
      allowedRoles: [
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
      ],
      title: "Entrevistas",
      breadcrumb: "Entrevistas",
    },
  },
];









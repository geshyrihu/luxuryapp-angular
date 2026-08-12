import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const candidatesRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "candidates",
  },
  {
    path: "candidates",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-list"
      ).then((m) => m.CandidateList),
    canActivate: [authGuard],
    data: {
      title: "Candidatos",
      breadcrumb: "Candidatos",
    },
  },
  {
    path: "applications",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/candidate-application-list"
      ).then((m) => m.CandidateApplicationList),
    canActivate: [authGuard],
    data: {
      title: "Procesos de Candidatos",
      breadcrumb: "Procesos de Candidatos",
    },
  },
  {
    path: "interviews",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-pending-list"
      ).then((m) => m.CandidateInterviewPendingList),
    canActivate: [authGuard],
    data: {
      title: "Entrevistas Pendientes",
      breadcrumb: "Entrevistas Pendientes",
    },
  },
  {
    path: "interviews/respond",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/candidate-interview-response"
      ).then((m) => m.CandidateInterviewResponse),
    canActivate: [authGuard],
    data: {
      title: "Responder Entrevista",
      breadcrumb: "Responder Entrevista",
    },
  },
  {
    path: "interviewer-queue",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/candidate-interviewer-queue"
      ).then((m) => m.CandidateInterviewerQueue),
    canActivate: [authGuard],
    data: {
      title: "Entrevistas y Seguimiento",
      breadcrumb: "Entrevistas y Seguimiento",
    },
  },
  {
    path: "recruitment-agenda",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-agenda-list"
      ).then((m) => m.RecruitmentAgendaList),
    canActivate: [authGuard],
    data: {
      title: "Agenda Reclutamiento",
      breadcrumb: "Agenda Reclutamiento",
    },
  },
  {
    path: "work-position/:workPositionId/candidates",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-work-position-candidates/candidate-work-position-candidates"
      ).then((m) => m.CandidateWorkPositionCandidates),
    canActivate: [authGuard],
    data: {
      title: "Detalle del Puesto y Candidatos",
      breadcrumb: "Detalle del Puesto",
    },
  },
  {
    path: "kpis",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/candidate-application-kpis"
      ).then((m) => m.CandidateApplicationKpis),
    canActivate: [authGuard],
    data: {
      title: "Indicadores Reclutamiento",
      breadcrumb: "Indicadores",
    },
  },
  {
    // Entrada operativa principal de Reclutamiento para gestionar entrevistas.
    path: "recruitment-interviews",
    loadComponent: () =>
      import(
        "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-recruitment-interviews/candidate-recruitment-interviews"
      ).then((m) => m.CandidateRecruitmentInterviews),
    canActivate: [authGuard],
    data: {
      title: "Entrevistas Reclutamiento",
      breadcrumb: "Entrevistas Reclutamiento",
    },
  },
];

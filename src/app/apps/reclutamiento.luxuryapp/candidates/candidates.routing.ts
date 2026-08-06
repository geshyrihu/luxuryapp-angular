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
      title: "Bandeja de Postulaciones",
      breadcrumb: "Bandeja de Postulaciones",
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
];
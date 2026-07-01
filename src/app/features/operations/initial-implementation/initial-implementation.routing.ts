import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";

export const initialImplementationRoutes: Routes = [
  {
    path: "machinery-survey",
    loadComponent: () =>
      import(
        "src/app/features/operations/initial-implementation/machinery-survey/machinery-survey"
      ).then((m) => m.MachinerySurvey),
    canActivate: [authGuard],
    data: {
      title: "Levantamiento de Maquinaria",
      breadcrumb: "Levantamiento de Maquinaria",
    },
  },
  {
    path: "staff-evaluation",
    loadComponent: () =>
      import(
        "src/app/features/operations/initial-implementation/staff-evaluation/staff-evaluation"
      ).then((m) => m.StaffEvaluation),
    canActivate: [authGuard],
    data: {
      title: "Evaluación del Personal",
      breadcrumb: "Evaluación del Personal",
    },
  },
  {
    path: "pending-vendor-projects",
    loadComponent: () =>
      import(
        "src/app/features/operations/initial-implementation/pending-vendor-projects/pending-vendor-projects"
      ).then((m) => m.PendingVendorProjects),
    canActivate: [authGuard],
    data: {
      title: "Proyectos con Proveedores Pendientes",
      breadcrumb: "Proyectos con Proveedores Pendientes",
    },
  },
  {
    path: "active-policies",
    loadComponent: () =>
      import(
        "src/app/features/operations/initial-implementation/active-policies/active-policies"
      ).then((m) => m.ActivePolicies),
    canActivate: [authGuard],
    data: {
      title: "Pólizas Vigentes",
      breadcrumb: "Pólizas Vigentes",
    },
  },
];

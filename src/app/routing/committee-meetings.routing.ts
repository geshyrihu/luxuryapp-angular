import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const committeeMeetingsRoutes: Routes = [
  {
    path: "sessions",
    loadComponent: () =>
      import("src/app/features/juntas-comite/juntas-mensuales-session/juntas-mensuales-session").then(
        (m) => m.JuntasMensualesSession,
      ),
    canActivate: [authGuard],
    data: {
      title: "Sesiones Mensuales",
      breadcrumb: "Sesiones Mensuales",
    },
  },
  {
    path: "presentations", // Ruta anterior: 'presentaciones'
    loadComponent: () =>
      import("src/app/features/juntas-comite/presentacion-junta-comite/presentacion-junta-comite").then(
        (m) => m.PresentacionJuntaComite,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presentaciones",
      breadcrumb: "Presentaciones",
    },
  },
  {
    path: "minutes", // Ruta anterior: 'minutas'
    loadComponent: () =>
      import("src/app/features/juntas-comite/junta-comite-minutas/minutas-list").then(
        (m) => m.MinutasList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de Minutas",
      breadcrumb: "Listado de Minutas",
    },
  },
  {
    // Suggested path: 'minutes-summary/:meetingId'
    path: "resumen-minuta/:meetingId",
    loadComponent: () =>
      import("src/app/features/juntas-comite/junta-comite-minutas/resumen-minuta").then(
        (m) => m.ResumenMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen de Minuta",
      breadcrumb: "Resumen de Minuta",
    },
  },
  {
    path: "gestion-minuta/:id",
    loadComponent: () =>
      import("src/app/features/juntas-comite/junta-comite-minutas/meeting-management").then(
        (m) => m.MeetingManagement,
      ),
    canActivate: [authGuard],
    data: {
      title: "Gestión de Minuta",
      breadcrumb: "Gestión de Minuta",
    },
  },
  {
    // Suggested path: 'pending-minutes'
    path: "minuta-pendientes",
    loadComponent: () =>
      import("src/app/features/juntas-comite/junta-comite-minutas/minuta-pendientes").then(
        (m) => m.MinutaPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Minutas Pendientes",
      breadcrumb: "Minutas Pendientes",
    },
  },
  {
    // Suggested path: 'minutes-follow-up/:area'
    path: "seguimiento-minutas/:area",
    loadComponent: () =>
      import("src/app/features/juntas-comite/junta-comite-minutas/seguimiento-minutas").then(
        (m) => m.SeguimientoMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Seguimiento de Minutas",
      breadcrumb: "Seguimiento de Minutas",
    },
  },
];











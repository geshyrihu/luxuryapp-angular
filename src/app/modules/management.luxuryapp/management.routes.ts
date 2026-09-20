import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";

export const managementRoutes: Routes = [
  {
    path: "sessions",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/session/juntas-mensuales-session").then(
        (m) => m.JuntasMensualesSession,
      ),
    canActivate: [authGuard],
    data: {
      title: "Sesiones Mensuales",
      breadcrumb: "Sesiones Mensuales",
    },
  },
  {
    path: "presentations",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/presentation/presentacion-junta-comite").then(
        (m) => m.PresentacionJuntaComite,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presentaciones",
      breadcrumb: "Presentaciones",
    },
  },
  {
    path: "accountant-presentations",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/presentation/presentacion-junta-comite-contador").then(
        (m) => m.PresentacionJuntaComiteContador,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presentaciones",
      breadcrumb: "Presentaciones",
    },
  },
  {
    path: "minutes",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/meeting-minutes/minutas-list").then(
        (m) => m.MinutasList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de Minutas",
      breadcrumb: "Listado de Minutas",
    },
  },
  {
    path: "minutes-summary/:meetingId",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/meeting-minutes/resumen-minuta").then(
        (m) => m.ResumenMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen de Minuta",
      breadcrumb: "Resumen de Minuta",
    },
  },
  {
    path: "meeting-management/:id",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/meeting-minutes/meeting-management").then(
        (m) => m.MeetingManagement,
      ),
    canActivate: [authGuard],
    data: {
      title: "Gestión de Minuta",
      breadcrumb: "Gestión de Minuta",
    },
  },
  {
    path: "pending-minutes",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/meeting-minutes/minuta-pendientes").then(
        (m) => m.MinutaPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Minutas Pendientes",
      breadcrumb: "Minutas Pendientes",
    },
  },
  {
    path: "minutes-follow-up/:area",
    loadComponent: () =>
      import("@management.luxuryapp/monthly-meetings/meeting-minutes/seguimiento-minutas").then(
        (m) => m.SeguimientoMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Seguimiento de Minutas",
      breadcrumb: "Seguimiento de Minutas",
    },
  },
];

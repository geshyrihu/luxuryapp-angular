import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
export const calendarsRoutes: Routes = [
  {
    path: "jewish-holidays", // Ruta anterior: 'fiestas-judias'
    loadComponent: () =>
      import("src/app/features/operations/google-calendar/calendar/fiestas-judias/fiestas-judias").then(
        (m) => m.FiestasJudias,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fiestas Judías",
      breadcrumb: "Fiestas Judías",
    },
  },
  {
    path: "christian-holidays", // Ruta anterior: 'fiestas-cristianas'
    loadComponent: () =>
      import("src/app/features/operations/google-calendar/calendar/fiestas-cristianas/fiestas-cristianas").then(
        (m) => m.FiestasCristianas,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fiestas Cristianas",
      breadcrumb: "Fiestas Cristianas",
    },
  },
  {
    path: "birthdays", // Ruta anterior: 'cumpleanos'
    loadComponent: () =>
      import("src/app/features/operations/google-calendar/calendar/birthday/cumpleanos-list").then(
        (m) => m.Cumpleanos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fiestas Cumpleaños",
      breadcrumb: "Fiestas Cumpleaños",
    },
  },
  {
    path: "maintenance-master", // Ruta anterior: 'mantenimiento-master'
    loadComponent: () =>
      import("src/app/features/maintenance/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-lista").then(
        (m) => m.CalendarioMaestroLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mantenimiento Maestro",
      breadcrumb: "Mantenimiento Maestro",
    },
  },
  {
    path: "fundings", // Ruta anterior: 'fondeos'
    loadComponent: () =>
      import("src/app/features/operations/google-calendar/calendar/fondeos/fondeos").then(
        (m) => m.Fondeos,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fondeos",
      breadcrumb: "Fondeos",
    },
  },
  {
    path: "team-master-calendar", // Ruta anterior: 'calendario-maestro-equipo'
    loadComponent: () =>
      import("src/app/features/maintenance/planificacin-de-mantenimiento/calendario-maestro-equipo/calendario-maestro-equipo").then(
        (m) => m.CalendarioMaestroEquipo,
      ),
    canActivate: [authGuard],
    data: {
      title: "Calendario Maestro Equipo",
      breadcrumb: "Calendario Maestro Equipo",
    },
  },
  // {
  //   path: "committee-meetings", // Ruta anterior: 'reuniones-comite'
  //   loadComponent: () =>
  //     import("src/app/features/operations/google-calendar/reuniones-comite/reuniones-comite").then(
  //       (m) => m.ReunionesComite,
  //     ),
  //   canActivate: [authGuard],
  //   data: {
  //     title: "Reuniones con Comité",
  //     breadcrumb: "Reuniones con Comité",
  //   },
  // },
  {
    path: "google-calendar",
    loadComponent: () =>
      import("src/app/features/operations/google-calendar/google-calendar/google-calendar").then(
        (m) => m.GoogleCalendar,
      ),
    canActivate: [authGuard],
    data: {
      title: "Agenda de Comité",
      breadcrumb: "Agenda de Comité",
    },
  },
];

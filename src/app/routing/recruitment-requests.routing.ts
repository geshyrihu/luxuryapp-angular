import { Routes } from "@angular/router";

export const recruitmentRequestsRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "vacancies",
  },
  {
    // Suggested path: 'vacancies'
    path: "vacancies", // Ruta anterior: 'vacantes'
    loadComponent: () =>
      import("src/app/features/vacancy-requests/pages/vacantes-list").then(
        (m) => m.VacantesList,
      ),
    data: {
      title: "Vacantes",
      breadcrumb: "Vacantes",
    },
  },
  {
    path: "vacantes",
    redirectTo: "vacancies",
  },
  {
    // Suggested path: 'hirings'
    path: "hirings", // Ruta anterior: 'altas'
    loadComponent: () =>
      import("src/app/features/recruitment-requests/pages/solicitud-alta-list").then(
        (m) => m.SolicitudAltaList,
      ),
    data: {
      title: "Altas",
      breadcrumb: "Altas",
    },
  },
  {
    path: "altas",
    redirectTo: "hirings",
  },
  {
    // Suggested path: 'dismissals'
    path: "dismissals", // Ruta anterior: 'bajas'
    loadComponent: () =>
      import("src/app/features/request-dismissal/pages/solicitud-baja-list").then(
        (m) => m.SolicitudBajaList,
      ),
    data: {
      title: "Bajas",
      breadcrumb: "Bajas",
    },
  },
  {
    path: "bajas",
    redirectTo: "dismissals",
  },
  {
    // Suggested path: 'salary-increase'
    path: "salary-increase", // Ruta anterior: 'aumento-sueldo'
    loadComponent: () =>
      import("src/app/features/salary-modification/pages/solicitud-modificacion-list").then(
        (m) => m.SolicitudModificacionList,
      ),
    data: {
      title: "Aumento de Sueldo",
      breadcrumb: "Aumento de Sueldo",
    },
  },
  {
    path: "aumento-sueldo",
    redirectTo: "salary-increase",
  },
];












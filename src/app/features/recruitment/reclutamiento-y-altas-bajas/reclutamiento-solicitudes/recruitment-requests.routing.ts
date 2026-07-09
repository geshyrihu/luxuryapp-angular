import { Routes } from "@angular/router";

export const recruitmentRequestsRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./recruitment-requests-shell").then(
        (m) => m.RecruitmentRequestsShell,
      ),
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "vacancies",
      },
      {
        path: "vacancies",
        loadComponent: () =>
          import("src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/pages/vacantes-list").then(
            (m) => m.VacantesList,
          ),
        data: { title: "Vacantes", breadcrumb: "Vacantes" },
      },
      {
        path: "hirings",
        loadComponent: () =>
          import("src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/recruitment-requests/pages/solicitud-alta-list").then(
            (m) => m.SolicitudAltaList,
          ),
        data: { title: "Altas", breadcrumb: "Altas" },
      },
      {
        path: "dismissals",
        loadComponent: () =>
          import("src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/request-dismissal/pages/solicitud-baja-list").then(
            (m) => m.SolicitudBajaList,
          ),
        data: { title: "Bajas", breadcrumb: "Bajas" },
      },
      {
        path: "salary-increase",
        loadComponent: () =>
          import("src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/salary-modification/pages/solicitud-modificacion-list").then(
            (m) => m.SolicitudModificacionList,
          ),
        data: { title: "Aumento de Sueldo", breadcrumb: "Aumento de Sueldo" },
      },
      { path: "vacantes", redirectTo: "vacancies" },
      { path: "altas", redirectTo: "hirings" },
      { path: "bajas", redirectTo: "dismissals" },
      { path: "aumento-sueldo", redirectTo: "salary-increase" },
    ],
  },
];


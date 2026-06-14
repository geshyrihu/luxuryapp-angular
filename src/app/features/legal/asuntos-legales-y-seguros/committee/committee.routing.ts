import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
import { documentTypeRoutesConfig } from "../legal/models/documentTypeRoutesConfig";
// Definición del componente de detalle para reutilizar
const CustomDocumentList = () =>
  import("src/app/features/legal/asuntos-legales-y-seguros/committee/board-directors-library/biblioteca-consejo-directivo-detalle").then(
    (m) => m.BibliotecaConsejoDirectivoDetalle,
  );
// Generación de rutas de documentos
const documentRoutes: Routes = documentTypeRoutesConfig.map((config) => ({
  path: config.routeParam,
  loadComponent: CustomDocumentList,
  canActivate: [authGuard],
  data: {
    title: config.title,
    breadcrumb: config.breadcrumb,
    documentType: config.type,
  },
}));

// Rutas principales del comité
export const committeeRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home-committee/home-comite").then((m) => m.HomeComite),
    canActivate: [authGuard],
    data: {
      title: "Inicio Comité",
      breadcrumb: "Inicio",
    },
  },
  {
    path: "board-directors",
    children: [
      {
        path: "monthly-meetings",
        loadComponent: () =>
          import("src/app/features/legal/asuntos-legales-y-seguros/committee/board-directors-monthly-meetings/reuniones-mensuales-consejo-directivo").then(
            (m) => m.ReunionesMensualesConsejoDirectivo,
          ),
        canActivate: [authGuard],
        data: {
          title: "Junta Mensual",
          breadcrumb: "Junta Mensual",
        },
      },
      {
        path: "meeting-minutes",
        loadComponent: () =>
          import("src/app/features/legal/asuntos-legales-y-seguros/committee/board-directors-meeting-minutes/minutas-reuniones-consejo-directivo").then(
            (m) => m.MinutasReunionesConsejoDirectivo,
          ),
        canActivate: [authGuard],
        data: {
          title: "Minutas",
          breadcrumb: "Minutas",
        },
      },
      {
        path: "meeting-minutes-detail/:id",
        loadComponent: () =>
          import("src/app/features/legal/asuntos-legales-y-seguros/committee/board-directors-meeting-minutes/minutas-reuniones-consejo-directivo-detalle").then(
            (m) => m.MinutasReunionesConsejoDirectivoDetalle,
          ),
        canActivate: [authGuard],
        data: {
          title: "Minuta detalle",
          breadcrumb: "Minuta detalle",
        },
      },
      {
        path: "building-insurance-policy", // Ruta anterior: 'poliza-seguro-edificio'

        loadComponent: () =>
          import("src/app/features/legal/asuntos-legales-y-seguros/committee/poliza-seguro-edificio/poliza-seguro-edificio").then(
            (m) => m.PolizaSeguroEdificio,
          ),
        canActivate: [authGuard],
        data: {
          title: "Poliza del Edificio",
          breadcrumb: "Poliza del Edificio",
        },
      },
      {
        path: "financial-reports",
        loadComponent: () =>
          import("src/app/features/legal/asuntos-legales-y-seguros/committee/board-directors-financial-reports/informes-financieros-consejo-directivo").then(
            (m) => m.InformesFinancierosConsejoDirectivo,
          ),
        canActivate: [authGuard],
        data: {
          title: "Informe Financiero",
          breadcrumb: "Informe Financiero",
        },
      },

      {
        path: "documents",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("src/app/features/legal/asuntos-legales-y-seguros/committee/board-directors-library/biblioteca-consejo-directivo").then(
                (m) => m.BibliotecaConsejoDirectivo,
              ),
            canActivate: [authGuard],
            data: {
              title: "Documentos",
              breadcrumb: "Documentos",
            },
          },
          ...documentRoutes,
        ],
      },
    ],
  },
];











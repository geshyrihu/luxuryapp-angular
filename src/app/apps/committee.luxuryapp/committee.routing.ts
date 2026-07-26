import { Routes } from "@angular/router";
import { documentTypeRoutesConfig } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/interfaces/documentTypeRoutesConfig";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
// Definición del componente de detalle para reutilizar
const CustomDocumentList = () =>
  import("src/app/apps/committee.luxuryapp/board-directors-library/biblioteca-consejo-directivo-detalle").then(
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
    path: "cobranza",
    loadComponent: () =>
      import("./cobranza/committee-cobranza-wrapper").then((m) => m.CommitteeCobranzaWrapper),
    canActivate: [authGuard],
    data: {
      title: "Cobranza",
      breadcrumb: "Cobranza",
    },
  },
  {
    path: "directorio",
    loadComponent: () =>
      import("./directorio/directorio").then((m) => m.CommitteeDirectorio),
    canActivate: [authGuard],
    data: {
      title: "Directorio",
      breadcrumb: "Directorio",
    },
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./profile/committee-profile").then((m) => m.CommitteeProfile),
    canActivate: [authGuard],
    data: {
      title: "Mi Perfil",
      breadcrumb: "Perfil",
    },
  },
  {
    path: "board-directors",
    children: [
      {
        path: "monthly-meetings",
        loadComponent: () =>
          import("src/app/apps/committee.luxuryapp/board-directors-monthly-meetings/reuniones-mensuales-consejo-directivo").then(
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
          import("src/app/apps/committee.luxuryapp/board-directors-meeting-minutes/minutas-reuniones-consejo-directivo").then(
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
          import("src/app/apps/committee.luxuryapp/board-directors-meeting-minutes/minutas-reuniones-consejo-directivo-detalle").then(
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
          import("src/app/apps/committee.luxuryapp/poliza-seguro-edificio/poliza-seguro-edificio").then(
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
          import("src/app/apps/committee.luxuryapp/board-directors-financial-reports/informes-financieros-consejo-directivo").then(
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
              import("src/app/apps/committee.luxuryapp/board-directors-library/biblioteca-consejo-directivo").then(
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

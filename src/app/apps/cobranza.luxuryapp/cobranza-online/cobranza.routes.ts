import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
import { CobranzaOnlineDashboard } from "./dashboard/cobranza-online-dashboard";
import { CobranzaOnlineInspection } from "./inspection/cobranza-online-inspection";
import { CobranzaOnlineAnalysis } from "./analysis/cobranza-online-analysis";
import { CobranzaOnlineReporteFinanciero } from "./reporte-financiero/cobranza-online-reporte-financiero";
import { CobranzaOnlineExclusions } from "./exclusions/cobranza-online-exclusions";

export const COBRANZA_ONLINE_ROUTES: Routes = [
  {
    path: "collections",
    loadComponent: () =>
      import("./dashboard/cobranza-online-dashboard").then(
        (m) => m.CobranzaOnlineDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cobranza Online",
      breadcrumb: "Cobranza Online",
    },
  },
  {
    path: "collections/inspection",
    loadComponent: () =>
      import("./inspection/cobranza-online-inspection").then(
        (m) => m.CobranzaOnlineInspection,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inspección de Cobranza",
      breadcrumb: "Inspección de Cobranza",
    },
  },
  {
    path: "collections/analysis",
    loadComponent: () =>
      import("./analysis/cobranza-online-analysis").then(
        (m) => m.CobranzaOnlineAnalysis,
      ),
    canActivate: [authGuard],
    data: {
      title: "Análisis de Cobranza",
      breadcrumb: "Análisis de Cobranza",
    },
  },
  {
    path: "collections/reporte-financiero",
    loadComponent: () =>
      import("./reporte-financiero/cobranza-online-reporte-financiero").then(
        (m) => m.CobranzaOnlineReporteFinanciero,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte Financiero",
      breadcrumb: "Reporte Financiero",
    },
  },
  {
    path: "collections/exclusions",
    loadComponent: () =>
      import("./exclusions/cobranza-online-exclusions").then(
        (m) => m.CobranzaOnlineExclusions,
      ),
    canActivate: [authGuard],
    data: {
      title: "Exclusiones",
      breadcrumb: "Exclusiones",
    },
  },
];

import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const COBRANZA_ONLINE_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./cobranza-online-wrapper").then((m) => m.CobranzaOnlineWrapper),
    canActivate: [authGuard],
    data: {
      title: "Cobranza Online",
      breadcrumb: "Cobranza Online",
    },
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./resumen/cobranza-online-resumen").then(
            (m) => m.CobranzaOnlineResumen,
          ),
        data: {
          title: "Resumen",
          breadcrumb: "Resumen",
        },
      },
      {
        path: "inspection",
        loadComponent: () =>
          import("./inspection/cobranza-online-inspection").then(
            (m) => m.CobranzaOnlineInspection,
          ),
        data: {
          title: "Inspección de Cobranza",
          breadcrumb: "Inspección de Cobranza",
        },
      },
      {
        path: "analysis",
        loadComponent: () =>
          import("./analysis/cobranza-online-analysis").then(
            (m) => m.CobranzaOnlineAnalysis,
          ),
        data: {
          title: "Análisis de Cobranza",
          breadcrumb: "Análisis de Cobranza",
        },
      },
      {
        path: "reporte-financiero",
        loadComponent: () =>
          import("./reporte-financiero/cobranza-online-reporte-financiero").then(
            (m) => m.CobranzaOnlineReporteFinanciero,
          ),
        data: {
          title: "Reporte Financiero",
          breadcrumb: "Reporte Financiero",
        },
      },
      {
        path: "exclusions",
        loadComponent: () =>
          import("./exclusions/cobranza-online-exclusions").then(
            (m) => m.CobranzaOnlineExclusions,
          ),
        data: {
          title: "Exclusiones",
          breadcrumb: "Exclusiones",
        },
      },
      {
        path: "department-charges",
        loadComponent: () =>
          import("./department-charges/department-charges").then(
            (m) => m.DepartmentCharges,
          ),
        data: {
          title: "Cargos por Departamento",
          breadcrumb: "Cargos por Departamento",
        },
      },
      {
        path: "department-payments",
        loadComponent: () =>
          import("./department-payments/department-payments").then(
            (m) => m.DepartmentPayments,
          ),
        data: {
          title: "Abonos por Departamento",
          breadcrumb: "Abonos por Departamento",
        },
      },
      {
        path: "towers",
        loadComponent: () =>
          import("./towers/cobranza-online-towers").then(
            (m) => m.CobranzaOnlineTowers,
          ),
        data: {
          title: "Resumen por Torres",
          breadcrumb: "Resumen por Torres",
        },
      },
      {
        path: "advances",
        loadComponent: () =>
          import("./advances/cobranza-online-advances").then(
            (m) => m.CobranzaOnlineAdvances,
          ),
        data: {
          title: "Adelantos y Saldos a Favor",
          breadcrumb: "Adelantos y Saldos a Favor",
        },
      },
      {
        path: "debtors",
        loadComponent: () =>
          import("./debtors/cobranza-online-debtors").then(
            (m) => m.CobranzaOnlineDebtors,
          ),
        data: {
          title: "Detalle de Morosidad por Departamento",
          breadcrumb: "Detalle de Morosidad por Departamento",
        },
      },
    ],
  },
];

import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const CONTABILIDAD_ROUTES: Routes = [
  // Ruta: /contabilidad
  {
    path: "",
    loadComponent: () =>
      import("./master-dashboard/master-dashboard").then(
        (m) => m.MasterDashboard,
      ),
  },

  // ============================================================================
  // RUTAS CENTRALIZADAS DE accounting.routing.ts
  // ============================================================================

  // Ruta anterior: /accounting/budget
  {
    path: "budget",
    loadComponent: () =>
      import("./presupuesto-web-aspel/wrapper").then(
        (m) => m.PresupuestoWebAspelWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto",
      breadcrumb: "Presupuesto",
    },
  },

  // Ruta anterior: /accounting/accounting-catalog
  {
    path: "accounting-catalog",
    loadComponent: () =>
      import("./accounting-catalog/pages/accounting-catalog").then(
        (m) => m.AccountingCatalog,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo Contable",
      breadcrumb: "Catálogo Contable",
    },
  },

  // Ruta anterior: /accounting/minutes-pendings
  {
    path: "minutes-pendings",
    loadComponent: () =>
      import("./pendientes-minuta/cont-list-minuta-pendientes").then(
        (m) => m.ContListMinutaPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pendientes de Minutas",
      breadcrumb: "Pendientes de Minutas",
    },
  },

  // Ruta anterior: /accounting/funding-list
  {
    path: "funding-list",
    loadComponent: () =>
      import("../funding-accounting/funding-accounting-list").then(
        (m) => m.FundingAccountingList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fondeo Contabilidad",
      breadcrumb: "Fondeo Contabilidad",
    },
  },

  // Ruta anterior: /accounting/funding-details/:id
  {
    path: "funding-details/:id",
    loadComponent: () =>
      import("../funding-accounting/funding-accounting-detail").then(
        (m) => m.FundingAccountingDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle de Fondeo Contable",
      breadcrumb: "Detalle de Fondeo Contable",
    },
  },

  // Ruta anterior: /accounting/legal-minutes-pendings
  {
    path: "legal-minutes-pendings",
    loadComponent: () =>
      import("../../../legal/asuntos-legales-y-seguros/minutas/legal-pendientes-minuta").then(
        (m) => m.LegalPendientesMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pendientes de Minutas Legal",
      breadcrumb: "Pendientes de Minutas Legal",
    },
  },

  // Ruta anterior: /accounting/budget-execution
  {
    path: "budget-execution",
    loadComponent: () =>
      import("../espejo-aspel/projected-expenses-list").then((m) => m.default),
    canActivate: [authGuard],
    data: {
      title: "Espejo Aspel",
      breadcrumb: "Espejo Aspel",
    },
  },

  // Ruta anterior: /accounting/financial-report-sending
  {
    path: "financial-report-sending",
    loadComponent: () =>
      import("./reporte-envio-financieros/reporte-envio-financieros").then(
        (m) => m.ReporteEnvioFinancieros,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Envío Financieros",
      breadcrumb: "Reporte de Envío Financieros",
    },
  },

  // Ruta anterior: /accounting/financial-statements
  {
    path: "financial-statements",
    loadComponent: () =>
      import("./estados-financieros/estado-financiero-list").then(
        (m) => m.EstadoFinancieroList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estados Financieros",
      breadcrumb: "Estados Financieros",
    },
  },

  // Ruta anterior: /accounting/financial-summary
  {
    path: "financial-summary",
    loadComponent: () =>
      import("./resumen-financiero/financial-summary").then(
        (m) => m.FinancialSummary,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen Financiero",
      breadcrumb: "Resumen Financiero",
    },
  },

  // Ruta anterior: /accounting/budget-proposal
  {
    path: "budget-proposal",
    loadComponent: () =>
      import("./presupuesto-propuesta/presupuesto-propuesta").then(
        (m) => m.PresupuestoPropuesta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto propuesta",
      breadcrumb: "Presupuesto propuesta",
    },
  },

  {
    path: "collections",
    loadComponent: () =>
      import("./cobranza-online/pages/dashboard/cobranza-online-dashboard").then(
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
      import("./cobranza-online/pages/inspection/cobranza-online-inspection").then(
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
      import("./cobranza-online/pages/analysis/cobranza-online-analysis").then(
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
      import("./cobranza-online/pages/reporte-financiero/cobranza-online-reporte-financiero").then(
        (m) => m.CobranzaOnlineReporteFinanciero,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte Financiero",
      breadcrumb: "Reporte Financiero",
    },
  },

  {
    path: "collections/presupuesto-contabilidad",
    loadComponent: () =>
      import("./cobranza-online/pages/presupuesto-contabilidad/presupuesto-contabilidad").then(
        (m) => m.PresupuestoContabilidad,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto Contabilidad",
      breadcrumb: "Presupuesto Contabilidad",
    },
  },
  {
    path: "collections/exclusions",
    loadComponent: () =>
      import("./cobranza-online/pages/exclusions/cobranza-online-exclusions").then(
        (m) => m.CobranzaOnlineExclusions,
      ),
    canActivate: [authGuard],
    data: {
      title: "Exclusiones",
      breadcrumb: "Exclusiones",
    },
  },

  // ============================================================================
  // RUTAS CENTRALIZADAS DE accounting-coi.routes.ts
  // ============================================================================

  // Ruta anterior: /accounting-coi/accounts
  {
    path: "accounts",
    loadComponent: () =>
      import("./accounting-catalog/pages/accounting-catalog").then(
        (m) => m.AccountingCatalog,
      ),
    data: {
      title: "Cuentas Contables COI",
      breadcrumb: "Catálogo de Cuentas",
    },
  },

  // ============================================================================
  // ESTADOS FINANCIEROS Y DASHBOARD COI
  // ============================================================================

  // Ruta anterior: /accounting-coi/financial-statements
  {
    path: "financial-statements-reports",
    loadComponent: () =>
      import("./contabilidad-online/pages/financial-reports-wrapper").then(
        (m) => m.default,
      ),
    data: {
      title: "Estados Financieros",
      breadcrumb: "Reportes",
    },
  },

  // ============================================================================
  // RUTAS ASPEL COBRANZA HAUS
  // ============================================================================

  // Ruta: /contabilidad/aspel-cobranza
  {
    path: "aspel-cobranza",
    loadComponent: () =>
      import("./aspel-cobranza-haus/aspel-cobranza-haus").then(
        (m) => m.AspelCobranzaHaus,
      ),
    data: {
      title: "Integración Aspel COI - Cobranza",
      breadcrumb: "Aspel Cobranza",
    },
  },

  {
    path: "espejo-aspel-full",
    loadComponent: () =>
      import("./espejo-aspel-full/espejo-aspel-full").then(
        (m) => m.EspejoAspelFull,
      ),
    canActivate: [authGuard],
    data: {
      title: "Espejo Aspel Full",
      breadcrumb: "Espejo Aspel Full",
    },
  },
  {
    path: "autitoria-cuentas-aspel",
    loadComponent: () =>
      import("./autitoria-cuentas-aspel/autitoria-cuentas-aspel").then(
        (m) => m.AutitoriaCuentasAspel,
      ),
    canActivate: [authGuard],
    data: {
      title: "Auditoria Cuentas Aspel",
      breadcrumb: "Auditoria Cuentas Aspel",
    },
  },
];

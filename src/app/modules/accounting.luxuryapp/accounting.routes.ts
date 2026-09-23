import { Routes } from "@angular/router";
import { FinancialReportFilterStore } from "@accounting.luxuryapp/general-ledger/financial-reports/online/state/financial-report-filter.store.service";
import { authGuard } from "@core/auth/guards/auth.guard";

export const accountingRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/master-dashboard/master-dashboard").then(
        (m) => m.MasterDashboard,
      ),
  },
  {
    path: "budget",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/aspel-web-budget/wrapper").then(
        (m) => m.PresupuestoWebAspelWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto",
      breadcrumb: "Presupuesto",
    },
  },
  {
    path: "accounting-catalog",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/accounting-catalog/accounting-catalog").then(
        (m) => m.AccountingCatalog,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo Contable",
      breadcrumb: "Catálogo Contable",
    },
  },
  {
    path: "accounts",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/accounting-catalog/accounting-catalog").then(
        (m) => m.AccountingCatalog,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cuentas Contables COI",
      breadcrumb: "Catálogo de Cuentas",
    },
  },
  {
    path: "minutes-pendings",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/pending-minutes/cont-list-minuta-pendientes").then(
        (m) => m.ContListMinutaPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pendientes de Minutas",
      breadcrumb: "Pendientes de Minutas",
    },
  },
  {
    path: "legal-minutes-pendings",
    loadComponent: () =>
      import("@legal.luxuryapp/legal/meeting-minutes/legal-pendientes-minuta").then(
        (m) => m.LegalPendientesMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pendientes de Minutas Legal",
      breadcrumb: "Pendientes de Minutas Legal",
    },
  },
  {
    path: "funding-list",
    loadComponent: () =>
      import("@accounting.luxuryapp/fundings/funding-accounting/funding-accounting-list").then(
        (m) => m.FundingAccountingList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fondeo Contabilidad",
      breadcrumb: "Fondeo Contabilidad",
    },
  },
  {
    path: "funding-details/:id",
    loadComponent: () =>
      import("@accounting.luxuryapp/fundings/funding-accounting/funding-accounting-detail").then(
        (m) => m.FundingAccountingDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle de Fondeo Contable",
      breadcrumb: "Detalle de Fondeo Contable",
    },
  },
  {
    path: "funding",
    loadComponent: () =>
      import("@accounting.luxuryapp/fundings/funding/funding-list").then(
        (m) => m.FundingList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fondeos contables",
      breadcrumb: "Fondeos contables",
    },
  },
  {
    path: "funding/details/:id",
    loadComponent: () =>
      import("@accounting.luxuryapp/fundings/funding/funding-detail").then(
        (m) => m.FundingDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle",
      breadcrumb: "Detalle",
    },
  },
  {
    path: "sat-funding",
    loadChildren: () =>
      import("@accounting.luxuryapp/fundings/sat-funding/sat-funding.routes").then(
        (m) => m.SAT_FUNDING_ROUTES,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fondeos SAT",
      breadcrumb: "Fondeos SAT",
    },
  },
  {
    path: "budget-execution",
    loadComponent: () =>
      import("@accounting.luxuryapp/accounting-catalogs/aspel-mirror/projected-expenses-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Ejecución Presupuestaria",
      breadcrumb: "Ejecución Presupuestaria",
    },
  },
  {
    path: "budget-proposal",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/budget-proposals/presupuesto-propuesta").then(
        (m) => m.PresupuestoPropuesta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto propuesta",
      breadcrumb: "Presupuesto propuesta",
    },
  },
  {
    path: "financial-report-sending",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/financial-report-delivery/reporte-envio-financieros").then(
        (m) => m.ReporteEnvioFinancieros,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Envío Financieros",
      breadcrumb: "Reporte de Envío Financieros",
    },
  },
  {
    path: "financial-statements",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/financial-statements/estado-financiero-list").then(
        (m) => m.EstadoFinancieroList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estados Financieros",
      breadcrumb: "Estados Financieros",
    },
  },
  {
    path: "financial-statements-reports",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/financial-reports/online/financial-reports-wrapper").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estados Financieros",
      breadcrumb: "Reportes",
    },
  },
  {
    path: "financial-summary",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/financial-summary/financial-summary").then(
        (m) => m.FinancialSummary,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen Financiero",
      breadcrumb: "Resumen Financiero",
    },
  },
  {
    path: "collections/accounting-budget",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/financial-reports/online/accounting-budget/presupuesto-contabilidad").then(
        (m) => m.PresupuestoContabilidad,
      ),
    providers: [FinancialReportFilterStore],
    canActivate: [authGuard],
    data: {
      title: "Presupuesto Contabilidad",
      breadcrumb: "Presupuesto Contabilidad",
    },
  },
  {
    path: "aspel-customer-company",
    loadComponent: () =>
      import("@accounting.luxuryapp/accounting-catalogs/aspel-customer-company/aspel-customer-empresa-list").then(
        (m) => m.AspelCustomerEmpresaList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración Aspel",
      breadcrumb: "Configuración Aspel",
    },
  },
  {
    path: "aspel-sync",
    loadComponent: () =>
      import("@accounting.luxuryapp/accounting-catalogs/aspel-sync/aspel-sync").then(
        (m) => m.AspelSyncComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "Sincronización Aspel",
      breadcrumb: "Sincronización Aspel",
    },
  },
  {
    path: "aspel-collections",
    loadComponent: () =>
      import("@collections.luxuryapp/aspel-collections-haus/aspel-cobranza-haus").then(
        (m) => m.AspelCobranzaHaus,
      ),
    canActivate: [authGuard],
    data: {
      title: "Integración Aspel COI - Cobranza",
      breadcrumb: "Aspel Cobranza",
    },
  },
  {
    path: "aspel-full-mirror",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/aspel-full-mirror/espejo-aspel-full").then(
        (m) => m.EspejoAspelFull,
      ),
    canActivate: [authGuard],
    data: {
      title: "Espejo Aspel Full",
      breadcrumb: "Espejo Aspel Full",
    },
  },
  {
    path: "aspel-account-audit",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/aspel-account-audit/autitoria-cuentas-aspel").then(
        (m) => m.AutitoriaCuentasAspel,
      ),
    canActivate: [authGuard],
    data: {
      title: "Auditoria Cuentas Aspel",
      breadcrumb: "Auditoria Cuentas Aspel",
    },
  },
  {
    path: "mock-aspel",
    loadChildren: () =>
      import("@accounting.luxuryapp/mock-aspel/mock-aspel.routes").then(
        (m) => m.MOCK_ASPEL_ROUTES,
      ),
    canActivate: [authGuard],
    data: {
      title: "Simulador Aspel COI",
      breadcrumb: "Mock Aspel",
    },
  },
];

import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const accountingRoutes: Routes = [
  {
    path: "budget", // Ruta anterior: 'presupuesto'
    loadComponent: () =>
      import("src/app/features/tenant/contabilidad/presupuesto-web-aspel/wrapper").then(
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
      import("src/app/features/tenant/contabilidad/accounting-catalog/pages/accounting-catalog").then(
        (m) => m.AccountingCatalog,
      ),
    canActivate: [authGuard],
    data: {
      title: "CatÃ¡logo Contable",
      breadcrumb: "CatÃ¡logo Contable",
    },
  },
  {
    path: "minutes-pendings", // Ruta anterior: 'pendientes-minutas'
    loadComponent: () =>
      import("src/app/features/tenant/contabilidad/pendientes-minuta/cont-list-minuta-pendientes").then(
        (m) => m.ContListMinutaPendientes,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pendientes de Minutas",
      breadcrumb: "Pendientes de Minutas",
    },
  },
  {
    path: "funding-list",
    loadComponent: () =>
      import("src/app/features/tenant/funding-accounting/funding-accounting-list").then(
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
      import("src/app/features/tenant/funding-accounting/funding-accounting-detail").then(
        (m) => m.FundingAccountingDetail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Detalle de Fondeo Contable", // Mejorado para ser mÃ¡s especÃ­fico
      breadcrumb: "Detalle de Fondeo Contable",
    },
  },
  {
    path: "legal-minutes-pendings", // Ruta anterior: 'pendientes-minutas-legal'
    loadComponent: () =>
      import("src/app/features/tenant/legal/minutas/legal-pendientes-minuta").then(
        (m) => m.LegalPendientesMinuta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Pendientes de Minutas Legal",
      breadcrumb: "Pendientes de Minutas Legal",
    },
  },
  // {
  //   // Suggested path: 'pending-minutes-pdf'
  //   path: "pendientes-minutas-pdf",
  //   loadComponent: () =>
  //     import("src/app/features/tenant/contabilidad/pendientes-minuta/cont-minuta-pendientes-pdf").then(
  //       (m) => m.ConMinutaPendientesPdf,
  //     ),
  //   canActivate: [authGuard],
  //   data: {
  //     title: "PDF Pendientes de Minutas",
  //     breadcrumb: "PDF Pendientes de Minutas",
  //   },
  // },
  {
    path: "budget-execution",
    loadComponent: () =>
      import("src/app/features/tenant/espejo-aspel/projected-expenses-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "EjecuciÃ³n Presupuestaria",
      breadcrumb: "EjecuciÃ³n Presupuestaria",
    },
  },

  {
    path: "financial-report-sending", // Ruta anterior: 'reporte-envio-financieros'
    loadComponent: () =>
      import("src/app/features/tenant/contabilidad/reporte-envio-financieros/reporte-envio-financieros").then(
        (m) => m.ReporteEnvioFinancieros,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de EnvÃ­o Financieros",
      breadcrumb: "Reporte de EnvÃ­o Financieros",
    },
  },
  {
    path: "financial-statements", // Ruta anterior: 'estados-financieros'
    loadComponent: () =>
      import("src/app/features/tenant/contabilidad/estados-financieros/estado-financiero-list").then(
        (m) => m.EstadoFinancieroList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estados Financieros",
      breadcrumb: "Estados Financieros",
    },
  },
  {
    path: "financial-summary",
    loadComponent: () =>
      import("src/app/features/tenant/contabilidad/resumen-financiero/financial-summary").then(
        (m) => m.FinancialSummary,
      ),
    canActivate: [authGuard],
    data: {
      title: "Resumen Financiero", // Mejorado para ser mÃ¡s conciso
      breadcrumb: "Resumen Financiero",
    },
  },
  // {
  //   // Suggested path: 'aspel-report'
  //   path: "reporte-aspel",
  //   loadComponent: () =>
  //     import("src/app/features/tenant/contabilidad/aspel-reportes/report-aspel-list").then(
  //       (m) => m.ReportAspelList,
  //     ),
  //   canActivate: [authGuard],
  //   data: {
  //     title: "Reportes Financieros Aspel",
  //     breadcrumb: "Reportes Aspel",
  //   },
  // },
  {
    path: "budget-proposal", // Ruta anterior: 'presupuesto-propuesta'
    loadComponent: () =>
      import("src/app/features/tenant/contabilidad/presupuesto-propuesta/presupuesto-propuesta").then(
        (m) => m.PresupuestoPropuesta,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto propuesta",
      breadcrumb: "Presupuesto propuesta",
    },
  },
  // {
  //   path: "financial-statements-reports", // Ruta anterior: 'reportes-estados-financieros'
  //   loadChildren: () =>
  //     import("src/app/routing/reportes-estados-financieros.routes").then(
  //       (m) => m.FINANCIAL_REPORT_ROUTES,
  //     ),
  //   canActivate: [authGuard],
  //   data: {
  //     title: "Reportes Financieros DinÃ¡micos",
  //     breadcrumb: "Reportes Financieros DinÃ¡micos",
  //   },
  // },
];


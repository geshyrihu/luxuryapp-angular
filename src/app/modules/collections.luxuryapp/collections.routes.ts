import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { CobranzaOnlineStoreService } from "@collections.luxuryapp/online-collections/state/cobranza-online-store.service";

export const collectionsRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/entry/native-collections-wrapper/cobranza-nativa-wrapper").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cobranza Nativa",
      breadcrumb: "Inicio",
    },
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/collections-dashboard/cobranza-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Dashboard de Cobranza",
      breadcrumb: "Dashboard",
    },
  },
  {
    path: "charge-types",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/charge-types/charge-type-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Cargo",
      breadcrumb: "Tipos de Cargo",
    },
  },
  {
    path: "charge-templates",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/charge-templates/charge-template-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantillas de Cargos",
      breadcrumb: "Plantillas de Cargos",
    },
  },
  {
    path: "charges",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/charges/charge-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cargos",
      breadcrumb: "Cargos",
    },
  },
  {
    path: "payments",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/payments/payments").then(
        (m) => m.Payments,
      ),
    canActivate: [authGuard],
    data: {
      title: "Registrar Pago",
      breadcrumb: "Registrar Pago",
    },
  },
  {
    path: "late-fee-policies",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/late-fee-policies/late-fee-policy-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Políticas de Mora",
      breadcrumb: "Políticas de Mora",
    },
  },
  {
    path: "account-statement",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/native-statement/native-statement").then(
        (m) => m.NativeStatement,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estado de Cuenta Nativo",
      breadcrumb: "Estado de Cuenta",
    },
  },
  {
    path: "properties",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/properties/property-boundary-placeholder").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Propiedades en Transicion",
      breadcrumb: "Propiedades",
    },
  },
  {
    path: "members",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/members/member-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Miembros de Propiedad",
      breadcrumb: "Miembros",
    },
  },
  {
    path: "approvals",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/approvals/approval-inbox").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Aprobaciones Financieras",
      breadcrumb: "Aprobaciones",
    },
  },
  {
    path: "ledger",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/ledger/ledger-viewer").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Ledger Financiero",
      breadcrumb: "Ledger",
    },
  },
  {
    path: "period-closures",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/period-closures/period-closure-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cierres de Periodo",
      breadcrumb: "Cierres de Periodo",
    },
  },
  {
    path: "regulation-articles",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/regulation-articles/regulation-article-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Artículos del Reglamento", breadcrumb: "Reglamento" },
  },
  {
    path: "property-fines",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/property-fines/property-fine-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Multas Reglamentarias", breadcrumb: "Multas" },
  },
  {
    path: "collection-cases",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/collection-cases/collection-case-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Casos de Cobranza Legal", breadcrumb: "Cobranza Legal" },
  },
  {
    path: "invoices",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/invoices/invoice-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Facturas CFDI", breadcrumb: "Facturas" },
  },
  {
    path: "reconciliation",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/reconciliation/reconciliation-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Conciliacion de Pagos", breadcrumb: "Conciliacion" },
  },
  {
    path: "audit",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/audit/financial-audit-log").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Auditoria Financiera", breadcrumb: "Auditoria" },
  },
  {
    path: "automated-services",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/automated-services/automated-services").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Servicios Automatizados",
      breadcrumb: "Servicios Automaticos",
    },
  },
  {
    path: "charge-template-coverage",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/charge-template-coverage/charge-template-coverage").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cuotas Vigentes por Propiedad",
      breadcrumb: "Cuotas Vigentes",
    },
  },
  {
    path: "initial-balance",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/core/initial-balance/initial-balance").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Saldos Iniciales", breadcrumb: "Saldos Iniciales" },
  },
  {
    path: "system-overview",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/onboarding/system-overview/system-overview").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Como Funciona el Sistema", breadcrumb: "Como Funciona" },
  },
  {
    path: "flow-map",
    loadComponent: () =>
      import("@collections.luxuryapp/native-collections/onboarding/system-flow-map/system-flow-map").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Mapa Visual del Flujo", breadcrumb: "Mapa Visual" },
  },
  {
    path: "aspel-online",
    loadComponent: () =>
      import("@collections.luxuryapp/online-collections/cobranza-online-wrapper").then(
        (m) => m.CobranzaOnlineWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cobranza Online",
      breadcrumb: "Cobranza Online",
    },
    providers: [CobranzaOnlineStoreService],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/summary/cobranza-online-resumen").then(
            (m) => m.CobranzaOnlineResumen,
          ),
        data: { title: "Resumen", breadcrumb: "Resumen" },
      },
      {
        path: "analysis",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/analysis/cobranza-online-analysis").then(
            (m) => m.CobranzaOnlineAnalysis,
          ),
        data: { title: "Análisis de Cobranza", breadcrumb: "Análisis de Cobranza" },
      },
      {
        path: "condo-owners-detail",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/condo-owners-detail/cobranza-online-detalle-condominos").then(
            (m) => m.CobranzaOnlineDetalleCondominos,
          ),
        data: { title: "Detalle por Condómino", breadcrumb: "Detalle por Condómino" },
      },
      {
        path: "delinquency",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/delinquency/cobranza-online-morosidad").then(
            (m) => m.CobranzaOnlineMorosidad,
          ),
        data: { title: "Reporte de Morosidad", breadcrumb: "Reporte de Morosidad" },
      },
      {
        path: "other-charges",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/other-charges/cobranza-online-otros-cargos").then(
            (m) => m.CobranzaOnlineOtrosCargos,
          ),
        data: { title: "Otros Cargos", breadcrumb: "Otros Cargos" },
      },
      {
        path: "transactions",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/transactions/cobranza-online-movimientos").then(
            (m) => m.CobranzaOnlineMovimientos,
          ),
        data: { title: "Movimientos del Mes", breadcrumb: "Movimientos del Mes" },
      },
      {
        path: "advances",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/advances/cobranza-online-advances").then(
            (m) => m.CobranzaOnlineAdvances,
          ),
        data: { title: "Adelantos y Saldos a Favor", breadcrumb: "Adelantos y Saldos a Favor" },
      },
      {
        path: "towers",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/towers/cobranza-online-towers").then(
            (m) => m.CobranzaOnlineTowers,
          ),
        data: { title: "Resumen por Torres", breadcrumb: "Resumen por Torres" },
      },
      {
        path: "exclusions",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/exclusions/cobranza-online-exclusions").then(
            (m) => m.CobranzaOnlineExclusions,
          ),
        data: { title: "Exclusiones", breadcrumb: "Exclusiones" },
      },
      {
        path: "inspection",
        loadComponent: () =>
          import("@collections.luxuryapp/online-collections/inspection/cobranza-online-inspection").then(
            (m) => m.CobranzaOnlineInspection,
          ),
        data: { title: "Listado Base (Inspección)", breadcrumb: "Listado Base" },
      },
      { path: "reporte-financiero", redirectTo: "", pathMatch: "full" },
      { path: "debtors", redirectTo: "condo-owners-detail", pathMatch: "full" },
      { path: "department-charges", redirectTo: "transactions", pathMatch: "full" },
      { path: "department-payments", redirectTo: "transactions", pathMatch: "full" },
    ],
  },
  { path: "online", redirectTo: "aspel-online" },
];

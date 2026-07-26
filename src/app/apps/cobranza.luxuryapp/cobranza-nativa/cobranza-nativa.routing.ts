import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const COBRANZA_NATIVA_ROUTES: Routes = [
  // Ruta raíz: /cobranza-nativa
  {
    path: "",
    loadComponent: () =>
      import("./entry/cobranza-nativa-wrapper/cobranza-nativa-wrapper").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cobranza Nativa",
      breadcrumb: "Inicio",
    },
  },

  // Dashboard de métricas
  {
    path: "dashboard",
    loadComponent: () =>
      import("./core/cobranza-dashboard/cobranza-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Dashboard de Cobranza",
      breadcrumb: "Dashboard",
    },
  },

  // Plantillas de cargos
  {
    path: "charge-types",
    loadComponent: () =>
      import("./core/charge-types/charge-type-list").then((m) => m.default),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Cargo",
      breadcrumb: "Tipos de Cargo",
    },
  },

  // Plantillas de cargos
  {
    path: "charge-templates",
    loadComponent: () =>
      import("./core/charge-templates/charge-template-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Plantillas de Cargos",
      breadcrumb: "Plantillas de Cargos",
    },
  },

  // Cargos individuales
  {
    path: "charges",
    loadComponent: () =>
      import("./core/charges/charge-list").then((m) => m.default),
    canActivate: [authGuard],
    data: {
      title: "Cargos",
      breadcrumb: "Cargos",
    },
  },

  // Registrar pagos con asignación a cargos
  {
    path: "payments",
    loadComponent: () =>
      import("./core/payments/payments").then((m) => m.Payments),
    canActivate: [authGuard],
    data: {
      title: "Registrar Pago",
      breadcrumb: "Registrar Pago",
    },
  },

  // Políticas de mora (CORREGIDO: ahora carga LateFeePolicyList)
  {
    path: "late-fee-policies",
    loadComponent: () =>
      import("./core/late-fee-policies/late-fee-policy-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Políticas de Mora",
      breadcrumb: "Políticas de Mora",
    },
  },

  // Estado de cuenta nativo (kardex)
  {
    path: "estado-cuenta",
    loadComponent: () =>
      import("./core/native-statement/native-statement").then(
        (m) => m.NativeStatement,
      ),
    canActivate: [authGuard],
    data: {
      title: "Estado de Cuenta Nativo",
      breadcrumb: "Estado de Cuenta",
    },
  },

  // Propiedades del condominio
  {
    path: "properties",
    loadComponent: () =>
      import("src/app/apps/resident.luxuryapp/property/propiedades-list").then(
        (m) => m.PropiedadesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Propiedades",
      breadcrumb: "Propiedades",
    },
  },

  // Miembros de propiedad (identidad unificada)
  {
    path: "members",
    loadComponent: () =>
      import("./core/members/member-list").then((m) => m.default),
    canActivate: [authGuard],
    data: {
      title: "Miembros de Propiedad",
      breadcrumb: "Miembros",
    },
  },

  // Bandeja de aprobaciones financieras
  {
    path: "approvals",
    loadComponent: () =>
      import("./core/approvals/approval-inbox").then((m) => m.default),
    canActivate: [authGuard],
    data: {
      title: "Aprobaciones Financieras",
      breadcrumb: "Aprobaciones",
    },
  },

  // Ledger financiero inmutable
  {
    path: "ledger",
    loadComponent: () =>
      import("./core/ledger/ledger-viewer").then((m) => m.default),
    canActivate: [authGuard],
    data: {
      title: "Ledger Financiero",
      breadcrumb: "Ledger",
    },
  },

  // Control de cierres de periodo
  {
    path: "period-closures",
    loadComponent: () =>
      import("./core/period-closures/period-closure-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cierres de Periodo",
      breadcrumb: "Cierres de Periodo",
    },
  },

  // Artículos del reglamento (catálogo base para multas)
  {
    path: "regulation-articles",
    loadComponent: () =>
      import("./core/regulation-articles/regulation-article-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Artículos del Reglamento", breadcrumb: "Reglamento" },
  },

  // Multas reglamentarias
  {
    path: "property-fines",
    loadComponent: () =>
      import("./core/property-fines/property-fine-list").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Multas Reglamentarias", breadcrumb: "Multas" },
  },

  // Casos de cobranza legal (gestoria)
  {
    path: "collection-cases",
    loadComponent: () =>
      import("./core/collection-cases/collection-case-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Casos de Cobranza Legal", breadcrumb: "Cobranza Legal" },
  },

  // Facturas CFDI
  {
    path: "invoices",
    loadComponent: () =>
      import("./core/invoices/invoice-list").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Facturas CFDI", breadcrumb: "Facturas" },
  },

  // Conciliacion de pagos
  {
    path: "reconciliation",
    loadComponent: () =>
      import("./core/reconciliation/reconciliation-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Conciliacion de Pagos", breadcrumb: "Conciliacion" },
  },

  // Auditoria financiera
  {
    path: "audit",
    loadComponent: () =>
      import("./core/audit/financial-audit-log").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Auditoria Financiera", breadcrumb: "Auditoria" },
  },

  // Servicios automatizados
  {
    path: "automated-services",
    loadComponent: () =>
      import("./core/automated-services/automated-services").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Servicios Automatizados",
      breadcrumb: "Servicios Automaticos",
    },
  },

  // Cuotas vigentes por propiedad (matriz de cobertura)
  {
    path: "charge-template-coverage",
    loadComponent: () =>
      import("./core/charge-template-coverage/charge-template-coverage").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cuotas Vigentes por Propiedad",
      breadcrumb: "Cuotas Vigentes",
    },
  },

  // Saldos iniciales por propiedad
  {
    path: "initial-balance",
    loadComponent: () =>
      import("./core/initial-balance/initial-balance").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Saldos Iniciales", breadcrumb: "Saldos Iniciales" },
  },

  // Como funciona el sistema
  {
    path: "system-overview",
    loadComponent: () =>
      import("./onboarding/system-overview/system-overview").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Como Funciona el Sistema", breadcrumb: "Como Funciona" },
  },

  {
    path: "flow-map",
    loadComponent: () =>
      import("./onboarding/system-flow-map/system-flow-map").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Mapa Visual del Flujo", breadcrumb: "Mapa Visual" },
  },
];

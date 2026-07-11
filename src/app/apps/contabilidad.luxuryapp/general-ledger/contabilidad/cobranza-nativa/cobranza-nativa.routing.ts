import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";

export const COBRANZA_NATIVA_ROUTES: Routes = [
  // Ruta raíz: /cobranza-nativa
  {
    path: "",
    loadComponent: () =>
      import("./pages/cobranza-nativa-dashboard/cobranza-nativa-dashboard").then(
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
      import("./pages/cobranza-dashboard/cobranza-dashboard").then(
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
      import("./pages/charge-types/charge-type-list").then((m) => m.default),
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
      import("./pages/charge-templates/charge-template-list").then(
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
      import("./pages/charges/charge-list").then((m) => m.default),
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
      import("./pages/payments/payments").then((m) => m.Payments),
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
      import("./pages/late-fee-policies/late-fee-policy-list").then(
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
      import("./pages/native-statement/native-statement").then(
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
      import("src/app/apps/operations.luxuryapp/properties/property/propiedades-list").then(
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
      import("./pages/members/member-list").then((m) => m.default),
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
      import("./pages/approvals/approval-inbox").then((m) => m.default),
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
      import("./pages/ledger/ledger-viewer").then((m) => m.default),
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
      import("./pages/period-closures/period-closure-dashboard").then(
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
      import("./pages/regulation-articles/regulation-article-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Artículos del Reglamento", breadcrumb: "Reglamento" },
  },

  // Multas reglamentarias
  {
    path: "property-fines",
    loadComponent: () =>
      import("./pages/property-fines/property-fine-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Multas Reglamentarias", breadcrumb: "Multas" },
  },

  // Casos de cobranza legal (gestoria)
  {
    path: "collection-cases",
    loadComponent: () =>
      import("./pages/collection-cases/collection-case-list").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Casos de Cobranza Legal", breadcrumb: "Cobranza Legal" },
  },

  // Facturas CFDI
  {
    path: "invoices",
    loadComponent: () =>
      import("./pages/invoices/invoice-list").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Facturas CFDI", breadcrumb: "Facturas" },
  },

  // Conciliacion de pagos
  {
    path: "reconciliation",
    loadComponent: () =>
      import("./pages/reconciliation/reconciliation-dashboard").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: { title: "Conciliacion de Pagos", breadcrumb: "Conciliacion" },
  },

  // Auditoria financiera
  {
    path: "audit",
    loadComponent: () =>
      import("./pages/audit/financial-audit-log").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Auditoria Financiera", breadcrumb: "Auditoria" },
  },

  // Servicios automatizados
  {
    path: "automated-services",
    loadComponent: () =>
      import("./pages/automated-services/automated-services").then(
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
      import("./pages/charge-template-coverage/charge-template-coverage").then(
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
      import("./pages/initial-balance/initial-balance").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Saldos Iniciales", breadcrumb: "Saldos Iniciales" },
  },

  // Como funciona el sistema
  {
    path: "system-overview",
    loadComponent: () =>
      import("./pages/system-overview/system-overview").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Como Funciona el Sistema", breadcrumb: "Como Funciona" },
  },

  {
    path: "flow-map",
    loadComponent: () =>
      import("./pages/system-flow-map/system-flow-map").then((m) => m.default),
    canActivate: [authGuard],
    data: { title: "Mapa Visual del Flujo", breadcrumb: "Mapa Visual" },
  },
];

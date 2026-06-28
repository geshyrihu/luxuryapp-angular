import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
import { superUsuarioGuard } from "src/app/core/guard/super-usuario.guard";
export const settingsRoutes: Routes = [
  // Rutas principales de configuración
  {
    path: "home",
    loadComponent: () =>
      import("src/app/features/system/access/settings-menu/settings-home").then(
        (m) => m.SettingsHome,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración de sistema",
      breadcrumb: "Configuración de sistema",
    },
  },

  // Rutas de gestión de usuarios y permisos
  {
    path: "application-user",
    loadComponent: () =>
      import("src/app/features/system/access/application-user/pages/application-user-list").then(
        (m) => m.ApplicationUserList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Administrador de usuarios",
      breadcrumb: "Administrador de usuarios",
    },
  },
  {
    // Suggested path: 'customers'
    path: "clientes",
    loadComponent: () =>
      import("src/app/features/system/gestin-de-cliente/customer/pages/customer-list").then(
        (m) => m.CustomerList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Clientes",
      breadcrumb: "Clientes",
    },
  },
  {
    // Suggested path: 'customer-module'
    path: "customer-modul",
    loadComponent: () =>
      import("src/app/features/system/gestin-de-cliente/customer-modul/pages/customer-modul-list").then(
        (m) => m.CustomerModulList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Modulos Clientes",
      breadcrumb: "Modulos Clientes",
    },
  },
  {
    // Suggested path: 'customer-module-edit/:customerId/:customerName'
    path: "customer-modul-edit/:customerId/:customerName",
    loadComponent: () =>
      import("src/app/features/system/gestin-de-cliente/customer-modul/pages/customer-modul-edit").then(
        (m) => m.CustomerModulEdit,
      ),
    canActivate: [authGuard],
    data: {
      title: "Editar modulos",
      breadcrumb: "Editar modulos",
    },
  },
  {
    path: "roles",
    loadComponent: () =>
      import("src/app/features/system/access/application-role/pages/roles-list").then(
        (m) => m.RolesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "RolesApp",
      breadcrumb: "RolesApp",
    },
  },
  {
    // Suggested path: 'module-app-role'
    path: "module-app-rol",
    loadComponent: () =>
      import("src/app/features/system/access/module-app-rol/pages/module-app-rol-list").then(
        (m) => m.ModuleAppRol,
      ),
    canActivate: [authGuard],
    data: {
      title: "Administración Roles-Modulos",
      breadcrumb: "Administración Roles-Modulos",
    },
  },
  {
    path: "module-app",
    loadComponent: () =>
      import("src/app/features/system/access/module-app/pages/module-app-list").then(
        (m) => m.ModuleAppList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de Modulos",
      breadcrumb: "Catalogo de Modulos",
    },
  },
  {
    // Suggested path: 'module-app-role-update/:roleId/:roleName'
    path: "module-app-rol-update/:roleId/:roleName",
    loadComponent: () =>
      import("src/app/features/system/access/module-app-rol/pages/module-app-rol-update").then(
        (m) => m.ModuleAppRolUpdate,
      ),
    canActivate: [authGuard],
    data: {
      title: "Actualizar modulos a Role",
      breadcrumb: "Actualizar modulos a Role",
    },
  },

  {
    path: "approval-rules",
    loadComponent: () =>
      import("src/app/features/system/catalogs/approval-rules/pages/approval-rules").then(
        (m) => m.ApprovalRules,
      ),
    canActivate: [authGuard],
    data: {
      title: "Jerarquía de Aprobación",
      breadcrumb: "Jerarquía de Aprobación",
    },
  },

  // Rutas de configuración de empresa y correo
  {
    path: "customer-data-company",
    loadComponent: () =>
      import("src/app/features/system/gestin-de-cliente/customer-data-company/customer-data-company-list").then(
        (m) => m.CustomerDataCompanyList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Datos del Cliente por Empresa",
      breadcrumb: "Datos del Cliente por Empresa",
    },
  },
  {
    // Suggested path: 'email-data'
    path: "datos-email",
    loadComponent: () =>
      import("src/app/features/system/gestin-de-cliente/email-data/email-data-list").then(
        (m) => m.EmailDataList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Datos de Correo",
      breadcrumb: "Datos de Correo",
    },
  },
  {
    path: "depuration",
    loadComponent: () =>
      import("src/app/features/system/test/test/update-data-base/update-data-base").then(
        (m) => m.UpdateDataBase,
      ),
    canActivate: [authGuard],
    data: {
      title: "Depuración",
      breadcrumb: "Depuración",
    },
  },

  // Rutas de catálogos
  {
    path: "banks",
    loadComponent: () =>
      import("src/app/features/system/catalogs/banks/bank-list").then(
        (m) => m.BankList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de bancos",
      breadcrumb: "Listado de bancos",
    },
  },
  {
    // Suggested path: 'payment-method'
    path: "forma-pago",
    loadComponent: () =>
      import("src/app/features/system/catalogs/payment-method/pages/payment-method-list").then(
        (m) => m.PaymentMethodList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Formas de Pago",
      breadcrumb: "Lista de Formas de Pago",
    },
  },
  {
    // Suggested path: 'payment-method'
    path: "metodo-pago",
    loadComponent: () =>
      import("src/app/features/system/catalogs/payment-type/payment-type-list").then(
        (m) => m.PaymentTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Métodos de Pago",
      breadcrumb: "Lista de Métodos de Pago",
    },
  },
  {
    // Suggested path: 'cfdi-use'
    path: "uso-cfdi",
    loadComponent: () =>
      import("src/app/features/system/catalogs/cfdi-use/pages/cfdi-use-list").then(
        (m) => m.CfdiUseList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Usos CFDI",
      breadcrumb: "Lista de Usos CFDI",
    },
  },
  {
    path: "jobs",
    loadComponent: () =>
      import("src/app/features/system/audit-logs/jobs/pages/jobs-dashboard").then(
        (m) => m.JobsDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Jobs administrables",
      breadcrumb: "Jobs administrables",
    },
  },
  {
    path: "app-implementation-report",
    loadComponent: () =>
      import("src/app/features/system/audit-logs/app-implementation-tracking/app-implementation-tracking-manual").then(
        (m) => m.AppImplementationTrackingManual,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Empleados",
      breadcrumb: "Reporte de Empleados",
    },
  },
  {
    path: "meter-category",
    loadComponent: () =>
      import("src/app/features/system/catalogs/meter-category/meter-category-list").then(
        (m) => m.MeterCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Categorías de Medidores",
      breadcrumb: "Lista de Categorías de Medidores",
    },
  },
  {
    path: "product-category",
    loadComponent: () =>
      import("src/app/features/system/catalogs/product-category/product-category-list").then(
        (m) => m.ProductCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Categorías de Productos",
      breadcrumb: "Lista de Categorías de Productos",
    },
  },
  {
    // Suggested path: 'machinery-classification'
    path: "machinery-classification",
    loadComponent: () =>
      import("src/app/features/system/catalogs/machinery-classification/machinery-classification-list").then(
        (m) => m.MachineryClassificationList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Clasificación de Maquinaria",
      breadcrumb: "Clasificación de Maquinaria",
    },
  },
  {
    path: "units-of-measurement",
    loadComponent: () =>
      import("src/app/features/system/catalogs/units-of-measurement/unit-of-measurement-list").then(
        (m) => m.UnitOfMeasurementList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Unidades de Medida",
      breadcrumb: "Lista de Unidades de Medida",
    },
  },
  {
    path: "audit-entries",
    loadComponent: () =>
      import("src/app/features/system/access/audit-entries/audit-entries").then(
        (m) => m.AuditEntries,
      ),
    canActivate: [authGuard],
    data: {
      title: "Auditoría de cambios",
      breadcrumb: "Auditoría de cambios",
    },
  },
  {
    path: "user-activity-history",
    loadComponent: () =>
      import("src/app/features/system/audit-logs/user-activity-history/user-activity-history").then(
        (m) => m.UserActivityHistory,
      ),
    canActivate: [authGuard],
    data: {
      title: "Analisis de actividad",
      breadcrumb: "Analisis de actividad",
    },
  },
  {
    path: "incident-types",
    loadComponent: () =>
      import("src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/incident-type-list").then(
        (m) => m.IncidentTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Incidencia",
      breadcrumb: "Tipos de Incidencia",
    },
  },
  {
    path: "sanction-types",
    loadComponent: () =>
      import("src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/sanction-type-list").then(
        (m) => m.SanctionTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Sanción",
      breadcrumb: "Tipos de Sanción",
    },
  },
  {
    path: "log-api-report",
    loadComponent: () =>
      import("src/app/features/system/audit-logs/log-api-report/log-api-report").then(
        (m) => m.LogApiReport,
      ),
    canActivate: [authGuard],
    data: {
      title: "Loggers API",
      breadcrumb: "Loggers API",
    },
  },
  {
    path: "brevo-logs",
    loadComponent: () =>
      import("src/app/features/system/audit-logs/brevo/brevo-email-logs").then(
        (m) => m.BrevoEmailLogs,
      ),
    canActivate: [authGuard],
    data: {
      title: "Logs de Brevo",
      breadcrumb: "Logs de Brevo",
    },
  },

  {
    path: "testsignalr",
    loadComponent: () =>
      import("src/app/features/system/test/test/testsignalr/testsignalr").then(
        (m) => m.Testsignalr,
      ),
    canActivate: [authGuard],
    data: {
      title: "TestingSignal",
      breadcrumb: "TestingSignal",
    },
  },

  {
    path: "test-email",
    loadComponent: () =>
      import("src/app/features/system/debug/send-email/text-email").then(
        (m) => m.TextEmail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Iconos SVG",
      breadcrumb: "Iconos SVG",
    },
  },
  {
    path: "mini-postman",
    loadComponent: () =>
      import("src/app/features/system/debug/mini-postman/mini-postman").then(
        (m) => m.MiniPostman,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mini Postman",
      breadcrumb: "Mini Postman",
    },
  },
  {
    path: "ticket-group-category",
    loadComponent: () =>
      import("src/app/features/operations/task-engine/tasks/work-group-categories/pages/task-group-category-list").then(
        (m) => m.TaskGroupCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Categoría de Grupos de Tickets",
      breadcrumb: "Categoría de Grupos de Tickets",
    },
  },
  {
    path: "asamblea-checklist-catalog",
    loadComponent: () =>
      import("src/app/features/operations/asambleas-y-planificacin/asamblea-checklist-template/asamblea-checklist-template-list").then(
        (m) => m.AsambleaChecklistTemplateList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de checklist de asamblea",
      breadcrumb: "Catalogo checklist asamblea",
    },
  },
  {
    path: "juntas-mensuales-conciliacion",
    loadComponent: () =>
      import("src/app/features/operations/meetings/juntas-mensuales-backfill/juntas-mensuales-backfill").then(
        (m) => m.JuntasMensualesBackfill,
      ),
    canActivate: [authGuard],
    data: {
      title: "Conciliacion de juntas mensuales",
      breadcrumb: "Conciliacion de juntas mensuales",
    },
  },
  {
    path: "inspection-reviews-catalog",
    loadComponent: () =>
      import("src/app/features/operations/inspecciones-y-auditora/inspection/catalogo/catalogo-revisiones-inspeccion").then(
        (m) => m.CatalogoRevisionesInspeccion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de inspecciones",
      breadcrumb: "Catalogo de inspecciones",
    },
  },
  {
    path: "catalog-asset",
    loadComponent: () =>
      import("src/app/features/operations/inspecciones-y-auditora/inspection/catalogo/catalogo-activo-lista").then(
        (m) => m.CatalogoActivoLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de amenidades",
      breadcrumb: "Catalogo de amenidades",
    },
  },
  {
    path: "entrega-recepcion-cliente",
    loadComponent: () =>
      import("src/app/features/operations/properties/delivery-reception-catalog/catalogo-descripcion-list").then(
        (m) => m.CatalogoDescripcionList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega y Recepción",
      breadcrumb: "Entrega y Recepción",
    },
  },
  {
    path: "ui-catalog",
    loadComponent: () =>
      import("src/app/features/system/catalogs/catalog-component-ui/catalog-layout/catalog-layout").then(
        (m) => m.CatalogLayout,
      ),
    canActivate: [authGuard],
    data: {
      title: "Design System & Guía Documental",
      breadcrumb: "Guía de Estilos",
    },
    children: [
      { path: "", redirectTo: "tokens/colors", pathMatch: "full" },
      { path: "tokens", redirectTo: "tokens/colors" },
      { path: "componentes", redirectTo: "web/accordion" },
      { path: "web", redirectTo: "web/accordion" },
      { path: "mobile", redirectTo: "mobile/buttons" },
      { path: "core", redirectTo: "core/actionmenu" },
      { path: "charts", redirectTo: "charts/bar" },
      { path: "patrones-layouts", redirectTo: "patterns/loginreference" },
      { path: "patterns", redirectTo: "patterns/loginreference" },
      { path: "layouts", redirectTo: "layouts/fullwidth" },
      { path: "guia-estandares", redirectTo: "guia/identitypillars" },
      { path: "guia", redirectTo: "guia/identitypillars" },
      { path: "docs", redirectTo: "docs/documenttypes" },
      { path: "audit", redirectTo: "audit/contentblocks" },
      {
        path: "tokens/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-tokens-item/catalog-tokens-item").then(
            (m) => m.CatalogTokensItem,
          ),
      },
      {
        path: "web/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-web-item/catalog-web-item").then(
            (m) => m.CatalogWebItem,
          ),
      },
      {
        path: "mobile/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-mobile-item/catalog-mobile-item").then(
            (m) => m.CatalogMobileItem,
          ),
      },
      {
        path: "core/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-core-item/catalog-core-item").then(
            (m) => m.CatalogCoreItem,
          ),
      },
      {
        path: "charts/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-charts-item/catalog-charts-item").then(
            (m) => m.CatalogChartsItem,
          ),
      },
      {
        path: "patterns/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-patterns-item/catalog-patterns-item").then(
            (m) => m.CatalogPatternsItem,
          ),
      },
      {
        path: "layouts/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-layouts-item/catalog-layouts-item").then(
            (m) => m.CatalogLayoutsItem,
          ),
      },
      {
        path: "docs/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-docs-item/catalog-docs-item").then(
            (m) => m.CatalogDocsItem,
          ),
      },
      {
        path: "audit/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-audit-item/catalog-audit-item").then(
            (m) => m.CatalogAuditItem,
          ),
      },
      {
        path: "guia/:item",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-guia-item/catalog-guia-item").then(
            (m) => m.CatalogGuiaItem,
          ),
      },
    ],
  },
  {
    path: "ai-knowledge-base",
    loadComponent: () =>
      import("src/app/features/system/ai/knowledge-base/ai-knowledge-base-list").then(
        (m) => m.AiKnowledgeBaseList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Base de Conocimiento IA",
      breadcrumb: "ðŸ§  Base de Conocimiento IA",
    },
  },

  {
    path: "vault-secrets",
    loadComponent: () =>
      import("src/app/features/system/access/vault-secrets/vault-secrets-list").then(
        (m) => m.VaultSecretsList,
      ),
    canActivate: [authGuard, superUsuarioGuard],
    data: {
      title: "Secretos del Vault",
      breadcrumb: "Secretos del Vault",
    },
  },
  {
    path: "eleven-labs",
    loadComponent: () =>
      import("src/app/features/system/vault/eleven-labs/eleven-labs-settings").then(
        (m) => m.ElevenLabsSettingsComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración ElevenLabs",
      breadcrumb: "Configuración ElevenLabs",
    },
  },
  {
    path: "ia-test",
    loadComponent: () =>
      import("src/app/features/system/ai/ia-test/ia-test.component").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Prueba de Inteligencia Artificial",
      breadcrumb: "Prueba de IA",
    },
  },
];

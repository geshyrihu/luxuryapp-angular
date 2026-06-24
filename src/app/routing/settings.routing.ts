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
      { path: "", redirectTo: "tokens", pathMatch: "full" },
      {
        path: "tokens",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-tokens/catalog-tokens").then(
            (m) => m.CatalogTokens,
          ),
      },
      {
        path: "web",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-web/catalog-web").then(
            (m) => m.CatalogWeb,
          ),
      },
      {
        path: "mobile",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-mobile/catalog-mobile").then(
            (m) => m.CatalogMobile,
          ),
      },
      {
        path: "core",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-core/catalog-core").then(
            (m) => m.CatalogCore,
          ),
      },
      {
        path: "charts",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-charts/catalog-charts").then(
            (m) => m.CatalogCharts,
          ),
      },
      {
        path: "patterns",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-patterns/catalog-patterns").then(
            (m) => m.CatalogPatterns,
          ),
      },
      {
        path: "layouts",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-layouts/catalog-layouts").then(
            (m) => m.CatalogLayouts,
          ),
      },
      {
        path: "docs",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-docs/catalog-docs").then(
            (m) => m.CatalogDocs,
          ),
      },
      {
        path: "audit",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-audit/catalog-audit").then(
            (m) => m.CatalogAudit,
          ),
      },
      {
        path: "guia",
        loadComponent: () =>
          import("src/app/features/system/catalogs/catalog-component-ui/pages/catalog-guia/catalog-guia").then(
            (m) => m.CatalogGuia,
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

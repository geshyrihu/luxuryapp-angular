import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";
import { superUsuarioGuard } from "@core/auth/guards/super-usuario.guard";
export const adminRoutes: Routes = [
  // Ruta principal
  {
    path: "",
    loadComponent: () =>
      import("@admin.luxuryapp/admin-wrapper/admin-wrapper").then(
        (m) => m.AdminWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración de sistema",
      breadcrumb: "Configuración de sistema",
    },
  },

  // Seguridad y Permisos
  {
    path: "customers",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/customer/customer-list").then(
        (m) => m.CustomerList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Clientes",
      breadcrumb: "Clientes",
    },
  },
  {
    path: "user-accounts",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/user-accounts/user-account-list").then(
        (m) => m.UserAccountList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Administrador de usuarios",
      breadcrumb: "Administrador de usuarios",
    },
  },
  {
    path: "roles",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/application-roles/roles-list").then(
        (m) => m.RolesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Roles de Aplicación",
      breadcrumb: "Roles de Aplicación",
    },
  },
  {
    path: "module-app",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/module-apps/module-app-list").then(
        (m) => m.ModuleAppList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Módulos",
      breadcrumb: "Catálogo de Módulos",
    },
  },
  {
    path: "customer-module",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/customer-modules/customer-modul-list").then(
        (m) => m.CustomerModulList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Modulos Clientes",
      breadcrumb: "Modulos Clientes",
    },
  },
  {
    path: "customer-module-edit/:customerId/:customerName",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/customer-modules/customer-modul-edit").then(
        (m) => m.CustomerModulEdit,
      ),
    canActivate: [authGuard],
    data: {
      title: "Editar modulos",
      breadcrumb: "Editar modulos",
    },
  },
  {
    path: "module-app-role",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/module-app-roles/module-app-rol-list").then(
        (m) => m.ModuleAppRol,
      ),
    canActivate: [authGuard],
    data: {
      title: "Administración Roles-Módulos",
      breadcrumb: "Administración Roles-Módulos",
    },
  },
  {
    path: "module-app-role-update/:roleId/:roleName",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/module-app-roles/module-app-rol-update").then(
        (m) => m.ModuleAppRolUpdate,
      ),
    canActivate: [authGuard],
    data: {
      title: "Actualizar módulos del rol",
      breadcrumb: "Actualizar módulos del rol",
    },
  },
  {
    path: "approval-rules",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/approval-rules/approval-rules").then(
        (m) => m.ApprovalRules,
      ),
    canActivate: [authGuard],
    data: {
      title: "Jerarquía de Aprobación",
      breadcrumb: "Jerarquía de Aprobación",
    },
  },
  {
    path: "interviewer-matrix",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/interviewer-matrices/interviewer-matrix").then(
        (m) => m.InterviewerMatrix,
      ),
    canActivate: [superUsuarioGuard],
    data: {
      title: "Matriz de Entrevistadores",
      breadcrumb: "Matriz de Entrevistadores",
    },
  },
  {
    path: "employee-permissions/:applicationUserId",
    loadComponent: () =>
      import("@admin.luxuryapp/security-permissions/profile-users/employee-permission-app").then(
        (m) => m.EmployeePermissionApp,
      ),
    canActivate: [authGuard, superUsuarioGuard],
    data: {
      title: "Permisos de empleado",
      breadcrumb: "Permisos de empleado",
    },
  },

  // Catálogos Generales
  {
    path: "banks",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/banks/bank-list").then(
        (m) => m.BankList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de bancos",
      breadcrumb: "Listado de bancos",
    },
  },
  {
    path: "payment-method",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/payment-method/payment-method-list").then(
        (m) => m.PaymentMethodList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Formas de Pago",
      breadcrumb: "Lista de Formas de Pago",
    },
  },
  {
    path: "payment-type",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/payment-type/payment-type-list").then(
        (m) => m.PaymentTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Métodos de Pago",
      breadcrumb: "Lista de Métodos de Pago",
    },
  },
  {
    path: "cfdi-use",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/cfdi-usage/cfdi-use-list").then(
        (m) => m.CfdiUseList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Usos CFDI",
      breadcrumb: "Lista de Usos CFDI",
    },
  },
  {
    path: "units-of-measurement",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/units-of-measurement/unit-of-measurement-list").then(
        (m) => m.UnitOfMeasurementList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Unidades de Medida",
      breadcrumb: "Lista de Unidades de Medida",
    },
  },
  {
    path: "recruitment-sources",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/recruitment-sources/recruitment-source-catalog-list").then(
        (m) => m.RecruitmentSourceCatalogList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fuentes de Reclutamiento",
      breadcrumb: "Fuentes de Reclutamiento",
    },
  },
  {
    path: "document-catalogs",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/document-catalog/document-catalog-list").then(
        (m) => m.DocumentCatalogList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Documentos",
      breadcrumb: "Catálogo de Documentos",
    },
  },
  {
    path: "onboarding-checklist-options",
    loadComponent: () =>
      import("@shared.luxuryapp/catalogs/onboarding-checklist-options/onboarding-checklist-option-list").then(
        (m) => m.OnboardingChecklistOptionList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Checklist de Onboarding",
      breadcrumb: "Checklist de Onboarding",
    },
  },

  // Catálogos de Tickets y Mantenimiento
  {
    path: "ticket-group-category",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-ticket-catalogs/task-group-category-list/task-group-category-list").then(
        (m) => m.TaskGroupCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Categoría de Grupos de Tickets",
      breadcrumb: "Categoría de Grupos de Tickets",
    },
  },
  {
    path: "meter-category",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-ticket-catalogs/meter-category/meter-category-list").then(
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
      import("@maintenance.luxuryapp/maintenance-ticket-catalogs/product-category/product-category-list").then(
        (m) => m.ProductCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Categorías de Productos",
      breadcrumb: "Lista de Categorías de Productos",
    },
  },
  {
    path: "machinery-classification",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-ticket-catalogs/machinery-classification/machinery-classification-list").then(
        (m) => m.MachineryClassificationList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Clasificación de Maquinaria",
      breadcrumb: "Clasificación de Maquinaria",
    },
  },
  {
    path: "client-delivery-reception",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-ticket-catalogs/delivery-reception-catalog/catalogo-descripcion-list").then(
        (m) => m.CatalogoDescripcionList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega y Recepción",
      breadcrumb: "Entrega y Recepción",
    },
  },
  {
    path: "catalog-asset",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-ticket-catalogs/asset-catalog-list/catalogo-activo-lista").then(
        (m) => m.CatalogoActivoLista,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de amenidades",
      breadcrumb: "Catalogo de amenidades",
    },
  },
  {
    path: "inspection-reviews-catalog",
    loadComponent: () =>
      import("@maintenance.luxuryapp/maintenance-ticket-catalogs/inspection-revision-catalog/catalogo-revisiones-inspeccion").then(
        (m) => m.CatalogoRevisionesInspeccion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de inspecciones",
      breadcrumb: "Catalogo de inspecciones",
    },
  },

  // Configuración de Sistema
  {
    path: "ai-knowledge-base",
    loadComponent: () =>
      import("@admin.luxuryapp/system-configuration/knowledge-base/ai-knowledge-base-list").then(
        (m) => m.AiKnowledgeBaseList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Base de Conocimiento IA",
      breadcrumb: "🧠 Base de Conocimiento IA",
    },
  },
  {
    path: "monthly-meetings-reconciliation",
    loadComponent: () =>
      import("@operations.luxuryapp/monthly-meetings/backfill/juntas-mensuales-backfill").then(
        (m) => m.JuntasMensualesBackfill,
      ),
    canActivate: [authGuard],
    data: {
      title: "Conciliacion de juntas mensuales",
      breadcrumb: "Conciliacion de juntas mensuales",
    },
  },
  {
    path: "assembly-checklist-catalog",
    loadComponent: () =>
      import("@admin.luxuryapp/system-configuration/assembly-checklist-templates/asamblea-checklist-template-list").then(
        (m) => m.AsambleaChecklistTemplateList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de checklist de asamblea",
      breadcrumb: "Catalogo checklist asamblea",
    },
  },
  {
    path: "recurring-task-catalog",
    loadComponent: () =>
      import("@operations.luxuryapp/task/recurring-tasks/catalog/recurring-task-catalog-list/recurring-task-catalog-list").then(
        (m) => m.RecurringTaskCatalogList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Tareas Recurrentes",
      breadcrumb: "Catálogo de Tareas Recurrentes",
    },
  },
  {
    path: "vault-secrets",
    loadComponent: () =>
      import("@admin.luxuryapp/system-configuration/vault-secrets/vault-secrets-list").then(
        (m) => m.VaultSecretsList,
      ),
    canActivate: [authGuard, superUsuarioGuard],
    data: {
      title: "Secretos del Vault",
      breadcrumb: "Secretos del Vault",
    },
  },
  {
    path: "database-backup",
    loadComponent: () =>
      import("@admin.luxuryapp/system-configuration/database-backup/database-backup-list").then(
        (m) => m.DatabaseBackupList,
      ),
    canActivate: [authGuard, superUsuarioGuard],
    data: {
      title: "Respaldo de Bases de Datos",
      breadcrumb: "Respaldo de BD",
    },
  },
  {
    path: "jobs",
    loadComponent: () =>
      import("@admin.luxuryapp/system-configuration/jobs/jobs-dashboard").then(
        (m) => m.JobsDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Jobs administrables",
      breadcrumb: "Jobs administrables",
    },
  },

  // Configuración de Correo Electrónico
  {
    path: "customer-data-company",
    loadComponent: () =>
      import("@admin.luxuryapp/email-configuration/customer-data-companies/customer-data-company-list").then(
        (m) => m.CustomerDataCompanyList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Datos del Cliente por Empresa",
      breadcrumb: "Datos del Cliente por Empresa",
    },
  },
  {
    path: "email-data",
    loadComponent: () =>
      import("@admin.luxuryapp/email-configuration/email-data/email-data-list").then(
        (m) => m.EmailDataList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Datos de Correo",
      breadcrumb: "Datos de Correo",
    },
  },

  // Recursos Humanos
  {
    path: "incident-types",
    loadComponent: () =>
      import("@human-resources.luxuryapp/hr-admin/incident-type-list/incident-type-list").then(
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
      import("@human-resources.luxuryapp/hr-admin/sanction-type-list/sanction-type-list").then(
        (m) => m.SanctionTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Sanción",
      breadcrumb: "Tipos de Sanción",
    },
  },

  // Análisis y Registros
  {
    path: "audit-entries",
    loadComponent: () =>
      import("@admin.luxuryapp/system-audit-logs/audit-entries/audit-entries").then(
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
      import("@admin.luxuryapp/system-audit-logs/user-activity-history/user-activity-history").then(
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
      import("@admin.luxuryapp/system-audit-logs/log-api-report/log-api-report").then(
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
      import("@admin.luxuryapp/system-audit-logs/brevo/brevo-email-logs").then(
        (m) => m.BrevoEmailLogs,
      ),
    canActivate: [authGuard],
    data: {
      title: "Logs de Brevo",
      breadcrumb: "Logs de Brevo",
    },
  },

  // Herramientas de Desarrollo / Prueba
  {
    path: "mini-postman",
    loadComponent: () =>
      import("@admin.luxuryapp/infrastructure/mini-postman/mini-postman").then(
        (m) => m.MiniPostman,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mini Postman",
      breadcrumb: "Mini Postman",
    },
  },
  {
    path: "app-implementation-report",
    loadComponent: () =>
      import("@admin.luxuryapp/infrastructure/app-implementation-tracking/app-implementation-tracking-manual").then(
        (m) => m.AppImplementationTrackingManual,
      ),
    canActivate: [authGuard],
    data: {
      title: "Reporte de Empleados",
      breadcrumb: "Reporte de Empleados",
    },
  },
  {
    path: "ui-catalog",
    loadComponent: () =>
      import("@admin.luxuryapp/infrastructure/catalog-component-ui/catalog-layout/catalog-layout").then(
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
      { path: "components", redirectTo: "web/accordion" },
      { path: "web", redirectTo: "web/accordion" },
      { path: "mobile", redirectTo: "mobile/buttons" },
      { path: "core", redirectTo: "core/actionmenu" },
      { path: "charts", redirectTo: "charts/bar" },
      { path: "patterns-layouts", redirectTo: "patterns/loginreference" },
      { path: "patterns", redirectTo: "patterns/loginreference" },
      { path: "layouts", redirectTo: "layouts/fullwidth" },
      { path: "guide-standards", redirectTo: "guide/identitypillars" },
      { path: "guide", redirectTo: "guide/identitypillars" },
      { path: "extras", redirectTo: "extras/forms" },
      { path: "docs", redirectTo: "docs/documenttypes" },
      { path: "audit", redirectTo: "audit/contentblocks" },
      {
        path: "tokens/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/foundations/catalog-tokens-item/catalog-tokens-item").then(
            (m) => m.CatalogTokensItem,
          ),
      },
      {
        path: "web/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/catalog-web-item/catalog-web-item").then(
            (m) => m.CatalogWebItem,
          ),
      },
      {
        path: "mobile/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/catalog-mobile-item/catalog-mobile-item").then(
            (m) => m.CatalogMobileItem,
          ),
      },
      {
        path: "core/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/catalog-core-item/catalog-core-item").then(
            (m) => m.CatalogCoreItem,
          ),
      },
      {
        path: "charts/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/charts/catalog-charts-item/catalog-charts-item").then(
            (m) => m.CatalogChartsItem,
          ),
      },
      {
        path: "patterns/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item").then(
            (m) => m.CatalogPatternsItem,
          ),
      },
      {
        path: "layouts/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/patterns-layouts/catalog-layouts-item/catalog-layouts-item").then(
            (m) => m.CatalogLayoutsItem,
          ),
      },
      {
        path: "docs/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/foundations/catalog-docs-item/catalog-docs-item").then(
            (m) => m.CatalogDocsItem,
          ),
      },
      {
        path: "audit/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/foundations/catalog-audit-item/catalog-audit-item").then(
            (m) => m.CatalogAuditItem,
          ),
      },
      {
        path: "guide/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/foundations/catalog-guide-item/catalog-guia-item").then(
            (m) => m.CatalogGuiaItem,
          ),
      },
      {
        path: "extras/:item",
        loadComponent: () =>
          import("@admin.luxuryapp/infrastructure/catalog-component-ui/catalog-core-item/catalog-web-extras").then(
            (m) => m.CatalogWebExtras,
          ),
      },
    ],
  },
  {
    path: "depuration",
    loadComponent: () =>
      import("@admin.luxuryapp/infrastructure/update-data-base/update-data-base").then(
        (m) => m.UpdateDataBase,
      ),
    canActivate: [authGuard],
    data: {
      title: "UpdateDataBase",
      breadcrumb: "UpdateDataBase",
    },
  },
  {
    path: "testsignalr",
    loadComponent: () =>
      import("@admin.luxuryapp/infrastructure/signalr-test/testsignalr").then(
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
      import("@admin.luxuryapp/infrastructure/send-email/test-email").then(
        (m) => m.TestEmail,
      ),
    canActivate: [authGuard],
    data: {
      title: "Iconos SVG",
      breadcrumb: "Iconos SVG",
    },
  },
  {
    path: "eleven-labs",
    loadComponent: () =>
      import("@admin.luxuryapp/system-configuration/eleven-labs/eleven-labs-settings").then(
        (m) => m.ElevenLabsSettingsComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración ElevenLabs",
      breadcrumb: "Configuración ElevenLabs",
    },
  },
  {
    path: "ai-test",
    loadComponent: () =>
      import("@admin.luxuryapp/infrastructure/ai-test/ia-test.component").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Prueba de Inteligencia Artificial",
      breadcrumb: "Prueba de IA",
    },
  },
  {
    path: "pricing-calculator",
    loadComponent: () =>
      import("@admin.luxuryapp/infrastructure/quotations/cotizador.component").then(
        (m) => m.CotizadorComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cotizador",
      breadcrumb: "Cotizador",
    },
  },
  {
    path: "access-control/puertas",
    loadComponent: () =>
      import("@admin.luxuryapp/access-control/access-point-list").then(
        (m) => m.AccessPointList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Puntos de acceso",
      breadcrumb: "Puntos de acceso",
    },
  },
  {
    path: "access-control/visitantes",
    loadComponent: () =>
      import("@admin.luxuryapp/access-control/visitor-list").then(
        (m) => m.VisitorList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Visitantes",
      breadcrumb: "Visitantes",
    },
  },
  {
    path: "access-control/dashboard",
    loadComponent: () =>
      import("@admin.luxuryapp/access-control/access-dashboard").then(
        (m) => m.AccessDashboard,
      ),
    canActivate: [authGuard],
    data: {
      title: "Dashboard de accesos",
      breadcrumb: "Dashboard de accesos",
    },
  },
  {
    path: "access-control/bitacora",
    loadComponent: () =>
      import("@admin.luxuryapp/access-control/access-events").then(
        (m) => m.AccessEvents,
      ),
    canActivate: [authGuard],
    data: {
      title: "Bitácora de accesos",
      breadcrumb: "Bitácora de accesos",
    },
  },
  {
    path: "conventions-guide",
    loadComponent: () =>
      import("@admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer").then(
        (m) => m.ConventionsViewer,
      ),
    canActivate: [authGuard],
    data: {
      title: "CONVENTIONS.md - Guía Interactiva",
      breadcrumb: "Conventions Guide",
    },
  },
];

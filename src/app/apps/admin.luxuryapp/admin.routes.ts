import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/auth/guards/auth.guard";
import { superUsuarioGuard } from "src/app/core/auth/guards/super-usuario.guard";
export const adminRoutes: Routes = [
  // Ruta principal
  {
    path: "",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/admin-wrapper/admin-wrapper").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/customer/customer-list").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/user-accounts/user-account-list").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/application-role/roles-list").then(
        (m) => m.RolesList,
      ),
    canActivate: [authGuard],
    data: {
      title: "RolesApp",
      breadcrumb: "RolesApp",
    },
  },
  {
    path: "module-app",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/module-app/module-app-list").then(
        (m) => m.ModuleAppList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de Modulos",
      breadcrumb: "Catalogo de Modulos",
    },
  },
  {
    path: "customer-module",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/customer-modul/customer-modul-list").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/customer-modul/customer-modul-edit").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-list").then(
        (m) => m.ModuleAppRol,
      ),
    canActivate: [authGuard],
    data: {
      title: "Administración Roles-Modulos",
      breadcrumb: "Administración Roles-Modulos",
    },
  },
  {
    path: "module-app-role-update/:roleId/:roleName",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/module-app-rol/module-app-rol-update").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/approval-rules/approval-rules").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/interviewer-matrix/interviewer-matrix").then(
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
      import("src/app/apps/admin.luxuryapp/seguridad-permisos/profile-users/employee-permission-app").then(
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
      import("src/app/apps/admin.luxuryapp/catalogos-generales/banks/bank-list").then(
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
      import("src/app/apps/admin.luxuryapp/catalogos-generales/payment-method/payment-method-list").then(
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
      import("src/app/apps/admin.luxuryapp/catalogos-generales/payment-type/payment-type-list").then(
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
      import("src/app/apps/admin.luxuryapp/catalogos-generales/cfdi-use/cfdi-use-list").then(
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
      import("src/app/apps/admin.luxuryapp/catalogos-generales/units-of-measurement/unit-of-measurement-list").then(
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
      import("src/app/apps/admin.luxuryapp/catalogos-generales/recruitment-sources/recruitment-source-catalog-list").then(
        (m) => m.RecruitmentSourceCatalogList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Fuentes de Reclutamiento",
      breadcrumb: "Fuentes de Reclutamiento",
    },
  },

  // Catálogos de Tickets y Mantenimiento
  {
    path: "ticket-group-category",
    loadComponent: () =>
      import("src/app/apps/mantenimiento.luxuryapp/catalogos-tickets-mantenimiento/task-group-category-list/task-group-category-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/catalogos-tickets-mantenimiento/meter-category/meter-category-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/catalogos-tickets-mantenimiento/product-category/product-category-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/catalogos-tickets-mantenimiento/machinery-classification/machinery-classification-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/catalogos-tickets-mantenimiento/delivery-reception-catalog/catalogo-descripcion-list").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/catalogos-tickets-mantenimiento/catalogo-activo-lista/catalogo-activo-lista").then(
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
      import("src/app/apps/mantenimiento.luxuryapp/catalogos-tickets-mantenimiento/catalogo-revisiones-inspeccion/catalogo-revisiones-inspeccion").then(
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
      import("src/app/apps/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list").then(
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
      import("src/app/apps/system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill").then(
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
      import("src/app/apps/admin.luxuryapp/configuracion-sistema/asamblea-checklist-template/asamblea-checklist-template-list").then(
        (m) => m.AsambleaChecklistTemplateList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de checklist de asamblea",
      breadcrumb: "Catalogo checklist asamblea",
    },
  },
  {
    path: "vault-secrets",
    loadComponent: () =>
      import("src/app/apps/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list").then(
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
      import("src/app/apps/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list").then(
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
      import("src/app/apps/admin.luxuryapp/configuracion-sistema/jobs/jobs-dashboard").then(
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
      import("src/app/apps/admin.luxuryapp/configuracion-correo/customer-data-company/customer-data-company-list").then(
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
      import("src/app/apps/admin.luxuryapp/configuracion-correo/email-data/email-data-list").then(
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
      import("src/app/apps/recursos-humanos.luxuryapp/recursos-humanos-admin/incident-type-list/incident-type-list").then(
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
      import("src/app/apps/recursos-humanos.luxuryapp/recursos-humanos-admin/sanction-type-list/sanction-type-list").then(
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
      import("src/app/apps/admin.luxuryapp/analisis-registros/audit-entries/audit-entries").then(
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
      import("src/app/apps/admin.luxuryapp/analisis-registros/user-activity-history/user-activity-history").then(
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
      import("src/app/apps/admin.luxuryapp/analisis-registros/log-api-report/log-api-report").then(
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
      import("src/app/apps/admin.luxuryapp/analisis-registros/brevo/brevo-email-logs").then(
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
      import("src/app/apps/admin.luxuryapp/herramientas-dev/mini-postman/mini-postman").then(
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
      import("src/app/apps/admin.luxuryapp/herramientas-dev/app-implementation-tracking/app-implementation-tracking-manual").then(
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
      import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-layout/catalog-layout").then(
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
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-tokens-item/catalog-tokens-item").then(
            (m) => m.CatalogTokensItem,
          ),
      },
      {
        path: "web/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-web-item/catalog-web-item").then(
            (m) => m.CatalogWebItem,
          ),
      },
      {
        path: "mobile/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-mobile-item/catalog-mobile-item").then(
            (m) => m.CatalogMobileItem,
          ),
      },
      {
        path: "core/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item").then(
            (m) => m.CatalogCoreItem,
          ),
      },
      {
        path: "charts/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/charts/catalog-charts-item/catalog-charts-item").then(
            (m) => m.CatalogChartsItem,
          ),
      },
      {
        path: "patterns/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item").then(
            (m) => m.CatalogPatternsItem,
          ),
      },
      {
        path: "layouts/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-layouts-item/catalog-layouts-item").then(
            (m) => m.CatalogLayoutsItem,
          ),
      },
      {
        path: "docs/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-docs-item/catalog-docs-item").then(
            (m) => m.CatalogDocsItem,
          ),
      },
      {
        path: "audit/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-audit-item/catalog-audit-item").then(
            (m) => m.CatalogAuditItem,
          ),
      },
      {
        path: "guide/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item").then(
            (m) => m.CatalogGuiaItem,
          ),
      },
      {
        path: "extras/:item",
        loadComponent: () =>
          import("src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-web-extras").then(
            (m) => m.CatalogWebExtras,
          ),
      },
    ],
  },
  {
    path: "depuration",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/herramientas-dev/update-data-base/update-data-base").then(
        (m) => m.UpdateDataBase,
      ),
    canActivate: [authGuard],
    data: {
      title: "Depuración",
      breadcrumb: "Depuración",
    },
  },
  {
    path: "testsignalr",
    loadComponent: () =>
      import("src/app/apps/admin.luxuryapp/herramientas-dev/testsignalr/testsignalr").then(
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
      import("src/app/apps/admin.luxuryapp/herramientas-dev/send-email/test-email").then(
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
      import("src/app/apps/system.luxuryapp/configuracion-sistema/eleven-labs/eleven-labs-settings").then(
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
      import("src/app/apps/admin.luxuryapp/herramientas-dev/ia-test/ia-test.component").then(
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
      import("src/app/apps/admin.luxuryapp/herramientas-dev/cotizador/cotizador.component").then(
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
      import("src/app/apps/admin.luxuryapp/access-control/access-point-list").then(
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
      import("src/app/apps/admin.luxuryapp/access-control/visitor-list").then(
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
      import("src/app/apps/admin.luxuryapp/access-control/access-dashboard").then(
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
      import("src/app/apps/admin.luxuryapp/access-control/access-events").then(
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
      import("src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer").then(
        (m) => m.ConventionsViewer,
      ),
    canActivate: [authGuard],
    data: {
      title: "CONVENTIONS.md - Guía Interactiva",
      breadcrumb: "Conventions Guide",
    },
  },
];

import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const settingsRoutes: Routes = [
  // Rutas principales de configuración
  {
    path: "home",
    loadComponent: () =>
      import("src/app/features/configuration/settings-menu/settings-home").then(
        (m) => m.SettingsHome,
      ),
    canActivate: [authGuard],
    data: {
      title: "Configuración de sistema",
      breadcrumb: "Configuración de sistema",
    },
  },

  {
    path: "demo-app",
    loadComponent: () =>
      import("src/app/features/configuration/demo-app/demo-app").then(
        (m) => m.DemoApp,
      ),
    canActivate: [authGuard],
    data: {
      title: "Demo institucional UI",
      breadcrumb: "Demo institucional UI",
    },
  },

  // Rutas de gestión de usuarios y permisos
  {
    path: "application-user",
    loadComponent: () =>
      import("src/app/features/configuration/application-user/pages/application-user-list").then(
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
      import("src/app/features/configuration/customer/pages/customer-list").then(
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
      import("src/app/features/configuration/customer-modul/pages/customer-modul-list").then(
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
      import("src/app/features/configuration/customer-modul/pages/customer-modul-edit").then(
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
      import("src/app/features/configuration/application-role/pages/roles-list").then(
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
      import("src/app/features/configuration/module-app-rol/pages/module-app-rol-list").then(
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
      import("src/app/features/configuration/module-app/pages/module-app-list").then(
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
      import("src/app/features/configuration/module-app-rol/pages/module-app-rol-update").then(
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
      import("src/app/features/configuration/approval-rules/pages/approval-rules").then(
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
      import("src/app/features/configuration/customer-data-company/customer-data-company-list").then(
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
      import("src/app/features/configuration/email-data/email-data-list").then(
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
      import("src/app/features/configuration/test/update-data-base/update-data-base").then(
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
      import("src/app/features/configuration/banks/pages/bank-list").then(
        (m) => m.BankList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Listado de bancos",
      breadcrumb: "Listado de bancos",
    },
  },
  {
    path: "asamblea-checklist-catalog",
    loadComponent: () =>
      import("src/app/features/configuration/banks/pages/asamblea-checklist-template-list").then(
        (m) => m.AsambleaChecklistTemplateList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de checklist de asamblea",
      breadcrumb: "Catalogo checklist asamblea",
    },
  },
  {
    // Suggested path: 'payment-method'
    path: "forma-pago",
    loadComponent: () =>
      import("src/app/features/configuration/payment-method/pages/payment-method-list").then(
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
      import("src/app/features/configuration/payment-type/payment-type-list").then(
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
      import("src/app/features/configuration/cfdi-use/pages/cfdi-use-list").then(
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
      import("src/app/features/configuration/jobs/pages/jobs-dashboard").then(
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
      import("src/app/features/configuration/app-implementation-tracking/app-implementation-tracking-manual").then(
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
      import("src/app/features/configuration/meter-category/meter-category-list").then(
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
      import("src/app/features/configuration/product-category/product-category-list").then(
        (m) => m.ProductCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Categorías de Productos",
      breadcrumb: "Lista de Categorías de Productos",
    },
  },
  // {
  //   path: "request-types-list",
  //   loadComponent: () =>
  //     import("src/app/features/configuration/approval-rules/pages/approval-rules").then(
  //       (m) => m.ApprovalRules,
  //     ),
  //   canActivate: [authGuard],
  //   data: {
  //     title: "Aprovacion de permisos y vacaciones",
  //     breadcrumb: "Aprovacion de permisos y vacaciones",
  //   },
  // },
  {
    // Suggested path: 'machinery-classification'
    path: "machinery-classification",
    loadComponent: () =>
      import("src/app/features/configuration/machinery-classification/machinery-classification-list").then(
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
      import("src/app/features/configuration/units-of-measurement/unit-of-measurement-list").then(
        (m) => m.UnitOfMeasurementList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Unidades de Medida",
      breadcrumb: "Lista de Unidades de Medida",
    },
  },
  {
    path: "ticket-group-category",
    loadComponent: () =>
      import("src/app/features/tasks/work-group-categories/pages/task-group-category-list").then(
        (m) => m.TaskGroupCategoryList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Categoría de Grupos de Tickets",
      breadcrumb: "Categoría de Grupos de Tickets",
    },
  },
  {
    path: "user-activity-history",
    loadComponent: () =>
      import("src/app/features/configuration/user-activity-history/user-activity-history").then(
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
      import("src/app/features/configuration/log-api-report/log-api-report").then(
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
      import("src/app/features/configuration/brevo/brevo-email-logs").then(
        (m) => m.BrevoEmailLogs,
      ),
    canActivate: [authGuard],
    data: {
      title: "Logs de Brevo",
      breadcrumb: "Logs de Brevo",
    },
  },

  // RUTAS QUE DEBEN REUBICARSE (no pertenecen a configuración)
  // TODO: Mover a módulo de inventarios
  {
    // Suggested path: 'product-inventory'
    path: "inventario-productos",
    loadComponent: () =>
      import("src/app/features/stock-por-almacen/warehouse-stock-list").then(
        (m) => m.WarehouseStockList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Inventario Insumos",
      breadcrumb: "Inventario Insumos",
    },
  },
  {
    // Suggested path: 'extinguishers'
    path: "extintores",
    loadComponent: () =>
      import("src/app/features/fire-extinguisher-inventory/inventario-extintor").then(
        (m) => m.InventarioExtintor,
      ),
    canActivate: [authGuard],
    data: {
      title: "Extintores",
      breadcrumb: "Extintores",
    },
  },
  {
    // Suggested path: 'extinguishers-group'
    path: "extintores-group",
    loadComponent: () =>
      import("src/app/features/fire-extinguisher-inventory/inventario-extintor-group").then(
        (m) => m.InventarioExtintorGroup,
      ),
    canActivate: [authGuard],
    data: {
      title: "Grupo de Extintores",
      breadcrumb: "Grupo de Extintores",
    },
  },

  // TODO: Mover a módulo de bitácoras
  {
    path: "catalog-asset",
    loadComponent: () =>
      import("src/app/features/inspection/catalogo/catalogo-activo-lista").then(
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
      import("src/app/features/inspection/catalogo/catalogo-revisiones-inspeccion").then(
        (m) => m.CatalogoRevisionesInspeccion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catalogo de inspecciones",
      breadcrumb: "Catalogo de inspecciones",
    },
  },

  // TODO: Mover a módulo de biblioteca
  {
    // Suggested path: 'client-delivery-reception'
    path: "entrega-recepcion-cliente",
    loadComponent: () =>
      import("src/app/features/delivery-reception-catalog/catalogo-descripcion-list").then(
        (m) => m.CatalogoDescripcionList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Entrega y Recepción",
      breadcrumb: "Entrega y Recepción",
    },
  },

  {
    path: "testsignalr",
    loadComponent: () =>
      import("src/app/features/configuration/test/testsignalr/testsignalr").then(
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
      import("src/app/features/send-email/text-email").then((m) => m.TextEmail),
    canActivate: [authGuard],
    data: {
      title: "Iconos SVG",
      breadcrumb: "Iconos SVG",
    },
  },
  {
    path: "mini-postman",
    loadComponent: () =>
      import("src/app/features/configuration/mini-postman/mini-postman").then(
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
      import("src/app/features/configuration/catalog-component-ui/catalog-component-ui").then(
        (m) => m.CatalogComponentUi,
      ),
    canActivate: [authGuard],
    data: {
      title: "Design System & Guía Documental",
      breadcrumb: "Guía de Estilos",
    },
  },
  {
    path: "ai-knowledge-base",
    loadComponent: () =>
      import("src/app/features/configuration/ai-knowledge-base/ai-knowledge-base-list").then(
        (m) => m.AiKnowledgeBaseList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Base de Conocimiento IA",
      breadcrumb: "🧠 Base de Conocimiento IA",
    },
  },
  {
    path: "aspel-customer-empresa",
    loadComponent: () =>
      import("src/app/features/configuration/aspel-customer-empresa/aspel-customer-empresa-list").then(
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
      import("src/app/features/configuration/aspel-sync/aspel-sync").then(
        (m) => m.AspelSyncComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "Sincronización Aspel",
      breadcrumb: "Sincronización Aspel",
    },
  },

  // Catálogos de Recursos Humanos
  {
    path: "juntas-mensuales-conciliacion",
    loadComponent: () =>
      import("src/app/features/configuration/juntas-mensuales-backfill/juntas-mensuales-backfill").then(
        (m) => m.JuntasMensualesBackfill,
      ),
    canActivate: [authGuard],
    data: {
      title: "Conciliacion de juntas mensuales",
      breadcrumb: "Conciliacion de juntas mensuales",
    },
  },
  {
    path: "incident-types",
    loadComponent: () =>
      import("src/app/features/configuration/hr-catalog/pages/incident-type-list").then(
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
      import("src/app/features/configuration/hr-catalog/pages/sanction-type-list").then(
        (m) => m.SanctionTypeList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Tipos de Sanción",
      breadcrumb: "Tipos de Sanción",
    },
  },
  {
    path: "eleven-labs",
    loadComponent: () =>
      import("src/app/features/configuration/eleven-labs/eleven-labs-settings").then(
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
      import("src/app/features/configuration/ia-test/ia-test.component").then(
        (m) => m.default,
      ),
    canActivate: [authGuard],
    data: {
      title: "Prueba de Inteligencia Artificial",
      breadcrumb: "Prueba de IA",
    },
  },
];

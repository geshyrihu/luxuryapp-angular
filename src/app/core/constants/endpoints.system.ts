/**
 * Endpoints del Módulo 1: System (Núcleo e Infraestructura)
 * Configuración global, catálogos maestros y gestión de plataforma.
 */
export const EndpointsSystem = {

  // ==========================================================================
  // Sub-módulo: Access (Identidad y Acceso)
  // ==========================================================================

  AccesoCustomers: {
    addToUser: (applicationUserId: string) =>
      `AccesoCustomers/AddCustomerAccesoToUser/${applicationUserId}`,
    getByUser: (applicationUserId: string) =>
      `AccesoCustomers/GetCustomers/${applicationUserId}`,
  },
  ApplicationRoles: {
    create: "application-roles",
    delete: (id: string) => `application-roles/${id}`,
    getAll: "application-roles",
    getById: (id: string) => `application-roles/${id}`,
    getPdf: (id: string) => `application-roles/${id}/pdf`,
    update: (id: string) => `application-roles/${id}`,
  },
  ApplicationUsers: {
    addRoleToUser: (id: string) => `application-users/AddRoleToUser/${id}`,
    cardUser: (id: string) => `application-users/CardUser/${id}`,
    createAccount: "application-users/CreateAccount",
    delete: (id: string) => `application-users/Delete/${id}`,
    getAll: (state: boolean, typePerson: any) =>
      `application-users/List/${state}/${typePerson}`,
    getById: (id: string) => `application-users/${id}`,
    getRoleUrl: (id: string, roleType: number | null) =>
      roleType !== null
        ? `application-users/GetRole/${id}/${roleType}`
        : `application-users/GetRole/${id}`,
    searchExistingPerson: (fullName: string) =>
      `application-users/SearchExistingPerson/${fullName}`,
    searchExistingPhone: (phone: string) =>
      `application-users/SearchExistingPhone/${phone}`,
    sendNewUserNameForEmail: (id: string) =>
      `application-users/SendNewUserNameForEmail/${id}`,
    toBlockAccount: (id: string) => `application-users/ToBlockAccount/${id}`,
    toUnlockAccount: (id: string) => `application-users/ToUnlockAccount/${id}`,
    updateAccount: (id: string) => `application-users/UpdateAccount/${id}`,
  },
  Auth: {
    sendNewPasswordForEmail: (id: string) => `Auth/SendNewPasswordForEmail/${id}`,
  },
  ModuleAppRoles: {
    assignments: (roleId: string) => `module-app-roles/Assignments/${roleId}`,
    listModule: "module-app-roles/ListModule",
    listRole: "module-app-roles/ListRole",
    updateAssigned: "module-app-roles/UpdateModuleAppRolAssigned",
  },
  PasswordManager: {
    Credentials: {
      getPaged: "password-manager/credentials/filter",
      getById: (id: string) => `password-manager/credentials/${id}`,
      create: "password-manager/credentials",
      update: (id: string) => `password-manager/credentials/${id}`,
      delete: (id: string) => `password-manager/credentials/${id}`,
    },
  },

  // ==========================================================================
  // Sub-módulo: GestindeCliente (Gestión de Condominios y Clientes)
  // ==========================================================================

  Customers: {
    create: "customers",
    delete: (id: string) => `customers/${id}`,
    getAll: (state: boolean) => `customers/list/${state}`,
    getById: (id: string) => `customers/${id}`,
    getByIdLegacy: (id: string) => `Customers/${id}`,
    getPdf: (id: string) => `customers/${id}/pdf`,
    update: (id: string) => `customers/${id}`,
  },
  CustomerAddresses: {
    getByCustomerId: (customerId: string) => `customer-addresses/${customerId}`,
    update: "customer-addresses",
  },
  CustomerDataCompany: {
    base: "customer-data-company",
    delete: (id: string) => `customer-data-company/${id}`,
    getAll: "customer-data-company",
    getById: (id: string) => `customer-data-company/${id}`,
  },
  CustomerImages: {
    create: "customer-images",
    createBulk: "customer-images/bulk",
    delete: (id: string) => `customer-images/${id}`,
    getByCustomerId: (customerId: string) => `customer-images/${customerId}`,
  },
  ModuleAppCustomers: {
    activeModules: (customerId: string) =>
      `module-app-customers/Customer/${customerId}/ActiveModules`,
    customerModules: (customerId: string) =>
      `module-app-customers/Customer/${customerId}`,
    customers: (state: boolean) => `module-app-customers/Customers/${state}`,
    delete: (id: string) => `module-app-customers/${id}`,
    permissions: (customerId: string) =>
      `module-app-customers/${customerId}/Permissions`,
    updateModuleStatus: "module-app-customers/UpdateModuleStatus",
  },
  ModuleApps: {
    create: "module-apps",
    delete: (id: string) => `module-apps/${id}`,
    getAll: "module-apps",
    getById: (id: string) => `module-apps/${id}`,
    getPdf: (id: string) => `module-apps/${id}/pdf`,
    update: (id: string) => `module-apps/${id}`,
  },

  // ==========================================================================
  // Sub-módulo: Catalogs (Catálogos Maestros y SAT)
  // ==========================================================================

  Banks: {
    create: "Banks",
    delete: (id: string) => `banks/${id}`,
    getAll: "banks",
    getById: (id: string) => `banks/${id}`,
    getPdf: (id: string) => `banks/${id}/pdf`,
    selectItems: "select-items/banks",
    update: (id: string) => `Banks/${id}`,
  },
  CfdiUses: {
    create: "cfdi-use",
    delete: (id: string) => `cfdi-use/${id}`,
    getAll: "cfdi-use",
    getById: (id: string) => `cfdi-use/${id}`,
    getPdf: (id: string) => `cfdi-use/${id}/pdf`,
    update: (id: string) => `cfdi-use/${id}`,
  },
  EmergencyPhones: {
    create: "TelefonosEmergencia",
    delete: (id: string) => `telefonosemergencia/${id}`,
    getAll: "TelefonosEmergencia",
    getById: (id: string | number) => `TelefonosEmergencia/${id}`,
    update: (id: string | number) => `TelefonosEmergencia/${id}`,
  },
  PaymentMethods: {
    create: "payment-methods",
    delete: (id: string) => `payment-methods/${id}`,
    getAll: "payment-methods",
    getById: (id: string) => `payment-methods/${id}`,
    getPdf: (id: string) => `payment-methods/${id}/pdf`,
    update: (id: string) => `payment-methods/${id}`,
  },
  PaymentTypes: {
    create: "MetodoPago",
    delete: (id: string) => `MetodoPago/${id}`,
    getAll: "MetodoPago",
    getById: (id: string | number) => `MetodoPago/${id}`,
    update: (id: string | number) => `MetodoPago/${id}`,
  },
  UnitsOfMeasurement: {
    create: "UnidadMedida",
    delete: (id: string) => `unidadmedida/${id}`,
    getAll: "UnidadMedida",
    getById: (id: string | number) => `UnidadMedida/${id}`,
    update: (id: string | number) => `UnidadMedida/${id}`,
  },

  // ==========================================================================
  // Sub-módulo: System-AI (Inteligencia Artificial)
  // ==========================================================================

  AiKnowledgeBase: {
    base: "AiKnowledgeBase",
    delete: (id: string) => `AiKnowledgeBase/${id}`,
    getById: (id: string) => `AiKnowledgeBase/${id}`,
    modules: "AiKnowledgeBase/modules",
  },

  // ==========================================================================
  // Sub-módulo: System-AuditLogs (Bitácoras y Auditoría)
  // ==========================================================================

  UserActivityHistory: {
    base: "UserActivityHistory",
  },
  AccessHistory: {
    byCustomerAndRange: (
      customerId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) => `UserActivityHistory?customerId=${customerId}&startDate=${fechaInicial}&endDate=${fechaFinal}`,
  },
  Logs: {
    deleteAll: "Logs/all",
    getAll: "Logs",
  },
  Notifications: {
    getAll: "notifications",
    markAsRead: (notificationId: string) =>
      `Notifications/mark-as-read/${notificationId}`,
    testOneSignal: "notifications/test-one-signal",
    testOneSignalWeb: "notifications/test-one-signal-web",
    testSignalR: (userId: string) => `notifications/test-signal-r/${userId}`,
    testSignalUsers: "notifications/test-signal-users",
    unreadCount: "Notifications/unread-count",
    users: "notifications/users",
  },

  // ==========================================================================
  // Sub-módulo: Accounting (Versión de Sistema)
  // ==========================================================================

  AspelCustomerEmpresa: {
    base: "aspel-customer-empresa",
    delete: (id: string | number) => `aspel-customer-empresa/${id}`,
    getAll: "aspel-customer-empresa",
  },
  AutitoriaCuentasAspel: {
    get: (year: number, empresa: string) =>
      `autitoria-cuentas-aspel?intYear=${year}&empresa=${empresa}`,
  },
  EspejoAspelFull: {
    get: (customerId: string, year: number, empresa: string) =>
      `espejo-aspel-full?customerId=${customerId}&year=${year}&empresa=${empresa}`,
  },

  // ==========================================================================
  // Sub-módulo: Settings (Configuración Global HR)
  // ==========================================================================

  Settings: {
    createIncidentType: "hr/incident-types",
    createSanctionType: "hr/sanction-types",
    deleteIncidentType: (id: string) => `hr/incident-types/${id}`,
    deleteSanctionType: (id: string) => `hr/sanction-types/${id}`,
    holidaysByYear: (year: number) => `configuracion/dias-festivos/${year}`,
    incidentTypeById: (id: string) => `hr/incident-types/${id}`,
    incidentTypes: "hr/incident-types",
    sanctionTypeById: (id: string) => `hr/sanction-types/${id}`,
    sanctionTypes: "hr/sanction-types",
    toggleIncidentType: (id: string) => `hr/incident-types/${id}/toggle`,
    toggleSanctionType: (id: string) => `hr/sanction-types/${id}/toggle`,
    updateIncidentType: (id: string) => `hr/incident-types/${id}`,
    updateSanctionType: (id: string) => `hr/sanction-types/${id}`,
  },
} as const;

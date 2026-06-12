/**
 * Endpoints para el proyecto de Configuraci�n/Globales.
 */
export const EndpointsConfig = {

  AccesoCustomers: {
    addToUser: (applicationUserId: string) =>
      `AccesoCustomers/AddCustomerAccesoToUser/${applicationUserId}`,
    getByUser: (applicationUserId: string) =>
      `AccesoCustomers/GetCustomers/${applicationUserId}`,
  },
  AccessHistory: {
    byCustomerAndRange: (
      customerId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) => `UserActivityHistory?customerId=${customerId}&startDate=${fechaInicial}&endDate=${fechaFinal}`,
  },
  AiKnowledgeBase: {
    base: "AiKnowledgeBase",
    delete: (id: string) => `AiKnowledgeBase/${id}`,
    getById: (id: string) => `AiKnowledgeBase/${id}`,
    modules: "AiKnowledgeBase/modules",
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
  AppImplementationTracking: {
    triggerEmployeeValidation:
      "appimplementationtracking/trigger-employee-validation",
  },
  AspelCustomerEmpresa: {
    base: "aspel-customer-empresa",
    delete: (id: string | number) => `aspel-customer-empresa/${id}`,
    getAll: "aspel-customer-empresa",
  },
  Auth: {
    sendNewPasswordForEmail: (id: string) => `Auth/SendNewPasswordForEmail/${id}`,
  },
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
  Customers: {
    create: "customers",
    delete: (id: string) => `customers/${id}`,
    getAll: (state: boolean) => `customers/list/${state}`,
    getById: (id: string) => `customers/${id}`,
    getByIdLegacy: (id: string) => `Customers/${id}`,
    getPdf: (id: string) => `customers/${id}/pdf`,
    update: (id: string) => `customers/${id}`,
  },
  EmailData: {
    base: "EmailData",
    delete: (id: string) => `emaildata/${id}`,
    getAll: "EmailData/List",
    getById: (id: string) => `EmailData/${id}`,
    sendTestEmail: (id: string) => `SendEmail/TestEmail/${id}`,
  },
  VaultSecrets: {
    getAll: "vault-secrets/list",
    store: "vault-secrets",
    update: (secretName: string) => `vault-secrets/${secretName}`,
    rotate: (secretName: string) => `vault-secrets/${secretName}/rotate`,
    revoke: (secretName: string) => `vault-secrets/${secretName}/revoke`,
  },
  EmergencyPhones: {
    create: "TelefonosEmergencia",
    delete: (id: string) => `telefonosemergencia/${id}`,
    getAll: "TelefonosEmergencia",
    getById: (id: string | number) => `TelefonosEmergencia/${id}`,
    update: (id: string | number) => `TelefonosEmergencia/${id}`,
  },
  EnumSelectItems: {
    assetCategory: "EAssetCategory",
    brand: "EBrand",
    departament: "EDepartament",
    inventoryCategory: "EInventoryCategory",
    inventorySubCategory: "EInventorySubCategory",
    measurementUnit: "EMeasurementUnit",
    paymentMethod: "EPaymentMethod",
    priority: "EPriority",
    purchaseRequestStatus: "EPurchaseRequestStatus",
    relationEmployee: "ERelationEmployee",
    status: "EStatus",
    statusMaintenance: "EStatusMaintenance",
    typeDocument: "ETypeDocument",
    typeMaintance: "ETypeMaintance",
  },
  JuntaMensualSessionBackfill: {
    apply: "JuntaMensualSessionBackfill/apply",
    preview: "JuntaMensualSessionBackfill/preview",
  },
  Logs: {
    deleteAll: "Logs/all",
    getAll: "Logs",
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
  ModuleAppRoles: {
    assignments: (roleId: string) => `module-app-roles/Assignments/${roleId}`,
    listModule: "module-app-roles/ListModule",
    listRole: "module-app-roles/ListRole",
    updateAssigned: "module-app-roles/UpdateModuleAppRolAssigned",
  },
  ModuleApps: {
    create: "module-apps",
    delete: (id: string) => `module-apps/${id}`,
    getAll: "module-apps",
    getById: (id: string) => `module-apps/${id}`,
    getPdf: (id: string) => `module-apps/${id}/pdf`,
    update: (id: string) => `module-apps/${id}`,
  },
  PeriodoPresupuestals: {
    base: "PeriodoPresupuestals",
    getById: (id: string | number) => `PeriodoPresupuestals/${id}`,
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
  Providers: {
    delete: (id: string) => `providers/${id}`,
    getByIdAndCustomer: (id: string | number, customerId: string) =>
      `providers/${id}/${customerId}`,
  },
  SelectItems: {
    accountingCatalogsByCustomerAndYear: (customerId: string, year: number) =>
      `AccountingCatalogs/${customerId}?fiscalYear=${year}`,
    applicationRolesToAdministrator: "application-roles-to-administrator",
    applicationRolesToProvider: "application-roles-to-provider",
    applicationUser: "application-users",
    applicationUsersByCustomer: (customerId: string) =>
      `application-users/${customerId}`,
    bank: "bank",
    customersActive: "customers-active",
    customersActiveNameShort: "CustomersActiveNameShort",
    employeesByCustomer: (customerId: string) => `employee/${customerId}`,
    employeesByUserId: (userId: string) => `employee-by-user-id/${userId}`,
    machineryActiveByCustomer: (customerId: string) =>
      `machineries-active/${customerId}`,
    measurementUnits: "getMeasurementUnits",
    paymentMethod: "PaymentMethod",
    periodoPresupuestals: (customerId: string) =>
      `PeriodoPresupuestals/${customerId}`,
    properties: (customerId: string) => `select-items/properties/${customerId}`,
    propertyMembersByCustomer: (customerId: string) =>
      `property-members/${customerId}`,
    providers: (customerId: string) => `providers/${customerId}`,
    richProducts: (term: string) => `get-rich-products?term=${term}`,
    rolesForAnnouncements: "roles-for-announcements",
    toolsByCustomer: (customerId: string) => `tool/${customerId}`,
    useCFDI: "UseCFDI",
    usersByCustomer: (customerId: string) => `UserFromCustomer/${customerId}`,
    wayToPay: "WayToPay",
  },
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
  UnitsOfMeasurement: {
    create: "UnidadMedida",
    delete: (id: string) => `unidadmedida/${id}`,
    getAll: "UnidadMedida",
    getById: (id: string | number) => `UnidadMedida/${id}`,
    update: (id: string | number) => `UnidadMedida/${id}`,
  },
  UpdateDataBase: {
    backfillAgendaEvents:
      "UpdateDataBase/backfill-agenda-events-from-meetings",
    backfillHistoricalMeetings:
      "UpdateDataBase/backfill-historical-meeting-times",
    importAsambleaChecklist:
      "UpdateDataBase/import-asamblea-checklist-catalog",
    resyncGoogleCalendar: "UpdateDataBase/resync-google-calendar-event-times",
  },
  UserActivityHistory: {
    base: "UserActivityHistory",
  },
} as const;

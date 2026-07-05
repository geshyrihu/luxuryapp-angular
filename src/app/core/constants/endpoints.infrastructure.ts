/**
 * Endpoints de Infraestructura y Utilidades Técnicas
 * Servicios transversales, herramientas de sistema y soporte técnico.
 */
export const EndpointsInfrastructure = {

  // ==========================================================================
  // Seguimiento de Implementación y Monitoreo
  // ==========================================================================

  AppImplementationTracking: {
    triggerEmployeeValidation:
      "appimplementationtracking/trigger-employee-validation",
  },
  JuntaMensualSessionBackfill: {
    apply: "JuntaMensualSessionBackfill/apply",
    preview: "JuntaMensualSessionBackfill/preview",
  },

  // ==========================================================================
  // Servicios de Comunicación y Datos
  // ==========================================================================

  EmailData: {
    base: "EmailData",
    delete: (id: string) => `emaildata/${id}`,
    getAll: "EmailData/List",
    getById: (id: string) => `EmailData/${id}`,
    sendTestEmail: (id: string) => `SendEmail/TestEmail/${id}`,
  },
  SendEmail: {
    meeting: (meetingId: string | number) => `sendemail/meeting/${meetingId}`,
    operationReport: (
      applicationUserId: string,
      customerId: string,
      year: number,
      weekNumber: number,
    ) =>
      `sendemail/operation-report/${applicationUserId}/${customerId}/${year}/${weekNumber}`,
    presentacionFinalComite: (idJunta: string | number) =>
      `SendEmail/PresentacionFinalComite/${idJunta}`,
  },

  // ==========================================================================
  // Seguridad y Gestión de Secretos (Vault)
  // ==========================================================================

  VaultSecrets: {
    getAll: "vault-secrets/list",
    store: "vault-secrets",
    update: (secretName: string) => `vault-secrets/${secretName}`,
    rotate: (secretName: string) => `vault-secrets/${secretName}/rotate`,
    revoke: (secretName: string) => `vault-secrets/${secretName}/revoke`,
  },

  // ==========================================================================
  // Mantenimiento de Base de Datos y Sistema
  // ==========================================================================

  UpdateDataBase: {
    backfillAgendaEvents:
      "UpdateDataBase/backfill-agenda-events-from-meetings",
    backfillHistoricalMeetings:
      "UpdateDataBase/backfill-historical-meeting-times",
    importAsambleaChecklist:
      "UpdateDataBase/import-asamblea-checklist-catalog",
    resyncGoogleCalendar: "UpdateDataBase/resync-google-calendar-event-times",
    seedNativeCollectionTestData: "UpdateDataBase/seed-native-collection-test-data",
  },

  // ==========================================================================
  // Selectores y Enumeradores Globales
  // ==========================================================================

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

  // ==========================================================================
  // Otros Servicios Técnicos
  // ==========================================================================

  MenuItems: {
    byCustomer: (customerId: string) => `menu-items/${customerId}`,
  },
  Permission: {
    update: (id: string | number) => `Permission/${id}`,
  },
} as const;

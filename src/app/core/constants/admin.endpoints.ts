export const EndpointsAdmin = {
  AccessControlOperations: {
    events: "access-controls/events",
    eventsExport: "access-controls/events/export",
    occupancy: "access-controls/dashboard/occupancy",
    stats: "access-controls/dashboard/stats",
  },
  Customers: {
    create: "customers",
    delete: (id: string) => `customers/${id}`,
    getAll: (state: boolean) => `customers/list/${state}`,
    getById: (id: string) => `customers/${id}`,
    getByIdLegacy: (id: string) => `customers/${id}`,
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
      `module-app-customers/customer/${customerId}/active-modules`,
    customerModules: (customerId: string) =>
      `module-app-customers/customer/${customerId}`,
    customers: (state: boolean) => `module-app-customers/customers/${state}`,
    delete: (id: string) => `module-app-customers/${id}`,
    permissions: (customerId: string) =>
      `module-app-customers/${customerId}/permissions`,
    updateModuleStatus: "module-app-customers/update-module-status",
  },
  ModuleApps: {
    create: "module-apps",
    delete: (id: string) => `module-apps/${id}`,
    getAll: "module-apps",
    getById: (id: string) => `module-apps/${id}`,
    getPdf: (id: string) => `module-apps/${id}/pdf`,
    update: (id: string) => `module-apps/${id}`,
  },

  AppImplementationTracking: {
    triggerEmployeeValidation:
      "app-implementation-tracking/trigger-employee-validation",
  },
  JuntaMensualSessionBackfill: {
    apply: "junta-mensual-session-backfill/apply",
    preview: "junta-mensual-session-backfill/preview",
  },
  UpdateDataBase: {
    backfillAgendaEvents: "update-data-base/backfill-agenda-events-from-meetings",
    backfillHistoricalMeetings:
      "update-data-base/backfill-historical-meeting-times",
    importAsambleaChecklist: "update-data-base/import-asamblea-checklist-catalog",
    resyncGoogleCalendar: "update-data-base/resync-google-calendar-event-times",
    seedNativeCollectionTestData:
      "update-data-base/seed-native-collection-test-data",
  },
  CustomerProvider: {
    getById: (id: string) => `customer-provider/get-by-id/${id}`,
  },
  VaultSecrets: {
    getAll: "vault-secrets/list",
    store: "vault-secrets",
    update: (secretName: string) => `vault-secrets/${secretName}`,
    rotate: (secretName: string) => `vault-secrets/${secretName}/rotate`,
    revoke: (secretName: string) => `vault-secrets/${secretName}/revoke`,
  },
  RefactorAdmin: {
    customerproviderById: (id: any) => `customer-provider/${id}`,
    permissionPermissionUserAdminById: (applicationUserId: any) =>
      `permission/permission-user-admin/${applicationUserId}`,
    sendEmailTestEmailById: (emailControl: any) =>
      `send-email/test-email/${emailControl}`,
    customerProviderById: (customerIdS: any) =>
      `customer-provider/${customerIdS}`,
  },
} as const;

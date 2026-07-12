export const EndpointsAdmin = {
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

  AppImplementationTracking: {
    triggerEmployeeValidation:
      "appimplementationtracking/trigger-employee-validation",
  },
  JuntaMensualSessionBackfill: {
    apply: "JuntaMensualSessionBackfill/apply",
    preview: "JuntaMensualSessionBackfill/preview",
  },
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
  CustomerProvider: {
    getById: (id: string) => `customerprovider/getById/${id}`,
  },
  VaultSecrets: {
    getAll: "vault-secrets/list",
    store: "vault-secrets",
    update: (secretName: string) => `vault-secrets/${secretName}`,
    rotate: (secretName: string) => `vault-secrets/${secretName}/rotate`,
    revoke: (secretName: string) => `vault-secrets/${secretName}/revoke`,
  },
} as const;

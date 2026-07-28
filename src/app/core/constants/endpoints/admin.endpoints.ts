export const EndpointsAdmin = {
  UserAccounts: {
    addRoleToUser: (id: string, allowedRoleType?: number | null) =>
      allowedRoleType !== null && allowedRoleType !== undefined
        ? `admin/user-accounts/add-role-to-user/${id}?allowedRoleType=${allowedRoleType}`
        : `admin/user-accounts/add-role-to-user/${id}`,
    createAccount: "admin/user-accounts/create-account",
    delete: (id: string) => `admin/user-accounts/delete/${id}`,
    deleteAccountAndRelations: (id: string) =>
      `admin/user-accounts/delete/${id}`,
    getAll: (state: boolean, typePerson: any) =>
      `admin/user-accounts/list/${state}/${typePerson}`,
    getById: (id: string) => `admin/user-accounts/${id}`,
    getRoleUrl: (id: string, roleType: number | null) =>
      roleType !== null
        ? `admin/user-accounts/get-role/${id}/${roleType}`
        : `admin/user-accounts/get-role/${id}`,
    sendNewUserNameForEmail: (id: string) =>
      `auth/account-recovery/send-new-user-name-for-email/${id}`,
    toBlockAccount: (id: string) => `admin/user-accounts/to-block-account/${id}`,
    toUnlockAccount: (id: string) =>
      `admin/user-accounts/to-unlock-account/${id}`,
    updateAccount: (id: string) => `admin/user-accounts/update-account/${id}`,
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
  CustomerLocations: {
    listByCustomer: (customerId: string) => `customer-locations/customer/${customerId}`,
    getById: (id: string) => `customer-locations/${id}`,
    create: "customer-locations",
    update: (id: string) => `customer-locations/${id}`,
    delete: (id: string) => `customer-locations/${id}`,
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
  JuntaMensualSessionBackfill: {
    apply: "junta-mensual-session-backfill/apply",
    preview: "junta-mensual-session-backfill/preview",
  },
  AsambleaChecklistTemplate: {
    create: "asamblea-checklist-template",
    delete: (id: string) => `asamblea-checklist-template/${id}`,
    getAll: "asamblea-checklist-template",
    getById: (id: string) => `asamblea-checklist-template/${id}`,
    update: (id: string) => `asamblea-checklist-template/${id}`,
  },
  UpdateDataBase: {
    backfillAgendaEvents:
      "admin/system-maintenance/backfill-agenda-events-from-meetings",
    backfillHistoricalMeetings:
      "admin/system-maintenance/backfill-historical-meeting-times",
    capitalizeUserNames:
      "admin/system-maintenance/capitalize-user-names",
    importAsambleaChecklist:
      "admin/system-maintenance/import-asamblea-checklist-catalog",
    reseedNativeChargeTypeCatalogs:
      "admin/system-maintenance/reseed-native-charge-type-catalogs",
    resyncGoogleCalendar:
      "admin/system-maintenance/resync-google-calendar-event-times",
    seedNativeCollectionTestData:
      "admin/system-maintenance/seed-native-collection-test-data",
  },
  AppImplementationTracking: {
    triggerEmployeeValidation:
      "app-implementation-tracking/trigger-employee-validation",
  },
  RealtimeDiagnostics: {
    testConnection: "admin/realtime-diagnostics/test-connection",
    sendTestMessage: "admin/realtime-diagnostics/sendtestmessage",
    sendToGroup: (groupName: string) =>
      `admin/realtime-diagnostics/send-to-group/${groupName}`,
    broadcast: "admin/realtime-diagnostics/broadcast",
    sendMessage: "admin/realtime-diagnostics/sendmessage",
    sendMessageToUser: "admin/realtime-diagnostics/sendmessagetouser",
    sendAnnouncement: "admin/realtime-diagnostics/sendannouncement",
  },
  NotificationDiagnostics: {
    testOneSignal: "admin/notification-diagnostics/test-one-signal",
    testOneSignalWeb: "admin/notification-diagnostics/test-one-signal-web",
    testSignalR: (userId: string) =>
      `admin/notification-diagnostics/test-signal-r/${userId}`,
    testSignalUsers: "admin/notification-diagnostics/test-signal-users",
    connectedUsers: "admin/notification-diagnostics/connected-users",
    connectedUsersWeb: "admin/notification-diagnostics/connected-users-web",
    users: "admin/notification-diagnostics/users",
  },
  CustomerProvider: {
    create: "customer-provider",
    delete: (id: string) => `customer-provider/${id}`,
    getById: (id: string) => `customer-provider/get-by-id/${id}`,
    listByCustomer: (customerId: string) => `customer-provider/${customerId}`,
    update: (id: string) => `customer-provider/${id}`,
  },
  Catalogs: {
    Banks: {
      create: "admin/catalogs/banks",
      delete: (id: string) => `admin/catalogs/banks/${id}`,
      getAll: "admin/catalogs/banks",
      getById: (id: string) => `admin/catalogs/banks/${id}`,
      getPdf: (id: string) => `admin/catalogs/banks/${id}/pdf`,
      selectItems: "admin/catalogs/select-items/banks",
      update: (id: string) => `admin/catalogs/banks/${id}`,
    },
    CfdiUses: {
      create: "cfdi-use",
      delete: (id: string) => `cfdi-use/${id}`,
      getAll: "cfdi-use",
      getById: (id: string) => `cfdi-use/${id}`,
      getPdf: (id: string) => `cfdi-use/${id}/pdf`,
      update: (id: string) => `cfdi-use/${id}`,
    },
    EmailData: {
      base: "email-data",
      getAll: "email-data/list",
      getById: (id: string) => `email-data/${id}`,
      sendTestEmail: (id: string) => `send-email/test-email/${id}`,
      update: (id: string) => `email-data/${id}`,
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
      create: "metodo-pago",
      delete: (id: string) => `metodo-pago/${id}`,
      getAll: "metodo-pago",
      getById: (id: string | number) => `metodo-pago/${id}`,
      update: (id: string | number) => `metodo-pago/${id}`,
    },
    UnitsOfMeasurement: {
      create: "unidad-medida",
      delete: (id: string) => `unidad-medida/${id}`,
      getAll: "unidad-medida",
      getById: (id: string | number) => `unidad-medida/${id}`,
      update: (id: string | number) => `unidad-medida/${id}`,
    },
  },
  Permission: {
    userAdminByApplicationUser: (applicationUserId: string) =>
      `permission/permission-user-admin/${applicationUserId}`,
  },
  VaultSecrets: {
    getAll: "vault-secrets/list",
    store: "vault-secrets",
    update: (secretName: string) => `vault-secrets/${secretName}`,
    rotate: (secretName: string) => `vault-secrets/${secretName}/rotate`,
    revoke: (secretName: string) => `vault-secrets/${secretName}/revoke`,
  },
} as const;

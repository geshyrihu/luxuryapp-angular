export const EndpointsShared = {
  Banks: {
    create: "banks",
    delete: (id: string) => `banks/${id}`,
    getAll: "banks",
    getById: (id: string) => `banks/${id}`,
    getPdf: (id: string) => `banks/${id}/pdf`,
    selectItems: "select-items/banks",
    update: (id: string) => `banks/${id}`,
  },
  CfdiUses: {
    create: "cfdi-use",
    delete: (id: string) => `cfdi-use/${id}`,
    getAll: "cfdi-use",
    getById: (id: string) => `cfdi-use/${id}`,
    getPdf: (id: string) => `cfdi-use/${id}/pdf`,
    update: (id: string) => `cfdi-use/${id}`,
  },
  EnumSelectItems: {
    assetCategory: "e-asset-category",
    brand: "ebrand",
    departament: "e-departament",
    inventoryCategory: "e-inventory-category",
    inventorySubCategory: "einventory-sub-category",
    measurementUnit: "emeasurement-unit",
    paymentMethod: "epayment-method",
    priority: "epriority",
    purchaseRequestStatus: "e-purchase-request-status",
    relationEmployee: "e-relation-employee",
    status: "e-status",
    statusMaintenance: "estatus-maintenance",
    typeDocument: "etype-document",
    typeMaintance: "e-type-maintance",
    selectItemEnum: (nameEnum: string, defaultOption?: string) =>
      `select-item-enum/${nameEnum}${defaultOption ? '/' + defaultOption : ''}`,
  },
  SelectItems: {
    accountingCatalogsByCustomerAndYear: (customerId: string, year: number) =>
      `accounting-catalogs/${customerId}?fiscal-year=${year}`,
    applicationRolesToAdministrator: "application-roles-to-administrator",
    applicationRolesToProvider: "application-roles-to-provider",
    applicationUser: "application-users",
    applicationUsersByCustomer: (customerId: string) =>
      `application-users/${customerId}`,
    bank: "bank",
    customersActive: "customers-active",
    customersActiveNameShort: "customers-active-name-short",
    employeesByCustomer: (customerId: string) => `employee/${customerId}`,
    employeesByUserId: (userId: string) => `employee-by-user-id/${userId}`,
    machineryActiveByCustomer: (customerId: string) =>
      `machineries-active/${customerId}`,
    measurementUnits: "get-measurement-units",
    paymentMethod: "payment-method",
    periodoPresupuestals: (customerId: string) =>
      `periodo-presupuestals/${customerId}`,
    properties: (customerId: string) => `select-items/properties/${customerId}`,
    propertyMembersByCustomer: (customerId: string) =>
      `property-members/${customerId}`,
    providers: (customerId: string) => `providers/${customerId}`,
    richProducts: (term: string) => `get-rich-products?term=${term}`,
    rolesForAnnouncements: "roles-for-announcements",
    toolsByCustomer: (customerId: string) => `tool/${customerId}`,
    useCFDI: "use-cfdi",
    usersByCustomer: (customerId: string) => `user-from-customer/${customerId}`,
    wayToPay: "way-to-pay",
  },

  CustomDocuments: {
    create: "custom-documents",
    delete: (id: string) => `custom-documents/${id}`,
    getById: (id: string) => `custom-documents/${id}`,
    list: (customerId: string, documentType: number) =>
      `custom-documents/list/${customerId}/${documentType}`,
    update: (id: string) => `custom-documents/${id}`,
    updateOrder: "custom-documents/update-order",
  },
  Products: {
    autoComplete: "productos/getautocompleteselectitem/",
    delete: (id: string) => `productos/${id}`,
    getAll: "productos",
    getAllPaged: "productos/paged",
    getById: (id: string) => `productos/${id}`,
  },
  ProductCategories: {
    base: "categories",
    create: "categories",
    delete: (id: string | number) => `categories/${id}`,
    getAll: "categories",
    getById: (id: string | number) => `categories/${id}`,
    update: (id: string | number) => `categories/${id}`,
  },
  PolicyContracts: {
    create: "policy-contract",
    delete: (id: string | number) => `policy-contract/${id}`,
    deleteDocument: (id: string | number) =>
      `policy-contract/delete-document/${id}`,
    getById: (id: string | number) => `policy-contract/${id}`,
    list: (customerId: string, isCurrent: boolean) =>
      `policy-contract/list/${customerId}/${isCurrent}`,
    providersByCustomer: (customerId: string) => `providers/${customerId}`,
    update: (id: string | number) => `policy-contract/${id}`,
  },
  CommitteeVigilance: {
    create: "comites-vigilancia",
    delete: (id: string) => `comites-vigilancia/${id}`,
    getById: (id: string) => `comites-vigilancia/${id}`,
    list: (customerId: string) => `comites-vigilancia/list/${customerId}`,
    sendCredentials: (id: string) => `comites-vigilancia/${id}/send-credentials`,
    update: (id: string) => `comites-vigilancia/${id}`,
  },
  LegalDirectories: {
    committees: "legal-directories/committees",
  },
  SendEmail: {
    meeting: (meetingId: string | number) => `send-email/meeting/${meetingId}`,
    operationReport: (
      applicationUserId: string,
      customerId: string,
      year: number,
      weekNumber: number,
    ) =>
      `send-email/operation-report/${applicationUserId}/${customerId}/${year}/${weekNumber}`,
    presentacionFinalComite: (idJunta: string | number) =>
      `send-email/presentacion-final-comite/${idJunta}`,
  },
  EmailData: {
    base: "email-data",
    getAll: "email-data/list",
    getById: (id: string) => `email-data/${id}`,
    sendTestEmail: (id: string) => `send-email/test-email/${id}`,
  },
  MenuItems: {
    byCustomer: (customerId: string) => `menu-items/${customerId}`,
  },
  Permission: {
    update: (id: string | number) => `permission/${id}`,
  },
  EmergencyPhones: {
    create: "telefonos-emergencia",
    delete: (id: string) => `telefonos-emergencia/${id}`,
    getAll: "telefonos-emergencia",
    getById: (id: string | number) => `telefonos-emergencia/${id}`,
    update: (id: string | number) => `telefonos-emergencia/${id}`,
  },
  RefactorShared: {
    notifications: "notifications",
    notificationsUnreadCount: "notifications/unread-count",
      notificationsMarkAsReadById: (notificationId: any) => `notifications/mark-as-read/${notificationId}`,
},
} as const;

export const EndpointsShared = {
  AiAssistant: {
    // Ownership canonico compartido/transversal.
    // Consumido desde core/services y herramientas de diagnostico de admin.
    testProfile: "ai-assistant/test-profile",
    generateImage: "ai-assistant/generate-image",
  },
  File: {
    comiteHomeImages: "files/comite-home-images",
    download: (filePath: string) =>
      `files/download?filePath=${encodeURIComponent(filePath)}`,
    sidebarImages: "files/sidebar-images",
  },
  UserValidation: {
    searchExistingPerson: (fullName: string) =>
      `user-validation/search-existing-person/${fullName}`,
    searchExistingPhone: (phoneNumber: string) =>
      `user-validation/search-existing-phone/${phoneNumber}`,
  },
  Notifications: {
    getAll: "notifications",
    markAsRead: (notificationId: string) =>
      `notifications/mark-as-read/${notificationId}`,
    unreadCount: "notifications/unread-count",
  },
  Banks: {
    // Legacy shared alias.
    // El ownership canonico de este catalogo ya corresponde a `EndpointsAdmin.Catalogs.Banks`.
    create: "banks",
    delete: (id: string) => `banks/${id}`,
    getAll: "banks",
    getById: (id: string) => `banks/${id}`,
    getPdf: (id: string) => `banks/${id}/pdf`,
    selectItems: "select-items/banks",
    update: (id: string) => `banks/${id}`,
  },
  CfdiUses: {
    // Legacy shared alias.
    // El ownership canonico de este catalogo ya corresponde a `EndpointsAdmin.Catalogs.CfdiUses`.
    create: "cfdi-use",
    delete: (id: string) => `cfdi-use/${id}`,
    getAll: "cfdi-use",
    getById: (id: string) => `cfdi-use/${id}`,
    getPdf: (id: string) => `cfdi-use/${id}/pdf`,
    update: (id: string) => `cfdi-use/${id}`,
  },
  EnumSelectItems: {
    assetCategory: "asset-category",
    brand: "ebrand",
    departament: "departament",
    inventoryCategory: "inventory-category",
    leaveType: "leave-type",
    inventorySubCategory: "einventory-sub-category",
    measurementUnit: "emeasurement-unit",
    paymentMethod: "epayment-method",
    priority: "epriority",
    purchaseRequestStatus: "purchase-request-status",
    relationEmployee: "relation-employee",
    serviceType: "service-type",
    state: "state",
    status: "status",
    statusMaintenance: "estatus-maintenance",
    typeDocument: "etype-document",
    typeOfContract: "type-of-contract",
    typeMaintance: "type-maintance",
    typePiscina: "type-piscina",
    selectItemEnum: (nameEnum: string, defaultOption?: string) =>
      `select-item-enum/${nameEnum}${defaultOption ? "/" + defaultOption : ""}`,
  },
  CustomDocuments: {
    consultWithAi: "custom-documents/consult-with-ai",
    create: "custom-documents",
    delete: (id: string) => `custom-documents/${id}`,
    getById: (id: string) => `custom-documents/${id}`,
    list: (customerId: string, documentType: number) =>
      `custom-documents/list/${customerId}/${documentType}`,
    listByCustomerAndType: (customerId: string, documentType: number) =>
      `custom-documents/list/${customerId}/${documentType}`,
    update: (id: string) => `custom-documents/${id}`,
    updateOrder: "custom-documents/update-order",
  },
  Products: {
    autoComplete: "productos/get-auto-complete-select-item",
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
    buildingInsurance: (customerId: string) =>
      `policy-contract/building-insurance/${customerId}`,
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
    sendCredentials: (id: string) =>
      `comites-vigilancia/${id}/send-credentials`,
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
    // Legacy shared alias.
    // El ownership canonico de este catalogo ya corresponde a `EndpointsAdmin.Catalogs.EmailData`.
    base: "email-data",
    getAll: "email-data/list",
    getById: (id: string) => `email-data/${id}`,
    sendTestEmail: (id: string) => `send-email/test-email/${id}`,
    update: (id: string) => `email-data/${id}`,
  },
  MenuItems: {
    byCustomer: (customerId: string) => `menu-items/${customerId}`,
  },
  Permission: {
    userAdminByApplicationUser: (applicationUserId: string) =>
      `permission/permission-user-admin/${applicationUserId}`,
    update: (id: string | number) => `permission/${id}`,
  },
  EmergencyPhones: {
    create: "telefonosemergencia",
    delete: (id: string) => `telefonosemergencia/${id}`,
    getAll: "telefonosemergencia",
    getById: (id: string | number) => `telefonosemergencia/${id}`,
    update: (id: string | number) => `telefonosemergencia/${id}`,
  },
} as const;

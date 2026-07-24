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
  SelectItems: {
    // ─── Catálogo completo de api/select-items/* (paths relativos) ───

    // Sin parámetros
    rolesForAnnouncements: "roles-for-announcements",
    applicationRoles: "application-roles",
    applicationRolesToAdministrator: "application-roles-to-administrator",
    applicationRolesToProvider: "application-roles-to-provider",
    roleOptionsByType: (roleType: string) => `RolesByRoleType/${roleType}`,
    rolesByRoleType: (roleType: string) => `RolesByRoleType/${roleType}`,
    roles: "roles",
    legalMatterCategories: "LegalMatterCategory",
    legalMatterCategory: "LegalMatterCategory",
    legalMatters: "LegalMatter",
    legalMatter: "LegalMatter",
    ticketLegalMatterOptions: "SelectForAddTicket",
    selectForAddTicket: "SelectForAddTicket",
    documentRoles: "RolForDocument",
    rolForDocument: "RolForDocument",
    applicationUser: "application-users",
    applicationUsers: "application-users",
    customersActive: "customers-active",
    customersActiveShortName: "CustomersActiveNameShort",
    customersActiveNameShort: "CustomersActiveNameShort",
    customersInactive: "CustomersInactive",
    customersAll: "CustomersAll",
    nombreCorto: "NombreCorto",
    customerAccessByApplicationUser: (applicationUserId: string) =>
      `CustomersAcceso/${applicationUserId}`,
    customersAcceso: (applicationUserId: string) =>
      `CustomersAcceso/${applicationUserId}`,
    professions: "professions",
    categories: "categories",
    bank: "bank",
    products: "getproducts",
    measurementUnits: "getmeasurementunits",
    useCFDI: "usecfdi",
    wayToPay: "waytopay",
    paymentMethod: "paymentmethod",
    medidorCategoria: "medidorcategoria",
    supervision: "getlistsupervision",
    responsableSistemas: "responsablesistemas",
    allEmployeesActive: "getallemployeeactive",
    equipoCalendarioMaestro: "equipocalendariomaestro",
    providerApplicationUsers: "ApplicationUserProvider",
    applicationUserProvider: "ApplicationUserProvider",
    inspectionReviewCatalog: "InspectionReviewsCatalog",
    inspectionReviewsCatalog: "InspectionReviewsCatalog",
    moduleApps: "module-apps",
    equipmentClassifications: "EquipoClasificacion",
    equipoClasificacion: "EquipoClasificacion",
    yesNoOptions: "BoolYesNo",
    boolYesNo: "BoolYesNo",

    // Con customerId
    almacenes: (customerId: string) => `almacenes/${customerId}`,
    fundingPeriod: (customerId: string) => `funding-period/${customerId}`,
    properties: (customerId: string) => `properties/${customerId}`,
    employeesByCustomer: (customerId: string) => `employee/${customerId}`,
    employeesByUserId: (customerId: string) =>
      `employee-by-user-id/${customerId}`,
    person: (customerId: string) => `person/${customerId}`,
    employeePeople: (customerId: string) => `PersonEmployee/${customerId}`,
    personEmployee: (customerId: string) => `PersonEmployee/${customerId}`,
    employeeActive: (customerId: string) => `employeeactivo/${customerId}`,
    participantAdministration: (customerId: string) =>
      `participantadministration/${customerId}`,
    owners: (customerId: string) => `owners/${customerId}`,
    propertyMembersByCustomer: (customerId: string) =>
      `property-members/${customerId}`,
    toolsByCustomer: (customerId: string) => `tool/${customerId}`,
    accountingCatalogs: (customerId: string) =>
      `AccountingCatalogs/${customerId}`,
    accountingCatalogsByCustomer: (customerId: string, _year?: number) =>
      `AccountingCatalogs/${customerId}`,
    listadoInstalaciones: (customerId: string) =>
      `listadoinstalaciones/${customerId}`,
    usersFromCustomer: (customerId: string) => `UserFromCustomer/${customerId}`,
    usersByCustomer: (customerId: string) => `UserFromCustomer/${customerId}`,
    accountsByCustomer: (customerId: string) =>
      `getlistaccountforcustomer/${customerId}`,
    anioOrdenService: (customerId: string) => `anioordenservice/${customerId}`,
    buildingResidents: (customerId: string) =>
      `ResidentesEdificio/${customerId}`,
    residentesEdificio: (customerId: string) =>
      `ResidentesEdificio/${customerId}`,
    allEmployeesActiveByCustomer: (customerId: string) =>
      `getallemployeeactive/${customerId}`,
    providers: (customerId: string) => `providers/${customerId}`,
    machineriesAllByCustomer: (customerId: string) =>
      `machineries/get-all/${customerId}`,
    machineryActiveByCustomer: (customerId: string) =>
      `machineries-active/${customerId}`,
    inspectionsByCustomer: (customerId: string) =>
      `CustomerInspections/${customerId}`,
    customerInspections: (customerId: string) =>
      `CustomerInspections/${customerId}`,
    performanceEvaluationTemplatesByCustomer: (customerId: string) =>
      `EvaluationTemplates/${customerId}`,
    evaluationTemplates: (customerId: string) =>
      `EvaluationTemplates/${customerId}`,
    taskGroupCategory: (customerId: string, workGroupId?: string) =>
      `task-group-category/${customerId}${workGroupId ? `?workGroupId=${workGroupId}` : ""}`,
    taskGroupList: (customerId: string) => `task-group-list/${customerId}`,

    // Compuestos
    richProducts: (term: string) => `get-rich-products?term=${term}`,
    applicationUsersByCustomer: (customerId: string) =>
      `application-users/${customerId}`,
    committeeMinuteParticipants: (customerId: string, meetingId: string) =>
      `GetListComiteMinuta/${customerId}/${meetingId}`,
    comiteMinuta: (customerId: string, meetingId: string) =>
      `GetListComiteMinuta/${customerId}/${meetingId}`,
    administrationMinuteParticipants: (customerId: string, meetingId: string) =>
      `getlistadministracionminuta/${customerId}/${meetingId}`,
    administracionMinuta: (customerId: string, meetingId: string) =>
      `getlistadministracionminuta/${customerId}/${meetingId}`,
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

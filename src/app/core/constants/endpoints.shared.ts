export const EndpointsShared = {
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
  EnumSelectItems: {
    assetCategory: "EAssetCategory",
    brand: "EBrand",
    departament: "Departament",
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
    selectItemEnum: (nameEnum: string, defaultOption?: string) =>
      `select-item-enum/${nameEnum}${defaultOption ? '/' + defaultOption : ''}`,
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

  CustomDocuments: {
    create: "customdocument",
    delete: (id: string) => `customdocument/${id}`,
    getById: (id: string) => `customdocument/${id}`,
    list: (customerId: string, documentType: number) =>
      `customdocument/list/${customerId}/${documentType}`,
    update: (id: string) => `customdocument/${id}`,
    updateOrder: "customdocument/update-order",
  },
  Products: {
    autoComplete: "productos/getautocompleteselectitem/",
    delete: (id: string) => `productos/${id}`,
    getAll: "Productos",
    getAllPaged: "Productos/paged",
    getById: (id: string) => `Productos/${id}`,
  },
  ProductCategories: {
    base: "Categories",
    create: "categories",
    delete: (id: string | number) => `categories/${id}`,
    getAll: "Categories",
    getById: (id: string | number) => `categories/${id}`,
    update: (id: string | number) => `categories/${id}`,
  },
  PolicyContracts: {
    create: "PolicyContract",
    delete: (id: string | number) => `PolicyContract/${id}`,
    deleteDocument: (id: string | number) =>
      `PolicyContract/DeleteDocument/${id}`,
    getById: (id: string | number) => `PolicyContract/${id}`,
    list: (customerId: string, isCurrent: boolean) =>
      `PolicyContract/List/${customerId}/${isCurrent}`,
    providersByCustomer: (customerId: string) => `Providers/${customerId}`,
    update: (id: string | number) => `PolicyContract/${id}`,
  },
  CommitteeVigilance: {
    create: "ComiteVigilancia",
    delete: (id: string) => `comitevigilancia/${id}`,
    getById: (id: string) => `ComiteVigilancia/${id}`,
    list: (customerId: string) => `ComiteVigilancia/list/${customerId}`,
    sendCredentials: (id: string) => `comitevigilancia/${id}/send-credentials`,
    update: (id: string) => `ComiteVigilancia/${id}`,
  },
  LegalDirectories: {
    committees: "LegalDirectories/Committees",
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
  EmailData: {
    base: "EmailData",
    delete: (id: string) => `emaildata/${id}`,
    getAll: "EmailData/List",
    getById: (id: string) => `EmailData/${id}`,
    sendTestEmail: (id: string) => `SendEmail/TestEmail/${id}`,
  },
  MenuItems: {
    byCustomer: (customerId: string) => `menu-items/${customerId}`,
  },
  Permission: {
    update: (id: string | number) => `Permission/${id}`,
  },
  EmergencyPhones: {
    create: "TelefonosEmergencia",
    delete: (id: string) => `telefonosemergencia/${id}`,
    getAll: "TelefonosEmergencia",
    getById: (id: string | number) => `TelefonosEmergencia/${id}`,
    update: (id: string | number) => `TelefonosEmergencia/${id}`,
  },
} as const;

/**
 * Archivo centralizado de endpoints del API.
 */
export const Endpoints = {
  Banks: {
    getAll: "banks",
    getById: (id: string) => `banks/${id}`,
    create: "Banks",
    update: (id: string) => `Banks/${id}`,
    delete: (id: string) => `banks/${id}`,
    selectItems: "select-items/banks",
  },
  Customers: {
    getAll: (state: boolean) => `customers/list/${state}`,
    getById: (id: string) => `customers/${id}`,
    getByIdLegacy: (id: string) => `Customers/${id}`,
    create: "customers",
    update: (id: string) => `customers/${id}`,
    delete: (id: string) => `customers/${id}`,
  },
  PaymentMethods: {
    getAll: "payment-methods",
    getById: (id: string) => `payment-methods/${id}`,
    create: "payment-methods",
    update: (id: string) => `payment-methods/${id}`,
    delete: (id: string) => `payment-methods/${id}`,
  },
  CfdiUses: {
    getAll: "cfdi-use",
    getById: (id: string) => `cfdi-use/${id}`,
    create: "cfdi-use",
    update: (id: string) => `cfdi-use/${id}`,
    delete: (id: string) => `cfdi-use/${id}`,
  },
  ApplicationRoles: {
    getAll: "application-roles",
    getById: (id: string) => `application-roles/${id}`,
    create: "application-roles",
    update: (id: string) => `application-roles/${id}`,
    delete: (id: string) => `application-roles/${id}`,
    getPdf: (id: string) => `application-roles/${id}/pdf`,
  },
  ApplicationUsers: {
    getAll: (state: boolean, typePerson: any) =>
      `application-users/List/${state}/${typePerson}`,
    getById: (id: string) => `application-users/${id}`,
    createAccount: "application-users/CreateAccount",
    updateAccount: (id: string) => `application-users/UpdateAccount/${id}`,
    delete: (id: string) => `application-users/Delete/${id}`,
    toBlockAccount: (id: string) => `application-users/ToBlockAccount/${id}`,
    toUnlockAccount: (id: string) => `application-users/ToUnlockAccount/${id}`,
    addRoleToUser: (id: string) => `application-users/AddRoleToUser/${id}`,
    getRoleUrl: (id: string, roleType: number | null) =>
      roleType !== null
        ? `application-users/GetRole/${id}/${roleType}`
        : `application-users/GetRole/${id}`,
  },
  ModuleApps: {
    getAll: "module-apps",
    getById: (id: string) => `module-apps/${id}`,
    create: "module-apps",
    update: (id: string) => `module-apps/${id}`,
    delete: (id: string) => `module-apps/${id}`,
  },
  ModuleAppRoles: {
    listRole: "module-app-roles/ListRole",
    listModule: "module-app-roles/ListModule",
    assignments: (roleId: string) => `module-app-roles/Assignments/${roleId}`,
    updateAssigned: "module-app-roles/UpdateModuleAppRolAssigned",
  },
  ModuleAppCustomers: {
    permissions: (customerId: string) =>
      `module-app-customers/${customerId}/Permissions`,
    customers: (state: boolean) => `module-app-customers/Customers/${state}`,
    customerModules: (customerId: string) =>
      `module-app-customers/Customer/${customerId}`,
    updateModuleStatus: "module-app-customers/UpdateModuleStatus",
    activeModules: (customerId: string) =>
      `module-app-customers/Customer/${customerId}/ActiveModules`,
  },
  CustomerAddresses: {
    getByCustomerId: (customerId: string) => `customer-addresses/${customerId}`,
    update: "customer-addresses",
  },
  CustomerImages: {
    getByCustomerId: (customerId: string) => `customer-images/${customerId}`,
    create: "customer-images",
    delete: (id: string) => `customer-images/${id}`,
  },
  SelectItems: {
    properties: (customerId: string) => `select-items/properties/${customerId}`,
    rolesForAnnouncements: "roles-for-announcements",
    customersActiveNameShort: "CustomersActiveNameShort",
    applicationUsersByCustomer: (customerId: string) =>
      `application-users/${customerId}`,
    employeesByCustomer: (customerId: string) => `employee/${customerId}`,
    customersActive: "customers-active",
    bank: "bank",
  },
  EnumSelectItems: {
    departament: "EDepartament",
    relationEmployee: "ERelationEmployee",
    assetCategory: "EAssetCategory",
  },
  Announcements: {
    adminList: "announcements/admin-list",
    getById: (id: string) => `announcements/${id}`,
    analytics: (id: string) => `announcements/${id}/analytics`,
    downloadPdf: (id: string) => `announcements/${id}/pdf`,
    create: "announcements",
    update: (id: string) => `announcements/${id}`,
    delete: (id: string) => `announcements/${id}`,
  },
  EmailData: {
    getAll: "EmailData/List",
    delete: (id: string) => `emaildata/${id}`,
    sendTestEmail: (id: string) => `SendEmail/TestEmail/${id}`,
  },
  SendEmail: {
    operationReport: (
      applicationUserId: string,
      customerId: string,
      year: number,
      weekNumber: number,
    ) =>
      `sendemail/operation-report/${applicationUserId}/${customerId}/${year}/${weekNumber}`,
  },
  Logs: {
    getAll: "Logs",
    deleteAll: "Logs/all",
  },
  MachineryClassification: {
    getAll: "EquipoClasificacion",
    delete: (id: string) => `equipoclasificacion/${id}`,
  },
  MeterCategories: {
    getAll: "MedidorCategoria",
    delete: (id: string) => `medidorcategoria/${id}`,
  },
  PaymentTypes: {
    getAll: "MetodoPago",
    delete: (id: string) => `MetodoPago/${id}`,
  },
  UnitsOfMeasurement: {
    getAll: "UnidadMedida",
    delete: (id: string) => `unidadmedida/${id}`,
  },
  Properties: {
    getById: (id: string) => `Property/${id}`,
    create: "Property",
    update: (id: string) => `Property/${id}`,
  },
  Presupuestos: {
    create: "Presupuesto/Create",
    update: (id: string) => `Presupuesto/UpdatePresupuesto/${id}`,
  },
  EntregaRecepcionCliente: {
    generateData: "EntregaRecepcionCliente/GenerateData",
    getByCustomerAndDepartment: (customerId: string, department: string) =>
      `EntregaRecepcionCliente/${customerId}/${department}`,
    validateFile: (applicationUserId: string, id: string) =>
      `EntregaRecepcionCliente/ValidarArchivo/${applicationUserId}/${id}`,
    invalidateFile: (id: string) =>
      `EntregaRecepcionCliente/InvalidarArchivo/${id}`,
    deleteFile: (id: string) => `EntregaRecepcionCliente/DeleteFile/${id}`,
  },
  TaskLegal: {
    getAllLegal: "task-legal/AllLegal",
    getAllByCustomer: (customerId: string) => `task-legal/All/${customerId}`,
    getById: (id: string) => `task-legal/${id}`,
    create: "task-legal",
    createToCustomer: "task-legal/ToCustomer",
    update: (id: string) => `task-legal/${id}`,
    employeeLegal: "task-legal/EmployeeLegal",
    selectForAddTicket: "SelectForAddTicket",
    status: (id: string) => `task-legal/status/${id}`,
    updateStatus: (id: string, status: number | null) =>
      `task-legal/UpdateStatus/${id}/${status}`,
    tracking: (ticketId: string) => `task-legal/Traking/${ticketId}`,
    addTracking: "task-legal/Addtraking",
    requestDetail: (id: string) => `task-legal/requestDetail/${id}`,
    delete: (id: string) => `task-legal/${id}`,
  },
  LegalMatters: {
    getAll: "LegalMatter",
    getById: (id: string) => `LegalMatter/${id}`,
    create: "LegalMatter",
    update: (id: string) => `LegalMatter/${id}`,
    delete: (id: string) => `LegalMatter/${id}`,
    categories: "legalmattercategory",
    categoryById: (id: string) => `LegalMatter/Category/${id}`,
    createCategory: "LegalMatter/Category",
    updateCategory: (id: string) => `LegalMatter/Category/${id}`,
    deleteCategory: (id: string) => `LegalMatter/Category/${id}`,
  },
  LegalReports: {
    results: (startDate: string, endDate: string, isInternal: boolean) =>
      `LegalReport/Results/${startDate}/${endDate}/${isInternal}`,
    requestsAttended: (
      startDate: string,
      endDate: string,
      isInternal: boolean,
    ) => `LegalReport/RequestsAttended/${startDate}/${endDate}/${isInternal}`,
    requestsPending: (isInternal: boolean) =>
      `LegalReport/RequestsPending/${isInternal}`,
    summary: (startDate: string, endDate: string) =>
      `LegalReport/Summary/${startDate}/${endDate}`,
    summaryCustomer: (startDate: string, endDate: string) =>
      `LegalReport/SummaryCustomer/${startDate}/${endDate}`,
    summaryIndividual: (startDate: string, endDate: string) =>
      `LegalReport/SummaryIndividual/${startDate}/${endDate}`,
    totalRequests: (startDate: string, endDate: string) =>
      `LegalReport/TotalRequests/${startDate}/${endDate}`,
    generateWeeklyReport: (
      startDate: string,
      endDate: string,
      isInternal: boolean,
    ) =>
      `LegalReport/GenerateWeeklyReport/${startDate}/${endDate}/${isInternal}`,
    pending: (isExternal: boolean) =>
      `LegalReport/Pending/${isExternal ? 1 : 0}`,
    pendingUnassignedData: "LegalReport/PendingUnassignedData",
    report: "LegalReport/Report",
  },
  LegalMinutes: {
    pendingByUserAndStatus: (applicationUserId: string, status: number) =>
      `ContabilidadMinuta/ListaMinutaLegal/${applicationUserId}/${status}`,
  },
  MeetingDetailsTracking: {
    delete: (id: string | number) => `MeetingDertailsSeguimiento/${id}`,
  },
  Products: {
    getAll: "Productos",
    delete: (id: string) => `productos/${id}`,
  },
  ProviderSupport: {
    getAll: "providersupport",
    delete: (id: string) => `providersupport/${id}`,
  },
  RadioCommunication: {
    getById: (id: string) => `RadioComunicacion/${id}`,
    create: "RadioComunicacion",
    update: (id: string) => `RadioComunicacion/${id}`,
  },
  RecurringTasks: {
    Templates: {
      getActiveList: "recurring-tasks/templates/list/true",
      customerConfig: (customerId: string) =>
        `recurring-tasks/templates/config/${customerId}`,
      saveCustomerConfig: "recurring-tasks/templates/config",
    },
  },
  Notifications: {
    getAll: "notifications",
    markAsRead: (notificationId: string) =>
      `Notifications/mark-as-read/${notificationId}`,
  },
  MenuItems: {
    byCustomer: (customerId: string) => `menu-items/${customerId}`,
  },
  AccessHistory: {
    byCustomerAndRange: (
      customerId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) => `AccessHistory/${customerId}/${fechaInicial}/${fechaFinal}`,
  },
  Meters: {
    getById: (id: string | number) => `Medidor/${id}`,
    listByCustomer: (customerId: string) => `Medidor/list/${customerId}`,
    create: "Medidor",
    update: (id: string | number) => `Medidor/${id}`,
    delete: (id: string | number) => `Medidor/${id}`,
  },
  MeterReadings: {
    getById: (id: string | number) => `MedidorLectura/${id}`,
    listByMeter: (medidorId: string) => `MedidorLectura/list/${medidorId}`,
    create: "MedidorLectura",
    update: (id: string | number) => `MedidorLectura/${id}`,
    delete: (id: string | number) => `MedidorLectura/${id}`,
    lastReading: (medidorId: string) =>
      `MedidorLectura/UltimaLectura/${medidorId}`,
    dailyChart: (medidorId: string, fechaInicial: string, fechaFinal: string) =>
      `MedidorLectura/DataGraficoDiaria/${medidorId}/${fechaInicial}/${fechaFinal}`,
    monthlyChart: (
      medidorId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) =>
      `MedidorLectura/DataGraficoMensual/${medidorId}/${fechaInicial}/${fechaFinal}`,
    exportExcel: (id: string | number) => `MedidorLectura/ExportExcel/${id}`,
  },
  CatalogAssets: {
    getAll: "CatalogAsset",
    getById: (id: string) => `CatalogAsset/${id}`,
    create: "CatalogAsset",
    update: (id: string) => `CatalogAsset/${id}`,
    delete: (id: string | number) => `CatalogAsset/${id}`,
  },
  InspectionReviewCatalog: {
    getAll: "InspectionReviewsCatalog",
    getById: (id: string) => `InspectionReviewsCatalog/${id}`,
    create: "InspectionReviewsCatalog",
    update: (id: string) => `InspectionReviewsCatalog/${id}`,
    delete: (id: string | number) => `InspectionReviewsCatalog/${id}`,
  },
  Inspections: {
    getById: (id: string) => `inspection/${id}`,
    listByCustomer: (customerId: string) => `inspection/list/${customerId}`,
    create: "Inspection",
    update: (id: string) => `Inspection/${id}`,
    delete: (id: string | number) => `inspection/${id}`,
  },
  CustomerInspections: {
    selectByCustomer: (customerId: string) =>
      `CustomerInspections/${customerId}`,
  },
  CondominiumAssets: {
    selectByCustomer: (customerId: string) => `CondominiumAsset/${customerId}`,
  },
  InspectionResults: {
    getByIdForExecution: (customerInspectionId: string) =>
      `InspectionResult/InspectionResultGetById/${customerInspectionId}`,
    updateInspectionData: (
      customerInspectionId: string,
      applicationUserId: string,
    ) =>
      `InspectionResult/UpdateInspectionData/${customerInspectionId}/${applicationUserId}`,
    byUserCustomerAndDate: (
      applicationUserId: string,
      customerId: string,
      formattedDate: string,
    ) =>
      `InspectionResult/GetInspectionsByCustomer/${applicationUserId}/${customerId}/${formattedDate}`,
    report: (inspectionResultId: string, date?: string) =>
      date
        ? `InspectionResult/Report/${inspectionResultId}/${date}`
        : `InspectionResult/Report/${inspectionResultId}`,
    exportPdf: (inspectionId: string, date?: string) =>
      date
        ? `InspectionResult/ExportPDF/${inspectionId}/${date}`
        : `InspectionResult/ExportPDF/${inspectionId}`,
  },
  InspectionResultImages: {
    byInspectionResultAndCustomer: (
      inspectionResultId: string,
      customerId: string,
    ) => `InspectionResultImage/${inspectionResultId}/${customerId}`,
    deleteInspectionImage: (imageId: string, customerId: string) =>
      `InspectionResultImage/DeleteInspectionImage/${imageId}/${customerId}`,
  },
  InspectionCondominiumAssets: {
    listByInspection: (inspectionId: string) =>
      `InspectionCondominiumAsset/List/${inspectionId}`,
    getById: (assetId: string) => `InspectionCondominiumAsset/${assetId}`,
    create: "InspectionCondominiumAsset",
    update: (id: string) => `InspectionCondominiumAsset/${id}`,
    deleteArea: (id: string) => `InspectionCondominiumAsset/DeleteArea/${id}`,
    deleteReview: (reviewId: string) =>
      `InspectionCondominiumAsset/DeleteReview/${reviewId}`,
  },
  TaskReads: {
    listByTicketMessage: (ticketMessageId: string) =>
      `task-read/list/${ticketMessageId}`,
  },
  TaskFollowUps: {
    listByTicketMessage: (ticketMessageId: string) =>
      `task-follow-up/List/${ticketMessageId}`,
    create: "task-follow-up",
  },
  TaskGroupCategories: {
    base: "task-group-categories",
    getAll: "task-group-categories",
    getById: (id: string) => `task-group-categories/${id}`,
    delete: (id: string | number) => `task-group-categories/${id}`,
    selectByCustomer: (customerId: string) =>
      `task-group-category/${customerId}`,
  },
  Tasks: {
    groupListByCustomer: (customerId: string) =>
      `task-group-list/${customerId}`,
    getById: (id: string) => `tasks/${id}`,
    create: "tasks/Create",
    update: (id: string) => `tasks/Update/${id}`,
    participants: (ticketGroupId: string) =>
      `tasks/participant/${ticketGroupId}`,
    list: (ticketGroupId: string, status: string) =>
      `tasks/List/${ticketGroupId}/${status}`,
    view: (id: string) => `tasks/view/${id}`,
    myAssignedTickets: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/MyAssignedTickets/${applicationUserId}/${status}/${customerId}`,
    myRequests: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/MyRequest/${applicationUserId}/${status}/${customerId}`,
    updatePriority: (id: string, applicationUserId: string) =>
      `tasks/UpdatePriority/${id}/${applicationUserId}`,
    inProgress: (id: string, applicationUserId: string) =>
      `Tickets/InProgress/${id}/${applicationUserId}`,
    inProgressLower: (id: string, applicationUserId: string) =>
      `tasks/in-progress/${id}/${applicationUserId}`,
    updatePriorityLower: (id: string, applicationUserId: string) =>
      `tasks/update-priority/${id}/${applicationUserId}`,
    getByClosed: (id: string) => `tasks/GetByClosed/${id}`,
    close: "tasks/Closed",
    reopen: "tasks/Reopen",
    updateRelevanceLegacy: (id: string) => `tasks/UpdateRelevance/${id}`,
    updateRelevance: (id: string) => `tasks/update-relevance/${id}`,
    deleteByCustomer: (id: string, customerId: string) =>
      `tasks/${id}/${customerId}`,
    programation: (id: string) => `tasks/Programation/${id}`,
    myTicketProgramation: (id: string) => `tasks/MyTicket/Programation/${id}`,
    updateOrder: "tasks/UpdateOrder",
    legalAll: (customerId?: string) =>
      customerId
        ? `tasks/legal/all?customerId=${customerId}`
        : `tasks/legal/all`,
    legalByCustomer: "tasks/legal/customer",
    legalPending: (isInternal?: boolean, unassigned: boolean = false) => {
      if (unassigned) return "tasks/legal/pending?unassigned=true";
      return isInternal !== undefined
        ? `tasks/legal/pending?isInternal=${isInternal}`
        : "tasks/legal/pending";
    },
    getStatus: (id: string) => `tasks/${id}/status`,
    updateStatus: (id: string) => `tasks/${id}/status`,
  },
  TaskGroups: {
    base: "task-groups",
    getById: (id: string) => `task-groups/${id}`,
    list: (customerId: string, isActive: boolean, applicationUserId: string) =>
      `task-groups/List/${customerId}/${isActive}/${applicationUserId}`,
    toggleStatus: (id: string) => `task-groups/toggle-status/${id}`,
    delete: (id: string | number) => `task-groups/${id}`,
    sendReportPendingByGroup: (id: string) => `tasks/send-report-pending/${id}`,
    sendReportPendingAll: "tasks/send-report-pending",
  },
  TaskGroupParticipants: {
    base: "task-group-participant",
    availableByCustomerAndGroup: (customerId: string, taskGroupId: string) =>
      `task-group-participant/Participants/${customerId}/${taskGroupId}`,
    listByGroup: (taskGroupId: string) =>
      `task-group-participant/${taskGroupId}`,
    update: (id: string) => `task-group-participant/${id}`,
    delete: (id: string | number) => `task-group-participant/${id}`,
  },
  TaskReports: {
    weeklyReport: (
      customerId: string,
      startDate: string | null,
      endDate: string | null,
      status: string | number,
    ) =>
      `task-report/WeeklyReport/${customerId}/${startDate}/${endDate}/${status}`,
    ticketReport: (customerId: string, startDate: string, endDate: string) =>
      `task-report/GetTicketReport/${customerId}/${startDate}/${endDate}`,
    weeklyPreview: (customerId: string, year: number, weekNumber: number) =>
      `task-report/WeeklyReportPreview/${customerId}/${year}/${weekNumber}`,
  },
  TaskWorkPlans: {
    create: (
      applicationUserId: string,
      customerId: string,
      year: number,
      weekNumber: number,
    ) =>
      `task-work-plan/Create/${applicationUserId}/${customerId}/${year}/${weekNumber}`,
    preview: (customerId: string, year: number, weekNumber: number) =>
      `task-work-plan/preview/${customerId}/${year}/${weekNumber}`,
    pending: (customerId: string) => `task-work-plan/pending/${customerId}`,
  },
  ResidentesEdificio: {
    selectByCustomer: (customerId: string) =>
      `residentesedificio/${customerId}`,
  },
  AccountingCoi: {
    Accounting: {
      Accounts: {
        tree: (customerId: string) =>
          `accounting-coi/accounting/accounts/tree/${customerId}`,
        getById: (id: string) => `accounting-coi/accounting/accounts/${id}`,
        create: "accounting-coi/accounting/accounts",
        update: (id: string) => `accounting-coi/accounting/accounts/${id}`,
        delete: (id: string) => `accounting-coi/accounting/accounts/${id}`,
      },
      Budgets: {
        get: (customerId: string, accountId: string, year: number) =>
          `accounting-coi/accounting/budgets/${customerId}/${accountId}/${year}`,
        paginated: (customerId: string, year: number) =>
          `accounting-coi/accounting/budgets/paginated/${customerId}/${year}`,
        create: "accounting-coi/accounting/budgets",
        update: (id: string) => `accounting-coi/accounting/budgets/${id}`,
        delete: (id: string) => `accounting-coi/accounting/budgets/${id}`,
      },
      Policies: {
        paginated: (customerId: string) =>
          `accounting-coi/accounting/policies/paginated/${customerId}`,
        getById: (id: string) => `accounting-coi/accounting/policies/${id}`,
        create: "accounting-coi/accounting/policies",
        update: (id: string) => `accounting-coi/accounting/policies/${id}`,
        delete: (id: string) => `accounting-coi/accounting/policies/${id}`,
      },
      FiscalPeriods: {
        paginated: (customerId: string) =>
          `accounting-coi/accounting/fiscal-periods/paginated/${customerId}`,
        allByYear: (customerId: string, year: number) =>
          `accounting-coi/accounting/fiscal-periods/all/${customerId}/${year}`,
        create: "accounting-coi/accounting/fiscal-periods",
        toggleStatus: (id: string) =>
          `accounting-coi/accounting/fiscal-periods/${id}/toggle-status`,
        update: (id: string) =>
          `accounting-coi/accounting/fiscal-periods/${id}`,
        delete: (id: string) =>
          `accounting-coi/accounting/fiscal-periods/${id}`,
      },
    },
    CobranzaOnline: {
      Dashboard: {
        get: (customerId: string, year: number, month: number) =>
          `accounting-coi/cobranza-online/dashboard/customer/${customerId}/year/${year}/month/${month}`,
        analysis: (
          customerId: string,
          year: number,
          month: number,
          day: number,
        ) =>
          `accounting-coi/cobranza-online/analysis/customer/${customerId}/year/${year}/month/${month}/day/${day}`,
        inspection: (customerId: string, year: number, month: number) =>
          `accounting-coi/cobranza-online/inspection/customer/${customerId}/year/${year}/month/${month}`,
        inspectionHistory: (
          customerId: string,
          year: number,
          accountNumber: string,
        ) =>
          `accounting-coi/cobranza-online/inspection-history/customer/${customerId}/year/${year}/account/${encodeURIComponent(accountNumber)}`,
        syncStatus: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/sync-status/customer/${customerId}/year/${year}`,
        excludedAccounts: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/excluded-accounts/customer/${customerId}/year/${year}`,
        updateExcludedAccount: (customerId: string) =>
          `accounting-coi/cobranza-online/excluded-accounts/customer/${customerId}`,
      },
      Sync: {
        cobranza: (customerId: string, year: number) =>
          `accounting-coi/migration/aspel-sync/${customerId}/ejercicio/${year}/cobranza`,
      },
      Accounts: {
        tree: (customerId: string) =>
          `accounting-coi/cobranza-online/accounts/tree/customer/${customerId}`,
      },
      Balances: {
        annual: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/balances/customer/${customerId}/year/${year}`,
      },
      Cartera: {
        get: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/cartera/customer/${customerId}/year/${year}`,
      },
      Mapping: {
        status: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}`,
        properties: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}/properties`,
        update: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}`,
        auto: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}/auto`,
      },
      Movements: {
        get: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/movements/customer/${customerId}/year/${year}`,
      },
      Policies: {
        get: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/policies/customer/${customerId}/year/${year}`,
      },
      Statements: {
        get: (customerId: string, accountId: string, year: number) =>
          `accounting-coi/cobranza-online/statements/customer/${customerId}/account/${accountId}/year/${year}`,
        cuentasNivel3: (customerId: string) =>
          `accounting-coi/cobranza-online/statements/cuentas-nivel3/customer/${customerId}`,
      },
      ReporteFinanciero: {
        get: (
          customerId: string,
          year: number,
          mesInicio: number,
          mesFin: number,
        ) =>
          `accounting-coi/cobranza-online/reporte-financiero/customer/${customerId}/year/${year}/from/${mesInicio}/to/${mesFin}`,
      },
    },
    LegacyCollection: {
      Dashboard: {
        get: (customerId: string, year: number, month: number) =>
          `accounting-coi/cobranza-online/dashboard/customer/${customerId}/year/${year}/month/${month}`,
        syncStatus: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/sync-status/customer/${customerId}/year/${year}`,
      },
      Accounts: {
        tree: (customerId: string) =>
          `accounting-coi/cobranza-online/accounts/tree/customer/${customerId}`,
      },
      Balances: {
        annual: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/balances/customer/${customerId}/year/${year}`,
      },
      Cartera: {
        get: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/cartera/customer/${customerId}/year/${year}`,
      },
      Mapping: {
        status: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}`,
        properties: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}/properties`,
        update: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}`,
        auto: (customerId: string) =>
          `accounting-coi/legacy-collection/mapping/customer/${customerId}/auto`,
      },
      Movements: {
        get: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/movements/customer/${customerId}/year/${year}`,
      },
      Policies: {
        get: (customerId: string, year: number) =>
          `accounting-coi/cobranza-online/policies/customer/${customerId}/year/${year}`,
      },
      Statements: {
        get: (customerId: string, accountId: string, year: number) =>
          `accounting-coi/cobranza-online/statements/customer/${customerId}/account/${accountId}/year/${year}`,
        cuentasNivel3: (customerId: string) =>
          `accounting-coi/cobranza-online/statements/cuentas-nivel3/customer/${customerId}`,
      },
    },
    NativeCollection: {
      Charges: {
        customer: (customerId: string) =>
          `accounting-coi/native-collection/charges/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/charges/${id}`,
        create: "accounting-coi/native-collection/charges",
        update: (id: string) =>
          `accounting-coi/native-collection/charges/${id}`,
        delete: (id: string) =>
          `accounting-coi/native-collection/charges/${id}`,
        generateMonthly:
          "accounting-coi/native-collection/charges/generate-monthly",
        calculateLateFees:
          "accounting-coi/native-collection/charges/calculate-late-fees",
        bulkImportSaldoInicial: (customerId: string) =>
          `accounting-coi/native-collection/charges/bulk-import/saldo-inicial?customerId=${customerId}`,
        initialBalanceStatus: (customerId: string) =>
          `accounting-coi/native-collection/charges/initial-balance-status/customer/${customerId}`,
        bulkSetInitialBalance:
          "accounting-coi/native-collection/charges/initial-balance/bulk",
      },
      Templates: {
        customer: (customerId: string) =>
          `accounting-coi/native-collection/templates/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/templates/${id}`,
        create: "accounting-coi/native-collection/templates",
        update: (id: string) =>
          `accounting-coi/native-collection/templates/${id}`,
        delete: (id: string) =>
          `accounting-coi/native-collection/templates/${id}`,
        preview: "accounting-coi/native-collection/templates/preview",
        coverage: (customerId: string) =>
          `accounting-coi/native-collection/templates/coverage/customer/${customerId}`,
      },
      Payments: {
        customer: (customerId: string) =>
          `accounting-coi/native-collection/payments/customer/${customerId}`,
        pendingCharges: (propertyId: string, customerId: string) =>
          `accounting-coi/native-collection/payments/pending-charges/property/${propertyId}/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/payments/${id}`,
        create: "accounting-coi/native-collection/payments",
        update: (id: string) =>
          `accounting-coi/native-collection/payments/${id}`,
        delete: (id: string) =>
          `accounting-coi/native-collection/payments/${id}`,
        cancel: (id: string) =>
          `accounting-coi/native-collection/payments/${id}/cancel`,
        applyToCharges:
          "accounting-coi/native-collection/payments/apply-to-charges",
      },
      Statements: {
        get: (propertyId: string) =>
          `accounting-coi/native-collection/statements/${propertyId}`,
      },
      BillingConfig: {
        customer: (customerId: string) =>
          `accounting-coi/native-collection/billing-config/customer/${customerId}`,
        save: "accounting-coi/native-collection/billing-config",
      },
      Analytics: {
        metrics: (customerId: string) =>
          `accounting-coi/native-collection/analytics/customer/${customerId}?meses=`,
      },
      Reconciliation: {
        unallocated:
          "accounting-coi/native-collection/reconciliation/unallocated",
        autoApplyAll:
          "accounting-coi/native-collection/reconciliation/auto-apply-all",
      },
      LateFeePolicies: {
        customer: (customerId: string) =>
          `accounting-coi/native-collection/late-fee-policies/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/late-fee-policies/${id}`,
        create: "accounting-coi/native-collection/late-fee-policies",
        update: (id: string) =>
          `accounting-coi/native-collection/late-fee-policies/${id}`,
        delete: (id: string) =>
          `accounting-coi/native-collection/late-fee-policies/${id}`,
      },
      PropertyMembers: {
        byId: (id: string) =>
          `accounting-coi/native-collection/property-members/${id}`,
        byCustomer: (customerId: string) =>
          `accounting-coi/native-collection/property-members/customer/${customerId}`,
        byProperty: (propertyId: string, customerId: string) =>
          `accounting-coi/native-collection/property-members/property/${propertyId}/customer/${customerId}`,
        create: "accounting-coi/native-collection/property-members",
        update: (id: string) =>
          `accounting-coi/native-collection/property-members/${id}`,
        endMembership: (id: string) =>
          `accounting-coi/native-collection/property-members/${id}/end-membership`,
        migrateFromLegacy: (customerId: string) =>
          `accounting-coi/native-collection/property-members/migrate-from-legacy/customer/${customerId}`,
      },
      RegulationArticles: {
        byCustomer: (customerId: string) =>
          `accounting-coi/native-collection/regulation-articles/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/regulation-articles/${id}`,
        create: "accounting-coi/native-collection/regulation-articles",
        update: (id: string) =>
          `accounting-coi/native-collection/regulation-articles/${id}`,
        delete: (id: string) =>
          `accounting-coi/native-collection/regulation-articles/${id}`,
      },
      PropertyFines: {
        byCustomer: (customerId: string) =>
          `accounting-coi/native-collection/property-fines/customer/${customerId}`,
        byProperty: (propertyId: string) =>
          `accounting-coi/native-collection/property-fines/property/${propertyId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/property-fines/${id}`,
        create: "accounting-coi/native-collection/property-fines",
        update: (id: string) =>
          `accounting-coi/native-collection/property-fines/${id}`,
        issueCharge:
          "accounting-coi/native-collection/property-fines/issue-charge",
        void: (id: string, reason: string) =>
          `accounting-coi/native-collection/property-fines/${id}/void?reason=${encodeURIComponent(reason)}`,
        addEvidence: (fineId: string) =>
          `accounting-coi/native-collection/property-fines/${fineId}/evidences`,
        removeEvidence: (evidenceId: string) =>
          `accounting-coi/native-collection/property-fines/evidences/${evidenceId}`,
      },
      Adjustments: {
        create: "accounting-coi/native-collection/adjustments",
        createCreditNote:
          "accounting-coi/native-collection/adjustments/credit-notes",
        pendingCreditNotes: (propertyId: string, customerId: string) =>
          `accounting-coi/native-collection/adjustments/credit-notes/property/${propertyId}/customer/${customerId}`,
        cancelCreditNote: (id: string) =>
          `accounting-coi/native-collection/adjustments/credit-notes/${id}/cancel`,
      },
      FinancialApprovals: {
        create: "accounting-coi/native-collection/financial-approvals",
        pending: (customerId: string) =>
          `accounting-coi/native-collection/financial-approvals/pending/customer/${customerId}`,
        byProperty: (propertyId: string, customerId: string) =>
          `accounting-coi/native-collection/financial-approvals/property/${propertyId}/customer/${customerId}`,
        approve: (id: string) =>
          `accounting-coi/native-collection/financial-approvals/${id}/approve`,
        reject: (id: string) =>
          `accounting-coi/native-collection/financial-approvals/${id}/reject`,
        cancel: (id: string) =>
          `accounting-coi/native-collection/financial-approvals/${id}/cancel`,
      },
      PeriodClosures: {
        byCustomer: (customerId: string) =>
          `accounting-coi/native-collection/period-closures/customer/${customerId}`,
        isClosed: (customerId: string, year: number, month: number) =>
          `accounting-coi/native-collection/period-closures/customer/${customerId}/${year}/${month}/is-closed`,
        close: (customerId: string) =>
          `accounting-coi/native-collection/period-closures/customer/${customerId}/close`,
        reopen: (customerId: string) =>
          `accounting-coi/native-collection/period-closures/customer/${customerId}/reopen`,
      },
      Ledger: {
        propertyBalance: (propertyId: string, customerId: string) =>
          `accounting-coi/native-collection/ledger/property/${propertyId}/customer/${customerId}/balance`,
        propertyEntries: (propertyId: string, customerId: string) =>
          `accounting-coi/native-collection/ledger/property/${propertyId}/customer/${customerId}/entries`,
        chargeBalance: (chargeId: string) =>
          `accounting-coi/native-collection/ledger/charge/${chargeId}/balance`,
        batchEntries: (batchId: string) =>
          `accounting-coi/native-collection/ledger/batch/${batchId}`,
        checkIntegrity: (customerId: string) =>
          `accounting-coi/native-collection/ledger/integrity/customer/${customerId}`,
      },
      CollectionCases: {
        byCustomer: (customerId: string) =>
          `accounting-coi/native-collection/collection-cases/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/collection-cases/${id}`,
        create: "accounting-coi/native-collection/collection-cases",
        update: (id: string) =>
          `accounting-coi/native-collection/collection-cases/${id}`,
        logActivity: (id: string) =>
          `accounting-coi/native-collection/collection-cases/${id}/activity`,
        evaluateAndEscalate: (customerId: string) =>
          `accounting-coi/native-collection/collection-cases/evaluate-and-escalate/${customerId}`,
      },
      Invoices: {
        byCharge: (chargeId: string) =>
          `accounting-coi/native-collection/invoices/charge/${chargeId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/invoices/${id}`,
        generate: "accounting-coi/native-collection/invoices",
        cancel: (id: string) =>
          `accounting-coi/native-collection/invoices/${id}/cancel`,
      },
      FinancialAudit: {
        byCustomer: (customerId: string) =>
          `accounting-coi/native-collection/audit/customer/${customerId}`,
        byProperty: (propertyId: string, customerId: string) =>
          `accounting-coi/native-collection/audit/property/${propertyId}/customer/${customerId}`,
      },
      Automation: {
        generateMonthlyCharges:
          "accounting-coi/native-collection/charges/generate-monthly",
        calculateLateFees: (customerId: string) =>
          `accounting-coi/native-collection/charges/calculate-late-fees?customerId=${customerId}`,
        processNotifications: (customerId: string) =>
          `accounting-coi/native-collection/notifications/process?customerId=${customerId}`,
        evaluateCollectionCases: (customerId: string) =>
          `accounting-coi/native-collection/collection-cases/evaluate-and-escalate/${customerId}`,
        autoReconcile:
          "accounting-coi/native-collection/reconciliation/auto-apply-all",
      },
    },

    Configuration: {
      AspelSync: {
        completo: (customerId: string, year: number) =>
          `accounting-coi/migration/aspel-sync/${customerId}/ejercicio/${year}/completo`,
        contabilidad: (customerId: string, year: number) =>
          `accounting-coi/migration/aspel-sync/${customerId}/ejercicio/${year}/contabilidad`,
        cobranza: (customerId: string, year: number) =>
          `accounting-coi/migration/aspel-sync/${customerId}/ejercicio/${year}/cobranza`,
      },
    },
  },
  DynamicReports: {
    base: "dynamic-reports",
    getById: (id: string) => `dynamic-reports/${id}`,
    getByCustomer: (customerId: string) =>
      `dynamic-reports/customer/${customerId}`,
    getTemplates: "dynamic-reports/templates",
    create: "dynamic-reports",
    update: (id: string) => `dynamic-reports/${id}`,
    delete: (id: string) => `dynamic-reports/${id}`,
    execute: "dynamic-reports/execute",
    executeExcel: "dynamic-reports/execute/excel",
    executePdf: "dynamic-reports/execute/pdf",
    livePreview: "dynamic-reports/live-preview",
    Accounts: {
      tree: (customerId: string, year: number, empresa: string) =>
        `dynamic-reports/accounts/${customerId}/${year}/tree?empresa=${empresa}`,
      flat: (customerId: string, year: number, empresa: string) =>
        `dynamic-reports/accounts/${customerId}/${year}?empresa=${empresa}`,
    },
  },
  EspejoAspelFull: {
    get: (customerId: string, year: number, empresa: string) =>
      `espejo-aspel-full?customerId=${customerId}&intYear=${year}&empresa=${empresa}`,
  },
  AutitoriaCuentasAspel: {
    get: (year: number, empresa: string) =>
      `autitoria-cuentas-aspel?intYear=${year}&empresa=${empresa}`,
  },
  AspelCobranza: {
    customers: "aspel-cobranza/customers",
    accounts: (customerId: string, year: number) =>
      `aspel-cobranza/accounts?customerId=${customerId}&year=${year}`,
    // accountsSelect: (customerId: string, year: number) =>
    //   `aspel-cobranza/accounts-select?customerId=${customerId}&year=${year}`,
    estadoCuentaRango: (
      customerId: string,
      numCta: string,
      fechaInicio: string,
      fechaFin: string,
    ) =>
      `aspel-cobranza/estado-cuenta-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    detalleCobranzaRango: (customerId: string, numCta: string) =>
      `aspel-cobranza/detalle-cobranza-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}`,
    // contrapartidasRango: (
    //   customerId: string,
    //   numCta: string,
    //   fechaInicio: string,
    //   fechaFin: string,
    // ) =>
    //   `aspel-cobranza/contrapartidas-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    // pendientesConceptoRango: (
    //   customerId: string,
    //   numCta: string,
    //   fechaInicio: string,
    //   fechaFin: string,
    // ) =>
    //   `aspel-cobranza/pendientes-concepto-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    // avisoCobroPdf: (
    //   customerId: string,
    //   numCta: string,
    //   fechaInicio: string,
    //   fechaFin: string,
    // ) =>
    //   `aspel-cobranza/aviso-cobro-pdf?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    // estadoCuentaPdf: (
    //   customerId: string,
    //   numCta: string,
    //   fechaInicio: string,
    //   fechaFin: string,
    // ) =>
    //   `aspel-cobranza/estado-cuenta-pdf?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    deudasActuales: (customerId: string) =>
      `aspel-cobranza/deudas-actuales?customerId=${customerId}`,
  },
  ContabilidadOnline: {
    askAi: "contabilidad-online/ask-ai",
    askAiContabilidadOnline: "contabilidad-online/ask-ai-contabilidad-online",
    explainAiContabilidadOnline:
      "contabilidad-online/explain-ai-contabilidad-online",
    FinancialStatements: {
      /** EPF compacto: saldo acumulado al cierre del mes. Endpoint principal del componente balance-sheet. */
      epf: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/estado-posicion-financiera/${customerId}/${year}/${mes}`,
      balanceSheet: (customerId: string, year: number) =>
        `contabilidad-online/estado-posicion-financiera/${customerId}/${year}`,
      catalogValidation: (customerId: string, year: number) =>
        `contabilidad-online/validacion-catalogo/${customerId}/${year}`,
      incomeStatement: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/estado-resultados/${customerId}/${year}/${mes}`,
      incomeStatementV2: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/estado-resultados-v2/${customerId}/${year}/${mes}`,
      extraordinaryFeeSchedule: (
        customerId: string,
        year: number,
        mes: number,
      ) =>
        `contabilidad-online/cedula-extraordinaria/${customerId}/${year}/${mes}`,
      budgetVsActual: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/cedula-presupuestal/${customerId}/${year}/${mes}`,
      presupuestoContabilidad: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/presupuesto-contabilidad/${customerId}/${year}/${mes}`,
      financialReport: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/reporte-financiero/${customerId}/${year}/${mes}`,
      cashFlow: (customerId: string, year: number) =>
        `contabilidad-online/flujo-caja/${customerId}/${year}`,
      collectionAnalysis: (customerId: string, year: number, month: number) =>
        `contabilidad-online/analisis-cobranza/${customerId}/${year}/${month}`,
      collectionAnalysisOnline: (
        customerId: string,
        year: number,
        month: number,
        day: number,
      ) =>
        `contabilidad-online/analisis-cobranza-online/${customerId}/${year}/${month}/${day}`,
    },
  },
  ApprovalRules: {
    matrix: "approval-rules/matrix",
  },
  HR: {
    WorkContract: {
      byEmployee: (employeeId: string) =>
        `hr/work-contracts/by-employee/${employeeId}`,
      getAll: "hr/work-contracts",
      getById: (id: string) => `hr/work-contracts/${id}`,
      create: "hr/work-contracts",
      update: (id: string) => `hr/work-contracts/${id}`,
      terminate: (id: string) => `hr/work-contracts/${id}/terminate`,
      delete: (id: string) => `hr/work-contracts/${id}`,
      expiring: (days: number) => `hr/work-contracts/expiring/${days}`,
    },
    ContractTemplate: {
      getAll: "hr/contract-templates",
      getById: (id: string) => `hr/contract-templates/${id}`,
      create: "hr/contract-templates",
      update: (id: string) => `hr/contract-templates/${id}`,
      toggleActive: (id: string) => `hr/contract-templates/${id}/toggle-active`,
      preview: "hr/contract-templates/preview",
      delete: (id: string) => `hr/contract-templates/${id}`,
    },
    ContractAddendum: {
      getAll: "hr/contract-addendums",
      byContract: (contractId: string) =>
        `hr/contract-addendums/by-contract/${contractId}`,
      getById: (id: string) => `hr/contract-addendums/${id}`,
      create: "hr/contract-addendums",
      update: (id: string) => `hr/contract-addendums/${id}`,
      sign: (id: string) => `hr/contract-addendums/${id}/sign`,
      cancel: (id: string) => `hr/contract-addendums/${id}/cancel`,
      delete: (id: string) => `hr/contract-addendums/${id}`,
    },
    AddendumTemplate: {
      getAll: "hr/addendum-templates",
      getById: (id: string) => `hr/addendum-templates/${id}`,
      create: "hr/addendum-templates",
      update: (id: string) => `hr/addendum-templates/${id}`,
      toggleActive: (id: string) => `hr/addendum-templates/${id}/toggle-active`,
      delete: (id: string) => `hr/addendum-templates/${id}`,
    },
    Incident: {
      getAll: (customerId: string) => `hr/incidents?customerId=${customerId}`,
      byEmployee: (employeeId: string, customerId: string) =>
        `hr/incidents/by-employee/${employeeId}/${customerId}`,
      getById: (id: string) => `hr/incidents/${id}`,
      create: "hr/incidents",
      update: (id: string) => `hr/incidents/${id}`,
      resolve: (id: string) => `hr/incidents/${id}/resolve`,
      cancel: (id: string) => `hr/incidents/${id}/cancel`,
      delete: (id: string) => `hr/incidents/${id}`,
      exportPdf: (id: string) => `hr/incidents/${id}/export-pdf`,
      dashboard: (params?: string) =>
        `hr/incidents/dashboard${params ? "?" + params : ""}`,
      attachments: {
        getByIncident: (incidentId: string) =>
          `hr/incidents/${incidentId}/attachments`,
        add: (incidentId: string) => `hr/incidents/${incidentId}/attachments`,
        delete: (attachmentId: string) =>
          `hr/incidents/attachments/${attachmentId}`,
      },
      witnesses: {
        getByIncident: (incidentId: string) =>
          `hr/incidents/${incidentId}/witnesses`,
        getById: (witnessId: string) => `hr/incidents/witnesses/${witnessId}`,
        add: (incidentId: string) => `hr/incidents/${incidentId}/witnesses`,
        update: (witnessId: string) => `hr/incidents/witnesses/${witnessId}`,
        delete: (witnessId: string) => `hr/incidents/witnesses/${witnessId}`,
      },
      suspensionDays: {
        getByIncident: (incidentId: string) =>
          `hr/incidents/${incidentId}/suspension-days`,
        addBulk: (incidentId: string) =>
          `hr/incidents/${incidentId}/suspension-days`,
        delete: (id: string) => `hr/incidents/suspension-days/${id}`,
      },
      generateAct: (incidentId: string) =>
        `hr/incidents/${incidentId}/generate-act`,
      uploadSignedAct: (id: string) => `hr/incidents/${id}/upload-signed-act`,
      signedAct: (id: string) => `hr/incidents/${id}/signed-act`,
    },
    IncidentReport: {
      stats: "hr/incident-report/stats",
      pendingInvestigation: "hr/incident-report/pending-investigation",
      export: "hr/incident-report/export",
    },
    EmployeeFile: {
      getAll: (customerId: string, isActive?: boolean | null) => {
        let url = `hr/employee-files?customerId=${customerId}`;
        if (isActive !== null && isActive !== undefined)
          url += `&isActive=${isActive}`;
        return url;
      },
      summary: (id: string) => `hr/employee-files/${id}/summary`,
      personalData: (id: string) => `hr/employee-files/${id}/personal-data`,
      emergencyContacts: (id: string) =>
        `hr/employee-files/${id}/emergency-contacts`,
      clinicalData: (id: string) => `hr/employee-files/${id}/clinical-data`,
      bankData: (id: string) => `hr/employee-files/${id}/bank-data`,
      contracts: (id: string) => `hr/employee-files/${id}/contracts`,
      workPosition: (id: string) => `hr/employee-files/${id}/work-position`,
      vacationsLeaves: (id: string) =>
        `hr/employee-files/${id}/vacations-leaves`,
      incidents: (id: string) => `hr/employee-files/${id}/incidents`,
      evaluations: (id: string) => `hr/employee-files/${id}/evaluations`,
      requests: (id: string) => `hr/employee-files/${id}/requests`,
    },
    EmployeeBankData: {
      getAll: (customerId: string) => `EmployeeBankData/list/${customerId}`,
      getById: (id: string) => `EmployeeBankData/${id}`,
      upsert: "EmployeeBankData",
      delete: (id: string) => `EmployeeBankData/${id}`,
    },
    LeaveRequest: {
      getAll: "my-leave-requests",
      getById: (id: string) => `my-leave-requests/${id}`,
      getDetail: (id: string) => `my-leave-requests/${id}/detail`,
      create: "my-leave-requests",
      update: (id: string) => `my-leave-requests/${id}`,
      delete: (id: string) => `my-leave-requests/${id}`,
    },
    LeaveRequestApproval: {
      getAll: "leave-request-approvals",
      history: "leave-request-approvals/history",
      historySummary: (employeeId: string) =>
        `leave-request-approvals/${employeeId}/history-summary`,
      overlappingRequests: (
        customerId: string,
        startDate: string,
        endDate: string,
        excludeEmployeeId: string,
      ) =>
        `leave-request-approvals/overlapping-requests?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}&excludeEmployeeId=${excludeEmployeeId}`,
      detail: (id: string) => `leave-request-approvals/${id}/detail`,
      approve: (id: string) => `leave-request-approvals/${id}/approve`,
      reject: (id: string) => `leave-request-approvals/${id}/reject`,
      cancel: (id: string) => `leave-request-approvals/${id}/cancel`,
    },
    VacationRequest: {
      getAll: "my-vacation-requests",
      getById: (id: string) => `my-vacation-requests/${id}`,
      getDetail: (id: string) => `my-vacation-requests/${id}/detail`,
      getBalance: "my-vacation-requests/my-balance",
      getBalanceByYear: (year: number) =>
        `my-vacation-requests/my-balance?year=${year}`,
      availableYears: "my-vacation-requests/available-years",
      create: "my-vacation-requests",
      update: (id: string) => `my-vacation-requests/${id}`,
      delete: (id: string) => `my-vacation-requests/${id}`,
    },
    VacationRequestApproval: {
      getAll: "vacation-request-approvals",
      history: "vacation-request-approvals/history",
      calendarEvents: (year: number, customerId: string, month?: number) =>
        `vacation-request-approvals/calendar-events/${year}/${customerId}${month ? `?month=${month}` : ""}`,
      balance: (employeeId: string | number) =>
        `vacation-request-approvals/${employeeId}/balance`,
      balanceByYear: (employeeId: string | number, year: number) =>
        `vacation-request-approvals/${employeeId}/balance-by-year?year=${year}`,
      availableYears: (employeeId: string | number) =>
        `vacation-request-approvals/${employeeId}/available-years`,
      overlappingRequests: (
        customerId: string,
        startDate: string,
        endDate: string,
        excludeEmployeeId: string,
      ) =>
        `vacation-request-approvals/overlapping-requests?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}&excludeEmployeeId=${excludeEmployeeId}`,
      approve: (id: string) => `vacation-request-approvals/${id}/approve`,
      reject: (id: string) => `vacation-request-approvals/${id}/reject`,
      cancel: (id: string) => `vacation-request-approvals/${id}/cancel`,
    },
    VacationBalanceAdmin: {
      byCustomer: (customerId: string) =>
        `admin/vacation-balances/customer/${customerId}`,
      recalculateAll: (customerId: string) =>
        `admin/vacation-balances/recalculate-all/${customerId}`,
      manualUpdate: "admin/vacation-balances/manual-update",
    },
    PastVacations: {
      create: "past-vacations",
    },
    Sanction: {
      getAll: "hr/sanctions",
      getById: (id: string) => `hr/sanctions/${id}`,
      byEmployee: (employeeId: string, customerId: string) =>
        `hr/sanctions/employee/${employeeId}/${customerId}`,
      expiring: (days: number) => `hr/sanctions/expiring/${days}`,
      create: "hr/sanctions",
      changeStatus: (id: string) => `hr/sanctions/${id}/change-status`,
    },
    Nomina: {
      Periodos: {
        autoCrear: (customerId: string) =>
          `hr/nomina/periodos/auto-crear?customerId=${customerId}`,
        byCustomerAndYear: (customerId: string, anio: number) =>
          `hr/nomina/periodos?customerId=${customerId}&anio=${anio}`,
      },
      Incidencias: {
        list: (periodoNominaId: string) =>
          `hr/nomina/incidencias?periodoNominaId=${periodoNominaId}`,
        create: "hr/nomina/incidencias",
        delete: (id: string) => `hr/nomina/incidencias/${id}`,
        syncVacaciones: "hr/nomina/incidencias/sincronizar-vacaciones",
        syncPermisos: "hr/nomina/incidencias/sincronizar-permisos",
        hoja: "hr/nomina/incidencias/hoja",
        hojaByPeriodo: (periodoId: string) =>
          `hr/nomina/incidencias/hoja/${periodoId}`,
      },
      Generar: {
        nomina: "hr/nomina/generar",
      },
      Prestamos: {
        create: "hr/nomina/prestamos",
      },
      TiempoExtra: {
        create: "hr/nomina/tiempo-extra",
        update: (id: string) => `hr/nomina/tiempo-extra/${id}`,
      },
    },
  },
  Settings: {
    holidaysByYear: (year: number) => `configuracion/dias-festivos/${year}`,
    incidentTypes: "hr/incident-types",
    incidentTypeById: (id: string) => `hr/incident-types/${id}`,
    createIncidentType: "hr/incident-types",
    updateIncidentType: (id: string) => `hr/incident-types/${id}`,
    deleteIncidentType: (id: string) => `hr/incident-types/${id}`,
    toggleIncidentType: (id: string) => `hr/incident-types/${id}/toggle`,
    sanctionTypes: "hr/sanction-types",
    sanctionTypeById: (id: string) => `hr/sanction-types/${id}`,
    createSanctionType: "hr/sanction-types",
    updateSanctionType: (id: string) => `hr/sanction-types/${id}`,
    deleteSanctionType: (id: string) => `hr/sanction-types/${id}`,
    toggleSanctionType: (id: string) => `hr/sanction-types/${id}/toggle`,
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

  // ═══════════════════════════════════════════════════════════════
  // 🏢 ORGANIGRAMA JERÁRQUICO
  // ═══════════════════════════════════════════════════════════════
  OrgChart: {
    getTree: (customerId: string) => `WorkPositionOrgChart/tree/${customerId}`,
    reassign: "WorkPositionOrgChart/reassign",
  },
  Manuals: {
    getTemplates: "manuals/templates",
    getTemplateById: (id: string) => `manuals/templates/${id}`,
    createTemplate: "manuals/templates",
    updateTemplate: (id: string) => `manuals/templates/${id}`,
    updateTemplateItems: (id: string) => `manuals/templates/${id}/items`,
    upsertTemplate: "manuals/templates",
    deleteTemplate: (id: string) => `manuals/templates/${id}`,
    getInstances: (customerId?: string) =>
      customerId
        ? `manuals/instances?customerId=${customerId}`
        : "manuals/instances",
    uploadInstance: "manuals/instances",
    deleteInstance: (id: string) => `manuals/instances/${id}`,
    uploadTemplateAttachment: "manuals/templates/attachments",
    deleteTemplateAttachment: (id: string) =>
      `manuals/templates/attachments/${id}`,
  },
  ManualsPasos: {
    getAll: "manuals",
    getById: (id: string) => `manuals/${id}`,
    create: "manuals",
    update: (id: string) => `manuals/${id}`,
    delete: (id: string) => `manuals/${id}`,
    addPaso: (manualId: string) => `manuals/${manualId}/pasos`,
    updatePaso: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}`,
    deletePaso: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}`,
    reordenarPasos: (manualId: string) => `manuals/${manualId}/pasos/reordenar`,
    subirImagen: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/imagenes`,
    eliminarImagen: (manualId: string, pasoId: string, imagenId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/imagenes/${imagenId}`,
    addEnlace: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/enlaces`,
    deleteEnlace: (manualId: string, pasoId: string, enlaceId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/enlaces/${enlaceId}`,
    addVersion: (manualId: string) => `manuals/${manualId}/versiones`,
    deleteVersion: (manualId: string, versionId: string) =>
      `manuals/${manualId}/versiones/${versionId}`,
    addAdjunto: (manualId: string) => `manuals/${manualId}/adjuntos`,
    deleteAdjunto: (manualId: string, adjuntoId: string) =>
      `manuals/${manualId}/adjuntos/${adjuntoId}`,
    crearDiagrama: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/diagrama`,
    getDiagrama: (diagramaId: string) => `manuals/diagrama/${diagramaId}`,
    updateDiagrama: (diagramaId: string) => `manuals/diagrama/${diagramaId}`,
    deleteDiagrama: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/diagrama`,
  },
  CustomDocuments: {
    getById: (id: string) => `customdocument/${id}`,
    list: (customerId: string, documentType: number) =>
      `customdocument/list/${customerId}/${documentType}`,
    create: "customdocument",
    update: (id: string) => `customdocument/${id}`,
    delete: (id: string) => `customdocument/${id}`,
    updateOrder: "customdocument/update-order",
  },
  PolicyContracts: {
    getById: (id: string | number) => `PolicyContract/${id}`,
    list: (customerId: string, isCurrent: boolean) =>
      `PolicyContract/List/${customerId}/${isCurrent}`,
    create: "PolicyContract",
    update: (id: string | number) => `PolicyContract/${id}`,
    delete: (id: string | number) => `PolicyContract/${id}`,
    deleteDocument: (id: string | number) =>
      `PolicyContract/DeleteDocument/${id}`,
    providersByCustomer: (customerId: string) => `Providers/${customerId}`,
  },
  SpecialDocuments: {
    updateOrder: "special-document/update-order",
  },
} as const;

export const EndpointsSelectItem = {
  SelectItems: {
    accountingCatalogsByCustomer: (customerId: string, _year?: number) =>
      `accounting-catalogs/${customerId}`,
    administracionMinuta: (customerId: string, meetingId: string) =>
      `administration-minutes/${customerId}/${meetingId}`,
    almacenes: (customerId: string) => `almacenes/${customerId}`,
    applicationRoles: "application-roles",
    applicationRolesToAdministrator: "application-roles-to-administrator",
    applicationRolesToProvider: "application-roles-to-provider",
    applicationUserProvider: "application-user-providers",
    applicationUser: "application-users",
    applicationUsersByCustomer: (customerId: string) =>
      `application-users/${customerId}`,
    bank: "banks",
    categories: "categories",
    candidates: "candidates",
    useCFDI: "cfdi-uses",
    comiteMinuta: (customerId: string, meetingId: string) =>
      `committee-minutes/${customerId}/${meetingId}`,
    customersActive: "customers-active",
    customersActiveShortName: "customers-active-short-name",
    employeeActive: (customerId: string) => `employees-active/${customerId}`,
    employeesByUserId: (customerId: string) =>
      `employees-by-user-id/${customerId}`,
    employeesByCustomer: (customerId: string) => `employees/${customerId}`,
    equipmentClassifications: "equipment-classifications",
    equipoClasificacion: "equipment-classifications",
    equipoCalendarioMaestro: "equipo-calendario-maestro",
    performanceEvaluationTemplatesByCustomer: (customerId: string) =>
      `evaluation-templates/${customerId}`,
    fundingPeriod: (customerId: string) => `funding-period/${customerId}`,
    listadoInstalaciones: (customerId: string) =>
      `listado-instalaciones/${customerId}`,
    machineryActiveByCustomer: (customerId: string) =>
      `machineries-active/${customerId}`,
    machineriesAllByCustomer: (customerId: string) =>
      `machineries-all/${customerId}`,
    measurementUnits: "measurement-units",
    nombreCorto: "nombre-corto",
    operationsInterviewersByCustomer: (customerId: string) =>
      `operations-interviewers/${customerId}`,
    paymentMethod: "payment-methods",
    wayToPay: "payment-ways",
    properties: (customerId: string) => `properties/${customerId}`,
    propertyAccounts: (customerId: string, year: number) =>
      `property-accounts/${customerId}/${year}`,
    propertyMembersByCustomer: (customerId: string) =>
      `property-members/${customerId}`,
    requestPositionsPending: "request-positions-pending",
    providers: (customerId: string) => `providers/${customerId}`,
    richProducts: (term: string) => `rich-products?term=${term}`,
    rolesForAnnouncements: "roles-for-announcements",
    supervision: "supervision-list",
    toolsByCustomer: (customerId: string) => `tools/${customerId}`,
    usersByCustomer: (customerId: string) =>
      `users-from-customer/${customerId}`,
  },
} as const;

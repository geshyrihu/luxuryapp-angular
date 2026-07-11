export const EndpointsSystem = {
  AiKnowledgeBase: {
    base: "AiKnowledgeBase",
    delete: (id: string) => `AiKnowledgeBase/${id}`,
    getById: (id: string) => `AiKnowledgeBase/${id}`,
    modules: "AiKnowledgeBase/modules",
  },
  AuditEntries: {
    base: "AuditEntries",
  },
  UserActivityHistory: {
    base: "UserActivityHistory",
  },
  AccessHistory: {
    byCustomerAndRange: (
      customerId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) => `UserActivityHistory?customerId=${customerId}&startDate=${fechaInicial}&endDate=${fechaFinal}`,
  },
  Logs: {
    deleteAll: "Logs/all",
    getAll: "Logs",
  },
  Notifications: {
    getAll: "notifications",
    markAsRead: (notificationId: string) =>
      `Notifications/mark-as-read/${notificationId}`,
    testOneSignal: "notifications/test-one-signal",
    testOneSignalWeb: "notifications/test-one-signal-web",
    testSignalR: (userId: string) => `notifications/test-signal-r/${userId}`,
    testSignalUsers: "notifications/test-signal-users",
    unreadCount: "Notifications/unread-count",
    users: "notifications/users",
  },
  AspelCustomerEmpresa: {
    base: "aspel-customer-empresa",
    delete: (id: string | number) => `aspel-customer-empresa/${id}`,
    getAll: "aspel-customer-empresa",
  },
  AutitoriaCuentasAspel: {
    get: (year: number, empresa: string) =>
      `autitoria-cuentas-aspel?intYear=${year}&empresa=${empresa}`,
  },
  EspejoAspelFull: {
    get: (customerId: string, year: number, empresa: string) =>
      `espejo-aspel-full?customerId=${customerId}&year=${year}&empresa=${empresa}`,
  },
  EmergencyPhones: {
    create: "TelefonosEmergencia",
    delete: (id: string) => `telefonosemergencia/${id}`,
    getAll: "TelefonosEmergencia",
    getById: (id: string | number) => `TelefonosEmergencia/${id}`,
    update: (id: string | number) => `TelefonosEmergencia/${id}`,
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
} as const;

export const EndpointsSystem = {
  AiChat: {
    sessions: "ai-chat/sessions",
    startSession: "ai-chat/start-session",
    history: (sessionId: string) => `ai-chat/history/${sessionId}`,
    sendMessage: "ai-chat/send-message",
  },
  ElevenLabs: {
    settings: "eleven-labs/settings",
    voices: "eleven-labs/voices",
    subscriptionStatus: "eleven-labs/subscription-status",
    textToSpeech: "eleven-labs/text-to-speech",
  },
  AiKnowledgeBase: {
    base: "ai-knowledge-base",
    delete: (id: string) => `ai-knowledge-base/${id}`,
    getById: (id: string) => `ai-knowledge-base/${id}`,
    modules: "ai-knowledge-base/modules",
  },
  AuditEntries: {
    base: "audit-entries",
  },
  UserActivityHistory: {
    base: "user-activity-history",
  },
  AccessHistory: {
    byCustomerAndRange: (
      customerId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) => `user-activity-history?customer-id=${customerId}&start-date=${fechaInicial}&end-date=${fechaFinal}`,
  },
  Logs: {
    deleteAll: "logs/all",
    getAll: "logs",
  },
  AppImplementationTracking: {
    triggerEmployeeValidation:
      "app-implementation-tracking/trigger-employee-validation",
  },
  Notifications: {
    getAll: "notifications",
    markAsRead: (notificationId: string) =>
      `notifications/mark-as-read/${notificationId}`,
    testOneSignal: "notifications/test-one-signal",
    testOneSignalWeb: "notifications/test-one-signal-web",
    testSignalR: (userId: string) => `notifications/test-signal-r/${userId}`,
    testSignalUsers: "notifications/test-signal-users",
    unreadCount: "notifications/unread-count",
    users: "notifications/users",
  },
  AspelCustomerEmpresa: {
    base: "aspel-customer-empresa",
    delete: (id: string | number) => `aspel-customer-empresa/${id}`,
    getAll: "aspel-customer-empresa",
  },
  AutitoriaCuentasAspel: {
    get: (year: number, empresa: string) =>
      `autitoria-cuentas-aspel?int-year=${year}&empresa=${empresa}`,
  },
  EspejoAspelFull: {
    get: (customerId: string, year: number, empresa: string) =>
      `espejo-aspel-full?customer-id=${customerId}&year=${year}&empresa=${empresa}`,
  },
  EmergencyPhones: {
    create: "telefonos-emergencia",
    delete: (id: string) => `telefonos-emergencia/${id}`,
    getAll: "telefonos-emergencia",
    getById: (id: string | number) => `telefonos-emergencia/${id}`,
    update: (id: string | number) => `telefonos-emergencia/${id}`,
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

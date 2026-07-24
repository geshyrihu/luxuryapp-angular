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
  TicketAnalysis: {
    analyzeImage: "ticket-analysis/analyze-image",
  },
  AuditEntries: {
    base: "audit-entries",
  },
  UserActivityHistory: {
    base: "user-activity-history",
    byCustomerAndRange: (
      customerId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) => `user-activity-history?customer-id=${customerId}&start-date=${fechaInicial}&end-date=${fechaFinal}`,
  },
  AccessHistory: {
    // Alias legacy semantico.
    // El ownership canonico de esta consulta corresponde a `EndpointsSystem.UserActivityHistory`.
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
  PaymentMethods: {
    // Legacy alias.
    // El ownership canonico de este catalogo ya corresponde a `EndpointsAdmin.Catalogs.PaymentMethods`.
    create: "payment-methods",
    delete: (id: string) => `payment-methods/${id}`,
    getAll: "payment-methods",
    getById: (id: string) => `payment-methods/${id}`,
    getPdf: (id: string) => `payment-methods/${id}/pdf`,
    update: (id: string) => `payment-methods/${id}`,
  },
  PaymentTypes: {
    // Legacy alias.
    // El ownership canonico de este catalogo ya corresponde a `EndpointsAdmin.Catalogs.PaymentTypes`.
    create: "metodo-pago",
    delete: (id: string) => `metodo-pago/${id}`,
    getAll: "metodo-pago",
    getById: (id: string | number) => `metodo-pago/${id}`,
    update: (id: string | number) => `metodo-pago/${id}`,
  },
} as const;

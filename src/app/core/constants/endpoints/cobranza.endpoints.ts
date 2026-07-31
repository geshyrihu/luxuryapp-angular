const cobranzaLiveEndpoints = {
  accounts: (customerId: string, year: number) =>
    `aspel-cobranza/accounts?customerId=${customerId}&year=${year}`,
  detalleCobranzaRango: (customerId: string, numCta: string) =>
    `aspel-cobranza/detalle-cobranza-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}`,
  deudasActuales: (customerId: string) =>
    `aspel-cobranza/deudas-actuales?customerId=${customerId}`,
  estadoCuentaRango: (
    customerId: string,
    numCta: string,
    fechaInicio: string,
    fechaFin: string,
  ) =>
    `aspel-cobranza/estado-cuenta-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
};

const cobranzaLocalEndpoints = {
  accounts: (customerId: string, year: number) =>
    `cobranza/local/accounts?customerId=${customerId}&year=${year}`,
  detalleCobranzaRango: (customerId: string, numCta: string) =>
    `cobranza/local/detalle-cobranza-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}`,
  deudasActuales: (customerId: string) =>
    `cobranza/local/deudas-actuales?customerId=${customerId}`,
  estadoCuentaRango: (
    customerId: string,
    numCta: string,
    fechaInicio: string,
    fechaFin: string,
  ) =>
    `cobranza/local/estado-cuenta-rango?customerId=${customerId}&numCta=${encodeURIComponent(numCta)}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
  status: (customerId: string, year: number) =>
    `cobranza/local/status?customerId=${customerId}&year=${year}`,
};

const cobranzaSyncEndpoints = {
  completo: (customerId: string, year: number) =>
    `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/completo`,
  contabilidad: (customerId: string, year: number) =>
    `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/contabilidad`,
  cobranza: (customerId: string, year: number) =>
    `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/cobranza`,
};

const cobranzaOnlineEndpoints = {
  Dashboard: {
    get: (customerId: string, year: number, month: number, day?: number) =>
      `cobranza/online/dashboard/customer/${customerId}/year/${year}/month/${month}${day ? "?day=" + day : ""}`,
    analysis: (
      customerId: string,
      year: number,
      month: number,
      day: number,
    ) =>
      `cobranza/online/analysis/customer/${customerId}/year/${year}/month/${month}/day/${day}`,
    inspection: (customerId: string, year: number, month: number) =>
      `cobranza/online/inspection/customer/${customerId}/year/${year}/month/${month}`,
    inspectionHistory: (
      customerId: string,
      year: number,
      accountNumber: string,
    ) =>
      `cobranza/online/inspection-history/customer/${customerId}/year/${year}/account/${encodeURIComponent(accountNumber)}`,
    syncStatus: (customerId: string, year: number) =>
      `cobranza/online/sync-status/customer/${customerId}/year/${year}`,
    excludedAccounts: (customerId: string, year: number) =>
      `cobranza/online/excluded-accounts/customer/${customerId}/year/${year}`,
    updateExcludedAccount: (customerId: string) =>
      `cobranza/online/excluded-accounts/customer/${customerId}`,
  },
  Sync: {
    cobranza: (customerId: string, year: number) =>
      `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/cobranza`,
  },
  Accounts: {
    tree: (customerId: string) =>
      `cobranza/online/accounts/tree/customer/${customerId}`,
  },
  Balances: {
    annual: (customerId: string, year: number) =>
      `cobranza/online/balances/customer/${customerId}/year/${year}`,
  },
  Cartera: {
    get: (customerId: string, year: number) =>
      `cobranza/online/cartera/customer/${customerId}/year/${year}`,
  },
  Movements: {
    get: (customerId: string, year: number) =>
      `cobranza/online/movements/customer/${customerId}/year/${year}`,
  },
  Policies: {
    get: (customerId: string, year: number) =>
      `cobranza/online/policies/customer/${customerId}/year/${year}`,
  },
  Statements: {
    get: (customerId: string, accountId: string, year: number) =>
      `cobranza/online/statements/customer/${customerId}/account/${accountId}/year/${year}`,
    cuentasNivel3: (customerId: string) =>
      `cobranza/online/statements/cuentas-nivel3/customer/${customerId}`,
  },
  ReporteFinanciero: {
    get: (
      customerId: string,
      year: number,
      mesInicio: number,
      mesFin: number,
    ) =>
      `cobranza/online/reporte-financiero/customer/${customerId}/year/${year}/from/${mesInicio}/to/${mesFin}`,
  },
};

const legacyCollectionEndpoints = {
  Dashboard: {
    get: (customerId: string, year: number, month: number) =>
      `cobranza/online/dashboard/customer/${customerId}/year/${year}/month/${month}`,
    syncStatus: (customerId: string, year: number) =>
      `cobranza/online/sync-status/customer/${customerId}/year/${year}`,
  },
  Accounts: cobranzaOnlineEndpoints.Accounts,
  Balances: cobranzaOnlineEndpoints.Balances,
  Cartera: cobranzaOnlineEndpoints.Cartera,
  Movements: cobranzaOnlineEndpoints.Movements,
  Policies: cobranzaOnlineEndpoints.Policies,
  Statements: cobranzaOnlineEndpoints.Statements,
};

const cobranzaNativeEndpoints = {
  ChargeTypes: {
    customer: (customerId: string) =>
      `cobranza/charge-types/customer/${customerId}`,
    getById: (id: string) => `cobranza/charge-types/${id}`,
    create: "cobranza/charge-types",
    update: (id: string) => `cobranza/charge-types/${id}`,
    delete: (id: string) => `cobranza/charge-types/${id}`,
  },
  Charges: {
    customer: (customerId: string) =>
      `cobranza/charges/customer/${customerId}`,
    getById: (id: string) => `cobranza/charges/${id}`,
    create: "cobranza/charges",
    update: (id: string) => `cobranza/charges/${id}`,
    cancel: (id: string) => `cobranza/charges/${id}/cancel`,
    delete: (id: string) => `cobranza/charges/${id}`,
    generateMonthly: (
      customerId?: string,
      month?: number,
      year?: number,
    ) =>
      customerId && month && year
        ? `cobranza/charges/generate-monthly?customerId=${customerId}&month=${month}&year=${year}`
        : "cobranza/charges/generate-monthly",
    calculateLateFees: (customerId?: string) =>
      customerId
        ? `cobranza/charges/calculate-late-fees?customerId=${customerId}`
        : "cobranza/charges/calculate-late-fees",
    bulkImportSaldoInicial: (customerId: string) =>
      `cobranza/charges/bulk-import/saldo-inicial?customerId=${customerId}`,
    initialBalanceStatus: (customerId: string) =>
      `cobranza/charges/initial-balance-status/customer/${customerId}`,
    bulkSetInitialBalance: "cobranza/charges/initial-balance/bulk",
  },
  Templates: {
    customer: (customerId: string) =>
      `cobranza/charge-templates/customer/${customerId}`,
    getById: (id: string) => `cobranza/charge-templates/${id}`,
    create: "cobranza/charge-templates",
    update: (id: string) => `cobranza/charge-templates/${id}`,
    delete: (id: string) => `cobranza/charge-templates/${id}`,
    preview: "cobranza/charge-templates/preview",
    coverage: (customerId: string) =>
      `cobranza/charge-templates/coverage/customer/${customerId}`,
  },
  Payments: {
    customer: (customerId: string) =>
      `cobranza/payments/customer/${customerId}`,
    pendingCharges: (propertyId: string, customerId: string) =>
      `cobranza/payments/pending-charges/property/${propertyId}/customer/${customerId}`,
    getById: (id: string) => `cobranza/payments/${id}`,
    create: "cobranza/payments",
    update: (id: string) => `cobranza/payments/${id}`,
    delete: (id: string) => `cobranza/payments/${id}`,
    cancel: (id: string) => `cobranza/payments/${id}/cancel`,
    applyToCharges: "cobranza/payments/apply-to-charges",
  },
  Statements: {
    get: (propertyId: string, asOf?: string | null) =>
      asOf
        ? `cobranza/statements/${propertyId}?as-of=${encodeURIComponent(asOf)}`
        : `cobranza/statements/${propertyId}`,
    pdf: (propertyId: string, asOf?: string | null) =>
      asOf
        ? `cobranza/statements/${propertyId}/pdf?as-of=${encodeURIComponent(asOf)}`
        : `cobranza/statements/${propertyId}/pdf`,
  },
  Notifications: {
    process: (customerId: string) =>
      `cobranza/notifications/process?customerId=${customerId}`,
    sendStatement: "cobranza/notifications/statements/send",
    sendStatementBatch: "cobranza/notifications/statements/send-batch",
    sendPaymentReceipt: (paymentId: string) =>
      `cobranza/notifications/receipts/${paymentId}/send`,
  },
  NotificationSettings: {
    byCustomer: (customerId: string) =>
      `cobranza/notification-settings/customer/${customerId}`,
    save: "cobranza/notification-settings",
  },
  BillingConfig: {
    customer: (customerId: string) =>
      `cobranza/billing-config/customer/${customerId}`,
    save: "cobranza/billing-config",
  },
  Analytics: {
    metrics: (customerId: string) =>
      `cobranza/metrics/customer/${customerId}?meses=`,
  },
  Reconciliation: {
    unallocated: "cobranza/reconciliations/unallocated",
    autoApplyAll: "cobranza/reconciliations/auto-apply-all",
  },
  LateFeePolicies: {
    customer: (customerId: string) =>
      `cobranza/late-fee-policies/customer/${customerId}`,
    getById: (id: string) => `cobranza/late-fee-policies/${id}`,
    create: "cobranza/late-fee-policies",
    update: (id: string) => `cobranza/late-fee-policies/${id}`,
    delete: (id: string) => `cobranza/late-fee-policies/${id}`,
  },
  PropertyMembers: {
    byId: (id: string) => `cobranza/property-members/${id}`,
    byCustomer: (customerId: string) =>
      `cobranza/property-members/customer/${customerId}`,
    byProperty: (propertyId: string, customerId: string) =>
      `cobranza/property-members/property/${propertyId}/customer/${customerId}`,
    create: "cobranza/property-members",
    createWithAccount: "cobranza/property-members/create-with-account",
    update: (id: string) => `cobranza/property-members/${id}`,
    delete: (id: string) => `cobranza/property-members/${id}`,
    endMembership: (id: string) =>
      `cobranza/property-members/${id}/end-membership`,
    migrateFromLegacy: (customerId: string) =>
      `cobranza/property-members/migrate-from-legacy/customer/${customerId}`,
  },
  RegulationArticles: {
    byCustomer: (customerId: string) =>
      `cobranza/regulation-articles/customer/${customerId}`,
    getById: (id: string) => `cobranza/regulation-articles/${id}`,
    create: "cobranza/regulation-articles",
    update: (id: string) => `cobranza/regulation-articles/${id}`,
    delete: (id: string) => `cobranza/regulation-articles/${id}`,
  },
  PropertyFines: {
    byCustomer: (customerId: string) =>
      `cobranza/property-fines/customer/${customerId}`,
    byProperty: (propertyId: string) =>
      `cobranza/property-fines/property/${propertyId}`,
    getById: (id: string) => `cobranza/property-fines/${id}`,
    create: "cobranza/property-fines",
    update: (id: string) => `cobranza/property-fines/${id}`,
    issueCharge: "cobranza/property-fines/issue-charge",
    void: (id: string, reason: string) =>
      `cobranza/property-fines/${id}/void?reason=${encodeURIComponent(reason)}`,
    addEvidence: (fineId: string) =>
      `cobranza/property-fines/${fineId}/evidences`,
    removeEvidence: (evidenceId: string) =>
      `cobranza/property-fines/evidences/${evidenceId}`,
  },
  Adjustments: {
    create: "cobranza/adjustments",
    createCreditNote: "cobranza/adjustments/credit-notes",
    pendingCreditNotes: (propertyId: string, customerId: string) =>
      `cobranza/adjustments/credit-notes/property/${propertyId}/customer/${customerId}`,
    cancelCreditNote: (id: string) =>
      `cobranza/adjustments/credit-notes/${id}/cancel`,
  },
  FinancialApprovals: {
    create: "cobranza/approvals",
    pending: (customerId: string) =>
      `cobranza/approvals/pending/customer/${customerId}`,
    byProperty: (propertyId: string, customerId: string) =>
      `cobranza/approvals/property/${propertyId}/customer/${customerId}`,
    approve: (id: string) => `cobranza/approvals/${id}/approve`,
    reject: (id: string) => `cobranza/approvals/${id}/reject`,
    cancel: (id: string) => `cobranza/approvals/${id}/cancel`,
  },
  PeriodClosures: {
    byCustomer: (customerId: string) =>
      `cobranza/period-closures/customer/${customerId}`,
    isClosed: (customerId: string, year: number, month: number) =>
      `cobranza/period-closures/customer/${customerId}/${year}/${month}/is-closed`,
    close: (customerId: string) =>
      `cobranza/period-closures/customer/${customerId}/close`,
    reopen: (customerId: string) =>
      `cobranza/period-closures/customer/${customerId}/reopen`,
  },
  Ledger: {
    propertyBalance: (propertyId: string, customerId: string) =>
      `cobranza/ledger/property/${propertyId}/customer/${customerId}/balance`,
    propertyEntries: (propertyId: string, customerId: string) =>
      `cobranza/ledger/property/${propertyId}/customer/${customerId}/entries`,
    chargeBalance: (chargeId: string) => `cobranza/ledger/charge/${chargeId}/balance`,
    batchEntries: (batchId: string) => `cobranza/ledger/batch/${batchId}`,
    checkIntegrity: (customerId: string) =>
      `cobranza/ledger/integrity/customer/${customerId}`,
  },
  CollectionCases: {
    byCustomer: (customerId: string) =>
      `cobranza/collection-cases/customer/${customerId}`,
    getById: (id: string) => `cobranza/collection-cases/${id}`,
    create: "cobranza/collection-cases",
    update: (id: string) => `cobranza/collection-cases/${id}`,
    logActivity: (id: string) => `cobranza/collection-cases/${id}/activity`,
    evaluateAndEscalate: (customerId: string) =>
      `cobranza/collection-cases/evaluate-and-escalate/${customerId}`,
  },
  Invoices: {
    byCharge: (chargeId: string) => `cobranza/invoices/charge/${chargeId}`,
    getById: (id: string) => `cobranza/invoices/${id}`,
    generate: "cobranza/invoices",
    cancel: (id: string) => `cobranza/invoices/${id}/cancel`,
  },
  FinancialAudit: {
    byCustomer: (customerId: string) =>
      `cobranza/audit-logs/customer/${customerId}`,
    byProperty: (propertyId: string, customerId: string) =>
      `cobranza/audit-logs/property/${propertyId}/customer/${customerId}`,
  },
  Automation: {
    generateMonthlyCharges: (
      customerId?: string,
      month?: number,
      year?: number,
    ) =>
      cobranzaNativeEndpoints.Charges.generateMonthly(
        customerId,
        month,
        year,
      ),
    calculateLateFees: (customerId: string) =>
      `cobranza/charges/calculate-late-fees?customerId=${customerId}`,
    processNotifications: (customerId: string) =>
      `cobranza/notifications/process?customerId=${customerId}`,
    evaluateCollectionCases: (customerId: string) =>
      `cobranza/collection-cases/evaluate-and-escalate/${customerId}`,
    autoReconcile: "cobranza/reconciliations/auto-apply-all",
  },
};

const accountingCoiEndpoints = {
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
      update: (id: string) => `accounting-coi/accounting/fiscal-periods/${id}`,
      delete: (id: string) => `accounting-coi/accounting/fiscal-periods/${id}`,
    },
  },
  Configuration: {
    AspelSync: cobranzaSyncEndpoints,
  },
  Migration: {
    syncCoi: cobranzaSyncEndpoints.contabilidad,
    syncCobranza: cobranzaSyncEndpoints.cobranza,
  },
};

export const EndpointsCobranza = {
  // Canonico: familia principal del dominio Cobranza.
  // Toda nueva capacidad funcional del bloque nativo debe crecer aqui.
  CobranzaCore: cobranzaNativeEndpoints,

  // Subdominio operativo vigente.
  // Se mantiene mientras cerramos el dictamen fino de `cobranza/online`.
  CobranzaSync: cobranzaSyncEndpoints,
  CobranzaOnline: cobranzaOnlineEndpoints,

  // Legacy temporal / compatibilidad interna.
  // No deben crecer y deben desaparecer conforme se migren consumidores.
  CobranzaNative: cobranzaNativeEndpoints,
  LegacyCollection: legacyCollectionEndpoints,
  NativeCollection: cobranzaNativeEndpoints,

  // Legacy operativo.
  // Siguen vivos por compatibilidad funcional e integraciones existentes.
  CobranzaLive: cobranzaLiveEndpoints,
  CobranzaLocal: cobranzaLocalEndpoints,

  // Compatibilidad historica protegida.
  // No son nombres objetivo de arquitectura.
  AspelCobranza: cobranzaLiveEndpoints,
  AspelCobranzaLocal: cobranzaLocalEndpoints,

  // Alias temporal. La propiedad canonica ya vive en Contabilidad.
  // No debe crecer desde el dominio Cobranza.
  AccountingCoi: accountingCoiEndpoints,
} as const;

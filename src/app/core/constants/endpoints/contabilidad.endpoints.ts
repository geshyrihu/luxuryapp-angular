const budgetProposalEndpoints = {
  audit: "budget-proposal/audit",
  byCustomerYear: (customerId: string, fiscalYear: number) =>
    `budget-proposal?customerId=${customerId}&fiscalYear=${fiscalYear}`,
  forecast: "budget-proposal/forecast",
  updateItem: (itemId: string) => `budget-proposal/${itemId}`,
  historyByItem: (itemId: string) => `budget-proposal/history/${itemId}`,
  availableAccounts: (
    customerId: string,
    fiscalYear: number,
    proposalId: string,
  ) =>
    `budget-proposal/available-accounts/${customerId}/${fiscalYear}/${proposalId}`,
  addAccounts: (proposalId: string) =>
    `budget-proposal/${proposalId}/add-accounts`,
  feeComparison: (proposalId: string) =>
    `budget-proposal/${proposalId}/fee-comparison`,
  feeComparisonByIndiviso: (proposalId: string) =>
    `budget-proposal/${proposalId}/fee-comparison-by-indiviso`,
};

const budgetProposalSupportEndpoints = {
  byItem: (itemId: string) => `budget-proposal-item-support/${itemId}`,
  updateSupportInfo: (itemId: string) =>
    `budget-proposal-item-support/${itemId}/support-info`,
  uploadFiles: "budget-proposal-item-support/support-files",
  deleteSupportFile: (fileId: string) =>
    `budget-proposal-item-support/support-file/${fileId}`,
};

// Legacy namespace:
// `AccountingCoi` sobrevive por compatibilidad documental e historica.
// No existe hoy un dominio backend canonico `api/accounting-coi/...` detectado en `MapGroup`.
// Los contratos backend activos ya viven en familias dueñas como:
// - `ContabilidadOnline`
// - `AccountingAccounts`
// - `CobranzaSync`
// - `CobranzaCore` / `CobranzaOnline`
// Evitar usar este arbol en desarrollo nuevo si existe una familia canonica.
const accountingCoiEndpoints = {
  // Legacy fuerte:
  // Este subarbol modela contratos historicos `accounting-coi/accounting/...`.
  // Hoy no se detectan consumidores frontend directos ni `MapGroup` backend activos equivalentes.
  // Conservar solo mientras se completa la conciliacion de menus, metadata y documentacion antigua.
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
    AspelSync: {
      // Alias legacy: el backend activo hoy publica esta sincronizacion en `cobranza/online/aspel-sync/...`.
      // Aunque sobreviven clases fisicas `Coi*` en backend, el ownership publico vigente es `Cobranza`.
      completo: (customerId: string, year: number) =>
        `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/completo`,
      contabilidad: (customerId: string, year: number) =>
        `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/contabilidad`,
      cobranza: (customerId: string, year: number) =>
        `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/cobranza`,
    },
  },
  Migration: {
    // Alias legacy: mantener solo mientras existan referencias historicas a `accounting-coi`.
    // Desarrollo nuevo debe consumir `Endpoints.CobranzaSync`.
    syncCoi: (customerId: string, year: number) =>
      `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/contabilidad`,
    syncCobranza: (customerId: string, year: number) =>
      `cobranza/online/aspel-sync/${customerId}/ejercicio/${year}/cobranza`,
  },
};

export const EndpointsContabilidad = {
  AccountingAccounts: {
    base: "cuentas",
    delete: (id: string | number) => `cuentas/${id}`,
    getById: (id: string | number) => `cuentas/${id}`,
    getList: (state: boolean) => `cuentas/get-list/${state ? 0 : 1}`,
  },
  AccountingCatalog: {
    byCustomerYear: (customerId: string, year: number) =>
      `accounting-catalog/customer/${customerId}?year=${year}`,
  },

  ContabilidadOnline: {
    FinancialStatements: {
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
      bancosInversiones: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/bancos-inversiones/${customerId}/${year}/${mes}`,
      fondoReserva: (customerId: string, year: number, mes: number) =>
        `contabilidad-online/fondo-reserva/${customerId}/${year}/${mes}`,
      proyectosAprobados: (customerId: string, year: number) =>
        `contabilidad-online/proyectos-aprobados/${customerId}/${year}`,
      cashFlow: (customerId: string, year: number) =>
        `contabilidad-online/flujo-caja/${customerId}/${year}`,
      collectionAnalysis: (customerId: string, year: number, month: number) =>
        `contabilidad-online/analisis-cobranza/${customerId}/${year}/${month}`,
      collectionAnalysisOnline: (customerId: string, year: number, month: number, day: number) =>
        `contabilidad-online/analisis-cobranza-online/${customerId}/${year}/${month}/${day}`,
      debugRawAspelData: (customerId: string, year: number) =>
        `contabilidad-online/debug-raw-aspel-data/${customerId}/${year}`,
    },
    askAi: "contabilidad-online/ask-ai",
    askAiContabilidadOnline: "contabilidad-online/ask-ai-contabilidad-online",
    explainAiContabilidadOnline: "contabilidad-online/explain-ai-contabilidad-online",
  },
  Presupuestos: {
    analyze: "presupuesto/analyze",
    aspel: (customerId: string, intYear: number) =>
      `presupuesto/aspel?customerId=${customerId}&intYear=${intYear}`,
    aspelFull: (customerId: string, intYear: number) =>
      `presupuesto/aspel-full?customerId=${customerId}&intYear=${intYear}`,
    aspelSummary: (customerId: string, intYear: number) =>
      `presupuesto/aspel-summary?customerId=${customerId}&intYear=${intYear}`,
    presupuestoLimpioEjercicioFiscal: (customerId: string, intYear: number) =>
      `presupuesto/presupuesto-limpio-ejercicio-fiscal?customerId=${customerId}&intYear=${intYear}`,
    presupuestoLimpioCobranza: (customerId: string, intYear: number) =>
      `presupuesto/presupuesto-limpio-cobranza?customerId=${customerId}&intYear=${intYear}`,
    create: "presupuesto/create",
    toPurchaseOrder: (customerId: string, ordenCompraId: string, year: number) =>
      `presupuesto/to-purchase-order/${customerId}/${ordenCompraId}/${year}`,
    update: (id: string) => `presupuesto/update-presupuesto/${id}`,
  },
  CedulaPresupuestal: {
    delete: (id: string | number) => `cedula-presupuestal/${id}`,
    list: (periodoPresupuestalId: string | number) =>
      `cedula-presupuestal/list/${periodoPresupuestalId}`,
    ordenesCompra: (id: string | number) =>
      `cedula-presupuestal/ordenes-compra/${id}`,
  },
  CatalogoGastosFijos: {
    base: "catalogo-gastos-fijos",
    create: "catalogo-gastos-fijos",
    delete: (id: string) => `catalogo-gastos-fijos/${id}`,
    getById: (id: string) => `catalogo-gastos-fijos/${id}`,
    list: (customerId: string) => `catalogo-gastos-fijos/list/${customerId}`,
    update: (id: string) => `catalogo-gastos-fijos/${id}`,
    updateValidation: (id: string, value: boolean) =>
      `catalogo-gastos-fijos/update-validation/${id}/${value}`,
    generatePurchaseOrders: (
      customerId: string,
      quincenaIndex: number,
      fundingYear: number,
      fundingPeriodId: string | number,
    ) =>
      `orden-compra/generar-orden-compra-fijos/${customerId}/${quincenaIndex}/${fundingYear}/${fundingPeriodId}`,
  },
  ProjectedExpenses: {
    base: "projected-expenses",
    create: "projected-expenses",
    recurrence: "projected-expenses/recurrence",
    list: (customerId: string) => `projected-expenses/${customerId}`,
    getById: (customerId: string, id: string) =>
      `projected-expenses/${customerId}/${id}`,
    update: (customerId: string, id: string) =>
      `projected-expenses/${customerId}/${id}`,
    delete: (customerId: string, id: string) =>
      `projected-expenses/${customerId}/${id}`,
  },
  CatalogoGastosFijosPresupuesto: {
    base: "catalogo-gastos-fijos-presupuesto",
    create: "catalogo-gastos-fijos-presupuesto",
    delete: (id: string) => `catalogo-gastos-fijos-presupuesto/${id}`,
    update: (id: string) => `catalogo-gastos-fijos-presupuesto/${id}`,
    fixedExpensesCatalog: (customerId: string, fiscalYear: number) =>
      `presupuesto/fixed-expenses-catalog/${customerId}/${fiscalYear}`,
    purchaseOrderBudget: (catalogoGastosFijosId: string) =>
      `catalogo-gastos-fijos-presupuesto/presupuesto-orden-compra-fijos/${catalogoGastosFijosId}`,
  },
  CatalogoGastosFijosDetalles: {
    base: "catalogo-gastos-fijos-detalles",
    delete: (id: string) => `catalogo-gastos-fijos-detalles/${id}`,
    products: (catalogoGastosFijosId: string) =>
      `catalogo-gastos-fijos-detalles/products/${catalogoGastosFijosId}`,
    purchaseOrderDetails: (catalogoGastosFijosId: string) =>
      `catalogo-gastos-fijos-detalles/detalles-orden-compra-fijos/${catalogoGastosFijosId}`,
    update: (id: string) => `catalogo-gastos-fijos-detalles/${id}`,
  },
  Funding: {
    confirm: (id: string) => `funding/confirm/${id}`,
    create: "funding",
    createOutsideProcessPurchaseOrder: "orden-compra/fuera-fondeo",
    details: (id: string, customerId: string) => `funding/details/${id}/${customerId}`,
    downloadBulkInvoicesZip: "funding/download-bulk-invoices-zip",
    delete: (id: string) => `funding/${id}`,
    deleteDetail: (id: string) => `funding/detail/${id}`,
    complete: (id: string) => `funding/completed/${id}`,
    createOrdersFromInvoices: "funding/create-orders-from-invoices",
    getById: (id: string) => `funding/${id}`,
    list: (customerId: string) => `funding/list/${customerId}`,
    listAccounting: (customerId: string) => `funding-accounting/list/${customerId}`,
    period: (customerId: string) => `funding-period/${customerId}`,
    analyzeInvoices: (customerId: string, fundingId: string) =>
      `funding/analyze-invoices/${customerId}?fundingId=${fundingId}`,
    purchaseHistory: (
      customerId: string,
      fiscalYear: number,
      accountNumber: string,
    ) => `funding/purchase-history/${customerId}/${fiscalYear}/${accountNumber}`,
    purchaseDetails: (ordenCompraId: string) => `funding/purchase-details/${ordenCompraId}`,
    removeOutsideProcessPurchaseOrder: (ordenCompraId: string) =>
      `orden-compra/${ordenCompraId}/fuera-fondeo`,
    revokeComplete: (id: string) => `funding/revert-complete/${id}`,
    revokeConfirmation: (id: string) => `funding/revoke-confirmation/${id}`,
    unauthorize: (id: string) => `funding/unauthorize/${id}`,
    unvalidate: (id: string) => `funding/unvalidate/${id}`,
    updateOrder: "funding/update-order",
    updatePurchasePaidStatus: (ordenId: string) => `funding/update-purchase-paid-status/${ordenId}`,
    validate: (id: string) => `funding/validate/${id}`,
    authorize: (id: string) => `funding/authorize/${id}`,
  },
  SatFunding: {
    details: (id: string) => `SatFunding/${id}`,
    forCustomer: (customerId: string) => `SatFunding/ForCustomer/${customerId}`,
    bulkUpdateTipoGasto: "sat-funding/bulk-update-tipo-gasto",
    requestDownload: "sat-funding/request-download",
    updateDetail: "sat-funding/update-detail",
    updateOrder: "sat-funding/update-order",
  },
  SatReconciliation: {
    requestCfdi: "sat-reconciliation/request-cfdi",
    requestLegacy: "sat-reconciliation/request-legacy",
    downloadCfdi: "sat-reconciliation/download-cfdi",
    processLegacy: "sat-reconciliation/process-legacy",
  },
  FundingFiles: {
    downloadZip: "funding-file/download-zip",
    invoicesZip: (id: string) => `funding-file/invoices/${id}`,
    pdf: (id: string) => `funding-file/pdf/${id}`,
    solicitudesPago: "funding-file/solicitudes-pago",
  },
  DynamicReports: {
    Accounts: {
      tree: (customerId: string, year: number, empresa: string) =>
        `dynamic-reports/accounts/${customerId}/${year}/tree?empresa=${empresa}`,
      flat: (customerId: string, year: number, empresa: string) =>
        `dynamic-reports/accounts/${customerId}/${year}?empresa=${empresa}`,
    },
    create: "dynamic-reports",
    delete: (id: string) => `dynamic-reports/${id}`,
    execute: "dynamic-reports/execute",
    executeExcel: "dynamic-reports/execute/excel",
    executePdf: "dynamic-reports/execute/pdf",
    getByCustomer: (customerId: string) => `dynamic-reports/customer/${customerId}`,
    getById: (id: string) => `dynamic-reports/${id}`,
    getTemplates: "dynamic-reports/templates",
    livePreview: "dynamic-reports/live-preview",
    update: (id: string) => `dynamic-reports/${id}`,
  },
  FinancialReports: {
    createPeriod: "financial-report/create-period",
    annualShippingReport: (year: number) =>
      `financial-report/reporte-envio-anual/${year}`,
    monthlyShippingReport: (periodo: string) =>
      `financial-report/reporteenviomensual/${periodo}`,
    owners: (customerId: string) => `financial-report/propietarios/${customerId}`,
    authorize: (id: string, applicationUserId: string) =>
      `financial-report/authorize/${id}/${applicationUserId}`,
    deauthorize: (id: string) => `financial-report/desauthorize/${id}`,
    send: (id: string, applicationUserId: string) =>
      `financial-report/send/${id}/${applicationUserId}`,
    toCustomer: (customerId: string) => `financial-report/to-customer/${customerId}/`,
    uploadFile: (id: string, applicationUserId: string) =>
      `financial-report/upload-file/${id}/${applicationUserId}`,
  },
  BudgetAccountRules: {
    byCustomerId: (customerId: string) => `budget-account-rules/${customerId}`,
  },
  BudgetProposalItems: {
    delete: (itemId: string) => `budget-proposal/item/${itemId}`,
  },
  ContabilidadMinuta: {
    pendingList: (applicationUserId: string, status: number | null) =>
      `contabilidad-minuta/lista-minuta/${applicationUserId}/${status ?? 0}`,
    pendingPdf: (status: number | null) =>
      `contabilidad-minuta/Pendientes/${status ?? 0}`,
    followUps: (id: string | number) =>
      `contabilidad-minuta/lista-seguimientos/${id}`,
    deleteFollowUp: (id: string | number) => `meeting-details-seguimientos/${id}`,
  },
  // Legacy documental / compatibilidad.
  // No debe crecer desde Contabilidad si existe una familia canonica real.
  AccountingCoi: accountingCoiEndpoints,
  BudgetingProposal: budgetProposalEndpoints,
  BudgetingProposalSupport: budgetProposalSupportEndpoints,
  BudgetProposal: budgetProposalEndpoints,
  BudgetProposalItemSupport: budgetProposalSupportEndpoints,
} as const;

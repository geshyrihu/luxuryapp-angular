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

export const EndpointsContabilidad = {
  AccountingAccounts: {
    base: "cuentas",
    delete: (id: string | number) => `cuentas/${id}`,
    getById: (id: string | number) => `cuentas/${id}`,
    getList: (state: boolean) => `cuentas/get-list/${state ? 0 : 1}`,
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
  CatalogoGastosFijosDetalles: {
    base: "catalogo-gastos-fijos-detalles",
    delete: (id: string) => `catalogo-gastos-fijos-detalles/${id}`,
  },
  Funding: {
    delete: (id: string) => `funding/${id}`,
    deleteDetail: (id: string) => `funding/detail/${id}`,
    list: (customerId: string) => `funding/list/${customerId}`,
  },
  SatFunding: {
    updateOrder: "sat-funding/update-order",
  },
  SatReconciliation: {
    requestCfdi: "sat-reconciliation/request-cfdi",
    requestLegacy: "sat-reconciliation/request-legacy",
    downloadCfdi: "sat-reconciliation/download-cfdi",
    processLegacy: "sat-reconciliation/process-legacy",
  },
  FundingFiles: {
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
  BudgetingProposal: budgetProposalEndpoints,
  BudgetingProposalSupport: budgetProposalSupportEndpoints,
  BudgetProposal: budgetProposalEndpoints,
  BudgetProposalItemSupport: budgetProposalSupportEndpoints,
  RefactorContabilidad: {
    catalogogastosfijosById: (id: any) => `catalogo-gastos-fijos/${id}`,
    projectedExpensesByIdById: (customerIdS: any, id: any) => `projected-expenses/${customerIdS}/${id}`,
    projectedExpensesRecurrence: "projected-expenses/recurrence",
    projectedExpenses: "projected-expenses",
    projectedExpensesById: (customerIdS: any) => `projected-expenses/${customerIdS}`,
    catalogoGastosFijosPresupuestoById: (id: any) => `catalogo-gastos-fijos-presupuesto/${id}`,
    catalogoGastosFijosDetallesById: (p0: any) => `catalogo-gastos-fijos-detalles/${p0}`,
    ordenCompraFueraFondeo: "orden-compra/fuera-fondeo",
    ordenCompraByIdFueraFondeo: (ordenCompraId: any) => `orden-compra/${ordenCompraId}/fuera-fondeo`,
    fundingUpdateOrder: "funding/update-order",
    funding: "funding",
    fundingDownloadBulkInvoicesZip: "funding/download-bulk-invoices-zip",
    fundingCreateOrdersFromInvoices: "funding/create-orders-from-invoices",
    satFundingRequestDownload: "sat-funding/request-download",
    satFundingBulkUpdateTipoGasto: "sat-funding/bulk-update-tipo-gasto",
    satFundingUpdateDetail: "sat-funding/update-detail",
    financialReportUploadFileByIdById: (id: any, authS: any) => `financial-report/upload-file/${id}/${authS}`,
    financialReportAuthorizeByIdById: (id: any, authS: any) => `financial-report/authorize/${id}/${authS}`,
    financialReportDesauthorizeById: (id: any) => `financial-report/desauthorize/${id}`,
    financialReportSendByIdById: (p0: any, authS: any) => `financial-report/send/${p0}/${authS}`,
    contabilidadMinutaListaMinutaByIdById: (authS: any, statusFiltroControl: any) => `contabilidad-minuta/lista-minuta/${authS}/${statusFiltroControl}`,
    contabilidadMinutaListaSeguimientosById: (id: any) => `contabilidad-minuta/lista-seguimientos/${id}`,
    meetingDertailsSeguimientoById: (id: any) => `meeting-details-seguimientos/${id}`,
    budgetProposalItemSupportSupportFileById: (fileId: any) => `budget-proposal-item-support/support-file/${fileId}`,
    budgetProposalItemById: (p0: any) => `budget-proposal/item/${p0}`,
    financialReportReporteEnvioAnualById: (selectedYear: any) => `financial-report/reporte-envio-anual/${selectedYear}`,
      catalogoGastosFijosById: (id: any) => `catalogo-gastos-fijos/${id}`,
    catalogoGastosFijosListById: (customerIdS: any) => `catalogo-gastos-fijos/list/${customerIdS}`,
    catalogoGastosFijosUpdateValidationByIdById: (id: any, value: any) => `catalogo-gastos-fijos/update-validation/${id}/${value}`,
    ordenCompraGenerarOrdenCompraFijosByIdByIdByIdById: (customerIdS: any, quincenaIndex: any, fundingYear: any, fundingPeriodId: any) => `orden-compra/generar-orden-compra-fijos/${customerIdS}/${quincenaIndex}/${fundingYear}/${fundingPeriodId}`,
    presupuestoFixedExpensesCatalogByIdById: (customerIdS: any, intYear: any) => `presupuesto/fixed-expenses-catalog/${customerIdS}/${intYear}`,
    catalogoGastosFijosPresupuesto: "catalogo-gastos-fijos-presupuesto",
    catalogoGastosFijosPresupuestoPresupuestoOrdenCompraFijosById: (catalogoGastosFijosId: any) => `catalogo-gastos-fijos-presupuesto/presupuesto-orden-compra-fijos/${catalogoGastosFijosId}`,
    catalogoGastosFijosDetallesDetallesOrdenCompraFijosById: (catalogoGastosFijosId: any) => `catalogo-gastos-fijos-detalles/detalles-orden-compra-fijos/${catalogoGastosFijosId}`,
    catalogoGastosFijosDetallesProductsById: (catalogoGastosFijosId: any) => `catalogo-gastos-fijos-detalles/products/${catalogoGastosFijosId}`,
    fundingDetailsByIdById: (id: any, customerId: any) => `funding/details/${id}/${customerId}`,
    fundingValidateById: (id: any) => `funding/validate/${id}`,
    fundingAuthorizeById: (id: any) => `funding/authorize/${id}`,
    fundingUnvalidateById: (id: any) => `funding/unvalidate/${id}`,
    fundingUnauthorizeById: (id: any) => `funding/unauthorize/${id}`,
    fundingConfirmById: (id: any) => `funding/confirm/${id}`,
    fundingRevokeConfirmationById: (id: any) => `funding/revoke-confirmation/${id}`,
    fundingUpdatePurchasePaidStatusById: (ordenId: any) => `funding/update-purchase-paid-status/${ordenId}`,
    fundingfilePdfById: (id: any) => `funding-file/pdf/${id}`,
    fundingPeriodById: (customerIdS: any) => `funding-period/${customerIdS}`,
    fundingListById: (customerIdS: any) => `funding/list/${customerIdS}`,
    fundingPurchaseDetailsById: (ordenCompraId: any) => `funding/purchase-details/${ordenCompraId}`,
    fundingfileInvoicesById: (id: any) => `funding-file/invoices/${id}`,
    fundingCompletedById: (id: any) => `funding/completed/${id}`,
    fundingRevertCompleteById: (id: any) => `funding/revert-complete/${id}`,
    fundingaccountingListById: (customerIdS: any) => `funding-accounting/list/${customerIdS}`,
    accountingCatalogCustomeryear: (customerId: any, currentYear: any) => `accounting-catalog/customer/${customerId}?year=${currentYear}`,
    financialReportToCustomerById: (customerIdS: any) => `financial-report/to-customer/${customerIdS}/`,
    budgetAccountRulesById: (customerIdToLoad: any) => `budget-account-rules/${customerIdToLoad}`,
},
} as const;

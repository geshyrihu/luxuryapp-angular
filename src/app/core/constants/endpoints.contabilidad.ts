export const EndpointsContabilidad = {
  AccountingAccounts: {
    base: "Cuentas",
    delete: (id: string | number) => `cuentas/${id}`,
    getById: (id: string | number) => `Cuentas/${id}`,
    getList: (state: boolean) => `Cuentas/GetList/${state ? 0 : 1}`,
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
    create: "Presupuesto/Create",
    toPurchaseOrder: (customerId: string, ordenCompraId: string, year: number) =>
      `presupuesto/to-purchase-order/${customerId}/${ordenCompraId}/${year}`,
    update: (id: string) => `Presupuesto/UpdatePresupuesto/${id}`,
  },
  CedulaPresupuestal: {
    delete: (id: string | number) => `CedulaPresupuestal/${id}`,
    list: (periodoPresupuestalId: string | number) =>
      `CedulaPresupuestal/List/${periodoPresupuestalId}`,
    ordenesCompra: (id: string | number) =>
      `CedulaPresupuestal/OrdenesCompra/${id}`,
  },
  CatalogoGastosFijosDetalles: {
    base: "CatalogoGastosFijosDetalles",
    delete: (id: string) => `CatalogoGastosFijosDetalles/${id}`,
  },
  Funding: {
    delete: (id: string) => `funding/${id}`,
    deleteDetail: (id: string) => `funding/detail/${id}`,
    list: (customerId: string) => `Funding/list/${customerId}`,
  },
  SatFunding: {
    updateOrder: "SatFunding/UpdateOrder",
  },
  SatReconciliation: {
    requestCfdi: "satreconciliation/RequestCfdi",
    requestLegacy: "satreconciliation/RequestLegacy",
    downloadCfdi: "satreconciliation/DownloadCfdi",
    processLegacy: "satreconciliation/ProcessLegacy",
  },
  FundingFiles: {
    solicitudesPago: "FundingFile/solicitudes-pago",
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
} as const;

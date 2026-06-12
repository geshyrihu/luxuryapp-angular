/**
 * Endpoints para el proyecto de Tenant/Aplicaci�n.
 */
export const EndpointsTenant = {

  AccountingAccounts: {
    base: "Cuentas",
    delete: (id: string | number) => `cuentas/${id}`,
    getById: (id: string | number) => `Cuentas/${id}`,
    getList: (state: boolean) => `Cuentas/GetList/${state ? 0 : 1}`,
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
        inspectionHistory: (customerId: string, year: number, accountNumber: string) =>
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
    Migration: {
      syncCoi: (customerId: string, year: number) =>
        `accounting-coi/migration/coi/sync-aspel/${customerId}/ejercicio/${year}`,
      syncCobranza: (customerId: string, year: number) =>
        `accounting-coi/migration/legacy-collection/sync-aspel/${customerId}/ejercicio/${year}`,
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
          `accounting-coi/native-fee-policies/${id}`,
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
      Demo: {
        showcaseData: "accounting-coi/native-collection/demo/showcase-data",
        triggerAction: "accounting-coi/native-collection/demo/trigger-action",
        seedSandbox: (customerId: string) =>
          `accounting-coi/native-collection/demo/seed-sandbox/${customerId}`,
      },
    },
  },
  AiAssistant: {
    testProfile: "AiAssistant/TestProfile",
  },
  Announcements: {
    adminList: "announcements/admin-list",
    analytics: (id: string) => `announcements/${id}/analytics`,
    create: "announcements",
    delete: (id: string) => `announcements/${id}`,
    downloadPdf: (id: string) => `announcements/${id}/pdf`,
    getById: (id: string) => `announcements/${id}`,
    update: (id: string) => `announcements/${id}`,
  },
  ApprovalRules: {
    matrix: "approval-rules/matrix",
  },
  AspelCobranza: {
    accounts: (customerId: string, year: number) =>
      `aspel-cobranza/accounts?customerId=${customerId}&year=${year}`,
    detalleCobranzaRango: (customerId: string, numCta: string) =>
      `aspel-cobranza/detalle-cobranza-rango?customerId=${customerId}&numCta=${numCta}`,
    deudasActuales: (customerId: string) =>
      `aspel-cobranza/deudas-actuales?customerId=${customerId}`,
    estadoCuentaRango: (
      customerId: string,
      numCta: string,
      fechaInicio: string,
      fechaFin: string,
    ) =>
      `aspel-cobranza/estado-cuenta-rango?customerId=${customerId}&numCta=${numCta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
  },
  AutitoriaCuentasAspel: {
    get: (year: number, empresa: string) =>
      `autitoria-cuentas-aspel?intYear=${year}&empresa=${empresa}`,
  },
  AsambleaChecklist: {
    bySession: (sessionId: string) => `AsambleaChecklist/session/${sessionId}`,
    updateStatus: (id: string) => `AsambleaChecklist/${id}/status`,
  },
  AsambleaChecklistTemplate: {
    create: "AsambleaChecklistTemplate",
    delete: (id: string) => `AsambleaChecklistTemplate/${id}`,
    getAll: "AsambleaChecklistTemplate",
    getById: (id: string) => `AsambleaChecklistTemplate/${id}`,
    update: (id: string) => `AsambleaChecklistTemplate/${id}`,
  },
  CedulaPresupuestal: {
    delete: (id: string | number) => `CedulaPresupuestal/${id}`,
    list: (periodoPresupuestalId: string | number) =>
      `CedulaPresupuestal/List/${periodoPresupuestalId}`,
    ordenesCompra: (id: string | number) =>
      `CedulaPresupuestal/OrdenesCompra/${id}`,
  },
  CalendarioMaestroEquipo: {
    base: "CalendarioMaestroEquipo",
    delete: (id: string | number) => `CalendarioMaestroEquipo/${id}`,
    getById: (id: string) => `CalendarioMaestroEquipo/${id}`,
  },
  CatalogAssets: {
    create: "CatalogAsset",
    delete: (id: string | number) => `CatalogAsset/${id}`,
    getAll: "CatalogAsset",
    getById: (id: string) => `CatalogAsset/${id}`,
    update: (id: string) => `CatalogAsset/${id}`,
  },
  CommitteeVigilance: {
    create: "ComiteVigilancia",
    delete: (id: string) => `comitevigilancia/${id}`,
    getById: (id: string) => `ComiteVigilancia/${id}`,
    list: (customerId: string) => `ComiteVigilancia/list/${customerId}`,
    sendCredentials: (id: string) => `comitevigilancia/${id}/send-credentials`,
    update: (id: string) => `ComiteVigilancia/${id}`,
  },
  CondominiumAssets: {
    selectByCustomer: (customerId: string) => `CondominiumAsset/${customerId}`,
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
  CustomDocuments: {
    create: "customdocument",
    delete: (id: string) => `customdocument/${id}`,
    getById: (id: string) => `customdocument/${id}`,
    list: (customerId: string, documentType: number) =>
      `customdocument/list/${customerId}/${documentType}`,
    update: (id: string) => `customdocument/${id}`,
    updateOrder: "customdocument/update-order",
  },
  CustomerInspections: {
    selectByCustomer: (customerId: string) =>
      `CustomerInspections/${customerId}`,
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
  EmployeeBankData: {
    base: "EmployeeBankData",
    byEmployee: (employeeId: string) =>
      `EmployeeBankData/employee/${employeeId}`,
    delete: (id: string) => `EmployeeBankData/${id}`,
    getAll: (customerId: string) => `EmployeeBankData/list/${customerId}`,
    getById: (id: string) => `EmployeeBankData/${id}`,
    upsert: "EmployeeBankData",
  },
  EmployeeClinicalData: {
    base: "EmployeeClinicalData",
    byEmployee: (employeeId: string) =>
      `EmployeeClinicalData/employee/${employeeId}`,
    delete: (id: string) => `EmployeeClinicalData/${id}`,
    getById: (id: string) => `EmployeeClinicalData/${id}`,
  },
  EmployeeEmergencyContact: {
    base: "EmployeeEmergencyContact",
    byEmployee: (employeeId: string) =>
      `EmployeeEmergencyContact/employee/${employeeId}`,
    delete: (id: string) => `EmployeeEmergencyContact/${id}`,
    getById: (id: string) => `EmployeeEmergencyContact/${id}`,
    listEmployeeContact: (employeeId: string, typeContact: number) =>
      `EmployeeEmergencyContact/ListEmployeeContact/${employeeId}/${typeContact}`,
  },
  EmployeeExternal: {
    addAccessCustomer: (applicationUserId: string, customerId: string) =>
      `employeeexternal/add-access-cutomer/${applicationUserId}/${customerId}`,
    create: "EmployeeExternal",
    delete: (id: string) => `employeeexternal/${id}`,
    deleteAccessCustomer: (applicationUserId: string, customerId: string) =>
      `employeeexternal/delete-access-cutomer/${applicationUserId}/${customerId}`,
    getById: (id: string) => `EmployeeExternal/${id}`,
    list: (customerId: string, active: boolean) =>
      `EmployeeExternal/List/${customerId}/${active}`,
    searchByEmail: (customerId: string, email: string, excludeUserId?: string) =>
      `employeeexternal/search-by-email/${customerId}?email=${email}${excludeUserId ? `&excludeUserId=${excludeUserId}` : ""}`,
    searchByPhone: (
      customerId: string,
      phoneNumber: string,
      excludeUserId?: string,
    ) =>
      `employeeexternal/search-by-phone/${customerId}?phoneNumber=${phoneNumber}${excludeUserId ? `&excludeUserId=${excludeUserId}` : ""}`,
    update: (id: string) => `EmployeeExternal/${id}`,
  },
  EmployeeInternal: {
    activate: (id: string) => `EmployeeInternal/${id}/activate`,
    addressData: (employeeId: string | number) =>
      `EmployeeInternal/AddressData/${employeeId}`,
    dataForRecoveryPassword: (id: string) =>
      `EmployeeInternal/DataForRecoveryPassword/${id}`,
    laboralData: (applicationUserId: string) =>
      `EmployeeInternal/LaboralData/${applicationUserId}`,
    list: (customerId: string, active: boolean) =>
      `EmployeeInternal/list/${customerId}/${active}`,
    onValidateState: (id: string) => `EmployeeInternal/OnValidateState/${id}`,
    personalData: (employeeId: string | number) =>
      `EmployeeInternal/PersonalData/${employeeId}`,
    photoPath: (applicationUserId: string) =>
      `EmployeeInternal/PhotoPath/${applicationUserId}`,
    principalData: (applicationUserId: string) =>
      `EmployeeInternal/PrincipalData/${applicationUserId}`,
    updateAddressData: (addressId: string) =>
      `EmployeeInternal/UpdateAddressData/${addressId}`,
    updateImage: (applicationUserId: string) =>
      `EmployeeInternal/UpdateImage/${applicationUserId}`,
    updateLaboralData: (applicationUserId: string) =>
      `EmployeeInternal/UpdateLaboralData/${applicationUserId}`,
    updatePersonalData: (employeeId: string | number) =>
      `EmployeeInternal/UpdatePersonalData/${employeeId}`,
    updatePrincipalData: (applicationUserId: string) =>
      `EmployeeInternal/UpdatePrincipalData/${applicationUserId}`,
  },
  Employees: {
    createEmployee: "Employees/CreateEmployee",
    createEmployeeExternal: "Employees/CreateEmployeeExternal",
  },
  EntregaRecepcion: {
    base: "CatalogoEntregaRecepcionDescripcion",
    getByClient: (id: string) => `EntregaRecepcionCliente/${id}`,
    getById: (id: string) => `CatalogoEntregaRecepcionDescripcion/${id}`,
    grupos: "CatalogoEntregaRecepcionDescripcion/grupos",
    updateClient: (id: string, userId: string, customerId: string) =>
      `EntregaRecepcionCliente/${id}/${userId}/${customerId}`,
  },
  EntregaRecepcionCliente: {
    deleteFile: (id: string) => `EntregaRecepcionCliente/DeleteFile/${id}`,
    generateData: "EntregaRecepcionCliente/GenerateData",
    getByCustomerAndDepartment: (customerId: string, department: string) =>
      `EntregaRecepcionCliente/${customerId}/${department}`,
    invalidateFile: (id: string) =>
      `EntregaRecepcionCliente/InvalidarArchivo/${id}`,
    validateFile: (applicationUserId: string, id: string) =>
      `EntregaRecepcionCliente/ValidarArchivo/${applicationUserId}/${id}`,
  },
  EspejoAspelFull: {
    get: (customerId: string, year: number, empresa: string) =>
      `espejo-aspel-full?customerId=${customerId}&year=${year}&empresa=${empresa}`,
  },
  FundingFiles: {
    solicitudesPago: "FundingFile/solicitudes-pago",
  },
  HR: {
    AddendumTemplate: {
      getAll: "hr/addendum-templates",
      getById: (id: string) => `hr/addendum-templates/${id}`,
      create: "hr/addendum-templates",
      update: (id: string) => `hr/addendum-templates/${id}`,
      toggleActive: (id: string) => `hr/addendum-templates/${id}/toggle-active`,
      delete: (id: string) => `hr/addendum-templates/${id}`,
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
    ContractTemplate: {
      getAll: "hr/contract-templates",
      getById: (id: string) => `hr/contract-templates/${id}`,
      create: "hr/contract-templates",
      update: (id: string) => `hr/contract-templates/${id}`,
      toggleActive: (id: string) => `hr/contract-templates/${id}/toggle-active`,
      preview: "hr/contract-templates/preview",
      delete: (id: string) => `hr/contract-templates/${id}`,
    },
    EmployeeBankData: {
      getAll: (customerId: string) => `EmployeeBankData/list/${customerId}`,
      getById: (id: string) => `EmployeeBankData/${id}`,
      upsert: "EmployeeBankData",
      delete: (id: string) => `EmployeeBankData/${id}`,
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
    Nomina: {
      Configuracion: {
        getByCustomer: (customerId: string) =>
          `hr/nomina/configuracion/${customerId}`,
        update: (customerId: string) => `hr/nomina/configuracion/${customerId}`,
      },
      Encabezado: {
        changeState: (nominaId: string, accion: string) =>
          `hr/nomina/${nominaId}/${accion}`,
        getAll: (customerId: string) => `hr/nomina?customerId=${customerId}`,
        getById: (nominaId: string) => `hr/nomina/${nominaId}`,
        getDetalles: (nominaId: string) => `hr/nomina/${nominaId}/detalles`,
        getResumenEjecutivo: (nominaId: string) =>
          `hr/nomina/${nominaId}/resumen-ejecutivo`,
        updateDetalle: (nominaId: string, detalleId: string) =>
          `hr/nomina/${nominaId}/detalles/${detalleId}`,
      },
      Evidencias: {
        byNomina: (nominaId: string) => `hr/nomina/${nominaId}/evidencias`,
        delete: (id: string) => `hr/nomina/evidencias/${id}`,
      },
      Generar: {
        nomina: "hr/nomina/generar",
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
      Periodos: {
        autoCrear: (customerId: string) =>
          `hr/nomina/periodos/auto-crear?customerId=${customerId}`,
        byCustomerAndYear: (customerId: string, anio: number) =>
          `hr/nomina/periodos?customerId=${customerId}&anio=${anio}`,
        delete: (id: string) => `hr/nomina/periodos/${id}`,
        diasNoHabiles: (periodoId: string) =>
          `hr/nomina/periodos/${periodoId}/dias-no-habiles`,
        deleteDiaNoHabil: (periodoId: string, diaId: string) =>
          `hr/nomina/periodos/${periodoId}/dias-no-habiles/${diaId}`,
      },
      Prestamos: {
        autorizar: (prestamoId: string) => `hr/nomina/prestamos/${prestamoId}/autorizar`,
        cancelar: (prestamoId: string) => `hr/nomina/prestamos/${prestamoId}/cancelar`,
        create: "hr/nomina/prestamos",
        historialPagos: (prestamoId: string) =>
          `hr/nomina/prestamos/${prestamoId}/historial-pagos`,
      },
      TiempoExtra: {
        approve: (id: string) => `hr/nomina/tiempo-extra/${id}/aprobar`,
        create: "hr/nomina/tiempo-extra",
        delete: (id: string) => `hr/nomina/tiempo-extra/${id}`,
        list: (periodoId: string) =>
          `hr/nomina/tiempo-extra?periodoNominaId=${periodoId}`,
        update: (id: string) => `hr/nomina/tiempo-extra/${id}`,
      },
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
    VacationBalanceAdmin: {
      byCustomer: (customerId: string) =>
        `admin/vacation-balances/customer/${customerId}`,
      recalculateAll: (customerId: string) =>
        `admin/vacation-balances/recalculate-all/${customerId}`,
      manualUpdate: "admin/vacation-balances/manual-update",
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
  },
  InspectionCondominiumAssets: {
    create: "InspectionCondominiumAsset",
    deleteArea: (id: string) => `InspectionCondominiumAsset/DeleteArea/${id}`,
    deleteReview: (reviewId: string) =>
      `InspectionCondominiumAsset/DeleteReview/${reviewId}`,
    getById: (assetId: string) => `InspectionCondominiumAsset/${assetId}`,
    listByInspection: (inspectionId: string) =>
      `InspectionCondominiumAsset/List/${inspectionId}`,
    update: (id: string) => `InspectionCondominiumAsset/${id}`,
  },
  InspectionResultImages: {
    byInspectionResultAndCustomer: (
      inspectionResultId: string,
      customerId: string,
    ) => `InspectionResultImage/${inspectionResultId}/${customerId}`,
    deleteInspectionImage: (imageId: string, customerId: string) =>
      `InspectionResultImage/DeleteInspectionImage/${imageId}/${customerId}`,
  },
  InspectionResults: {
    byUserCustomerAndDate: (
      applicationUserId: string,
      customerId: string,
      formattedDate: string,
    ) =>
      `InspectionResult/GetInspectionsByCustomer/${applicationUserId}/${customerId}/${formattedDate}`,
    getByIdForExecution: (customerInspectionId: string) =>
      `InspectionResult/InspectionResultGetById/${customerInspectionId}`,
    report: (inspectionResultId: string, date?: string) =>
      date
        ? `InspectionResult/Report/${inspectionResultId}/${date}`
        : `InspectionResult/Report/${inspectionResultId}`,
    updateInspectionData: (
      customerInspectionId: string,
      applicationUserId: string,
    ) =>
      `InspectionResult/UpdateInspectionData/${customerInspectionId}/${applicationUserId}`,
  },
  InspectionReviewCatalog: {
    create: "InspectionReviewsCatalog",
    delete: (id: string | number) => `InspectionReviewsCatalog/${id}`,
    getAll: "InspectionReviewsCatalog",
    getById: (id: string) => `InspectionReviewsCatalog/${id}`,
    update: (id: string) => `InspectionReviewsCatalog/${id}`,
  },
  Inspections: {
    create: "Inspection",
    delete: (id: string | number) => `inspection/${id}`,
    getById: (id: string) => `inspection/${id}`,
    listByCustomer: (customerId: string) => `inspection/list/${customerId}`,
    update: (id: string) => `Inspection/${id}`,
  },
  JobDescriptions: {
    base: "job-descriptions",
    getById: (id: string) => `job-descriptions/${id}`,
    getByWorkPosition: (workPositionId: string) =>
      `job-descriptions/by-workposition/${workPositionId}`,
  },
  JuntaMensualSession: {
    detail: (sessionId: string) => `JuntaMensualSession/${sessionId}/detail`,
  },
  LegalDirectories: {
    committees: "LegalDirectories/Committees",
  },
  LegalMatters: {
    categories: "legalmattercategory",
    categoryById: (id: string) => `LegalMatter/Category/${id}`,
    create: "LegalMatter",
    createCategory: "LegalMatter/Category",
    delete: (id: string) => `LegalMatter/${id}`,
    deleteCategory: (id: string) => `LegalMatter/Category/${id}`,
    getAll: "LegalMatter",
    getById: (id: string) => `LegalMatter/${id}`,
    update: (id: string) => `LegalMatter/${id}`,
    updateCategory: (id: string) => `LegalMatter/Category/${id}`,
  },
  LegalMinutes: {
    pendingByUserAndStatus: (applicationUserId: string, status: number) =>
      `ContabilidadMinuta/ListaMinutaLegal/${applicationUserId}/${status}`,
  },
  LegalReports: {
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
    requestsAttended: (
      startDate: string,
      endDate: string,
      isInternal: boolean,
    ) => `LegalReport/RequestsAttended/${startDate}/${endDate}/${isInternal}`,
    requestsPending: (isInternal: boolean) =>
      `LegalReport/RequestsPending/${isInternal}`,
    results: (startDate: string, endDate: string, isInternal: boolean) =>
      `LegalReport/Results/${startDate}/${endDate}/${isInternal}`,
    summary: (startDate: string, endDate: string) =>
      `LegalReport/Summary/${startDate}/${endDate}`,
    summaryCustomer: (startDate: string, endDate: string) =>
      `LegalReport/SummaryCustomer/${startDate}/${endDate}`,
    summaryIndividual: (startDate: string, endDate: string) =>
      `LegalReport/SummaryIndividual/${startDate}/${endDate}`,
    totalRequests: (startDate: string, endDate: string) =>
      `LegalReport/TotalRequests/${startDate}/${endDate}`,
  },
  MachineryClassification: {
    create: "EquipoClasificacion",
    delete: (id: string) => `equipoclasificacion/${id}`,
    getAll: "EquipoClasificacion",
    getById: (id: string | number) => `EquipoClasificacion/${id}`,
    update: (id: string | number) => `EquipoClasificacion/${id}`,
  },
  ManualFlowcharts: {
    create: "manualFlowcharts",
    delete: (id: string) => `manualFlowcharts/${id}`,
    getById: (id: string) => `manualFlowcharts/${id}`,
    update: (id: string) => `manualFlowcharts/${id}`,
  },
  Manuals: {
    createTemplate: "manuals/templates",
    deleteInstance: (id: string) => `manuals/instances/${id}`,
    deleteTemplate: (id: string) => `manuals/templates/${id}`,
    deleteTemplateAttachment: (id: string) =>
      `manuals/templates/attachments/${id}`,
    getInstances: (customerId?: string) =>
      customerId
        ? `manuals/instances?customerId=${customerId}`
        : "manuals/instances",
    getTemplateById: (id: string) => `manuals/templates/${id}`,
    getTemplates: "manuals/templates",
    updateTemplate: (id: string) => `manuals/templates/${id}`,
    updateTemplateItems: (id: string) => `manuals/templates/${id}/items`,
    uploadInstance: "manuals/instances",
    uploadTemplateAttachment: "manuals/templates/attachments",
    upsertTemplate: "manuals/templates",
  },
  ManualsPasos: {
    addAdjunto: (manualId: string) => `manuals/${manualId}/adjuntos`,
    addEnlace: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/enlaces`,
    addPaso: (manualId: string) => `manuals/${manualId}/pasos`,
    addVersion: (manualId: string) => `manuals/${manualId}/versiones`,
    crearDiagrama: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/diagrama`,
    create: "manuals",
    delete: (id: string) => `manuals/${id}`,
    deleteAdjunto: (manualId: string, adjuntoId: string) =>
      `manuals/${manualId}/adjuntos/${adjuntoId}`,
    deleteDiagrama: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/diagrama`,
    deleteEnlace: (manualId: string, pasoId: string, enlaceId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/enlaces/${enlaceId}`,
    deletePaso: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}`,
    deleteVersion: (manualId: string, versionId: string) =>
      `manuals/${manualId}/versiones/${versionId}`,
    eliminarImagen: (manualId: string, pasoId: string, imagenId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/imagenes/${imagenId}`,
    getAll: "manuals",
    getById: (id: string) => `manuals/${id}`,
    getDiagrama: (diagramaId: string) => `manuals/diagrama/${diagramaId}`,
    reordenarPasos: (manualId: string) =>
      `manuals/${manualId}/pasos/reordenar`,
    subirImagen: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/imagenes`,
    update: (id: string) => `manuals/${id}`,
    updateDiagrama: (diagramaId: string) => `manuals/diagrama/${diagramaId}`,
    updatePaso: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}`,
  },
  MeetingAdministracion: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `MeetingAdministracion/AgregarParticipantesAdministracion/${meetingId}/${participantId}/1`,
    delete: (id: string | number) => `MeetingAdministracion/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `GetListAdministracionMinuta/${customerId}/${meetingId}`,
    participants: (meetingId: string | number) =>
      `MeetingAdministracion/ParticipantesAdministracion/${meetingId}`,
  },
  MeetingComite: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `MeetingComite/AgregarParticipantesComite/${meetingId}/${participantId}`,
    delete: (id: string | number) => `MeetingComite/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `GetListComiteMinuta/${customerId}/${meetingId}`,
    participants: (meetingId: string | number) =>
      `MeetingComite/ParticipantesComite/${meetingId}`,
  },
  MeetingDetailsTracking: {
    base: "MeetingDertailsSeguimiento",
    delete: (id: string | number) => `MeetingDertailsSeguimiento/${id}`,
    exportSummaryToExcel: (meetingId: string | number) =>
      `MeetingDertailsSeguimiento/ExportSummaryToExcel/${meetingId}`,
    getById: (id: string | number) => `MeetingDertailsSeguimiento/${id}`,
    resumenGrafico: (customerId: string, date: string) =>
      `MeetingDertailsSeguimiento/ResumenPreventivosGraficoPresentacion/${customerId}/${date}`,
    resumenGraficoPresentacion: (meetingId: string | number) =>
      `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${meetingId}`,
    resumenPreventivos: (customerId: string, date: string) =>
      `MeetingDertailsSeguimiento/ResumenPreventivosPresentacion/${customerId}/${date}`,
    resumenPresentacion: (meetingId: string | number) =>
      `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${meetingId}`,
    update: (id: string | number) => `MeetingDertailsSeguimiento/${id}`,
  },
  MeetingInvitado: {
    addParticipant: (meetingId: string | number, invitado: string | null) =>
      `MeetingInvitado/AgregarParticipantesInvitado/${meetingId}/${invitado}`,
    delete: (id: string | number) => `MeetingInvitado/${id}`,
    participants: (meetingId: string | number) =>
      `MeetingInvitado/ParticipantesInvitado/${meetingId}`,
  },
  Meetings: {
    allPendingMinutas: (customerId: string) =>
      `Meetings/MinutaAllPendientes/${customerId}`,
    base: "Meetings",
    delete: (id: string) => `Meetings/${id}`,
    getById: (id: string) => `Meetings/${id}`,
    getDetails: (meetingId: string | null) => `Meetings/GetDetails/${meetingId}`,
    list: (customerId: string, tipoJunta: number) =>
      `Meetings/list/${customerId}/${tipoJunta}`,
    reportPdf: (meetingId: string | number) =>
      `Meetings/MeetingReportPdf/${meetingId}`,
    seguimientoMinutas: (customerId: string, filtro: number) =>
      `Meetings/SeguimientoMinutas/${customerId}/${filtro}`,
    sendEmailResponsible: (
      id: any,
      customerId: string,
      area: number,
      applicationUserId: string,
    ) =>
      `Meetings/SendEmailResponsible/${id}/${customerId}/${area}/${applicationUserId}`,
  },
  MeetingsDetails: {
    base: "MeetingsDetails",
    delete: (id: string | number) => `MeetingsDetails/${id}`,
    getById: (id: string | number) => `MeetingsDetails/${id}`,
  },
  MenuItems: {
    byCustomer: (customerId: string) => `menu-items/${customerId}`,
  },
  MeterCategories: {
    create: "MedidorCategoria",
    delete: (id: string) => `medidorcategoria/${id}`,
    getAll: "MedidorCategoria",
    getById: (id: string | number) => `MedidorCategoria/${id}`,
    update: (id: string | number) => `MedidorCategoria/${id}`,
  },
  MeterReadings: {
    create: "MedidorLectura",
    dailyChart: (medidorId: string, fechaInicial: string, fechaFinal: string) =>
      `MedidorLectura/DataGraficoDiaria/${medidorId}/${fechaInicial}/${fechaFinal}`,
    delete: (id: string | number) => `MedidorLectura/${id}`,
    exportExcel: (id: string | number) => `MedidorLectura/ExportExcel/${id}`,
    getById: (id: string | number) => `MedidorLectura/${id}`,
    lastReading: (medidorId: string) =>
      `MedidorLectura/UltimaLectura/${medidorId}`,
    listByMeter: (medidorId: string) => `MedidorLectura/list/${medidorId}`,
    monthlyChart: (
      medidorId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) =>
      `MedidorLectura/DataGraficoMensual/${medidorId}/${fechaInicial}/${fechaFinal}`,
    update: (id: string | number) => `MedidorLectura/${id}`,
  },
  Meters: {
    create: "Medidor",
    delete: (id: string | number) => `Medidor/${id}`,
    getById: (id: string | number) => `Medidor/${id}`,
    listByCustomer: (customerId: string) => `Medidor/list/${customerId}`,
    update: (id: string | number) => `Medidor/${id}`,
  },
  OrdenCompraStatus: {
    byOrdenCompra: (ordenCompraId: string) =>
      `OrdenCompraStatus/by-orden-compra/${ordenCompraId}`,
    deleteInvoice: (id: string | number) => `OrdenCompraStatus/invoices/${id}`,
    update: (id: string | number) => `OrdenCompraStatus/${id}`,
    updateInvoice: (id: string | number) => `OrdenCompraStatus/invoices/${id}`,
    updateInvoiceType: (id: string | number) =>
      `OrdenCompraStatus/invoices/${id}/type`,
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
  OrgChart: {
    getTree: (customerId: string) => `WorkPositionOrgChart/tree/${customerId}`,
    reassign: "WorkPositionOrgChart/reassign",
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
  PresentacionJuntaComite: {
    addFecha: "PresentacionJuntaComite/AddFecha",
    authorize: (id: any, userId: string) =>
      `PresentacionJuntaComite/AutorizarPresentacion/${id}/${userId}`,
    delete: (id: any) => `PresentacionJuntaComite/${id}`,
    deleteFile: (id: any, area: string) => `PresentacionJuntaComite/${id}/${area}`,
    getById: (id: string) => `PresentacionJuntaComite/Get/${id}`,
    list: (customerId: string) => `PresentacionJuntaComite/list/${customerId}`,
    updateFecha: (id: string) => `PresentacionJuntaComite/AddFecha/${id}`,
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
  Presupuestos: {
    create: "Presupuesto/Create",
    toPurchaseOrder: (customerId: string, ordenCompraId: string, year: number) =>
      `presupuesto/to-purchase-order/${customerId}/${ordenCompraId}/${year}`,
    update: (id: string) => `Presupuesto/UpdatePresupuesto/${id}`,
  },
  PurchaseOrderBudgets: {
    create: "OrdenCompraPresupuesto",
    delete: (id: string | number) => `OrdenCompraPresupuesto/${id}`,
    getById: (id: string | number) => `OrdenCompraPresupuesto/${id}`,
    update: (id: string | number) => `OrdenCompraPresupuesto/${id}`,
  },
  PurchaseOrderDetails: {
    addProductToOrder: (ordenCompraId: string) =>
      `OrdenCompraDetalle/AddProductToOrder/${ordenCompraId}`,
    create: "OrdenCompraDetalle/",
    delete: (id: string | number) => `OrdenCompraDetalle/${id}`,
    getById: (id: string | number) => `OrdenCompraDetalle/${id}`,
    update: (id: string | number) => `OrdenCompraDetalle/${id}`,
  },
  PurchaseOrderPaymentData: {
    getById: (id: string | number) => `OrdenCompraDatosPago/${id}`,
    update: (id: string | number) => `OrdenCompraDatosPago/${id}`,
  },
  PurchaseOrderPaymentVouchers: {
    delete: (id: string | number) => `OrdenCompraComprobantePago/${id}`,
    upload: (ordenCompraId: string | number) => `OrdenCompraComprobantePago/${ordenCompraId}`,
  },
  PurchaseOrders: {
    authorize: (id: string, userId: string) =>
      `OrdenCompraAuth/Autorizar/${id}/${userId}`,
    create: (providerId: string | number, posicion: number, solicitudCompraId: string) =>
      `ordencompra/${providerId}/${posicion}/${solicitudCompraId}`,
    delete: (id: string | number) => `ordencompra/${id}`,
    getById: (id: string | number) => `OrdenCompra/${id}`,
    getForEdit: (id: string | number) => `OrdenCompra/GetForEdit/${id}`,
    listPagadas: (customerId: string, type: string) =>
      `OrdenCompra/Pagadas/${customerId}/${type}`,
    pdf: (id: string | number) => `ordencompra/Pdf/${id}`,
    progressiveCreate: "ordencompra/progressive-create",
    relatedQuotes: (solicitudCompraId: string) =>
      `OrdenCompra/CotizacionesRelacionadas/${solicitudCompraId}`,
    solicitudPago: (id: string | number) => `OrdenCompra/SolicitudPago/${id}`,
    unauthorize: (id: string) => `OrdenCompraAuth/Desautorizar/${id}`,
    linkManagerList: (customerId: string) =>
      `OrdenCompra/link-manager-list/${customerId}`,
    linkToRequest: (ordenCompraId: string, solicitudCompraId: string) =>
      `OrdenCompra/link-to-request/${ordenCompraId}/${solicitudCompraId}`,
    unlinkSolicitud: (id: string | number) => `OrdenCompra/UnlinkSolicitud/${id}`,
    update: (id: string | number) => `OrdenCompra/${id}`,
    uploadInvoice: (id: string | number) => `OrdenCompraStatus/${id}/invoices`,
    validateInvoice: (id: string | number) => `funding/validate-invoice/${id}`,
  },
  PurchaseRequestDetails: {
    addProductList: (solicitudCompraId: string) =>
      `SolicitudCompraDetalle/AddProduct/${solicitudCompraId}`,
    create: "SolicitudCompraDetalle",
    delete: (id: string | number) => `solicitudcompradetalle/${id}`,
    editProduct: (id: string | number) =>
      `solicitudcompradetalle/editproduct/${id}`,
    searchToAdd: (solicitudId: string) =>
      `SolicitudCompraDetalle/SearchToAddRequest/${solicitudId}`,
    update: (id: string | number) => `SolicitudCompraDetalle/${id}`,
  },
  PurchaseRequests: {
    addProduct: "PurchaseRequest/add-product",
    addProductList: (purchaseRequestId: string) =>
      `purchaserequest/add-product/${purchaseRequestId}`,
    create: "purchaserequest",
    deleteProduct: (id: string | number) => `purchaserequest/delete-product/${id}`,
    cuadroComparativo: (id: string) => `solicitudcompra/cuadrocomparativo/${id}`,
    cuadroComparativoUpdate: (id: string) => `SolicitudCompra/CuadroComparativo/${id}`,
    delete: (id: string | number) => `solicitudcompra/${id}`,
    getById: (id: string | number) => `SolicitudCompra/${id}`,
    getDetail: (id: string) => `purchaserequest/datail/${id}`,
    getIdByFolioAndCustomer: (folio: string, customerId: string) =>
      `SolicitudCompra/GetIdSolicitudCompra/${folio}/${customerId}`,
    getIndividual: (id: string | number) => `SolicitudCompra/GetSolicitudCompraIndividual/${id}`,
    getSolicitudCompraById: (id: string) => `purchaserequest/${id}`,
    listByCustomerAndStatus: (customerId: string, status: number | string) =>
      `purchaserequest/list/${customerId}/${status}`,
    listSolicitudCompraByCustomerAndStatus: (customerId: string, status: number | string) =>
      `solicitudcompra/list/${customerId}/${status}`,
    presentation: (customerId: string) => `SolicitudCompra/Presentation/${customerId}`,
    presentationOrder: "SolicitudCompra/Presentation/Order",
    presentationSelection: (id: string) => `SolicitudCompra/Presentation/${id}/Selection`,
    searchToAdd: (purchaseRequestId: string) =>
      `PurchaseRequest/SearchToAddRequest/${purchaseRequestId}`,
    solicitudCompraBase: "SolicitudCompra",
    update: (id: string) => `purchaserequest/${id}`,
    updateProduct: (id: string | number) => `PurchaseRequest/update-product/${id}`,
  },
  ProductCategories: {
    base: "Categories",
    create: "categories",
    delete: (id: string | number) => `categories/${id}`,
    getAll: "Categories",
    getById: (id: string | number) => `categories/${id}`,
    update: (id: string | number) => `categories/${id}`,
  },
  Products: {
    autoComplete: "productos/getautocompleteselectitem/",
    delete: (id: string) => `productos/${id}`,
    getAll: "Productos",
  },
  Properties: {
    create: "Property",
    delete: (id: string) => `Property/${id}`,
    getById: (id: string) => `Property/${id}`,
    update: (id: string) => `Property/${id}`,
  },
  ProviderSupport: {
    delete: (id: string) => `providersupport/${id}`,
    getAll: "providersupport",
    getById: (id: string) => `providersupport/${id}`,
  },
  RadioCommunication: {
    create: "RadioComunicacion",
    getById: (id: string) => `RadioComunicacion/${id}`,
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
  ResidentesEdificio: {
    selectByCustomer: (customerId: string) => `residentesedificio/${customerId}`,
  },
  ServiceOrders: {
    create: "ServiceOrders",
    delete: (id: string | number) => `ServiceOrders/${id}`,
    deleteDocument: (id: string | number) => `ServiceOrders/DeleteDocument/${id}`,
    deleteImg: (id: string | number) => `ServiceOrders/DeleteImg/${id}`,
    getById: (id: string | number) => `ServiceOrders/${id}`,
    listByCustomerAndDate: (customerId: string, date: string) =>
      `ServiceOrders/list/${customerId}/${date}`,
    listPintura: (customerId: string, date: string) =>
      `ServiceOrders/list-pintura/${customerId}/${date}`,
    photos: (id: string, customerId: string) =>
      `ServiceOrders/OrdenesServicioFotos/${id}/${customerId}`,
    reporte: (customerId: string, periodo: string) =>
      `ServiceOrders/ReporteOrdenesServicio/${customerId}/${periodo}`,
    reporteProveedor: (id: string, customerId: string) =>
      `ServiceOrders/OrdenesServicioReporteProveedor/${id}/${customerId}`,
    soporte: (id: string) => `ServiceOrders/SoporteOrdenServicio/${id}`,
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
  SpecialDocuments: {
    updateOrder: "special-document/update-order",
  },
  TaskFollowUps: {
    byMessage: (id: string) => `task-follow-up/by-message/${id}`,
    create: "task-follow-up",
    delete: (id: string) => `task-follow-up/${id}`,
    listByTicketMessage: (ticketMessageId: string) =>
      `task-follow-up/List/${ticketMessageId}`,
  },
  TaskGroupCategories: {
    base: "task-group-categories",
    delete: (id: string | number) => `task-group-categories/${id}`,
    getAll: "task-group-categories",
    getById: (id: string) => `task-group-categories/${id}`,
    selectByCustomer: (customerId: string) => `task-group-category/${customerId}`,
  },
  TaskGroupParticipants: {
    availableByCustomerAndGroup: (customerId: string, taskGroupId: string) =>
      `task-group-participant/Participants/${customerId}/${taskGroupId}`,
    base: "task-group-participant",
    delete: (id: string | number) => `task-group-participant/${id}`,
    listByGroup: (taskGroupId: string) => `task-group-participant/${taskGroupId}`,
    update: (id: string) => `task-group-participant/${id}`,
  },
  TaskGroups: {
    base: "task-groups",
    delete: (id: string | number) => `task-groups/${id}`,
    getById: (id: string) => `task-groups/${id}`,
    list: (customerId: string, isActive: boolean, applicationUserId: string) =>
      `task-groups/List/${customerId}/${isActive}/${applicationUserId}`,
    sendReportPendingAll: "tasks/send-report-pending",
    sendReportPendingByGroup: (id: string) => `tasks/send-report-pending/${id}`,
    toggleStatus: (id: string) => `task-groups/toggle-status/${id}`,
  },
  TaskLegal: {
    addTracking: "task-legal/Addtraking",
    create: "task-legal",
    createToCustomer: "task-legal/ToCustomer",
    delete: (id: string) => `task-legal/${id}`,
    employeeLegal: "task-legal/EmployeeLegal",
    getAllByCustomer: (customerId: string) => `task-legal/All/${customerId}`,
    getAllLegal: "task-legal/AllLegal",
    getById: (id: string) => `task-legal/${id}`,
    requestDetail: (id: string) => `task-legal/requestDetail/${id}`,
    selectForAddTicket: "SelectForAddTicket",
    status: (id: string) => `task-legal/status/${id}`,
    tracking: (ticketId: string) => `task-legal/Traking/${ticketId}`,
    update: (id: string) => `task-legal/${id}`,
    updateStatus: (id: string, status: number | null) =>
      `task-legal/UpdateStatus/${id}/${status}`,
  },
  TaskReads: {
    byMessage: (id: string) => `task-reads/by-message/${id}`,
    listByTicketMessage: (ticketMessageId: string) =>
      `task-read/list/${ticketMessageId}`,
  },
  TaskReports: {
    ticketReport: (customerId: string, startDate: string, endDate: string) =>
      `task-report/GetTicketReport/${customerId}/${startDate}/${endDate}`,
    weeklyPreview: (customerId: string, year: number, weekNumber: number) =>
      `task-report/WeeklyReportPreview/${customerId}/${year}/${weekNumber}`,
    weeklyReport: (
      customerId: string,
      startDate: string | null,
      endDate: string | null,
      status: string | number,
    ) => `task-report/WeeklyReport/${customerId}/${startDate}/${endDate}/${status}`,
  },
  TaskWorkPlans: {
    create: (
      applicationUserId: string,
      customerId: string,
      year: number,
      weekNumber: number,
    ) => `task-work-plan/Create/${applicationUserId}/${customerId}/${year}/${weekNumber}`,
    pending: (customerId: string) => `task-work-plan/pending/${customerId}`,
    preview: (customerId: string, year: number, weekNumber: number) =>
      `task-work-plan/preview/${customerId}/${year}/${weekNumber}`,
  },
  Tasks: {
    close: "tasks/Closed",
    create: "tasks/Create",
    deleteByCustomer: (id: string, customerId: string) =>
      `tasks/${id}/${customerId}`,
    getByClosed: (id: string) => `tasks/GetByClosed/${id}`,
    getById: (id: string) => `tasks/${id}`,
    getStatus: (id: string) => `tasks/${id}/status`,
    groupListByCustomer: (customerId: string) => `task-group-list/${customerId}`,
    inProgress: (id: string, applicationUserId: string) =>
      `Tickets/InProgress/${id}/${applicationUserId}`,
    inProgressLower: (id: string, applicationUserId: string) =>
      `tasks/in-progress/${id}/${applicationUserId}`,
    legalAll: (customerId?: string) => customerId ? `tasks/legal/all?customerId=${customerId}` : `tasks/legal/all`,
    legalByCustomer: "tasks/legal/customer",
    legalPending: (isInternal?: boolean, unassigned: boolean = false) => {
      if (unassigned) return "tasks/legal/pending?unassigned=true";
      return isInternal !== undefined ? `tasks/legal/pending?isInternal=${isInternal}` : "tasks/legal/pending";
    },
    list: (ticketGroupId: string, status: string) =>
      `tasks/List/${ticketGroupId}/${status}`,
    myAssignedTickets: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/my-assigned-tasks/${applicationUserId}/${status}/${customerId}`,
    myRequests: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/MyRequest/${applicationUserId}/${status}/${customerId}`,
    myTicketProgramation: (id: string) => `tasks/MyTicket/Programation/${id}`,
    participants: (ticketGroupId: string) => `tasks/participant/${ticketGroupId}`,
    programation: (id: string) => `tasks/Programation/${id}`,
    reopen: "tasks/Reopen",
    update: (id: string) => `tasks/Update/${id}`,
    updateOrder: "tasks/UpdateOrder",
    updatePriority: (id: string, applicationUserId: string) =>
      `tasks/UpdatePriority/${id}/${applicationUserId}`,
    updatePriorityLower: (id: string, applicationUserId: string) =>
      `tasks/update-priority/${id}/${applicationUserId}`,
    updateRelevance: (id: string) => `tasks/update-relevance/${id}`,
    updateRelevanceLegacy: (id: string) => `tasks/UpdateRelevance/${id}`,
    updateStatus: (id: string) => `tasks/${id}/status`,
    view: (id: string) => `tasks/view/${id}`,
    availablePredecessors: (groupId: string, excludeId?: string) =>
      excludeId
        ? `tasks/available-predecessors/${groupId}?excludeId=${excludeId}`
        : `tasks/available-predecessors/${groupId}`,
    setDependency: (taskId: string, predecessorId: string) =>
      `tasks/set-predecessor/${taskId}/${predecessorId}`,
    clearDependency: (taskId: string) => `tasks/clear-predecessor/${taskId}`,
  },
  Almacen: {
    delete: (id: string) => `almacen/${id}`,
    getById: (id: string) => `almacen/${id}`,
  },
  BitacoraMantenimiento: {
    delete: (id: string) => `BitacoraMantenimiento/${id}`,
  },
  CatalogoGastosFijosDetalles: {
    base: "CatalogoGastosFijosDetalles",
    delete: (id: string) => `CatalogoGastosFijosDetalles/${id}`,
  },
  DiagramDraw: {
    delete: (id: string) => `DiagramDraw/${id}`,
    getById: (id: string) => `DiagramDraw/${id}`,
    update: (id: string) => `DiagramDraw/${id}`,
  },
  Funding: {
    delete: (id: string) => `funding/${id}`,
    deleteDetail: (id: string) => `funding/detail/${id}`,
  },
  GoogleCalendarEvents: {
    updateSeries: (id: string) => `google-calendar-events/${id}/series`,
  },
  InventarioProducto: {
    create: "InventarioProducto",
  },
  Machineries: {
    delete: (id: string) => `Machineries/${id}`,
  },
  MaintenanceCalendars: {
    delete: (id: string) => `maintenancecalendars/${id}`,
  },
  Owner: {
    delete: (id: string) => `owner/${id}`,
    getById: (id: string) => `owner/${id}`,
  },
  Permission: {
    update: (id: string | number) => `Permission/${id}`,
  },
  Piscina: {
    delete: (id: string) => `piscina/${id}`,
  },
  TemplateEvaluation: {
    delete: (id: string) => `TemplateEvaluation/${id}`,
  },
  Tools: {
    delete: (id: string) => `Tools/${id}`,
  },
  ToolLoans: {
    create: "controlprestamoherramientas",
    delete: (id: string | number) => `ControlPrestamoHerramientas/${id}`,
    getById: (id: string | number) => `controlprestamoherramientas/${id}`,
    listByCustomer: (customerId: string) =>
      `ControlPrestamoHerramientas/list/${customerId}`,
    update: (id: string | number) => `controlprestamoherramientas/${id}`,
  },
  WorkPositions: {
    activate: (id: string) => `work-positions/${id}/activate`,
    assignEmployee: (applicationUserId: string, positionId: string) =>
      `work-positions/assign-employee/${applicationUserId}/${positionId}`,
    delete: (id: string) => `work-positions/${id}`,
    listByCustomer: (customerId: string, state: string) =>
      `work-positions/list-by-customer/${customerId}/${state}`,
    unassignEmployee: (id: string) => `work-positions/${id}/unassign-employee`,
  },
} as const;

export const EndpointsCobranza = {
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
  AspelCobranzaLocal: {
    accounts: (customerId: string, year: number) =>
      `aspel-cobranza-local/accounts?customerId=${customerId}&year=${year}`,
    detalleCobranzaRango: (customerId: string, numCta: string) =>
      `aspel-cobranza-local/detalle-cobranza-rango?customerId=${customerId}&numCta=${numCta}`,
    deudasActuales: (customerId: string) =>
      `aspel-cobranza-local/deudas-actuales?customerId=${customerId}`,
    estadoCuentaRango: (
      customerId: string,
      numCta: string,
      fechaInicio: string,
      fechaFin: string,
    ) =>
      `aspel-cobranza-local/estado-cuenta-rango?customerId=${customerId}&numCta=${numCta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    status: (customerId: string, year: number) =>
      `aspel-cobranza-local/status?customerId=${customerId}&year=${year}`,
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
    Migration: {
      syncCoi: (customerId: string, year: number) =>
        `accounting-coi/migration/coi/sync-aspel/${customerId}/ejercicio/${year}`,
      syncCobranza: (customerId: string, year: number) =>
        `accounting-coi/migration/legacy-collection/sync-aspel/${customerId}/ejercicio/${year}`,
    },
    CobranzaOnline: {
      Dashboard: {
        get: (customerId: string, year: number, month: number, day?: number) =>
          `accounting-coi/cobranza-online/dashboard/customer/${customerId}/year/${year}/month/${month}${day ? '?day=' + day : ''}`,
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
      ChargeTypes: {
        customer: (customerId: string) =>
          `accounting-coi/native-collection/charge-types/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/charge-types/${id}`,
        create: "accounting-coi/native-collection/charge-types",
        update: (id: string) =>
          `accounting-coi/native-collection/charge-types/${id}`,
        delete: (id: string) =>
          `accounting-coi/native-collection/charge-types/${id}`,
      },
      Charges: {
        customer: (customerId: string) =>
          `accounting-coi/native-collection/charges/customer/${customerId}`,
        getById: (id: string) =>
          `accounting-coi/native-collection/charges/${id}`,
        create: "accounting-coi/native-collection/charges",
        update: (id: string) =>
          `accounting-coi/native-collection/charges/${id}`,
        cancel: (id: string) =>
          `accounting-coi/native-collection/charges/${id}/cancel`,
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
        get: (propertyId: string, asOf?: string | null) =>
          asOf
            ? `accounting-coi/native-collection/statements/${propertyId}?asOf=${encodeURIComponent(asOf)}`
            : `accounting-coi/native-collection/statements/${propertyId}`,
        pdf: (propertyId: string, asOf?: string | null) =>
          asOf
            ? `accounting-coi/native-collection/statements/${propertyId}/pdf?asOf=${encodeURIComponent(asOf)}`
            : `accounting-coi/native-collection/statements/${propertyId}/pdf`,
      },
      Notifications: {
        process: (customerId: string) =>
          `accounting-coi/native-collection/notifications/process?customerId=${customerId}`,
        sendStatement: "accounting-coi/native-collection/notifications/statements/send",
        sendStatementBatch:
          "accounting-coi/native-collection/notifications/statements/send-batch",
        sendPaymentReceipt: (paymentId: string) =>
          `accounting-coi/native-collection/notifications/receipts/${paymentId}/send`,
      },
      NotificationSettings: {
        byCustomer: (customerId: string) =>
          `accounting-coi/native-collection/notification-settings/customer/${customerId}`,
        save: "accounting-coi/native-collection/notification-settings",
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
      Demo: {
        showcaseData: "accounting-coi/native-collection/demo/showcase-data",
        triggerAction: "accounting-coi/native-collection/demo/trigger-action",
        seedSandbox: (customerId: string) =>
          `accounting-coi/native-collection/demo/seed-sandbox/${customerId}`,
      },
    },
  },
} as const;

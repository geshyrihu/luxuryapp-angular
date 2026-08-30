export const EndpointsRecursosHumanos = {
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
    ContractRenewal: {
      getAll: "hr/contract-renewals",
      getById: (id: string) => `hr/contract-renewals/${id}`,
      getByContract: (contractId: string) =>
        `hr/contract-renewals/by-contract/${contractId}`,
      create: "hr/contract-renewals",
      update: (id: string) => `hr/contract-renewals/${id}`,
      registerDecision: (id: string) => `hr/contract-renewals/${id}/decision`,
      linkPerformanceEvaluation: (id: string) =>
        `hr/contract-renewals/${id}/link-performance-evaluation`,
      delete: (id: string) => `hr/contract-renewals/${id}`,
    },
    EmployeeBankData: {
      getAll: (customerId: string) => `employee-bank-data/list/${customerId}`,
      getById: (id: string) => `employee-bank-data/${id}`,
      upsert: "employee-bank-data",
      delete: (id: string) => `employee-bank-data/${id}`,
    },
    EmployeeFile: {
      getAll: (customerId: string, isActive?: boolean | null) => {
        let url = `hr/employee-files?customer-id=${customerId}`;
        if (isActive !== null && isActive !== undefined)
          url += `&is-active=${isActive}`;
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
      onboardingChecklist: (employeeId: string) =>
        `hr/employee-files/${employeeId}/onboarding-checklist`,
      initializeOnboardingChecklist: (employeeId: string) =>
        `hr/employee-files/${employeeId}/onboarding-checklist/initialize`,
      toggleOnboardingChecklistTask: (taskId: string) =>
        `hr/employee-files/onboarding-checklist/${taskId}/toggle`,
    },
    Incident: {
      getAll: (customerId: string) => `hr/incidents?customer-id=${customerId}`,
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
        `leave-request-approvals/overlapping-requests?customer-id=${customerId}&start-date=${startDate}&end-date=${endDate}&exclude-employee-id=${excludeEmployeeId}`,
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
        getAll: (customerId: string) => `hr/nomina?customer-id=${customerId}`,
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
          `hr/nomina/incidencias?periodo-nomina-id=${periodoNominaId}`,
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
          `hr/nomina/periodos/auto-crear?customer-id=${customerId}`,
        byCustomerAndYear: (customerId: string, anio: number) =>
          `hr/nomina/periodos?customer-id=${customerId}&anio=${anio}`,
        create: "hr/nomina/periodos",
        delete: (id: string) => `hr/nomina/periodos/${id}`,
        diasNoHabiles: (periodoId: string) =>
          `hr/nomina/periodos/${periodoId}/dias-no-habiles`,
        deleteDiaNoHabil: (periodoId: string, diaId: string) =>
          `hr/nomina/periodos/${periodoId}/dias-no-habiles/${diaId}`,
        update: (id: string) => `hr/nomina/periodos/${id}`,
      },
      Prestamos: {
        autorizar: (prestamoId: string) => `hr/nomina/prestamos/${prestamoId}/autorizar`,
        cancelar: (prestamoId: string) => `hr/nomina/prestamos/${prestamoId}/cancelar`,
        create: "hr/nomina/prestamos",
        delete: (id: string) => `hr/nomina/prestamos/${id}`,
        historialPagos: (prestamoId: string) =>
          `hr/nomina/prestamos/${prestamoId}/historial-pagos`,
        list: (customerId: string) => `hr/nomina/prestamos?customerId=${customerId}`,
      },
      TiempoExtra: {
        approve: (id: string) => `hr/nomina/tiempo-extra/${id}/aprobar`,
        create: "hr/nomina/tiempo-extra",
        delete: (id: string) => `hr/nomina/tiempo-extra/${id}`,
        list: (periodoId: string) =>
          `hr/nomina/tiempo-extra?periodo-nomina-id=${periodoId}`,
        update: (id: string) => `hr/nomina/tiempo-extra/${id}`,
      },
    },
    PastVacations: {
      create: "hr/vacations/past-requests",
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
    VacationRequest: {
      getAll: "hr/vacations/my-requests",
      getById: (id: string) => `hr/vacations/my-requests/${id}`,
      getDetail: (id: string) => `hr/vacations/my-requests/${id}/detail`,
      getBalance: "hr/vacations/my-requests/my-balance",
      getBalanceByYear: (year: number) =>
        `hr/vacations/my-requests/my-balance?year=${year}`,
      availableYears: "hr/vacations/my-requests/available-years",
      create: "hr/vacations/my-requests",
      update: (id: string) => `hr/vacations/my-requests/${id}`,
      delete: (id: string) => `hr/vacations/my-requests/${id}`,
    },
    VacationRequestApproval: {
      getAll: "hr/vacations/approvals",
      history: "hr/vacations/approvals/history",
      calendarEvents: (year: number, customerId: string, month?: number) =>
        `hr/vacations/approvals/calendar-events/${year}/${customerId}${month ? `?month=${month}` : ""}`,
      balance: (employeeId: string | number) =>
        `hr/vacations/approvals/${employeeId}/balance`,
      balanceByYear: (employeeId: string | number, year: number) =>
        `hr/vacations/approvals/${employeeId}/balance-by-year?year=${year}`,
      availableYears: (employeeId: string | number) =>
        `hr/vacations/approvals/${employeeId}/available-years`,
      overlappingRequests: (
        customerId: string,
        startDate: string,
        endDate: string,
        excludeEmployeeId: string,
      ) =>
        `hr/vacations/approvals/overlapping-requests?customer-id=${customerId}&start-date=${startDate}&end-date=${endDate}&exclude-employee-id=${excludeEmployeeId}`,
      approve: (id: string) => `hr/vacations/approvals/${id}/approve`,
      reject: (id: string) => `hr/vacations/approvals/${id}/reject`,
      cancel: (id: string) => `hr/vacations/approvals/${id}/cancel`,
    },
    EmployeeWorkContract: {
      byCustomer: (customerId: string) =>
        `hr/employee-work-contracts/customer/${customerId}`,
      byEmployee: (employeeId: string) =>
        `hr/employee-work-contracts/by-employee/${employeeId}`,
      getById: (id: string) => `hr/employee-work-contracts/${id}`,
      create: "hr/employee-work-contracts",
      update: (id: string) => `hr/employee-work-contracts/${id}`,
      terminate: (id: string) => `hr/employee-work-contracts/${id}/terminate`,
      delete: (id: string) => `hr/employee-work-contracts/${id}`,
      uploadSigned: (id: string) =>
        `hr/employee-work-contracts/${id}/upload-signed`,
    },
    VacationBalanceAdmin: {
      byCustomer: (customerId: string) =>
        `hr/vacations/balances/customer/${customerId}`,
      recalculateAll: (customerId: string) =>
        `hr/vacations/balances/recalculate-all/${customerId}`,
      manualUpdate: "hr/vacations/balances/manual-update",
    },
  },
  Settings: {
    createIncidentType: "hr/incident-types",
    createSanctionType: "hr/sanction-types",
    deleteIncidentType: (id: string) => `hr/incident-types/${id}`,
    deleteSanctionType: (id: string) => `hr/sanction-types/${id}`,
    holidaysByYear: (year: number) => `configuracion/dias-festivos/${year}`,
    incidentTypeById: (id: string) => `hr/incident-types/${id}`,
    incidentTypes: "hr/incident-types",
    sanctionTypeById: (id: string) => `hr/sanction-types/${id}`,
    sanctionTypes: "hr/sanction-types",
    toggleIncidentType: (id: string) => `hr/incident-types/${id}/toggle`,
    toggleSanctionType: (id: string) => `hr/sanction-types/${id}/toggle`,
    updateIncidentType: (id: string) => `hr/incident-types/${id}`,
    updateSanctionType: (id: string) => `hr/sanction-types/${id}`,
  },
  EmployeeInternal: {
    activate: (id: string) => `employee-internal/${id}/activate`,
    addressData: (employeeId: string | number) =>
      `employee-internal/address-data/${employeeId}`,
    cardUser: (applicationUserId: string) =>
      `employee-internal/card-user/${applicationUserId}`,
    dataForRecoveryPassword: (id: string) =>
      `employee-internal/data-for-recovery-password/${id}`,
    laboralData: (applicationUserId: string) =>
      `employee-internal/laboral-data/${applicationUserId}`,
    list: (customerId: string, active: boolean) =>
      `employee-internal/list/${customerId}/${active}`,
    onValidateState: (id: string) => `employee-internal/on-validate-state/${id}`,
    personalData: (employeeId: string | number) =>
      `employee-internal/personal-data/${employeeId}`,
    photoPath: (applicationUserId: string) =>
      `employee-internal/photo-path/${applicationUserId}`,
    principalData: (applicationUserId: string) =>
      `employee-internal/principal-data/${applicationUserId}`,
    unifiedProfile: (employeeId: string | number, applicationUserId: string) =>
      `employee-internal/unified-profile/${employeeId}/${applicationUserId}`,
    updateAddressData: (addressId: string) =>
      `employee-internal/update-address-data/${addressId}`,
    updateImage: (applicationUserId: string) =>
      `employee-internal/update-image/${applicationUserId}`,
    updateLaboralData: (applicationUserId: string) =>
      `employee-internal/update-laboral-data/${applicationUserId}`,
    updatePersonalData: (employeeId: string | number) =>
      `employee-internal/update-personal-data/${employeeId}`,
    updatePrincipalData: (applicationUserId: string) =>
      `employee-internal/update-principal-data/${applicationUserId}`,
    updateUnifiedProfile: (
      employeeId: string | number,
      applicationUserId: string,
    ) => `employee-internal/unified-profile/${employeeId}/${applicationUserId}`,
  },
  Employees: {
    birthday: (customerId: string, month: number) =>
      `employees/birthday/${customerId}/${month}`,
    createEmployee: "employees/create-employee",
    createEmployeeExternal: "employees/create-employee-external",
    employeeTemp: "employees/employee-temp",
    validateAdminAsis: (applicationUserId: string | number) =>
      `employees/validar-admin-asis/${applicationUserId}`,
    validateOpenRequests: (employeeId: string | number) =>
      `employees/validar-solicitudes-abiertas/${employeeId}`,
  },
  EmployeeDocument: {
    byEmployee: (employeeId: string | number) =>
      `employee-documents/${employeeId}`,
    upload: (employeeId: string | number) =>
      `employee-documents/${employeeId}/upload`,
    validate: (documentId: string | number) =>
      `employee-documents/${documentId}/validate`,
    reject: (documentId: string | number) =>
      `employee-documents/${documentId}/reject`,
    removeFile: (employeeId: string | number, documentId: string | number) =>
      `employee-documents/${employeeId}/documents/${documentId}/file`,
    notifyRecruitment: (employeeId: string | number) =>
      `employee-documents/notify-recruitment/${employeeId}`,
  },
  EmployeeBankData: {
    base: "employee-bank-data",
    byEmployee: (employeeId: string) =>
      `employee-bank-data/employee/${employeeId}`,
    delete: (id: string) => `employee-bank-data/${id}`,
    getAll: (customerId: string) => `employee-bank-data/list/${customerId}`,
    getById: (id: string) => `employee-bank-data/${id}`,
    upsert: "employee-bank-data",
  },
  EmployeeClinicalData: {
    base: "employee-clinical-data",
    byEmployee: (employeeId: string) =>
      `employee-clinical-data/employee/${employeeId}`,
    delete: (id: string) => `employee-clinical-data/${id}`,
    getById: (id: string) => `employee-clinical-data/${id}`,
  },
  EmployeeEmergencyContact: {
    base: "employee-emergency-contact",
    byEmployee: (employeeId: string) =>
      `employee-emergency-contact/employee/${employeeId}`,
    delete: (id: string) => `employee-emergency-contact/${id}`,
    getById: (id: string) => `employee-emergency-contact/${id}`,
    listEmployeeContact: (employeeId: string, typeContact: number) =>
      `employee-emergency-contact/list-employee-contact/${employeeId}/${typeContact}`,
  },
  EmployeeExternal: {
    addAccessCustomer: (applicationUserId: string, customerId: string) =>
      `employee-external/add-access-cutomer/${applicationUserId}/${customerId}`,
    create: "employee-external",
    delete: (id: string) => `employee-external/${id}`,
    deleteAccessCustomer: (applicationUserId: string, customerId: string) =>
      `employee-external/delete-access-cutomer/${applicationUserId}/${customerId}`,
    getById: (id: string) => `employee-external/${id}`,
    list: (customerId: string, active: boolean) =>
      `employee-external/list/${customerId}/${active}`,
    searchByEmail: (customerId: string, email: string, excludeUserId?: string) =>
      `employee-external/search-by-email/${customerId}?email=${email}${excludeUserId ? `&excludeUserId=${excludeUserId}` : ""}`,
    searchByPhone: (
      customerId: string,
      phoneNumber: string,
      excludeUserId?: string,
    ) =>
      `employee-external/search-by-phone/${customerId}?phoneNumber=${phoneNumber}${excludeUserId ? `&excludeUserId=${excludeUserId}` : ""}`,
    update: (id: string) => `employee-external/${id}`,
  },
  PerformanceEvaluations: {
    create: "performance-evaluations/create",
    delete: (id: string) => `performance-evaluations/${id}`,
    result: (id: string) => `performance-evaluations/${id}/result`,
    historyByEmployee: (employeeId: string | number) =>
      `performance-evaluations/employee/${employeeId}/history`,
    update: (evaluationId: string) =>
      `performance-evaluations/update/${evaluationId}`,
    historyByCustomer: (customerId: string) =>
      `performance-evaluations/customer/${customerId}/history`,
  },
  TemplateEvaluation: {
    create: "template-evaluation",
    delete: (id: string) => `template-evaluation/${id}`,
    getById: (id: string) => `template-evaluation/${id}`,
    listByCustomer: (customerId: string) => `template-evaluation/list/${customerId}`,
    update: (id: string) => `template-evaluation/${id}`,
  },
  ChekadorEmpleados: {
    registrar: "chekador-empleados/registrar",
    misRegistros: (pagina: number, tamano: number) =>
      `chekador-empleados/mis-registros?pagina=${pagina}&tamano=${tamano}`,
    porTenantBase: "chekador-empleados/por-tenant",
    resumenHoy: "chekador-empleados/resumen-hoy",
    porTenant: (params: {
      empleadoId?: string;
      desde?: string;
      hasta?: string;
      tipo?: number;
      soloAnomalias?: boolean;
    }) => {
      const q = new URLSearchParams();
      if (params.empleadoId) q.set("empleadoId", params.empleadoId);
      if (params.desde) q.set("desde", params.desde);
      if (params.hasta) q.set("hasta", params.hasta);
      if (params.tipo !== undefined) q.set("tipo", String(params.tipo));
      if (params.soloAnomalias !== undefined)
        q.set("soloAnomalias", String(params.soloAnomalias));
      const qs = q.toString();
      return `chekador-empleados/por-tenant${qs ? "?" + qs : ""}`;
    },
    aprobarAnomalia: (id: string) =>
      `chekador-empleados/${id}/aprobar-anomalia`,
    rechazarAnomalia: (id: string) =>
      `chekador-empleados/${id}/rechazar-anomalia`,
    sedes: "chekador-empleados/sedes",
  },
} as const;


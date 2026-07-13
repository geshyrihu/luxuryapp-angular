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
    EmployeeBankData: {
      getAll: (customerId: string) => `employee-bank-data/list/${customerId}`,
      getById: (id: string) => `employee-bank-data/${id}`,
      upsert: "employee-bank-data",
      delete: (id: string) => `employee-bank-data/${id}`,
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
    VacationBalanceAdmin: {
      byCustomer: (customerId: string) =>
        `admin/vacation-balances/customer/${customerId}`,
      recalculateAll: (customerId: string) =>
        `admin/vacation-balances/recalculate-all/${customerId}`,
      manualUpdate: "admin/vacation-balances/manual-update",
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
      `employee-internal/AddressData/${employeeId}`,
    dataForRecoveryPassword: (id: string) =>
      `employee-internal/DataForRecoveryPassword/${id}`,
    laboralData: (applicationUserId: string) =>
      `employee-internal/LaboralData/${applicationUserId}`,
    list: (customerId: string, active: boolean) =>
      `employee-internal/list/${customerId}/${active}`,
    onValidateState: (id: string) => `employee-internal/OnValidateState/${id}`,
    personalData: (employeeId: string | number) =>
      `employee-internal/PersonalData/${employeeId}`,
    photoPath: (applicationUserId: string) =>
      `employee-internal/PhotoPath/${applicationUserId}`,
    principalData: (applicationUserId: string) =>
      `employee-internal/PrincipalData/${applicationUserId}`,
    updateAddressData: (addressId: string) =>
      `employee-internal/UpdateAddressData/${addressId}`,
    updateImage: (applicationUserId: string) =>
      `employee-internal/UpdateImage/${applicationUserId}`,
    updateLaboralData: (applicationUserId: string) =>
      `employee-internal/UpdateLaboralData/${applicationUserId}`,
    updatePersonalData: (employeeId: string | number) =>
      `employee-internal/UpdatePersonalData/${employeeId}`,
    updatePrincipalData: (applicationUserId: string) =>
      `employee-internal/UpdatePrincipalData/${applicationUserId}`,
  },
  Employees: {
    createEmployee: "employees/create-employee",
    createEmployeeExternal: "employees/create-employee-external",
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
      `employee-emergency-contact/ListEmployeeContact/${employeeId}/${typeContact}`,
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
    result: (id: string) => `performance-evaluations/${id}/result`,
  },
  TemplateEvaluation: {
    delete: (id: string) => `template-evaluation/${id}`,
  },
  ChekadorEmpleados: {
    registrar: "chekador-empleados/registrar",
    misRegistros: (pagina: number, tamano: number) =>
      `chekador-empleados/mis-registros?pagina=${pagina}&tamano=${tamano}`,
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
  RefactorRecursosHumanos: {
    templateEvaluation: "template-evaluation",
    templateEvaluationById: (id: any) => `template-evaluation/${id}`,
    performanceEvaluationsById: (id: any) => `performance-evaluations/${id}`,
    performanceEvaluationsUpdateById: (evaluationId: any) => `performance-evaluations/Update/${evaluationId}`,
    performanceEvaluationsCreate: "performance-evaluations/Create",
    applicationUsersCardUserById: (appUserId: any) => `application-users/CardUser/${appUserId}`,
    employeesValidaradminasisById: (authS: any) => `employees/validaradminasis/${authS}`,
    hrNominaPeriodos: "hr/nomina/periodos",
    hrNominaPeriodosById: (p0: any) => `hr/nomina/periodos/${p0}`,
    hrNominaPrestamosById: (p0: any) => `hr/nomina/prestamos/${p0}`,
    configuracionDiasFestivosById: (year: any) => `configuracion/dias-festivos/${year}`,
    vacationRequestApprovalsByIdBalance: (employeeId: any) => `vacation-request-approvals/${employeeId}/balance`,
      templateEvaluationListById: (customerIdS: any) => `template-evaluation/list/${customerIdS}`,
    performanceEvaluationsCustomerByIdHistory: (customerIdS: any) => `performance-evaluations/customer/${customerIdS}/history`,
},
} as const;

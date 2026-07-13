type Id = string | number;

export const EndpointsReclutamiento = {
  WorkPositions: {
    activate: (id: Id) => `work-positions/${id}/activate`,
    assignEmployee: (applicationUserId: Id, positionId: Id) =>
      `work-positions/assign-employee/${applicationUserId}/${positionId}`,
    delete: (id: Id) => `work-positions/${id}`,
    listByCustomer: (customerId: Id, state: string) =>
      `work-positions/list-by-customer/${customerId}/${state}`,
    unassignEmployee: (id: Id) => `work-positions/${id}/unassign-employee`,
  },
  OrgChart: {
    getTree: (customerId: Id) => `work-position-org-chart/tree/${customerId}`,
    reassign: "work-position-org-chart/reassign",
  },
  JobDescriptions: {
    base: "job-descriptions",
    getById: (id: Id) => `job-descriptions/${id}`,
    getByWorkPosition: (workPositionId: Id) =>
      `job-descriptions/by-workposition/${workPositionId}`,
  },
  RequestDismissalDiscount: {
    base: "request-dismissal-discount",
    getById: (id: Id) => `request-dismissal-discount/${id}`,
    delete: (id: Id) => `request-dismissal-discount/${id}`,
  },
  RequestPosition: {
    base: "request-position",
    list: "request-position",
    getById: (id: Id) => `request-position/${id}`,
    delete: (id: Id) => `request-position/${id}`,
    exportExcel: "request-position/export-excel",
  },
  RecruitmentRequests: {
    solicitudVacante: (applicationUserId: Id) => `recruitment-requests/solicitud-vacante/${applicationUserId}`,
    solicitudModificacionSalario: (customerId: Id, applicationUserId: Id) =>
      `recruitment-requests/solicitud-modificacion-salario/${customerId}/${applicationUserId}`,
    solicitudBaja: (customerId: Id, employeeId: Id, applicationUserId: Id) =>
      `recruitment-requests/solicitud-baja/${customerId}/${employeeId}/${applicationUserId}`,
    solicitudAlta: (applicationUserId: Id) => `recruitment-requests/solicitud-alta/${applicationUserId}`,
    solicitudesPorCliente: (customerId: Id, applicationUserId: Id) =>
      `recruitment-requests/solicitudes-por-cliente/${customerId}/${applicationUserId}`,
    pendingGlobal: "recruitment-requests/pending-global",
  },
  RequestDismissal: {
    base: "request-dismissal",
    list: "request-dismissal/list",
    sendEmail: (workPositionId: Id) => `request-dismissal/send-email/${workPositionId}`,
    getById: (id: Id) => `request-dismissal/get-by-id/${id}`,
    getRequestDismissal: (employeeId: Id) => `request-dismissal/get-request-dismissal/${employeeId}`,
    updateStatus: (id: Id) => `request-dismissal/${id}/status`,
    delete: (id: Id) => `request-dismissal/${id}`,
    authorize: (id: Id, department: string) => `request-dismissal/${id}/authorize/${department}`,
    exportExcel: "request-dismissal/export-excel",
  },
  RequestSalaryModification: {
    base: "request-salary-modification",
    getData: (employeeId: Id) => `request-salary-modification/get-data/${employeeId}`,
    getStatus: (workPositionId: Id, employeeId: Id) =>
      `request-salary-modification/${workPositionId}/${employeeId}`,
    getById: (id: Id) => `request-salary-modification/get-by-id/${id}`,
    list: "request-salary-modification",
    delete: (id: Id) => `request-salary-modification/${id}`,
    exportExcel: "request-salary-modification/export-excel",
  },
  RequestEmployeeRegister: {
    base: "request-employee-register",
    getBasicInfo: (id: Id) => `request-employee-register/${id}/basic-info`,
    getEmployeeRegister: (employeeId: Id, customerId: Id) =>
      `request-employee-register/get-employee-register/${employeeId}/${customerId}`,
    getVacantes: (customerId: Id) => `request-employee-register/vacantes/${customerId}`,
    list: "request-employee-register/list",
    updateStatus: (id: Id) => `request-employee-register/${id}/status`,
    delete: (id: Id) => `request-employee-register/${id}`,
    exportExcel: "request-employee-register/export-excel",
  },
  RefactorReclutamiento: {
    employeesValidarsolicitudesabiertasById: (employeeId: any) => `employees/validarsolicitudesabiertas/${employeeId}`,
      solicitudesreclutamientoSendreportvacants: "solicitudesreclutamiento/sendreportvacants",
    workPositionsById: (workPositionId: any) => `work-positions/${workPositionId}`,
},
} as const;

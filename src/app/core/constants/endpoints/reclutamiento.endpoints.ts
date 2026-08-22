type Id = string | number;

export const EndpointsReclutamiento = {
  WorkPositions: {
    activate: (id: Id) => `work-positions/${id}/activate`,
    assignEmployee: (applicationUserId: Id, positionId: Id) =>
      `work-positions/assign-employee/${applicationUserId}/${positionId}`,
    delete: (id: Id) => `work-positions/${id}`,
    getById: (workPositionId: Id) => `work-positions/${workPositionId}`,
    listByCustomer: (customerId: Id, state: string) =>
      `work-positions/list-by-customer/${customerId}/${state}`,
    unassignEmployee: (id: Id) => `work-positions/${id}/unassign-employee`,
  },
  OrgChart: {
    getTree: (customerId: Id) => `work-position-org-chart/tree/${customerId}`,
    reassign: (customerId: Id) => `work-position-org-chart/reassign/${customerId}`,
  },
  JobDescriptions: {
    analyze: "job-descriptions/analyze",
    base: "job-descriptions",
    generateProposal: "job-descriptions/generate-proposal",
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
    deleteImpact: (id: Id) => `request-position/${id}/delete-impact`,
    deleteCascade: (id: Id) => `request-position/${id}/cascade`,
    exportExcel: "request-position/export-excel",
  },
  RecruitmentRequests: {
    sendReportVacants: "solicitudesreclutamiento/sendreportvacants",
    solicitudVacante: (applicationUserId: Id) =>
      `recruitment-requests/solicitud-vacante/${applicationUserId}`,
    solicitudModificacionSalario: (customerId: Id, applicationUserId: Id) =>
      `recruitment-requests/solicitud-modificacion-salario/${customerId}/${applicationUserId}`,
    solicitudBaja: (customerId: Id, employeeId: Id, applicationUserId: Id) =>
      `recruitment-requests/solicitud-baja/${customerId}/${employeeId}/${applicationUserId}`,
    solicitudAlta: (applicationUserId: Id) =>
      `recruitment-requests/solicitud-alta/${applicationUserId}`,
    solicitudesPorCliente: (customerId: Id, applicationUserId: Id) =>
      `recruitment-requests/solicitudes-por-cliente/${customerId}/${applicationUserId}`,
    pendingGlobal: "recruitment-requests/pending-global",
  },
  RequestDismissal: {
    base: "request-dismissal",
    list: "request-dismissal/list",
    sendEmail: (workPositionId: Id) =>
      `request-dismissal/send-email/${workPositionId}`,
    getById: (id: Id) => `request-dismissal/get-by-id/${id}`,
    getRequestDismissal: (employeeId: Id) =>
      `request-dismissal/get-request-dismissal/${employeeId}`,
    updateStatus: (id: Id) => `request-dismissal/${id}/status`,
    delete: (id: Id) => `request-dismissal/${id}`,
    authorize: (id: Id, department: string) =>
      `request-dismissal/${id}/authorize/${department}`,
    exportExcel: "request-dismissal/export-excel",
  },
  RequestSalaryModification: {
    base: "request-salary-modification",
    getData: (employeeId: Id) =>
      `request-salary-modification/get-data/${employeeId}`,
    getStatus: (workPositionId: Id, employeeId: Id) =>
      `request-salary-modification/${workPositionId}/${employeeId}`,
    getById: (id: Id) => `request-salary-modification/get-by-id/${id}`,
    list: "request-salary-modification",
    delete: (id: Id) => `request-salary-modification/${id}`,
    exportExcel: "request-salary-modification/export-excel",
  },
  RequestEmployeeRegister: {
    base: "request-employee-register",
    getById: (id: Id) => `request-employee-register/${id}`,
    getBasicInfo: (id: Id) => `request-employee-register/${id}/basic-info`,
    getEmployeeRegister: (employeeId: Id, customerId: Id) =>
      `request-employee-register/get-employee-register/${employeeId}/${customerId}`,
    getVacantes: (customerId: Id) =>
      `select-items/vacantes/${customerId}`,
    list: "request-employee-register/list",
    updateStatus: (id: Id) => `request-employee-register/${id}/status`,
    delete: (id: Id) => `request-employee-register/${id}`,
    exportExcel: "request-employee-register/export-excel",
    exportPdf: (id: Id) => `request-employee-register/${id}/export-pdf`,
  },
  Candidates: {
    base: "recruitment-candidates",
    list: "recruitment-candidates",
    getById: (id: Id) => `recruitment-candidates/${id}`,
    create: "recruitment-candidates",
    update: (id: Id) => `recruitment-candidates/${id}`,
    archive: (id: Id) => `recruitment-candidates/${id}/archive`,
    unarchive: (id: Id) => `recruitment-candidates/${id}/unarchive`,
    delete: (id: Id) => `recruitment-candidates/${id}`,
    deleteImpact: (id: Id) => `recruitment-candidates/${id}/delete-impact`,
    searchByPhone: (phone: string) =>
      `recruitment-candidates/search-by-phone?phone=${encodeURIComponent(phone)}`,
    recruitmentSources: "recruitment-sources",
    checkDuplicate: "recruitment-candidates/check-duplicate",
  },
  CandidateProcesses: {
    base: "recruitment-candidate-processes",
    list: "recruitment-candidate-processes",
    listByStage: (stage: string | number) =>
      `recruitment-candidate-processes/by-stage/${stage}`,
    getById: (id: Id) => `recruitment-candidate-processes/${id}`,
    createMultipart: "recruitment-candidate-processes/multipart",
    updateMultipart: (id: Id) =>
      `recruitment-candidate-processes/${id}/multipart`,
    kpis: "recruitment-candidate-processes/kpis",
    runAutomation: "recruitment-candidate-processes/run-automation",
    recruitmentAgenda: "recruitment-candidate-processes/recruitment-agenda",
    recruitmentInterviewBoard:
      "recruitment-candidate-processes/recruitment-board",
    interviewerQueue: "recruitment-candidate-processes/interviewer-queue",
    interviewerView: "recruitment-candidate-processes/interviewer-view",
    employeeInterviewerQueue:
      "recruitment-candidate-processes/employee-interviewer-queue",
    schedule: (id: Id) => `recruitment-candidate-processes/${id}/schedule`,
    cancelSchedule: (id: Id) =>
      `recruitment-candidate-processes/${id}/cancel-schedule`,
    changeStage: (id: Id) => `recruitment-candidate-processes/${id}/stage`,
    interviewResponse: (id: Id) =>
      `recruitment-candidate-processes/${id}/interview-response`,
    interviewerAction: "recruitment-candidate-processes/interviewer-action",
    processHiring: (id: Id) =>
      `recruitment-candidate-processes/${id}/process-hiring`,
    directHire: (requestPositionId: Id) =>
      `recruitment-candidate-processes/direct-hire/${requestPositionId}`,
    byRequestPosition: (requestPositionId: Id) =>
      `recruitment-candidate-processes/request-position/${requestPositionId}`,
    hiringDocuments: (id: Id) =>
      `recruitment-candidate-processes/${id}/hiring-documents`,
    validateHiringDocument: (documentId: Id) =>
      `recruitment-candidate-processes/hiring-documents/${documentId}/validate`,
  },
  CandidateWorkExperiences: {
    base: "recruitment-candidate-work-experiences",
    byCandidate: (candidateId: Id) =>
      `recruitment-candidate-work-experiences/candidate/${candidateId}`,
    update: (id: Id) => `recruitment-candidate-work-experiences/${id}`,
    delete: (id: Id) => `recruitment-candidate-work-experiences/${id}`,
  },
  InterviewerMatrix: {
    base: "recruitment-interviewer-matrix",
    byCustomer: (customerId: Id) =>
      `recruitment-interviewer-matrix/customer/${customerId}`,
    board: (customerId: Id) =>
      `recruitment-interviewer-matrix/customer/${customerId}/board`,
    eligibleInterviewersByRequestPosition: (requestPositionId: Id) =>
      `recruitment-interviewer-matrix/eligible-interviewers/by-request-position/${requestPositionId}`,
    resolve: (customerId: Id, workPositionRole: number) =>
      `recruitment-interviewer-matrix/resolve/${customerId}/${workPositionRole}`,
  },
} as const;

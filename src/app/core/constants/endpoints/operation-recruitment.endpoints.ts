export type OperationId = string | number;

export const OperationRecruitmentEndpoints = {
  workPositions: {
    getById: (id: OperationId) => `work-positions/${id}`,
    listByCustomer: (customerId: OperationId, state: string) =>
      `work-positions/list-by-customer/${customerId}/${state}`,
    delete: (id: OperationId) => `work-positions/${id}`,
    forEdit: (id: OperationId) => `work-positions/for-edit/${id}`,
    hours: (id: OperationId) => `work-positions/hours/${id}`,
    base: `work-positions`,
  },
  jobDescriptions: {
    getById: (id: OperationId) => `job-descriptions/${id}`,
    base: `job-descriptions`,
  },
  recruitmentRequests: {
    vacancy: `recruitment-requests/solicitud-vacante`,
    salary: (customerId: OperationId) =>
      `recruitment-requests/solicitud-modificacion-salario/${customerId}`,
    dismissal: (customerId: OperationId, employeeId: OperationId) =>
      `recruitment-requests/solicitud-baja/${customerId}/${employeeId}`,
  },
  requestDismissal: {
    getByEmployee: (employeeId: OperationId) =>
      `request-dismissal/get-request-dismissal/${employeeId}`,
  },
  requestSalaryModification: {
    getData: (employeeId: OperationId) =>
      `request-salary-modification/get-data/${employeeId}`,
  },
  candidateProcesses: {
    base: `recruitment-candidate-processes`,
  },
  employeeFiles: {
    onboardingChecklist: (employeeId: OperationId) =>
      `employee-files/${employeeId}/onboarding-checklist`,
    initializeOnboardingChecklist: (employeeId: OperationId) =>
      `employee-files/${employeeId}/onboarding-checklist/initialize`,
    updateOnboardingChecklistTask: (taskId: OperationId) =>
      `employee-files/onboarding-checklist/${taskId}`,
  },
  selectItems: {
    vacancies: (customerId: OperationId) =>
      `select-items/vacantes/${customerId}`,
  },
  performanceEvaluations: {
    historyByEmployee: (employeeId: OperationId) =>
      `operation/recruitment/performance-evaluations/employee/${employeeId}/history`,
  },
};
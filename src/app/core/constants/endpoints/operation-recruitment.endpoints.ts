export type OperationId = string | number;

const base = "operation/recruitment";

export const OperationRecruitmentEndpoints = {
  workPositions: {
    getById: (id: OperationId) => `${base}/work-positions/${id}`,
    listByCustomer: (customerId: OperationId, state: string) =>
      `${base}/work-positions/list-by-customer/${customerId}/${state}`,
    delete: (id: OperationId) => `${base}/work-positions/${id}`,
    forEdit: (id: OperationId) => `${base}/work-positions/for-edit/${id}`,
    hours: (id: OperationId) => `${base}/work-positions/hours/${id}`,
    base: `${base}/work-positions`,
  },
  jobDescriptions: {
    getById: (id: OperationId) => `${base}/job-descriptions/${id}`,
    base: `${base}/job-descriptions`,
  },
  recruitmentRequests: {
    vacancy: `${base}/recruitment-requests/solicitud-vacante`,
    salary: (customerId: OperationId) =>
      `${base}/recruitment-requests/solicitud-modificacion-salario/${customerId}`,
    dismissal: (customerId: OperationId, employeeId: OperationId) =>
      `${base}/recruitment-requests/solicitud-baja/${customerId}/${employeeId}`,
  },
  requestDismissal: {
    getByEmployee: (employeeId: OperationId) =>
      `${base}/request-dismissal/get-request-dismissal/${employeeId}`,
  },
  requestSalaryModification: {
    getData: (employeeId: OperationId) =>
      `${base}/request-salary-modification/get-data/${employeeId}`,
  },
  candidateProcesses: {
    base: `${base}/candidate-processes`,
  },
  employeeFiles: {
    onboardingChecklist: (employeeId: OperationId) =>
      `${base}/employee-files/${employeeId}/onboarding-checklist`,
    initializeOnboardingChecklist: (employeeId: OperationId) =>
      `${base}/employee-files/${employeeId}/onboarding-checklist/initialize`,
    updateOnboardingChecklistTask: (taskId: OperationId) =>
      `${base}/employee-files/onboarding-checklist/${taskId}`,
  },
  selectItems: {
    vacancies: (customerId: OperationId) =>
      `${base}/select-items/vacantes/${customerId}`,
  },
  performanceEvaluations: {
    historyByEmployee: (employeeId: OperationId) =>
      `${base}/performance-evaluations/employee/${employeeId}/history`,
  },
};
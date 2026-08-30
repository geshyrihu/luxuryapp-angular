export const EndpointsLegal = {
  LegalMatters: {
    categories: "LegalMatterCategory",
    categoryById: (id: string) => `legal-matter/category/${id}`,
    create: "legal-matter",
    createCategory: "legal-matter/category",
    delete: (id: string) => `legal-matter/${id}`,
    deleteCategory: (id: string) => `legal-matter/category/${id}`,
    getAll: "legal-matter",
    getById: (id: string) => `legal-matter/${id}`,
    update: (id: string) => `legal-matter/${id}`,
    updateCategory: (id: string) => `legal-matter/category/${id}`,
  },
  LegalMinutes: {
    pendingByUserAndStatus: (applicationUserId: string, status: number) =>
      `contabilidad-minuta/lista-minuta-legal/${applicationUserId}/${status}`,
  },
  LegalReports: {
    generateWeeklyReport: (
      startDate: string,
      endDate: string,
      isInternal: boolean,
    ) =>
      `legal-report/generate-weekly-report/${startDate}/${endDate}/${isInternal}`,
    pending: (isExternal: boolean) =>
      `legal-report/pending/${isExternal ? 1 : 0}`,
    pendingUnassignedData: "legal-report/pending-unassigned-data",
    report: "legal-report/report",
    requestsAttended: (
      startDate: string,
      endDate: string,
      isInternal: boolean,
    ) => `legal-report/requests-attended/${startDate}/${endDate}/${isInternal}`,
    requestsPending: (isInternal: boolean) =>
      `legal-report/requests-pending/${isInternal}`,
    results: (startDate: string, endDate: string, isInternal: boolean) =>
      `legal-report/results/${startDate}/${endDate}/${isInternal}`,
    summary: (startDate: string, endDate: string) =>
      `legal-report/summary/${startDate}/${endDate}`,
    summaryCustomer: (startDate: string, endDate: string) =>
      `legal-report/summary-customer/${startDate}/${endDate}`,
    summaryIndividual: (startDate: string, endDate: string) =>
      `legal-report/summary-individual/${startDate}/${endDate}`,
    totalRequests: (startDate: string, endDate: string) =>
      `legal-report/total-requests/${startDate}/${endDate}`,
  },
  TaskLegal: {
    addTracking: "task-legal/addtraking",
    create: "task-legal",
    createToCustomer: "task-legal/to-customer",
    delete: (id: string) => `task-legal/${id}`,
    employeeLegal: "task-legal/employee-legal",
    getAllByCustomer: (customerId: string) => `task-legal/all/${customerId}`,
    getAllLegal: "task-legal/all-legal",
    getById: (id: string) => `task-legal/${id}`,
    requestDetail: (id: string) => `task-legal/request-detail/${id}`,
    selectForAddTicket: "select-for-add-ticket",
    status: (id: string) => `task-legal/status/${id}`,
    tracking: (ticketId: string) => `task-legal/traking/${ticketId}`,
    update: (id: string) => `task-legal/${id}`,
    updateStatus: (id: string, status: number | null) =>
      `task-legal/update-status/${id}/${status}`,
  },
} as const;

export const EndpointsLegalEmployees = {
    Employees: {
        getActiveByCustomer: (customerId: string) => `legal/employees/customer/${customerId}`,
    },
} as const;

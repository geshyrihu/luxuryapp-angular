export const EndpointsLegal = {
  LegalMatters: {
    categories: "legalmattercategory",
    categoryById: (id: string) => `legal-matter/Category/${id}`,
    create: "legal-matter",
    createCategory: "legal-matter/Category",
    delete: (id: string) => `legal-matter/${id}`,
    deleteCategory: (id: string) => `legal-matter/Category/${id}`,
    getAll: "legal-matter",
    getById: (id: string) => `legal-matter/${id}`,
    update: (id: string) => `legal-matter/${id}`,
    updateCategory: (id: string) => `legal-matter/Category/${id}`,
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
} as const;

export const EndpointsLegal = {
  LegalMatters: {
    categories: "legal-matter-category",
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
      `legal-report/GenerateWeeklyReport/${startDate}/${endDate}/${isInternal}`,
    pending: (isExternal: boolean) =>
      `legal-report/Pending/${isExternal ? 1 : 0}`,
    pendingUnassignedData: "legal-report/PendingUnassignedData",
    report: "legal-report/Report",
    requestsAttended: (
      startDate: string,
      endDate: string,
      isInternal: boolean,
    ) => `legal-report/RequestsAttended/${startDate}/${endDate}/${isInternal}`,
    requestsPending: (isInternal: boolean) =>
      `legal-report/RequestsPending/${isInternal}`,
    results: (startDate: string, endDate: string, isInternal: boolean) =>
      `legal-report/Results/${startDate}/${endDate}/${isInternal}`,
    summary: (startDate: string, endDate: string) =>
      `legal-report/Summary/${startDate}/${endDate}`,
    summaryCustomer: (startDate: string, endDate: string) =>
      `legal-report/SummaryCustomer/${startDate}/${endDate}`,
    summaryIndividual: (startDate: string, endDate: string) =>
      `legal-report/SummaryIndividual/${startDate}/${endDate}`,
    totalRequests: (startDate: string, endDate: string) =>
      `legal-report/TotalRequests/${startDate}/${endDate}`,
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
  RefactorLegal: {
    policyContractBuildingInsuranceById: (customerId: any) => `policy-contract/building-insurance/${customerId}`,
      boardDirectorsFinancialReportsById: (customerId: any) => `board-directors/financial-reports/${customerId}`,
    boardDirectorsMeetingMinutesDetailById: (meetingMinuteId: any) => `board-directors/meeting-minutes-detail/${meetingMinuteId}`,
    boardDirectorsMeetingMinutesById: (customerId: any) => `board-directors/meeting-minutes/${customerId}`,
    boardDirectorsMonthlyMeetingsById: (customerId: any) => `board-directors/monthly-meetings/${customerId}`,
},
} as const;

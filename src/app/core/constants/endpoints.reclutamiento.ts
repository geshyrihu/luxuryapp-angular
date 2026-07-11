export const EndpointsReclutamiento = {
  WorkPositions: {
    activate: (id: string) => `work-positions/${id}/activate`,
    assignEmployee: (applicationUserId: string, positionId: string) =>
      `work-positions/assign-employee/${applicationUserId}/${positionId}`,
    delete: (id: string) => `work-positions/${id}`,
    listByCustomer: (customerId: string, state: string) =>
      `work-positions/list-by-customer/${customerId}/${state}`,
    unassignEmployee: (id: string) => `work-positions/${id}/unassign-employee`,
  },
  OrgChart: {
    getTree: (customerId: string) => `WorkPositionOrgChart/tree/${customerId}`,
    reassign: "WorkPositionOrgChart/reassign",
  },
  JobDescriptions: {
    base: "job-descriptions",
    getById: (id: string) => `job-descriptions/${id}`,
    getByWorkPosition: (workPositionId: string) =>
      `job-descriptions/by-workposition/${workPositionId}`,
  },
} as const;

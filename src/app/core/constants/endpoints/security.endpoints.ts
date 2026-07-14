export const EndpointsSecurity = {
  AccessControlScan: {
    scan: "access-controls/credentials/scan",
    activeVisits: "access-controls/visits/active",
  },
  AccessControlAccessPoints: {
    getAll: "access-controls/access-points",
    create: "access-controls/access-points",
    update: (id: string) => `access-controls/access-points/${id}`,
  },
} as const;

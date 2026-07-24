export const EndpointsSecurity = {
  AccessControlScan: {
    scan: "access-controls/credentials/scan",
    activeVisits: "access-controls/visits/active",
  },
  AccessControlAccessPoints: {
    // Alias legacy de compatibilidad.
    // El ownership canonico de este contrato ya corresponde a `EndpointsOperations.AccessControlAccessPoints`.
    getAll: "access-controls/access-points",
    create: "access-controls/access-points",
    update: (id: string) => `access-controls/access-points/${id}`,
  },
} as const;

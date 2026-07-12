export const EndpointsResident = {
  Properties: {
    create: "Property",
    delete: (id: string) => `Property/${id}`,
    getById: (id: string) => `Property/${id}`,
    update: (id: string) => `Property/${id}`,
    downloadTemplate: (customerId: string) => `Property/download-template/${customerId}`,
  },
  ResidentesEdificio: {
    selectByCustomer: (customerId: string) => `residentesedificio/${customerId}`,
  },
  Owner: {
    delete: (id: string) => `owner/${id}`,
    getById: (id: string) => `owner/${id}`,
  },
} as const;

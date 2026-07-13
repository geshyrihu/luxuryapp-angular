export const EndpointsResident = {
  Properties: {
    create: "property",
    delete: (id: string) => `property/${id}`,
    getById: (id: string) => `property/${id}`,
    update: (id: string) => `property/${id}`,
    downloadTemplate: (customerId: string) => `property/download-template/${customerId}`,
  },
  ResidentesEdificio: {
    selectByCustomer: (customerId: string) => `residentesedificio/${customerId}`,
  },
  Owner: {
    delete: (id: string) => `owner/${id}`,
    getById: (id: string) => `owner/${id}`,
  },
  RefactorResident: {
    propertyOccupantById: (id: any) => `property-occupant/${id}`,
      ownerListById: (customerIdS: any) => `owner/list/${customerIdS}`,
    propertyListById: (customerIdS: any) => `property/list/${customerIdS}`,
    propertyImportById: (customerIdS: any) => `property/import/${customerIdS}`,
},
  AccessControlVisits: {
    create: "access-controls/visits",
    getPaged: "access-controls/visits",
    getById: (id: string) => `access-controls/visits/${id}`,
    active: "access-controls/visits/active",
    cancel: (id: string) => `access-controls/visits/${id}/cancel`,
  },
  AccessControlCredentials: {
    generateQr: "access-controls/credentials/qr",
    getById: (id: string) => `access-controls/credentials/${id}`,
    revoke: (id: string) => `access-controls/credentials/${id}/revoke`,
  },
} as const;

export const EndpointsResident = {
  Properties: {
    create: "properties",
    delete: (id: string) => `properties/${id}`,
    getById: (id: string) => `properties/${id}`,
    update: (id: string) => `properties/${id}`,
    downloadTemplate: (customerId: string) => `properties/download-template/${customerId}`,
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
    propertyListById: (customerIdS: any) => `properties/list/${customerIdS}`,
    propertyImportById: (customerIdS: any) => `properties/import/${customerIdS}`,
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
  AccessControlInvitations: {
    send: "access-controls/invitations",
    resend: (id: string) => `access-controls/invitations/${id}/resend`,
    byVisit: (visitId: string) => `access-controls/invitations/by-visit/${visitId}`,
  },
} as const;

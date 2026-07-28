export const EndpointsResident = {
  Properties: {
    create: "properties",
    delete: (id: string) => `properties/${id}`,
    importByCustomer: (customerId: string) => `properties/import/${customerId}`,
    getById: (id: string) => `properties/${id}`,
    listByCustomer: (customerId: string) => `properties/list/${customerId}`,
    update: (id: string) => `properties/${id}`,
    downloadTemplate: (customerId: string) => `properties/download-template/${customerId}`,
  },
  ResidentesEdificio: {
    selectByCustomer: (customerId: string) => `residentes-edificio/${customerId}`,
  },
  Owner: {
    base: "owners",
    delete: (id: string) => `owners/${id}`,
    getById: (id: string) => `owners/${id}`,
    listByCustomer: (customerId: string) => `owners/list/${customerId}`,
  },
  PropertyOccupants: {
    create: "property-occupant",
    delete: (id: string) => `property-occupant/${id}`,
    listByProperty: (propertyId: string) => `property-occupant/list/${propertyId}`,
    update: (id: string) => `property-occupant/${id}`,
  },
  RefactorResident: {
    propertyOccupantById: (id: any) => `property-occupant/${id}`,
      ownerListById: (customerIdS: any) => `owners/list/${customerIdS}`,
    propertyListById: (customerIdS: any) => `properties/list/${customerIdS}`,
    propertyImportById: (customerIdS: any) => `properties/import/${customerIdS}`,
},
} as const;

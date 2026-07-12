export const EndpointsMantenimiento = {
  MaintenanceCalendars: {
    delete: (id: string) => `maintenancecalendars/${id}`,
    get: (id: string) => `MaintenanceCalendars/Get/${id}`,
  },
  MaintenanceReports: {
    weeklyExecutiveReport: "MaintenanceReport/WeeklyExecutiveReport",
  },
  CalendarioMaestroEquipo: {
    base: "CalendarioMaestroEquipo",
    delete: (id: string | number) => `CalendarioMaestroEquipo/${id}`,
    getById: (id: string) => `CalendarioMaestroEquipo/${id}`,
  },
  BitacoraMantenimiento: {
    delete: (id: string) => `BitacoraMantenimiento/${id}`,
  },
  FireInspectionPeriod: {
    getById: (periodId: string) => `FireInspectionPeriod/${periodId}`,
  },
  FireInspectionCycle: {
    active: (periodId: string) => `FireInspectionCycle/active/${periodId}`,
    generate: (periodId: string) => `FireInspectionCycle/generate/${periodId}`,
  },
  FireInspectionPeriodItems: {
    detectorList: (periodId: string) => `FireInspectionPeriodItems/detector/list/${periodId}`,
    detectorDetail: (periodId: string, equipmentId: string) => `FireInspectionPeriodItems/detector/${periodId}/${equipmentId}`,
    detectorDelete: (id: string) => `FireInspectionPeriodItems/detector/${id}`,
    estacionList: (periodId: string) => `FireInspectionPeriodItems/estacion/list/${periodId}`,
    estacionDetail: (periodId: string, equipmentId: string) => `FireInspectionPeriodItems/estacion/${periodId}/${equipmentId}`,
    estacionDelete: (id: string) => `FireInspectionPeriodItems/estacion/${id}`,
    extintorList: (periodId: string) => `FireInspectionPeriodItems/extintor/list/${periodId}`,
    extintorDetail: (periodId: string, equipmentId: string) => `FireInspectionPeriodItems/extintor/${periodId}/${equipmentId}`,
    extintorDelete: (id: string) => `FireInspectionPeriodItems/extintor/${id}`,
    hidranteList: (periodId: string) => `FireInspectionPeriodItems/hidrante/list/${periodId}`,
    hidranteDetail: (periodId: string, equipmentId: string) => `FireInspectionPeriodItems/hidrante/${periodId}/${equipmentId}`,
    hidranteDelete: (id: string) => `FireInspectionPeriodItems/hidrante/${id}`,
  },
  InventarioDetectorHumo: {
    list: (customerId: string) => `InventarioDetectorHumo/list/${customerId}`,
  },
  InventarioEstacionManual: {
    list: (customerId: string) => `InventarioEstacionManual/list/${customerId}`,
  },
  InventarioExtintor: {
    list: (customerId: string) => `InventarioExtintor/list/${customerId}`,
  },
  InventarioHidrante: {
    list: (customerId: string) => `InventarioHidrante/list/${customerId}`,
  },
  ToolLoans: {
    create: "controlprestamoherramientas",
    delete: (id: string | number) => `ControlPrestamoHerramientas/${id}`,
    getById: (id: string | number) => `controlprestamoherramientas/${id}`,
    listByCustomer: (customerId: string) =>
      `ControlPrestamoHerramientas/list/${customerId}`,
    update: (id: string | number) => `controlprestamoherramientas/${id}`,
  },
  Meters: {
    create: "Medidor",
    delete: (id: string | number) => `Medidor/${id}`,
    getById: (id: string | number) => `Medidor/${id}`,
    listByCustomer: (customerId: string) => `Medidor/list/${customerId}`,
    update: (id: string | number) => `Medidor/${id}`,
  },
  MeterReadings: {
    create: "MedidorLectura",
    dailyChart: (medidorId: string, fechaInicial: string, fechaFinal: string) =>
      `MedidorLectura/DataGraficoDiaria/${medidorId}/${fechaInicial}/${fechaFinal}`,
    delete: (id: string | number) => `MedidorLectura/${id}`,
    exportExcel: (id: string | number) => `MedidorLectura/ExportExcel/${id}`,
    getById: (id: string | number) => `MedidorLectura/${id}`,
    lastReading: (medidorId: string) =>
      `MedidorLectura/UltimaLectura/${medidorId}`,
    listByMeter: (medidorId: string) => `MedidorLectura/list/${medidorId}`,
    monthlyChart: (
      medidorId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) =>
      `MedidorLectura/DataGraficoMensual/${medidorId}/${fechaInicial}/${fechaFinal}`,
    update: (id: string | number) => `MedidorLectura/${id}`,
  },
  MeterCategories: {
    create: "MedidorCategoria",
    delete: (id: string) => `medidorcategoria/${id}`,
    getAll: "MedidorCategoria",
    getById: (id: string | number) => `MedidorCategoria/${id}`,
    update: (id: string | number) => `MedidorCategoria/${id}`,
  },
  Piscina: {
    delete: (id: string) => `piscina/${id}`,
  },
  Machineries: {
    delete: (id: string) => `Machineries/${id}`,
    getMachinerySelectItem: (machineryId: string) => `Machineries/GetMachinerySelectItem/${machineryId}`,
    getAutocompleteInv: (customerId: string) => `Machineries/GetAutocompeteInv/${customerId}`,
  },
  EquipmentInspectionDefinitions: {
    byMachinery: (machineryId: string) =>
      `EquipmentInspectionDefinitions/by-machinery/${machineryId}`,
    getById: (id: string) => `EquipmentInspectionDefinitions/${id}`,
    create: "EquipmentInspectionDefinitions",
    update: (id: string) => `EquipmentInspectionDefinitions/${id}`,
    toggleActive: (id: string, isActive: boolean) =>
      `EquipmentInspectionDefinitions/${id}/active/${isActive}`,
    delete: (id: string) => `EquipmentInspectionDefinitions/${id}`,
  },
  EquipmentInspectionExecutions: {
    pending: (customerId: string) =>
      `EquipmentInspectionExecutions/pending/${customerId}`,
    byMachinery: (machineryId: string) =>
      `EquipmentInspectionExecutions/by-machinery/${machineryId}`,
    getById: (id: string) => `EquipmentInspectionExecutions/${id}`,
    startFromQr: "EquipmentInspectionExecutions/start-from-qr",
    startManual: (definitionId: string) =>
      `EquipmentInspectionExecutions/start-manual/${definitionId}`,
    complete: (id: string) => `EquipmentInspectionExecutions/${id}/complete`,
    administrativeUpdate: (id: string) =>
      `EquipmentInspectionExecutions/${id}/administrative-update`,
  },
  EquipmentQrLabels: {
    byMachinery: (machineryId: string) =>
      `EquipmentQrLabels/by-machinery/${machineryId}`,
    getById: (id: string) => `EquipmentQrLabels/${id}`,
    create: "EquipmentQrLabels",
    regenerate: (id: string) => `EquipmentQrLabels/${id}/regenerate`,
    download: (id: string) => `EquipmentQrLabels/${id}/download`,
    downloadBatch: "EquipmentQrLabels/download-batch",
    resolve: (code: string) => `EquipmentQrLabels/resolve/${encodeURIComponent(code)}`,
  },
  MachineryClassification: {
    create: "EquipoClasificacion",
    delete: (id: string) => `equipoclasificacion/${id}`,
    getAll: "EquipoClasificacion",
    getById: (id: string | number) => `EquipoClasificacion/${id}`,
    update: (id: string | number) => `EquipoClasificacion/${id}`,
  },
  CatalogAssets: {
    create: "CatalogAsset",
    delete: (id: string | number) => `CatalogAsset/${id}`,
    getAll: "CatalogAsset",
    getById: (id: string) => `CatalogAsset/${id}`,
    update: (id: string) => `CatalogAsset/${id}`,
  },
  CondominiumAssets: {
    selectByCustomer: (customerId: string) => `CondominiumAsset/${customerId}`,
  },
  InspectionCondominiumAssets: {
    create: "InspectionCondominiumAsset",
    deleteArea: (id: string) => `InspectionCondominiumAsset/DeleteArea/${id}`,
    deleteReview: (reviewId: string) =>
      `InspectionCondominiumAsset/DeleteReview/${reviewId}`,
    getById: (assetId: string) => `InspectionCondominiumAsset/${assetId}`,
    listByInspection: (inspectionId: string) =>
      `InspectionCondominiumAsset/List/${inspectionId}`,
    update: (id: string) => `InspectionCondominiumAsset/${id}`,
  },
  Inspections: {
    create: "Inspection",
    delete: (id: string | number) => `inspection/${id}`,
    getById: (id: string) => `inspection/${id}`,
    listByCustomer: (customerId: string) => `inspection/list/${customerId}`,
    update: (id: string) => `Inspection/${id}`,
  },
  InspectionResults: {
    byUserCustomerAndDate: (
      applicationUserId: string,
      customerId: string,
      formattedDate: string,
    ) =>
      `InspectionResult/GetInspectionsByCustomer/${applicationUserId}/${customerId}/${formattedDate}`,
    getByIdForExecution: (customerInspectionId: string) =>
      `InspectionResult/InspectionResultGetById/${customerInspectionId}`,
    report: (inspectionResultId: string, date?: string) =>
      date
        ? `InspectionResult/Report/${inspectionResultId}/${date}`
        : `InspectionResult/Report/${inspectionResultId}`,
    updateInspectionData: (
      customerInspectionId: string,
      applicationUserId: string,
    ) =>
      `InspectionResult/UpdateInspectionData/${customerInspectionId}/${applicationUserId}`,
  },
  InspectionResultImages: {
    byInspectionResultAndCustomer: (
      inspectionResultId: string,
      customerId: string,
    ) => `InspectionResultImage/${inspectionResultId}/${customerId}`,
    deleteInspectionImage: (imageId: string, customerId: string) =>
      `InspectionResultImage/DeleteInspectionImage/${imageId}/${customerId}`,
  },
  InspectionReviewCatalog: {
    create: "InspectionReviewsCatalog",
    delete: (id: string | number) => `InspectionReviewsCatalog/${id}`,
    getAll: "InspectionReviewsCatalog",
    getById: (id: string) => `InspectionReviewsCatalog/${id}`,
    update: (id: string) => `InspectionReviewsCatalog/${id}`,
  },
  CustomerInspections: {
    selectByCustomer: (customerId: string) =>
      `CustomerInspections/${customerId}`,
  },
} as const;

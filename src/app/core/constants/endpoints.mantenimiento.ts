export const EndpointsMantenimiento = {
  MaintenanceCalendars: {
    delete: (id: string) => `maintenancecalendars/${id}`,
    get: (id: string) => `MaintenanceCalendars/Get/${id}`,
  },
  MaintenanceReports: {
    weeklyExecutiveReport: "maintenance-report/WeeklyExecutiveReport",
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
    getById: (periodId: string) => `fire-inspection-period/${periodId}`,
  },
  FireInspectionCycle: {
    active: (periodId: string) => `fire-inspection-cycle/active/${periodId}`,
    generate: (periodId: string) => `fire-inspection-cycle/generate/${periodId}`,
  },
  FireInspectionPeriodItems: {
    detectorList: (periodId: string) => `fire-inspection-period-items/detector/list/${periodId}`,
    detectorDetail: (periodId: string, equipmentId: string) => `fire-inspection-period-items/detector/${periodId}/${equipmentId}`,
    detectorDelete: (id: string) => `fire-inspection-period-items/detector/${id}`,
    estacionList: (periodId: string) => `fire-inspection-period-items/estacion/list/${periodId}`,
    estacionDetail: (periodId: string, equipmentId: string) => `fire-inspection-period-items/estacion/${periodId}/${equipmentId}`,
    estacionDelete: (id: string) => `fire-inspection-period-items/estacion/${id}`,
    extintorList: (periodId: string) => `fire-inspection-period-items/extintor/list/${periodId}`,
    extintorDetail: (periodId: string, equipmentId: string) => `fire-inspection-period-items/extintor/${periodId}/${equipmentId}`,
    extintorDelete: (id: string) => `fire-inspection-period-items/extintor/${id}`,
    hidranteList: (periodId: string) => `fire-inspection-period-items/hidrante/list/${periodId}`,
    hidranteDetail: (periodId: string, equipmentId: string) => `fire-inspection-period-items/hidrante/${periodId}/${equipmentId}`,
    hidranteDelete: (id: string) => `fire-inspection-period-items/hidrante/${id}`,
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
    delete: (id: string | number) => `control-prestamo-herramientas/${id}`,
    getById: (id: string | number) => `controlprestamoherramientas/${id}`,
    listByCustomer: (customerId: string) =>
      `control-prestamo-herramientas/list/${customerId}`,
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
    create: "medidor-categoria",
    delete: (id: string) => `medidorcategoria/${id}`,
    getAll: "medidor-categoria",
    getById: (id: string | number) => `medidor-categoria/${id}`,
    update: (id: string | number) => `medidor-categoria/${id}`,
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
      `equipment-inspection-definitions/by-machinery/${machineryId}`,
    getById: (id: string) => `equipment-inspection-definitions/${id}`,
    create: "equipment-inspection-definitions",
    update: (id: string) => `equipment-inspection-definitions/${id}`,
    toggleActive: (id: string, isActive: boolean) =>
      `equipment-inspection-definitions/${id}/active/${isActive}`,
    delete: (id: string) => `equipment-inspection-definitions/${id}`,
  },
  EquipmentInspectionExecutions: {
    pending: (customerId: string) =>
      `equipment-inspection-executions/pending/${customerId}`,
    byMachinery: (machineryId: string) =>
      `equipment-inspection-executions/by-machinery/${machineryId}`,
    getById: (id: string) => `equipment-inspection-executions/${id}`,
    startFromQr: "equipment-inspection-executions/start-from-qr",
    startManual: (definitionId: string) =>
      `equipment-inspection-executions/start-manual/${definitionId}`,
    complete: (id: string) => `equipment-inspection-executions/${id}/complete`,
    administrativeUpdate: (id: string) =>
      `equipment-inspection-executions/${id}/administrative-update`,
  },
  EquipmentQrLabels: {
    byMachinery: (machineryId: string) =>
      `equipment-qr-labels/by-machinery/${machineryId}`,
    getById: (id: string) => `equipment-qr-labels/${id}`,
    create: "equipment-qr-labels",
    regenerate: (id: string) => `equipment-qr-labels/${id}/regenerate`,
    download: (id: string) => `equipment-qr-labels/${id}/download`,
    downloadBatch: "equipment-qr-labels/download-batch",
    resolve: (code: string) => `equipment-qr-labels/resolve/${encodeURIComponent(code)}`,
  },
  MachineryClassification: {
    create: "equipo-clasificacion",
    delete: (id: string) => `equipoclasificacion/${id}`,
    getAll: "equipo-clasificacion",
    getById: (id: string | number) => `equipo-clasificacion/${id}`,
    update: (id: string | number) => `equipo-clasificacion/${id}`,
  },
  CatalogAssets: {
    create: "catalog-asset",
    delete: (id: string | number) => `catalog-asset/${id}`,
    getAll: "catalog-asset",
    getById: (id: string) => `catalog-asset/${id}`,
    update: (id: string) => `catalog-asset/${id}`,
  },
  CondominiumAssets: {
    selectByCustomer: (customerId: string) => `CondominiumAsset/${customerId}`,
  },
  InspectionCondominiumAssets: {
    create: "inspection-condominium-asset",
    deleteArea: (id: string) => `inspection-condominium-asset/DeleteArea/${id}`,
    deleteReview: (reviewId: string) =>
      `inspection-condominium-asset/DeleteReview/${reviewId}`,
    getById: (assetId: string) => `inspection-condominium-asset/${assetId}`,
    listByInspection: (inspectionId: string) =>
      `inspection-condominium-asset/List/${inspectionId}`,
    update: (id: string) => `inspection-condominium-asset/${id}`,
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
      `inspection-result/GetInspectionsByCustomer/${applicationUserId}/${customerId}/${formattedDate}`,
    getByIdForExecution: (customerInspectionId: string) =>
      `inspection-result/InspectionResultGetById/${customerInspectionId}`,
    report: (inspectionResultId: string, date?: string) =>
      date
        ? `inspection-result/Report/${inspectionResultId}/${date}`
        : `inspection-result/Report/${inspectionResultId}`,
    updateInspectionData: (
      customerInspectionId: string,
      applicationUserId: string,
    ) =>
      `inspection-result/UpdateInspectionData/${customerInspectionId}/${applicationUserId}`,
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
    create: "inspection-reviews-catalog",
    delete: (id: string | number) => `inspection-reviews-catalog/${id}`,
    getAll: "inspection-reviews-catalog",
    getById: (id: string) => `inspection-reviews-catalog/${id}`,
    update: (id: string) => `inspection-reviews-catalog/${id}`,
  },
  CustomerInspections: {
    selectByCustomer: (customerId: string) =>
      `CustomerInspections/${customerId}`,
  },
} as const;

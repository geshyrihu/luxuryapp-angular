export const EndpointsMantenimiento = {
  MaintenanceCalendars: {
    delete: (id: string) => `maintenance-calendars/${id}`,
    get: (id: string) => `maintenance-calendars/get/${id}`,
  },
  MaintenanceReports: {
    weeklyExecutiveReport: "maintenance-report/weekly-executive-report",
  },
  CalendarioMaestroEquipo: {
    base: "calendario-maestro-equipo",
    delete: (id: string | number) => `calendario-maestro-equipo/${id}`,
    getById: (id: string) => `calendario-maestro-equipo/${id}`,
  },
  BitacoraMantenimiento: {
    delete: (id: string) => `bitacora-mantenimiento/${id}`,
  },
  BitacoraMantenimientoConsultas: {
    bitacoraIndividual: (
      machineryId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) =>
      `bitacora-mantenimiento/bitacora-individual/${machineryId}/${fechaInicial}/${fechaFinal}`,
    listByCustomerAndRange: (
      customerId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) =>
      `bitacora-mantenimiento/list/${customerId}/${fechaInicial}/${fechaFinal}`,
  },
  FireInspectionPeriod: {
    base: "fire-inspection-period",
    delete: (id: string) => `fire-inspection-period/${id}`,
    getById: (periodId: string) => `fire-inspection-period/${periodId}`,
    listByCustomer: (customerId: string) =>
      `fire-inspection-period/list/${customerId}`,
  },
  FireInspectionCycle: {
    active: (periodId: string) => `fire-inspection-cycle/active/${periodId}`,
    generate: (periodId: string) => `fire-inspection-cycle/generate/${periodId}`,
    getById: (cycleId: string) => `fire-inspection-cycle/${cycleId}`,
    listByCustomer: (customerId: string) =>
      `fire-inspection-cycle/list/${customerId}`,
  },
  FireEquipment: {
    resolveById: (id: string) => `fire-equipment/resolve/${id}`,
  },
  FireEquipmentLogs: {
    extintor: {
      base: "bitacora-extintor",
      getById: (id: string) => `bitacora-extintor/${id}`,
      listByEquipment: (extinguisherId: string) =>
        `bitacora-extintor/list/${extinguisherId}`,
    },
    hidrante: {
      base: "bitacora-hidrante",
      getById: (id: string) => `bitacora-hidrante/${id}`,
      listByEquipment: (hydrantId: string) =>
        `bitacora-hidrante/list/${hydrantId}`,
    },
    estacionManual: {
      base: "bitacora-estacion-manual",
      getById: (id: string) => `bitacora-estacion-manual/${id}`,
      listByEquipment: (stationId: string) =>
        `bitacora-estacion-manual/list/${stationId}`,
    },
    detectorHumo: {
      base: "bitacora-detector-humo",
      getById: (id: string) => `bitacora-detector-humo/${id}`,
      listByEquipment: (detectorId: string) =>
        `bitacora-detector-humo/list/${detectorId}`,
    },
  },
  FireCycleInspection: {
    detector: {
      base: "fire-cycle-inspection/detector",
      getByCycleAndEquipment: (cycleId: string, equipmentId: string) =>
        `fire-cycle-inspection/detector/${cycleId}/${equipmentId}`,
    },
    estacion: {
      base: "fire-cycle-inspection/estacion",
      getByCycleAndEquipment: (cycleId: string, equipmentId: string) =>
        `fire-cycle-inspection/estacion/${cycleId}/${equipmentId}`,
    },
    extintor: {
      base: "fire-cycle-inspection/extintor",
      getByCycleAndEquipment: (cycleId: string, equipmentId: string) =>
        `fire-cycle-inspection/extintor/${cycleId}/${equipmentId}`,
    },
    hidrante: {
      base: "fire-cycle-inspection/hidrante",
      getByCycleAndEquipment: (cycleId: string, equipmentId: string) =>
        `fire-cycle-inspection/hidrante/${cycleId}/${equipmentId}`,
    },
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
    list: (customerId: string) => `inventario-detector-humo/list/${customerId}`,
  },
  InventarioEstacionManual: {
    list: (customerId: string) => `inventario-estacion-manual/list/${customerId}`,
  },
  InventarioExtintor: {
    list: (customerId: string) => `inventario-extintor/list/${customerId}`,
  },
  InventarioHidrante: {
    list: (customerId: string) => `inventario-hidrante/list/${customerId}`,
  },
  ToolLoans: {
    create: "control-prestamo-herramientas",
    delete: (id: string | number) => `control-prestamo-herramientas/${id}`,
    getById: (id: string | number) => `control-prestamo-herramientas/${id}`,
    listByCustomer: (customerId: string) =>
      `control-prestamo-herramientas/list/${customerId}`,
    update: (id: string | number) => `control-prestamo-herramientas/${id}`,
  },
  Meters: {
    create: "medidor",
    delete: (id: string | number) => `medidor/${id}`,
    getById: (id: string | number) => `medidor/${id}`,
    listByCustomer: (customerId: string) => `medidor/list/${customerId}`,
    update: (id: string | number) => `medidor/${id}`,
  },
  MeterReadings: {
    create: "medidorlectura",
    adminCreate: "medidorlectura/admin-create-lectura",
    dailyChart: (medidorId: string, fechaInicial: string, fechaFinal: string) =>
      `medidorlectura/data-grafico-diaria/${medidorId}/${fechaInicial}/${fechaFinal}`,
    delete: (id: string | number) => `medidorlectura/${id}`,
    exportExcel: (id: string | number) => `medidorlectura/export-excel/${id}`,
    getById: (id: string | number) => `medidorlectura/${id}`,
    lastReading: (medidorId: string) =>
      `medidorlectura/ultima-lectura/${medidorId}`,
    listByMeter: (medidorId: string) => `medidorlectura/list/${medidorId}`,
    monthlyChart: (
      medidorId: string,
      fechaInicial: string,
      fechaFinal: string,
    ) =>
      `medidorlectura/data-grafico-mensual/${medidorId}/${fechaInicial}/${fechaFinal}`,
    update: (id: string | number) => `medidorlectura/${id}`,
    verifyDailyRecord: (medidorId: string) =>
      `medidorlectura/verificar-registro-del-dia/${medidorId}`,
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
    base: "machineries",
    getAll: (customerId: string) => `machineries/get-all/${customerId}`,
    delete: (id: string) => `machineries/${id}`,
    deleteDocument: (id: string) => `machineries/delete-document/${id}`,
    getById: (id: string) => `machineries/${id}`,
    getMachinerySelectItem: (machineryId: string) => `machineries/get-machinery-select-item/${machineryId}`,
    getAutocompleteInv: (customerId: string) => `machineries/get-autocompete-inv/${customerId}`,
    serviceHistory: (machineryId: string) =>
      `machineries/service-history/${machineryId}`,
    technicalSheet: (id: string) => `machineries/fichatecnica/${id}`,
    uploadDocumentBase: "machineries/subir-documento/",
    uploadDocument: (machineryId: string) =>
      `machineries/subir-documento/${machineryId}`,
  },
  MachineryDocuments: {
    listByMachinery: (machineryId: string) =>
      `machinery-document/list/${machineryId}`,
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
    delete: (id: string) => `equipo-clasificacion/${id}`,
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
    selectByCustomer: (customerId: string) => `condominium-asset/${customerId}`,
  },
  InspectionCondominiumAssets: {
    create: "inspection-condominium-asset",
    deleteArea: (id: string) => `inspection-condominium-asset/delete-area/${id}`,
    deleteReview: (reviewId: string) =>
      `inspection-condominium-asset/delete-review/${reviewId}`,
    getById: (assetId: string) => `inspection-condominium-asset/${assetId}`,
    listByInspection: (inspectionId: string) =>
      `inspection-condominium-asset/list/${inspectionId}`,
    update: (id: string) => `inspection-condominium-asset/${id}`,
  },
  Inspections: {
    create: "inspection",
    delete: (id: string | number) => `inspection/${id}`,
    getById: (id: string) => `inspection/${id}`,
    listByCustomer: (customerId: string) => `inspection/list/${customerId}`,
    update: (id: string) => `inspection/${id}`,
  },
  InspectionResults: {
    byUserCustomerAndDate: (
      applicationUserId: string,
      customerId: string,
      formattedDate: string,
    ) =>
      `inspection-result/get-inspections-by-customer/${applicationUserId}/${customerId}/${formattedDate}`,
    getByIdForExecution: (customerInspectionId: string) =>
      `inspection-result/inspection-result-get-by-id/${customerInspectionId}`,
    report: (inspectionResultId: string, date?: string) =>
      date
        ? `inspection-result/report/${inspectionResultId}/${date}`
        : `inspection-result/report/${inspectionResultId}`,
    updateInspectionData: (
      customerInspectionId: string,
      applicationUserId: string,
    ) =>
      `inspection-result/update-inspection-data/${customerInspectionId}/${applicationUserId}`,
  },
  InspectionResultImages: {
    byInspectionResultAndCustomer: (
      inspectionResultId: string,
      customerId: string,
    ) => `inspection-result-images/${inspectionResultId}/${customerId}`,
    deleteInspectionImage: (imageId: string, customerId: string) =>
      `inspection-result-images/delete-inspection-image/${imageId}/${customerId}`,
  },
  InspectionReviewCatalog: {
    create: "inspection-reviews-catalog",
    delete: (id: string | number) => `inspection-reviews-catalog/${id}`,
    getAll: "inspection-reviews-catalog",
    getById: (id: string) => `inspection-reviews-catalog/${id}`,
    update: (id: string) => `inspection-reviews-catalog/${id}`,
  },
  RecepcionPipasAgua: {
    base: "recepcion-pipas-agua",
    getById: (id: string) => `recepcion-pipas-agua/${id}`,
    listByCustomer: (customerId: string) => `recepcion-pipas-agua/list/${customerId}`,
  },
  ResponsablesCliente: {
    byRole: (customerId: string, role: string) =>
      `responsables-cliente/por-rol?customerId=${customerId}&role=${role}`,
    sugeridosAgenda: (
      customerId: string,
      subjectType: number,
      includeSystems: boolean,
    ) =>
      `responsables-cliente/sugeridos-agenda?customerId=${customerId}&subjectType=${subjectType}&includeSystems=${includeSystems}`,
    jefeMantenimiento: (customerId: string) =>
      `responsables-cliente/por-rol?customerId=${customerId}&role=JefeMantenimiento`,
  },
  CustomerInspections: {
    selectByCustomer: (customerId: string) =>
      `customer-inspections/${customerId}`,
  },
  RefactorMantenimiento: {
    catalogoentregarecepciondescripcionById: (id: any) => `catalogo-entrega-recepcion-descripcion/${id}`,
    machineriesDeleteDocumentById: (id: any) => `machineries/delete-document/${id}`,
    bitacoraExtintorById: (id: any) => `bitacora-extintor/${id}`,
    bitacoraExtintorListById: (extinguisherId: any) => `bitacora-extintor/list/${extinguisherId}`,
    bitacoraHidranteById: (id: any) => `bitacora-hidrante/${id}`,
    bitacoraHidranteListById: (hydrantId: any) => `bitacora-hidrante/list/${hydrantId}`,
    fireCycleInspectionDetectorByIdById: (cycleId: any, equipmentId: any) => `fire-cycle-inspection/detector/${cycleId}/${equipmentId}`,
    fireCycleInspectionEstacionByIdById: (cycleId: any, equipmentId: any) => `fire-cycle-inspection/estacion/${cycleId}/${equipmentId}`,
    fireCycleInspectionExtintorByIdById: (cycleId: any, equipmentId: any) => `fire-cycle-inspection/extintor/${cycleId}/${equipmentId}`,
    fireCycleInspectionHidranteByIdById: (cycleId: any, equipmentId: any) => `fire-cycle-inspection/hidrante/${cycleId}/${equipmentId}`,
    fireInspectionCycleById: (cycleId: any) => `fire-inspection-cycle/${cycleId}`,
    fireEquipmentResolveById: (p0: any) => `fire-equipment/resolve/${p0}`,
    fireInspectionCycleListById: (customerIdS: any) => `fire-inspection-cycle/list/${customerIdS}`,
    fireInspectionPeriodById: (id: any) => `fire-inspection-period/${id}`,
    fireInspectionPeriodListById: (customerIdS: any) => `fire-inspection-period/list/${customerIdS}`,
    bitacoraEstacionManualById: (id: any) => `bitacora-estacion-manual/${id}`,
    bitacoraEstacionManualListById: (stationId: any) => `bitacora-estacion-manual/list/${stationId}`,
    bitacoraDetectorHumoById: (id: any) => `bitacora-detector-humo/${id}`,
    bitacoraDetectorHumoListById: (detectorId: any) => `bitacora-detector-humo/list/${detectorId}`,
    elevatorsEmergencyCallById: (id: any) => `elevators-emergency-call/${id}`,
    elevatorSparePartsChangeById: (id: any) => `elevator-spare-parts-change/${id}`,
    bitacoraMantenimiento: "bitacora-mantenimiento",
    piscina: "piscina",
    piscinaById: (id: any) => `piscina/${id}`,
    piscinabitacoraById: (id: any) => `piscina-bitacora/${id}`,
    recepcionPipasAguaListById: (customerIdS: any) => `recepcion-pipas-agua/list/${customerIdS}`,
    recepcionPipasAguaById: (id: any) => `recepcion-pipas-agua/${id}`,
    responsablesClientePorRolcustomerIdroleJefeMantenimiento: (customerIdS: any) => `responsables-cliente/por-rol?customerId=${customerIdS}&role=JefeMantenimiento`,
    calendarioMaestroById: (id: any) => `calendario-maestro/${id}`,
    calendariomaestroList: "calendario-maestro/list",
    calendariomaestroById: (id: any) => `calendario-maestro/${id}`,
      machineriesFichatecnicaById: (id: any) => `machineries/fichatecnica/${id}`,
    machineriesServiceHistoryById: (config: any) => `machineries/service-history/${config}`,
    machineriesById: (id: any) => `machineries/${id}`,
    machineryDocumentListById: (machineryId: any) => `machinery-document/list/${machineryId}`,
    elevatorsparepartschangeElevatorsById: (config: any) => `elevator-spare-parts-change/elevators/${config}`,
    elevatorsEmergencyCallListById: (customerIdS: any) => `elevators-emergency-call/list/${customerIdS}`,
    elevatorsparepartschangeById: (id: any) => `elevator-spare-parts-change/${id}`,
    elevatorSparePartsChangeListById: (customerIdS: any) => `elevator-spare-parts-change/list/${customerIdS}`,
    bitacoraMantenimientoBitacoraIndividualByIdByIdById: (machineryId: any, fechaInicial: any, fechaFinal: any) => `bitacora-mantenimiento/bitacora-individual/${machineryId}/${fechaInicial}/${fechaFinal}`,
    bitacoraMantenimientoListByIdByIdById: (customerIdS: any, fechaInicial: any, fechaFinal: any) => `bitacora-mantenimiento/list/${customerIdS}/${fechaInicial}/${fechaFinal}`,
    machineriesGetMachinerySelectItemById: (value: any) => `machineries/get-machinery-select-item/${value}`,
    piscinaListById: (customerIdS: any) => `piscina/list/${customerIdS}`,
    piscinabitacoraListById: (piscinaId: any) => `piscina-bitacora/list/${piscinaId}`,
    toolsGetById: (id: any) => `tools/get/${id}`,
    toolsById: (customerIdS: any) => `tools/${customerIdS}`,
    maintenanceReportBitacoraalbercaparametrosByIdById: (customerIdS: any, dateS: any) => `maintenance-report/bitacoraalbercaparametros/${customerIdS}/${dateS}`,
    maintenanceReportEntradaproductoByIdById: (customerIdS: any, dateS: any) => `maintenance-report/entradaproducto/${customerIdS}/${dateS}`,
    maintenanceReportPresatamoherramientaByIdById: (customerIdS: any, dateS: any) => `maintenance-report/presatamoherramienta/${customerIdS}/${dateS}`,
    maintenanceReportBitacoradiariaByIdById: (customerIdS: any, dateS: any) => `maintenance-report/bitacoradiaria/${customerIdS}/${dateS}`,
    maintenanceReportSalidaproductoByIdById: (customerIdS: any, dateS: any) => `maintenance-report/salidaproducto/${customerIdS}/${dateS}`,
    maintenanceReportSolicitudinsumosByIdById: (customerIdS: any, dateS: any) => `maintenance-report/solicitudinsumos/${customerIdS}/${dateS}`,
    maintenanceReportTicketByIdById: (customerId: any, periodo: any) => `maintenance-report/ticket/${customerId}/${periodo}`,
    maintenanceReportTicketResponsableByIdById: (customerId: any, periodo: any) => `maintenance-report/ticket-responsable/${customerId}/${periodo}`,
    maintenanceReportCargaTicketByIdById: (customerId: any, periodo: any) => `maintenance-report/carga-ticket/${customerId}/${periodo}`,
    maintenanceReportResumenByIdById: (customerId: any, periodo: any) => `maintenance-report/resumen/${customerId}/${periodo}`,
    maintenanceReportProveedorByIdById: (customerId: any, periodo: any) => `maintenance-report/proveedor/${customerId}/${periodo}`,
  },
} as const;

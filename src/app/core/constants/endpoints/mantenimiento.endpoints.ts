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
  InspectionQrLabels: {
    byEquipment: (equipmentId: string) =>
      `inspection-qr-labels/by-equipment/${equipmentId}`,
    getById: (id: string) => `inspection-qr-labels/${id}`,
    create: "inspection-qr-labels",
    markPrinted: (id: string) => `inspection-qr-labels/${id}/mark-printed`,
    download: (id: string) => `inspection-qr-labels/${id}/download`,
    downloadBatch: "inspection-qr-labels/download-batch",
    resolve: (code: string) => `inspection-qr-labels/resolve/${encodeURIComponent(code)}`,
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
  InspectionCondominiumAssets: {
    create: "inspection/add-or-update-condominium-asset",
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
    equipmentByCustomer: (customerId: string) => `inspection/equipment/${customerId}`,
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
    selectItems: "inspection-review-catalogs",
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
    fireEquipmentResolveById: (p0: any) => `fire-equipment/resolve/${p0}`,
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
    piscinabitacoraExportExcel: (piscinaId: any) => `piscina-bitacora/export-excel/${piscinaId}`,
    piscinabitacoraImportExcel: (piscinaId: any) => `piscina-bitacora/import-excel/${piscinaId}`,
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

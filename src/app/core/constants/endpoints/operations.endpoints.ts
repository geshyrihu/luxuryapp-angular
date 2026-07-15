export const EndpointsOperations = {
  Tasks: {
    close: "tasks/closed",
    create: "tasks/create",
    deleteByCustomer: (id: string, customerId: string) =>
      `tasks/${id}/${customerId}`,
    getByClosed: (id: string) => `tasks/get-by-closed/${id}`,
    getById: (id: string) => `tasks/${id}`,
    getStatus: (id: string) => `tasks/${id}/status`,
    groupListByCustomer: (customerId: string) => `task-group-list/${customerId}`,
    inProgress: (id: string, applicationUserId: string) =>
      `tickets/in-progress/${id}/${applicationUserId}`,
    inProgressLower: (id: string, applicationUserId: string) =>
      `tasks/in-progress/${id}/${applicationUserId}`,
    legalAll: (customerId?: string) => customerId ? `tasks/legal/all?customer-id=${customerId}` : `tasks/legal/all`,
    legalByCustomer: "tasks/legal/customer",
    legalPending: (isInternal?: boolean, unassigned: boolean = false) => {
      if (unassigned) return "tasks/legal/pending?unassigned=true";
      return isInternal !== undefined ? `tasks/legal/pending?is-internal=${isInternal}` : "tasks/legal/pending";
    },
    list: (ticketGroupId: string, status: string) =>
      `tasks/list/${ticketGroupId}/${status}`,
    myAssignedTickets: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/my-assigned-tasks/${applicationUserId}/${status}/${customerId}`,
    myRequests: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/my-request/${applicationUserId}/${status}/${customerId}`,
    myTicketProgramation: (id: string) => `tasks/my-ticket/programation/${id}`,
    participants: (ticketGroupId: string) => `tasks/participant/${ticketGroupId}`,
    programation: (id: string) => `tasks/programation/${id}`,
    reopen: "tasks/reopen",
    update: (id: string) => `tasks/update/${id}`,
    updateOrder: "tasks/update-order",
    updatePriority: (id: string, applicationUserId: string) =>
      `tasks/update-priority/${id}/${applicationUserId}`,
    updatePriorityLower: (id: string, applicationUserId: string) =>
      `tasks/update-priority/${id}/${applicationUserId}`,
    updateRelevance: (id: string) => `tasks/update-relevance/${id}`,
    updateRelevanceLegacy: (id: string) => `tasks/update-relevance/${id}`,
    updateStatus: (id: string) => `tasks/${id}/status`,
    view: (id: string) => `tasks/view/${id}`,
    availablePredecessors: (groupId: string, excludeId?: string) =>
      excludeId
        ? `tasks/available-predecessors/${groupId}?exclude-id=${excludeId}`
        : `tasks/available-predecessors/${groupId}`,
    setDependency: (taskId: string, predecessorId: string) =>
      `tasks/set-predecessor/${taskId}/${predecessorId}`,
    clearDependency: (taskId: string) => `tasks/clear-predecessor/${taskId}`,
  },
  TaskFollowUps: {
    byMessage: (id: string) => `task-follow-up/by-message/${id}`,
    create: "task-follow-up",
    delete: (id: string) => `task-follow-up/${id}`,
    listByTicketMessage: (ticketMessageId: string) =>
      `task-follow-up/list/${ticketMessageId}`,
  },
  TaskGroupCategories: {
    base: "task-group-categories",
    delete: (id: string | number) => `task-group-categories/${id}`,
    getAll: "task-group-categories",
    getById: (id: string) => `task-group-categories/${id}`,
    selectByCustomer: (customerId: string) => `task-group-category/${customerId}`,
  },
  TaskGroupParticipants: {
    availableByCustomerAndGroup: (customerId: string, taskGroupId: string) =>
      `task-group-participant/participants/${customerId}/${taskGroupId}`,
    base: "task-group-participant",
    delete: (id: string | number) => `task-group-participant/${id}`,
    listByGroup: (taskGroupId: string) => `task-group-participant/${taskGroupId}`,
    update: (id: string) => `task-group-participant/${id}`,
  },
  TaskGroups: {
    base: "task-groups",
    delete: (id: string | number) => `task-groups/${id}`,
    getById: (id: string) => `task-groups/${id}`,
    list: (customerId: string, isActive: boolean, applicationUserId: string) =>
      `task-groups/list/${customerId}/${isActive}/${applicationUserId}`,
    sendReportPendingAll: "tasks/send-report-pending",
    sendReportPendingByGroup: (id: string) => `tasks/send-report-pending/${id}`,
    toggleStatus: (id: string) => `task-groups/toggle-status/${id}`,
  },
  TaskReads: {
    byMessage: (id: string) => `task-reads/by-message/${id}`,
    listByTicketMessage: (ticketMessageId: string) =>
      `task-read/list/${ticketMessageId}`,
  },
  TaskReports: {
    reportClient: (customerId: string, startDate: string, endDate: string) =>
      `task-report/get-report-client/${customerId}/${startDate}/${endDate}`,
    ticketReport: (customerId: string, startDate: string, endDate: string) =>
      `task-report/get-ticket-report/${customerId}/${startDate}/${endDate}`,
    weeklyPreview: (customerId: string, year: number, weekNumber: number) =>
      `task-report/weekly-report-preview/${customerId}/${year}/${weekNumber}`,
    weeklyReport: (
      customerId: string,
      startDate: string | null,
      endDate: string | null,
      status: string | number,
    ) => `task-report/weekly-report/${customerId}/${startDate}/${endDate}/${status}`,
  },
  TaskWorkPlans: {
    create: (
      applicationUserId: string,
      customerId: string,
      year: number,
      weekNumber: number,
    ) => `task-work-plan/create/${applicationUserId}/${customerId}/${year}/${weekNumber}`,
    pending: (customerId: string) => `task-work-plan/pending/${customerId}`,
    preview: (customerId: string, year: number, weekNumber: number) =>
      `task-work-plan/preview/${customerId}/${year}/${weekNumber}`,
  },
  TasksReport: {
    reportClient: (customerId: string, startDate: string, endDate: string) =>
      `tasks/get-report-client/${customerId}/${startDate}/${endDate}`,
  },
  RecurringTasks: {
    Templates: {
      delete: (templateId: string) => `recurring-tasks/templates/${templateId}`,
      getById: (templateId: string) => `recurring-tasks/templates/${templateId}`,
      getActiveList: "recurring-tasks/templates/list/true",
      getByState: (state: boolean) => `recurring-tasks/templates/list/${state}`,
      customerConfig: (customerId: string) =>
        `recurring-tasks/templates/config/${customerId}`,
      itemsByTemplate: (templateId: string) =>
        `recurring-tasks/templates/${templateId}/items`,
      itemById: (itemId: string) => `recurring-tasks/templates/items/${itemId}`,
      reorderItems: (templateId: string) =>
        `recurring-tasks/templates/${templateId}/items/reorder`,
      saveCustomerConfig: "recurring-tasks/templates/config",
    },
  },
  AiAssistant: {
    testProfile: "ai-assistant/test-profile",
    generateImage: "ai-assistant/generate-image",
  },
  AgendaSupervision: {
    create: "agenda-supervision",
    delete: (id: string | number) => `agenda-supervision/${id}`,
    getById: (id: string | number) => `agenda-supervision/${id}`,
    listByDateRange: (startDate: string, endDate: string) =>
      `agenda-supervision/list/${startDate}/${endDate}`,
    update: (id: string | number) => `agenda-supervision/${id}`,
  },
  Birthday: {
    listByCustomerAndMonth: (customerId: string, month: number) =>
      `birthday/${customerId}/${month}`,
  },
  BudgetMaintenance: {
    resumenGastosByCustomer: (customerId: string) =>
      `budget-maintenance/resumengastos/${customerId}`,
    summaryOfExpensesByCustomer: (customerId: string) =>
      `budget-maintenance/summary-of-expenses/${customerId}`,
  },
  Announcements: {
    adminList: "announcements/admin-list",
    analytics: (id: string) => `announcements/${id}/analytics`,
    create: "announcements",
    delete: (id: string) => `announcements/${id}`,
    downloadPdf: (id: string) => `announcements/${id}/pdf`,
    generateDraft: "announcements/generate-draft",
    generateOfficialDraft: "announcements/generate-official-draft",
    getById: (id: string) => `announcements/${id}`,
    update: (id: string) => `announcements/${id}`,
  },
  Dashboard: {
    analyze: "dashboard/analyze",
    filtroMinutasArea: (
      meetingId: string | number,
      area: string | number,
      status: string | number,
    ) => `dashboard/filtro-minutas-area/${meetingId}/${area}/${status}`,
    sendExecutiveReport: (customerId: string) =>
      `dashboard/send-executive-report/${customerId}`,
    globalPendingItems: (customerId: string) =>
      `dashboard/global-pending-items/${customerId}`,
  },
  CommitteePresentations: {
    generalByDate: (date: string) => `presentaciones-junta-comite/generales/${date}/`,
  },
  DiagramDraw: {
    create: "diagram-draw",
    delete: (id: string) => `diagram-draw/${id}`,
    getById: (id: string) => `diagram-draw/${id}`,
    update: (id: string) => `diagram-draw/${id}`,
  },
  Meetings: {
    allPendingMinutas: (customerId: string) =>
      `meetings/minuta-all-pendientes/${customerId}`,
    base: "meetings",
    delete: (id: string) => `meetings/${id}`,
    getById: (id: string) => `meetings/${id}`,
    getDetails: (meetingId: string | null) => `meetings/get-details/${meetingId}`,
    list: (customerId: string, tipoJunta: number) =>
      `meetings/list/${customerId}/${tipoJunta}`,
    reportPdf: (meetingId: string | number) =>
      `meetings/meeting-report-pdf/${meetingId}`,
    seguimientoMinutas: (customerId: string, filtro: number) =>
      `meetings/seguimiento-minutas/${customerId}/${filtro}`,
    sendEmailResponsible: (
      id: any,
      customerId: string,
      area: number,
      applicationUserId: string,
    ) =>
      `meetings/send-email-responsible/${id}/${customerId}/${area}/${applicationUserId}`,
  },
  MeetingsDetails: {
    base: "meetings-details",
    delete: (id: string | number) => `meetings-details/${id}`,
    getById: (id: string | number) => `meetings-details/${id}`,
  },
  MeetingDetailsTracking: {
    base: "meeting-details-seguimientos",
    delete: (id: string | number) => `meeting-details-seguimientos/${id}`,
    exportSummaryToExcel: (meetingId: string | number) =>
      `meeting-details-seguimientos/export-summary-to-excel/${meetingId}`,
    getById: (id: string | number) => `meeting-details-seguimientos/${id}`,
    resumenGrafico: (customerId: string, date: string) =>
      `meeting-details-seguimientos/resumen-preventivos-grafico-presentacion/${customerId}/${date}`,
    resumenGraficoPresentacion: (meetingId: string | number) =>
      `meeting-details-seguimientos/resumen-minutas-grafico-presentacion/${meetingId}`,
    resumenPreventivos: (customerId: string, date: string) =>
      `meeting-details-seguimientos/resumen-preventivos-presentacion/${customerId}/${date}`,
    resumenPresentacion: (meetingId: string | number) =>
      `meeting-details-seguimientos/resumen-minutas-presentacion/${meetingId}`,
    update: (id: string | number) => `meeting-details-seguimientos/${id}`,
  },
  GoogleCalendarEvents: {
    create: "google-calendar-events",
    delete: (id: string) => `google-calendar-events/${id}`,
    getById: (id: string) => `google-calendar-events/${id}`,
    listByCustomer: (customerId: string) =>
      `google-calendar-events/customer/${customerId}`,
    updateSeries: (id: string) => `google-calendar-events/${id}/series`,
  },
  Manuals: {
    createTemplate: "manuals/templates",
    deleteInstance: (id: string) => `manuals/instances/${id}`,
    deleteTemplate: (id: string) => `manuals/templates/${id}`,
    deleteTemplateAttachment: (id: string) =>
      `manuals/templates/attachments/${id}`,
    getInstances: (customerId?: string) =>
      customerId
        ? `manuals/instances?customer-id=${customerId}`
        : "manuals/instances",
    getTemplateById: (id: string) => `manuals/templates/${id}`,
    getTemplates: "manuals/templates",
    updateTemplate: (id: string) => `manuals/templates/${id}`,
    updateTemplateItems: (id: string) => `manuals/templates/${id}/items`,
    uploadInstance: "manuals/instances",
    uploadTemplateAttachment: "manuals/templates/attachments",
    upsertTemplate: "manuals/templates",
  },
  ManualsPasos: {
    addAdjunto: (manualId: string) => `manuals/${manualId}/adjuntos`,
    addEnlace: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/enlaces`,
    addPaso: (manualId: string) => `manuals/${manualId}/pasos`,
    addVersion: (manualId: string) => `manuals/${manualId}/versiones`,
    crearDiagrama: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/diagrama`,
    create: "manuals",
    delete: (id: string) => `manuals/${id}`,
    deleteAdjunto: (manualId: string, adjuntoId: string) =>
      `manuals/${manualId}/adjuntos/${adjuntoId}`,
    deleteDiagrama: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/diagrama`,
    deleteEnlace: (manualId: string, pasoId: string, enlaceId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/enlaces/${enlaceId}`,
    deletePaso: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}`,
    deleteVersion: (manualId: string, versionId: string) =>
      `manuals/${manualId}/versiones/${versionId}`,
    eliminarImagen: (manualId: string, pasoId: string, imagenId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/imagenes/${imagenId}`,
    getAll: "manuals",
    getById: (id: string) => `manuals/${id}`,
    getDiagrama: (diagramaId: string) => `manuals/diagrama/${diagramaId}`,
    reordenarPasos: (manualId: string) =>
      `manuals/${manualId}/pasos/reordenar`,
    subirImagen: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}/imagenes`,
    update: (id: string) => `manuals/${id}`,
    updateDiagrama: (diagramaId: string) => `manuals/diagrama/${diagramaId}`,
    updatePaso: (manualId: string, pasoId: string) =>
      `manuals/${manualId}/pasos/${pasoId}`,
  },
  FinancialReport: {
    listByCustomer: (customerId: string) => `financial-report/list/${customerId}`,
  },
  ResumenGeneral: {
    evaluationAreas: (startDate: string, endDate: string) =>
      `resumen-general/evaluacion-areas/${startDate}/${endDate}`,
    evaluationAreasDetail: (
      date: string,
      area: string | number,
      status: string | number | undefined,
    ) => `resumen-general/evaluacion-areas-detalle/${date}/${area}/${status}`,
    minutasGeneralGroup: (startDate: string, endDate: string) =>
      `resumen-general/resumen-minutas-general-grupo/${startDate}/${endDate}`,
    minutasGeneralList: (startDate: string, endDate: string) =>
      `resumen-general/resumen-minutas-general-lista/${startDate}/${endDate}`,
    position: (startDate: string, endDate: string) =>
      `resumen-general/posicion/${startDate}/${endDate}`,
    reporteResumenMinutas: (
      startDate: string,
      endDate: string,
      reportLevel: string | number,
    ) => `resumen-general/reporte-resumen-minutas/${startDate}/${endDate}/${reportLevel}`,
    reporteResumenMinutasFiltro: (
      startDate: string,
      endDate: string,
      areaMinutasDetalle: string | number,
      reportLevel: string | number,
    ) =>
      `resumen-general/reporte-resumen-minutas-filtro/${startDate}/${endDate}/${areaMinutasDetalle}/${reportLevel}`,
    reporteResumenPreventivos: (startDate: string, endDate: string) =>
      `resumen-general/reporte-resumen-preventivos/${startDate}/${endDate}`,
    reporteResumenTicketByCustomer: (
      customerId: string,
      startDate: string,
      endDate: string,
    ) => `resumen-general/reporte-resumen-ticket/${customerId}/${startDate}/${endDate}`,
    reporteResumenTicket: (startDate: string, endDate: string) =>
      `resumen-general/reporte-resumen-ticket/${startDate}/${endDate}`,
  },
  SupervisionReports: {
    financialStatementsByCustomer: (customerId: string) =>
      `supervision-reports/estados-financieros/${customerId}`,
    pendingLegalByCustomer: (customerId: string) =>
      `supervision-reports/pending-legal/${customerId}`,
    pendingMinutesByCustomer: (customerId: string) =>
      `supervision-reports/pending-minutes/${customerId}`,
    pendingTicketsByCustomer: (customerId: string) =>
      `supervision-reports/pending-tickets/${customerId}`,
  },
  BoardDirectors: {
    financialReportsByCustomer: (customerId: string) =>
      `board-directors/financial-reports/${customerId}`,
    meetingMinuteDetailById: (meetingMinuteId: string | number) =>
      `board-directors/meeting-minutes-detail/${meetingMinuteId}`,
    meetingMinutesByCustomer: (customerId: string) =>
      `board-directors/meeting-minutes/${customerId}`,
    monthlyMeetingsByCustomer: (customerId: string) =>
      `board-directors/monthly-meetings/${customerId}`,
  },
  ManualFlowcharts: {
    create: "manual-flowcharts",
    delete: (id: string) => `manual-flowcharts/${id}`,
    getById: (id: string) => `manual-flowcharts/${id}`,
    update: (id: string) => `manual-flowcharts/${id}`,
  },
  SpecialDocuments: {
    updateOrder: "special-document/update-order",
  },
  CustomDocuments: {
    create: "custom-document",
    delete: (id: string | number) => `custom-document/${id}`,
    getById: (id: string | number) => `custom-document/${id}`,
    listByCustomerAndType: (
      customerId: string,
      documentType: string | number,
    ) => `custom-document/list/${customerId}/${documentType}`,
    update: (id: string | number) => `custom-document/${id}`,
  },
  Almacen: {
    create: "almacen",
    delete: (id: string) => `almacen/${id}`,
    getById: (id: string) => `almacen/${id}`,
    listByCustomer: (customerId: string) => `almacen/customer/${customerId}`,
    myWarehousesByCustomer: (customerId: string) =>
      `almacen/my-warehouses/${customerId}`,
    assignResponsibles: "almacen/assign-responsibles",
  },
  InventoryEngineSystems: {
    listByCustomer: (customerId: string) =>
      `inventory-engine-system/list/${customerId}`,
  },
  MaintenanceCalendars: {
    create: "maintenance-calendars",
    delete: (id: string | number) => `maintenance-calendars/${id}`,
    deleteLegacy: (id: string | number) => `maintenancecalendars/${id}`,
    exportCalendarByCustomer: (customerId: string) =>
      `maintenance-calendars/export-calendar/${customerId}`,
    generalMaintenanceByCustomerAndProvider: (
      customerId: string,
      providerId: string | number,
    ) => `maintenance-calendars/general-mantenimiento/${customerId}/${providerId}`,
    get: (id: string | number) => `maintenance-calendars/get/${id}`,
    listAnnualByCustomerAndMonth: (
      customerId: string,
      month: string | number | null | undefined,
    ) => `maintenance-calendars/list/${customerId}/${month ?? ""}`,
    listProvidersCalendarByCustomer: (customerId: string) =>
      `maintenance-calendars/proveedores-calendario/${customerId}`,
    listServiceByMachinery: (machineryId: string | number) =>
      `maintenance-calendars/list-service/${machineryId}`,
    scheduleAnnualByCustomer: (
      customerId: string,
      filterId?: string | number,
    ) =>
      filterId === undefined || filterId === null || filterId === ""
        ? `maintenance-calendars/cronograma-anual/${customerId}`
        : `maintenance-calendars/cronograma-anual/${customerId}/${filterId}`,
  },
  InventarioProducto: {
    create: "inventario-producto",
    delete: (id: string | number) => `inventario-producto/${id}`,
    getById: (id: string | number) => `inventario-producto/${id}`,
    listByWarehouse: (customerId: string, warehouseId: string | null) =>
      `inventario-producto/get-async-all/${customerId}/${warehouseId}`,
    stockByProductAndWarehouse: (
      customerId: string,
      productId: string,
      warehouseId: string,
    ) =>
      `inventario-producto/get-existencia-producto/${customerId}/${productId}/${warehouseId}`,
    update: (id: string | number) => `inventario-producto/${id}`,
  },
  ProductEntries: {
    create: "entrada-producto",
    delete: (id: string | number) => `entrada-producto/${id}`,
    getById: (id: string) => `entrada-producto/${id}`,
    listByCustomer: (customerId: string) =>
      `entrada-producto/get-entrada-productos/${customerId}`,
    update: (id: string, currentQuantity: number) =>
      `entrada-producto/${id}/${currentQuantity}`,
  },
  ProductOutputs: {
    create: "salidas-productos",
    delete: (id: string | number) => `salidas-productos/${id}`,
    getById: (id: string) => `salidas-productos/${id}`,
    getPaged: (
      customerId: string,
      month?: number,
      year?: number,
      recordsNumber?: number,
      page?: number,
    ) => {
      const params = [`customerId=${customerId}`];
      if (month !== undefined) params.push(`month=${month}`);
      if (year !== undefined) params.push(`year=${year}`);
      if (recordsNumber !== undefined)
        params.push(`RecordsNumber=${recordsNumber}`);
      if (page !== undefined) params.push(`Page=${page}`);
      return `salidas-productos/GetPagedList?${params.join("&")}`;
    },
    returnProduct: "salidaproductos/devolver",
    update: (id: string, currentUsedQuantity: number) =>
      `salidas-productos/${id}/${currentUsedQuantity}`,
  },
  Tickets: {
    pendingProviderReport: (customerId: string, departmentId: string) =>
      `ticket/getreportpendingprovider/${customerId}/${departmentId}`,
  },
  FireExtinguishers: {
    bulkExpirationByCustomer: (customerId: string) =>
      `inventario-extintor/bulk-expiration/${customerId}`,
    create: "inventario-extintor",
    delete: (id: string | number) => `inventario-extintor/${id}`,
    getById: (id: string | number) => `inventario-extintor/${id}`,
    groupedByCustomer: (customerId: string) =>
      `inventario-extintor/get-all-group/${customerId}`,
    listByCustomer: (customerId: string) => `inventario-extintor/list/${customerId}`,
    update: (id: string | number) => `inventario-extintor/${id}`,
  },
  Hydrants: {
    create: "inventario-hidrante",
    delete: (id: string | number) => `inventario-hidrante/${id}`,
    getById: (id: string | number) => `inventario-hidrante/${id}`,
    importByCustomer: (customerId: string) =>
      `InventarioHidrante/import/${customerId}`,
    listByCustomer: (customerId: string) => `inventario-hidrante/list/${customerId}`,
    update: (id: string | number) => `inventario-hidrante/${id}`,
  },
  KeyInventory: {
    create: "inventario-llave",
    delete: (id: string | number) => `inventario-llave/${id}`,
    getById: (id: string | number) => `inventario-llave/${id}`,
    listByCustomer: (customerId: string) => `inventario-llave/list/${customerId}`,
    update: (id: string | number) => `inventario-llave/${id}`,
  },
  ManualCallPoints: {
    create: "inventario-estacion-manual",
    delete: (id: string | number) => `inventario-estacion-manual/${id}`,
    getById: (id: string | number) => `inventario-estacion-manual/${id}`,
    importByCustomer: (customerId: string) =>
      `InventarioEstacionManual/import/${customerId}`,
    listByCustomer: (customerId: string) =>
      `inventario-estacion-manual/list/${customerId}`,
    update: (id: string | number) => `inventario-estacion-manual/${id}`,
  },
  SmokeDetectors: {
    create: "inventario-detector-humo",
    delete: (id: string | number) => `inventario-detector-humo/${id}`,
    getById: (id: string | number) => `inventario-detector-humo/${id}`,
    importByCustomer: (customerId: string) =>
      `InventarioDetectorHumo/import/${customerId}`,
    listByCustomer: (customerId: string) =>
      `inventario-detector-humo/list/${customerId}`,
    update: (id: string | number) => `inventario-detector-humo/${id}`,
  },
  PanicAlerts: {
    attend: (id: string) => `panic-alerts/${id}/attend`,
    resolve: (id: string) => `panic-alerts/${id}/resolve`,
  },
  Tools: {
    delete: (id: string) => `tools/${id}`,
  },
  RadioCommunication: {
    create: "radios-comunicacion",
    delete: (id: string | number) => `radios-comunicacion/${id}`,
    getById: (id: string) => `radios-comunicacion/${id}`,
    listByCustomer: (customerId: string) =>
      `radios-comunicacion/list/${customerId}`,
    update: (id: string) => `radios-comunicacion/${id}`,
  },
  ServiceOrders: {
    uploadImg: (serviceOrderId: string) => `service-orders/subir-img/${serviceOrderId}`,
    create: "service-orders",
    delete: (id: string | number) => `service-orders/${id}`,
    deleteDocument: (id: string | number) => `service-orders/delete-document/${id}`,
    deleteImg: (id: string | number) => `service-orders/delete-img/${id}`,
    getById: (id: string | number) => `service-orders/${id}`,
    listByCustomerAndDate: (customerId: string, date: string) =>
      `service-orders/list/${customerId}/${date}`,
    listPintura: (customerId: string, date: string) =>
      `service-orders/list-pintura/${customerId}/${date}`,
    photos: (id: string, customerId: string) =>
      `service-orders/ordenes-servicio-fotos/${id}/${customerId}`,
    reporte: (customerId: string, periodo: string) =>
      `service-orders/reporte-ordenes-servicio/${customerId}/${periodo}`,
    reporteProveedor: (id: string, customerId: string) =>
      `service-orders/ordenes-servicio-reporte-proveedor/${id}/${customerId}`,
    soporte: (id: string) => `service-orders/soporte-orden-servicio/${id}`,
  },
  ApprovalRules: {
    matrix: "approval-rules/matrix",
  },
  EntregaRecepcion: {
    base: "catalogo-entrega-recepcion-descripcion",
    getByClient: (id: string) => `entrega-recepcion-cliente/${id}`,
    getById: (id: string) => `catalogo-entrega-recepcion-descripcion/${id}`,
    grupos: "catalogo-entrega-recepcion-descripcion/grupos",
    updateClient: (id: string, userId: string, customerId: string) =>
      `entrega-recepcion-cliente/${id}/${userId}/${customerId}`,
  },
  EntregaRecepcionCliente: {
    deleteFile: (id: string) => `entrega-recepcion-cliente/delete-file/${id}`,
    generateData: "entrega-recepcion-cliente/generate-data",
    getByCustomerAndDepartment: (customerId: string, department: string) =>
      `entrega-recepcion-cliente/${customerId}/${department}`,
    invalidateFile: (id: string) =>
      `entrega-recepcion-cliente/invalidar-archivo/${id}`,
    validateFile: (applicationUserId: string, id: string) =>
      `entrega-recepcion-cliente/validar-archivo/${applicationUserId}/${id}`,
  },
  EntregaRecepcionReports: {
    equipmentInventoryByCustomer: (customerId: string) =>
      `entrega-recepcion/inventario-equipos/${customerId}`,
    toolsInventoryByCustomer: (customerId: string) =>
      `entrega-recepcion/inventario-herramientas/${customerId}`,
    fireExtinguishersByCustomer: (customerId: string) =>
      `entrega-recepcion/extintores/${customerId}`,
    facilitiesInventoryByCustomer: (customerId: string) =>
      `entrega-recepcion/inventario-instalaciones/${customerId}`,
    suppliesInventoryByCustomer: (customerId: string) =>
      `entrega-recepcion/inventario-insumos/${customerId}`,
    keysInventoryByCustomer: (customerId: string) =>
      `entrega-recepcion/inventario-llaves/${customerId}`,
    pendingMaintenanceByCustomer: (customerId: string) =>
      `entrega-recepcion/pendientes/${customerId}`,
    maintenanceInventoryByCustomer: (customerId: string) =>
      `entrega-recepcion/inventario-mantenimientos/${customerId}`,
    organizationChartByCustomer: (customerId: string) =>
      `entrega-recepcion/organigrama/${customerId}`,
  },
  RefactorOperations: {
    dashboardSendExecutiveReportById: (customerId: any) => `dashboard/send-executive-report/${customerId}`,
    diagramDrawById: (id: any) => `diagram-draw/${id}`,
    serviceOrdersById: (id: any) => `service-orders/${id}`,
    birthdayByIdById: (customerIdS: any, selectedMonth: any) => `birthday/${customerIdS}/${selectedMonth}`,
    maintenancecalendarsById: (id: any) => `maintenancecalendars/${id}`,
    maintenanceCalendarsExportCalendarById: (customerIdS: any) => `maintenance-calendars/export-calendar/${customerIdS}`,
    googleCalendarEventsById: (id: any) => `google-calendar-events/${id}`,
    inventarioExtintorBulkExpirationById: (customerIdS: any) => `inventario-extintor/bulk-expiration/${customerIdS}`,
    inventarioExtintor: "inventario-extintor",
    inventarioExtintorById: (id: any) => `inventario-extintor/${id}`,
    inventarioHidranteById: (id: any) => `inventario-hidrante/${id}`,
    inventarioHidrante: "inventario-hidrante",
    inventarioHidranteListById: (customerIdS: any) => `inventario-hidrante/list/${customerIdS}`,
    inventarioLlaveById: (id: any) => `inventario-llave/${id}`,
    inventarioEstacionManualById: (id: any) => `inventario-estacion-manual/${id}`,
    inventarioEstacionManual: "inventario-estacion-manual",
    inventarioEstacionManualListById: (customerIdS: any) => `inventario-estacion-manual/list/${customerIdS}`,
    entradaproductoById: (id: any) => `entradaproducto/${id}`,
    salidaProductos: "salidas-productos",
    salidaProductosByIdById: (id: any, cantidadActualUsada: any) => `salidas-productos/${id}/${cantidadActualUsada}`,
    salidaproductosById: (id: any) => `salidaproductos/${id}`,
    salidaproductosDevolver: "salidaproductos/devolver",
    radioComunicacionById: (id: any) => `radios-comunicacion/${id}`,
    inventarioDetectorHumoById: (id: any) => `inventario-detector-humo/${id}`,
    inventarioDetectorHumo: "inventario-detector-humo",
    inventarioDetectorHumoListById: (customerIdS: any) => `inventario-detector-humo/list/${customerIdS}`,
    inventarioProducto: "inventario-producto",
    inventarioProductoById: (id: any) => `inventario-producto/${id}`,
    policyContractBuildingInsuranceById: (customerId: any) => `policy-contract/building-insurance/${customerId}`,
    agendaSupervisionById: (id: any) => `agenda-supervision/${id}`,
    resumenGeneralResumenMinutasGeneralListaByIdById: (fehcaInicio: any, fechaFinal: any) => `resumen-general/resumen-minutas-general-lista/${fehcaInicio}/${fechaFinal}`,
    resumenGeneralResumenMinutasGeneralGrupoByIdById: (fehcaInicio: any, fechaFinal: any) => `resumen-general/resumen-minutas-general-grupo/${fehcaInicio}/${fechaFinal}`,
    supervisionReportsPendingMinutesById: (customerId: any) => `supervision-reports/pending-minutes/${customerId}`,
    supervisionReportsPendingTicketsById: (customerId: any) => `supervision-reports/pending-tickets/${customerId}`,
    supervisionReportsPendingLegalById: (customerId: any) => `supervision-reports/pending-legal/${customerId}`,
    supervisionReportsEstadosFinancierosById: (customerId: any) => `supervision-reports/estados-financieros/${customerId}`,
    recurringTasksTemplatesItemsById: (itemId: any) => `recurring-tasks/templates/items/${itemId}`,
    recurringTasksTemplatesByIdItemsReorder: (templateId: any) => `recurring-tasks/templates/${templateId}/items/reorder`,
    customdocument: "custom-document",
    customdocumentById: (id: any) => `custom-document/${id}`,
      customdocumentListByIdById: (customerId: any, p1: any) => `custom-document/list/${customerId}/${p1}`,
    dashboardGlobalPendingItemsById: (customerId: any) => `dashboard/global-pending-items/${customerId}`,
    maintenanceCalendarsProveedoresCalendarioById: (customerIdS: any) => `maintenance-calendars/proveedores-calendario/${customerIdS}`,
    maintenanceCalendarsGeneralMantenimientoByIdById: (customerIdS: any, providerIdControl: any) => `maintenance-calendars/general-mantenimiento/${customerIdS}/${providerIdControl}`,
    maintenanceCalendarsListByIdById: (customerIdS: any, monthControl: any) => `maintenance-calendars/list/${customerIdS}/${monthControl}`,
    maintenanceCalendarsCronogramaAnualById: (customerId: any) => `maintenance-calendars/cronograma-anual/${customerId}`,
    inventarioExtintorGetAllGroupById: (customerIdS: any) => `inventario-extintor/get-all-group/${customerIdS}`,
    inventarioExtintorListById: (customerIdS: any) => `inventario-extintor/list/${customerIdS}`,
    inventoryEngineSystemListById: (customerIdS: any) => `inventory-engine-system/list/${customerIdS}`,
    maintenanceCalendarsListServiceById: (idMachinery: any) => `maintenance-calendars/list-service/${idMachinery}`,
    maintenanceCalendarsById: (Id: any) => `maintenance-calendars/${Id}`,
    inventarioLlaveListById: (customerIdS: any) => `inventario-llave/list/${customerIdS}`,
    entradaProductoById: (id: any) => `entrada-producto/${id}`,
    entradaProductoGetEntradaProductosById: (customerIdS: any) => `entrada-producto/get-entrada-productos/${customerIdS}`,
    inventarioProductoGetExistenciaProductoByIdByIdById: (customerIdS: any, config: any, config2: any) => `inventario-producto/get-existencia-producto/${customerIdS}/${config}/${config2}`,
    salidaProductosById: (id: any) => `salidas-productos/${id}`,
    radioComunicacionListById: (customerIdS: any) => `radios-comunicacion/list/${customerIdS}`,
    inventarioProductoGetAsyncAllByIdById: (customerId: any, almacenIdFromRoute: any) => `inventario-producto/get-async-all/${customerId}/${almacenIdFromRoute}`,
    financialReportListById: (customerIdS: any) => `financial-report/list/${customerIdS}`,
    boardDirectorsFinancialReportsById: (customerId: any) => `board-directors/financial-reports/${customerId}`,
    boardDirectorsMeetingMinutesDetailById: (meetingMinuteId: any) => `board-directors/meeting-minutes-detail/${meetingMinuteId}`,
    boardDirectorsMeetingMinutesById: (customerId: any) => `board-directors/meeting-minutes/${customerId}`,
    boardDirectorsMonthlyMeetingsById: (customerId: any) => `board-directors/monthly-meetings/${customerId}`,
    entregarecepcionInventarioequiposById: (customerIdS: any) => `entrega-recepcion/inventario-equipos/${customerIdS}`,
    entregaRecepcionInventarioHerramientasById: (customerIdS: any) => `entrega-recepcion/inventario-herramientas/${customerIdS}`,
    entregaRecepcionExtintoresById: (customerIdS: any) => `entrega-recepcion/extintores/${customerIdS}`,
    entregaRecepcionInventarioInstalacionesById: (customerIdS: any) => `entrega-recepcion/inventario-instalaciones/${customerIdS}`,
    entregaRecepcionInventarioInsumosById: (customerIdS: any) => `entrega-recepcion/inventario-insumos/${customerIdS}`,
    entregaRecepcionInventarioLlavesById: (customerIdS: any) => `entrega-recepcion/inventario-llaves/${customerIdS}`,
    EntregaRecepcionPendientesById: (customerIdS: any) => `entrega-recepcion/pendientes/${customerIdS}`,
    entregaRecepcionInventarioMantenimientosById: (customerIdS: any) => `entrega-recepcion/inventario-mantenimientos/${customerIdS}`,
    entregaRecepcionOrganigramaById: (customerIdS: any) => `entrega-recepcion/organigrama/${customerIdS}`,
    miEdificioCaratulaById: (customerIdS: any) => `mi-edificio/caratula/${customerIdS}`,
    policyContractListById: (customerIdS: any) => `policy-contract/list/${customerIdS}`,
    budgetMaintenanceSummaryOfExpensesById: (customerIdS: any) => `budget-maintenance/summary-of-expenses/${customerIdS}`,
    budgetMaintenanceResumengastosById: (customerIdS: any) => `budget-maintenance/resumengastos/${customerIdS}`,
    taskReportGetReportClientByIdByIdById: (customer: any, inicio: any, final: any) => `task-report/get-report-client/${customer}/${inicio}/${final}`,
    tasksGetReportClientByIdByIdById: (customer: any, inicio: any, final: any) => `tasks/get-report-client/${customer}/${inicio}/${final}`,
    meetingsMeetingReportPdfById: (meetingId: any) => `meetings/meeting-report-pdf/${meetingId}`,
    customersById: (customerId: any) => `customers/${customerId}`,
    ticketGetreportpendingproviderByIdById: (customerId: any, departamentId: any) => `ticket/getreportpendingprovider/${customerId}/${departamentId}`,
    agendaSupervisionListByIdById: (fechaInicial: any, fechaFinal: any) => `agenda-supervision/list/${fechaInicial}/${fechaFinal}`,
    dashboardFiltroMinutasAreaByIdByIdById: (meetingId: any, area: any, estatus: any) => `dashboard/filtro-minutas-area/${meetingId}/${area}/${estatus}`,
    presentacionJuntaComiteGeneralesById: (inicial: any) => `presentaciones-junta-comite/generales/${inicial}/`,
    resumenGeneralReporteResumenTicketByIdByIdById: (customerIdS: any, dateS: any, dateS2: any) => `resumen-general/reporte-resumen-ticket/${customerIdS}/${dateS}/${dateS2}`,
    resumenGeneralReporteResumenMinutasByIdByIdById: (dateS: any, dateS2: any, nivelReporte: any) => `resumen-general/reporte-resumen-minutas/${dateS}/${dateS2}/${nivelReporte}`,
    resumenGeneralReporteResumenMinutasFiltroByIdByIdByIdById: (dateS: any, dateS2: any, AreaMinutasDetalles: any, nivelReporte: any) => `resumen-general/reporte-resumen-minutas-filtro/${dateS}/${dateS2}/${AreaMinutasDetalles}/${nivelReporte}`,
    resumenGeneralReporteResumenPreventivosByIdById: (dateS: any, dateS2: any) => `resumen-general/reporte-resumen-preventivos/${dateS}/${dateS2}`,
    resumenGeneralReporteResumenTicketByIdById: (dateS: any, dateS2: any) => `resumen-general/reporte-resumen-ticket/${dateS}/${dateS2}`,
    resumenGeneralEvaluacionAreasDetalleByIdByIdById: (fecha: any, area: any, status: any) => `resumen-general/evaluacion-areas-detalle/${fecha}/${area}/${status}`,
    resumenGeneralEvaluacionAreasByIdById: (fechaInicio: any, fechaFinal: any) => `resumen-general/evaluacion-areas/${fechaInicio}/${fechaFinal}`,
    resumenGeneralPosicionByIdById: (fechaInicio: any, fechaFinal: any) => `resumen-general/posicion/${fechaInicio}/${fechaFinal}`,
    recurringTasksTemplatesListById: (state: any) => `recurring-tasks/templates/list/${state}`,
    ticketsMessageInNotReadById: (authS: any) => `tickets/message-in-not-read/${authS}`,
},
} as const;

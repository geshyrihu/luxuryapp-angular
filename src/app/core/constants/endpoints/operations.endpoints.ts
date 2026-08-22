export const EndpointsOperations = {
  AccessControlOperations: {
    // Ownership canonico: OperationsLuxuryApp.
    // Consumido tambien por admin.luxuryapp como portal supervisor.
    events: "access-controls/events",
    eventsExport: "access-controls/events/export",
    occupancy: "access-controls/dashboard/occupancy",
    stats: "access-controls/dashboard/stats",
  },
  AccessControlAccessPoints: {
    // Ownership canonico: OperationsLuxuryApp.
    // Consumido por security.luxuryapp y admin.luxuryapp.
    getAll: "access-controls/access-points",
    create: "access-controls/access-points",
    update: (id: string) => `access-controls/access-points/${id}`,
  },
  AccessControlVisits: {
    // Ownership canonico: OperationsLuxuryApp.
    // Consumido principalmente por resident.luxuryapp y parcialmente por security.luxuryapp.
    create: "access-controls/visits",
    getPaged: "access-controls/visits",
    getById: (id: string) => `access-controls/visits/${id}`,
    active: "access-controls/visits/active",
    cancel: (id: string) => `access-controls/visits/${id}/cancel`,
  },
  AccessControlCredentials: {
    // Ownership canonico: OperationsLuxuryApp.
    generateQr: "access-controls/credentials/qr",
    getById: (id: string) => `access-controls/credentials/${id}`,
    revoke: (id: string) => `access-controls/credentials/${id}/revoke`,
  },
  AccessControlInvitations: {
    // Ownership canonico: OperationsLuxuryApp.
    send: "access-controls/invitations",
    resend: (id: string) => `access-controls/invitations/${id}/resend`,
    byVisit: (visitId: string) => `access-controls/invitations/by-visit/${visitId}`,
  },
  AccessControlVisitors: {
    // Ownership canonico: OperationsLuxuryApp.
    // Consumido tambien por admin.luxuryapp como portal supervisor.
    getAll: "access-controls/visitors",
    getById: (id: string) => `access-controls/visitors/${id}`,
    create: "access-controls/visitors",
    update: (id: string) => `access-controls/visitors/${id}`,
  },
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
  TaskChecklistItems: {
    byTask: (tasksId: string) => `task-checklist-items/by-task/${tasksId}`,
    base: "task-checklist-items",
    toggleDone: (id: string) => `task-checklist-items/toggle-done/${id}`,
    delete: (id: string) => `task-checklist-items/${id}`,
  },
  TaskAttachments: {
    byTask: (tasksId: string) => `task-attachments/by-task/${tasksId}`,
    upload: "task-attachments",
    delete: (id: string) => `task-attachments/${id}`,
  },
  TaskJustifications: {
    byTask: (tasksId: string) => `task-justifications/by-task/${tasksId}`,
    request: "task-justifications",
    approve: (id: string) => `task-justifications/${id}/approve`,
    reject: (id: string) => `task-justifications/${id}/reject`,
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
  RecurringTaskCompliance: {
    dashboard: (customerId: string) =>
      `recurring-task-compliance/dashboard/${customerId}`,
  },
  TaskReads: {
    byMessage: (id: string) => `task-reads/by-message/${id}`,
    listByTicketMessage: (ticketMessageId: string) =>
      `task-message-read/list/${ticketMessageId}`,
  },
  TaskReports: {
    reportClient: (customerId: string, startDate: string, endDate: string) =>
      `task-report/get-report-client/${customerId}/${startDate}/${endDate}`,
    ticketReport: (customerId: string, startDate: string, endDate: string) =>
      `task-report/get-task-report/${customerId}/${startDate}/${endDate}`,
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
  RecurringTaskCatalog: {
    base: "recurring-task-templates",
    getById: (id: string) => `recurring-task-templates/${id}`,
    list: (customerId: string, workGroupId?: string, activeOnly?: boolean) => {
      const params = new URLSearchParams({ customerId });

      if (workGroupId) params.set("workGroupId", workGroupId);
      if (activeOnly !== undefined) {
        params.set("activeOnly", String(activeOnly));
      }

      return `recurring-task-templates?${params.toString()}`;
    },
    toggleStatus: (id: string) => `recurring-task-templates/${id}/toggle-status`,
  },
  AiAssistant: {
    // Alias legacy.
    // El ownership canonico de este contrato ya corresponde a `EndpointsShared.AiAssistant`.
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
      `budget-maintenance/resumen-gastos/${customerId}`,
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
  Gantt: {
    byCustomer: (customerId: string) => `gantt/${customerId}`,
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
    detailFilter: (meetingId: string | number, status: string | number) =>
      `meetings-details/detalles-filtro/${meetingId}/${status}`,
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
    resultGeneral: (startDate: string, endDate: string) =>
      `resumen-general/resultado-general/${startDate}/${endDate}`,
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
    filtroDto: "resumen-general/filtro-dto",
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
  MiEdificio: {
    caratulaByCustomer: (customerId: string) => `mi-edificio/caratula/${customerId}`,
  },
  SpecialDocuments: {
    updateOrder: "special-document/update-order",
  },
  CustomDocuments: {
    create: "custom-documents",
    delete: (id: string | number) => `custom-documents/${id}`,
    getById: (id: string | number) => `custom-documents/${id}`,
    listByCustomerAndType: (
      customerId: string,
      documentType: string | number,
    ) => `custom-documents/list/${customerId}/${documentType}`,
    update: (id: string | number) => `custom-documents/${id}`,
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
    listByWarehousePaged: (customerId: string, warehouseId: string | null) =>
      `inventario-producto/get-async-all-paged/${customerId}/${warehouseId}`,
    productDropdownPaged: `inventario-producto/get-producto-dropdown-paged`,
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
      return `salidas-productos/get-paged-list?${params.join("&")}`;
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
    deleteAllByCustomer: (customerId: string) =>
      `inventario-estacion-manual/all/${customerId}`,
    getById: (id: string | number) => `inventario-estacion-manual/${id}`,
    importByCustomer: (customerId: string) =>
      `inventario-estacion-manual/import/${customerId}`,
    listByCustomer: (customerId: string) =>
      `inventario-estacion-manual/list/${customerId}`,
    update: (id: string | number) => `inventario-estacion-manual/${id}`,
  },
  SmokeDetectors: {
    create: "inventario-detector-humo",
    delete: (id: string | number) => `inventario-detector-humo/${id}`,
    deleteAllByCustomer: (customerId: string) =>
      `inventario-detector-humo/all/${customerId}`,
    getById: (id: string | number) => `inventario-detector-humo/${id}`,
    importByCustomer: (customerId: string) =>
      `inventario-detector-humo/import/${customerId}`,
    listByCustomer: (customerId: string) =>
      `inventario-detector-humo/list/${customerId}`,
    update: (id: string | number) => `inventario-detector-humo/${id}`,
  },
  PanicAlerts: {
    active: "panic-alerts/active",
    create: "panic-alerts",
    history: "panic-alerts/history",
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
    delete: (id: string) => `catalogo-entrega-recepcion-descripcion/${id}`,
    getByClient: (id: string) => `entrega-recepcion-cliente/${id}`,
    getById: (id: string) => `catalogo-entrega-recepcion-descripcion/${id}`,
    grupos: "catalogo-entrega-recepcion-descripcion/grupos",
    updateClient: (id: string, userId: string, customerId: string) =>
      `entrega-recepcion-cliente/${id}/${userId}/${customerId}`,
  },
  EntregaRecepcionDescripcion: {
    getById: (id: string) => `entrega-recepcion-descripcion/${id}`,
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
} as const;

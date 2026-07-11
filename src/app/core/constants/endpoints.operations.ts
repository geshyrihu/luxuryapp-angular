export const EndpointsOperations = {
  Tasks: {
    close: "tasks/Closed",
    create: "tasks/Create",
    deleteByCustomer: (id: string, customerId: string) =>
      `tasks/${id}/${customerId}`,
    getByClosed: (id: string) => `tasks/GetByClosed/${id}`,
    getById: (id: string) => `tasks/${id}`,
    getStatus: (id: string) => `tasks/${id}/status`,
    groupListByCustomer: (customerId: string) => `task-group-list/${customerId}`,
    inProgress: (id: string, applicationUserId: string) =>
      `Tickets/InProgress/${id}/${applicationUserId}`,
    inProgressLower: (id: string, applicationUserId: string) =>
      `tasks/in-progress/${id}/${applicationUserId}`,
    legalAll: (customerId?: string) => customerId ? `tasks/legal/all?customerId=${customerId}` : `tasks/legal/all`,
    legalByCustomer: "tasks/legal/customer",
    legalPending: (isInternal?: boolean, unassigned: boolean = false) => {
      if (unassigned) return "tasks/legal/pending?unassigned=true";
      return isInternal !== undefined ? `tasks/legal/pending?isInternal=${isInternal}` : "tasks/legal/pending";
    },
    list: (ticketGroupId: string, status: string) =>
      `tasks/List/${ticketGroupId}/${status}`,
    myAssignedTickets: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/my-assigned-tasks/${applicationUserId}/${status}/${customerId}`,
    myRequests: (
      applicationUserId: string,
      status: string,
      customerId: string,
    ) => `tasks/MyRequest/${applicationUserId}/${status}/${customerId}`,
    myTicketProgramation: (id: string) => `tasks/MyTicket/Programation/${id}`,
    participants: (ticketGroupId: string) => `tasks/participant/${ticketGroupId}`,
    programation: (id: string) => `tasks/Programation/${id}`,
    reopen: "tasks/Reopen",
    update: (id: string) => `tasks/Update/${id}`,
    updateOrder: "tasks/UpdateOrder",
    updatePriority: (id: string, applicationUserId: string) =>
      `tasks/UpdatePriority/${id}/${applicationUserId}`,
    updatePriorityLower: (id: string, applicationUserId: string) =>
      `tasks/update-priority/${id}/${applicationUserId}`,
    updateRelevance: (id: string) => `tasks/update-relevance/${id}`,
    updateRelevanceLegacy: (id: string) => `tasks/UpdateRelevance/${id}`,
    updateStatus: (id: string) => `tasks/${id}/status`,
    view: (id: string) => `tasks/view/${id}`,
    availablePredecessors: (groupId: string, excludeId?: string) =>
      excludeId
        ? `tasks/available-predecessors/${groupId}?excludeId=${excludeId}`
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
      `task-follow-up/List/${ticketMessageId}`,
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
      `task-group-participant/Participants/${customerId}/${taskGroupId}`,
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
      `task-groups/List/${customerId}/${isActive}/${applicationUserId}`,
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
    ticketReport: (customerId: string, startDate: string, endDate: string) =>
      `task-report/GetTicketReport/${customerId}/${startDate}/${endDate}`,
    weeklyPreview: (customerId: string, year: number, weekNumber: number) =>
      `task-report/WeeklyReportPreview/${customerId}/${year}/${weekNumber}`,
    weeklyReport: (
      customerId: string,
      startDate: string | null,
      endDate: string | null,
      status: string | number,
    ) => `task-report/WeeklyReport/${customerId}/${startDate}/${endDate}/${status}`,
  },
  TaskWorkPlans: {
    create: (
      applicationUserId: string,
      customerId: string,
      year: number,
      weekNumber: number,
    ) => `task-work-plan/Create/${applicationUserId}/${customerId}/${year}/${weekNumber}`,
    pending: (customerId: string) => `task-work-plan/pending/${customerId}`,
    preview: (customerId: string, year: number, weekNumber: number) =>
      `task-work-plan/preview/${customerId}/${year}/${weekNumber}`,
  },
  RecurringTasks: {
    Templates: {
      getActiveList: "recurring-tasks/templates/list/true",
      customerConfig: (customerId: string) =>
        `recurring-tasks/templates/config/${customerId}`,
      saveCustomerConfig: "recurring-tasks/templates/config",
    },
  },
  AiAssistant: {
    testProfile: "AiAssistant/TestProfile",
  },
  Announcements: {
    adminList: "announcements/admin-list",
    analytics: (id: string) => `announcements/${id}/analytics`,
    create: "announcements",
    delete: (id: string) => `announcements/${id}`,
    downloadPdf: (id: string) => `announcements/${id}/pdf`,
    getById: (id: string) => `announcements/${id}`,
    update: (id: string) => `announcements/${id}`,
  },
  DiagramDraw: {
    delete: (id: string) => `DiagramDraw/${id}`,
    getById: (id: string) => `DiagramDraw/${id}`,
    update: (id: string) => `DiagramDraw/${id}`,
  },
  Meetings: {
    allPendingMinutas: (customerId: string) =>
      `Meetings/MinutaAllPendientes/${customerId}`,
    base: "Meetings",
    delete: (id: string) => `Meetings/${id}`,
    getById: (id: string) => `Meetings/${id}`,
    getDetails: (meetingId: string | null) => `Meetings/GetDetails/${meetingId}`,
    list: (customerId: string, tipoJunta: number) =>
      `Meetings/list/${customerId}/${tipoJunta}`,
    reportPdf: (meetingId: string | number) =>
      `Meetings/MeetingReportPdf/${meetingId}`,
    seguimientoMinutas: (customerId: string, filtro: number) =>
      `Meetings/SeguimientoMinutas/${customerId}/${filtro}`,
    sendEmailResponsible: (
      id: any,
      customerId: string,
      area: number,
      applicationUserId: string,
    ) =>
      `Meetings/SendEmailResponsible/${id}/${customerId}/${area}/${applicationUserId}`,
  },
  MeetingsDetails: {
    base: "MeetingsDetails",
    delete: (id: string | number) => `MeetingsDetails/${id}`,
    getById: (id: string | number) => `MeetingsDetails/${id}`,
  },
  MeetingDetailsTracking: {
    base: "MeetingDertailsSeguimiento",
    delete: (id: string | number) => `MeetingDertailsSeguimiento/${id}`,
    exportSummaryToExcel: (meetingId: string | number) =>
      `MeetingDertailsSeguimiento/ExportSummaryToExcel/${meetingId}`,
    getById: (id: string | number) => `MeetingDertailsSeguimiento/${id}`,
    resumenGrafico: (customerId: string, date: string) =>
      `MeetingDertailsSeguimiento/ResumenPreventivosGraficoPresentacion/${customerId}/${date}`,
    resumenGraficoPresentacion: (meetingId: string | number) =>
      `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${meetingId}`,
    resumenPreventivos: (customerId: string, date: string) =>
      `MeetingDertailsSeguimiento/ResumenPreventivosPresentacion/${customerId}/${date}`,
    resumenPresentacion: (meetingId: string | number) =>
      `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${meetingId}`,
    update: (id: string | number) => `MeetingDertailsSeguimiento/${id}`,
  },
  GoogleCalendarEvents: {
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
        ? `manuals/instances?customerId=${customerId}`
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
  ManualFlowcharts: {
    create: "manualFlowcharts",
    delete: (id: string) => `manualFlowcharts/${id}`,
    getById: (id: string) => `manualFlowcharts/${id}`,
    update: (id: string) => `manualFlowcharts/${id}`,
  },
  SpecialDocuments: {
    updateOrder: "special-document/update-order",
  },
  Almacen: {
    delete: (id: string) => `almacen/${id}`,
    getById: (id: string) => `almacen/${id}`,
  },
  InventarioProducto: {
    create: "InventarioProducto",
  },
  Tools: {
    delete: (id: string) => `Tools/${id}`,
  },
  RadioCommunication: {
    create: "RadioComunicacion",
    getById: (id: string) => `RadioComunicacion/${id}`,
    update: (id: string) => `RadioComunicacion/${id}`,
  },
  ServiceOrders: {
    create: "ServiceOrders",
    delete: (id: string | number) => `ServiceOrders/${id}`,
    deleteDocument: (id: string | number) => `ServiceOrders/DeleteDocument/${id}`,
    deleteImg: (id: string | number) => `ServiceOrders/DeleteImg/${id}`,
    getById: (id: string | number) => `ServiceOrders/${id}`,
    listByCustomerAndDate: (customerId: string, date: string) =>
      `ServiceOrders/list/${customerId}/${date}`,
    listPintura: (customerId: string, date: string) =>
      `ServiceOrders/list-pintura/${customerId}/${date}`,
    photos: (id: string, customerId: string) =>
      `ServiceOrders/OrdenesServicioFotos/${id}/${customerId}`,
    reporte: (customerId: string, periodo: string) =>
      `ServiceOrders/ReporteOrdenesServicio/${customerId}/${periodo}`,
    reporteProveedor: (id: string, customerId: string) =>
      `ServiceOrders/OrdenesServicioReporteProveedor/${id}/${customerId}`,
    soporte: (id: string) => `ServiceOrders/SoporteOrdenServicio/${id}`,
  },
  ApprovalRules: {
    matrix: "approval-rules/matrix",
  },
  EntregaRecepcion: {
    base: "CatalogoEntregaRecepcionDescripcion",
    getByClient: (id: string) => `EntregaRecepcionCliente/${id}`,
    getById: (id: string) => `CatalogoEntregaRecepcionDescripcion/${id}`,
    grupos: "CatalogoEntregaRecepcionDescripcion/grupos",
    updateClient: (id: string, userId: string, customerId: string) =>
      `EntregaRecepcionCliente/${id}/${userId}/${customerId}`,
  },
  EntregaRecepcionCliente: {
    deleteFile: (id: string) => `EntregaRecepcionCliente/DeleteFile/${id}`,
    generateData: "EntregaRecepcionCliente/GenerateData",
    getByCustomerAndDepartment: (customerId: string, department: string) =>
      `EntregaRecepcionCliente/${customerId}/${department}`,
    invalidateFile: (id: string) =>
      `EntregaRecepcionCliente/InvalidarArchivo/${id}`,
    validateFile: (applicationUserId: string, id: string) =>
      `EntregaRecepcionCliente/ValidarArchivo/${applicationUserId}/${id}`,
  },
} as const;

export const EndpointsDireccion = {
  DireccionDashboard: {
    agendaSemanal: (fecha: string) => `direccion-dashboard/agenda-semanal?fecha=${fecha}`,
    agendaMeses: (meses: number) => `direccion-dashboard/agenda-meses?meses=${meses}`,
    contratosPorVencer: "direccion-dashboard/contratos-por-vencer",
    contratosVigentes: "direccion-dashboard/contratos-vigentes",
    personalAusente: "direccion-dashboard/personal-ausente",
    reclutamientoResumen: "direccion-dashboard/reclutamiento-resumen",
    tareasLegal: "direccion-dashboard/tareas-legal",
  },
  AsambleaChecklist: {
    bySession: (sessionId: string) => `asamblea-checklist/session/${sessionId}`,
    updateStatus: (id: string) => `asamblea-checklist/${id}/status`,
  },
  JuntaMensualSession: {
    base: "junta-mensual-sessions",
    byCustomer: (customerId: string) =>
      `junta-mensual-sessions/customer/${customerId}`,
    detail: (sessionId: string) => `junta-mensual-sessions/${sessionId}/detail`,
    createMeeting: (id: string) => `junta-mensual-sessions/${id}/meeting/create`,
    cancel: (id: string) => `junta-mensual-sessions/${id}/cancel`,
    reschedule: (id: string) => `junta-mensual-sessions/${id}/reschedule`,
  },
  MeetingAdministracion: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `meeting-administracion/agregar-participantes-administracion/${meetingId}/${participantId}/1`,
    delete: (id: string | number) => `meeting-administracion/${id}`,
    participants: (meetingId: string | number) =>
      `meeting-administracion/participantes-administracion/${meetingId}`,
  },
  MeetingComite: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `meeting-comite/agregar-participantes-comite/${meetingId}/${participantId}`,
    delete: (id: string | number) => `meeting-comite/${id}`,
    participants: (meetingId: string | number) =>
      `meeting-comite/participantes-comite/${meetingId}`,
  },
  MeetingInvitado: {
    addParticipant: (meetingId: string | number, invitado: string | null) =>
      `meeting-invitado/agregar-participantes-invitado/${meetingId}/${invitado}`,
    delete: (id: string | number) => `meeting-invitado/${id}`,
    participants: (meetingId: string | number) =>
      `meeting-invitado/participantes-invitado/${meetingId}`,
  },
  PresentacionJuntaComite: {
    addFile: "presentaciones-junta-comite/add-file",
    addFecha: "presentaciones-junta-comite/add-fecha",
    authorize: (id: any, userId: string) =>
      `presentaciones-junta-comite/autorizar-presentacion/${id}/${userId}`,
    delete: (id: any) => `presentaciones-junta-comite/${id}`,
    deleteFile: (id: any, area: string) => `presentaciones-junta-comite/${id}/${area}`,
    getById: (id: string) => `presentaciones-junta-comite/get/${id}`,
    list: (customerId: string) => `presentaciones-junta-comite/list/${customerId}`,
    updateFecha: (id: string) => `presentaciones-junta-comite/add-fecha/${id}`,
  },
} as const;

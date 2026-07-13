export const EndpointsDireccion = {
  AsambleaChecklist: {
    bySession: (sessionId: string) => `asamblea-checklist/session/${sessionId}`,
    updateStatus: (id: string) => `asamblea-checklist/${id}/status`,
  },
  AsambleaChecklistTemplate: {
    create: "asamblea-checklist-template",
    delete: (id: string) => `asamblea-checklist-template/${id}`,
    getAll: "asamblea-checklist-template",
    getById: (id: string) => `asamblea-checklist-template/${id}`,
    update: (id: string) => `asamblea-checklist-template/${id}`,
  },
  JuntaMensualSession: {
    detail: (sessionId: string) => `junta-mensual-sessions/${sessionId}/detail`,
  },
  MeetingAdministracion: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `meeting-administracion/agregar-participantes-administracion/${meetingId}/${participantId}/1`,
    delete: (id: string | number) => `meeting-administracion/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `get-list-administracion-minuta/${customerId}/${meetingId}`,
    participants: (meetingId: string | number) =>
      `meeting-administracion/participantes-administracion/${meetingId}`,
  },
  MeetingComite: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `meeting-comite/agregar-participantes-comite/${meetingId}/${participantId}`,
    delete: (id: string | number) => `meeting-comite/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `get-list-comite-minuta/${customerId}/${meetingId}`,
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
    addFecha: "presentaciones-junta-comite/add-fecha",
    authorize: (id: any, userId: string) =>
      `presentaciones-junta-comite/autorizar-presentacion/${id}/${userId}`,
    delete: (id: any) => `presentaciones-junta-comite/${id}`,
    deleteFile: (id: any, area: string) => `presentaciones-junta-comite/${id}/${area}`,
    getById: (id: string) => `presentaciones-junta-comite/get/${id}`,
    list: (customerId: string) => `presentaciones-junta-comite/list/${customerId}`,
    updateFecha: (id: string) => `presentaciones-junta-comite/add-fecha/${id}`,
  },
  RefactorDireccion: {
    juntaMensualSessionByIdReschedule: (id: any) => `junta-mensual-sessions/${id}/reschedule`,
    presentacionJuntaComiteAddFile: "presentaciones-junta-comite/add-file",
      meetingsDetailsDetallesFiltroByIdById: (meetingId: any, status: any) => `meetings-details/detalles-filtro/${meetingId}/${status}`,
},
} as const;

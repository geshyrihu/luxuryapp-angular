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
    detail: (sessionId: string) => `JuntaMensualSession/${sessionId}/detail`,
  },
  MeetingAdministracion: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `meeting-administracion/agregar-participantes-administracion/${meetingId}/${participantId}/1`,
    delete: (id: string | number) => `meeting-administracion/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `GetListAdministracionMinuta/${customerId}/${meetingId}`,
    participants: (meetingId: string | number) =>
      `meeting-administracion/participantes-administracion/${meetingId}`,
  },
  MeetingComite: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `meeting-comite/agregar-participantes-comite/${meetingId}/${participantId}`,
    delete: (id: string | number) => `meeting-comite/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `GetListComiteMinuta/${customerId}/${meetingId}`,
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
    addFecha: "PresentacionJuntaComite/AddFecha",
    authorize: (id: any, userId: string) =>
      `PresentacionJuntaComite/AutorizarPresentacion/${id}/${userId}`,
    delete: (id: any) => `PresentacionJuntaComite/${id}`,
    deleteFile: (id: any, area: string) => `PresentacionJuntaComite/${id}/${area}`,
    getById: (id: string) => `PresentacionJuntaComite/Get/${id}`,
    list: (customerId: string) => `PresentacionJuntaComite/list/${customerId}`,
    updateFecha: (id: string) => `PresentacionJuntaComite/AddFecha/${id}`,
  },
} as const;

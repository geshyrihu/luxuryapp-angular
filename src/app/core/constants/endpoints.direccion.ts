export const EndpointsDireccion = {
  AsambleaChecklist: {
    bySession: (sessionId: string) => `AsambleaChecklist/session/${sessionId}`,
    updateStatus: (id: string) => `AsambleaChecklist/${id}/status`,
  },
  AsambleaChecklistTemplate: {
    create: "AsambleaChecklistTemplate",
    delete: (id: string) => `AsambleaChecklistTemplate/${id}`,
    getAll: "AsambleaChecklistTemplate",
    getById: (id: string) => `AsambleaChecklistTemplate/${id}`,
    update: (id: string) => `AsambleaChecklistTemplate/${id}`,
  },
  JuntaMensualSession: {
    detail: (sessionId: string) => `JuntaMensualSession/${sessionId}/detail`,
  },
  MeetingAdministracion: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `MeetingAdministracion/AgregarParticipantesAdministracion/${meetingId}/${participantId}/1`,
    delete: (id: string | number) => `MeetingAdministracion/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `GetListAdministracionMinuta/${customerId}/${meetingId}`,
    participants: (meetingId: string | number) =>
      `MeetingAdministracion/ParticipantesAdministracion/${meetingId}`,
  },
  MeetingComite: {
    addParticipant: (meetingId: string | number, participantId: string | number) =>
      `MeetingComite/AgregarParticipantesComite/${meetingId}/${participantId}`,
    delete: (id: string | number) => `MeetingComite/${id}`,
    listCandidates: (customerId: string, meetingId: string | number) =>
      `GetListComiteMinuta/${customerId}/${meetingId}`,
    participants: (meetingId: string | number) =>
      `MeetingComite/ParticipantesComite/${meetingId}`,
  },
  MeetingInvitado: {
    addParticipant: (meetingId: string | number, invitado: string | null) =>
      `MeetingInvitado/AgregarParticipantesInvitado/${meetingId}/${invitado}`,
    delete: (id: string | number) => `MeetingInvitado/${id}`,
    participants: (meetingId: string | number) =>
      `MeetingInvitado/ParticipantesInvitado/${meetingId}`,
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

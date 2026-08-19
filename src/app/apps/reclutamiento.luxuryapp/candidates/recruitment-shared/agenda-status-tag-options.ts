import { MappedTagOption } from "./mapped-p-tag";

/**
 * Fuente unica de verdad de las etiquetas de AgendaStatusCode, tal como lo
 * calcula CandidateProcessAppService.ResolveAgendaStatusCode/Label en backend.
 * No inventar codigos aqui: deben coincidir exactamente con los que manda la API.
 */
export const AGENDA_STATUS_TAG_OPTIONS: MappedTagOption[] = [
  {
    value: "missing_interviewer",
    label: "Sin entrevistador",
    severity: "warn",
  },
  {
    value: "pending_schedule",
    label: "Pendiente de agenda",
    severity: "contrast",
  },
  { value: "scheduled", label: "Agendada", severity: "info" },
  { value: "overdue", label: "Vencida", severity: "danger" },
  { value: "feedback", label: "Con retroalimentacion", severity: "success" },
  { value: "approved", label: "Aprobado", severity: "success" },
  { value: "rejected", label: "Rechazado", severity: "danger" },
  { value: "no_show", label: "No asistio", severity: "warn" },
  { value: "cancelled", label: "Cancelada", severity: "secondary" },
  { value: "postulada", label: "Postulada", severity: "info" },
  { value: "closed", label: "Cerrada/Historica", severity: "secondary" },
];

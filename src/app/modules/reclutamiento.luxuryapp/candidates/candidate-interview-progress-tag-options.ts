import { CandidateInterviewProgressStatus } from "src/app/core/enums/candidate-interview-progress-status";
import { MappedTagOption } from "../recruitment-shared/mapped-p-tag";

export const CANDIDATE_INTERVIEW_PROGRESS_TAG_OPTIONS: MappedTagOption[] = [
  {
    value: CandidateInterviewProgressStatus.SinEntrevistar,
    label: "Sin entrevistar",
    severity: "secondary",
  },
  {
    value: CandidateInterviewProgressStatus.PendienteAgenda,
    label: "Pendiente de agenda",
    severity: "warn",
  },
  {
    value: CandidateInterviewProgressStatus.Agendado,
    label: "Agendado",
    severity: "success",
  },
  {
    value: CandidateInterviewProgressStatus.Vencida,
    label: "Vencida",
    severity: "danger",
  },
];

import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { MappedTagOption } from "../recruitment-shared/mapped-p-tag";

export const CANDIDATE_STATUS_TAG_OPTIONS: MappedTagOption[] = [
  {
    value: CandidateStatus.Active,
    label: "Activo",
    severity: "success",
  },
  {
    value: CandidateStatus.Archived,
    label: "Archivado",
    severity: "secondary",
  },
  {
    value: CandidateStatus.Contratado,
    label: "Contratado",
    severity: "success",
  },
  {
    value: CandidateStatus.EmpleadoVinculado,
    label: "Empleado vinculado",
    severity: "info",
  },
];

import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";

export const CANDIDATE_PROCESS_STAGE_LABELS: Record<CandidateProcessStage, string> =
  {
    [CandidateProcessStage.Nuevo]: "Nuevo",
    [CandidateProcessStage.EnEspera]: "En espera",
    [CandidateProcessStage.EntrevistaOperaciones]: "Ent. Operaciones",
    [CandidateProcessStage.NoSePresento]: "No se presento",
    [CandidateProcessStage.Rechazado]: "Rechazado",
    [CandidateProcessStage.Seleccionado]: "Seleccionado",
    [CandidateProcessStage.AltaEnProceso]: "Alta en proceso",
    [CandidateProcessStage.Contratado]: "Contratado",
    [CandidateProcessStage.PendingPresentation]: "Pendiente de presentación",
    [CandidateProcessStage.ReadyForHire]: "Pendiente de alta",
    [CandidateProcessStage.PresentationRescheduled]: "Presentación reprogramada",
    [CandidateProcessStage.PresentationNoShow]: "No se presentó",
  };

export const CANDIDATE_PROCESS_STAGE_CLASSES: Record<CandidateProcessStage, string> =
  {
    [CandidateProcessStage.Nuevo]: "bg-gray-100 text-gray-700",
    [CandidateProcessStage.EnEspera]: "bg-amber-100 text-amber-700",
    [CandidateProcessStage.EntrevistaOperaciones]:
      "bg-teal-100 text-teal-700",
    [CandidateProcessStage.NoSePresento]: "bg-purple-100 text-purple-700",
    [CandidateProcessStage.Rechazado]: "bg-red-100 text-red-700",
    [CandidateProcessStage.Seleccionado]: "bg-indigo-100 text-indigo-700",
    [CandidateProcessStage.AltaEnProceso]: "bg-orange-100 text-orange-700",
    [CandidateProcessStage.Contratado]: "bg-green-100 text-green-700",
    [CandidateProcessStage.PendingPresentation]: "bg-sky-100 text-sky-700",
    [CandidateProcessStage.ReadyForHire]: "bg-cyan-100 text-cyan-700",
    [CandidateProcessStage.PresentationRescheduled]: "bg-yellow-100 text-yellow-700",
    [CandidateProcessStage.PresentationNoShow]: "bg-fuchsia-100 text-fuchsia-700",
  };

export function candidateProcessStageLabel(
  stage: CandidateProcessStage | null | undefined,
): string {
  if (stage === null || stage === undefined) return "Sin etapa";
  return CANDIDATE_PROCESS_STAGE_LABELS[stage] ?? "Sin etapa";
}

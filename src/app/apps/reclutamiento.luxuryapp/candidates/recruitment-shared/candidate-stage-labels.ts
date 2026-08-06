import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";

export const CANDIDATE_STAGE_LABELS: Record<CandidateApplicationStage, string> =
  {
    [CandidateApplicationStage.Nuevo]: "Nuevo",
    [CandidateApplicationStage.PreFiltro]: "Pre-filtro",
    [CandidateApplicationStage.EnEspera]: "En espera",
    [CandidateApplicationStage.EntrevistaReclutamiento]: "Ent. Reclutamiento",
    [CandidateApplicationStage.EntrevistaOperaciones]: "Ent. Operaciones",
    [CandidateApplicationStage.NoSePresento]: "No se presentó",
    [CandidateApplicationStage.Rechazado]: "Rechazado",
    [CandidateApplicationStage.Seleccionado]: "Seleccionado",
    [CandidateApplicationStage.AltaEnProceso]: "Alta en proceso",
    [CandidateApplicationStage.Contratado]: "Contratado",
  };

export const CANDIDATE_STAGE_CLASSES: Record<CandidateApplicationStage, string> =
  {
    [CandidateApplicationStage.Nuevo]: "bg-gray-100 text-gray-700",
    [CandidateApplicationStage.PreFiltro]: "bg-blue-100 text-blue-700",
    [CandidateApplicationStage.EnEspera]: "bg-amber-100 text-amber-700",
    [CandidateApplicationStage.EntrevistaReclutamiento]:
      "bg-cyan-100 text-cyan-700",
    [CandidateApplicationStage.EntrevistaOperaciones]:
      "bg-teal-100 text-teal-700",
    [CandidateApplicationStage.NoSePresento]: "bg-purple-100 text-purple-700",
    [CandidateApplicationStage.Rechazado]: "bg-red-100 text-red-700",
    [CandidateApplicationStage.Seleccionado]: "bg-indigo-100 text-indigo-700",
    [CandidateApplicationStage.AltaEnProceso]: "bg-orange-100 text-orange-700",
    [CandidateApplicationStage.Contratado]: "bg-green-100 text-green-700",
  };

export function candidateStageLabel(
  stage: CandidateApplicationStage | null | undefined,
): string {
  if (stage === null || stage === undefined) return "Sin etapa";
  return CANDIDATE_STAGE_LABELS[stage] ?? "Sin etapa";
}
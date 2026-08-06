import { CandidateDecision } from "src/app/core/enums/candidate-decision";

export const CANDIDATE_DECISION_LABELS: Record<CandidateDecision, string> = {
  [CandidateDecision.Aprobado]: "Aprobado",
  [CandidateDecision.Rechazado]: "Rechazado",
  [CandidateDecision.EnEspera]: "En espera",
};

export function candidateDecisionLabel(decision: CandidateDecision): string {
  return CANDIDATE_DECISION_LABELS[decision] ?? "Sin decision";
}

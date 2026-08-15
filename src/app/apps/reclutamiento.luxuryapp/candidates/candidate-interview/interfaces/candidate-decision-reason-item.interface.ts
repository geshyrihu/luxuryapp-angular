import { CandidateDecision } from "src/app/core/enums/candidate-decision";

export interface CandidateDecisionReasonItem {
  id: string;
  code: string;
  name: string;
  appliesToDecision: CandidateDecision;
  isActive: boolean;
  displayOrder: number;
}

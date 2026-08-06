import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";

export interface CandidateInterviewFeedbackItem {
  id: string;
  candidateApplicationId: string;
  interviewerName: string;
  interviewerRole: ApplicationRole;
  receptionConfirmedAt?: string;
  interviewAt?: string;
  decision: CandidateDecision;
  decisionReasonName: string;
  additionalComment: string;
  sentAt: string;
}

export interface CandidateInterviewFeedbackCreate {
  candidateApplicationId: string;
  receptionConfirmedAt?: string;
  interviewAt?: string;
  decision: CandidateDecision;
  decisionReasonId: string;
  additionalComment?: string;
}

export interface CandidateDecisionReasonItem {
  id: string;
  code: string;
  name: string;
  appliesToDecision: CandidateDecision;
  isActive: boolean;
  displayOrder: number;
}
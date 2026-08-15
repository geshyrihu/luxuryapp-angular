import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateDecisionReasonItem } from "./candidate-decision-reason-item.interface";
import { CandidateInterviewResponseDto } from "./candidate-interview-response.dto";

// Compatibility barrel kept temporarily for consumers outside candidates/.
export type { CandidateDecisionReasonItem, CandidateInterviewResponseDto };

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
  candidateProcessId?: string;
  receptionConfirmedAt?: string;
  interviewAt?: string;
  decision: CandidateDecision;
  decisionReasonId: string | null;
  additionalComment?: string;
}

export interface CandidateInterviewFeedbackDto {
  candidateApplicationId: string;
  candidateProcessId?: string;
  receptionConfirmedAt?: string;
  interviewAt?: string;
  decision: string;
  decisionReasonId: string;
  additionalComment?: string;
}

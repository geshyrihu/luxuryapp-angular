import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateRejectionReason } from "src/app/core/enums/candidate-rejection-reason";
import { CandidateInterviewResponseDto } from "./candidate-interview-response.dto";

// Compatibility barrel kept temporarily for consumers outside candidates/.
export type { CandidateInterviewResponseDto };

export interface CandidateInterviewFeedbackItem {
  id: string;
  candidateApplicationId: string;
  candidateProcessId?: string | null;
  interviewerName: string;
  interviewerRole: ApplicationRole;
  receptionConfirmedAt?: string;
  scheduledAt?: string;
  decision: CandidateDecision;
  decisionReasonName: string;
  additionalComment: string;
  sentAt: string;
}

export interface CandidateInterviewFeedbackCreate {
  candidateApplicationId: string;
  candidateProcessId?: string | null;
  receptionConfirmedAt?: string;
  scheduledAt?: string;
  decision: CandidateDecision;
  decisionReason?: CandidateRejectionReason | null;
  additionalComment?: string;
}

export interface CandidateInterviewFeedbackDto {
  candidateApplicationId: string;
  candidateProcessId?: string | null;
  receptionConfirmedAt?: string;
  scheduledAt?: string;
  decision: CandidateDecision;
  decisionReason?: CandidateRejectionReason | null;
  additionalComment?: string;
}

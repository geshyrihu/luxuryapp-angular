import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateRejectionReason } from "src/app/core/enums/candidate-rejection-reason";

export interface InterviewerActionRequestDto {
  candidateProcessId: string;
  decision: CandidateDecision;
  decisionReason?: CandidateRejectionReason | null;
  additionalComment: string;
  newScheduledAt?: string | null;
  agreedPresentationDate?: string | null;
  agreedPresentationTime?: string | null;
}

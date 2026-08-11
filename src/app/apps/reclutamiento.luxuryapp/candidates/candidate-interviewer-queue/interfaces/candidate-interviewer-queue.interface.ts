import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";

export interface CandidateInterviewerQueueDto {
  requestPositionId: string;
  workPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  vacancyStatus: string;
  candidatesInTrackingCount: number;
  nextInterviewAt?: string;
  pendingCandidatesCount: number;
  overdueCandidatesCount: number;
  candidates: CandidateInterviewerQueueItemDto[];
}

export interface CandidateInterviewerQueueItemDto {
  candidateApplicationId: string;
  candidateName: string;
  currentStage: CandidateApplicationStage;
  interviewTypeLabel: string;
  agendaStatusCode: string;
  agendaStatusLabel: string;
  operationsInterviewAt?: string;
  assignedInterviewerUserId: string;
  assignedInterviewerName: string;
  cvFileUrl: string;
  cvFileName: string;
  pendingAction: string;
  canSubmitFeedback: boolean;
  canMarkNoShow: boolean;
  canReject: boolean;
  canApprove: boolean;
  lastDecision?: CandidateDecision;
  lastFeedbackAt?: string;
  lastComment: string;
  isHistorical: boolean;
}

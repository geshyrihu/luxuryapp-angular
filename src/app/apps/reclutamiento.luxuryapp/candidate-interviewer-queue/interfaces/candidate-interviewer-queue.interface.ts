import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";

export interface CandidateInterviewerQueueDto {
  requestPositionId: string;
  workPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  vacancyStatus: string;
  requestDate: string;
  candidatesInTrackingCount: number;
  nextInterviewAt?: string;
  pendingCandidatesCount: number;
  overdueCandidatesCount: number;
  candidates: CandidateInterviewerQueueItemDto[];
}

export interface CandidateInterviewerQueueItemDto {
  candidateApplicationId: string;
  candidateId: string;
  interviewId?: string | null;
  candidateProcessId?: string | null;
  candidateName: string;
  photoUrl: string;
  currentStage: CandidateProcessStage;
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


import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";

export interface CandidateApplicationListItem {
  id: string;
  candidateId: string;
  candidateName: string;
  requestPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  customerId: string;
  currentStage: CandidateApplicationStage;
  cvFileName: string;
  cvFileUrl: string;
  operationsInterviewAt?: string;
  assignedInterviewerName: string;
  lastDecision?: CandidateDecision;
}

export interface CandidateApplicationDetail extends CandidateApplicationListItem {
  applicationDate: string;
  recruitmentInterviewAt?: string;
  operationsInterviewAssignedToUserId: string;
  lastDecisionReasonName: string;
  lastDecisionComment: string;
  selectedForHiring: boolean;
  hiringRequestedAt?: string;
  closedAt?: string;
  lastStageChange?: CandidateStageHistoryItem | null;
  stageHistory?: CandidateStageHistoryItem[];
}

export interface CandidateStageHistoryItem {
  id: string;
  fromStage?: CandidateApplicationStage;
  toStage: CandidateApplicationStage;
  comment: string;
  changedByUserId: string;
  changedAt: string;
}

export interface CandidateApplicationAddOrEdit {
  candidateId: string;
  requestPositionId: string;
  cvFileName: string;
  applicationDate?: string;
}

export interface ChangeStageApplicationRequest {
  toStage: CandidateApplicationStage;
  comment: string;
  recruitmentInterviewAt?: string;
  operationsInterviewAt?: string;
  operationsInterviewAssignedToUserId?: string;
}

export interface CandidateDecisionRequest {
  decision: CandidateDecision;
  reasonId?: string;
  comment?: string;
}
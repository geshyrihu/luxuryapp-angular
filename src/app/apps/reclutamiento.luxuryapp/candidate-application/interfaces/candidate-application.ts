import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";
import { CandidateProcessKpisDto, FuenteKpiItem } from "./candidate-process-kpis.dto";

export interface CandidateApplicationListItem {
  id: string;
  candidateProcessId?: string | null;
  candidateId: string;
  candidateName: string;
  requestPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  customerId: string;
  currentStage: CandidateProcessStage;
  processStatus?: number;
  closureReason?: number | null;
  selectedForHiring?: boolean;
  selectedAt?: string | null;
  hiringRequestedAt?: string | null;
  hiredEntryDate?: string | null;
  cvFileName: string;
  cvFileUrl: string;
  operationsInterviewAt?: string;
  assignedInterviewerName: string;
  assignedInterviewerUserId: string;
  lastDecision?: CandidateDecision;
}

export interface CandidateRecruitmentAgendaItem {
  id: string;
  candidateId: string;
  candidateName: string;
  workPositionId: string;
  requestPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  customerId: string;
  currentStage: CandidateProcessStage;
  scheduledInterviewAt?: string;
  assignedInterviewerUserId: string;
  assignedInterviewerName: string;
  receptionConfirmedAt?: string;
  feedbackSentAt?: string;
  agendaStatusCode: string;
  agendaStatusLabel: string;
  pendingAction: string;
  daysInStage: number;
  isOverdue: boolean;
  cvFileName: string;
  cvFileUrl: string;
}

export interface CandidateApplicationDetail extends CandidateApplicationListItem {
  applicationDate: string;
  recruitmentInterviewAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;
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
  fromStage?: CandidateProcessStage;
  toStage: CandidateProcessStage;
  comment: string;
  changedByUserId: string;
  changedAt: string;
}

export interface CandidateApplicationAddOrEdit {
  candidateId: string;
  requestPositionId: string;
  cvFileName: string;
  applicationDate?: string;
  recruitmentInterviewAt?: string;
  operationsInterviewAssignedToUserId?: string;
  initialComment?: string;
}

export interface ChangeStageApplicationRequest {
  toStage: CandidateProcessStage;
  comment: string;
  scheduledDate?: string;
  scheduledTime?: string;
  operationsInterviewAssignedToUserId?: string;
}

export interface CandidateDecisionRequest {
  decision: CandidateDecision;
  reasonId?: string;
  comment?: string;
}

export type CandidateApplicationKpisDto = CandidateProcessKpisDto;
export type { CandidateProcessKpisDto, FuenteKpiItem };

import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";

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

// NUEVO: Para la vista de respuesta del entrevistador
export interface CandidateInterviewResponseDto {
  candidateApplicationId: string;
  requestPositionId: string;
  workPositionId: string;
  vacancyFolio: string;
  positionName: string;
  candidateName: string;
  customerName: string;
  currentStage: string;
  operationsInterviewAt?: string;
  assignedInterviewerUserId: string;
  assignedInterviewerName: string;
  agendaStatusCode: string;
  agendaStatusLabel: string;
  pendingAction: string;
  cvFileUrl: string;
  cvFileName: string;
  // Timeline de cambios de etapa
  timeline: CandidateInterviewTimelineItem[];
}

export interface CandidateInterviewTimelineItem {
  id: string;
  fromStage?: string;
  toStage: string;
  changedByUserId: string;
  changedByUserName: string;
  comment?: string;
  createdAt: string;
}

export interface CandidateInterviewFeedbackDto {
  candidateApplicationId: string;
  receptionConfirmedAt?: string;
  interviewAt?: string;
  decision: string;
  decisionReasonId: string;
  additionalComment?: string;
}
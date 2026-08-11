import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";

export enum InterviewerActionType {
  SubmitFeedback = 0,
  MarkNoShow = 1,
  Reject = 2,
  Approve = 3,
}

export interface InterviewerApplicationViewDto {
  candidateApplicationId: string;
  requestPositionId: string;
  workPositionId: string;
  vacancyFolio: string;
  positionName: string;
  candidateName: string;
  currentStage: CandidateApplicationStage;
  recruitmentInterviewAt?: string;
  operationsInterviewAt?: string;
  assignedInterviewerUserId: string;
  assignedInterviewerName: string;
  agendaStatusCode: string;
  agendaStatusLabel: string;
  pendingAction: string;
  lastDecision?: CandidateDecision;
  canSubmitFeedback: boolean;
  canMarkNoShow: boolean;
  canReject: boolean;
  canApprove: boolean;
  cvFileUrl: string;
  cvFileName: string;
}

export interface InterviewerActionRequest {
  candidateApplicationId: string;
  action: InterviewerActionType;
  reasonId?: string;
  comment?: string;
  interviewAt?: string;
  receptionConfirmedAt?: string;
}
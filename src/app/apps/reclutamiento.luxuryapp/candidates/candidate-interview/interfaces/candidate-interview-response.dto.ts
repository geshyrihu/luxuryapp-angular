import { CandidateInterviewTimelineItem } from "./candidate-interview-timeline-item.interface";

export interface CandidateInterviewResponseDto {
  candidateApplicationId: string;
  candidateProcessId?: string | null;
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
  timeline: CandidateInterviewTimelineItem[];
}

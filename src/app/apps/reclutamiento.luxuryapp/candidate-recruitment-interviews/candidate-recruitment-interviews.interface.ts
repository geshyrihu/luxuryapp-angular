import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";

export type RecruitmentBoardAction = "send" | "schedule" | "reschedule" | "assign";

export interface CandidateRecruitmentInterviewBoard {
  requestPositionId: string;
  workPositionId: string;
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  customerId: string;
  vacancyStatus: string;
  candidatesCount: number;
  pendingInterviewCount: number;
  scheduledCount: number;
  overdueCount: number;
  nextInterviewAt?: string | null;
  candidates: CandidateRecruitmentInterviewBoardItem[];
}

export interface CandidateRecruitmentInterviewBoardItem {
  candidateApplicationId: string;
  candidateProcessId?: string | null;
  interviewId?: string | null;
  candidateId: string;
  candidateName: string;
  currentStage: CandidateProcessStage;
  applicationDate?: string | null;
  recruitmentInterviewAt?: string | null;
  operationsInterviewAt?: string | null;
  assignedInterviewerUserId: string;
  assignedInterviewerName: string;
  agendaStatusCode: string;
  agendaStatusLabel: string;
  cvFileUrl: string;
  cvFileName: string;
  canSendToInterview: boolean;
  canSchedule: boolean;
  canReschedule: boolean;
  canProceedToHiring: boolean;
}

export interface ScheduleRecruitmentInterviewRequest {
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  operationsInterviewAssignedToUserId?: string | null;
  comment?: string | null;
  cancelInterview?: boolean;
}

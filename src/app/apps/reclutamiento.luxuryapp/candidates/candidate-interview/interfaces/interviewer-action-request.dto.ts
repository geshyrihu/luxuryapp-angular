import { InterviewerActionType } from "src/app/core/enums/interviewer-action-type";

export interface InterviewerActionRequestDto {
  candidateApplicationId: string;
  candidateProcessId?: string;
  action: InterviewerActionType;
  reasonId?: string;
  comment?: string;
  receptionConfirmedAt?: string;
}

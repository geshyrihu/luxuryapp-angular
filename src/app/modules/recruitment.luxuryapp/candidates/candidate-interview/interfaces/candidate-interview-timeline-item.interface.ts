import { CandidateProcessStage } from "@core/enums/candidate-process-stage";

export interface CandidateInterviewTimelineItem {
  id: string;
  fromStage?: CandidateProcessStage;
  toStage: CandidateProcessStage;
  changedByUserId: string;
  changedByUserName: string;
  comment?: string;
  changedAt: string;
}


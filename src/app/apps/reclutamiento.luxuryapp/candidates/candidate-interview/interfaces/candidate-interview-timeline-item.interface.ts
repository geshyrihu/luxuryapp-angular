import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";

export interface CandidateInterviewTimelineItem {
  id: string;
  fromStage?: CandidateApplicationStage;
  toStage: CandidateApplicationStage;
  changedByUserId: string;
  changedByUserName: string;
  comment?: string;
  createdAt: string;
}

import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateInterviewerQueueDto } from "./interfaces/candidate-interviewer-queue.interface";

export interface InterviewerActionRequest {
  candidateApplicationId: string;
  action: number;
  reasonId?: string;
  comment?: string;
  interviewAt?: string;
  receptionConfirmedAt?: string;
}

@Injectable({ providedIn: "root" })
export class CandidateInterviewerQueueService {
  private apiResponseS = inject(ApiResponseService);

  async getInterviewerQueue(): Promise<CandidateInterviewerQueueDto[]> {
    const result = await this.apiResponseS.onGetList<CandidateInterviewerQueueDto[]>(
      EndpointsReclutamiento.CandidateApplications.interviewerQueue,
    );
    return result ?? [];
  }

  async executeAction(request: InterviewerActionRequest): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateApplications.interviewerAction,
      request,
    );
    return result ?? false;
  }
}
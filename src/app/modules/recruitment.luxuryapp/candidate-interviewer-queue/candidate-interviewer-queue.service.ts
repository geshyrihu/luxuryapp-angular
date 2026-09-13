import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateInterviewerQueueDto } from "./interfaces/candidate-interviewer-queue.interface";
import { InterviewerActionRequestDto } from "../candidate-interview/interfaces/interviewer-action-request.dto";

export type InterviewerActionRequest = InterviewerActionRequestDto;

@Injectable({ providedIn: "root" })
export class CandidateInterviewerQueueService {
  private apiResponseS = inject(ApiResponseService);

  async getInterviewerQueue(): Promise<CandidateInterviewerQueueDto[]> {
    const result = await this.apiResponseS.onGetList<CandidateInterviewerQueueDto[]>(
      EndpointsReclutamiento.CandidateProcesses.interviewerQueue,
    );
    return result ?? [];
  }

  async executeAction(request: InterviewerActionRequestDto): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.interviewerAction,
      request,
    );
    return result ?? false;
  }
}

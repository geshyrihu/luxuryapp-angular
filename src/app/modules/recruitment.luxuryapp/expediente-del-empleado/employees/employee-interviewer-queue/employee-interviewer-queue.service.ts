import { Injectable, inject } from "@angular/core";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CandidateInterviewerQueueDto } from "@shared/integration/reclutamiento/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface";
import { InterviewerActionRequest } from "@shared/integration/reclutamiento/candidates/candidate-interviewer-queue/candidate-interviewer-queue.service";

@Injectable({ providedIn: "root" })
export class EmployeeInterviewerQueueService {
  private apiResponseS = inject(ApiResponseService);

  async getQueue(customerId: string): Promise<CandidateInterviewerQueueDto[]> {
    const result = await this.apiResponseS.onGetList<CandidateInterviewerQueueDto[]>(
      `${EndpointsReclutamiento.CandidateProcesses.employeeInterviewerQueue}/${customerId}`,
    );
    return result ?? [];
  }

  async executeAction(request: InterviewerActionRequest): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.interviewerAction,
      request,
    );
    return result ?? false;
  }

  async reconfirmPresentation(id: string): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.reconfirmPresentation(id),
      {},
    );
    return result ?? false;
  }
}


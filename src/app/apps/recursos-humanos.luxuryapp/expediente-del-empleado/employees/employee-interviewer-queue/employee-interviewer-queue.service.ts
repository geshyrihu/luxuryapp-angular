import { Injectable, inject } from "@angular/core";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CandidateInterviewerQueueDto } from "src/app/shared/integration/reclutamiento/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface";
import { InterviewerActionRequest } from "src/app/shared/integration/reclutamiento/candidates/candidate-interviewer-queue/candidate-interviewer-queue.service";

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
}

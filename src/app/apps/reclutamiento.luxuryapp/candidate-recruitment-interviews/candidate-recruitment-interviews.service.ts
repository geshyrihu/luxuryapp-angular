import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import {
  CandidateRecruitmentInterviewBoard,
  ScheduleRecruitmentInterviewRequest,
} from "./candidate-recruitment-interviews.interface";
import { ChangeStageApplicationRequest } from "../candidate-application/interfaces/candidate-application";

@Injectable({ providedIn: "root" })
export class CandidateRecruitmentInterviewsService {
  private apiResponseS = inject(ApiResponseService);

  async getBoard(): Promise<CandidateRecruitmentInterviewBoard[]> {
    const result = await this.apiResponseS.onGetList<CandidateRecruitmentInterviewBoard[]>(
      EndpointsReclutamiento.CandidateProcesses.recruitmentInterviewBoard,
    );
    return result ?? [];
  }

  async sendToInterview(
    id: string,
    payload: ChangeStageApplicationRequest,
  ): Promise<boolean> {
    const stageChanged = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.changeStage(id),
      payload,
    );
    if (!stageChanged) return false;

    if (payload.scheduledDate && payload.scheduledTime) {
      const scheduled = await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.CandidateProcesses.schedule(id),
        {
          scheduledDate: payload.scheduledDate,
          scheduledTime: payload.scheduledTime,
          operationsInterviewAssignedToUserId:
            payload.operationsInterviewAssignedToUserId || null,
          comment: payload.comment || "",
        },
      );
      return scheduled ?? false;
    }

    return true;
  }

  async schedule(
    id: string,
    payload: ScheduleRecruitmentInterviewRequest,
  ): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.schedule(id),
      payload,
    );
    return result ?? false;
  }

  async cancelSchedule(
    id: string,
    payload: ScheduleRecruitmentInterviewRequest,
  ): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.cancelSchedule(id),
      payload,
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

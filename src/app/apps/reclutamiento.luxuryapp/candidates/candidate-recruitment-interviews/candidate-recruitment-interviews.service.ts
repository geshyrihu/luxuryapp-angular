import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import {
  CandidateRecruitmentInterviewBoard,
  ScheduleRecruitmentInterviewRequest,
} from "./candidate-recruitment-interviews.interface";
import { ChangeStageApplicationRequest } from "../candidate-application/interfaces/candidate-application";

export interface CandidateInterviewCreateRequest {
  candidateApplicationId: string;
  interviewType: number;
  interviewerUserId: string;
  scheduledAt: string;
  notes?: string;
}

export interface CandidateInterviewRescheduleRequest {
  proposedRescheduleAt: string;
  rescheduleComment?: string;
}

@Injectable({ providedIn: "root" })
export class CandidateRecruitmentInterviewsService {
  private apiResponseS = inject(ApiResponseService);

  async getBoard(): Promise<CandidateRecruitmentInterviewBoard[]> {
    const result = await this.apiResponseS.onGetList<CandidateRecruitmentInterviewBoard[]>(
      EndpointsReclutamiento.CandidateApplications.recruitmentInterviewBoard,
    );
    return result ?? [];
  }

  async sendToInterview(
    id: string,
    payload: ChangeStageApplicationRequest,
  ): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateApplications.changeStage(id),
      payload,
    );
    return result ?? false;
  }

  async schedule(
    id: string,
    payload: ScheduleRecruitmentInterviewRequest,
  ): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateApplications.recruitmentSchedule(id),
      payload,
    );
    return result ?? false;
  }

  async cancelSchedule(
    id: string,
    payload: ScheduleRecruitmentInterviewRequest,
  ): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateApplications.cancelRecruitmentSchedule(id),
      payload,
    );
    return result ?? false;
  }

  async createInterview(
    payload: CandidateInterviewCreateRequest,
  ): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateInterviews.create,
      payload,
    );
    return result ?? false;
  }

  async rescheduleInterview(
    id: string,
    payload: CandidateInterviewRescheduleRequest,
  ): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateInterviews.reschedule(id),
      payload,
    );
    return result ?? false;
  }

  async cancelInterview(id: string): Promise<boolean> {
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateInterviews.cancel(id),
      {},
    );
    return result ?? false;
  }
}

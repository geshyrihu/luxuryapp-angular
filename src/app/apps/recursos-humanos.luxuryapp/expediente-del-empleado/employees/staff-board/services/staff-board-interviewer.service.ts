import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { InterviewerApplicationViewDto, InterviewerActionRequest, InterviewerActionType } from "../interfaces/interviewer-view.interface";

@Injectable({ providedIn: "root" })
export class StaffBoardInterviewerService {
  private apiResponseS = inject(ApiResponseService);

  async getInterviewerView(): Promise<InterviewerApplicationViewDto[]> {
    const result = await this.apiResponseS.onGetList<InterviewerApplicationViewDto[]>(
      EndpointsReclutamiento.CandidateProcesses.interviewerView,
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

  // Helper para crear request de feedback
  createFeedbackRequest(
    candidateApplicationId: string,
    candidateProcessId: string | null | undefined,
    reasonId: string,
    comment: string,
    interviewAt?: Date,
    receptionConfirmedAt?: Date,
  ): InterviewerActionRequest {
    return {
      candidateApplicationId,
      candidateProcessId,
      action: InterviewerActionType.SubmitFeedback,
      reasonId,
      comment,
      interviewAt: interviewAt?.toISOString(),
      receptionConfirmedAt: receptionConfirmedAt?.toISOString(),
    };
  }

  // Helper para crear request de no-show
  createNoShowRequest(
    candidateApplicationId: string,
    candidateProcessId: string | null | undefined,
    comment: string,
  ): InterviewerActionRequest {
    return {
      candidateApplicationId,
      candidateProcessId,
      action: InterviewerActionType.MarkNoShow,
      comment,
    };
  }

  // Helper para crear request de rechazo
  createRejectRequest(
    candidateApplicationId: string,
    candidateProcessId: string | null | undefined,
    reasonId: string,
    comment: string,
  ): InterviewerActionRequest {
    return {
      candidateApplicationId,
      candidateProcessId,
      action: InterviewerActionType.Reject,
      reasonId,
      comment,
    };
  }

  // Helper para crear request de aprobacion
  createApproveRequest(
    candidateApplicationId: string,
    candidateProcessId: string | null | undefined,
    comment: string,
  ): InterviewerActionRequest {
    return {
      candidateApplicationId,
      candidateProcessId,
      action: InterviewerActionType.Approve,
      comment,
    };
  }
}

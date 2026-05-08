import { inject, Injectable } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  LeaveHistorySummaryDTO,
  OverlappingApprovalRequestDTO,
} from "../interfaces/approval.interface";
import { VacationBalanceDTO } from "../interfaces/vacation-balance.interface";

@Injectable({ providedIn: "root" })
export class ApprovalInfoService {
  apiResponseS = inject(ApiResponseService);

  getLeaveRequestHistorySummary(employeeId: string) {
    return this.apiResponseS.onGetItem<LeaveHistorySummaryDTO>(
      Endpoints.HR.LeaveRequestApproval.historySummary(employeeId),
    );
  }

  getOverlappingLeaveRequests(
    customerId: string,
    startDate: string,
    endDate: string,
    excludeEmployeeId: string,
  ) {
    return this.apiResponseS.onGetItem<OverlappingApprovalRequestDTO[]>(
      Endpoints.HR.LeaveRequestApproval.overlappingRequests(
        customerId,
        startDate,
        endDate,
        excludeEmployeeId,
      ),
    );
  }

  getVacationBalance(employeeId: string) {
    return this.apiResponseS.onGetItem<VacationBalanceDTO>(
      Endpoints.HR.VacationRequestApproval.balance(employeeId),
    );
  }

  getOverlappingVacationRequests(
    customerId: string,
    startDate: string,
    endDate: string,
    excludeEmployeeId: string,
  ) {
    return this.apiResponseS.onGetItem<OverlappingApprovalRequestDTO[]>(
      Endpoints.HR.VacationRequestApproval.overlappingRequests(
        customerId,
        startDate,
        endDate,
        excludeEmployeeId,
      ),
    );
  }
}

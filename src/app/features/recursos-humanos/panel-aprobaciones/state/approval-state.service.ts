import { computed, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  ApprovalPanelRequest,
  ApprovalRequestType,
} from "../../interfaces/approval.interface";
import {
  EPaidStatus,
  LeaveRequestApproveDTO,
} from "../../interfaces/leave-request.interface";

export interface ApprovalState {
  requests: ApprovalPanelRequest[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: "root",
})
export class ApprovalStateService {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);

  private state = signal<ApprovalState>({
    requests: [],
    loading: true,
    error: null,
  });

  public requests = computed(() => this.state().requests);
  public loading = computed(() => this.state().loading);
  public error = computed(() => this.state().error);

  public async loadRequests(): Promise<void> {
    this.state.update((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    const role = await firstValueFrom(this.authS.userRole$);
    const isGlobalAdmin = role === "SuperUsuario" || role === "RecursosHumanos";
    const selectedCustomerId = this.customerIdS.customerId();

    const params: Record<string, string> = { status: "Pending" };

    if (!isGlobalAdmin || (isGlobalAdmin && selectedCustomerId)) {
      params.customerId = selectedCustomerId;
    }

    try {
      const [leaveRequests, vacationRequests] = await Promise.all([
        this.loadApprovalRequests(
          Endpoints.HR.LeaveRequestApproval.getAll,
          params,
          "Permiso",
        ),
        this.loadApprovalRequests(
          Endpoints.HR.VacationRequestApproval.getAll,
          params,
          "Vacaciones",
        ),
      ]);

      const combined = [...leaveRequests, ...vacationRequests].sort(
        (a, b) =>
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime(),
      );

      this.state.update((current) => ({
        ...current,
        requests: combined,
        loading: false,
      }));
    } catch {
      this.state.update((current) => ({
        ...current,
        error: "Error al cargar las solicitudes",
        loading: false,
      }));
    }
  }

  public async approveRequest(
    request: ApprovalPanelRequest,
    paidStatus?: EPaidStatus,
  ): Promise<void> {
    const url = this.getApprovalActionUrl(request, "approve");

    const dto: LeaveRequestApproveDTO = {
      approved: true,
    };

    if (request.requestType === "Permiso" && paidStatus !== undefined) {
      dto.paidStatus = paidStatus;
    }

    await this.apiResponseS.onPut(url, dto);
    this.loadRequests();
  }

  public async rejectRequest(
    request: ApprovalPanelRequest,
    reason: string,
  ): Promise<void> {
    const url = this.getApprovalActionUrl(request, "reject");

    await this.apiResponseS.onPut(url, {
      approved: false,
      rejectionReason: reason,
    });

    this.loadRequests();
  }

  private async loadApprovalRequests(
    endpoint: string,
    params: Record<string, string>,
    requestType: ApprovalRequestType,
  ): Promise<ApprovalPanelRequest[]> {
    const requests = await this.apiResponseS.onGetList<ApprovalPanelRequest[]>(
      endpoint,
      params,
    );

    if (requests === null) {
      throw new Error(`Error loading approval requests for ${requestType}`);
    }

    return requests.map((request) => ({ ...request, requestType }));
  }

  private getApprovalActionUrl(
    request: ApprovalPanelRequest,
    action: "approve" | "reject",
  ): string {
    if (request.requestType === "Permiso") {
      return action === "approve"
        ? Endpoints.HR.LeaveRequestApproval.approve(request.id)
        : Endpoints.HR.LeaveRequestApproval.reject(request.id);
    }

    return action === "approve"
      ? Endpoints.HR.VacationRequestApproval.approve(request.id)
      : Endpoints.HR.VacationRequestApproval.reject(request.id);
  }
}

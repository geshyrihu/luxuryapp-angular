import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { getStatusSeverity } from "../helpers/status-severity.helper";
import { ApprovalPanelRequest } from "../interfaces/approval.interface";

interface LeaveApprovalDetailDTO {
  id: string;
  employeeFullName: string;
  requestTypeName: string;
  period: string;
  isPartial: boolean;
  timeRange: string;
  status: string;
  requestDate: string;
  reason: string;
  attachmentUrl: string | null;
  comments?: string | null;
  rejectionReason?: string | null;
}

interface VacationApprovalDetailDTO {
  id: string;
  employeeFullName: string;
  startDate: string;
  endDate: string;
  requestedDays: number;
  status: string;
  requestDate: string;
  approvalDate?: string | null;
  approverFullName?: string | null;
  reason?: string | null;
  comments?: string | null;
  rejectionReason?: string | null;
}

@Component({
  selector: "app-approval-detail-modal",
  templateUrl: "./modal-approval-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxSpinner, LxTag, WebButtonLabel],
})
export class ApprovalDetailModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  getStatusSeverity = getStatusSeverity;

  request: ApprovalPanelRequest = this.config.data.request;
  loading = signal(true);
  leaveDetail = signal<LeaveApprovalDetailDTO | null>(null);
  vacationDetail = signal<VacationApprovalDetailDTO | null>(null);

  ngOnInit(): void {
    this.loadDetail();
  }

  private async loadDetail(): Promise<void> {
    try {
      if (this.request.requestType === "Permiso") {
        this.leaveDetail.set(
          await this.apiResponseS.onGetItem<LeaveApprovalDetailDTO>(
            Endpoints.HR.LeaveRequestApproval.detail(this.request.id),
          ),
        );
      } else {
        this.vacationDetail.set(
          await this.apiResponseS.onGetItem<VacationApprovalDetailDTO>(
            Endpoints.HR.VacationRequest.getDetail(this.request.id),
          ),
        );
      }
    } catch (error) {
      console.error("Error al cargar el detalle de la solicitud:", error);
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    this.ref.close(null);
  }
}
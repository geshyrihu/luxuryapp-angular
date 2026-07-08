import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
;
import { LxTag } from "@ui/adaptive/tag/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { getStatusSeverity } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/helpers/status-severity.helper";

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
  selector: "app-vacacion-solicitud-detalle",
  templateUrl: "./vacacion-solicitud-detalle.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxTag, WebButtonLabel],
})
export class VacacionSolicitudDetalle implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  getStatusSeverity = getStatusSeverity;

  requestId: string | null = null;
  requestData = signal<VacationApprovalDetailDTO | null>(null);
  loading = signal(true);
  submitting = signal(false);

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get("id");
    if (this.requestId) {
      this.loadRequestDetail(this.requestId);
    } else {
        this.router.navigate(ROUTES.RECURSOS_HUMANOS.MIS_VACACIONES);
    }
  }

  loadRequestDetail(id: string): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<VacationApprovalDetailDTO>(
        Endpoints.HR.VacationRequest.getDetail(id),
      )
      .then((data) => {
        this.requestData.set(data);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error("Error loading vacation request detail:", error);
        this.loading.set(false);
      this.router.navigate(ROUTES.RECURSOS_HUMANOS.MIS_VACACIONES);
      });
  }

  onApprove(): void {
    this.submitting.set(true);
    const dto = { approved: true, rejectionReason: "Approved by admin" };
    this.apiResponseS
      .onPut(Endpoints.HR.VacationRequestApproval.approve(this.requestId!), dto)
      .then(() => {
        this.submitting.set(false);
        this.router.navigate(ROUTES.RECURSOS_HUMANOS.APROBACIONES);
      })
      .catch((error) => {
        this.submitting.set(false);
        console.error("Error approving vacation request:", error);
      });
  }

  onReject(): void {
    this.submitting.set(true);
    const dto = { approved: false, rejectionReason: "Rejected by admin" };
    this.apiResponseS
      .onPut(Endpoints.HR.VacationRequestApproval.reject(this.requestId!), dto)
      .then(() => {
        this.submitting.set(false);
        this.router.navigate(ROUTES.RECURSOS_HUMANOS.APROBACIONES);
      })
      .catch((error) => {
        this.submitting.set(false);
        console.error("Error rejecting vacation request:", error);
      });
  }
}

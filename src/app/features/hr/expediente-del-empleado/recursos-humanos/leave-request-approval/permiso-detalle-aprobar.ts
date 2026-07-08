import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
;
import { LxTag } from "@ui/adaptive/tag/tag";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { getStatusSeverity } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/helpers/status-severity.helper";

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

@Component({
  selector: "app-leave-request-detail-for-aproved",
  templateUrl: "./permiso-detalle-aprobar.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxTag, WebButtonLabel],
})
export class PermisoDetalleAprobar implements OnInit {
  apiResponseS = inject(ApiResponseService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  getStatusSeverity = getStatusSeverity;
  requestId: string | null = null;
  requestData = signal<LeaveApprovalDetailDTO | null>(null);
  loading = signal(true);
  submitting = signal(false);

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get("id");
    if (this.requestId) {
      this.loadRequestDetail(this.requestId);
    } else {
      this.router.navigate(ROUTES.RECURSOS_HUMANOS.MIS_PERMISOS);
    }
  }

  loadRequestDetail(id: string): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<LeaveApprovalDetailDTO>(
        Endpoints.HR.LeaveRequestApproval.detail(id),
      )
      .then((data) => {
        this.requestData.set(data);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error("Error al cargar detalle de la solicitud:", error);
        this.loading.set(false);
        this.router.navigate(ROUTES.RECURSOS_HUMANOS.MIS_PERMISOS);
      });
  }

  onApprove(): void {
    this.submitting.set(true);
    const dto = {
      approved: true,
      rejectionReason: "Aprobado por administrador",
    };
    this.apiResponseS
      .onPut(Endpoints.HR.LeaveRequestApproval.approve(this.requestId!), dto)
      .then(() => {
        this.loadRequestDetail(this.requestId!);
        this.submitting.set(false);
        this.router.navigate(ROUTES.RECURSOS_HUMANOS.APROBACIONES);
      })
      .catch((error) => {
        this.submitting.set(false);
        console.error("Error al aprobar la solicitud:", error);
      });
  }

  onReject(): void {
    this.submitting.set(true);
    const dto = {
      approved: false,
      rejectionReason: "Rechazado por administrador",
    };
    this.apiResponseS
      .onPut(Endpoints.HR.LeaveRequestApproval.reject(this.requestId!), dto)
      .then(() => {
        this.loadRequestDetail(this.requestId!);
        this.submitting.set(false);
        this.router.navigate(ROUTES.RECURSOS_HUMANOS.APROBACIONES);
      })
      .catch((error) => {
        this.submitting.set(false);
        console.error("Error al rechazar la solicitud:", error);
      });
  }
}

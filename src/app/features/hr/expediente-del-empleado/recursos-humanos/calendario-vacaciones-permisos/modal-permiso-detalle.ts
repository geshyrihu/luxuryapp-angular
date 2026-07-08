import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { getStatusSeverity } from "../helpers/status-severity.helper";

interface LeaveRequestCalendarDetailDTO {
  employeeFullName: string;
  requestTypeName: string;
  requestDate: string;
  period: string;
  reason: string;
  status: string;
  approverName: string | null;
  approvalDate: string | null;
}

@Component({
  selector: "app-permiso-detalle-modal",
  templateUrl: "./permiso-detalle-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxTag],
})
export class PermisoDetalleModal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  getStatusSeverity = getStatusSeverity;

  id: string = this.config.data?.id;
  requestData = signal<LeaveRequestCalendarDetailDTO | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    if (this.id) {
      this.apiResponseS
        .onGetItem<LeaveRequestCalendarDetailDTO>(
          Endpoints.HR.LeaveRequest.getDetail(this.id),
        )
        .then((data) => {
          this.requestData.set(data);
          this.loading.set(false);
        })
        .catch(() => this.loading.set(false));
    }
  }
}







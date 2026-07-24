import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
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
  imports: [],
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

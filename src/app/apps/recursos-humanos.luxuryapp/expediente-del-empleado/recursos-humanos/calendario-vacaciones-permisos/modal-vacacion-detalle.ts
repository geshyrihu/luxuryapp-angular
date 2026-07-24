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
interface VacationRequestCalendarDetailDTO {
  employeeFullName: string;
  period: string;
  status: string;
  approverFullName: string | null;
  approvalDate: string | null;
}

@Component({
  selector: "app-vacacion-detalle-modal",
  templateUrl: "./vacacion-detalle-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class VacacionDetalleModal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  getStatusSeverity = getStatusSeverity;

  id: string = this.config.data?.id;
  requestData = signal<VacationRequestCalendarDetailDTO | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    if (this.id) {
      this.apiResponseS
        .onGetItem<VacationRequestCalendarDetailDTO>(
          Endpoints.HR.VacationRequest.getDetail(this.id),
        )
        .then((data) => {
          this.requestData.set(data);
          this.loading.set(false);
        })
        .catch(() => this.loading.set(false));
    }
  }
}

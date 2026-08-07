import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { getStatusSeverity } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/helpers/status-severity.helper";
import { LeaveRequestDetailDTO } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/interfaces/leave-request.interface";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-leave-request-detail-my",
  imports: [AppIcon, LxTag, WebButtonLabel],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mi-permiso-detalle.html",
})
export class MiPermisoDetalle implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  getStatusSeverity = getStatusSeverity;

  id: string = this.config.data?.id;
  data: LeaveRequestDetailDTO | null = null;
  loading = true;

  ngOnInit(): void {
    this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.apiResponseS.onGetItem<LeaveRequestDetailDTO>(
        Endpoints.HR.LeaveRequest.getDetail(this.id),
      );
      if (result) {
        this.data = result;
      }
    } catch (error) {
      // El error ya se maneja en el interceptor
    } finally {
      this.loading = false;
    }
  }

  onDownloadAttachment(): void {
    if (this.data?.attachmentUrl) {
      window.open(this.data.attachmentUrl, "_blank");
    }
  }
}

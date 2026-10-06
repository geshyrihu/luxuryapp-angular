import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { getStatusSeverity } from "@human-resources.luxuryapp/shared/helpers/status-severity.helper";
import { LeaveRequestDetailDTO } from "@human-resources.luxuryapp/interfaces/leave-request.interface";
import { LxIcon } from '@ui/adaptive/icon/icon';

@Component({
  selector: "app-leave-request-detail-my",
  imports: [ButtonWeb, LxIcon, LxTag],
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


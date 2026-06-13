import { Component, inject, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { getStatusSeverity } from "src/app/features/tenant/recursos-humanos/helpers/status-severity.helper";
import { LeaveRequestDetailDTO } from "src/app/features/tenant/recursos-humanos/interfaces/leave-request.interface";

@Component({
  selector: "app-leave-request-detail-my",
  imports: [TagModule, CustomButton],
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











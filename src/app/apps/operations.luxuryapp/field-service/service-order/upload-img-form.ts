import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { LxFileUpload } from "@ui/adaptive/file-upload/file-upload";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-upload-img-form",
  templateUrl: "./upload-img-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxFileUpload],
})
export class UploadImgForm {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiS = inject(ApiResponseService);
  maxFileSize: number = 30000000;
  url: string = Endpoints.ServiceOrders.uploadImg(
    this.config.data.serviceOrderId,
  );
  uploading = signal(false);

  onFilesSelected(event: any): void {
    const files: File[] = event.files ?? [];
    if (!files.length) return;
    this.uploading.set(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    this.apiS.onPostFile(this.url, formData).finally(() => {
      this.uploading.set(false);
      this.ref.close(true);
    });
  }
}

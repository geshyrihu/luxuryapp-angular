import { HttpHeaders } from "@angular/common/http";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { SharedModule } from "primeng/api";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-upload-img-form",
  templateUrl: "./upload-img-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FileUploadModule, SharedModule, CardModule],
})
export class UploadImgForm {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  uploadedFiles: HttpHeaders[] | any = [];
  maxFileSize: number = 30000000;
  url: string = `${environment.API_BASE_URL}ServiceOrders/SubirImg/${this.config.data.serviceOrderId}`;

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.ref.close(true);
  }
}










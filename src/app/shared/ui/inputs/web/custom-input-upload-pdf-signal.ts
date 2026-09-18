import { ApiResponseService } from "@core/http/services/api-response.service";
import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { FileUpload } from "@ui/web/file-upload/file-upload";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
/**
 * 📤 SUBIR PDF (MODAL)
 * -------------------------------------------------------------------------
 * Diálogo independiente para la carga masiva de PDFs.
 * Se comunica directamente con la API vía pathUrl.
 */
@Component({
  selector: "app-subir-pdf",
  imports: [FileUpload, WebButtonLabel],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="p-3">
      <p class="mb-3">Cargar o arrastrar PDF</p>
      <app-file-upload
        accept="application/pdf"
        [multiple]="true"
        [maxFileSize]="maxFileSize"
        [autoUpload]="false"
        chooseLabel="Seleccionar PDFs"
        (onSelect)="onFilesSelected($event)"
      />
      @if (pendingFiles.length) {
        <div class="d-flex justify-content-end mt-3">
          <il-button label="Cargar PDFs" [loading]="uploading" (clicked)="uploadAll()" />
        </div>
      }
    </div>
  `,
})
export class SubirPdf implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponse = inject(ApiResponseService);
  maxFileSize: number = 20000000;
  url: string = "";
  pathUrl: string = "";
  pendingFiles: File[] = [];
  uploading = false;

  ngOnInit(): void {
    this.pathUrl = this.config.data.pathUrl;
    this.url = `${this.pathUrl}${this.config.data.serviceOrderId}`;
  }

  onFilesSelected(event: { files: File[] }): void {
    this.pendingFiles = event.files;
  }

  async uploadAll(): Promise<void> {
    if (!this.pendingFiles.length) return;
    this.uploading = true;
    const formData = new FormData();
    for (const file of this.pendingFiles) {
      formData.append("files", file);
    }
    try {
      const response = await this.apiResponse.onPostFile(this.url, formData);
      if (response !== false) {
        this.ref.close(true);
      }
    } finally {
      this.uploading = false;
    }
  }
}

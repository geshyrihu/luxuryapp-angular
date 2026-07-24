import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { SharedModule } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
/**
 * 📤 SUBIR PDF (MODAL)
 * -------------------------------------------------------------------------
 * Diálogo independiente para la carga masiva de PDFs.
 * Se comunica directamente con la API vía pathUrl.
 */
@Component({
  selector: "app-subir-pdf",
  imports: [FileUploadModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p-fileupload
      name="files"
      [customUpload]="true"
      (uploadHandler)="customUploadHandler($event)"
      [multiple]="true"
      accept="application/pdf"
      cancelLabel="Cancelar"
      chooseLabel="Seleccionar PDFs"
      uploadLabel="Cargar PDFs"
      [maxFileSize]="maxFileSize"
    >
      <ng-template #toolbar>
        <div class="py-3">Cargar o arrastrar PDF</div>
      </ng-template>
      <ng-template #content let-files>
        <div>
          @for (file of files; track file) {
            <div>{{ file.name }} - {{ formatFileSize(file.size) }}</div>
          }
        </div>
      </ng-template>
    </p-fileupload>
  `,
})
export class SubirPdf implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponse = inject(ApiResponseService);
  maxFileSize: number = 20000000;
  url: string = "";
  pathUrl: string = "";

  ngOnInit(): void {
    this.pathUrl = this.config.data.pathUrl;
    this.url = `${this.pathUrl}${this.config.data.serviceOrderId}`;
  }

  customUploadHandler(event: FileUploadHandlerEvent) {
    const formData = new FormData();

    // Agregar todos los archivos con el nombre "files"
    for (let file of event.files) {
      formData.append("files", file);
    }

    this.apiResponse.onPostFile(this.url, formData).then((response) => {
      if (response !== false) {
        // Notificar éxito y cerrar
        this.ref.close(true);
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}

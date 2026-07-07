import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { SharedModule } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
import { environment } from "src/environments/environment";

/**
 * 📤 SUBIR PDF (MODAL)
 * -------------------------------------------------------------------------
 * Diálogo independiente para la carga masiva de PDFs.
 * Se comunica directamente con la API vía pathUrl.
 */
@Component({
  selector: "app-custom-input-upload-pdf-signal",
  imports: [FileUploadModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p-fileUpload
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
      <ng-template pTemplate="toolbar">
        <div class="py-3">Cargar o arrastrar PDF</div>
      </ng-template>
      <ng-template #content let-files>
        <div>
          @for (file of files; track file) {
            <div>{{ file.name }} - {{ formatFileSize(file.size) }}</div>
          }
        </div>
      </ng-template>
    </p-fileUpload>
  `,
})
export class SubirPdf implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  maxFileSize: number = 20000000;
  url: string = "";
  pathUrl: string = "";

  ngOnInit(): void {
    this.pathUrl = this.config.data.pathUrl;
    this.url = `${environment.API_BASE_URL}${this.pathUrl}${this.config.data.serviceOrderId}`;
  }

  customUploadHandler(event: FileUploadHandlerEvent) {
    const formData = new FormData();

    // Agregar todos los archivos con el nombre "files"
    for (let file of event.files) {
      formData.append("files", file);
    }

    this.http.post(this.url, formData).subscribe({
      next: (response) => {
        // Notificar éxito y cerrar
        this.ref.close(true);
      },
      error: (error) => {
        console.error("Error al subir:", error);
      },
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

import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule, FileUploadValidators } from "@iplab/ngx-file-upload";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";
import { SwalService } from "src/app/core/services/swal.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { IncidentAttachmentListDTO } from "../interfaces/incident.interfaces";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILES_PER_INCIDENT = 10;

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-incident-attachments",
  imports: [
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    FileUploadModule,
    TableModule,
    DatePipe,
    WebButtonLabel,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./incident-attachments.html",
})
export class IncidentAttachmentsComponent {
  incidentId = input.required<string>();

  readonly MAX_FILES_PER_INCIDENT = MAX_FILES_PER_INCIDENT;

  private apiResponseS = inject(ApiResponseService);
  private imageProcessing = inject(ImageProcessingService);
  private swalS = inject(SwalService);

  attachments = signal<IncidentAttachmentListDTO[]>([]);
  loading = signal(false);
  uploading = signal(false);

  filesControl = new FormControl<File[] | null>(null, [
    FileUploadValidators.filesLimit(MAX_FILES_PER_INCIDENT),
  ]);

  get selectedFiles(): File[] {
    return this.filesControl.value ?? [];
  }

  ngOnInit(): void {
    this.loadAttachments();
  }

  loadAttachments(): void {
    if (!this.incidentId()) return;
    this.loading.set(true);
    this.apiResponseS
      .onGetList<IncidentAttachmentListDTO[]>(
        Endpoints.HR.Incident.attachments.getByIncident(this.incidentId()),
      )
      .then((result) => {
        if (result) this.attachments.set(result);
      })
      .finally(() => this.loading.set(false));
  }

  async uploadFiles(): Promise<void> {
    const files = this.selectedFiles;
    if (!files.length || !this.incidentId()) return;

    const remaining = MAX_FILES_PER_INCIDENT - this.attachments().length;
    if (files.length > remaining) {
      this.swalS.fire({
        icon: "warning",
        title: "Límite de archivos",
        text: `Solo puedes agregar ${remaining} archivo(s) más.`,
      });
      return;
    }

    this.uploading.set(true);
    let uploaded = 0;

    for (const file of files) {
      const isPdf =
        file.type === "application/pdf" || /\.pdf$/i.test(file.name);
      const isImage = await this.imageProcessing.isImage(file);

      if (!isPdf && !isImage) {
        this.swalS.fire({
          icon: "warning",
          title: "Tipo no permitido",
          text: `"${file.name}" no es JPG, PNG, WebP, HEIC ni PDF.`,
        });
        continue;
      }

      let fileToUpload = file;
      if (isImage) {
        try {
          fileToUpload = await this.imageProcessing.processImage(file, {
            maxBytes: MAX_FILE_SIZE_BYTES,
            maxDimension: 1920,
          });
        } catch {
          this.swalS.error("Error", `No se pudo procesar "${file.name}".`);
          continue;
        }
      }

      if (fileToUpload.size > MAX_FILE_SIZE_BYTES) {
        this.swalS.error(
          "Archivo demasiado grande",
          `"${file.name}" excede el limite de 2 MB.`,
        );
        continue;
      }

      const formData = new FormData();
      formData.append("File", fileToUpload);

      const result =
        await this.apiResponseS.onPostFile<IncidentAttachmentListDTO>(
          Endpoints.HR.Incident.attachments.add(this.incidentId()),
          formData,
        );

      if (result) {
        this.attachments.update((curr) => [...curr, result]);
        uploaded++;
      }
    }

    this.uploading.set(false);
    this.filesControl.reset();

    if (uploaded > 0) {
      this.swalS.success(
        "Éxito",
        `${uploaded} archivo(s) adjuntado(s) correctamente.`,
      );
    }
  }

  deleteAttachment(attachment: IncidentAttachmentListDTO): void {
    this.attachments.update((curr) =>
      curr.filter((a) => a.id !== attachment.id),
    );
    this.swalS.success("Eliminado", "Archivo eliminado.");
  }

  downloadFile(url: string): void {
    window.open(url, "_blank");
  }

  formatFileSize(sizeKB: number): string {
    if (sizeKB < 1024) return sizeKB.toFixed(0) + " KB";
    return (sizeKB / 1024).toFixed(1) + " MB";
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "mdi:image";
    if (mimeType === "application/pdf") return "mdi:file-pdf-box";
    return "mdi:file-document-outline";
  }

  getFileIconClass(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "text-blue-600";
    if (mimeType === "application/pdf") return "text-red-500";
    return "text-primary";
  }
}

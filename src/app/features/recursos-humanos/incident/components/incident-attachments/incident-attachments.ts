import { DatePipe } from "@angular/common";
import { Component, inject, input, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule, FileUploadValidators } from "@iplab/ngx-file-upload";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ImageCompressionService } from "src/app/core/services/image-compression.service";
import { SwalService } from "src/app/core/services/swal.service";
import { IncidentAttachmentListDTO } from "../../models/incident.interfaces";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILES_PER_INCIDENT = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

@Component({
  selector: "app-incident-attachments",
  imports: [
    ReactiveFormsModule,
    FileUploadModule,
    TableModule,
    DatePipe,
    CustomButton,
    CustomButtonDelete,
  ],
  templateUrl: "./incident-attachments.html",
})
export class IncidentAttachmentsComponent {
  incidentId = input.required<string>();

  readonly MAX_FILES_PER_INCIDENT = MAX_FILES_PER_INCIDENT;

  private apiResponseS = inject(ApiResponseService);
  private imageCompressionS = inject(ImageCompressionService);
  private swalS = inject(SwalService);

  attachments = signal<IncidentAttachmentListDTO[]>([]);
  loading = signal(false);
  uploading = signal(false);

  filesControl = new FormControl<File[] | null>(null, [
    FileUploadValidators.fileSize(MAX_FILE_SIZE_BYTES),
    FileUploadValidators.filesLimit(MAX_FILES_PER_INCIDENT),
    FileUploadValidators.accept(ALLOWED_TYPES),
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
      if (!ALLOWED_TYPES.includes(file.type)) {
        this.swalS.fire({
          icon: "warning",
          title: "Tipo no permitido",
          text: `"${file.name}" no es JPG, PNG ni PDF.`,
        });
        continue;
      }

      let fileToUpload = file;
      if (file.size > MAX_FILE_SIZE_BYTES && file.type.startsWith("image/")) {
        try {
          fileToUpload = await this.imageCompressionS.compressImage(file, 2);
        } catch {
          this.swalS.error("Error", `No se pudo comprimir "${file.name}".`);
          continue;
        }
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

  getFileIconClass(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "pi pi-image text-blue-600";
    if (mimeType === "application/pdf") return "pi pi-file-pdf text-red-500";
    return "pi pi-file text-primary";
  }
}

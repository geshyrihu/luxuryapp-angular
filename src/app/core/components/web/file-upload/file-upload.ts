import { Component, ElementRef, inject, input, output, signal, viewChild, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { ProgressBarModule } from "primeng/progressbar";
import { FileUploadHandlerEvent, FileUploadModule } from "primeng/fileupload";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PlatformService } from "src/app/core/services/platform.service";

export interface UploadFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  objectURL?: string;
}

@Component({
  selector: "app-file-upload",
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule, FileUploadModule, AppIcon],
  template: `
    <div class="file-upload-root">
      <!-- Drop Zone -->
      <div
        class="file-upload-dropzone border-2 border-dashed border-round p-4 flex flex-column align-items-center gap-2 cursor-pointer"
        [class.file-upload-dragover]="isDragOver()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <p-fileUpload
          #fileUpload
          mode="basic"
          [chooseLabel]="chooseLabel()"
          [accept]="accept()"
          [maxFileSize]="maxFileSize()"
          [multiple]="multiple()"
          [auto]="true"
          styleClass="w-full"
          chooseStyleClass="w-full justify-content-center"
          (onSelect)="onFilesSelected($event)"
        />

        @if (!files().length) {
          <span class="text-sm text-color-secondary">o arrastra y suelta aquí</span>
        }
      </div>

      <!-- Mobile Actions (camera / gallery) -->
      @if (isMobile() && mobileSource() !== "none") {
        <div class="flex gap-2 mt-2">
          @if (mobileSource() === "camera" || mobileSource() === "both") {
            <p-button
              [label]="'Tomar foto'"
              icon="mdi:camera"
              severity="secondary"
              styleClass="w-full justify-content-center"
              (onClick)="cameraInput().nativeElement.click()"
            />
          }
          @if (mobileSource() === "gallery" || mobileSource() === "both") {
            <p-button
              [label]="'Galería'"
              icon="mdi:image"
              severity="secondary"
              styleClass="w-full justify-content-center"
              (onClick)="galleryInput().nativeElement.click()"
            />
          }
        </div>
      }

      <!-- Hidden Camera Input -->
      <input
        #cameraInput
        type="file"
        accept="image/*"
        capture="environment"
        (change)="onNativeInput($event)"
        hidden
      />

      <!-- Hidden Gallery Input -->
      <input
        #galleryInput
        type="file"
        [accept]="accept() || 'image/*'"
        [multiple]="multiple()"
        (change)="onNativeInput($event)"
        hidden
      />

      <!-- File List -->
      @if (files().length > 0) {
        <div class="file-list flex flex-column gap-2 mt-3">
          @for (file of files(); track file.name) {
            <div class="file-item flex align-items-center gap-2 p-2 surface-ground border-round">
              @if (isImage(file.type)) {
                <img
                  [src]="file.objectURL"
                  [alt]="file.name"
                  class="file-preview border-round"
                />
              } @else {
                <app-icon icon="mdi:file-document-outline" class="text-2xl text-color-muted" />
              }

              <div class="flex flex-column gap-1 flex-1 min-w-0">
                <strong class="text-sm truncate">{{ file.name }}</strong>
                <span class="text-xs text-color-secondary">{{ formatSize(file.size) }}</span>
                @if (file.status === "uploading") {
                  <p-progressBar [value]="file.progress" styleClass="h-1" />
                }
              </div>

              @if (file.status === "done") {
                <app-icon icon="mdi:check-circle" class="text-lg" style="color: var(--ds-success)" />
              } @else if (file.status === "error") {
                <app-icon icon="mdi:alert-circle" class="text-lg" style="color: var(--ds-danger)" />
              } @else {
                <p-button
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  size="small"
                  (onClick)="removeFile(file)"
                >
                  <app-icon icon="mdi:close" class="text-lg" />
                </p-button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .file-upload-root { width: 100%; }
    .file-upload-dropzone {
      transition: all 0.15s;
      background-color: var(--ds-bg-surface);
    }
    .file-upload-dropzone:hover,
    .file-upload-dragover {
      border-color: var(--ds-primary) !important;
      background-color: var(--ds-primary-light);
    }
    .file-preview {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: var(--ds-radius-sm);
    }
    .file-item {
      transition: background-color 0.15s;
    }
    .file-item:hover {
      background-color: var(--ds-bg-sunken);
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class FileUpload {
  private platform = inject(PlatformService);

  chooseLabel = input("Seleccionar archivos");
  accept = input<string>("");
  maxFileSize = input<number>(10000000);
  multiple = input<boolean>(true);
  autoUpload = input<boolean>(true);
  mobileSource = input<"camera" | "gallery" | "both" | "none">("both");

  filesChange = output<UploadFile[]>();
  upload = output<FileUploadHandlerEvent>();

  files = signal<UploadFile[]>([]);
  isDragOver = signal(false);
  isMobile = this.platform.isMobile;

  cameraInput = viewChild.required<ElementRef<HTMLInputElement>>("cameraInput");
  galleryInput = viewChild.required<ElementRef<HTMLInputElement>>("galleryInput");

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      this.addFiles(Array.from(droppedFiles));
    }
  }

  onFilesSelected(event: any): void {
    if (event.files?.length) {
      this.addFiles(Array.from(event.files));
    }
  }

  onNativeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(Array.from(input.files));
      input.value = "";
    }
  }

  private addFiles(newFiles: File[]): void {
    const mapped: UploadFile[] = newFiles.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      progress: 0,
      status: "pending" as const,
      objectURL: this.isImage(f.type) ? URL.createObjectURL(f) : undefined,
    }));

    this.files.update((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const unique = mapped.filter((f) => !existing.has(f.name));
      return [...prev, ...unique];
    });
    this.filesChange.emit(this.files());
  }

  removeFile(file: UploadFile): void {
    if (file.objectURL) {
      URL.revokeObjectURL(file.objectURL);
    }
    this.files.update((prev) => prev.filter((f) => f !== file));
    this.filesChange.emit(this.files());
  }

  isImage(mime: string): boolean {
    return mime.startsWith("image/");
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

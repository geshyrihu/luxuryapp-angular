import {
  Component,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface ScannedFile {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

/**
 * AppReceiptScanner — Captura de recibos/PO con cámara trasera en mobile.
 * En web muestra selector de archivo. En mobile activa cámara environment.
 * Uso: ERP — scan de facturas, recibos, órdenes de compra.
 */
@Component({
  selector: "app-receipt-scanner",

  imports: [ButtonModule, AppIcon],
  template: `
    <div class="rs-root">
      <input
        #fileInput
        type="file"
        [accept]="accept()"
        [attr.capture]="mobile() ? 'environment' : null"
        [multiple]="multiple()"
        class="rs-hidden-input"
        (change)="onFileSelect($event)"
      />

      <!-- Drop zone -->
      @if (!scanned()) {
        <div
          class="rs-dropzone"
          [class.rs-dragging]="dragging"
          (click)="fileInput.click()"
          (dragover)="$event.preventDefault(); dragging = true"
          (dragleave)="dragging = false"
          (drop)="onDrop($event)"
        >
          <app-icon
            [icon]="mobile() ? 'material-symbols-light:image-outline' : 'material-symbols-light:image-outline'"
            class="text-3xl"
          />
          <span class="rs-drop-title">{{
            mobile() ? "Tomar foto del recibo" : "Seleccionar documento"
          }}</span>
          <span class="rs-drop-sub">{{ accept() }} — max {{ maxMb() }} MB</span>
        </div>
      } @else {
        <!-- Preview -->
        <div class="rs-preview">
          @if (isImage()) {
            <img
              [src]="scanned()!.previewUrl"
              [alt]="scanned()!.name"
              class="rs-preview-img"
            />
          } @else {
            <div class="rs-file-icon">
              <app-icon icon="material-symbols-light:description" class="text-3xl" />
            </div>
          }
          <div class="rs-preview-info">
            <span class="rs-file-name">{{ scanned()!.name }}</span>
            <span class="rs-file-size">{{ formatSize(scanned()!.size) }}</span>
          </div>
          <div class="rs-preview-actions">
            <p-button
              label="Repetir"
              severity="secondary"
              [outlined]="true"
              size="small"
              (onClick)="retry()"
            >
              <ng-template #icon>
                <app-icon icon="material-symbols-light:refresh" />
              </ng-template>
            </p-button>
            <p-button
              label="Confirmar"
              size="small"
              (onClick)="confirm()"
            >
              <ng-template #icon>
                <app-icon icon="material-symbols-light:check" />
              </ng-template>
            </p-button>
          </div>
        </div>
      }

      @if (error()) {
        <span class="rs-error">{{ error() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .rs-root {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .rs-hidden-input {
        display: none;
      }
      .rs-dropzone {
        border: 2px dashed var(--ds-border);
        border-radius: var(--ds-radius-lg);
        padding: 2rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        color: var(--ds-text-muted);
        transition:
          border-color 0.15s,
          background 0.15s;
      }
      .rs-dropzone:hover,
      .rs-dragging {
        border-color: var(--ds-primary);
        background: var(--ds-bg-elevated);
        color: var(--ds-primary);
      }
      .rs-drop-title {
        font-size: var(--ds-font-size-label);
        font-weight: 600;
      }
      .rs-drop-sub {
        font-size: var(--ds-font-size-micro);
      }
      .rs-preview {
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        overflow: hidden;
      }
      .rs-preview-img {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        display: block;
      }
      .rs-file-icon {
        padding: 1.5rem;
        display: flex;
        justify-content: center;
        color: var(--ds-text-muted);
        background: var(--ds-bg-elevated);
      }
      .rs-preview-info {
        padding: 0.625rem 0.875rem;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }
      .rs-file-name {
        font-size: var(--ds-font-size-help);
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .rs-file-size {
        font-size: var(--ds-font-size-micro);
        color: var(--ds-text-muted);
      }
      .rs-preview-actions {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 0.875rem;
        background: var(--ds-bg-elevated);
      }
      .rs-error {
        font-size: var(--ds-font-size-help);
        color: var(--ds-danger);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppReceiptScanner implements OnDestroy {
  private readonly imageProcessing = inject(ImageProcessingService);

  accept = input<string>("image/*,.heic,.heif,application/pdf");
  maxMb = input<number>(10);
  mobile = input<boolean>(false);
  multiple = input<boolean>(false);

  fileSelected = output<ScannedFile>();
  confirmed = output<ScannedFile>();

  scanned = signal<ScannedFile | null>(null);
  error = signal<string>("");
  dragging = false;

  isImage(): boolean {
    return this.scanned()?.file.type.startsWith("image/") ?? false;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (file) void this.processFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) void this.processFile(file);
  }

  async processFile(file: File): Promise<void> {
    try {
      const processed = await this.imageProcessing.processFileIfImage(file, {
        maxBytes: this.maxMb() * 1024 * 1024,
        maxDimension: 2560,
      });
      if (processed.size > this.maxMb() * 1024 * 1024) {
        this.error.set(`El archivo excede ${this.maxMb()} MB`);
        return;
      }

      this.releasePreview();
      this.error.set("");
      const previewUrl = processed.type.startsWith("image/")
        ? URL.createObjectURL(processed)
        : "";
      const scannedFile: ScannedFile = {
        file: processed,
        previewUrl,
        name: processed.name,
        size: processed.size,
      };
      this.scanned.set(scannedFile);
      this.fileSelected.emit(scannedFile);
    } catch (error) {
      this.error.set(
        error instanceof Error
          ? error.message
          : "No se pudo procesar la imagen.",
      );
    }
  }

  confirm(): void {
    if (this.scanned()) this.confirmed.emit(this.scanned()!);
  }
  retry(): void {
    this.releasePreview();
    this.scanned.set(null);
    this.error.set("");
  }
  formatSize(b: number): string {
    return b > 1048576
      ? `${(b / 1048576).toFixed(1)} MB`
      : `${(b / 1024).toFixed(0)} KB`;
  }

  ngOnDestroy(): void {
    this.releasePreview();
  }

  private releasePreview(): void {
    const previewUrl = this.scanned()?.previewUrl;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }
}

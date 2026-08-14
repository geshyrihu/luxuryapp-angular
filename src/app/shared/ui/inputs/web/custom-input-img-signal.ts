import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnChanges,
  output,
  signal,
  ViewChild,
  ChangeDetectionStrategy,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../base/base-input-signal";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";
@Component({
  selector: "web-custom-input-img-signal",
  imports: [ReactiveFormsModule, BaseInputSignal],
  template: `
    <base-input-signal
      [label]="label()"
      [id]="id()"
      [required]="required()"
      [control]="control()"
      [horizontal]="horizontal()"
    >
      <div class="image-upload-container">
        <div class="image-trigger" (click)="triggerFileInput()">
          @if (hasImageError()) {
            <div
              class="image-placeholder error"
              [style.height.px]="contentHeight()"
              [style.width.px]="contentWidth()"
            >
              <span class="emoji">⚠️</span>
              <span class="placeholder-text">Imagen no disponible</span>
            </div>
          } @else if (hasImage()) {
            <img
              [src]="displayImageSrc()"
              [alt]="title()"
              [style.height.px]="contentHeight()"
              [style.width.px]="contentWidth()"
              class="image-preview object-cover"
              (error)="onImageError()"
            />
          } @else {
            <div
              class="image-placeholder"
              [style.height.px]="contentHeight()"
              [style.width.px]="contentWidth()"
            >
              <span class="emoji">📷</span>
              <span class="placeholder-text">{{ chooseLabel() }}</span>
            </div>
          }
        </div>

        @if (allowRemove() && (hasImage() || hasImageError())) {
          <button
            type="button"
            class="remove-button"
            (click)="removeImage($event)"
          >
            Eliminar
          </button>
        }

        <input
          #fileInput
          [id]="id()"
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
          hidden
        />
      </div>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .image-upload-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        user-select: none;
      }

      .image-trigger {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      }

      .remove-button {
        background: none;
        border: none;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        color: var(--ds-danger);
        cursor: pointer;
        border-radius: var(--ds-radius-card);
      }

      .remove-button:hover {
        background-color: var(--ds-danger-light);
      }

      .image-preview {
        object-fit: contain;
        background-color: var(--ds-bg-sunken);
        border-radius: var(--ds-radius-card);
        border: 1px solid var(--ds-border);
        box-shadow: var(--ds-shadow-sm);
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }

      .image-upload-container:hover .image-preview {
        box-shadow: var(--ds-shadow-md);
        transform: scale(1.02);
      }

      .image-upload-container:hover .image-placeholder {
        box-shadow: var(--ds-shadow-md);
        transform: scale(1.02);
      }

      .image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background-color: var(--ds-bg-page);
        border: 2px dashed var(--ds-border);
        border-radius: var(--ds-radius-card);
        padding: 1rem;
        transition:
          transform 0.2s,
          box-shadow 0.2s,
          border-color 0.2s;
        cursor: pointer;
        user-select: none;
      }

      .image-placeholder:hover {
        border-color: var(--ds-primary);
      }

      .image-placeholder.error {
        border-color: var(--ds-danger);
        background-color: var(--ds-danger-light);
      }

      .emoji {
        font-size: 3rem;
        line-height: 1;
      }

      .placeholder-text {
        color: var(--ds-text-secondary);
        font-size: 0.875rem;
        text-align: center;
      }
    `,
  ],
})
export class CustomInputImg implements OnChanges {
  private readonly imageProcessing = inject(ImageProcessingService);
  private readonly toast = inject(CustomToastService);
  control = input<FormControl>(new FormControl());
  id = input<string>(`img-${Math.random().toString(36).substring(2, 9)}`);
  urlImgCurrent = input<string>("");
  title = input<string>("");
  chooseLabel = input<string>("Seleccionar imagen");
  /** Muestra el boton de eliminar. El padre debe persistir el borrado. */
  allowRemove = input<boolean>(false);
  maxFileSize = input<number>(15000000); // 15MB — post-compresión
  compressThreshold = input<number>(2000000); // 2MB — comprimir si supera esto
  compressionQuality = input<number>(0.75);
  required = input<boolean>(false);
  label = input<string>("Logotipo");
  horizontal = input<boolean>(true);

  // Transform inputs for height/width
  contentHeight = input(160, {
    transform: (value: string | number) =>
      typeof value === "string" ? parseInt(value, 10) : value,
  });
  contentWidth = input(240, {
    transform: (value: string | number) =>
      typeof value === "string" ? parseInt(value, 10) : value,
  });

  fileSelected = output<File>();
  imageLoaded = output<string>();
  uploadError = output<any>();

  // Alias para compatibilidad con código legacy
  propagar = this.fileSelected;

  imgBase64 = signal<string>("");
  hasImageError = signal<boolean>(false);
  /** El usuario elimino la imagen: ignora urlImgCurrent hasta elegir otra. */
  removed = signal<boolean>(false);

  hasImage = computed(() => {
    if (this.imgBase64()) return true;
    if (this.removed()) return false;
    const current = this.urlImgCurrent();
    return !!current && !this.isNullUrl(current);
  });

  displayImageSrc = computed(() => {
    if (this.imgBase64()) return this.imgBase64();
    if (this.removed()) return "";
    const current = this.urlImgCurrent();
    if (current && !this.isNullUrl(current)) {
      return current;
    }
    return "";
  });

  private isNullUrl(url: any): boolean {
    if (typeof url !== 'string') return true;
    return url.endsWith("/null") || url === "null";
  }

  ngOnChanges(): void {
    // Resetear error cuando cambia la imagen del padre
    const current = this.urlImgCurrent();
    if (current && !this.isNullUrl(current)) {
      this.hasImageError.set(false);
    }
  }

  onImageError(): void {
    this.hasImageError.set(true);
  }

  // ✅ Obtén la referencia al input con @ViewChild
  @ViewChild("fileInput", { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput(): void {
    // ✅ Ahora accedemos al elemento nativo
    this.fileInput?.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    input.value = "";
    this.hasImageError.set(false);

    if (!file) return;

    try {
      const processed = await this.imageProcessing.processImage(file, {
        maxBytes: Math.min(this.maxFileSize(), this.compressThreshold()),
        maxDimension: 1920,
        quality: this.compressionQuality(),
      });

      if (processed.size > this.maxFileSize()) {
        const tooLarge = new Error(
          `El archivo excede el tamaño máximo de ${this.maxFileSize() / 1000000} MB`,
        );
        this.toast.showError("Archivo demasiado grande", tooLarge.message);
        this.uploadError.emit(tooLarge);
        return;
      }

      const base64 = await this.convertToBase64(processed);
      this.imgBase64.set(base64);
      this.removed.set(false);
      this.fileSelected.emit(processed);
      this.imageLoaded.emit(base64);
      this.control().setValue(processed);
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    } catch (error) {
      console.error("Error al procesar imagen:", error);
      this.toast.showError(
        "No se pudo procesar la imagen",
        error instanceof Error
          ? error.message
          : `No se pudo procesar "${file.name}".`,
      );
      this.uploadError.emit(error);
    }
  }

  /** `null` en el control significa "eliminar"; el padre debe persistirlo. */
  removeImage(event: Event): void {
    event.stopPropagation();
    this.imgBase64.set("");
    this.hasImageError.set(false);
    this.removed.set(true);
    this.control().setValue(null);
    this.control().markAsDirty();
    this.control().updateValueAndValidity();
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
      reader.readAsDataURL(file);
    });
  }
}

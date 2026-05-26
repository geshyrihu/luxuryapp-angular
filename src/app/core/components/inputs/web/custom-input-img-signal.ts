import {
  Component,
  computed,
  ElementRef,
  input,
  OnChanges,
  output,
  signal,
  ViewChild,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../base/base-input-signal";
@Component({
  selector: "custom-input-img-signal",
  imports: [ReactiveFormsModule, BaseInputSignal],
  template: `
    <base-input-signal
      [label]="label()"
      [id]="id()"
      [required]="required()"
      [control]="control()"
      [horizontal]="horizontal()"
    >
      <div class="image-upload-container" (click)="triggerFileInput()">
        @if (hasImageError()) {
          <div class="image-placeholder error">
            <span class="emoji">⚠️</span>
            <span class="placeholder-text">Imagen no disponible</span>
          </div>
        } @else if (hasImage()) {
          <img
            [src]="displayImageSrc()"
            [alt]="title()"
            [style.max-height.px]="contentHeight()"
            [style.max-width.px]="contentWidth()"
            style="width: auto; height: auto;"
            class="image-preview"
            (error)="onImageError()"
          />
        } @else {
          <div class="image-placeholder">
            <span class="emoji">📷</span>
            <span class="placeholder-text">{{ chooseLabel() }}</span>
          </div>
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
  styles: [
    `
      .image-upload-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
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
  control = input<FormControl>(new FormControl());
  id = input<string>(`img-${Math.random().toString(36).substring(2, 9)}`);
  urlImgCurrent = input<string>("");
  title = input<string>("");
  chooseLabel = input<string>("Seleccionar imagen");
  maxFileSize = input<number>(15000000); // 15MB — post-compresión
  compressThreshold = input<number>(2000000); // 2MB — comprimir si supera esto
  compressionQuality = input<number>(0.75);
  required = input<boolean>(false);
  label = input<string>("Logotipo");
  horizontal = input<boolean>(true);

  // Transform inputs for height/width
  contentHeight = input(100, {
    transform: (value: string | number) =>
      typeof value === "string" ? parseInt(value, 10) : value,
  });
  contentWidth = input(150, {
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

  hasImage = computed(() => {
    if (this.imgBase64()) return true;
    const current = this.urlImgCurrent();
    return current && !this.isNullUrl(current);
  });

  displayImageSrc = computed(() => {
    if (this.imgBase64()) return this.imgBase64();
    const current = this.urlImgCurrent();
    if (current && !this.isNullUrl(current)) {
      return current;
    }
    return "";
  });

  private isNullUrl(url: string): boolean {
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
      const processed = file.size > this.compressThreshold()
        ? await this.compressImage(file)
        : file;

      if (processed.size > this.maxFileSize()) {
        this.uploadError.emit(new Error(
          `El archivo excede el tamaño máximo de ${this.maxFileSize() / 1000000} MB`,
        ));
        return;
      }

      const base64 = await this.convertToBase64(processed);
      this.imgBase64.set(base64);
      this.fileSelected.emit(processed);
      this.imageLoaded.emit(base64);
      this.control().setValue(processed);
      this.control().markAsDirty();
      this.control().updateValueAndValidity();
    } catch (error) {
      console.error("Error al procesar imagen:", error);
      this.uploadError.emit(error);
    }
  }

  private compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX = 1920;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          } else {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("No se pudo comprimir la imagen"));
              return;
            }
            resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
          },
          "image/jpeg",
          this.compressionQuality(),
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("No se pudo cargar la imagen para compresión"));
      };
      img.src = objectUrl;
    });
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

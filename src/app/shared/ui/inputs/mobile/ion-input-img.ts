import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon, IonImg } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cameraOutline, trashOutline } from "ionicons/icons";
import { BaseIonicInput } from "../base/base-ionic-input";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";

@Component({
  selector: "ion-input-img",
  imports: [BaseIonicInput, ReactiveFormsModule, IonButton, IonIcon, IonImg],
  template: `
    <base-ionic-input
      [control]="control() || internalControl"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <div class="w-full flex flex-column gap-2 align-items-center">
        @if (!displayUrl()) {
          <ion-button
            expand="block"
            mode="md"
            fill="outline"
            [disabled]="readonly() || disabled()"
            (click)="triggerFileInput()"
            class="w-full"
          >
            <ion-icon slot="start" name="camera-outline"></ion-icon>
            {{ chooseLabel() }}
          </ion-button>
        } @else {
          <div class="flex flex-column gap-1 w-15rem align-items-center">
            <ion-img
              [src]="displayUrl()"
              class="w-full h-10rem rounded shadow-sm object-cover"
              (click)="triggerFileInput()"
            />
            @if (allowRemove() && !readonly() && !disabled()) {
              <ion-button
                fill="clear"
                color="danger"
                size="small"
                (click)="removeFile()"
              >
                <ion-icon slot="start" name="trash-outline"></ion-icon>
                Eliminar
              </ion-button>
            }
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
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputImg),
      multi: true,
    },
  ],
})
export class IonInputImg extends BaseIonicInput implements OnDestroy {
  private readonly imageProcessing = inject(ImageProcessingService);
  private readonly toast = inject(CustomToastService);
  private previewObjectUrl: string | null = null;

  urlImgCurrent = input<string>("");
  chooseLabel = input<string>("Seleccionar imagen");
  /** Muestra el boton de eliminar. El padre debe persistir el borrado. */
  allowRemove = input<boolean>(false);
  maxFileSize = input<number>(15000000);
  compressThreshold = input<number>(2000000);
  compressionQuality = input<number>(0.75);
  fileSelected = output<File>();
  uploadError = output<unknown>();

  /** Preview local del archivo recien elegido (objectURL). */
  private readonly previewUrl = signal<string | null>(null);
  /** El usuario elimino la imagen: ignora urlImgCurrent hasta elegir otra. */
  private readonly removed = signal(false);

  readonly displayUrl = computed(() => {
    const preview = this.previewUrl();
    if (preview) return preview;
    if (this.removed()) return null;
    const url = this.urlImgCurrent();
    return url && !this.isNullUrl(url) ? url : null;
  });

  @ViewChild("fileInput", { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    super();
    addIcons({ cameraOutline, trashOutline });
  }

  triggerFileInput(): void {
    if (this.readonly() || this.disabled()) return;
    this.fileInput?.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
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

      this.clearPreview();
      this.previewObjectUrl = URL.createObjectURL(processed);
      this.previewUrl.set(this.previewObjectUrl);
      this.removed.set(false);
      this.writeToControl(processed);
      this.fileSelected.emit(processed);
    } catch (error) {
      this.toast.showError(
        "No se pudo procesar la imagen",
        error instanceof Error
          ? error.message
          : `No se pudo procesar "${file.name}".`,
      );
      this.uploadError.emit(error);
    }
  }

  removeFile(): void {
    this.clearPreview();
    this.previewUrl.set(null);
    this.removed.set(true);
    this.writeToControl(null);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnDestroy(): void {
    this.clearPreview();
  }

  /** Escribe en el control del padre; `null` significa "eliminar". */
  private writeToControl(value: File | null): void {
    this.onChange(value);
    this.onTouch();
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(value);
    ctrl.markAsDirty();
    ctrl.updateValueAndValidity();
  }

  private isNullUrl(url: string): boolean {
    return url.endsWith("/null") || url === "null";
  }

  private clearPreview(): void {
    if (!this.previewObjectUrl) return;
    URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }
}

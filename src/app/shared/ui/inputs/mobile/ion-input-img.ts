import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  ViewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon, IonImg } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cameraOutline, trashOutline } from "ionicons/icons";
import { BaseIonicInput } from "../base/base-ionic-input";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";

@Component({
  selector: "ion-input-img",
  imports: [BaseIonicInput, ReactiveFormsModule, IonButton, IonIcon, IonImg],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <div class="w-full flex flex-column gap-2 align-items-center">
        @if (!imageUrl) {
          <ion-button
            expand="block"
            mode="md"
            fill="outline"
            (click)="triggerFileInput()"
            class="w-full"
          >
            <ion-icon slot="start" name="camera-outline"></ion-icon>
            Seleccionar imagen
          </ion-button>
        } @else {
          <div class="flex flex-column gap-1 w-15rem align-items-center">
            <ion-img
              [src]="imageUrl"
              class="w-full h-10rem rounded shadow-sm object-cover"
            />
            <ion-button
              fill="clear"
              color="danger"
              size="small"
              (click)="removeFile()"
            >
              <ion-icon slot="start" name="trash-outline"></ion-icon>
              Eliminar
            </ion-button>
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
  private previewObjectUrl: string | null = null;

  urlImgCurrent = input<string>("");
  maxFileSize = input<number>(15000000);
  compressThreshold = input<number>(2000000);
  compressionQuality = input<number>(0.75);
  fileSelected = output<File>();
  uploadError = output<unknown>();
  imageUrl: string | null = null;

  @ViewChild("fileInput", { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    super();
    addIcons({ cameraOutline, trashOutline });
    effect(() => {
      const url = this.urlImgCurrent();
      if (url && !this.imageUrl) {
        this.imageUrl = url;
      }
    });
  }

  triggerFileInput(): void {
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
      this.clearPreview();
      this.previewObjectUrl = URL.createObjectURL(processed);
      this.imageUrl = this.previewObjectUrl;
      this.onChange(processed);
      this.onTouch();
      const ctrl = this.control() || this.internalControl;
      ctrl.setValue(processed);
      ctrl.markAsDirty();
      this.fileSelected.emit(processed);
    } catch (error) {
      this.uploadError.emit(error);
    }
  }

  removeFile(): void {
    this.clearPreview();
    this.imageUrl = null;
    this.onChange(null);
    this.onTouch();
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(null);
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

  private clearPreview(): void {
    if (!this.previewObjectUrl) return;
    URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }
}

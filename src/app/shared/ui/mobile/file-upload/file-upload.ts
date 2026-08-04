import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { FileUploadBase, FileUploadEvent } from "@ui/base/file-upload.base";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cloudUploadOutline } from "ionicons/icons";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";

@Component({
  selector: "ili-file-upload",
  imports: [IonButton, IonIcon],
  template: `
    <div class="mobile-file-upload">
      <input
        type="file"
        [accept]="accept()"
        [multiple]="multiple()"
        (change)="onFileChange($event)"
        #fileInput
        style="display: none;"
      />
      <ion-button (click)="fileInput.click()" expand="block" fill="outline">
        <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
        {{ chooseLabel() }}
      </ion-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliFileUpload extends FileUploadBase {
  private readonly imageProcessing = inject(ImageProcessingService);
  private readonly toast = inject(CustomToastService);

  constructor() {
    super();
    addIcons({ cloudUploadOutline });
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files ?? []);
    input.value = "";
    const files: File[] = [];

    for (const file of selectedFiles) {
      try {
        const processed = await this.imageProcessing.processFileIfImage(file, {
          maxBytes: this.maxFileSize(),
        });
        if (processed.size > this.maxFileSize()) {
          this.toast.showError(
            "Archivo demasiado grande",
            `El archivo "${file.name}" excede el tamano maximo permitido.`,
          );
          continue;
        }
        files.push(processed);
      } catch (error) {
        this.toast.showError(
          "No se pudo procesar la imagen",
          error instanceof Error
            ? error.message
            : `No se pudo procesar "${file.name}".`,
        );
      }
    }

    if (files.length > 0) {
      this.onSelect.emit({ originalEvent: event, files });
      if (this.autoUpload()) {
        this.upload.emit({ originalEvent: event, files });
      }
    }
  }
}

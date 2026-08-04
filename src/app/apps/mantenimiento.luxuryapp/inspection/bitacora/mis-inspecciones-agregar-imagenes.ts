import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";

interface NewInspectionImage {
  id: string;
  file: File;
  url: string;
}

@Component({
  selector: "app-mis-inspecciones-agregar-imagenes",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    WebButtonLabel,
    NgbTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mis-inspecciones-agregar-imagenes.html",
})
export class MisInspeccionesAgregarImagenes implements OnDestroy {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  imageProcessing = inject(ImageProcessingService);
  toast = inject(CustomToastService);
  inspectionResultId: string = "";
  submitting = signal(false);

  existingImages: any[] = [];
  newImages: NewInspectionImage[] = [];

  ngOnInit(): void {
    this.inspectionResultId = this.config.data.inspectionResultId;
    this.loadExistingImages();
  }

  loadExistingImages(): void {
    this.apiResponseS
      .onGetItem(
        Endpoints.InspectionResultImages.byInspectionResultAndCustomer(
          this.inspectionResultId,
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => {
        this.existingImages = result;
      });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = "";

    for (const file of files) {
      try {
        const processed = await this.imageProcessing.processImage(file, {
          maxBytes: 5 * 1024 * 1024,
          maxDimension: 2560,
        });
        this.newImages.push({
          id: "",
          file: processed,
          url: URL.createObjectURL(processed),
        });
      } catch (error) {
        this.toast.showError(
          "No se pudo procesar la imagen",
          error instanceof Error ? error.message : `Archivo: ${file.name}`,
        );
      }
    }
  }

  onSaveImages(): void {
    const formData = new FormData();

    this.newImages.forEach((image) => {
      formData.append("images", image.file);
    });

    this.apiResponseS
      .onPost(
        Endpoints.InspectionResultImages.byInspectionResultAndCustomer(
          this.inspectionResultId,
          this.customerIdS.customerId(),
        ),
        formData,
      )
      .then(() => {
        this.loadExistingImages();
      });
  }

  removeNewImage(index: number): void {
    URL.revokeObjectURL(this.newImages[index].url);
    this.newImages.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.newImages.forEach((image) => URL.revokeObjectURL(image.url));
  }

  deleteExistingImage(imageId: string): void {
    this.apiResponseS
      .onDelete(
        Endpoints.InspectionResultImages.deleteInspectionImage(
          imageId,
          this.customerIdS.customerId(),
        ),
      )
      .then(() => {
        this.existingImages = this.existingImages.filter(
          (img) => img.id !== imageId,
        );
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-mis-inspecciones-agregar-imagenes",
  imports: [WebButtonIcon, TooltipModule, WebButtonLabel, NgbTooltipModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mis-inspecciones-agregar-imagenes.html",
})
export class MisInspeccionesAgregarImagenes {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  inspectionResultId: string = "";
  submitting = signal(false);

  existingImages: any[] = [];
  newImages: any[] = [];

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

  onFileSelected(event: any): void {
    const files: File[] = Array.from(event.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const image = {
          id: "",
          file,
          url: e.target.result,
        };

        this.newImages.push(image);
      };

      reader.readAsDataURL(file);
    });
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
    this.newImages.splice(index, 1);
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

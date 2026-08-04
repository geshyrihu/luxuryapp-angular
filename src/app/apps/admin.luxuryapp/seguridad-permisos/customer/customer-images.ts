import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxImage } from "@ui/adaptive/image/image";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";
import { CustomerImageDto } from "./interfaces/customer-image.dto";

@Component({
  selector: "app-customer-images",
  templateUrl: "./customer-images.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxImage, AppIcon, WebButtonIcon],
})
export class CustomerImages implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private imageProcessing = inject(ImageProcessingService);
  private toast = inject(CustomToastService);

  customerId = signal<string>("");
  images = signal<CustomerImageDto[]>([]);
  loading = signal<boolean>(false);
  uploading = signal<boolean>(false);
  isDragOver = signal<boolean>(false);

  hasImages = computed(() => this.images().length > 0);

  ngOnInit() {
    const id = this.config.data?.customerId || this.config.data?.id;
    if (id) {
      this.customerId.set(id);
      this.onLoadData();
    }
  }

  async onLoadData() {
    this.loading.set(true);
    const resp = await this.apiResponseS.onGetList<CustomerImageDto[]>(
      Endpoints.CustomerImages.getByCustomerId(this.customerId()),
    );
    if (resp) {
      this.images.set(resp);
    }
    this.loading.set(false);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFiles(Array.from(input.files));
    }
    input.value = "";
  }

  async uploadFiles(files: File[]) {
    if (!this.customerId()) {
      return; // Prevenir error 400 'The value '' is not valid for CustomerId'
    }

    this.uploading.set(true);
    try {
      const processedFiles = await this.imageProcessing.processImages(files, {
        maxBytes: 5 * 1024 * 1024,
        maxDimension: 2560,
      });
      const formData = new FormData();
      formData.append("customerId", this.customerId());

      processedFiles.forEach((file) => {
        formData.append("images", file, file.name);
      });

      const resp = await this.apiResponseS.onPostFile(
        Endpoints.CustomerImages.createBulk,
        formData,
      );
      if (resp) await this.onLoadData();
    } catch (error) {
      this.toast.showError(
        "No se pudieron procesar las imagenes",
        error instanceof Error ? error.message : "Selecciona imagenes validas.",
      );
    } finally {
      this.uploading.set(false);
    }
  }

  async onDelete(id: string) {
    this.loading.set(true);
    const success = await this.apiResponseS.onDelete(
      Endpoints.CustomerImages.delete(id),
    );
    if (success) {
      this.onLoadData();
    } else {
      this.loading.set(false);
    }
  }
}

import { CommonModule } from "@angular/common";
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
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomerImageDto } from "./interfaces/customer-image.dto";

@Component({
  selector: "app-customer-images",
  templateUrl: "./customer-images.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LxImage, AppIcon, WebButtonIcon],
})
export class CustomerImages implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);

  customerId = signal<string>("");
  images = signal<CustomerImageDto[]>([]);
  loading = signal<boolean>(false);
  uploading = signal<boolean>(false);
  isDragOver = signal<boolean>(false);

  hasImages = computed(() => this.images().length > 0);

  ngOnInit() {
    if (this.config.data?.id) {
      this.customerId.set(this.config.data.id);
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
  }

  async uploadFiles(files: File[]) {
    this.uploading.set(true);
    const formData = new FormData();
    formData.append("customerId", this.customerId());

    files.forEach((file) => {
      formData.append("files", file);
    });

    const resp = await this.apiResponseS.onPostFile(
      Endpoints.CustomerImages.create,
      formData,
    );
    if (resp) {
      this.onLoadData();
    }
    this.uploading.set(false);
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

import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ICustomerImageDTO } from "../models/customer.dto";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-customer-images",
  templateUrl: "./customer-images.html",
  imports: [CommonModule, ImageModule, AppIcon, WebButtonIcon],
})
export class CustomerImages implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);

  customerId = signal<string>("");
  images = signal<ICustomerImageDTO[]>([]);
  loading = signal<boolean>(false);
  uploading = signal<boolean>(false);
  isDragOver = signal<boolean>(false);

  hasImages = computed(() => this.images().length > 0);

  ngOnInit(): void {
    const id = this.config.data?.customerId;
    if (id) {
      this.customerId.set(id);
      this.onLoadData();
    }
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<ICustomerImageDTO[]>(
        Endpoints.CustomerImages.getByCustomerId(this.customerId())
      )
      .then((result) => {
        this.images.set(result ?? []);
        this.loading.set(false);
      });
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
      input.value = "";
    }
  }

  uploadFiles(files: File[]) {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    this.uploading.set(true);
    const formData = new FormData();
    formData.append("customerId", this.customerId());
    imageFiles.forEach((file) => formData.append("images", file));

    this.apiResponseS
      .onPost<ICustomerImageDTO[]>(Endpoints.CustomerImages.createBulk, formData)
      .then((result) => {
        if (result) {
          this.images.update((prev) => [...prev, ...result]);
        }
        this.uploading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.CustomerImages.delete(id))
      .then((result) => {
        if (result) {
          this.images.update((prev) => prev.filter((img) => img.id !== id));
        }
      });
  }
}

import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { ImageModule } from "primeng/image";
import { TooltipModule } from "primeng/tooltip";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ICustomerImageDTO } from "../models/customer.dto";

@Component({
  selector: "app-customer-images",
  templateUrl: "./customer-images.html",

  imports: [
    CommonModule,
    FileUploadModule,
    ImageModule,
    ButtonModule,
    TooltipModule,
  ],
})
export class CustomerImages implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);

  customerId = signal<string>("");
  images = signal<ICustomerImageDTO[]>([]);
  loading = signal<boolean>(false);

  // Computado para saber si hay imágenes
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
      .onGetItem<
        ICustomerImageDTO[]
      >(Endpoints.CustomerImages.getByCustomerId(this.customerId()))
      .then((result) => {
        this.images.set(result ?? []);
        this.loading.set(false);
      });
  }

  onUpload(event: any) {
    const file = event.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("customerId", this.customerId());
    formData.append("image", file);

    this.apiResponseS
      .onPost<ICustomerImageDTO>(Endpoints.CustomerImages.create, formData)
      .then((result) => {
        if (result) {
          this.images.update((prev) => [...prev, result]);
        }
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

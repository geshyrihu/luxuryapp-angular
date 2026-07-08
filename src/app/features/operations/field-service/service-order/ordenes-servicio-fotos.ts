import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { AppImage } from "@ui/web/image/image";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

@Component({
  selector: "app-ordenes-servicio-fotos",
  templateUrl: "./ordenes-servicio-fotos.html",

  imports: [WebButtonLabelDelete, AppImage],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConfirmationService, MessageService],
})
export class OrdenesServicioFotos implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly apiResponseS = inject(ApiResponseService);

  // Mandato GEMINI.md: Uso de Signals exclusivamente
  readonly id = signal<string>("");
  readonly data = signal<any[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    const idParam = this.config.data?.id;
    if (idParam) {
      this.id.set(idParam);
      this.onLoadData();
    }
  }

  async onLoadData() {
    this.loading.set(true);
    try {
      const urlApi = Endpoints.ServiceOrders.photos(
        this.id(),
        this.customerIdS.customerId(),
      );
      const result = await this.apiResponseS.onGetList<any[]>(urlApi);
      this.data.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  confirmDelete(id: string): void {
    this.deleteImg(id);
  }

  async deleteImg(id: string): Promise<void> {
    await this.apiResponseS.onDelete(Endpoints.ServiceOrders.deleteImg(id));
    await this.onLoadData();
  }
}

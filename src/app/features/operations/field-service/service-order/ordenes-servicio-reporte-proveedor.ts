import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { Component, computed, inject, signal } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-ordenes-servicio-reporte-proveedor",
  templateUrl: "./ordenes-servicio-reporte-proveedor.html",
  imports: [TableModule, CustomButtonDelete],
})
export class OrdenesServicioReporteProveedor {
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  messageS = inject(MessageService);
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  id: string = "";
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);

  constructor() {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }
  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const urlApi = Endpoints.ServiceOrders.reporteProveedor(this.id, customerId);
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  deleteDoc(id: string): void {
    const urlApi = Endpoints.ServiceOrders.deleteDocument(id);

    this.apiResponseS.onDelete(urlApi).then(() => {
      this.onLoadData();
    });
  }
}











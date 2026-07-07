import { Component, computed, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { Endpoints } from "src/app/core/constants/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-ordenes-servicio-reporte-proveedor",
  templateUrl: "./ordenes-servicio-reporte-proveedor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,TableModule],
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
    const urlApi = Endpoints.ServiceOrders.reporteProveedor(
      this.id,
      customerId,
    );
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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Component({
  selector: "app-ordenes-servicio-reporte-proveedor",
  templateUrl: "./ordenes-servicio-reporte-proveedor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
  ],
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

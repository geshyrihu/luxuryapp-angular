import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { MessageService } from "@ui/web/primeng-api/primeng-api";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-ordenes-servicio-reporte-proveedor",
  templateUrl: "./ordenes-servicio-reporte-proveedor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    WebButtonIconDelete,
    WebButtonIconItem,
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
  dialogHandlerS = inject(DialogHandlerService);
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

  viewPdf(url: string, fileName: string): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true,
    );
  }

  deleteDoc(id: string): void {
    const urlApi = Endpoints.ServiceOrders.deleteDocument(id);

    this.apiResponseS.onDelete(urlApi).then(() => {
      this.onLoadData();
    });
  }
}

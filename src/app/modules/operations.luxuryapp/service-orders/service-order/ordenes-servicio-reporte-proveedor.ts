import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-ordenes-servicio-reporte-proveedor",
  templateUrl: "./ordenes-servicio-reporte-proveedor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable],
})
export class OrdenesServicioReporteProveedor {
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  dialogHandlerS = inject(DialogHandlerService);
  confirmS = inject(ConfirmService);
  id: string = "";
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);

  constructor() {
    this.id = this.config.data?.id;
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

  async deleteDoc(id: string): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "Se eliminara el documento. Esta acción no se puede deshacer. Continuar?",
    );
    if (!confirmed) return;

    const urlApi = Endpoints.ServiceOrders.deleteDocument(id);

    this.apiResponseS.onDelete(urlApi).then(() => {
      this.onLoadData();
    });
  }
}

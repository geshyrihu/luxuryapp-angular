import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { OrdenCompra } from "@purchases.luxuryapp/purchase-orders/purchase-order/orden-compra";
import { OrdenCompraService } from "@purchases.luxuryapp/purchase-orders/services/orden-compra.service";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { PurchaseHistoryDesktop } from "./desktop/purchase-history-desktop";
import { PurchaseHistoryMobile } from "./mobile/purchase-history-mobile";
import { PurchaseHistoryDTO } from "./presupuestos.interfaces";

@Component({
  selector: "app-purchase-history",
  templateUrl: "./purchase-history.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PurchaseHistoryDesktop, PurchaseHistoryMobile],
})
export class PurchaseHistory implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  ordenCompraService = inject(OrdenCompraService);
  platformS = inject(PlatformService);

  dataSignal = signal<PurchaseHistoryDTO[]>([]);
  loading = signal(true);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    const customerId: string = this.customerIdS.customerId();
    const fiscalYear = this.config.data.fiscalYear;
    const accountNumber = this.config.data.accountNumber;

    const urlApi = Endpoints.Funding.purchaseHistory(
      customerId,
      fiscalYear,
      accountNumber,
    );
    this.loading.set(true);

    this.apiResponseS
      .onGetItem<PurchaseHistoryDTO[]>(urlApi)
      .then((result) => {
        this.dataSignal.set(result || []);
      })
      .catch(() => {
        this.dataSignal.set([]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onShowPurchaseDetails(id: string): void {
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerS.openDialog(
      OrdenCompra,
      { id },
      "Editar Orden de Compra",
      this.dialogHandlerS.sizeFull,
    );
  }

  viewPdf(url: string, fileName: string): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true,
    );
  }
}

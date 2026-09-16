import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "@core/services/dialog-handler.service";
import { OrdenCompraService } from "@core/services/orden-compra.service";
import { OrdenCompra } from "@supplier.luxuryapp/po/purchase-order/orden-compra";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { PurchaseHistoryDTO } from "./presupuestos.interfaces";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-purchase-history",
  templateUrl: "./purchase-history.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    AppIcon,
    CommonModule,
    AppTable,

    AppSortableColumn,

    AppSorticon,

    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileListItem,
  ],
})
export class PurchaseHistory implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  formB = inject(FormBuilder);
  ordenCompraService = inject(OrdenCompraService);
  dataSignal = signal<PurchaseHistoryDTO[]>([]);

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  sumaTotal = computed(() => {
    return this.dataSignal().reduce((acc, item) => acc + (item.amount || 0), 0);
  });

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



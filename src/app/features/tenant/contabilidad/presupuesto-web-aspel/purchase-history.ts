import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PdfViewerModal } from "src/app/core/components/pdf-viewer-modal/pdf-viewer-modal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { OrdenCompra } from "src/app/features/tenant/purchases/purchase-order/orden-compra";
import { PurchaseHistoryDTO } from "./presupuestos.interfaces";

@Component({
  selector: "app-purchase-history",
  templateUrl: "./purchase-history.html",
  imports: [
    CommonModule,
    TableModule,
    CustomButton,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
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

    const urlApi = `funding/purchase-history/${customerId}/${fiscalYear}/${accountNumber}`;
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


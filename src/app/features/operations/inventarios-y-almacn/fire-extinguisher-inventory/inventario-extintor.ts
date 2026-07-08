import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  downloadOutline,
  flameOutline,
  folderOpenOutline,
  listOutline,
  qrCodeOutline,
} from "ionicons/icons";
import { AppImage } from "@ui/web/image/image";
import { TableModule } from "primeng/table";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IInventarioExtintor } from "src/app/core/interfaces/inventario-extintor.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { InventarioExtintorBulkDateForm } from "./inventario-extintor-bulk-date-form";
import { InventarioExtintorForm } from "./inventario-extintor-form";
import { InventarioExtintorPdfService } from "./inventario-extintor-pdf.service";
import { InventarioExtintorQrService } from "./inventario-extintor-qr.service";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-inventario-extintor",
  templateUrl: "./inventario-extintor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    WebButtonIconDownload,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelDownload,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    AppIcon,
    AppImage,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
  ],
})
export class InventarioExtintor {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  inventarioExtintorPdfS = inject(InventarioExtintorPdfService);
  inventarioExtintorQrS = inject(InventarioExtintorQrService);
  router = inject(Router);

  dataSignal = signal<IInventarioExtintor[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({
      flameOutline,
      folderOpenOutline,
      downloadOutline,
      listOutline,
      qrCodeOutline,
      calendarOutline,
    });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onDownloadPdf() {
    this.inventarioExtintorPdfS.downloadPdf(this.dataSignal());
  }

  onViewHistory(item: IInventarioExtintor) {
    this.router.navigate(ROUTES.BITACORAS.EXTINTOR_BITACORA(item.id));
  }

  onOpenScanner() {
    this.router.navigate(ROUTES.BITACORAS.SCANNER_EQUIPOS);
  }

  onViewPeriodos() {
    this.router.navigate(ROUTES.BITACORAS.PERIODOS_INSPECCION, {
      queryParams: { type: "extintor" },
    });
  }

  onBulkExpiration() {
    this.dialogHandlerS
      .openDialog(
        InventarioExtintorBulkDateForm,
        {},
        "Actualizar fecha de vencimiento",
        this.dialogHandlerS.sizeSm,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDownloadQr(item: IInventarioExtintor) {
    await this.inventarioExtintorQrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.inventarioExtintorQrS.downloadAllQr(this.dataSignal());
  }

  onLoadData() {
    const urlApi = "InventarioExtintor/list/" + this.customerIdS.customerId();
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`InventarioExtintor/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        InventarioExtintorForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";

import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { addIcons } from "ionicons";
import {
  downloadOutline,
  listOutline,
  qrCodeOutline,
  timeOutline,
  waterOutline,
} from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { InventarioHidranteDto } from "src/app/core/interfaces/inventario-hidrante.interface";
import { AccountingCatalogExcelService } from "src/app/core/services/accounting-catalog-excel.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { InventarioHidranteForm } from "./inventario-hidrante-form";
import { InventarioHidranteQrService } from "./inventario-hidrante-qr.service";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

@Component({
  selector: "app-inventario-hidrante",
  templateUrl: "./inventario-hidrante.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    WebButtonIconDownload,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LxTooltipDirective,
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
export class InventarioHidrante {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  excelS = inject(AccountingCatalogExcelService);
  qrS = inject(InventarioHidranteQrService);
  router = inject(Router);

  dataSignal = signal<InventarioHidranteDto[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({
      waterOutline,
      listOutline,
      qrCodeOutline,
      downloadOutline,
      timeOutline,
    });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onOpenScanner() {
    this.router.navigate(ROUTES.BITACORAS.SCANNER_EQUIPOS);
  }

  async onDownloadQr(item: InventarioHidranteDto) {
    await this.qrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.qrS.downloadAllQr(this.dataSignal());
  }

  onViewHistory(item: InventarioHidranteDto) {
    this.router.navigate(ROUTES.BITACORAS.HIDRANTE_BITACORA(item.id));
  }

  onViewPeriodos() {
    this.router.navigate(ROUTES.BITACORAS.PERIODOS_INSPECCION, {
      queryParams: { type: "hidrante" },
    });
  }

  downloadTemplate() {
    void this.excelS.exportToExcel(
      [
        {
          ubicacion: "Lobby Piso 1",
          codigo: "HID-01",
          tipo: "IndoorCabinet",
          gabinete: "GAB-01-A",
        },
      ],
      [
        { header: "Ubicacion *", key: "ubicacion", width: 30 },
        { header: "Codigo (opcional)", key: "codigo", width: 20 },
        {
          header: "Tipo * (IndoorCabinet | OutdoorHydrant | SiameseConnection)",
          key: "tipo",
          width: 55,
        },
        { header: "Numero Gabinete (opcional)", key: "gabinete", width: 25 },
      ],
      "Hidrantes",
      "plantilla-hidrantes",
    );
  }

  async onImportExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await this.apiResponseS.onPost<number>(
      `InventarioHidrante/import/${this.customerIdS.customerId()}`,
      formData,
    );
    if (result !== false) this.onLoadData();
    input.value = "";
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.RefactorOperations.inventarioHidranteListById(
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.RefactorOperations.inventarioHidranteById(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        InventarioHidranteForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

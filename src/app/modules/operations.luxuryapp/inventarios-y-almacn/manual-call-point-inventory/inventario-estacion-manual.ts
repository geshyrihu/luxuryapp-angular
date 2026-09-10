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
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import {
  alertCircleOutline,
  downloadOutline,
  listOutline,
  qrCodeOutline,
  timeOutline,
} from "ionicons/icons";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { InventarioEstacionManualDto } from "src/app/core/interfaces/inventario-estacion-manual.interface";
import { AccountingCatalogExcelService } from "src/app/core/services/accounting-catalog-excel.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { InventarioEstacionManualForm } from "./inventario-estacion-manual-form";
import { InventarioEstacionManualQrService } from "./inventario-estacion-manual-qr.service";

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
  selector: "app-inventario-estacion-manual",
  templateUrl: "./inventario-estacion-manual.html",
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
export class InventarioEstacionManual {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  excelS = inject(AccountingCatalogExcelService);
  qrS = inject(InventarioEstacionManualQrService);
  router = inject(Router);

  dataSignal = signal<InventarioEstacionManualDto[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({
      alertCircleOutline,
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

  async onDeleteAll() {
    const confirmed = confirm(
      "¿Eliminar TODOS los registros de Estaciones Manuales? Esta acción no se puede deshacer.",
    );
    if (!confirmed) return;
    const result = await this.apiResponseS.onDelete(
      Endpoints.ManualCallPoints.deleteAllByCustomer(
        this.customerIdS.customerId(),
      ),
    );
    if (result) this.onLoadData();
  }

  onOpenScanner() {
    this.router.navigate(ROUTES.BITACORAS.SCANNER_EQUIPOS);
  }

  async onDownloadQr(item: InventarioEstacionManualDto) {
    await this.qrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.qrS.downloadAllQr(this.dataSignal());
  }

  onViewHistory(item: InventarioEstacionManualDto) {
    this.router.navigate(ROUTES.BITACORAS.ESTACION_MANUAL_BITACORA(item.id));
  }

  onViewPeriodos() {
    this.router.navigate(ROUTES.BITACORAS.PERIODOS_INSPECCION, {
      queryParams: { type: "estacion" },
    });
  }

  downloadTemplate() {
    void this.excelS.exportToExcel(
      [
        {
          ubicacion: "Escalera Piso 2",
          codigo: "EST-01",
          tipo: "Conventional",
        },
      ],
      [
        { header: "Ubicacion *", key: "ubicacion", width: 30 },
        { header: "Codigo (opcional)", key: "codigo", width: 20 },
        {
          header: "Tipo * (Conventional | AnalogAddressable | GlassBreak)",
          key: "tipo",
          width: 50,
        },
      ],
      "Estaciones Manuales",
      "plantilla-estaciones-manuales",
    );
  }

  async onImportExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await this.apiResponseS.onPost<number>(
      Endpoints.ManualCallPoints.importByCustomer(
        this.customerIdS.customerId(),
      ),
      formData,
    );
    if (result !== false) this.onLoadData();
    input.value = "";
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.ManualCallPoints.listByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.ManualCallPoints.delete(id))
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
        InventarioEstacionManualForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton, IonItem, IonLabel } from "@ionic/angular/standalone";
import { ROUTES } from "src/app/routing/route-paths";
import { addIcons } from "ionicons";
import {
  alertCircleOutline,
  downloadOutline,
  listOutline,
  qrCodeOutline,
  timeOutline,
} from "ionicons/icons";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelDownload } from "src/app/core/components/buttons/web-label/button-download";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IInventarioEstacionManual } from "src/app/core/interfaces/inventario-estacion-manual.interface";
import { AccountingCatalogExcelService } from "src/app/core/services/accounting-catalog-excel.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { InventarioEstacionManualForm } from "./inventario-estacion-manual-form";
import { InventarioEstacionManualQrService } from "./inventario-estacion-manual-qr.service";

import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelItem } from "src/app/core/components/buttons/mobile-label/button-item";
import { MobileButtonLabelDownload } from "src/app/core/components/buttons/mobile-label/button-download";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";

import { WebButtonIconItem } from "src/app/core/components/buttons/web-icon/button-item";
import { WebButtonIconDownload } from "src/app/core/components/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-inventario-estacion-manual",
  templateUrl: "./inventario-estacion-manual.html",
  imports: [
    WebButtonIconItem,
    WebButtonIconDownload,
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
    ImageModule,
    TableModule,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelItem,
    WebButtonLabelDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelDownload,
    WebButtonLabelItem,
    IonButton,
    IonItem,
    IonLabel,
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

  dataSignal = signal<IInventarioEstacionManual[]>([]);
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

  onOpenScanner() {
    this.router.navigate(ROUTES.BITACORAS.SCANNER_EQUIPOS);
  }

  async onDownloadQr(item: IInventarioEstacionManual) {
    await this.qrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.qrS.downloadAllQr(this.dataSignal());
  }

  onViewHistory(item: IInventarioEstacionManual) {
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
      `InventarioEstacionManual/import/${this.customerIdS.customerId()}`,
      formData,
    );
    if (result !== false) this.onLoadData();
    input.value = "";
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        "InventarioEstacionManual/list/" + this.customerIdS.customerId(),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`InventarioEstacionManual/${id}`)
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

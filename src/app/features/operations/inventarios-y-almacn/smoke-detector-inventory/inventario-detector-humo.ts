import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton, IonItem, IonLabel } from "@ionic/angular/standalone";
import { ROUTES } from "src/app/routing/route-paths";
import { addIcons } from "ionicons";
import {
  cloudOutline,
  downloadOutline,
  listOutline,
  qrCodeOutline,
  timeOutline,
} from "ionicons/icons";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelDownload } from "@ui/buttons/web-label/button-download";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IInventarioDetectorHumo } from "src/app/core/interfaces/inventario-detector-humo.interface";
import { AccountingCatalogExcelService } from "src/app/core/services/accounting-catalog-excel.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { InventarioDetectorHumoForm } from "./inventario-detector-humo-form";
import { InventarioDetectorHumoQrService } from "./inventario-detector-humo-qr.service";

import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";

import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-inventario-detector-humo",
  templateUrl: "./inventario-detector-humo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class InventarioDetectorHumo {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  excelS = inject(AccountingCatalogExcelService);
  qrS = inject(InventarioDetectorHumoQrService);
  router = inject(Router);

  dataSignal = signal<IInventarioDetectorHumo[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({
      cloudOutline,
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

  async onDownloadQr(item: IInventarioDetectorHumo) {
    await this.qrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.qrS.downloadAllQr(this.dataSignal());
  }

  onViewHistory(item: IInventarioDetectorHumo) {
    this.router.navigate(ROUTES.BITACORAS.DETECTOR_HUMO_BITACORA(item.id));
  }

  onViewPeriodos() {
    this.router.navigate(ROUTES.BITACORAS.PERIODOS_INSPECCION, {
      queryParams: { type: "detector" },
    });
  }

  downloadTemplate() {
    void this.excelS.exportToExcel(
      [
        {
          ubicacion: "Pasillo Piso 3",
          codigo: "DET-01",
          tipo: "Photoelectric",
        },
      ],
      [
        { header: "Ubicacion *", key: "ubicacion", width: 30 },
        { header: "Codigo (opcional)", key: "codigo", width: 20 },
        {
          header:
            "Tipo * (Ionization | Photoelectric | Thermal | DualIonizationPhotoelectric)",
          key: "tipo",
          width: 65,
        },
      ],
      "Detectores de Humo",
      "plantilla-detectores-humo",
    );
  }

  async onImportExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await this.apiResponseS.onPost<number>(
      `InventarioDetectorHumo/import/${this.customerIdS.customerId()}`,
      formData,
    );
    if (result !== false) this.onLoadData();
    input.value = "";
  }

  onLoadData() {
    this.apiResponseS
      .onGetList("InventarioDetectorHumo/list/" + this.customerIdS.customerId())
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`InventarioDetectorHumo/${id}`)
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
        InventarioDetectorHumoForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

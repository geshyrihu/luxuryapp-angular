import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton, IonItem, IonLabel } from "@ionic/angular/standalone";
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
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonDownload } from "src/app/core/components/web/buttons/custom-button-download";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/web/buttons/custom-button-item";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
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

@Component({
  selector: "app-inventario-detector-humo",
  templateUrl: "./inventario-detector-humo.html",
  imports: [
    EmptyState,
    AppIcon,
    ImageModule,
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    CustomButtonDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonDownload,
    CustomButtonItem,
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
    this.router.navigate(["/logbook/fire-equipment-scanner"]);
  }

  async onDownloadQr(item: IInventarioDetectorHumo) {
    await this.qrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.qrS.downloadAllQr(this.dataSignal());
  }

  onViewHistory(item: IInventarioDetectorHumo) {
    this.router.navigate(["/logbook/smoke-detector-log", item.id]);
  }

  onViewPeriodos() {
    this.router.navigate(["/logbook/fire-inspection-periods"], {
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


import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";

import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { InventarioDetectorHumoDto } from "@core/interfaces/inventario-detector-humo.interface";
import { AccountingCatalogExcelService } from "@core/services/accounting-catalog-excel.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { addIcons } from "ionicons";
import {
  cloudOutline,
  downloadOutline,
  listOutline,
  qrCodeOutline,
  timeOutline,
} from "ionicons/icons";
import { ROUTES } from "src/app/routing/route-paths";
import { InventarioDetectorHumoDesktop } from "./desktop/inventario-detector-humo-desktop";
import { InventarioDetectorHumoForm } from "./inventario-detector-humo-form";
import { InventarioDetectorHumoPdfService } from "./inventario-detector-humo-pdf.service";
import { InventarioDetectorHumoQrService } from "./inventario-detector-humo-qr.service";
import { InventarioDetectorHumoMobile } from "./mobile/inventario-detector-humo-mobile";

@Component({
  selector: "app-inventario-detector-humo",
  templateUrl: "./inventario-detector-humo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InventarioDetectorHumoDesktop, InventarioDetectorHumoMobile],
})
export class InventarioDetectorHumo {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  excelS = inject(AccountingCatalogExcelService);
  qrS = inject(InventarioDetectorHumoQrService);
  pdfS = inject(InventarioDetectorHumoPdfService);
  platformS = inject(PlatformService);
  router = inject(Router);

  dataSignal = signal<InventarioDetectorHumoDto[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));

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

  async onDeleteAll() {
    const confirmed = confirm(
      "¿Eliminar TODOS los registros de Detectores de Humo? Esta acción no se puede deshacer.",
    );
    if (!confirmed) return;
    const result = await this.apiResponseS.onDelete(
      Endpoints.SmokeDetectors.deleteAllByCustomer(
        this.customerIdS.customerId(),
      ),
    );
    if (result) this.onLoadData();
  }

  onOpenScanner() {
    this.router.navigate(ROUTES.BITACORAS.SCANNER_EQUIPOS);
  }

  async onDownloadQr(item: InventarioDetectorHumoDto) {
    await this.qrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.qrS.downloadAllQr(this.dataSignal());
  }

  onDownloadPdf() {
    void this.pdfS.downloadPdf(this.dataSignal());
  }

  onViewHistory(item: InventarioDetectorHumoDto) {
    this.router.navigate(ROUTES.BITACORAS.DETECTOR_HUMO_BITACORA(item.id));
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
      Endpoints.SmokeDetectors.importByCustomer(this.customerIdS.customerId()),
      formData,
    );
    if (result !== false) this.onLoadData();
    input.value = "";
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.SmokeDetectors.listByCustomer(this.customerIdS.customerId()),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.SmokeDetectors.delete(id))
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

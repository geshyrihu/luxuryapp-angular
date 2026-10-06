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
import { InventarioHidranteDto } from "@core/interfaces/inventario-hidrante.interface";
import { AccountingCatalogExcelService } from "@core/services/accounting-catalog-excel.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { addIcons } from "ionicons";
import {
  downloadOutline,
  listOutline,
  qrCodeOutline,
  timeOutline,
  waterOutline,
} from "ionicons/icons";
import { ROUTES } from "src/app/routing/route-paths";
import { InventarioHidranteDesktop } from "./desktop/inventario-hidrante-desktop";
import { InventarioHidranteForm } from "./inventario-hidrante-form";
import { InventarioHidranteQrService } from "./inventario-hidrante-qr.service";
import { InventarioHidranteMobile } from "./mobile/inventario-hidrante-mobile";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-inventario-hidrante",
  templateUrl: "./inventario-hidrante.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InventarioHidranteDesktop, InventarioHidranteMobile],
})
export class InventarioHidrante {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  excelS = inject(AccountingCatalogExcelService);
  qrS = inject(InventarioHidranteQrService);
  platformS = inject(PlatformService);
  router = inject(Router);

  dataSignal = signal<InventarioHidranteDto[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));

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

  downloadTemplate() {
    void this.excelS.exportToExcel(
      [
        {
          ubicacion: "Lobby Piso 1",
          codigo: "HID-01",
          tipo: "IndoorCabinet",
          gabinete: "GAB-01-A",
        }],
      [
        { header: "Ubicacion *", key: "ubicacion", width: 30 },
        { header: "Codigo (opcional)", key: "codigo", width: 20 },
        {
          header: "Tipo * (IndoorCabinet | OutdoorHydrant | SiameseConnection)",
          key: "tipo",
          width: 55,
        },
        { header: "Numero Gabinete (opcional)", key: "gabinete", width: 25 }],
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
      Endpoints.Hydrants.importByCustomer(this.customerIdS.customerId()),
      formData,
    );
    if (result !== false) this.onLoadData();
    input.value = "";
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.Hydrants.listByCustomer(this.customerIdS.customerId()),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.Hydrants.delete(id))
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

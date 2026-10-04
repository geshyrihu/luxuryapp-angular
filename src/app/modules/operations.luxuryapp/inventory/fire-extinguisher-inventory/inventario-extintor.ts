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
import { InventarioExtintorDto } from "@core/interfaces/inventario-extintor.interface";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  downloadOutline,
  flameOutline,
  folderOpenOutline,
  listOutline,
  qrCodeOutline,
} from "ionicons/icons";
import { ROUTES } from "src/app/routing/route-paths";
import { InventarioExtintorDesktop } from "./desktop/inventario-extintor-desktop";
import { InventarioExtintorBulkDateForm } from "./inventario-extintor-bulk-date-form";
import { InventarioExtintorForm } from "./inventario-extintor-form";
import { InventarioExtintorPdfService } from "./inventario-extintor-pdf.service";
import { InventarioExtintorQrService } from "./inventario-extintor-qr.service";
import { InventarioExtintorMobile } from "./mobile/inventario-extintor-mobile";

@Component({
  selector: "app-inventario-extintor",
  templateUrl: "./inventario-extintor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InventarioExtintorDesktop, InventarioExtintorMobile],
})
export class InventarioExtintor {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  inventarioExtintorPdfS = inject(InventarioExtintorPdfService);
  inventarioExtintorQrS = inject(InventarioExtintorQrService);
  platformS = inject(PlatformService);
  router = inject(Router);

  dataSignal = signal<InventarioExtintorDto[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));

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

  onViewHistory(item: InventarioExtintorDto) {
    this.router.navigate(ROUTES.BITACORAS.EXTINTOR_BITACORA(item.id));
  }

  onOpenScanner() {
    this.router.navigate(ROUTES.BITACORAS.SCANNER_EQUIPOS);
  }

  onBulkExpiration() {
    this.dialogHandlerS
      .openDialog(
        InventarioExtintorBulkDateForm,
        {},
        "Actualizar fecha de vencimiento",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDownloadQr(item: InventarioExtintorDto) {
    await this.inventarioExtintorQrS.downloadQr(item);
  }

  async onDownloadAllQr() {
    await this.inventarioExtintorQrS.downloadAllQr(this.dataSignal());
  }

  onLoadData() {
    const urlApi = Endpoints.FireExtinguishers.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.FireExtinguishers.delete(id))
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

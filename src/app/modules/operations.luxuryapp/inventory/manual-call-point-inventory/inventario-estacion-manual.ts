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
import { InventarioEstacionManualDto } from "@core/interfaces/inventario-estacion-manual.interface";
import { AccountingCatalogExcelService } from "@core/services/accounting-catalog-excel.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { addIcons } from "ionicons";
import {
  alertCircleOutline,
  downloadOutline,
  listOutline,
  qrCodeOutline,
  timeOutline,
} from "ionicons/icons";
import { ROUTES } from "src/app/routing/route-paths";
import { InventarioEstacionManualDesktop } from "./desktop/inventario-estacion-manual-desktop";
import { InventarioEstacionManualForm } from "./inventario-estacion-manual-form";
import { InventarioEstacionManualPdfService } from "./inventario-estacion-manual-pdf.service";
import { InventarioEstacionManualQrService } from "./inventario-estacion-manual-qr.service";
import { InventarioEstacionManualMobile } from "./mobile/inventario-estacion-manual-mobile";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-inventario-estacion-manual",
  templateUrl: "./inventario-estacion-manual.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InventarioEstacionManualDesktop, InventarioEstacionManualMobile],
})
export class InventarioEstacionManual {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  excelS = inject(AccountingCatalogExcelService);
  qrS = inject(InventarioEstacionManualQrService);
  pdfS = inject(InventarioEstacionManualPdfService);
  platformS = inject(PlatformService);
  router = inject(Router);

  dataSignal = signal<InventarioEstacionManualDto[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));

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

  onDownloadPdf() {
    void this.pdfS.downloadPdf(this.dataSignal());
  }

  onViewHistory(item: InventarioEstacionManualDto) {
    this.router.navigate(ROUTES.BITACORAS.ESTACION_MANUAL_BITACORA(item.id));
  }

  downloadTemplate() {
    void this.excelS.exportToExcel(
      [
        {
          ubicacion: "Escalera Piso 2",
          codigo: "EST-01",
          tipo: "Conventional",
        }],
      [
        { header: "Ubicacion *", key: "ubicacion", width: 30 },
        { header: "Codigo (opcional)", key: "codigo", width: 20 },
        {
          header: "Tipo * (Conventional | AnalogAddressable | GlassBreak)",
          key: "tipo",
          width: 50,
        }],
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

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

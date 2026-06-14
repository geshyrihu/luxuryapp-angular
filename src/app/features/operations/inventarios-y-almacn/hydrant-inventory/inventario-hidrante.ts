import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { waterOutline, listOutline, qrCodeOutline } from "ionicons/icons";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { globalFilterFields, rowsPerPageOptions, tablePrimeNgRows } from "src/app/core/helpers/table-primeng-option";
import { IInventarioHidrante } from "src/app/core/interfaces/inventario-hidrante.interface";
import { AccountingCatalogExcelService } from "src/app/core/services/accounting-catalog-excel.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { InventarioHidranteForm } from "./inventario-hidrante-form";

@Component({
  selector: "app-inventario-hidrante",
  templateUrl: "./inventario-hidrante.html",
  imports: [
    ImageModule, TableModule,
    CustomButtonEdit, CustomButtonDelete, CustomButtonItem, CustomButtonDownload,
    PrimeNgCustomCaption, PrimeNgCustomTableFooter, DataViewMobile, ActionMenu,
    IonButtonEdit, IonButtonDelete, IonButtonItem, IonButton, IonItem, IonLabel, IonIcon,
  ],
})
export class InventarioHidrante {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  excelS = inject(AccountingCatalogExcelService);
  router = inject(Router);

  dataSignal = signal<IInventarioHidrante[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ waterOutline, listOutline, qrCodeOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onOpenScanner() {
    this.router.navigate(["/logbook/fire-equipment-scanner"]);
  }

  onViewHistory(item: IInventarioHidrante) {
    this.router.navigate(["/logbook/hydrant-log", item.id]);
  }

  downloadTemplate() {
    void this.excelS.exportToExcel(
      [{ ubicacion: "Lobby Piso 1", codigo: "HID-01", tipo: "IndoorCabinet", gabinete: "GAB-01-A" }],
      [
        { header: "Ubicacion *", key: "ubicacion", width: 30 },
        { header: "Codigo (opcional)", key: "codigo", width: 20 },
        { header: "Tipo * (IndoorCabinet | OutdoorHydrant | SiameseConnection)", key: "tipo", width: 55 },
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
      .onGetList("InventarioHidrante/list/" + this.customerIdS.customerId())
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`InventarioHidrante/${id}`)
      .then((result: boolean) => {
        if (result) this.dataSignal.update((data) => data.filter((item) => item.id !== id));
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(InventarioHidranteForm, { id: data.id }, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => { if (result) this.onLoadData(); });
  }
}

import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { folderOpenOutline, keyOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonDownload } from "src/app/core/components/web/buttons/custom-button-download";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { IInventarioLlave } from "src/app/core/interfaces/inventario-llave-dto.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { InventarioLlaveForm } from "./inventario-llave-form";
@Component({
  selector: "app-inventario-llaves-list",
  templateUrl: "./inventario-llaves-list.html",
  imports: [
    EmptyState,
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonDownload,
    IonItem,
    IonLabel,
  ],
})
export class InventarioLlavesList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  htmlPrintS = inject(HtmlPrintService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<IInventarioLlave[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  customerId: string;

  constructor() {
    addIcons({ keyOutline, folderOpenOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `InventarioLlave/list/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`InventarioLlave/${id}`)
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
        InventarioLlaveForm,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDownloadPdf(): Promise<void> {
    const data = this.dataSignal();
    if (!data || data.length === 0) return;
    this.loading.set(true);

    try {
      // Sort by Classification
      const sortedData = [...data].sort((a, b) =>
        (a.equipoClasificacion || "").localeCompare(
          b.equipoClasificacion || "",
        ),
      );

      // Group by Classification
      const groups = sortedData.reduce(
        (acc, item) => {
          const classification =
            item.equipoClasificacion || "SIN CLASIFICACIÓN";
          if (!acc[classification]) acc[classification] = [];
          acc[classification].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      let tableHtml = "";

      for (const classification in groups) {
        tableHtml += `
          <tr>
            <td colspan="4" class="sistema-header">${this.htmlPrintS.esc(classification)}</td>
          </tr>
        `;

        groups[classification].forEach((item, idx) => {
          const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";
          tableHtml += `
            <tr>
              <td style="background-color: ${bg}; padding: 4px 8px;">${this.htmlPrintS.esc(item.descripcion || "")}</td>
              <td style="background-color: ${bg}; padding: 4px 8px;">${this.htmlPrintS.esc(item.marca || "")}</td>
              <td style="background-color: ${bg}; text-align: center; padding: 4px 8px;">${this.htmlPrintS.esc(item.numeroLlave?.toString() || "")}</td>
              <td style="background-color: ${bg}; text-align: center; padding: 4px 8px;">${this.htmlPrintS.esc(item.cantidad?.toString() || "")}</td>
            </tr>
          `;
        });
      }

      const logo = await this.htmlPrintS.getLogoDataUrl();
      const generatedAt = new Date();

      const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; }
  th { background-color: #1E3A8A !important; color: #FFFFFF !important; }

  .sistema-header { background-color: #eef2f7 !important; color: #003A62 !important; font-weight: bold; font-size: 14px; padding: 6px 10px !important; }

  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:4px 8px; border:1px solid #D1D5DB; }
  .data-table th { background:#1E3A8A; color: #ffffff; font-weight:700; text-align:center; font-size: 11px; }

</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Inventario de Llaves", "LISTADO DE CONTROL", generatedAt, "MANTENIMIENTO")}

  <div class="body-doc">
    <table class="data-table">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Marca</th>
          <th style="width: 80px;">Número</th>
          <th style="width: 80px;">Cant.</th>
        </tr>
      </thead>
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

      this.htmlPrintS.printHtml(html, "Inventario_Llaves");
    } catch (e) {
      console.error("Error generating PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}


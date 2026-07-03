import { DatePipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { folderOpenOutline, radioOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelDownload } from "src/app/core/components/buttons/web/label/button-download";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { IRadioComunicacion } from "src/app/core/interfaces/radio-comunicacion.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { RadioComunicacionForm } from "./radio-comunicacion-form";
@Component({
  selector: "app-radio-comunicacion-list",
  templateUrl: "./radio-comunicacion-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    ImageModule,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelDownload,
    IonItem,
    IonLabel,
    DatePipe,
  ],
})
export class RadioComunicacionList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  htmlPrintS = inject(HtmlPrintService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<IRadioComunicacion[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ radioOutline, folderOpenOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `RadioComunicacion/List/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`RadioComunicacion/${id}`)
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
        RadioComunicacionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  // Helper to convert Blob to Base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async onDownloadPdf() {
    const data = this.dataSignal();
    if (!data || data.length === 0) return;
    this.loading.set(true);

    try {
      // 1. Prepare data with images
      const dataWithImages = await Promise.all(
        data.map(async (item: any) => {
          let base64Image = null;
          if (item.fotografia) {
            try {
              const blob = await this.apiResponseS.getBlobFileFromFullUrl(
                item.fotografia,
              );
              if (
                blob &&
                (blob.type.includes("jpeg") ||
                  blob.type.includes("png") ||
                  blob.type.includes("jpg"))
              ) {
                const base64 = await this.blobToBase64(blob);
                if (base64.startsWith("data:image")) {
                  base64Image = base64;
                }
              }
            } catch (e) {
              console.error("Error loading image for PDF", item.marca, e);
            }
          }
          return { ...item, base64Image };
        }),
      );

      // Sort by brand
      const sortedData = [...dataWithImages].sort((a, b) =>
        (a.marca || "").localeCompare(b.marca || ""),
      );

      // Group by brand
      const groups = sortedData.reduce(
        (acc, item) => {
          const brand = item.marca || "SIN MARCA";
          if (!acc[brand]) acc[brand] = [];
          acc[brand].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      let tableHtml = "";

      for (const brand in groups) {
        tableHtml += `
          <tr>
            <td colspan="2" class="sistema-header">${this.htmlPrintS.esc(brand)}</td>
          </tr>
        `;

        groups[brand].forEach((item, idx) => {
          const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";

          const imgHtml = item.base64Image
            ? `<img src="${item.base64Image}" style="max-width:60px; max-height:60px; object-fit:contain;" />`
            : `<div style="font-size: 8px; color: #999; margin-top:10px; text-align:center;">Sin Imagen</div>`;

          tableHtml += `
            <tr>
              <td style="background-color: ${bg}; padding: 10px; width: 80px; text-align: center; vertical-align: middle;">
                ${imgHtml}
              </td>
              <td style="background-color: ${bg}; padding: 10px; vertical-align: middle;">
                <div style="margin-bottom: 2px;"><span style="font-weight: bold; font-size: 11px;">Modelo: </span><span style="font-size: 11px;">${this.htmlPrintS.esc(item.modelo || "N/A")}</span></div>
                <div style="margin-bottom: 2px;"><span style="font-weight: bold; font-size: 11px;">Serie: </span><span style="font-size: 11px;">${this.htmlPrintS.esc(item.serie || "N/A")}</span></div>
                <div style="margin-bottom: 2px;"><span style="font-weight: bold; font-size: 11px;">Bateróa: </span><span style="font-size: 11px;">${this.htmlPrintS.esc(item.bateria || "N/A")}</span></div>
                <div style="margin-bottom: 2px;"><span style="font-weight: bold; font-size: 11px;">Responsable: </span><span style="font-size: 11px;">${this.htmlPrintS.esc(item.applicationUser || "N/A")} / ${this.htmlPrintS.esc(item.departament || "N/A")}</span></div>
              </td>
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
  .sistema-header { background-color: #eef2f7 !important; color: #003A62 !important; font-weight: bold; font-size: 14px; padding: 6px 10px !important; }

  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:4px 8px; border-bottom:1px solid #EEEEEE; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Inventario de Radio Comunicación", "LISTADO DE CONTROL", generatedAt, "MANTENIMIENTO")}

  <div class="body-doc">
    <table class="data-table">
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

      this.htmlPrintS.printHtml(html, "Inventario_Radios");
    } catch (e) {
      console.error("Error generating PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}

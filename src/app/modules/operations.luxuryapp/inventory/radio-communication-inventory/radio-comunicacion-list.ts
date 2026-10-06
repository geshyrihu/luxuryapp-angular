import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { RadioComunicacion } from "@core/interfaces/radio-comunicacion.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { HtmlPrintService } from "@core/services/html-print.service";
import { PlatformService } from "@core/services/platform.service";
import { RadioComunicacionListDesktop } from "./desktop/radio-comunicacion-list-desktop";
import { RadioComunicacionListMobile } from "./mobile/radio-comunicacion-list-mobile";
import { RadioComunicacionForm } from "./radio-comunicacion-form";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-radio-comunicacion-list",
  templateUrl: "./radio-comunicacion-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioComunicacionListDesktop, RadioComunicacionListMobile],
})
export class RadioComunicacionList {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  htmlPrintS = inject(HtmlPrintService);
  platformS = inject(PlatformService);

  dataSignal = signal<RadioComunicacion[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = Endpoints.RadioCommunication.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.RadioCommunication.delete(id))
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

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

      const sortedData = [...dataWithImages].sort((a, b) =>
        (a.marca || "").localeCompare(b.marca || ""),
      );

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

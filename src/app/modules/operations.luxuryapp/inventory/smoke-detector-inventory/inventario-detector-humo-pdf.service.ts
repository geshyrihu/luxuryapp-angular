import { Injectable, inject } from "@angular/core";
import { InventarioDetectorHumoDto } from "@core/interfaces/inventario-detector-humo.interface";
import { CustomToastService } from "@core/services/custom-toast.service";
import { HtmlPrintService } from "@core/services/html-print.service";

@Injectable({ providedIn: "root" })
export class InventarioDetectorHumoPdfService {
  private customToastS = inject(CustomToastService);
  private htmlPrintS = inject(HtmlPrintService);

  async downloadPdf(data: InventarioDetectorHumoDto[]) {
    if (!data.length) return;
    this.customToastS.showInfo("Generando PDF", "Espere por favor...");
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const rows = data
      .map(
        (item, index) => `
          <tr>
            <td style="text-align:center;">${index + 1}</td>
            <td>${this.htmlPrintS.esc(item.localCode ?? "")}</td>
            <td>${this.htmlPrintS.esc(item.detectorType)}</td>
            <td>${this.htmlPrintS.esc(item.location)}</td>
          </tr>`,
      )
      .join("");
    const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8">
      ${this.htmlPrintS.getStandardCss()}<style>
      .items-table { width:100%; border-collapse:collapse; font-size:12px; }
      .items-table th { background-color:#f2f2f2; color:#003A62; font-weight:bold; padding:8px; border:1px solid #ccc; text-align:left; }
      .items-table td { padding:8px; border:1px solid #ccc; }
      </style></head><body><div class="container">
      ${this.htmlPrintS.buildStandardHeader(logo, "INVENTARIO DE DETECTORES DE HUMO", "", generatedAt, "INVENTARIO")}
      <div class="body-doc" style="margin-top:20px;"><table class="items-table"><thead><tr>
      <th style="width:40px;text-align:center;">#</th><th style="width:100px;">Código</th><th>Tipo</th><th>Ubicación</th>
      </tr></thead><tbody>${rows}</tbody></table></div>
      ${this.htmlPrintS.buildStandardFooter(generatedAt)}</div></body></html>`;
    this.htmlPrintS.printHtml(html, "Inventario-Detectores-Humo");
  }
}

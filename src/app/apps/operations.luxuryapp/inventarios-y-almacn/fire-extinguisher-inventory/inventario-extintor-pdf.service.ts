import { Injectable, inject } from "@angular/core";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { InventarioExtintorDto } from "src/app/core/interfaces/inventario-extintor.interface";

@Injectable({
  providedIn: "root",
})
export class InventarioExtintorPdfService {
  private customToastS = inject(CustomToastService);
  private htmlPrintS = inject(HtmlPrintService);

  async downloadPdf(data: InventarioExtintorDto[]) {
    this.customToastS.showInfo("Generando PDF", "Espere por favor...");

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    let itemsHtml = "";
    data.forEach((item, i) => {
      itemsHtml += `
        <tr>
          <td style="text-align:center;">${i + 1}</td>
          <td>${this.htmlPrintS.esc(item.localCode ?? "")}</td>
          <td>${this.htmlPrintS.esc(item.extinguisherType)}</td>
          <td>${this.htmlPrintS.esc(item.location)}</td>
          <td>${this.htmlPrintS.esc(item.expirationDate ?? "")}</td>
        </tr>
      `;
    });

    const html = `<!doctype html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      ${this.htmlPrintS.getStandardCss()}
      <style>
        .items-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .items-table th { background-color: #f2f2f2; color: #003A62; font-weight: bold; padding: 8px; border: 1px solid #ccc; text-align: left; }
        .items-table td { padding: 8px; border: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <div class="container">
        ${this.htmlPrintS.buildStandardHeader(logo, "INVENTARIO DE EXTINTORES", "", generatedAt, "INVENTARIO")}
        <div class="body-doc" style="margin-top: 20px;">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align:center;">#</th>
                <th style="width: 80px;">Código</th>
                <th>Extintor</th>
                <th>Ubicación</th>
                <th style="width: 100px;">Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>
        ${this.htmlPrintS.buildStandardFooter(generatedAt)}
      </div>
    </body>
    </html>`;

    this.htmlPrintS.printHtml(html, "Inventario-Extintores");
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";

import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
@Component({
  selector: "app-orden-compra-pdf",
  template: "",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class OrdenCompraPdf implements OnInit {
  apiResponseS = inject(ApiResponseService);
  routeActive = inject(ActivatedRoute);
  htmlPrintS = inject(HtmlPrintService);
  customToastS = inject(CustomToastService);
  router = inject(Router);
  ordenCompraId: string = "";

  ngOnInit(): void {
    this.ordenCompraId = this.routeActive.snapshot.params.id;
    this.onLoadData();
  }

  onLoadData() {
    this.customToastS.showInfo(
      "Generando PDF",
      "Espere un momento por favor...",
    );
    this.apiResponseS
      .onGetItem(Endpoints.PurchaseOrders.pdf(this.ordenCompraId))
      .then((result: any) => {
        if (result) {
          this.generatePdf(result);
        } else {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
          this.router.navigate(ROUTES.COMPRAS.ORDENES_COMPRA);
        }
      });
  }

  private async generatePdf(data: any): Promise<void> {
    const html = await this.buildHtmlContent(data);

    // Print and navigate back
    this.htmlPrintS.printHtml(html, `OC-${data.folio}`);

    // The printHtml method operates with an iframe, the user can save to PDF
    this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(data.id), {
      replaceUrl: true,
    });
  }

  private formatCurrency(value: number): string {
    if (typeof value !== "number") {
      return "$0.00";
    }
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  }

  private formatDateOnly(value: string | Date | null | undefined): string {
    if (!value) return "";
    if (value instanceof Date) {
      return new Intl.DateTimeFormat("es-MX").format(value);
    }

    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    if (!year || !month || !day) {
      return value;
    }

    return new Intl.DateTimeFormat("es-MX").format(
      new Date(year, month - 1, day),
    );
  }

  private async buildHtmlContent(data: any): Promise<string> {
    let subTotal = 0;
    let ivaTotal = 0;
    let retencionIvaTotal = 0;
    let retencionIsrTotal = 0;

    for (const item of data.ordenCompraDetalle) {
      const itemSubTotal =
        item.cantidad * item.precio * (1 - item.descuento / 100);
      subTotal += itemSubTotal;
      ivaTotal += itemSubTotal * (item.ivaAplicado / 100);
      retencionIvaTotal += itemSubTotal * (item.retencionIVAPorcentaje / 100);
      retencionIsrTotal += itemSubTotal * (item.retencionISRPorcentaje / 100);
    }
    const totalFinal =
      subTotal + ivaTotal - retencionIvaTotal - retencionIsrTotal;

    let productRowsHtml = "";
    data.ordenCompraDetalle.forEach((item: any) => {
      const importe = item.cantidad * item.precio * (1 - item.descuento / 100);
      productRowsHtml += `
        <tr>
          <td style="text-align: center;">${item.cantidad}</td>
          <td style="text-align: center;">${this.htmlPrintS.esc(item.unidadMedida)}</td>
          <td>${this.htmlPrintS.esc(item.productName)}</td>
          <td style="text-align: right;">${this.formatCurrency(item.precio)}</td>
          <td style="text-align: right; font-weight: bold;">${this.formatCurrency(importe)}</td>
        </tr>
      `;
    });

    let totalsHtml = `
      <tr>
        <td style="text-align: right; font-size: 11px;">Subtotal</td>
        <td style="text-align: right; font-weight: bold; font-size: 11px; width: 100px;">${this.formatCurrency(subTotal)}</td>
      </tr>
      <tr>
        <td style="text-align: right; font-size: 11px;">IVA (${data.ordenCompraDetalle[0]?.ivaAplicado || 16}%)</td>
        <td style="text-align: right; font-weight: bold; font-size: 11px;">${this.formatCurrency(ivaTotal)}</td>
      </tr>
    `;

    if (retencionIvaTotal > 0) {
      totalsHtml += `
        <tr>
          <td style="text-align: right; font-size: 11px;">Retención IVA</td>
          <td style="text-align: right; font-weight: bold; font-size: 11px; color: #dc2626;">-${this.formatCurrency(retencionIvaTotal)}</td>
        </tr>
      `;
    }
    if (retencionIsrTotal > 0) {
      totalsHtml += `
        <tr>
          <td style="text-align: right; font-size: 11px;">Retención ISR</td>
          <td style="text-align: right; font-weight: bold; font-size: 11px; color: #dc2626;">-${this.formatCurrency(retencionIsrTotal)}</td>
        </tr>
      `;
    }
    totalsHtml += `
      <tr>
        <td style="text-align: right; font-weight: bold; font-size: 13px; padding-top: 5px;">TOTAL</td>
        <td style="text-align: right; font-weight: bold; font-size: 13px; padding-top: 5px;">${this.formatCurrency(totalFinal)}</td>
      </tr>
    `;

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const requestDateStr = this.formatDateOnly(data.fechaSolicitud);

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; margin: auto; }
  .info-boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .info-box { background-color: #f8f9fa; padding: 12px; border-radius: 4px; }
  .box-title { font-size: 11px; font-weight: bold; color: #333; margin-bottom: 5px; }
  .box-text { font-size: 10px; color: #555; margin-bottom: 2px; }
  .product-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
  .product-table th { background-color: #003A62; color: white; padding: 8px 6px; font-weight: bold; text-align: left; }
  .product-table td { padding: 8px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 20px; margin-bottom: 40px; }
  .obs-section { font-size: 10px; }
  .obs-title { font-weight: bold; color: #333; margin-bottom: 4px; margin-top: 10px; }
  .obs-text { color: #555; margin-bottom: 10px; }
  .totals-table { width: 100%; border-collapse: collapse; }
  .totals-table td { padding: 4px 0; }
  .signature-line { border-top: 1px solid #333; width: 200px; margin-top: 50px; padding-top: 5px; text-align: center; font-size: 10px; color: #555; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "ORDEN DE COMPRA", `Folio: ${data.folio}`, generatedAt, data.customer)}

  <div class="body-doc">
    <div style="text-align: right; font-size: 11px; margin-bottom: 15px;">
      <span style="font-weight: bold;">Fecha:</span> ${requestDateStr}
      <br><span style="font-weight: bold;">RFC:</span> ${this.htmlPrintS.esc(data.rfc || "")}
    </div>

    <div class="info-boxes">
      <div class="info-box">
        <div class="box-title">FACTURAR A / ENVIAR A</div>
        <div class="box-text">${this.htmlPrintS.esc(data.customer)}</div>
        <div class="box-text">${this.htmlPrintS.esc(data.customerAdreess || "")}</div>
        <div class="box-text">Tel: ${this.htmlPrintS.esc(data.phone || "")}</div>
      </div>
      <div class="info-box">
        <div class="box-title">PROVEEDOR</div>
        <div class="box-text">${this.htmlPrintS.esc(data.ordenCompraDatosPago?.providerName || "é")}</div>
        <div class="box-text">${this.htmlPrintS.esc(data.ordenCompraDatosPago?.providerAdreess || "é")}</div>
        <div class="box-text">Tel: ${this.htmlPrintS.esc(data.ordenCompraDatosPago?.providerPhoneOne || "")}</div>
      </div>
    </div>

    <table class="product-table">
      <thead>
        <tr>
          <th style="text-align: center; width: 60px;">Cant.</th>
          <th style="text-align: center; width: 80px;">Unidad</th>
          <th>Descripción</th>
          <th style="text-align: right; width: 100px;">P. Unitario</th>
          <th style="text-align: right; width: 100px;">Importe</th>
        </tr>
      </thead>
      <tbody>
        ${productRowsHtml}
      </tbody>
    </table>

    <div class="footer-grid">
      <div class="obs-section">
        <div class="obs-title">Observaciones:</div>
        <div class="obs-text">${this.htmlPrintS.esc(data.observaciones || "Sin observaciones.")}</div>

        <div class="obs-title">Datos Fiscales / Pago:</div>
        <div class="obs-text">
          Uso CFDI: ${this.htmlPrintS.esc(data.ordenCompraDatosPago?.usoCFDI || "é")} |
          Forma: ${this.htmlPrintS.esc(data.ordenCompraDatosPago?.formaDePago || "é")} |
          Método: ${this.htmlPrintS.esc(data.ordenCompraDatosPago?.metodoDePago || "é")}
        </div>

        <div class="signature-line">
          Firma y Nombre de Autorización
        </div>
      </div>

      <div>
        <table class="totals-table">
          <tbody>
            ${totalsHtml}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }
}

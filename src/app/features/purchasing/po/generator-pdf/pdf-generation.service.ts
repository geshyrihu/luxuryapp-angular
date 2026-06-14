import { DatePipe } from "@angular/common";
import { inject, Injectable } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";

@Injectable({
  providedIn: "root",
})
export class PdfGenerationService {
  apiResponseS = inject(ApiResponseService);
  htmlPrintS = inject(HtmlPrintService);
  customToastS = inject(CustomToastService);
  customerIdS = inject(CustomerIdService);
  datePipe = inject(DatePipe);
  // Solicitud de Pago PDF
  public generateSolicitudPagoPdf(ordenCompraId: string): void {
    this.customToastS.showInfo(
      "Generando PDF",
      "Espere un momento por favor...",
    );

    const orderRequest = this.apiResponseS.onGetItem(
      Endpoints.PurchaseOrders.solicitudPago(ordenCompraId),
      false,
    );
    const customerRequest = this.apiResponseS.onGetItem(
      Endpoints.Customers.getByIdLegacy(this.customerIdS.customerId()),
      false,
    );

    Promise.all([orderRequest, customerRequest])
      .then(async ([orderData, customerData]: [any, any]) => {
        if (orderData) {
          const html = await this.buildPaymentRequestHtmlContent(
            orderData,
            customerData,
          );
          this.htmlPrintS.printHtml(
            html,
            `SolicitudPago-${orderData.folio}`,
          );
        } else {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.customToastS.showError(
          "Error",
          "No se pudieron obtener todos los datos necesarios.",
        );
      });
  }

  // Orden de Compra PDF
  public generateOrdenCompraPdf(ordenCompraId: string): void {
    this.customToastS.showInfo(
      "Generando PDF",
      "Espere un momento por favor...",
    );
    this.apiResponseS
      .onGetItem(Endpoints.PurchaseOrders.pdf(ordenCompraId), false)
      .then(async (result: any) => {
        if (result) {
          const html = await this.buildOrdenCompraHtmlContent(result);
          this.htmlPrintS.printHtml(html, `OC-${result.folio}`);
        } else {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
        }
      });
  }

  public generateBulkSolicitudPagoPdf(
    ordenCompraIds: number[],
    periodo: string,
  ): void {
    this.customToastS.showInfo(
      "Generando Solicitudes de Pago en ZIP",
      "Espere un momento por favor...",
    );
    const body = { ordenCompraIds: ordenCompraIds };
    const nameDocument = `${periodo}_SolicitudesDePago.zip`;
    this.apiResponseS.onDownloadFilePost(
      Endpoints.FundingFiles.solicitudesPago,
      body,
      nameDocument,
    );
  }

  // Métodos privados para construir el contenido de cada PDF

  private formatCurrency(value: number): string {
    if (typeof value !== "number") {
      return "0.00";
    }
    return new Intl.NumberFormat("es-MX", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatClabe(clabe: string): string {
    if (!clabe || clabe.length !== 18) {
      return clabe;
    }
    return `${clabe.slice(0, 3)} ${clabe.slice(3, 6)} ${clabe.slice(
      6,
      9,
    )} ${clabe.slice(9, 12)} ${clabe.slice(12, 15)} ${clabe.slice(15, 18)}`;
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

  private getSolicitanteDisplayName(model: any): string {
    return model.solicitanteNombreCompleto || model.fullName || model.solicitante || "N/A";
  }

  private async buildPaymentRequestHtmlContent(
    orderData: any,
    customerData: any,
  ): Promise<string> {
    const model = orderData;
    const datosPago = model.ordenCompraDatosPago;

    const correctTotal =
      model.subtotal + model.iva - model.retencionIva - model.retencionIsr;

    const subtotal = this.formatCurrency(model.subtotal);
    const iva = this.formatCurrency(model.iva);
    const retencionIva = this.formatCurrency(model.retencionIva);
    const retencionIsr = this.formatCurrency(model.retencionIsr);
    const total = this.formatCurrency(correctTotal);

    let budgetRowsHtml = "";
    model.ordenCompraPresupuesto.forEach((item: any) => {
      budgetRowsHtml += `
        <tr>
          <td>${this.htmlPrintS.esc(item.numeroCuenta)} | ${this.htmlPrintS.esc(item.cuenta)}</td>
          <td>${this.htmlPrintS.esc(item.cuenta)}</td>
          <td style="text-align: right;">${this.formatCurrency(item.dineroUsado)}</td>
        </tr>
      `;
    });

    let signaturesHtml = "";
    if (model.firmantes && model.firmantes.length > 0) {
      signaturesHtml += `<div class="signatures-grid">`;
      model.firmantes.forEach((firmante: any) => {
        signaturesHtml += `
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-name">${this.htmlPrintS.esc(firmante.nombre || " ")}</div>
            <div class="signature-role">${this.htmlPrintS.esc(firmante.rol || " ")}</div>
          </div>
        `;
      });
      signaturesHtml += `</div>`;
    }

    let totalsHtml = `
      <tr>
        <td style="text-align: right; font-size: 11px;">SubTotal:</td>
        <td style="text-align: right; font-weight: bold; font-size: 11px; width: 100px;">${subtotal}</td>
      </tr>
      <tr>
        <td style="text-align: right; font-size: 11px;">IVA:</td>
        <td style="text-align: right; font-weight: bold; font-size: 11px;">${iva}</td>
      </tr>
    `;

    if (model.retencionIva > 0) {
      totalsHtml += `
        <tr>
          <td style="text-align: right; font-size: 11px;">Retención IVA:</td>
          <td style="text-align: right; font-weight: bold; font-size: 11px; color: #dc2626;">- ${retencionIva}</td>
        </tr>
      `;
    }
    if (model.retencionIsr > 0) {
      totalsHtml += `
        <tr>
          <td style="text-align: right; font-size: 11px;">Retención ISR:</td>
          <td style="text-align: right; font-weight: bold; font-size: 11px; color: #dc2626;">- ${retencionIsr}</td>
        </tr>
      `;
    }
    totalsHtml += `
      <tr>
        <td style="text-align: right; font-weight: bold; font-size: 13px; padding-top: 5px;">Total a Pagar:</td>
        <td style="text-align: right; font-weight: bold; font-size: 13px; padding-top: 5px;">${total}</td>
      </tr>
    `;

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; margin: auto; }
  
  .bank-card { border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; margin-top: 10px; margin-bottom: 20px; }
  .bank-card-header { background-color: #f2f2f2; padding: 5px 10px; font-weight: bold; font-size: 11px; }
  .bank-card-body { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 10px; }
  
  .label { color: gray; font-size: 10px; }
  .value { font-weight: bold; font-size: 11px; margin-bottom: 5px; }
  .beneficiary { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
  .clabe { font-weight: bold; font-size: 13px; margin-bottom: 5px; }
  .total-amount { font-weight: bold; font-size: 16px; color: #003A62; }
  
  .subheader { font-size: 14px; font-weight: bold; color: #003A62; margin-top: 15px; margin-bottom: 5px; }
  .justificacion { font-size: 10px; margin-bottom: 20px; }
  
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .info-text { font-size: 10px; margin-bottom: 2px; }
  
  .budget-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
  .budget-table th { color: #003A62; font-weight: bold; text-align: left; padding: 5px; border-bottom: 1px solid #ccc; }
  .budget-table td { padding: 5px; border-bottom: 1px solid #eee; }
  
  .totals-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  .totals-table td { padding: 4px 0; }
  
  .signatures-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 40px; margin-top: 40px; justify-items: center; }
  .signature-box { text-align: center; width: 180px; }
  .signature-line { border-top: 1px solid #333; width: 100%; margin-bottom: 5px; }
  .signature-name { font-size: 11px; font-weight: bold; margin-bottom: 2px; }
  .signature-role { font-size: 10px; font-style: italic; color: #555; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "SOLICITUD DE PAGO", `Folio O.C.: ${model.folio}<br>Factura: ${model.ordenCompraStatus?.factura || ""}`, generatedAt, "")}

  <div class="body-doc">
    <div class="bank-card">
      <div class="bank-card-header">DATOS DE PAGO / TRANSFERENCIA</div>
      <div class="bank-card-body">
        <div>
          <div class="label">Beneficiario:</div>
          <div class="beneficiary">${this.htmlPrintS.esc(datosPago.nameCheck)}</div>
          <div class="label" style="margin-top: 10px;">Banco:</div>
          <div class="value">${this.htmlPrintS.esc(datosPago.bank)}</div>
        </div>
        <div style="text-align: right;">
          <div class="label">CLABE Interbancaria:</div>
          <div class="clabe">${this.htmlPrintS.esc(this.formatClabe(datosPago.cuentaClave))}</div>
          <div class="label" style="margin-top: 10px;">Monto a Pagar:</div>
          <div class="total-amount">${total}</div>
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <div class="subheader" style="margin-top: 0;">DATOS DE LA SOLICITUD</div>
        <div class="info-text">Fecha: ${this.formatDateOnly(model.fechaSolicitud)}</div>
        <div class="info-text">Área/Depto: ${this.htmlPrintS.esc(model.equipoOInstalacion || "N/A")}</div>
        <div class="info-text">Solicitante: ${this.htmlPrintS.esc(this.getSolicitanteDisplayName(model))}</div>
      </div>
      <div>
        <div class="subheader" style="margin-top: 0;">DATOS DEL PROVEEDOR</div>
        <div class="info-text">Proveedor: ${this.htmlPrintS.esc(datosPago.providerName || "N/A")}</div>
        <div class="info-text">RFC: ${this.htmlPrintS.esc(datosPago.providerRfc || "N/A")}</div>
        <div class="info-text">Método de Pago: ${this.htmlPrintS.esc(datosPago.metodoDePago || "N/A")}</div>
        <div class="info-text">Forma de Pago: ${this.htmlPrintS.esc(datosPago.formaDePago || "N/A")}</div>
      </div>
    </div>

    <div class="subheader">JUSTIFICACIÓN DEL GASTO</div>
    <div class="justificacion">${this.htmlPrintS.esc(model.justificacionGasto || "N/A")}</div>

    <div class="subheader">DESGLOSE DE PAGO</div>
    <table class="budget-table">
      <thead>
        <tr>
          <th>CUENTA CONTABLE</th>
          <th>CONCEPTO</th>
          <th style="text-align: right;">IMPORTE</th>
        </tr>
      </thead>
      <tbody>
        ${budgetRowsHtml}
      </tbody>
    </table>

    <table class="totals-table">
      <tbody>
        ${totalsHtml}
      </tbody>
    </table>

    <div class="subheader" style="text-align: center;">AUTORIZACIONES</div>
    ${signaturesHtml}
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }

  private async buildOrdenCompraHtmlContent(data: any): Promise<string> {
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
      <br><span style="font-weight: bold;">RFC:</span> ${this.htmlPrintS.esc(data.rfc || '')}
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
        <div class="box-text">${this.htmlPrintS.esc(data.ordenCompraDatosPago?.providerName || "—")}</div>
        <div class="box-text">${this.htmlPrintS.esc(data.ordenCompraDatosPago?.providerAdreess || "—")}</div>
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
          Uso CFDI: ${this.htmlPrintS.esc(data.ordenCompraDatosPago?.usoCFDI || "—")} | 
          Forma: ${this.htmlPrintS.esc(data.ordenCompraDatosPago?.formaDePago || "—")} | 
          Método: ${this.htmlPrintS.esc(data.ordenCompraDatosPago?.metodoDePago || "—")}
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

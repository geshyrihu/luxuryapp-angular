import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { ROUTES } from "src/app/routing/route-paths";

@Component({
  selector: "app-solicitud-pago-pdf",
  template: "",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardModule],
})
export class SolicitudPagoPdfComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  routeActive = inject(ActivatedRoute);
  htmlPrintS = inject(HtmlPrintService);
  customToastS = inject(CustomToastService);
  router = inject(Router);
  customerIdS = inject(CustomerIdService);
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

    const orderRequest = this.apiResponseS.onGetItem(
      Endpoints.PurchaseOrders.solicitudPago(this.ordenCompraId),
    );
    const customerRequest = this.apiResponseS.onGetItem(
      Endpoints.Customers.getByIdLegacy(this.customerIdS.customerId()),
    );

    Promise.all([orderRequest, customerRequest])
      .then(([orderData, customerData]) => {
        if (orderData) {
          this.generatePdf(orderData, customerData);
        } else {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
          this.router.navigate(ROUTES.COMPRAS.ORDENES_COMPRA);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.customToastS.showError(
          "Error",
          "No se pudieron obtener todos los datos necesarios.",
        );
        this.router.navigate(ROUTES.COMPRAS.ORDENES_COMPRA);
      });
  }

  private async generatePdf(orderData: any, customerData: any): Promise<void> {
    const html = await this.buildHtmlContent(orderData, customerData);

    this.htmlPrintS.printHtml(html, `SolicitudPago-${orderData.folio}`);

    this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(orderData.id), {
      replaceUrl: true,
    });
  }

  private formatCurrency(value: number): string {
    if (typeof value !== "number") return "$0.00";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  }

  private formatClabe(clabe: string): string {
    if (!clabe || clabe.length !== 18) {
      return clabe;
    }
    return `${clabe.slice(0, 3)} ${clabe.slice(3, 6)} ${clabe.slice(6, 9)} ${clabe.slice(9, 12)} ${clabe.slice(12, 15)} ${clabe.slice(15, 18)}`;
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
    return (
      model.solicitanteNombreCompleto ||
      model.fullName ||
      model.solicitante ||
      "N/A"
    );
  }

  private async buildHtmlContent(
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
          <div class="clabe">${this.htmlPrintS.esc(this.formatClabe(datosPago.interbankCode))}</div>
          <div class="label" style="margin-top: 10px;">Monto a Pagar:</div>
          <div class="total-amount">${total}</div>
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <div class="subheader" style="margin-top: 0;">DATOS DE LA SOLICITUD</div>
        <div class="info-text">Fecha: ${this.formatDateOnly(model.fechaSolicitud)}</div>
        <div class="info-text">órea/Depto: ${this.htmlPrintS.esc(model.equipoOInstalacion || "N/A")}</div>
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

    <div class="subheader">JUSTIFICACIóN DEL GASTO</div>
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
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-pdf-solicitud-compra",
  changeDetection: ChangeDetectionStrategy.Eager,
  template: "",
})
export class PdfSolicitudCompra implements OnInit {
  apiResponseS = inject(ApiResponseService);
  routeActive = inject(ActivatedRoute);
  htmlPrintS = inject(HtmlPrintService);
  customToastS = inject(CustomToastService);
  router = inject(Router);
  customerIdS = inject(CustomerIdService);

  idSolicitudCompra: number = 0;

  ngOnInit(): void {
    this.idSolicitudCompra = this.routeActive.snapshot.params.id;
    this.onLoadData();
  }

  onLoadData() {
    this.customToastS.showInfo(
      "Generando PDF",
      "Espere un momento por favor...",
    );

    const request = this.apiResponseS.onGetItem(
      Endpoints.PurchaseRequests.getIndividual(this.idSolicitudCompra),
    );
    const customerRequest = this.apiResponseS.onGetItem(
      Endpoints.Customers.getByIdLegacy(this.customerIdS.customerId()),
    );

    Promise.all([request, customerRequest])
      .then(([requestData, customerData]) => {
        if (requestData) {
          this.generatePdf(requestData, customerData);
        } else {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
          // Navigate back or handle error
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

  private async generatePdf(
    requestData: any,
    customerData: any,
  ): Promise<void> {
    const html = await this.buildHtmlContent(requestData, customerData);

    this.htmlPrintS.printHtml(html, `SolicitudCompra-${requestData.folio}`);

    this.router.navigate(ROUTES.COMPRAS.SOLICITUD(requestData.id), {
      replaceUrl: true,
    });
  }

  private async buildHtmlContent(
    data: any,
    customerData: any,
  ): Promise<string> {
    let itemsRowsHtml = "";
    data.solicitudCompraDetalle.forEach((item: any, index: number) => {
      itemsRowsHtml += `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td>${this.htmlPrintS.esc(item.producto)}</td>
          <td style="text-align: center;">${item.cantidad}</td>
          <td style="text-align: center;">${this.htmlPrintS.esc(item.unidadMedida)}</td>
        </tr>
      `;
    });

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const requestDateStr = new Date(data.fechaSolicitud).toLocaleDateString(
      "es-MX",
    );

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; margin: auto; }

  .subheader { font-size: 14px; font-weight: bold; color: #003A62; margin-top: 20px; margin-bottom: 10px; }

  .items-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 40px; }
  .items-table th { background-color: #f2f2f2; color: #003A62; font-weight: bold; padding: 8px; text-align: left; border-bottom: 1px solid #ccc; }
  .items-table td { padding: 8px; border-bottom: 1px solid #eee; }

  .signatures-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-top: 50px; justify-items: center; }
  .signature-box { text-align: center; width: 200px; }
  .signature-line { border-top: 1px solid #333; width: 100%; margin-bottom: 5px; }
  .signature-name { font-size: 11px; font-weight: bold; margin-bottom: 2px; }
  .signature-role { font-size: 10px; font-style: italic; color: #555; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "SOLICITUD DE COTIZACIóN", `Folio: ${data.folio}<br>Fecha: ${requestDateStr}`, generatedAt, "")}

  <div class="body-doc">
    <div class="subheader">DETALLE DE artículos/ SERVICIOS</div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="text-align: center; width: 50px;">#</th>
          <th>DESCRIPCIóN</th>
          <th style="text-align: center; width: 100px;">CANTIDAD</th>
          <th style="text-align: center; width: 100px;">UNIDAD</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRowsHtml}
      </tbody>
    </table>

    <div class="signatures-grid">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-name">${this.htmlPrintS.esc(data.solicita || " ")}</div>
        <div class="signature-role">SOLICITANTE</div>
      </div>
    </div>
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }
}

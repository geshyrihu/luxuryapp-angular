import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { CardModule } from "primeng/card";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";

@Component({
  selector: "app-solicitud-pago-pdf",
  template: "",
  imports: [CardModule],
})
export class SolicitudPagoPdfComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  routeActive = inject(ActivatedRoute);
  pdfGeneratorS = inject(PdfGeneratorService);
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
      `OrdenCompra/SolicitudPago/${this.ordenCompraId}`,
    );
    const customerRequest = this.apiResponseS.onGetItem(
      `Customers/${this.customerIdS.customerId()}`,
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
          this.router.navigate(["/purchases/purchase-orders"]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.customToastS.showError(
          "Error",
          "No se pudieron obtener todos los datos necesarios.",
        );
        this.router.navigate(["/purchases/purchase-orders"]);
      });
  }

  private async generatePdf(orderData: any, customerData: any): Promise<void> {
    const docDefinition = this.buildPaymentRequestPdfContent(
      orderData,
      customerData,
    );

    await this.pdfGeneratorS.generatePdf(
      docDefinition,
      `SolicitudPago-${orderData.folio}`,
    );

    this.router.navigate(["/purchases/orden-compra", orderData.id], {
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

  private getSolicitanteDisplayName(model: any): string {
    console.log(
      "🚀 ~ SolicitudPagoPdfComponent ~ getSolicitanteDisplayName ~ model:",
      model,
    );
    return model.solicitanteNombreCompleto || model.fullName || model.solicitante || "N/A";
  }

  private buildPaymentRequestPdfContent(
    orderData: any,
    customerData: any,
  ): TDocumentDefinitions {
    const model = orderData;
    const datosPago = model.ordenCompraDatosPago;

    const correctTotal =
      model.subtotal + model.iva - model.retencionIva - model.retencionIsr;

    const subtotal = this.formatCurrency(model.subtotal);
    const iva = this.formatCurrency(model.iva);
    const retencionIva = this.formatCurrency(model.retencionIva);
    const retencionIsr = this.formatCurrency(model.retencionIsr);
    const total = this.formatCurrency(correctTotal);

    const budgetTableBody = model.ordenCompraPresupuesto.map((item: any) => {
      return [
        { text: `${item.numeroCuenta} | ${item.cuenta}`, style: "tableCell" },
        { text: item.cuenta, style: "tableCell" },
        {
          text: this.formatCurrency(item.dineroUsado),
          style: "tableCell",
          alignment: "right",
        },
      ];
    });

    // Agrupar firmantes en filas de máximo 3
    const signatureRows: any[] = [];
    if (model.firmantes && model.firmantes.length > 0) {
      for (let i = 0; i < model.firmantes.length; i += 3) {
        const chunk = model.firmantes.slice(i, i + 3);
        const columns = chunk.map((firmante: any) => ({
          stack: [
            {
              canvas: [
                { type: "line", x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 0.5 },
              ],
            },
            { text: firmante.nombre || " ", style: "signatureName" },
            { text: firmante.rol || " ", style: "signatureRole" },
          ],
          width: "*",
        }));

        signatureRows.push({
          columns: columns,
          alignment: "center",
          margin: [0, 40, 0, 0],
        });
      }
    }

    const headerColumns: any[] = [];
    if (customerData.logo) {
      headerColumns.push({ image: customerData.logo, fit: [150, 70] });
    }
    headerColumns.push({
      stack: [
        { text: "SOLICITUD DE PAGO", style: "header" },
        { text: `Folio O.C.: ${model.folio}`, alignment: "right" },
        {
          text: `Factura: ${model.ordenCompraStatus?.factura || ""}`,
          alignment: "right",
        },
      ],
    });

    return {
      content: [
        { columns: headerColumns },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 10,
              x2: 515,
              y2: 10,
              lineWidth: 1,
              lineColor: "#CCCCCC",
            },
          ],
        },
        { text: "", margin: [0, 0, 0, 10] },
        {
          style: "bankCard",
          table: {
            widths: ["*", "auto"],
            body: [
              [
                {
                  text: "DATOS DE PAGO / TRANSFERENCIA",
                  colSpan: 2,
                  style: "cardHeader",
                },
                {},
              ],
              [
                {
                  stack: [
                    { text: "Beneficiario:", style: "label" },
                    { text: datosPago.nameCheck, style: "beneficiaryName" },
                    { text: "Banco:", style: "label", margin: [0, 5, 0, 0] },
                    { text: datosPago.bank, style: "value" },
                  ],
                  margin: [10, 10, 0, 10],
                },
                {
                  stack: [
                    {
                      text: "CLABE Interbancaria:",
                      style: "label",
                      alignment: "right",
                    },
                    {
                      text: this.formatClabe(datosPago.interbankCode),
                      style: "clabeNumber",
                      alignment: "right",
                    },
                    {
                      text: "Monto a Pagar:",
                      style: "label",
                      alignment: "right",
                      margin: [0, 5, 0, 0],
                    },
                    { text: total, style: "totalAmount", alignment: "right" },
                  ],
                  margin: [0, 10, 10, 10],
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },
        { text: "", margin: [0, 0, 0, 5] },
        {
          columns: [
            {
              stack: [
                { text: "DATOS DE LA SOLICITUD", style: "subheader" },
                {
                  text: `Fecha: ${new Date(
                    model.fechaSolicitud,
                  ).toLocaleDateString("es-ES")}`,
                  fontSize: 9,
                },
                {
                  text: `Área/Depto: ${model.equipoOInstalacion || "N/A"}`,
                  fontSize: 9,
                },
                {
                  text: `Solicitante: ${this.getSolicitanteDisplayName(model)}`,
                  fontSize: 9,
                },
              ],
            },
            {
              stack: [
                { text: "DATOS DEL PROVEEDOR", style: "subheader" },
                {
                  text: `Proveedor: ${datosPago.providerName || "N/A"}`,
                  fontSize: 9,
                },
                { text: `RFC: ${datosPago.providerRfc || "N/A"}`, fontSize: 9 },
                {
                  text: `Método de Pago: ${datosPago.metodoDePago || "N/A"}`,
                  fontSize: 9,
                },
                {
                  text: `Forma de Pago: ${datosPago.formaDePago || "N/A"}`,
                  fontSize: 9,
                },
              ],
            },
          ],
        },
        { text: "", margin: [0, 0, 0, 10] },
        {
          stack: [
            { text: "JUSTIFICACIÓN DEL GASTO", style: "subheader" },
            {
              text: model.justificacionGasto || "N/A",
              fontSize: 9,
            },
          ],
        },
        { text: "", margin: [0, 0, 0, 20] },
        { text: "DESGLOSE DE PAGO", style: "subheader" },
        {
          table: {
            widths: ["auto", "*", "auto"],
            body: [
              [
                { text: "CUENTA CONTABLE", style: "tableHeader" },
                { text: "CONCEPTO", style: "tableHeader" },
                { text: "IMPORTE", style: "tableHeader", alignment: "right" },
              ],
              ...budgetTableBody,
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              [
                { text: "SubTotal:", style: "totalLabel" },
                { text: subtotal, style: "totalValue" },
              ],
              [
                { text: "IVA:", style: "totalLabel" },
                { text: iva, style: "totalValue" },
              ],
              ...(model.retencionIva > 0
                ? [
                    [
                      { text: "Retención IVA:", style: "totalLabel" },
                      {
                        text: `- ${retencionIva}`,
                        style: "totalValue",
                        color: "red",
                      },
                    ],
                  ]
                : []),
              ...(model.retencionIsr > 0
                ? [
                    [
                      { text: "Retención ISR:", style: "totalLabel" },
                      {
                        text: `- ${retencionIsr}`,
                        style: "totalValue",
                        color: "red",
                      },
                    ],
                  ]
                : []),
              [
                { text: "Total a Pagar:", style: "totalFinalLabel" },
                { text: total, style: "totalFinalValue" },
              ],
            ],
          },
          layout: {
            defaultBorder: false,
          },
        },
        { text: "", margin: [0, 0, 0, 30] },
        { text: "AUTORIZACIONES", style: "subheader", alignment: "center" },
        ...signatureRows,
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: "right",
          color: "#003A62",
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5],
          color: "#003A62",
        },
        bankCard: { margin: [0, 5, 0, 15] },
        cardHeader: { bold: true, fillColor: "#f2f2f2", margin: [5, 5] },
        label: { color: "gray", fontSize: 9 },
        value: { bold: true },
        beneficiaryName: { bold: true, fontSize: 12 },
        clabeNumber: { bold: true, fontSize: 11 },
        totalAmount: { bold: true, fontSize: 14, color: "#003A62" },
        tableHeader: { bold: true, fontSize: 10, color: "#003A62" },
        tableCell: { fontSize: 9 },
        totalLabel: { fontSize: 10, alignment: "right" },
        totalValue: { fontSize: 10, bold: true, alignment: "right" },
        totalFinalLabel: { fontSize: 11, bold: true, alignment: "right" },
        totalFinalValue: { fontSize: 11, bold: true, alignment: "right" },
        signatureName: { fontSize: 10, bold: true, margin: [0, 5, 0, 0] },
        signatureRole: { fontSize: 9, italics: true, color: "#555555" },
      },
    };
  }
}

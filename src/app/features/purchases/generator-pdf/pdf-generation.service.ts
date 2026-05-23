import { DatePipe } from "@angular/common";
import { inject, Injectable } from "@angular/core";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";

@Injectable({
  providedIn: "root",
})
export class PdfGenerationService {
  apiResponseS = inject(ApiResponseService);
  pdfGeneratorS = inject(PdfGeneratorService);
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
      `OrdenCompra/SolicitudPago/${ordenCompraId}`,
      false,
    );
    const customerRequest = this.apiResponseS.onGetItem(
      `Customers/${this.customerIdS.customerId()}`,
      false,
    );

    Promise.all([orderRequest, customerRequest])
      .then(([orderData, customerData]: [any, any]) => {
        if (orderData) {
          const docDefinition = this.buildPaymentRequestPdfContent(
            orderData,
            customerData,
          );
          this.pdfGeneratorS.generatePdf(
            docDefinition,
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
      .onGetItem(`ordencompra/Pdf/${ordenCompraId}`, false)
      .then((result: any) => {
        if (result) {
          const docDefinition = this.buildOrdenCompraPdfContent(result);
          this.pdfGeneratorS.generatePdf(docDefinition, `OC-${result.folio}`, {
            clientName: result.customer,
          });
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
      `FundingFile/solicitudes-pago`,
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

  private getSolicitanteDisplayName(model: any): string {
    return model.solicitanteNombreCompleto || model.fullName || model.solicitante || "N/A";
  }

  private buildPaymentRequestPdfContent(
    orderData: any,
    customerData: any,
  ): TDocumentDefinitions {
    const model = orderData;
    console.log(
      "🚀 ~ PdfGenerationService ~ buildPaymentRequestPdfContent ~ model:",
      model,
    );
    const datosPago = model.ordenCompraDatosPago;
    console.log(
      "🚀 ~ PdfGenerationService ~ buildPaymentRequestPdfContent ~ datosPago:",
      datosPago,
    );

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
        { text: "", margin: [0, 0, 0, 2] },
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
                },
                {
                  stack: [
                    {
                      text: "CLABE Interbancaria:",
                      style: "label",
                      alignment: "right",
                    },
                    {
                      text: this.formatClabe(datosPago.cuentaClave),
                      style: "clabeNumber",
                      alignment: "right",
                    },
                    {
                      text: "Referencia:",
                      style: "label",
                      alignment: "right",
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: datosPago.reference || "",
                      style: "value",
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
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          stack: [
            { text: "JUSTIFICACIÓN DEL GASTO", style: "subheader" },
            {
              text: model.justificacionGasto || "N/A",
              fontSize: 9,
            },
          ],
        },
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
        { text: "", margin: [0, 0, 0, 5] },
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

  private buildOrdenCompraPdfContent(data: any): TDocumentDefinitions {
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

    const productTableBody: any[] = [
      [
        { text: "Cant.", style: "tableHeader", alignment: "center" },
        { text: "Unidad", style: "tableHeader", alignment: "center" },
        { text: "Descripción", style: "tableHeader" },
        { text: "P. Unitario", style: "tableHeader", alignment: "right" },
        { text: "Importe", style: "tableHeader", alignment: "right" },
      ],
    ];
    data.ordenCompraDetalle.forEach((item: any) => {
      const importe = item.cantidad * item.precio * (1 - item.descuento / 100);
      productTableBody.push([
        {
          text: item.cantidad.toString(),
          style: "tableBody",
          alignment: "center",
        },
        { text: item.unidadMedida, style: "tableBody", alignment: "center" },
        { text: item.productName, style: "tableBody" },
        {
          text: this.formatCurrency(item.precio),
          style: "tableBody",
          alignment: "right",
        },
        {
          text: this.formatCurrency(importe),
          style: "tableBodyBold",
          alignment: "right",
        },
      ]);
    });
    const totalsBody: any[] = [
      [
        { text: "Subtotal", style: "totalLabel" },
        { text: this.formatCurrency(subTotal), style: "totalValue" },
      ],
      [
        {
          text: `IVA (${data.ordenCompraDetalle[0]?.ivaAplicado || 16}%)`,
          style: "totalLabel",
        },
        { text: this.formatCurrency(ivaTotal), style: "totalValue" },
      ],
    ];
    if (retencionIvaTotal > 0) {
      totalsBody.push([
        { text: "Retención IVA", style: "totalLabel" },
        {
          text: this.formatCurrency(retencionIvaTotal * -1),
          style: "totalValue",
          color: "red",
        },
      ]);
    }
    if (retencionIsrTotal > 0) {
      totalsBody.push([
        { text: "Retención ISR", style: "totalLabel" },
        {
          text: this.formatCurrency(retencionIsrTotal * -1),
          style: "totalValue",
          color: "red",
        },
      ]);
    }
    totalsBody.push([
      { text: "TOTAL", style: "totalFinalLabel" },
      { text: this.formatCurrency(totalFinal), style: "totalFinalValue" },
    ]);

    return {
      content: [
        {
          columns: [
            {
              stack: [
                { text: data.customer, bold: true, fontSize: 14 },
                { text: `RFC: ${data.rfc}` || "", fontSize: 9 },
              ],
            },
            {
              stack: [
                {
                  text: "ORDEN DE COMPRA",
                  bold: true,
                  fontSize: 22,
                  alignment: "right",
                  color: "#444444",
                },
                { text: `Folio: ${data.folio}`, alignment: "right" },
                {
                  text: `Fecha: ${new Date(
                    data.fechaSolicitud,
                  ).toLocaleDateString("es-ES")}`,
                  alignment: "right",
                },
              ],
            },
          ],
        },
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
        { text: "\n" },
        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                {
                  stack: [
                    { text: "FACTURAR A / ENVIAR A", style: "labelBold" },
                    { text: data.customer, style: "smallText" },
                    { text: data.customerAdreess || "", style: "smallText" },
                    { text: `Tel: ${data.phone}` || "", style: "smallText" },
                  ],
                  fillColor: "#F8F9FA",
                  border: [false, false, false, false],
                  margin: [10, 5, 10, 5],
                },
                {
                  stack: [
                    { text: "PROVEEDOR", style: "labelBold" },
                    {
                      text: data.ordenCompraDatosPago?.providerName || "—",
                      style: "smallText",
                    },
                    {
                      text: data.ordenCompraDatosPago?.providerAdreess || "—",
                      style: "smallText",
                    },
                    {
                      text: `Tel: ${
                        data.ordenCompraDatosPago?.providerPhoneOne || ""
                      }`,
                      style: "smallText",
                    },
                  ],
                  fillColor: "#F8F9FA",
                  border: [false, false, false, false],
                  margin: [10, 5, 10, 5],
                },
              ],
            ],
          },
          layout: "noBorders",
        },
        { text: "\n" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "*", "auto", "auto"],
            body: productTableBody,
          },
          layout: {
            hLineWidth: (i, node) =>
              i === 0 || i === 1 || i === node.table.body.length ? 1 : 0,
            vLineWidth: () => 0,
            fillColor: (rowIndex) => (rowIndex === 0 ? "#003A62" : null),
          },
        },
        { text: "\n\n" },
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "Observaciones:", style: "labelBold" },
                {
                  text: data.observaciones || "Sin observaciones.",
                  style: "smallText",
                  margin: [0, 0, 0, 10],
                },
                {
                  text: "Datos Fiscales / Pago:",
                  style: "labelBold",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: `Uso CFDI: ${
                    data.ordenCompraDatosPago?.usoCFDI || "—"
                  } | Forma: ${
                    data.ordenCompraDatosPago?.formaDePago || "—"
                  } | Método: ${
                    data.ordenCompraDatosPago?.metodoDePago || "—"
                  }`,
                  style: "smallText",
                  color: "#555",
                },
                { text: "\n\n\n\n\n\n" },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 200,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                },
                {
                  text: "Firma y Nombre de Autorización",
                  style: "smallText",
                  margin: [0, 2, 0, 0],
                },
              ],
            },
            {
              width: "auto",
              table: {
                widths: ["auto", 80],
                body: totalsBody,
              },
              layout: "noBorders",
            },
          ],
        },
      ],
      styles: {
        labelBold: { bold: true, fontSize: 10, color: "#333333" },
        smallText: { fontSize: 9, color: "#555555" },
        tableHeader: { bold: true, fontSize: 10, color: "white" },
        tableBody: { fontSize: 9 },
        tableBodyBold: { fontSize: 9, bold: true },
        totalLabel: {
          bold: false,
          fontSize: 10,
          alignment: "right",
          margin: [0, 2, 5, 2],
        },
        totalValue: {
          bold: true,
          fontSize: 10,
          alignment: "right",
          margin: [0, 2, 0, 2],
        },
        totalFinalLabel: {
          bold: true,
          fontSize: 12,
          alignment: "right",
          margin: [0, 5, 5, 5],
        },
        totalFinalValue: {
          bold: true,
          fontSize: 12,
          alignment: "right",
          margin: [0, 5, 0, 5],
        },
      },
    };
  }
}

import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { CardModule } from "primeng/card";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
@Component({
  selector: "app-orden-compra-pdf",
  template: "",
  imports: [CardModule],
})
export class OrdenCompraPdf implements OnInit {
  apiResponseS = inject(ApiResponseService);
  routeActive = inject(ActivatedRoute);
  pdfGeneratorS = inject(PdfGeneratorService);
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
      .onGetItem(`ordencompra/Pdf/${this.ordenCompraId}`)
      .then((result: any) => {
        if (result) {
          this.generatePdf(result);
        } else {
          this.customToastS.showError(
            "Error",
            "No se encontraron datos para generar el PDF.",
          );
          this.router.navigate(["/purchases/purchase-orders"]);
        }
      });
  }

  private async generatePdf(data: any): Promise<void> {
    // We can use the service's internal image loading by passing the logo path
    // The service will handle loading and caching it.
    const docDefinition = this.buildPdfContent(data);
    await this.pdfGeneratorS.generatePdf(
      docDefinition,
      `OC-${data.folio}`,
      { clientName: data.customer }, // Pass customer name for the header
    );
    this.router.navigate(["/purchases/orden-compra", data.id], {
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

  private buildPdfContent(data: any): TDocumentDefinitions {
    // -- Calculos --
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

    // -- Definición de la tabla de productos --
    const productTableBody: any[] = [
      // Encabezado
      [
        { text: "Cant.", style: "tableHeader", alignment: "center" },
        { text: "Unidad", style: "tableHeader", alignment: "center" },
        { text: "Descripción", style: "tableHeader" },
        { text: "P. Unitario", style: "tableHeader", alignment: "right" },
        { text: "Importe", style: "tableHeader", alignment: "right" },
      ],
    ];
    // Filas de productos
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
    // -- Definición de la tabla de totales --
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
    // Renderizado Condicional de Retenciones
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

    // -- Documento Final --
    return {
      content: [
        // PASO 1: Encabezado a 2 Columnas
        {
          columns: [
            // Columna Izquierda: Logo (manejado por el servicio) y nombre
            {
              stack: [
                { text: data.customer, bold: true, fontSize: 14 },
                { text: `RFC: ${data.rfc}` || "", fontSize: 9 },
              ],
            },
            // Columna Derecha: Título y Folio
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
                  text: `Fecha: ${new Date(data.fechaSolicitud).toLocaleDateString("es-ES")}`,
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

        // PASO 2: Bloque "Emisor vs Proveedor"
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
                      text: `Tel: ${data.ordenCompraDatosPago?.providerPhoneOne || ""}`,
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

        // PASO 3: Tabla Profesional de Productos
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

        // PASO 4: Pie de Página Estructurado
        {
          columns: [
            // Columna Izquierda: Observaciones y Firma
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
                  text: `Uso CFDI: ${data.ordenCompraDatosPago?.usoCFDI || "—"} | Forma: ${data.ordenCompraDatosPago?.formaDePago || "—"} | Método: ${data.ordenCompraDatosPago?.metodoDePago || "—"}`,
                  style: "smallText",
                  color: "#555",
                },
                { text: "\n\n\n\n\n\n" }, // Espacio para la firma
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
            // Columna Derecha: Totales
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
      // -- Estilos Generales --
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

import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { SolicitudCompraPdfService } from "./solicitud-compra-pdf.service";
@Component({
  selector: "app-pdf-solicitud-compra",
  template: "",
})
export class PdfSolicitudCompra implements OnInit {
  apiResponseS = inject(ApiResponseService);
  routeActive = inject(ActivatedRoute);
  pdfGeneratorS = inject(PdfGeneratorService);
  customToastS = inject(CustomToastService);
  router = inject(Router);
  customerIdS = inject(CustomerIdService);
  solicitudCompraPdfS = inject(SolicitudCompraPdfService);

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
      `SolicitudCompra/GetSolicitudCompraIndividual/${this.idSolicitudCompra}`,
    );
    const customerRequest = this.apiResponseS.onGetItem(
      `Customers/${this.customerIdS.customerId()}`,
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
    const docDefinition = this.buildPdfContent(requestData, customerData);

    await this.pdfGeneratorS.generatePdf(
      docDefinition,
      `SolicitudCompra-${requestData.folio}`,
    );

    this.router.navigate(["/purchases/solicitud-compra", requestData.id], {
      replaceUrl: true,
    });
  }

  private buildPdfContent(data: any, customerData: any): TDocumentDefinitions {
    const itemsTableBody = data.solicitudCompraDetalle.map(
      (item: any, index: number) => {
        return [
          {
            text: (index + 1).toString(),
            style: "tableCell",
            alignment: "center",
          },
          { text: item.producto, style: "tableCell" },
          {
            text: item.cantidad.toString(),
            style: "tableCell",
            alignment: "center",
          },
          { text: item.unidadMedida, style: "tableCell", alignment: "center" },
        ];
      },
    );

    const headerColumns: any[] = [];
    if (customerData.logo) {
      headerColumns.push({ image: customerData.logo, width: 100 });
    }
    headerColumns.push({
      stack: [
        { text: "SOLICITUD DE COTIZACIÓN", style: "header" },
        { text: `Folio: ${data.folio}`, alignment: "right" },
        {
          text: `Fecha: ${new Date(data.fechaSolicitud).toLocaleDateString("es-MX")}`,
          alignment: "right",
        },
      ],
    });

    return {
      content: [
        {
          columns: headerColumns,
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
        { text: "", margin: [0, 0, 0, 10] },

        // Items Table
        { text: "DETALLE DE ARTÍCULOS / SERVICIOS", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto"],
            body: [
              [
                { text: "#", style: "tableHeader", alignment: "center" },
                { text: "DESCRIPCIÓN", style: "tableHeader" },
                { text: "CANTIDAD", style: "tableHeader", alignment: "center" },
                { text: "UNIDAD", style: "tableHeader", alignment: "center" },
              ],
              ...itemsTableBody,
            ],
          },
          layout: "lightHorizontalLines",
        },

        // Signatures
        { text: "", margin: [0, 0, 0, 40] },
        {
          columns: [
            {
              stack: [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 200,
                      y2: 0,
                      lineWidth: 0.5,
                    },
                  ],
                },
                { text: data.solicita, style: "signatureName" },
                { text: "SOLICITANTE", style: "signatureRole" },
              ],
              alignment: "center",
            },
            /* Optional: Add authorization signature if available
              {
                stack: [
                  {
                     canvas: [{ type: "line", x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5 }]
                  },
                  { text: "AUTORIZACIÓN", style: "signatureRole", margin: [0, 5, 0, 0] }
                ],
                alignment: "center"
              }
              */
          ],
        },
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
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "#003A62",
          fillColor: "#f2f2f2",
          margin: [0, 5],
        },
        tableCell: {
          fontSize: 10,
          margin: [0, 5],
        },
        signatureName: {
          fontSize: 10,
          bold: true,
          margin: [0, 5, 0, 0],
        },
        signatureRole: {
          fontSize: 9,
          italics: true,
          color: "#555555",
        },
      },
    };
  }
}










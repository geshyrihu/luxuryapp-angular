import { inject, Injectable } from "@angular/core";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
@Injectable({
  providedIn: "root",
})
export class SolicitudCompraPdfService {
  pdfGeneratorS = inject(PdfGeneratorService);

  getDocDefinition(model: any, customerData: any): TDocumentDefinitions {
    // Reusing the logic from pdf-solicitud-compra.ts
    const itemsTableBody = model.solicitudCompraDetalle.map(
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
      headerColumns.push({ image: customerData.logo, fit: [150, 70] });
    }
    headerColumns.push({
      stack: [
        { text: "SOLICITUD DE COTIZACIÓN", style: "header" },
        { text: `Folio: ${model.folio}`, alignment: "right" },
        {
          text: `Fecha: ${new Date(model.fechaSolicitud).toLocaleDateString("es-MX")}`,
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

        // Info Section Removed per user request

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
                { text: model.solicita, style: "signatureName" },
                { text: "SOLICITANTE", style: "signatureRole" },
              ],
              alignment: "center",
            },
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

  async generatePdfBlob(model: any, customerData: any): Promise<Blob> {
    const docDefinition = this.getDocDefinition(model, customerData);
    // Reuse PdfGeneratorService logic to handle fonts and logos
    return this.pdfGeneratorS.getPdfBlob(docDefinition, {
      clientName: "", // Optional
      logoPath: customerData.logo, // Ensure logo path is passed if needed override, or rely on service defaults
    });
  }
}










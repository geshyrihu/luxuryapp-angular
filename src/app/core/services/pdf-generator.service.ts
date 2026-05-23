import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import { firstValueFrom } from "rxjs";
import { CustomToastService } from "./custom-toast.service";
import { CustomerIdService } from "./customer-id.service";
export interface PdfHeaderOptions {
  clientName: string;
  companyName?: string;
  logoPath?: string;
}

@Injectable({
  providedIn: "root",
})
export class PdfGeneratorService {
  private http = inject(HttpClient);
  private customToastS = inject(CustomToastService);
  private customerIdS = inject(CustomerIdService);

  private loadedImages: { [key: string]: string } = {};

  private defaultStyles: StyleDictionary = {
    header: {
      fontSize: 22,
      bold: true,
      alignment: "center",
      margin: [0, 0, 0, 20],
    },
    subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
    sectionHeader: {
      fontSize: 18,
      bold: true,
      fillColor: "#EEEEEE",
      margin: [0, 0, 0, 10],
    },
    infoTitle: { bold: true, color: "#6c757d" },
    infoText: { fontSize: 12 },
    infoSubText: { fontSize: 11, color: "#6c757d" },
    boldText: { bold: true },
    scoreTag: {
      fontSize: 24,
      bold: true,
      color: "#FFFFFF",
      alignment: "center",
      margin: [10, 5, 10, 5],
    },
    scoreAverage: { fontSize: 12, color: "#6c757d", margin: [0, 0, 0, 15] },
    finalComment: { margin: [0, 0, 0, 5], fontSize: 10 },
    categoryTitle: { fontSize: 14, bold: true, margin: [0, 5, 0, 0] },
    categoryScore: { bold: true, color: "#333333" },
    questionCard: { margin: [10, 0, 10, 10] },
    questionText: { bold: false, margin: [0, 0, 0, 5] },
    answerScore: {
      fillColor: "#E7F5E8",
      color: "#28a745",
      bold: true,
      margin: [5, 2, 5, 2],
    },
    answerComment: { fontSize: 10, color: "#555555" },
    headerCompany: {
      fontSize: 14,
      bold: true,
      color: "#444444",
      alignment: "right",
    },
    headerClient: { fontSize: 12, color: "#444444", alignment: "right" },
    tableHeader: { bold: true, fontSize: 13, color: "black" },
  };

  constructor() {
    // ✅ Configurar VFS con las fuentes incluidas en pdfMake
    const pdfMakeInstance = pdfMake as any;
    if (pdfMakeInstance.vfs === undefined) {
      const globalFonts = pdfFonts as any;
      pdfMakeInstance.vfs = globalFonts.pdfMake?.vfs || globalFonts;
    }
    console.log("✅ pdfMake initialized with default fonts");
  }

  private async loadImage(name: string, path: string): Promise<void> {
    if (this.loadedImages[name]) return;
    try {
      const blob = await firstValueFrom(
        this.http.get(path, { responseType: "blob" }),
      );
      this.loadedImages[name] = await this.blobToBase64(blob, true);
      console.log(`✅ Image loaded: ${name}`);
    } catch (error) {
      console.error(`❌ Error loading image ${path}:`, error);
    }
  }

  private blobToBase64(
    blob: Blob,
    includePrefix: boolean = false,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Could not get canvas context");
        // Fondo blanco para evitar fondos negros o problemas en pdfmake con imágenes transparentes/webp
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(includePrefix ? dataUrl : dataUrl.split(",")[1]);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        // Fallback a FileReader normal si algo falla al cargar en la etiqueta Image
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(includePrefix ? result : result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      };
      img.src = url;
    });
  }

  public async generatePdf(
    docDefinition: TDocumentDefinitions,
    fileName: string,
    headerOptions?: PdfHeaderOptions,
  ): Promise<void> {
    const finalHeaderOptions: PdfHeaderOptions = {
      companyName: this.customerIdS.customerName(),
      logoPath: this.customerIdS.customerPhotoPath(),
      ...headerOptions,
    };

    // Cargar solo el logo si existe
    if (finalHeaderOptions.logoPath) {
      await this.loadImage("logo", finalHeaderOptions.logoPath);
    }

    const logoContent: Content = this.loadedImages["logo"]
      ? { image: this.loadedImages["logo"], width: 60, fit: [60, 60] }
      : { text: "" };

    const simplifiedLogo: Content = this.loadedImages["logo"]
      ? { image: this.loadedImages["logo"], width: 40, fit: [40, 40] }
      : { text: "" };

    const finalDocDefinition: TDocumentDefinitions = {
      ...docDefinition,
      header: (currentPage: number): Content => {
        if (currentPage === 1) {
          return {
            columns: [
              logoContent,
              {
                stack: [
                  {
                    text: finalHeaderOptions.companyName!,
                    style: "headerCompany",
                  },
                  {
                    text: finalHeaderOptions.clientName,
                    style: "headerClient",
                    margin: [0, 5, 0, 0],
                  },
                ],
              },
            ],
            margin: [40, 20, 40, 0],
          };
        }
        return {
          columns: [
            simplifiedLogo,
            {
              text: "Reporte Confidencial de Evaluación",
              alignment: "right",
              color: "#666666",
              fontSize: 10,
              margin: [0, 15, 0, 0],
            },
          ],
          margin: [40, 10, 40, 0],
        };
      },
      defaultStyle: {
        font: "Roboto", // ✅ Roboto viene incluido en pdfMake
        fontSize: 11,
        ...docDefinition.defaultStyle,
      },
      styles: { ...this.defaultStyles, ...docDefinition.styles },
      pageMargins: [40, 80, 40, 40],
    };

    console.log("📄 Generating PDF:", fileName);

    const pdfMakeInstance = (pdfMake as any).default || pdfMake;
    pdfMakeInstance.createPdf(finalDocDefinition).download(`${fileName}.pdf`);
  }

  public async getPdfBlob(
    docDefinition: TDocumentDefinitions,
    headerOptions?: PdfHeaderOptions,
  ): Promise<Blob> {
    const finalHeaderOptions: PdfHeaderOptions = {
      companyName: this.customerIdS.customerName(),
      logoPath: this.customerIdS.customerPhotoPath(),
      ...headerOptions,
    };

    if (finalHeaderOptions.logoPath) {
      await this.loadImage("logo", finalHeaderOptions.logoPath);
    }

    const logoContent: Content = this.loadedImages["logo"]
      ? { image: this.loadedImages["logo"], width: 60, fit: [60, 60] }
      : { text: "" };

    const simplifiedLogo: Content = this.loadedImages["logo"]
      ? { image: this.loadedImages["logo"], width: 40, fit: [40, 40] }
      : { text: "" };

    const finalDocDefinition: TDocumentDefinitions = {
      ...docDefinition,
      header: (currentPage: number): Content => {
        if (currentPage === 1) {
          return {
            columns: [
              logoContent,
              {
                stack: [
                  {
                    text: finalHeaderOptions.companyName!,
                    style: "headerCompany",
                  },
                  {
                    text: finalHeaderOptions.clientName,
                    style: "headerClient",
                    margin: [0, 5, 0, 0],
                  },
                ],
              },
            ],
            margin: [40, 20, 40, 0],
          };
        }
        return {
          columns: [
            simplifiedLogo,
            {
              text: "Reporte Confidencial de Evaluación",
              alignment: "right",
              color: "#666666",
              fontSize: 10,
              margin: [0, 15, 0, 0],
            },
          ],
          margin: [40, 10, 40, 0],
        };
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 11,
        ...docDefinition.defaultStyle,
      },
      styles: { ...this.defaultStyles, ...docDefinition.styles },
      pageMargins: [40, 80, 40, 40],
      content: docDefinition.content,
    };

    const pdfMakeInstance = (pdfMake as any).default || pdfMake;

    return new Promise((resolve) => {
      pdfMakeInstance.createPdf(finalDocDefinition).getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
  }

  public createTable(widths: any[], header: string[], body: any[][]): any {
    return {
      table: {
        widths: widths,
        body: [header.map((h) => ({ text: h, style: "tableHeader" })), ...body],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex === 0 ? "#CCCCCC" : null;
        },
      },
    };
  }

  public createTag(text: string, style: string, fillColor?: string): any {
    const styleDefinition = this.defaultStyles[style] || {};
    return {
      table: {
        body: [
          [
            {
              text: text,
              style: style,
              border: [false, false, false, false],
            },
          ],
        ],
      },
      layout: {
        fillColor: fillColor || styleDefinition.fillColor || "#FFFFFF",
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 4,
        paddingBottom: () => 4,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
    };
  }
}










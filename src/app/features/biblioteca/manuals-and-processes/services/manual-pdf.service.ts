import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import {
  IManualTemplateDTO,
  IManualTemplateItemDTO,
} from "../models/manuals-and-processes.dto";
import {
  DOC_TYPE_COLORS,
  EAlertType,
  ESectionType,
  SECTION_TYPE_LABELS,
} from "../models/section-content.models";

@Injectable({
  providedIn: "root",
})
export class ManualPdfService {
  private datePipe = new DatePipe("es-MX");

  constructor() {
    // Inicializar fuentes de pdfMake independientemente del PdfGeneratorService
    const pdfMakeInstance = pdfMake as any;
    if (!pdfMakeInstance.vfs) {
      const globalFonts = pdfFonts as any;
      pdfMakeInstance.vfs = globalFonts.pdfMake?.vfs || globalFonts;
    }
  }

  /**
   * Genera el Blob del PDF directamente con pdfMake.
   * No usa PdfGeneratorService para evitar la carga del logo del customer (404).
   */
  public getPdfBlob(
    template: IManualTemplateDTO,
    sections: IManualTemplateItemDTO[],
  ): Promise<Blob> {
    const docColor = DOC_TYPE_COLORS[template.documentType] || "#1B3A6B";
    const docDefinition = this.buildDocumentDefinition(
      template,
      sections,
      docColor,
    );
    const pdfMakeInstance = (pdfMake as any).default || pdfMake;
    return new Promise((resolve) => {
      pdfMakeInstance
        .createPdf(docDefinition)
        .getBlob((blob: Blob) => resolve(blob));
    });
  }

  /**
   * Descarga el PDF directamente con pdfMake.
   * No usa PdfGeneratorService para evitar la carga del logo del customer (404).
   */
  public generateAndDownload(
    template: IManualTemplateDTO,
    sections: IManualTemplateItemDTO[],
  ): Promise<void> {
    const docColor = DOC_TYPE_COLORS[template.documentType] || "#0B3164";
    const docDefinition = this.buildDocumentDefinition(
      template,
      sections,
      docColor,
    );
    const dateStr = this.datePipe.transform(new Date(), "yyyy-MM") || "";
    const fileName = `${template.folio}_v${template.currentVersion}_${dateStr}_VIGENTE`;
    const pdfMakeInstance = (pdfMake as any).default || pdfMake;
    return new Promise((resolve) => {
      pdfMakeInstance
        .createPdf(docDefinition)
        .download(`${fileName}.pdf`, () => resolve());
    });
  }

  private buildDocumentDefinition(
    template: IManualTemplateDTO,
    sections: IManualTemplateItemDTO[],
    docColor: string,
  ): TDocumentDefinitions {
    const content: Content[] = [];

    // Portada
    content.push(this.buildCover(template, docColor));

    // Salto de página después de la portada
    content.push({ text: "", pageBreak: "after" });

    // Secciones
    sections.forEach((section) => {
      content.push(
        this.buildSectionHeader(
          section.title || SECTION_TYPE_LABELS[section.sectionType],
          docColor,
        ),
      );
      content.push(this.buildSectionContent(section, docColor));
      content.push({ text: "", margin: [0, 20] });
    });

    return {
      content: content,
      styles: this.getStyles(docColor),
      defaultStyle: {
        fontSize: 11,
      },
    };
  }

  private buildCover(template: IManualTemplateDTO, docColor: string): Content {
    return {
      stack: [
        {
          canvas: [
            {
              type: "rect",
              x: -40,
              y: -80,
              w: 595,
              h: 15,
              color: "#0B3164", // Franja superior Azul Luxury
            },
          ],
        },
        {
          text: "LUXURYAPP",
          fontSize: 8,
          characterSpacing: 2,
          margin: [0, 40, 0, 5],
          color: "#6B7280",
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 100,
              y2: 0,
              lineWidth: 3,
              lineColor: "#C9A84C", // Acento Dorado Luxury
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          text: template.documentTypeName?.toUpperCase() || "DOCUMENTO",
          style: "coverDocType",
          color: "#6B7280",
          margin: [0, 0, 0, 10],
        },
        {
          text: template.description || "Manual Corporativo",
          style: "coverTitle",
          color: "#1A1A1A",
        },
        {
          columns: [
            {
              stack: [
                { text: "Código", style: "coverLabel" },
                { text: template.folio, style: "coverValue" },
              ],
            },
            {
              stack: [
                { text: "Versión", style: "coverLabel" },
                { text: `v${template.currentVersion}`, style: "coverValue" },
              ],
            },
            {
              stack: [
                { text: "Clasificación", style: "coverLabel" },
                {
                  text: template.confidentialityLevelName?.toUpperCase() || "",
                  style: "coverValue",
                  color:
                    template.confidentialityLevel === 3 ? "#DC2626" : "#1A1A1A",
                },
              ],
            },
            {
              stack: [
                { text: "Estado", style: "coverLabel" },
                { text: "VIGENTE", style: "coverValue", color: "#166534" },
              ],
            },
          ],
          margin: [0, 100, 0, 0],
        },
        {
          text: template.departamentName?.toUpperCase() || "",
          margin: [0, 50, 0, 0],
          color: docColor,
          bold: true,
          fontSize: 10,
        },
      ],
    };
  }

  private buildSectionHeader(title: string, docColor: string): Content {
    return {
      text: title.toUpperCase(),
      style: "sectionTitle",
      color: docColor,
    };
  }

  private buildSectionContent(
    section: IManualTemplateItemDTO,
    docColor: string,
  ): Content {
    if (!section.contentJson) return { text: "Sin contenido" };

    let parsed: any;
    try {
      parsed = JSON.parse(section.contentJson);
    } catch (e) {
      return { text: "Error procesando contenido" };
    }

    switch (section.sectionType) {
      case ESectionType.Glossary:
        return this.renderGlossary(parsed, docColor);
      case ESectionType.Raci:
        return this.renderRaci(parsed, docColor);
      case ESectionType.Steps:
        return this.renderSteps(parsed, docColor);
      case ESectionType.Alert:
        return this.renderAlert(parsed);
      case ESectionType.References:
        return this.renderReferences(parsed);
      case ESectionType.Objective:
      case ESectionType.Scope:
      case ESectionType.Appendix:
        // Parsear HTML a texto plano simplificado para pdfmake
        // NOTA: Para un HTML completo real se necesita html-to-pdfmake, pero usaremos texto directo por ahora
        return {
          text: this.stripHtml(parsed.html || ""),
          margin: [0, 0, 0, 10],
          style: "bodyText",
        };
      default:
        return { text: "" };
    }
  }

  private renderGlossary(content: any, docColor: string): Content {
    if (!content.terms || content.terms.length === 0) return { text: "" };

    const body = content.terms.map((t: any) => [
      { text: t.term, bold: true },
      { text: t.noUsar || "-", color: "#DC2626" },
      { text: t.definition },
    ]);

    return this.createTable(
      ["30%", "20%", "50%"],
      ["Termino Estandar", "No Usar", "Definicion"],
      body,
    );
  }

  private renderRaci(content: any, docColor: string): Content {
    if (!content.activities || content.activities.length === 0)
      return { text: "" };

    const body = content.activities.map((a: any) => [
      { text: a.activity },
      { text: a.responsible, alignment: "center", bold: a.responsible === "R" },
      { text: a.accountable, alignment: "center", bold: a.accountable === "A" },
      { text: a.consulted, alignment: "center", bold: a.consulted === "C" },
      { text: a.informed, alignment: "center", bold: a.informed === "I" },
    ]);

    return this.createTable(
      ["*", "auto", "auto", "auto", "auto"],
      ["Actividad", "R", "A", "C", "I"],
      body,
    );
  }

  private renderSteps(content: any, docColor: string): Content {
    if (!content.steps || content.steps.length === 0) return { text: "" };

    const stack: Content[] = [];
    content.steps.forEach((step: any) => {
      stack.push({
        columns: [
          {
            text: step.order.toString(),
            width: 25,
            bold: true,
            color: docColor,
            fontSize: 14,
          },
          {
            stack: [
              { text: step.actor, bold: true, fontSize: 10, color: "#6B7280" },
              { text: step.action, margin: [0, 2, 0, 10] },
            ],
          },
        ],
      });
    });
    return { stack };
  }

  private renderAlert(content: any): Content {
    const isWarning = content.alertType === EAlertType.Warning;
    const isNote = content.alertType === EAlertType.Info;
    // Colores del estandar documental
    const color = isWarning ? "#92400E" : isNote ? "#0B3164" : "#065F46";
    const bg = isWarning ? "#FFF7ED" : isNote ? "#F3F4F6" : "#F0FDF4";
    const title = isWarning
      ? "ADVERTENCIA"
      : isNote
        ? "NOTA"
        : "BUENAS PRÁCTICAS";

    return {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                { text: title, bold: true, color: color, margin: [0, 0, 0, 5] },
                { text: content.text },
              ],
              fillColor: bg,
              margin: [10, 10, 10, 10],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: (i) => (i === 0 ? 4 : 0),
        vLineColor: () => color,
      },
      margin: [0, 5, 0, 15],
    };
  }

  private renderReferences(content: any): Content {
    if (!content.items || content.items.length === 0) return { text: "" };
    const ul = content.items.map((i: any) => `${i.norm}: ${i.description}`);
    return { ul: ul, margin: [0, 0, 0, 10] };
  }

  private getStyles(docColor: string): StyleDictionary {
    return {
      coverDocType: { fontSize: 14, bold: true },
      coverTitle: { fontSize: 28, bold: true, margin: [0, 0, 0, 10] },
      coverLabel: { fontSize: 9, color: "#6B7280", bold: true },
      coverValue: { fontSize: 11, bold: true, margin: [0, 2, 0, 0] },
      sectionTitle: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 10],
        color: docColor,
      },
      bodyText: { fontSize: 11, color: "#1A1A1A", lineHeight: 1.5 },
    };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, "");
  }

  private createTable(widths: any[], header: string[], body: any[][]): any {
    return {
      table: {
        widths: widths,
        body: [
          header.map((h) => ({
            text: h,
            bold: true,
            fontSize: 11,
            color: "#ffffff",
            fillColor: "#1B3A6B",
          })),
          ...body,
        ],
      },
      layout: {
        fillColor: (rowIndex: number) =>
          rowIndex === 0 ? "#1B3A6B" : rowIndex % 2 === 0 ? "#F3F4F6" : null,
        hLineColor: () => "#E5E7EB",
        vLineColor: () => "#E5E7EB",
      },
      margin: [0, 0, 0, 10],
    };
  }
}

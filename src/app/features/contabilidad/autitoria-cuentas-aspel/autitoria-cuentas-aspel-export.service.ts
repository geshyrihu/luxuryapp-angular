import { Injectable } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import {
  IAutitoriaCuentaAspelCatalogoDTO,
  IAutitoriaCuentaAspelCustomerDTO,
  IAutitoriaCuentaAspelPresenciaDTO,
} from "./autitoria-cuentas-aspel.models";

@Injectable({ providedIn: "root" })
export class AutitoriaCuentasAspelExportService {
  private readonly pdfMakeInstance: any;

  constructor() {
    this.pdfMakeInstance = (pdfMake as any).default || pdfMake;
    if (this.pdfMakeInstance.vfs === undefined) {
      const fonts = pdfFonts as any;
      this.pdfMakeInstance.vfs = fonts.pdfMake?.vfs || fonts;
    }
  }

  async exportCatalogoExcel(
    cuentas: IAutitoriaCuentaAspelCatalogoDTO[],
    customers: IAutitoriaCuentaAspelCustomerDTO[],
    year: number,
    empresa: string,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Luxury Building Group";
    workbook.lastModifiedBy = "Luxury Building Group";
    workbook.created = new Date();
    workbook.modified = new Date();

    const ws = workbook.addWorksheet("Catalogo comparativo");
    const font = { name: "Yu Gothic", size: 10 };
    const headerFont = { name: "Yu Gothic", size: 10, bold: true };
    const border = {
      top: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
      left: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
      bottom: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
      right: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
    };

    const customerColumns = customers.map((customer) => ({
      header: customer.customerShortName,
      key: customer.customerId,
      width: 18,
    }));

    ws.columns = [
      { header: "Nivel", key: "nivel", width: 10 },
      { header: "No. Cuenta", key: "numCta", width: 18 },
      { header: "Naturaleza", key: "naturaleza", width: 14 },
      { header: "Descripcion", key: "descripcion", width: 34 },
      ...customerColumns,
    ];

    const titleRow = ws.addRow([
      `Catalogo general comparativo Aspel - ${empresa} - ${year}`,
    ]);
    titleRow.font = { name: "Yu Gothic", size: 14, bold: true };
    ws.mergeCells(titleRow.number, 1, titleRow.number, ws.columns.length);

    const subtitleRow = ws.addRow([
      "Exportacion de la tabla visible del catalogo general comparativo.",
    ]);
    subtitleRow.font = { name: "Yu Gothic", size: 10 };
    ws.mergeCells(subtitleRow.number, 1, subtitleRow.number, ws.columns.length);
    ws.addRow([]);

    const headerRow = ws.addRow(ws.columns.map((column) => column.header));
    headerRow.height = 22;
    headerRow.eachCell((cell) => {
      cell.font = headerFont;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E3A8A" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = border;
      cell.font = { ...headerFont, color: { argb: "FFFFFFFF" } };
    });

    cuentas.forEach((cuenta, index) => {
      const rowData: Record<string, string | number> = {
        nivel: cuenta.nivelReferencia,
        numCta: cuenta.numCta,
        naturaleza: this.formatNaturaleza(cuenta.naturalezaReferencia),
        descripcion: cuenta.nombreReferencia || "-",
      };

      customers.forEach((customer) => {
        const presencia = cuenta.presencias.find(
          (item) => item.customerId === customer.customerId,
        );
        rowData[customer.customerId] = this.formatPresenceCell(presencia);
      });

      const row = ws.addRow(rowData);
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
        });
      }

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = border;
        cell.font = font;
        cell.alignment =
          colNumber <= 4
            ? { vertical: "middle", horizontal: colNumber === 1 ? "center" : "left" }
            : { vertical: "middle", horizontal: "center" };
      });

      if (cuenta.tieneDiferenciaEstructural) {
        row.getCell("descripcion").font = {
          ...font,
          bold: true,
          color: { argb: "FFD97706" },
        };
      }
    });

    ws.views = [{ state: "frozen", xSplit: 4, ySplit: 4 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `CatalogoGeneralComparativo-${empresa}-${year}.xlsx`,
    );
  }

  exportCatalogoPdf(
    cuentas: IAutitoriaCuentaAspelCatalogoDTO[],
    customers: IAutitoriaCuentaAspelCustomerDTO[],
    year: number,
    empresa: string,
  ): void {
    const headers = [
      { text: "Nivel", style: "tableHeader" },
      { text: "No. Cuenta", style: "tableHeader" },
      { text: "Naturaleza", style: "tableHeader" },
      { text: "Descripcion", style: "tableHeader" },
      ...customers.map((customer) => ({
        text: customer.customerShortName,
        style: "tableHeader",
      })),
    ];

    const body: any[][] = [
      headers,
      ...cuentas.map((cuenta) => [
        {
          text: cuenta.nivelReferencia.toString(),
          alignment: "center",
          bold: true,
          fillColor: this.getLevelFillColor(cuenta.nivelReferencia),
          color: this.getLevelTextColor(cuenta.nivelReferencia),
        },
        {
          text: cuenta.numCta,
          bold: true,
          fillColor: this.getLevelFillColor(cuenta.nivelReferencia),
          color: this.getLevelTextColor(cuenta.nivelReferencia),
        },
        {
          text: this.formatNaturaleza(cuenta.naturalezaReferencia),
          alignment: "center",
          color: "#374151",
        },
        {
          text: cuenta.nombreReferencia || "-",
          color: cuenta.tieneDiferenciaEstructural ? "#D97706" : "#111827",
          bold: cuenta.tieneDiferenciaEstructural,
        },
        ...customers.map((customer) =>
          this.buildPresencePdfCell(
            cuenta.presencias.find((item) => item.customerId === customer.customerId),
          ),
        ),
      ]),
    ];

    const columnWidths: any[] = [
      36,
      72,
      58,
      130,
      ...customers.map(() => 48),
    ];

    const docDefinition: TDocumentDefinitions = {
      pageSize: customers.length > 8 ? "A3" : "A4",
      pageOrientation: "landscape",
      pageMargins: [16, 20, 16, 20],
      content: [
        {
          text: "Catalogo general comparativo Aspel",
          fontSize: 15,
          bold: true,
          margin: [0, 0, 0, 4],
        },
        {
          text: `Empresa: ${empresa} | Ejercicio: ${year}`,
          fontSize: 10,
          color: "#4B5563",
          margin: [0, 0, 0, 6],
        },
        {
          columns: [
            {
              text: "SI = Existe",
              color: "#15803D",
              fontSize: 9,
              bold: true,
            },
            {
              text: "NO = No existe",
              color: "#DC2626",
              fontSize: 9,
              bold: true,
            },
            {
              text: "DIF = Diferencia estructural",
              color: "#D97706",
              fontSize: 9,
              bold: true,
            },
            {
              text: "N1-N4 colorean nivel y numero de cuenta",
              color: "#4B5563",
              fontSize: 8,
              alignment: "right",
            },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body,
          } as any,
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return "#1E3A8A";
              return rowIndex % 2 === 0 ? "#F8FAFC" : undefined;
            },
            hLineColor: () => "#D1D5DB",
            vLineColor: () => "#D1D5DB",
            hLineWidth: () => 0.6,
            vLineWidth: () => 0.6,
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 3,
            paddingBottom: () => 3,
          },
        },
      ],
      styles: {
        tableHeader: {
          color: "#FFFFFF",
          fillColor: "#1E3A8A",
          bold: true,
          fontSize: 8,
          alignment: "center",
        },
      },
      defaultStyle: {
        fontSize: 7,
      },
    };

    this.pdfMakeInstance
      .createPdf(docDefinition)
      .download(`CatalogoGeneralComparativo-${empresa}-${year}.pdf`);
  }

  private formatPresenceCell(
    presencia?: IAutitoriaCuentaAspelPresenciaDTO,
  ): string {
    if (!presencia || !presencia.presente) return "No";
    if (!presencia.estructuraValida) return "Dif";
    return "Si";
  }

  private buildPresencePdfCell(
    presencia?: IAutitoriaCuentaAspelPresenciaDTO,
  ): Record<string, unknown> {
    if (!presencia || !presencia.presente) {
      return {
        text: "NO",
        alignment: "center",
        color: "#DC2626",
        bold: true,
        fillColor: "#FEF2F2",
      };
    }

    if (!presencia.estructuraValida) {
      return {
        text: "DIF",
        alignment: "center",
        color: "#D97706",
        bold: true,
        fillColor: "#FFFBEB",
      };
    }

    return {
      text: "SI",
        alignment: "center",
      color: "#15803D",
      bold: true,
      fillColor: "#F0FDF4",
    };
  }

  private formatNaturaleza(value: string): string {
    const normalized = (value ?? "").trim().toUpperCase();
    if (normalized === "D") return "Deudora";
    if (normalized === "A") return "Acreedora";
    return normalized || "-";
  }

  private getLevelFillColor(level: number): string {
    switch (level) {
      case 1:
        return "#DBEAFE";
      case 2:
        return "#E0F2FE";
      case 3:
        return "#F8FAFC";
      case 4:
        return "#FEF3C7";
      default:
        return "#F3F4F6";
    }
  }

  private getLevelTextColor(level: number): string {
    switch (level) {
      case 1:
        return "#1D4ED8";
      case 2:
        return "#0369A1";
      case 3:
        return "#111827";
      case 4:
        return "#B45309";
      default:
        return "#374151";
    }
  }
}

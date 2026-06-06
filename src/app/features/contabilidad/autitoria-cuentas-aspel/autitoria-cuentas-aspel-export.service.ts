import { Injectable, inject } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import {
  IAutitoriaCuentaAspelCatalogoDTO,
  IAutitoriaCuentaAspelCustomerDTO,
  IAutitoriaCuentaAspelPresenciaDTO,
} from "./autitoria-cuentas-aspel.models";

@Injectable({ providedIn: "root" })
export class AutitoriaCuentasAspelExportService {
  private readonly htmlPrintS = inject(HtmlPrintService);

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

  async exportCatalogoPdf(
    cuentas: IAutitoriaCuentaAspelCatalogoDTO[],
    customers: IAutitoriaCuentaAspelCustomerDTO[],
    year: number,
    empresa: string,
  ): Promise<void> {
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();
    const html = this.buildCatalogoPdfHtml(cuentas, customers, year, empresa, logo, generatedAt);
    const fileName = `CatalogoGeneralComparativo-${empresa}-${year}`;
    this.htmlPrintS.printHtml(html, fileName);
  }

  private buildCatalogoPdfHtml(
    cuentas: IAutitoriaCuentaAspelCatalogoDTO[],
    customers: IAutitoriaCuentaAspelCustomerDTO[],
    year: number,
    empresa: string,
    logo: string | null,
    generatedAt: Date
  ): string {
    const customerHeaders = customers.map(c => `<th>${this.htmlPrintS.esc(c.customerShortName)}</th>`).join("");

    const rows = cuentas.map(cuenta => {
      const presencias = customers.map(c => {
        const p = cuenta.presencias.find(item => item.customerId === c.customerId);
        return this.buildPresenceHtmlCell(p);
      }).join("");

      return `
        <tr>
          <td class="text-center bold" style="background-color: ${this.getLevelFillColor(cuenta.nivelReferencia)} !important; color: ${this.getLevelTextColor(cuenta.nivelReferencia)};">${cuenta.nivelReferencia}</td>
          <td class="bold" style="background-color: ${this.getLevelFillColor(cuenta.nivelReferencia)} !important; color: ${this.getLevelTextColor(cuenta.nivelReferencia)};">${this.htmlPrintS.esc(cuenta.numCta)}</td>
          <td class="text-center" style="color:#374151;">${this.formatNaturaleza(cuenta.naturalezaReferencia)}</td>
          <td style="color: ${cuenta.tieneDiferenciaEstructural ? '#D97706' : '#111827'}; font-weight: ${cuenta.tieneDiferenciaEstructural ? 'bold' : 'normal'};">${this.htmlPrintS.esc(cuenta.nombreReferencia || "-")}</td>
          ${presencias}
        </tr>
      `;
    }).join("");

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { size: landscape; margin: 10mm; }
  .container { max-width: 1400px; }
  th { background-color: #1E3A8A !important; color: #FFFFFF !important; }
  tbody tr:nth-child(even) { background-color: #F8FAFC !important; }

  .title { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
  .subtitle { font-size: 12px; color: #4B5563; margin-bottom: 10px; }
  .legend { display: flex; gap: 16px; margin-bottom: 12px; font-size: 11px; }

  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:4px 6px; border:1px solid #D1D5DB; }
  .data-table th { background:#1E3A8A; color: #FFFFFF; font-weight:700; text-align:center; }
  .data-table tbody tr:nth-child(even) { background:#F8FAFC; }

  .text-center { text-align:center !important; }
  .bold { font-weight: bold !important; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Catálogo Comparativo Aspel", `EJERCICIO ${year}`, generatedAt, "AUDITORÍA", `Empresa base: ${empresa}`)}
  
  <div class="body-doc">
    <div class="legend">
      <div style="color:#15803D; font-weight:bold;">SI = Existe</div>
      <div style="color:#DC2626; font-weight:bold;">NO = No existe</div>
      <div style="color:#D97706; font-weight:bold;">DIF = Diferencia estructural</div>
      <div style="color:#4B5563; margin-left: auto;">N1-N4 colorean nivel y número de cuenta</div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 40px;">Nivel</th>
          <th style="width: 100px;">No. Cuenta</th>
          <th style="width: 80px;">Naturaleza</th>
          <th>Descripción</th>
          ${customerHeaders}
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }


  private buildPresenceHtmlCell(presencia?: IAutitoriaCuentaAspelPresenciaDTO): string {
    if (!presencia || !presencia.presente) {
      return `<td class="text-center bold" style="color: #DC2626; background-color: #FEF2F2 !important;">NO</td>`;
    }
    if (!presencia.estructuraValida) {
      return `<td class="text-center bold" style="color: #D97706; background-color: #FFFBEB !important;">DIF</td>`;
    }
    return `<td class="text-center bold" style="color: #15803D; background-color: #F0FDF4 !important;">SI</td>`;
  }

  private formatPresenceCell(
    presencia?: IAutitoriaCuentaAspelPresenciaDTO,
  ): string {
    if (!presencia || !presencia.presente) return "No";
    if (!presencia.estructuraValida) return "Dif";
    return "Si";
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

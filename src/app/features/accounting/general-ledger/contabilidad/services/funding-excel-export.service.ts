import { Injectable } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FundingDetailDTO } from "../../funding/model/funding-detail-dto";
@Injectable({ providedIn: "root" })
export class FundingExcelExportService {
  async exportToExcel(DTO: FundingDetailDTO) {
    if (!DTO) {
      console.error("No data provided for Excel export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Luxury Building Group";
    workbook.lastModifiedBy = "Luxury Building Group";
    workbook.created = new Date();
    workbook.modified = new Date();

    const ws = workbook.addWorksheet("Fondeo");

    // --- STYLES ---
    const fontYuGothic8 = { name: "Yu Gothic", size: 8 };
    const fontYuGothic8Bold = { name: "Yu Gothic", size: 8, bold: true };
    const fontYuGothic12 = { name: "Yu Gothic", size: 12 };
    const fontYuGothic12WhiteBold = {
      name: "Yu Gothic",
      size: 12,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    const fontYuGothic16 = { name: "Yu Gothic", size: 16, bold: true };
    const border = {
      top: { style: "thin" as const },
      left: { style: "thin" as const },
      bottom: { style: "thin" as const },
      right: { style: "thin" as const },
    };
    const numberFormat = "#,##0.00";
    const groupHeaderFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: { argb: "FFD9D9D9" },
    };
    const gradientFill = {
      type: "gradient" as const,
      gradient: "path" as const,
      center: { left: 0, top: 0 },
      stops: [
        { position: 0, color: { argb: "FF000000" } },
        { position: 1, color: { argb: "FF203988" } },
      ],
    };
    const totalFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: { argb: "FFF3F6FA" },
    };

    // --- PAGE SETUP ---
    ws.addRow([]);
    const titleRow = ws.addRow([DTO.periodo.toUpperCase()]);
    titleRow.font = fontYuGothic16;
    titleRow.alignment = { horizontal: "center" };
    ws.mergeCells(titleRow.number, 1, titleRow.number, 10);

    const subtitleRow = ws.addRow([`${DTO.customerName} | ${DTO.rango}`]);
    subtitleRow.font = fontYuGothic12;
    subtitleRow.alignment = { horizontal: "center" };
    ws.mergeCells(subtitleRow.number, 1, subtitleRow.number, 10);
    ws.addRow([]);
    ws.addRow([]);

    // --- SET COLUMN WIDTHS ---
    ws.getColumn(1).width = 10; // Né
    ws.getColumn(2).width = 45; // CONCEPTO
    ws.getColumn(3).width = 8; // Check
    ws.getColumn(4).width = 15; // FECHA
    ws.getColumn(5).width = 15; // FAC
    ws.getColumn(6).width = 40; // PROVEEDOR
    ws.getColumn(7).width = 18; // TOTAL
    ws.getColumn(8).width = 20; // BANCO
    ws.getColumn(9).width = 25; // CUENTA/CLABE
    ws.getColumn(10).width = 25; // REFERENCIA

    // --- DATA INSERTION ---
    const headers = [
      "Né",
      "CONCEPTO",
      "",
      "FECHA",
      "FAC",
      "PROVEEDOR Y/O ACREEDOR",
      "TOTAL",
      "BANCO",
      "CUENTA/CLABE",
      "REFERENCIA",
    ];
    let groupIndex = 1;

    DTO.grupos.forEach((grupo) => {
      // Group Title
      const groupHeaderRow = ws.addRow([
        `${groupIndex}. ${grupo.tipoGasto.toUpperCase()}`,
        "",
        "",
        "",
        "",
        "",
        "DATOS PARA PAGO",
      ]);
      groupHeaderRow.font = { ...fontYuGothic12, bold: true };
      ws.mergeCells(groupHeaderRow.number, 1, groupHeaderRow.number, 6);
      ws.mergeCells(groupHeaderRow.number, 7, groupHeaderRow.number, 10);

      // Apply fill and alignment to merged cells
      for (let i = 1; i <= 10; i++) {
        const cell = groupHeaderRow.getCell(i);
        cell.fill = groupHeaderFill;
        cell.border = border;
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }

      // Table Headers for this group
      const tableHeaderRow = ws.addRow(headers);
      tableHeaderRow.eachCell((cell) => {
        cell.fill = gradientFill;
        cell.font = fontYuGothic12WhiteBold;
        cell.border = border;
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
      });

      // Table Data
      grupo.ordenes.forEach((orden) => {
        const rowData = [
          orden.indice,
          orden.justificacionGasto,
          "", // Empty for checkbox
          orden.fechaSolicitud,
          orden.factura,
          orden.nameProvider,
          Number(orden.total),
          orden.shortName,
          orden.cuentaClave,
          orden.reference,
        ];
        const dataRow = ws.addRow(rowData);
        dataRow.height = 35;

        dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.border = border;
          cell.font = fontYuGothic8;

          // colNumber is 1-based
          switch (colNumber) {
            case 1: // Né
              cell.font = fontYuGothic8Bold;
              cell.alignment = { vertical: "middle", horizontal: "center" };
              break;
            case 2: // CONCEPTO
            case 6: // PROVEEDOR
              cell.alignment = {
                vertical: "middle",
                horizontal: "left",
                wrapText: true,
              };
              break;
            case 3: // Checkbox
              // ExcelJS does not support native visual checkbox controls.
              // This creates a dropdown list in the cell where the user can select '?' or leave it blank.
              // The user needs to click the cell and then the dropdown arrow to select.
              cell.dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: ['"?, "'],
              };
              cell.alignment = { vertical: "middle", horizontal: "center" };
              break;
            case 4: // FECHA
            case 5: // FAC
            case 8: // BANCO
            case 9: // CUENTA/CLABE
            case 10: // REFERENCIA
              cell.alignment = { vertical: "middle", horizontal: "center" };
              break;
            case 7: // TOTAL
              cell.alignment = { vertical: "middle", horizontal: "right" };
              cell.numFmt = numberFormat;
              break;
            default:
              cell.alignment = { vertical: "middle" };
              break;
          }
        });
      });

      // Group Subtotal
      const subtotalRow = ws.addRow([]);
      subtotalRow.getCell(6).value = `TOTAL ${grupo.tipoGasto.toUpperCase()}`;
      subtotalRow.getCell(6).font = { ...fontYuGothic12, bold: true };
      subtotalRow.getCell(7).value = Number(grupo.totalGrupo);
      subtotalRow.getCell(7).font = { ...fontYuGothic12, bold: true };
      subtotalRow.getCell(7).numFmt = numberFormat;
      subtotalRow.getCell(7).fill = totalFill;
      subtotalRow.getCell(6).border = border;
      subtotalRow.getCell(7).border = border;

      ws.addRow([]); // Spacer
      groupIndex++;
    });

    // --- GRAND TOTAL ---
    const granDTOtal = DTO.grupos.reduce(
      (sum, g) => sum + Number(g.totalGrupo),
      0,
    );
    const granDTOtalRow = ws.addRow([]);
    granDTOtalRow.getCell(6).value = "GRAN TOTAL";
    granDTOtalRow.getCell(6).font = { name: "Yu Gothic", size: 14, bold: true };
    granDTOtalRow.getCell(7).value = granDTOtal;
    granDTOtalRow.getCell(7).font = { name: "Yu Gothic", size: 14, bold: true };
    granDTOtalRow.getCell(7).numFmt = numberFormat;

    ws.addRow([]);
    ws.addRow([]);

    // --- SUMMARY & SIGNATURES ---
    // Headers
    const summaryHeaderRow = ws.addRow([
      "NO",
      "RESUMEN",
      "",
      "",
      "",
      "",
      "",
      "FIRMAS",
      "",
      "",
    ]);

    // Style Summary Header (Black Background, White Text)
    const summaryHeaderCellNo = summaryHeaderRow.getCell(1);
    summaryHeaderCellNo.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };
    summaryHeaderCellNo.font = fontYuGothic12WhiteBold;
    summaryHeaderCellNo.alignment = { horizontal: "center" };

    const summaryHeaderCellTitle = summaryHeaderRow.getCell(2);
    summaryHeaderCellTitle.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };
    summaryHeaderCellTitle.font = fontYuGothic12WhiteBold;
    ws.mergeCells(summaryHeaderRow.number, 2, summaryHeaderRow.number, 6); // Merge for "RESUMEN"

    // Style Signatures Header (Gray Background)
    const signaturesHeaderCell = summaryHeaderRow.getCell(8);
    signaturesHeaderCell.value = "FIRMAS";
    signaturesHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    signaturesHeaderCell.font = fontYuGothic12;
    signaturesHeaderCell.alignment = { horizontal: "center" };
    ws.mergeCells(summaryHeaderRow.number, 8, summaryHeaderRow.number, 10); // Merge for "FIRMAS"

    // Data Rows
    // Build Signature Lines
    const signatureLines = [
      { label: "Elabora:", name: DTO.verifiedBy || "" },
      { label: "Vo. Bo.", name: DTO.authorizedBy || "" },
      { label: "Autoriza", name: DTO.tesorero || "" },
    ];

    const maxRows = Math.max(DTO.grupos.length, signatureLines.length * 2);

    for (let i = 0; i < maxRows; i++) {
      const row = ws.addRow(["", "", "", "", "", "", "", "", "", ""]);
      row.height = 20;

      // --- LEFT SIDE (SUMMARY) ---
      if (i < DTO.grupos.length) {
        const grupo = DTO.grupos[i];
        row.getCell(1).value = i + 1; // NO
        row.getCell(1).alignment = { horizontal: "center" };
        row.getCell(1).font = fontYuGothic12;

        row.getCell(2).value = grupo.tipoGasto.toUpperCase(); // Concepto
        ws.mergeCells(row.number, 2, row.number, 6);
        row.getCell(2).font = fontYuGothic12;

        row.getCell(7).value = Number(grupo.totalGrupo); // Total
        row.getCell(7).numFmt = numberFormat;
        row.getCell(7).font = fontYuGothic12;
      }

      // --- RIGHT SIDE (SIGNATURES) ---
      // We use 2 rows per signature (Label, then Name)
      // i = 0 -> Sig 1 Label
      // i = 1 -> Sig 1 Name
      // i = 2 -> Sig 2 Label...

      const sigIndex = Math.floor(i / 2);
      const isNameRow = i % 2 === 1;

      if (sigIndex < signatureLines.length) {
        const sig = signatureLines[sigIndex];
        if (!isNameRow) {
          // Label Row
          row.getCell(8).value = sig.label;
          row.getCell(8).font = { ...fontYuGothic8Bold, bold: true };
          row.getCell(8).alignment = { horizontal: "left", vertical: "bottom" };
        } else {
          // Name Row
          row.getCell(8).value = sig.name;
          row.getCell(8).font = fontYuGothic12;
          row.getCell(8).alignment = {
            horizontal: "center",
            vertical: "bottom",
          };
          row.getCell(8).border = { bottom: { style: "thin" } }; // Signature line
          ws.mergeCells(row.number, 8, row.number, 10);
        }
      }
    }

    // Summary Total Row
    const summaryTotalRow = ws.addRow(["", "", "", "", "", "", "", "", "", ""]);
    summaryTotalRow.getCell(6).value = "TOTAL";
    summaryTotalRow.getCell(6).font = {
      ...fontYuGothic12,
      bold: true,
      italic: true,
    };
    summaryTotalRow.getCell(6).alignment = { horizontal: "right" };

    summaryTotalRow.getCell(7).value = granDTOtal;
    summaryTotalRow.getCell(7).font = { ...fontYuGothic12, bold: true };
    summaryTotalRow.getCell(7).numFmt = numberFormat;
    summaryTotalRow.getCell(7).border = {
      top: { style: "thin" },
      bottom: { style: "double" },
    };

    // --- SAVE FILE ---
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${DTO.periodo.replace(".", "")} - ${DTO.customerName}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  }
}

import { Injectable } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
interface Column {
  header: string;
  key: string;
  width: number;
}

@Injectable({
  providedIn: "root",
})
export class AccountingCatalogExcelService {
  async exportToExcel(
    data: any[],
    columns: Column[],
    sheetName: string,
    fileName: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // --- ESTILOS REUTILIZABLES ---
    const font = { name: "Yu Gothic", size: 12 };
    const headerFont = { name: "Yu Gothic", size: 13, bold: true };
    const subtleBorderColor = "FFBDBDBD";
    const border = {
      top: { style: "thin" as const, color: { argb: subtleBorderColor } },
      left: { style: "thin" as const, color: { argb: subtleBorderColor } },
      bottom: { style: "thin" as const, color: { argb: subtleBorderColor } },
      right: { style: "thin" as const, color: { argb: subtleBorderColor } },
    };
    const evenRowFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: { argb: "FFF5F5F5" },
    };

    // --- DEFINICIÓN DE COLUMNAS ---
    worksheet.columns = columns.map((col) => ({
      ...col,
      style: { font, alignment: { vertical: "middle" as const } },
    }));

    // --- FORMATO DE ENCABEZADOS ---
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.font = headerFont;
      cell.fill = {
        type: "pattern" as const,
        pattern: "solid" as const,
        fgColor: { argb: "FFD3D3D3" },
      };
      cell.alignment = {
        vertical: "middle" as const,
        horizontal: "center" as const,
        wrapText: true,
      };
      cell.border = border;
    });

    // --- INSERCIÓN Y ESTILO DE DATOS ---
    data.forEach((item, index) => {
      const row = worksheet.addRow(item);
      row.height = 20;

      // Estilo de fila alterno
      if ((index + 2) % 2 === 0) {
        row.fill = evenRowFill;
      }

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = border;
        // You can add more specific cell formatting here if needed
      });
    });

    // --- DESCARGA ---
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }
}










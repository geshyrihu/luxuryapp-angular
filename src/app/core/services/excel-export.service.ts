import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { ExportService } from './export.service';

// Interfaz para definir columnas
export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  constructor(private exportService: ExportService) {}

  /**
   * Genera y descarga Excel con datos tabulares.
   */
  exportToExcel<T>(
    data: T[],
    columns: ExcelColumn[],
    sheetName: string = 'Sheet1',
    fileName: string = 'export'
  ): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // PASO 1: Configurar encabezados
    worksheet.columns = columns.map((col: ExcelColumn) => ({
      header: col.header,
      key: col.key,
      width: col.width ?? 15
    }));

    // PASO 2: Formatear encabezados
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' } // Azul
    };

    // PASO 3: Agregar datos
    worksheet.addRows(data);

    // PASO 4: Formatear celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Colorear filas alternas
        if (rowNumber > 1 && rowNumber % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' }
          };
        }
      });
    });

    // PASO 5: Generar y descargar
    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      this.exportService.downloadFileWithTimestamp(
        blob,
        fileName,
        'xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }
}

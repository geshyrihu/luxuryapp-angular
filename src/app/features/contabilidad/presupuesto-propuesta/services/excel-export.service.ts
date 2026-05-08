import { Injectable } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
@Injectable({ providedIn: "root" })
export class ExcelExportService {
  async exportResumenPresupuesto(
    cuentas: any[],
    totales: any,
    meses: string[],
    fiscalYear: number,
  ) {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Resumen Presupuesto");

    // --- ESTILOS REUTILIZABLES ---
    const fontConsolas12 = { name: "Yu Gothic", size: 12 };
    const fontConsolas13 = { name: "Yu Gothic", size: 13 };
    const subtleBorderColor = "FFBDBDBD";
    const border = {
      top: { style: "thin" as const, color: { argb: subtleBorderColor } },
      left: { style: "thin" as const, color: { argb: subtleBorderColor } },
      bottom: { style: "thin" as const, color: { argb: subtleBorderColor } },
      right: { style: "thin" as const, color: { argb: subtleBorderColor } },
    };
    const numberFormat = "#,##0";
    const percentageFormat = "0%";
    const evenRowFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: { argb: "FFF5F5F5" },
    };
    const groupRowFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: { argb: "FFE0E0E0" },
    };

    // --- DEFINICIÓN DE COLUMNAS ---
    const columns: Partial<ExcelJS.Column>[] = [
      {
        header: "CUENTA",
        key: "accountName",
        width: 40,
        style: {
          font: fontConsolas12,
          alignment: { vertical: "middle" as const },
        },
      },
      ...meses.map((mes) => ({
        header: mes.substring(0, 3).toUpperCase(),
        key: "gasto" + mes.charAt(0).toUpperCase() + mes.slice(1),
        width: 15,
        style: {
          font: fontConsolas12,
          numFmt: numberFormat,
          alignment: { vertical: "middle" as const },
        },
      })),
      {
        header: "PRESUPUESTO ACTUAL (MENSUAL)",
        key: "currentAmount",
        width: 15,
        style: {
          font: fontConsolas12,
          numFmt: numberFormat,
          alignment: { vertical: "middle" as const },
        },
      },
      {
        header: "PROMEDIO MENSUAL GASTADO",
        key: "promedioGasto",
        width: 15,
        style: {
          font: fontConsolas12,
          numFmt: numberFormat,
          alignment: { vertical: "middle" as const },
        },
      },
      {
        header: `PSTO (${fiscalYear}) MENSUAL`,
        key: "proposedAmount",
        width: 15,
        style: {
          font: fontConsolas12,
          numFmt: numberFormat,
          alignment: { vertical: "middle" as const },
        },
      },
      {
        header: "DIF (FORMULADO)",
        key: "dif",
        width: 15,
        style: {
          font: fontConsolas12,
          numFmt: numberFormat,
          alignment: { vertical: "middle" as const },
        },
      },
      {
        header: "% CAMBIO (FORMULADO)",
        key: "porcentajeCambio",
        width: 15,
        style: {
          font: fontConsolas12,
          numFmt: percentageFormat,
          alignment: { vertical: "middle" as const },
        },
      },
    ];
    ws.columns = columns;

    // --- CONFIGURACIÓN DE LA VISTA ---
    ws.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];
    const lastColumnLetter = String.fromCharCode(64 + ws.columns.length);
    ws.autoFilter = `A1:${lastColumnLetter}1`;

    // --- FORMATO DE ENCABEZADOS ---
    const headerRow = ws.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.font = { ...fontConsolas13, bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = border;
    });

    // --- INSERCIÓN Y ESTILO DE DATOS ---
    cuentas.forEach((item) => {
      const isAgrupadora = !!item.esFilaAgrupadora;
      const rowNumber = ws.rowCount + 1;

      const rowData: any = { accountName: item.accountName };

      meses.forEach((mes) => {
        const key = "gasto" + mes.charAt(0).toUpperCase() + mes.slice(1);
        rowData[key] = isAgrupadora ? null : Number(item[key]) || 0;
      });

      rowData.currentAmount = isAgrupadora
        ? null
        : Number(item.currentAmount) || 0;

      if (isAgrupadora) {
        rowData.promedioGasto = null;
        rowData.proposedAmount = null;
        rowData.dif = null;
        rowData.porcentajeCambio = null;
      } else {
        const monthlyExpensesRange = `B${rowNumber}:M${rowNumber}`;
        const currentAnnualCell = `N${rowNumber}`;
        const proposedAnnualCell = `P${rowNumber}`;

        rowData.promedioGasto = { formula: `AVERAGE(${monthlyExpensesRange})` };
        rowData.proposedAmount = Number(item.proposedAmount) || 0;
        rowData.dif = { formula: `${proposedAnnualCell}-${currentAnnualCell}` };
        rowData.porcentajeCambio = {
          formula: `IF(${currentAnnualCell}=0,IF(${proposedAnnualCell}>0,1,0),(${proposedAnnualCell}-${currentAnnualCell})/${currentAnnualCell})`,
        };
      }

      const row = ws.addRow(rowData);
      row.height = 20;

      // Estilos de fila (agrupadora, alterno)
      if (isAgrupadora) {
        row.fill = groupRowFill;
      } else if (rowNumber % 2 === 0) {
        row.fill = evenRowFill;
      }

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = border;
        const colDef = ws.columns[colNumber - 1];
        if (isAgrupadora) {
          cell.font = { ...fontConsolas12, bold: true };
        }
        if (colDef.numFmt && colDef.key !== "accountName") {
          cell.alignment = { vertical: "middle" as const, horizontal: "right" };
        }
      });

      if (!isAgrupadora) {
        const proposedCell = row.getCell("proposedAmount");
        proposedCell.protection = { locked: false };
      }
    });

    const lastDataRowNumber = ws.rowCount;

    // --- FORMATO CONDICIONAL ---
    const difColumnLetter = "Q";
    const percentColumnLetter = "R";

    ws.addConditionalFormatting({
      ref: `${difColumnLetter}2:${difColumnLetter}${lastDataRowNumber}`,
      rules: [
        {
          type: "cellIs",
          operator: "greaterThan",
          formulae: [0],
          style: { font: { color: { argb: "FFFF0000" }, bold: true } }, // Rojo
          priority: 1,
        },
        {
          type: "cellIs",
          operator: "lessThan",
          formulae: [0],
          style: { font: { color: { argb: "FF008000" }, bold: true } }, // Verde
          priority: 2,
        },
      ],
    });
    ws.addConditionalFormatting({
      ref: `${percentColumnLetter}2:${percentColumnLetter}${lastDataRowNumber}`,
      rules: [
        {
          type: "cellIs",
          operator: "greaterThan",
          formulae: [0],
          style: { font: { color: { argb: "FFFF0000" }, bold: true } }, // Rojo
          priority: 1,
        },
        {
          type: "cellIs",
          operator: "lessThan",
          formulae: [0],
          style: { font: { color: { argb: "FF008000" }, bold: true } }, // Verde
          priority: 2,
        },
      ],
    });

    // --- FILA DE TOTALES ---
    const footerRowData: any[] = ["TOTALES"];
    ws.columns.forEach((column, index) => {
      if (index > 0) {
        const colLetter = String.fromCharCode(65 + index);
        if (column.key === "porcentajeCambio") {
          footerRowData.push(null);
        } else {
          footerRowData.push({
            formula: `SUM(${colLetter}2:${colLetter}${lastDataRowNumber})`,
          });
        }
      }
    });

    const footerRow = ws.addRow(footerRowData);
    footerRow.height = 20;

    const totalCurrentCell = `N${footerRow.number}`;
    const totalProposedCell = `P${footerRow.number}`;
    footerRow.getCell("porcentajeCambio").value = {
      formula: `IF(${totalCurrentCell}=0,IF(${totalProposedCell}>0,1,0),(${totalProposedCell}-${totalCurrentCell})/${totalCurrentCell})`,
    };

    footerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = {
        ...fontConsolas13,
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF245074" },
      };
      cell.border = {
        ...border,
        top: { style: "medium" as const, color: { argb: "FF757575" } },
      };
      cell.alignment = { vertical: "middle" as const, horizontal: "right" };
    });
    footerRow.getCell(1).alignment = {
      vertical: "middle" as const,
      horizontal: "left",
    };

    // --- PROTECCIÓN Y DESCARGA ---
    await ws.protect("luxury", {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `ResumenPresupuesto${fiscalYear}.xlsx`);
  }

  async exportSalidaProductos(items: any[], reportName: string) {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Salidas de Producto");

    const font = { name: "Yu Gothic", size: 11 };
    const borderColor = "FFBDBDBD";
    const border = {
      top: { style: "thin" as const, color: { argb: borderColor } },
      left: { style: "thin" as const, color: { argb: borderColor } },
      bottom: { style: "thin" as const, color: { argb: borderColor } },
      right: { style: "thin" as const, color: { argb: borderColor } },
    };

    ws.columns = [
      { header: "Fecha Salida", key: "fechaSalida", width: 18, style: { font } },
      { header: "Producto", key: "producto", width: 35, style: { font } },
      { header: "Cantidad", key: "cantidad", width: 12, style: { font, numFmt: "#,##0.##" } },
      { header: "Unidad de Medida", key: "unidadMedida", width: 18, style: { font } },
      { header: "Recibió", key: "quienUso", width: 25, style: { font } },
      { header: "Uso del Producto", key: "usoPrducto", width: 35, style: { font } },
      { header: "Cantidad Devuelta", key: "cantidadDevuelta", width: 18, style: { font, numFmt: "#,##0.##" } },
    ];

    const headerRow = ws.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.font = { ...font, bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD3D3D3" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = border;
    });

    const evenFill = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFF5F5F5" } };

    items.forEach((item, index) => {
      const row = ws.addRow({
        fechaSalida: item.fechaSalida ? new Date(item.fechaSalida) : null,
        producto: item.producto,
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida,
        quienUso: item.quienUso,
        usoPrducto: item.usoPrducto,
        cantidadDevuelta: item.cantidadDevuelta,
      });
      row.height = 18;
      if (index % 2 === 1) row.fill = evenFill;
      row.eachCell({ includeEmpty: true }, (cell) => { cell.border = border; });
      const dateCell = row.getCell("fechaSalida");
      dateCell.numFmt = "dd/mm/yyyy";
      dateCell.alignment = { vertical: "middle" };
    });

    ws.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), reportName);
  }

  async exportOwnerList(items: any[], reportName: string) {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Lista de Propietarios");

    const font = { name: "Yu Gothic", size: 11 };
    const borderColor = "FFBDBDBD";
    const border = {
      top: { style: "thin" as const, color: { argb: borderColor } },
      left: { style: "thin" as const, color: { argb: borderColor } },
      bottom: { style: "thin" as const, color: { argb: borderColor } },
      right: { style: "thin" as const, color: { argb: borderColor } },
    };

    ws.columns = [
      { header: "Propiedad", key: "property", width: 15, style: { font } },
      { header: "Habitante", key: "habitant", width: 15, style: { font } },
      { header: "Nombre Completo", key: "fullName", width: 40, style: { font } },
      { header: "Teléfono Fijo", key: "fixedPhone", width: 15, style: { font } },
      { header: "Extensión", key: "extencion", width: 10, style: { font } },
      { header: "Teléfono", key: "phoneNumber", width: 15, style: { font } },
      { header: "Email", key: "email", width: 35, style: { font } },
      { header: "Enviar Info", key: "enviarMails", width: 12, style: { font } },
    ];

    const headerRow = ws.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.font = { ...font, bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = border;
    });

    const evenFill = {
      type: "pattern" as const,
      pattern: "solid" as const,
      fgColor: { argb: "FFF5F5F5" },
    };

    items.forEach((item, index) => {
      const row = ws.addRow({
        property: item.property,
        habitant: item.habitant,
        fullName: item.fullName,
        fixedPhone: item.fixedPhone,
        extencion: item.extencion,
        phoneNumber: item.phoneNumber,
        email: item.email,
        enviarMails: item.enviarMails ? "Sí" : "No",
      });
      row.height = 18;
      if (index % 2 === 1) row.fill = evenFill;
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = border;
      });
    });

    ws.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), reportName);
  }
}










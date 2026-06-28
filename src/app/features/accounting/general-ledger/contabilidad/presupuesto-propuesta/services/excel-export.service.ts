/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100% 
 * FUNCIONAL y ESTABLE. 
 * 
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lógica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explícita del Ing. Ricardo Marques.
 * 
 * Por favor, NO rompan el código.
 * ============================================================================
 */
import { Injectable } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
@Injectable({ providedIn: "root" })
export class ExcelExportService {
  private toUtcDateOnly(value: string | null | undefined) {
    if (!value) return null;

    const datePart = value.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);
    if (!year || !month || !day) return null;

    return new Date(Date.UTC(year, month - 1, day));
  }

  async exportResumenPresupuesto(
    cuentas: any[],
    totales: any,
    meses: string[],
    fiscalYear: number,
  ) {
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Resumen Presupuesto");

    // ── ESTILOS BASE ──────────────────────────────────────────────────────────
    const fontBase   = { name: "Yu Gothic", size: 10 };
    const fontHeader = { name: "Yu Gothic", size: 11 };
    // "#,##0" para positivos, igual para negativos, "-" para cero
    const numFmt  = `#,##0;-#,##0;"-"`;
    const pctFmt  = `0%;-0%;"-"`;
    const bClr    = "FFBDBDBD";
    const dotClr  = "FFCCCCCC";
    const mkBorder = (bottom?: ExcelJS.BorderStyle): ExcelJS.Borders => ({
      top:      { style: "thin",  color: { argb: bClr } },
      left:     { style: "thin",  color: { argb: bClr } },
      right:    { style: "thin",  color: { argb: bClr } },
      bottom:   { style: bottom ?? "thin", color: { argb: bottom === "dotted" ? dotClr : bClr } },
      diagonal: {},
    });

    const fillGroup  = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FF2F5496" } };
    const fillPsto   = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFD9E1F2" } };
    const fillGasto  = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFFFFFFF" } };
    const fillFooter = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FF1F3864" } };
    const fillFooterG= { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FF2F5496" } };

    const applyNum = (cell: ExcelJS.Cell, bold = false, color = "FF1F1F1F", fill = fillGasto, isBottom = false) => {
      cell.numFmt    = numFmt;
      cell.font      = { ...fontBase, bold, color: { argb: color } };
      cell.alignment = { vertical: "middle" as const, horizontal: "right" };
      cell.fill      = fill;
      cell.border    = mkBorder(isBottom ? undefined : "dotted");
    };

    // ── COLUMNAS ──────────────────────────────────────────────────────────────
    // A (1)   : Número de cuenta
    // B (2)   : Descripción
    // C–N (3–14): 12 meses  →  presupuesto en fila-P, gasto en fila-G
    // O (15)  : PSTO ACTUAL     — fila-P
    // P (16)  : PROM GASTO      — fila-G  (=AVERAGE C:N de esa fila)
    // Q (17)  : PSTO PROPUESTO  — fila-P
    // R (18)  : DIF             — fila-P  (=Q-O)
    // S (19)  : % CAMBIO        — fila-P
    const TOTAL_COLS = 19;
    ws.columns = [
      { header: "CUENTA",       key: "num",           width: 14 },
      { header: "DESCRIPCIÓN",  key: "desc",          width: 36 },
      ...meses.map((mes) => ({
        header: mes.substring(0, 3).toUpperCase(),
        key:    `m_${mes}`,
        width:  11,
      })),
      { header: "PSTO ACTUAL",        key: "currentAmount",   width: 16 },
      { header: "PROM GASTO",         key: "promedioGasto",   width: 16 },
      { header: `PSTO ${fiscalYear}`, key: "proposedAmount",  width: 16 },
      { header: "DIF",                key: "dif",             width: 14 },
      { header: "% CAMBIO",           key: "pct",             width: 12 },
    ];

    // ── VISTA / AUTOFILTRO ────────────────────────────────────────────────────
    ws.views = [{ state: "frozen", xSplit: 2, ySplit: 1 }]; // congela las 2 primeras columnas
    ws.autoFilter = "A1:S1";

    // ── ENCABEZADO ────────────────────────────────────────────────────────────
    const hRow = ws.getRow(1);
    hRow.height = 34;
    for (let c = 1; c <= TOTAL_COLS; c++) {
      const cell = hRow.getCell(c);
      cell.font      = { ...fontHeader, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border    = mkBorder();
    }

    // ── ACUMULADORES PARA EL PIE ──────────────────────────────────────────────
    const sumPsto: number[]  = new Array(12).fill(0);
    const sumGasto: number[] = new Array(12).fill(0);
    let sumCurrentAmt  = 0;
    let sumProposedAmt = 0;

    // helper estilar celda numérica ya añadida al row
    const styleCell = (
      cell: ExcelJS.Cell,
      fill: ExcelJS.Fill,
      bold = false,
      color = "FF1F1F1F",
      border: ExcelJS.Borders = mkBorder(),
      fmt = numFmt,
    ) => {
      cell.numFmt    = fmt;
      cell.font      = { ...fontBase, bold, color: { argb: color } };
      cell.alignment = { vertical: "middle" as const, horizontal: "right" };
      cell.fill      = fill;
      cell.border    = border;
    };

    // ── DATOS ─────────────────────────────────────────────────────────────────
    cuentas.forEach((item) => {
      const isGroup = !!item.esFilaAgrupadora;

      if (isGroup) {
        // Fila agrupadora: A+B combinadas
        const rn  = ws.rowCount + 1;
        const row = ws.addRow({ num: item.accountNumber, desc: item.accountName });
        row.height = 22;
        ws.mergeCells(rn, 1, rn, 2);
        const nc = row.getCell("num");
        nc.value     = item.accountName;
        nc.font      = { ...fontBase, bold: true, color: { argb: "FFFFFFFF" } };
        nc.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        nc.fill      = fillGroup;
        nc.border    = mkBorder();
        for (let c = 2; c <= TOTAL_COLS; c++) {
          row.getCell(c).fill   = fillGroup;
          row.getCell(c).border = mkBorder();
        }
        return;
      }

      // Valores resumen
      const curVal  = Number(item.currentAmount)  || 0;
      const propVal = Number(item.proposedAmount) || 0;
      sumCurrentAmt  += curVal;
      sumProposedAmt += propVal;

      // ── Fila PRESUPUESTO: usamos las keys de columna ──────────────────────
      const pstoData: Record<string, any> = {
        num:            item.accountNumber,
        desc:           item.accountName,
        currentAmount:  curVal,
        proposedAmount: propVal,
      };
      meses.forEach((mes, i) => {
        const k = "presupuesto" + mes.charAt(0).toUpperCase() + mes.slice(1);
        const v = Number(item[k]) || 0;
        pstoData[`m_${mes}`] = v;
        sumPsto[i] += v;
      });

      const pRow  = ws.rowCount + 1;
      const rowP  = ws.addRow(pstoData);
      rowP.height = 17;

      // A: número de cuenta
      const cn = rowP.getCell("num");
      cn.font      = { ...fontBase, bold: true, color: { argb: "FF1F3864" } };
      cn.alignment = { vertical: "middle", horizontal: "left" };
      cn.fill      = fillPsto;
      cn.border    = mkBorder("dotted");

      // B: descripción
      const cd = rowP.getCell("desc");
      cd.font      = { ...fontBase, color: { argb: "FF333333" } };
      cd.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      cd.fill      = fillPsto;
      cd.border    = mkBorder("dotted");

      // C–N: presupuesto mensual
      meses.forEach((mes) => styleCell(rowP.getCell(`m_${mes}`), fillPsto, false, "FF404040", mkBorder("dotted")));

      // O: PSTO ACTUAL
      styleCell(rowP.getCell("currentAmount"), fillPsto, false, "FF404040", mkBorder("dotted"));

      // P: vacío
      rowP.getCell("promedioGasto").fill   = fillPsto;
      rowP.getCell("promedioGasto").border = mkBorder("dotted");

      // Q: PSTO PROPUESTO — editable
      styleCell(rowP.getCell("proposedAmount"), fillPsto, true, "FF1F3864", mkBorder("dotted"));
      rowP.getCell("proposedAmount").protection = { locked: false };

      // R: DIF
      const cDif = rowP.getCell("dif");
      cDif.value = { formula: `Q${pRow}-O${pRow}` };
      styleCell(cDif, fillPsto, true, "FF1F1F1F", mkBorder("dotted"));

      // S: % CAMBIO
      const cPct = rowP.getCell("pct");
      cPct.value = { formula: `IF(O${pRow}=0,IF(Q${pRow}>0,1,0),(Q${pRow}-O${pRow})/O${pRow})` };
      styleCell(cPct, fillPsto, true, "FF1F1F1F", mkBorder("dotted"), pctFmt);

      // ── Fila GASTO: usamos las keys de columna ────────────────────────────
      const gastoData: Record<string, any> = { num: null, desc: null };
      meses.forEach((mes, i) => {
        const gk  = "gasto"        + mes.charAt(0).toUpperCase() + mes.slice(1);
        const pk  = "presupuesto"  + mes.charAt(0).toUpperCase() + mes.slice(1);
        const val = Number(item[gk]) || 0;
        gastoData[`m_${mes}`]        = val;
        gastoData[`exc_${mes}`]      = val > 0 && (Number(item[pk]) || 0) > 0 && val > (Number(item[pk]) || 0);
        sumGasto[i] += val;
      });

      const gRow  = ws.rowCount + 1;
      const rowG  = ws.addRow(gastoData);
      rowG.height = 17;

      // A y B vacíos en fila gasto
      rowG.getCell("num").fill   = fillGasto;
      rowG.getCell("num").border = mkBorder();
      rowG.getCell("desc").fill  = fillGasto;
      rowG.getCell("desc").border = mkBorder();

      // C–N: gasto mensual con rojo si excede
      meses.forEach((mes) => {
        const excede = !!gastoData[`exc_${mes}`];
        styleCell(rowG.getCell(`m_${mes}`), fillGasto, excede, excede ? "FFC00000" : "FF1F1F1F");
      });

      // O: vacío
      rowG.getCell("currentAmount").fill   = fillGasto;
      rowG.getCell("currentAmount").border = mkBorder();

      // P: PROM GASTO — fórmula AVERAGEIF ignorando ceros
      const cProm = rowG.getCell("promedioGasto");
      cProm.value = { formula: `IFERROR(AVERAGEIF(C${gRow}:N${gRow},"<>0"),0)` };
      styleCell(cProm, fillGasto, false, "FF404040");

      // Q, R, S vacíos
      for (const k of ["proposedAmount", "dif", "pct"]) {
        rowG.getCell(k).fill   = fillGasto;
        rowG.getCell(k).border = mkBorder();
      }

      // ── Combinar A y B de las dos filas ──────────────────────────────────
      ws.mergeCells(pRow, 1, gRow, 1);
      ws.mergeCells(pRow, 2, gRow, 2);
      ws.getCell(pRow, 1).alignment = { vertical: "middle", horizontal: "left" };
      ws.getCell(pRow, 2).alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      ws.getCell(pRow, 1).border    = mkBorder();
      ws.getCell(pRow, 2).border    = mkBorder();
    });

    const lastData = ws.rowCount;

    // ── FORMATO CONDICIONAL (DIF=R, %=S) ─────────────────────────────────────
    const cfRules = [
      { type: "cellIs" as const, operator: "greaterThan" as const, formulae: [0],
        style: { font: { color: { argb: "FFC00000" }, bold: true } }, priority: 1 },
      { type: "cellIs" as const, operator: "lessThan" as const, formulae: [0],
        style: { font: { color: { argb: "FF375623" }, bold: true } }, priority: 2 },
    ];
    ws.addConditionalFormatting({ ref: `R2:R${lastData}`, rules: cfRules });
    ws.addConditionalFormatting({ ref: `S2:S${lastData}`, rules: cfRules });

    // ── PIE: TOTAL PRESUPUESTO ────────────────────────────────────────────────
    const pstoFooterData: Record<string, any> = {
      num: "TOTAL", desc: "PRESUPUESTO",
      currentAmount: sumCurrentAmt, proposedAmount: sumProposedAmt,
      dif: sumProposedAmt - sumCurrentAmt,
      pct: sumCurrentAmt > 0 ? (sumProposedAmt - sumCurrentAmt) / sumCurrentAmt : 0,
    };
    meses.forEach((mes, i) => { pstoFooterData[`m_${mes}`] = sumPsto[i]; });

    const fpRow = ws.addRow(pstoFooterData);
    fpRow.height = 22;
    ws.mergeCells(fpRow.number, 1, fpRow.number, 2);
    fpRow.getCell(1).value     = "TOTAL PRESUPUESTO";
    fpRow.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
    fpRow.getCell("pct").numFmt = pctFmt;
    fpRow.eachCell({ includeEmpty: true }, (cell, ci) => {
      cell.font      = { ...fontHeader, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill      = fillFooter;
      cell.border    = mkBorder();
      cell.alignment = ci <= 2
        ? { vertical: "middle", horizontal: "left" }
        : { vertical: "middle", horizontal: "right" };
      if (ci > 2) cell.numFmt = cell.numFmt || numFmt;
    });

    // ── PIE: TOTAL GASTO ─────────────────────────────────────────────────────
    const gastoFooterData: Record<string, any> = {
      num: "TOTAL", desc: "GASTO",
      promedioGasto: sumGasto.reduce((s, v) => s + v, 0) / 12,
    };
    meses.forEach((mes, i) => { gastoFooterData[`m_${mes}`] = sumGasto[i]; });

    const fgRow = ws.addRow(gastoFooterData);
    fgRow.height = 22;
    ws.mergeCells(fgRow.number, 1, fgRow.number, 2);
    fgRow.getCell(1).value     = "TOTAL GASTO";
    fgRow.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
    fgRow.eachCell({ includeEmpty: true }, (cell, ci) => {
      cell.font      = { ...fontHeader, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill      = fillFooterG;
      cell.border    = mkBorder();
      cell.alignment = ci <= 2
        ? { vertical: "middle", horizontal: "left" }
        : { vertical: "middle", horizontal: "right" };
      if (ci > 2) cell.numFmt = numFmt;
    });

    // ── DESCARGA ──────────────────────────────────────────────────────────────
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
        fechaSalida: this.toUtcDateOnly(item.fechaSalida),
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










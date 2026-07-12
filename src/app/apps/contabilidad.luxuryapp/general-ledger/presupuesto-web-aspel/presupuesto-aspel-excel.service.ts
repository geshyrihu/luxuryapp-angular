import { Injectable } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  AspelBudgetDTO,
  CuentaAspelTercerNivelDTO,
} from "../interfaces/presupuesto-shared.models";
import {
  ASPEL_MONTHS,
  getCuentaMonthValue,
  getPresupuestoBaseMensual,
} from "./presupuesto-web-aspel.shared";

@Injectable({ providedIn: 'root' })
export class PresupuestoAspelExcelService {
  private readonly font = { name: "Yu Gothic", size: 10 };

  private readonly C = {
    headerBg: "FF1E3A5F",
    headerFg: "FFFFFFFF",
    groupBg:  "FFDCE6F1",
    groupFg:  "FF1E3A5F",
    evenBg:   "FFF5F7FA",
    titleBg:  "FF1E3A5F",
    titleFg:  "FFFFFFFF",
    totalsBg: "FF245074",
    totalsFg: "FFFFFFFF",
    sectionBg:"FF3D6B9B",
    border:   "FFB0BEC5",
  };

  // --- PUBLIC API -----------------------------------------------------------

  async exportPresupuesto(
    cuentas: CuentaAspelTercerNivelDTO[],
    budgetData: AspelBudgetDTO | null,
    year: number,
  ): Promise<void> {
    const wb = this.newWorkbook();
    const empresa = budgetData?.Nombre_Empresa ?? "";
    this.buildMainSheet(wb, "Presupuesto", cuentas, empresa, year);
    this.buildResumen(wb, cuentas, [], [], empresa, year);
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Presupuesto_${year}.xlsx`);
  }

  async exportEspeciales(
    extraordinarias: CuentaAspelTercerNivelDTO[],
    proyectos: CuentaAspelTercerNivelDTO[],
    budgetData: AspelBudgetDTO | null,
    year: number,
  ): Promise<void> {
    const wb = this.newWorkbook();
    const empresa = budgetData?.Nombre_Empresa ?? "";
    this.buildExtSheet(wb, extraordinarias, empresa, year);
    this.buildMainSheet(wb, "Proyectos (606)", proyectos, empresa, year);
    this.buildResumen(wb, [], extraordinarias, proyectos, empresa, year);
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Gastos_Especiales_${year}.xlsx`);
  }

  // --- SHEET: PRESUPUESTO / PROYECTOS --------------------------------------
  // 18 columnas: CUENTA | PRE-MEN | ENEóDIC | ACUMULADO | % | PRE-TOTAL | RESTANTE

  private buildMainSheet(
    wb: ExcelJS.Workbook,
    name: string,
    cuentas: CuentaAspelTercerNivelDTO[],
    empresa: string,
    year: number,
  ): void {
    const ws = wb.addWorksheet(name);
    const b  = this.border();
    const NCOLS = 18;

    ws.columns = [
      { key: "cuenta",   width: 48 },
      { key: "preMen",   width: 13 },
      ...ASPEL_MONTHS.map(m => ({ key: m, width: 11 })),
      { key: "acum",     width: 13 },
      { key: "pct",      width:  9 },
      { key: "preTotal", width: 13 },
      { key: "rest",     width: 13 },
    ];

    const lastCol = this.colLetter(NCOLS);
    const titleText =
      name === "Presupuesto"
        ? `PRESUPUESTO FISCAL ${year}${empresa ? "  |  " + empresa.toUpperCase() : ""}`
        : `PROYECTOS (606) é EJERCICIO ${year}${empresa ? "  |  " + empresa.toUpperCase() : ""}`;

    this.addTitleRow(ws, titleText, lastCol, 1);
    this.addSubtitleRow(ws, lastCol, 2);
    this.addHeaderRow(ws, ["CUENTA", "PRE-MEN", ...ASPEL_MONTHS.map(m => m.substring(0, 3).toUpperCase()), "ACUMULADO", "%", "PRE-TOTAL", "RESTANTE"], 3);

    ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
    ws.autoFilter = { from: "A3", to: `${lastCol}3` };

    // -- Datos --
    const DATA_START = 4;
    let evenIdx = 0;

    for (const cuenta of cuentas) {
      if (cuenta.esFilaAgrupadora) {
        const row = ws.addRow([
          `${cuenta.codigo_Cuenta}  |  ${cuenta.descripcion_Cuenta}`,
          ...Array(NCOLS - 1).fill(null),
        ]);
        row.height = 20;
        ws.mergeCells(`A${row.number}:B${row.number}`);
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.font  = { name: "Yu Gothic", size: 9, bold: true, color: { argb: this.C.groupFg } };
          cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.groupBg } };
          cell.border = b;
        });
        const indent = cuenta.nivel_Cuenta === 2 ? 2 : 0;
        row.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent };
      } else {
        evenIdx++;
        const acum     = this.sumAll(cuenta, "monto");
        const preTotal = this.sumAll(cuenta, "presup");
        const pct      = preTotal > 0 ? acum / preTotal : null;
        const rest     = preTotal !== 0 || acum !== 0 ? preTotal - acum : null;
        const preMen   = getPresupuestoBaseMensual(cuenta) || null;
        const bgColor  = evenIdx % 2 === 0 ? this.C.evenBg : "FFFFFFFF";
        const indent   = cuenta.nivel_Cuenta === 4 ? 6 : cuenta.nivel_Cuenta === 3 ? 4 : 2;
        const bLight   = this.borderLight();

        // Fila 1 é PRESUPUESTO (pequeéa, azul apagado)
        const presupRow = ws.addRow([
          cuenta.descripcion_Cuenta,
          preMen,
          ...ASPEL_MONTHS.map(m => getCuentaMonthValue(cuenta, m, "presup") || null),
          null, null, null, null,
        ]);
        presupRow.height = 13;
        presupRow.eachCell({ includeEmpty: true }, (cell, ci) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
          if (ci === 1) {
            cell.font      = { name: "Yu Gothic", size: 9, bold: true, color: { argb: this.C.groupFg } };
            cell.alignment = { vertical: "middle", horizontal: "left", indent };
            cell.border    = { ...bLight, bottom: { style: "hair", color: { argb: this.C.border } } };
          } else {
            cell.font      = { name: "Yu Gothic", size: 8, color: { argb: "FF5F7FA5" } };
            cell.numFmt    = "#,##0";
            cell.alignment = { vertical: "middle", horizontal: "right" };
            cell.border    = { ...bLight, bottom: { style: "hair", color: { argb: this.C.border } } };
          }
        });

        // Fila 2 é GASTO (principal, con indicadores)
        const gastoRow = ws.addRow([
          cuenta.codigo_Cuenta,
          null,
          ...ASPEL_MONTHS.map(m => getCuentaMonthValue(cuenta, m, "monto") || null),
          acum || null,
          pct,
          preTotal || null,
          rest,
        ]);
        gastoRow.height = 16;
        gastoRow.eachCell({ includeEmpty: true }, (cell, ci) => {
          cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
          cell.border = b;
          if (ci === 1) {
            cell.font      = { name: "Yu Gothic", size: 8, color: { argb: "FF9E9E9E" } };
            cell.alignment = { vertical: "middle", horizontal: "left", indent };
          } else if (ci === 16) {
            cell.font      = { ...this.font, bold: true };
            cell.numFmt    = "0%";
            cell.alignment = { vertical: "middle", horizontal: "right" };
          } else {
            cell.font      = { ...this.font };
            cell.numFmt    = "#,##0";
            cell.alignment = { vertical: "middle", horizontal: "right" };
          }
        });

        // Rojo en celdas de mes donde gasto > presupuesto o gasto < 0
        ASPEL_MONTHS.forEach((m, mi) => {
          const gasto  = getCuentaMonthValue(cuenta, m, "monto");
          const presup = getCuentaMonthValue(cuenta, m, "presup");
          if (gasto === 0) return;
          if (gasto < 0 || gasto > presup) {
            const cell = gastoRow.getCell(3 + mi); // col C = óndice 3
            cell.font = { name: "Yu Gothic", size: 10, bold: true, color: { argb: "FFCC0000" } };
            if (gasto > presup) {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF0F0" } };
            }
          }
        });
      }
    }

    const lastDataRow = ws.rowCount;

    // -- Fila totales presupuesto --
    const leaves    = cuentas.filter(c => !c.esFilaAgrupadora);
    const tPreMen   = leaves.reduce((s, c) => s + (getPresupuestoBaseMensual(c) || 0), 0);
    const tAcum     = leaves.reduce((s, c) => s + this.sumAll(c, "monto"), 0);
    const tPreTotal = leaves.reduce((s, c) => s + this.sumAll(c, "presup"), 0);
    const tPct      = tPreTotal > 0 ? tAcum / tPreTotal : null;
    const tRest     = tPreTotal - tAcum;

    const presupTotalRow = ws.addRow([
      "PRESUP. MES:",
      tPreMen || null,
      ...ASPEL_MONTHS.map(m => leaves.reduce((s, c) => s + getCuentaMonthValue(c, m, "presup"), 0) || null),
      tPreTotal || null, null, tPreTotal || null, null,
    ]);
    presupTotalRow.height = 16;
    presupTotalRow.eachCell({ includeEmpty: true }, (cell, ci) => {
      cell.font  = { name: "Yu Gothic", size: 9, bold: true, color: { argb: "FF5F7FA5" } };
      cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCE6F1" } };
      cell.border = b;
      if (ci === 1) {
        cell.alignment = { vertical: "middle", horizontal: "right" };
      } else {
        cell.numFmt    = "#,##0";
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }
    });

    // -- Fila totales gasto --
    const totalRow = ws.addRow([
      "TOTALES",
      tPreMen || null,
      ...ASPEL_MONTHS.map(m => leaves.reduce((s, c) => s + getCuentaMonthValue(c, m, "monto"), 0) || null),
      tAcum    || null,
      tPct,
      tPreTotal || null,
      tRest || null,
    ]);
    totalRow.height = 22;
    totalRow.eachCell({ includeEmpty: true }, (cell, ci) => {
      cell.font  = { name: "Yu Gothic", size: 10, bold: true, color: { argb: this.C.totalsFg } };
      cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.totalsBg } };
      cell.border = b;
      if (ci === 1) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      } else if (ci === 16) {
        cell.numFmt    = "0%";
        cell.alignment = { vertical: "middle", horizontal: "right" };
      } else {
        cell.numFmt    = "#,##0";
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }
    });

    // -- Formato condicional --
    if (lastDataRow >= DATA_START) {
      // % > 100 ? rojo
      ws.addConditionalFormatting({
        ref: `P${DATA_START}:P${lastDataRow}`,
        rules: [{
          type: "cellIs", operator: "greaterThan", formulae: [1], priority: 1,
          style: { font: { color: { argb: "FFCC0000" }, bold: true } },
        }],
      });
      // RESTANTE < 0 ? rojo
      ws.addConditionalFormatting({
        ref: `R${DATA_START}:R${lastDataRow}`,
        rules: [{
          type: "cellIs", operator: "lessThan", formulae: [0], priority: 1,
          style: {
            font: { color: { argb: "FFCC0000" }, bold: true },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF0F0" } },
          },
        }],
      });
    }
  }

  // --- SHEET: EXTRAORDINARIOS (605) ----------------------------------------
  // 14 columnas: CUENTA | ENEóDIC | ACUMULADO

  private buildExtSheet(
    wb: ExcelJS.Workbook,
    extraordinarias: CuentaAspelTercerNivelDTO[],
    empresa: string,
    year: number,
  ): void {
    const ws = wb.addWorksheet("Extraordinarios (605)");
    const b  = this.border();
    const NCOLS = 14;
    const lastCol = this.colLetter(NCOLS);

    ws.columns = [
      { key: "cuenta", width: 48 },
      ...ASPEL_MONTHS.map(m => ({ key: m, width: 11 })),
      { key: "acum", width: 13 },
    ];

    this.addTitleRow(ws, `GASTOS EXTRAORDINARIOS (605) é ${year}${empresa ? "  |  " + empresa.toUpperCase() : ""}`, lastCol, 1);
    this.addSubtitleRow(ws, lastCol, 2);
    this.addHeaderRow(ws, ["CUENTA", ...ASPEL_MONTHS.map(m => m.substring(0, 3).toUpperCase()), "ACUMULADO"], 3);

    ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];

    let evenIdx = 0;
    for (const cuenta of extraordinarias) {
      if (cuenta.esFilaAgrupadora) {
        const row = ws.addRow([
          `${cuenta.codigo_Cuenta}  |  ${cuenta.descripcion_Cuenta}`,
          ...Array(NCOLS - 1).fill(null),
        ]);
        row.height = 20;
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.font  = { name: "Yu Gothic", size: 9, bold: true, color: { argb: this.C.groupFg } };
          cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.groupBg } };
          cell.border = b;
        });
        row.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
      } else {
        evenIdx++;
        const acum = this.sumAll(cuenta, "monto");
        const row  = ws.addRow([
          cuenta.descripcion_Cuenta,
          ...ASPEL_MONTHS.map(m => getCuentaMonthValue(cuenta, m, "monto") || null),
          acum || null,
        ]);
        row.height = 16;
        const bgColor = evenIdx % 2 === 0 ? this.C.evenBg : "FFFFFFFF";
        row.eachCell({ includeEmpty: true }, (cell, ci) => {
          cell.font  = { ...this.font };
          cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
          cell.border = b;
          if (ci === 1) {
            cell.alignment = { vertical: "middle", horizontal: "left", indent: 2 };
          } else {
            cell.numFmt    = "#,##0";
            cell.alignment = { vertical: "middle", horizontal: "right" };
          }
        });
      }
    }

    // -- Totales --
    const leaves   = extraordinarias.filter(c => !c.esFilaAgrupadora);
    const totalRow = ws.addRow([
      "TOTALES",
      ...ASPEL_MONTHS.map(m => leaves.reduce((s, c) => s + getCuentaMonthValue(c, m, "monto"), 0) || null),
      leaves.reduce((s, c) => s + this.sumAll(c, "monto"), 0) || null,
    ]);
    totalRow.height = 22;
    totalRow.eachCell({ includeEmpty: true }, (cell, ci) => {
      cell.font  = { name: "Yu Gothic", size: 10, bold: true, color: { argb: this.C.totalsFg } };
      cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.totalsBg } };
      cell.border = b;
      if (ci === 1) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      } else {
        cell.numFmt    = "#,##0";
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }
    });
  }

  // --- SHEET: RESUMEN EJECUTIVO ---------------------------------------------

  private buildResumen(
    wb: ExcelJS.Workbook,
    cuentas: CuentaAspelTercerNivelDTO[],
    extraordinarias: CuentaAspelTercerNivelDTO[],
    proyectos: CuentaAspelTercerNivelDTO[],
    empresa: string,
    year: number,
  ): void {
    const ws = wb.addWorksheet("Resumen Ejecutivo");
    const b  = this.border();

    ws.columns = [
      { key: "a", width: 34 },
      { key: "b", width: 18 },
      { key: "c", width: 18 },
      { key: "d", width: 18 },
      { key: "e", width: 13 },
    ];

    // -- Cabecera --
    ws.addRow([`RESUMEN EJECUTIVO  |  EJERCICIO FISCAL ${year}`]);
    ws.mergeCells("A1:E1");
    ws.getRow(1).height = 28;
    this.applyTitleStyle(ws.getRow(1).getCell(1), true, 13);

    if (empresa) {
      ws.addRow([empresa.toUpperCase()]);
      ws.mergeCells("A2:E2");
      ws.getRow(2).height = 18;
      const c2 = ws.getRow(2).getCell(1);
      c2.font      = { name: "Yu Gothic", size: 10, color: { argb: this.C.titleFg } };
      c2.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2A4D73" } };
      c2.alignment = { vertical: "middle", horizontal: "center" };
    }
    ws.addRow([]);

    // -- KPIs --
    const allLeaves = [
      ...cuentas.filter(c => !c.esFilaAgrupadora),
      ...extraordinarias.filter(c => !c.esFilaAgrupadora),
      ...proyectos.filter(c => !c.esFilaAgrupadora),
    ];
    const totalPresupuesto = allLeaves.reduce((s, c) => s + this.sumAll(c, "presup"), 0);
    const totalGasto       = allLeaves.reduce((s, c) => s + this.sumAll(c, "monto"), 0);
    const pctEjercido      = totalPresupuesto > 0 ? totalGasto / totalPresupuesto : 0;
    const totalRestante    = totalPresupuesto - totalGasto;

    this.addSectionHeader(ws, "INDICADORES CLAVE DE DESEMPEíO", "A", "E");

    const kpis: [string, number | null, string][] = [
      ["Presupuesto Total Anual",    totalPresupuesto, "#,##0"],
      ["Gasto Total Ejercido",       totalGasto,       "#,##0"],
      ["% del Presupuesto Ejercido", pctEjercido,      "0.0%"],
      ["Presupuesto Restante",       totalRestante,    "#,##0"],
    ];

    kpis.forEach(([label, value, fmt], idx) => {
      const row = ws.addRow([label, value]);
      row.height = 20;
      const isEven = idx % 2 === 1;
      const bg     = isEven ? this.C.evenBg : "FFFFFFFF";

      row.getCell(1).font      = { name: "Yu Gothic", size: 10, bold: true };
      row.getCell(1).fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      row.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
      row.getCell(1).border    = b;

      row.getCell(2).font      = { name: "Yu Gothic", size: 11 };
      row.getCell(2).numFmt    = fmt;
      row.getCell(2).fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      row.getCell(2).alignment = { vertical: "middle", horizontal: "right" };
      row.getCell(2).border    = b;

      // Colorear alertas
      if (idx === 2 && pctEjercido > 1) {
        row.getCell(2).font = { name: "Yu Gothic", size: 11, bold: true, color: { argb: "FFCC0000" } };
      }
      if (idx === 3 && totalRestante < 0) {
        row.getCell(2).font = { name: "Yu Gothic", size: 11, bold: true, color: { argb: "FFCC0000" } };
      }
    });

    ws.addRow([]);

    // -- Top 5 desviaciones --
    this.addSectionHeader(ws, "TOP 5 CUENTAS CON MAYOR SOBREGASTO", "A", "E");
    this.addSmallHeader(ws, ["CUENTA", "PRESUPUESTO", "GASTO", "EXCEDIDO", "% EXCEDIDO"]);

    const top5 = allLeaves
      .map(c => ({
        cuenta:  c.descripcion_Cuenta,
        presup:  this.sumAll(c, "presup"),
        gasto:   this.sumAll(c, "monto"),
        excedido: this.sumAll(c, "monto") - this.sumAll(c, "presup"),
      }))
      .filter(x => x.excedido > 0 && x.presup > 0)
      .sort((a, z) => z.excedido - a.excedido)
      .slice(0, 5);

    if (top5.length === 0) {
      const noData = ws.addRow(["Sin cuentas con sobregasto en el periodo."]);
      ws.mergeCells(`A${noData.number}:E${noData.number}`);
      noData.getCell(1).font      = { name: "Yu Gothic", size: 9, italic: true, color: { argb: "FF607D8B" } };
      noData.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    } else {
      top5.forEach((item, idx) => {
        const row = ws.addRow([
          item.cuenta,
          item.presup,
          item.gasto,
          item.excedido,
          item.presup > 0 ? item.excedido / item.presup : null,
        ]);
        row.height = 16;
        const bg = idx % 2 === 1 ? this.C.evenBg : "FFFFFFFF";
        row.eachCell({ includeEmpty: true }, (cell, ci) => {
          cell.font  = { name: "Yu Gothic", size: 9 };
          cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
          cell.border = b;
          cell.alignment = ci === 1
            ? { vertical: "middle", horizontal: "left" }
            : { vertical: "middle", horizontal: "right" };
          if (ci > 1 && ci < 5) cell.numFmt = "#,##0";
          if (ci === 5)          cell.numFmt = "0%";
        });
        row.getCell(4).font = { name: "Yu Gothic", size: 9, bold: true, color: { argb: "FFCC0000" } };
        row.getCell(5).font = { name: "Yu Gothic", size: 9, bold: true, color: { argb: "FFCC0000" } };
      });
    }

    ws.addRow([]);

    // -- Resumen por mes --
    this.addSectionHeader(ws, "RESUMEN DE GASTOS POR MES", "A", "E");
    this.addSmallHeader(ws, ["MES", "PRESUPUESTO", "GASTO", "DIFERENCIA", "% EJERCIDO"]);

    ASPEL_MONTHS.forEach((mes, idx) => {
      const presup = allLeaves.reduce((s, c) => s + getCuentaMonthValue(c, mes, "presup"), 0);
      const gasto  = allLeaves.reduce((s, c) => s + getCuentaMonthValue(c, mes, "monto"), 0);
      const diff   = presup - gasto;
      const pct    = presup > 0 ? gasto / presup : null;

      const row = ws.addRow([
        mes.charAt(0).toUpperCase() + mes.slice(1),
        presup || null,
        gasto  || null,
        diff !== 0 ? diff : null,
        pct,
      ]);
      row.height = 16;
      const bg = idx % 2 === 1 ? this.C.evenBg : "FFFFFFFF";
      row.eachCell({ includeEmpty: true }, (cell, ci) => {
        cell.font  = { name: "Yu Gothic", size: 9 };
        cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
        cell.border = b;
        if (ci === 1) {
          cell.font      = { name: "Yu Gothic", size: 9, bold: true };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        } else if (ci === 5) {
          cell.numFmt    = "0%";
          cell.alignment = { vertical: "middle", horizontal: "right" };
        } else {
          cell.numFmt    = "#,##0";
          cell.alignment = { vertical: "middle", horizontal: "right" };
        }
      });
      if (pct !== null && pct > 1) {
        row.getCell(3).font = { name: "Yu Gothic", size: 9, bold: true, color: { argb: "FFCC0000" } };
        row.getCell(5).font = { name: "Yu Gothic", size: 9, bold: true, color: { argb: "FFCC0000" } };
      }
    });

    // Fila total anual
    const totalMes = ws.addRow([
      "TOTAL ANUAL",
      totalPresupuesto || null,
      totalGasto       || null,
      totalRestante    || null,
      pctEjercido      || null,
    ]);
    totalMes.height = 22;
    totalMes.eachCell({ includeEmpty: true }, (cell, ci) => {
      cell.font  = { name: "Yu Gothic", size: 10, bold: true, color: { argb: this.C.totalsFg } };
      cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.totalsBg } };
      cell.border = b;
      if (ci === 1) {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      } else if (ci === 5) {
        cell.numFmt    = "0%";
        cell.alignment = { vertical: "middle", horizontal: "right" };
      } else {
        cell.numFmt    = "#,##0";
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }
    });
  }

  // --- HELPERS --------------------------------------------------------------

  private addTitleRow(ws: ExcelJS.Worksheet, text: string, lastCol: string, rowNum: number): void {
    ws.addRow([text]);
    ws.mergeCells(`A${rowNum}:${lastCol}${rowNum}`);
    const row = ws.getRow(rowNum);
    row.height = 26;
    this.applyTitleStyle(row.getCell(1), true, 12);
  }

  private addSubtitleRow(ws: ExcelJS.Worksheet, lastCol: string, rowNum: number): void {
    const dateStr = new Date().toLocaleDateString("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    ws.addRow([`Generado el ${dateStr}`]);
    ws.mergeCells(`A${rowNum}:${lastCol}${rowNum}`);
    const row = ws.getRow(rowNum);
    row.height = 13;
    const cell = row.getCell(1);
    cell.font      = { name: "Yu Gothic", size: 8, italic: true, color: { argb: "FF607D8B" } };
    cell.alignment = { horizontal: "right", vertical: "middle" };
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEF2F7" } };
  }

  private addHeaderRow(ws: ExcelJS.Worksheet, headers: string[], rowNum: number): void {
    ws.addRow(headers);
    const row = ws.getRow(rowNum);
    row.height = 26;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font      = { name: "Yu Gothic", size: 9, bold: true, color: { argb: this.C.headerFg } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.headerBg } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border    = this.border();
    });
  }

  private addSectionHeader(ws: ExcelJS.Worksheet, label: string, from: string, to: string): void {
    const row = ws.addRow([label]);
    ws.mergeCells(`${from}${row.number}:${to}${row.number}`);
    row.height = 20;
    row.getCell(1).font      = { name: "Yu Gothic", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    row.getCell(1).fill      = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.sectionBg } };
    row.getCell(1).alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  }

  private addSmallHeader(ws: ExcelJS.Worksheet, labels: string[]): void {
    const row = ws.addRow(labels);
    row.height = 18;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font      = { name: "Yu Gothic", size: 9, bold: true, color: { argb: this.C.headerFg } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: this.C.headerBg } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border    = this.border();
    });
  }

  private applyTitleStyle(cell: ExcelJS.Cell, bold: boolean, size = 12, bg = this.C.titleBg): void {
    cell.font      = { name: "Yu Gothic", size, bold, color: { argb: this.C.titleFg } };
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  }

  private border(): Partial<ExcelJS.Borders> {
    const c = this.C.border;
    return {
      top:    { style: "thin", color: { argb: c } },
      left:   { style: "thin", color: { argb: c } },
      bottom: { style: "thin", color: { argb: c } },
      right:  { style: "thin", color: { argb: c } },
    };
  }

  private borderLight(): Partial<ExcelJS.Borders> {
    const c = this.C.border;
    return {
      top:   { style: "thin",  color: { argb: c } },
      left:  { style: "thin",  color: { argb: c } },
      right: { style: "thin",  color: { argb: c } },
      bottom:{ style: "hair",  color: { argb: c } },
    };
  }

  private sumAll(cuenta: CuentaAspelTercerNivelDTO, prefix: "monto" | "presup"): number {
    return ASPEL_MONTHS.reduce((s, m) => s + getCuentaMonthValue(cuenta, m, prefix), 0);
  }

  private colLetter(n: number): string {
    let s = "";
    let num = n;
    while (num > 0) {
      num--;
      s = String.fromCharCode(65 + (num % 26)) + s;
      num = Math.floor(num / 26);
    }
    return s;
  }

  private newWorkbook(): ExcelJS.Workbook {
    const wb   = new ExcelJS.Workbook();
    wb.creator = "LuxuryApp";
    wb.created = new Date();
    return wb;
  }
}

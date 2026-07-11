const fs = require("fs");

const tsPath =
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.ts";
let tsCode = fs.readFileSync(tsPath, "utf8");

tsCode = tsCode.replace(
  /selectedFiscalYear: number = new Date\(\)\.getFullYear\(\) - 1;/g,
  "selectedFiscalYear: number = new Date().getFullYear();",
);
tsCode = tsCode.replace(
  /baseBudgetYear: number = new Date\(\)\.getFullYear\(\);/g,
  "baseBudgetYear: number = this.selectedFiscalYear - 1;",
);
tsCode = tsCode.replace(
  /this\.fiscalYear = this\.selectedFiscalYear;/g,
  "this.fiscalYear = this.selectedFiscalYear;\n    this.baseBudgetYear = this.selectedFiscalYear - 1;",
);

tsCode = tsCode.replace(
  /`Ocultar Mensual 2025`/g,
  "`Ocultar Mensual ${this.baseBudgetYear}`",
);
tsCode = tsCode.replace(
  /`Mostrar Mensual 2025`/g,
  "`Mostrar Mensual ${this.baseBudgetYear}`",
);
tsCode = tsCode.replace(
  /`Ocultar Anual 2025`/g,
  "`Ocultar Anual ${this.baseBudgetYear}`",
);
tsCode = tsCode.replace(
  /`Mostrar Anual 2025`/g,
  "`Mostrar Anual ${this.baseBudgetYear}`",
);

fs.writeFileSync(tsPath, tsCode, "utf8");

const htmlPath =
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
let htmlCode = fs.readFileSync(htmlPath, "utf8");

htmlCode = htmlCode.replace(
  /\(onChange\)="onFiscalYearChange\(\)"/g,
  '(ngModelChange)="onFiscalYearChange()"',
);
htmlCode = htmlCode.replace(
  /PSTO \(2025\) MENSUAL/g,
  "PSTO ({{ baseBudgetYear }}) MENSUAL",
);
htmlCode = htmlCode.replace(
  /PSTO \(2025\) ANUAL/g,
  "PSTO ({{ baseBudgetYear }}) ANUAL",
);
htmlCode = htmlCode.replace(
  /PSTO \(2026\) MENSUAL/g,
  "PSTO ({{ fiscalYear }}) MENSUAL",
);
htmlCode = htmlCode.replace(
  /PSTO \(2026\) ANUAL/g,
  "PSTO ({{ fiscalYear }}) ANUAL",
);
htmlCode = htmlCode.replace(/Proyección 2026/g, "Proyección {{ fiscalYear }}");
htmlCode = htmlCode.replace(
  /Proyecci\u00f3n 2026/g,
  "Proyección {{ fiscalYear }}",
); // Just in case it was encoded

fs.writeFileSync(htmlPath, htmlCode, "utf8");

const pathAudit =
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/budget-audit-dialog.ts";
let codeAudit = fs.readFileSync(pathAudit, "utf8");
codeAudit = codeAudit.replace(
  /2025/g,
  "${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear - 1 || new Date().getFullYear() - 1}",
);
codeAudit = codeAudit.replace(
  /2026/g,
  "${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear || new Date().getFullYear()}",
);
fs.writeFileSync(pathAudit, codeAudit, "utf8");

const pathForecast =
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/budget-forecast-dialog.ts";
let codeForecast = fs.readFileSync(pathForecast, "utf8");
codeForecast = codeForecast.replace(
  /2025/g,
  "${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear - 1 || new Date().getFullYear() - 1}",
);
fs.writeFileSync(pathForecast, codeForecast, "utf8");

console.log("Clean fixes applied!");

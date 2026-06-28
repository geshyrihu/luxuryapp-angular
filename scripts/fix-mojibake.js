const fs = require('fs');

const tsPath = "D:/repos/luxuryapp-api/client/angular/.claude/worktrees/agent-ab5cf9e81ea94a3b9/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.ts";
let tsCode = fs.readFileSync(tsPath, 'utf8');

tsCode = tsCode.replace(/selectedFiscalYear: number = new Date\(\)\.getFullYear\(\) - 1;/g, "selectedFiscalYear: number = new Date().getFullYear();");
tsCode = tsCode.replace(/baseBudgetYear: number = new Date\(\)\.getFullYear\(\);/g, "baseBudgetYear: number = this.selectedFiscalYear - 1;");
tsCode = tsCode.replace(/this\.fiscalYear = this\.selectedFiscalYear;/g, "this.fiscalYear = this.selectedFiscalYear;\n    this.baseBudgetYear = this.selectedFiscalYear - 1;");

tsCode = tsCode.replace(/ðŸ¤–/g, "🤖");
tsCode = tsCode.replace(/ðŸ“ˆ/g, "📈");
tsCode = tsCode.replace(/ðŸ‘ ï¸ /g, "👁️");
tsCode = tsCode.replace(/ðŸ™ˆ/g, "🙈");

tsCode = tsCode.replace(/`Ocultar Mensual 2025`/g, "`Ocultar Mensual ${this.baseBudgetYear}`");
tsCode = tsCode.replace(/`Mostrar Mensual 2025`/g, "`Mostrar Mensual ${this.baseBudgetYear}`");
tsCode = tsCode.replace(/`Ocultar Anual 2025`/g, "`Ocultar Anual ${this.baseBudgetYear}`");
tsCode = tsCode.replace(/`Mostrar Anual 2025`/g, "`Mostrar Anual ${this.baseBudgetYear}`");

fs.writeFileSync(tsPath, tsCode, 'utf8');

const htmlPath = "D:/repos/luxuryapp-api/client/angular/.claude/worktrees/agent-ab5cf9e81ea94a3b9/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
let htmlCode = fs.readFileSync(htmlPath, 'utf8');

htmlCode = htmlCode.replace(/\(2025\)/g, "({{ baseBudgetYear }})");
htmlCode = htmlCode.replace(/\(2026\)/g, "({{ fiscalYear }})");
htmlCode = htmlCode.replace(/Proyección 2026/g, "Proyección {{ fiscalYear }}");
htmlCode = htmlCode.replace(/Proyecci\u00f3n 2026/g, "Proyección {{ fiscalYear }}"); // handle exact byte matches if needed

fs.writeFileSync(htmlPath, htmlCode, 'utf8');

console.log("Fixes applied.");

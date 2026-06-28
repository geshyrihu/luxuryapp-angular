const fs = require('fs');

// Fix TS
const tsPath = "D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.ts";
let tsCode = fs.readFileSync(tsPath, 'utf8');

// Logic fixes (without touching comments)
tsCode = tsCode.replace(/selectedFiscalYear: number = new Date\(\)\.getFullYear\(\) - 1;/g, "selectedFiscalYear: number = new Date().getFullYear();");
tsCode = tsCode.replace(/baseBudgetYear: number = new Date\(\)\.getFullYear\(\);/g, "baseBudgetYear: number = this.selectedFiscalYear - 1;");
tsCode = tsCode.replace(/this\.fiscalYear = this\.selectedFiscalYear;/g, "this.fiscalYear = this.selectedFiscalYear;\n    this.baseBudgetYear = this.selectedFiscalYear - 1;");

// Button getters fix (replacing exactly the string literal with template string)
tsCode = tsCode.replace(/"Ocultar Mensual 2025"/g, "`Ocultar Mensual ${this.baseBudgetYear}`");
tsCode = tsCode.replace(/"Mostrar Mensual 2025"/g, "`Mostrar Mensual ${this.baseBudgetYear}`");
tsCode = tsCode.replace(/"Ocultar Anual 2025"/g, "`Ocultar Anual ${this.baseBudgetYear}`");
tsCode = tsCode.replace(/"Mostrar Anual 2025"/g, "`Mostrar Anual ${this.baseBudgetYear}`");
tsCode = tsCode.replace(/"Ocultar Anual 2026"/g, "`Ocultar Anual ${this.fiscalYear}`");
tsCode = tsCode.replace(/"Mostrar Anual 2026"/g, "`Mostrar Anual ${this.fiscalYear}`");

fs.writeFileSync(tsPath, tsCode, 'utf8');

// Fix HTML
const htmlPath = "D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
let htmlCode = fs.readFileSync(htmlPath, 'utf8');

htmlCode = htmlCode.replace(/\(onChange\)="onFiscalYearChange\(\)"/g, '(ngModelChange)="onFiscalYearChange()"');
htmlCode = htmlCode.replace(/PSTO \(2025\) MENSUAL/g, "PSTO ({{ baseBudgetYear }}) MENSUAL");
htmlCode = htmlCode.replace(/PSTO \(2025\) ANUAL/g, "PSTO ({{ baseBudgetYear }}) ANUAL");
htmlCode = htmlCode.replace(/PSTO \(2026\) MENSUAL/g, "PSTO ({{ fiscalYear }}) MENSUAL");
htmlCode = htmlCode.replace(/PSTO \(2026\) ANUAL/g, "PSTO ({{ fiscalYear }}) ANUAL");
htmlCode = htmlCode.replace(/Proyección 2026/g, "Proyección {{ fiscalYear }}");

// Add forecast classes to tr
const trTarget = `      <tr
        [class.fila-nivel-2-hoja]="item.nivelCuenta === 2 && !item.esFilaAgrupadora"
        [class.fila-nivel-3-hoja]="item.nivelCuenta === 3 && !item.esFilaAgrupadora"
      >`;
const trReplacement = `      <tr
        [class.fila-nivel-2-hoja]="item.nivelCuenta === 2 && !item.esFilaAgrupadora"
        [class.fila-nivel-3-hoja]="item.nivelCuenta === 3 && !item.esFilaAgrupadora"
        [class.fila-deficit]="isDeficit(item)"
        [class.fila-alerta-incremento]="isHighIncrease(item)"
      >`;
htmlCode = htmlCode.replace(trTarget, trReplacement);

// Better button styling
htmlCode = htmlCode.replace(/class="surface-card border-1 surface-border border-round-md p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer hover:surface-hover transition-colors transition-duration-150"/g,
    'class="bg-white shadow-1 hover:shadow-3 border-1 border-gray-200 border-round-xl p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer transition-all transition-duration-200"');
htmlCode = htmlCode.replace(/class="surface-card border-1 surface-border border-round-md p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer hover:surface-hover"/g,
    'class="bg-white shadow-1 hover:shadow-3 border-1 border-gray-200 border-round-xl p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer transition-all transition-duration-200"');
htmlCode = htmlCode.replace(/class="surface-card border-1 border-blue-200 border-round-md p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer hover:bg-blue-50 transition-colors transition-duration-150"/g,
    'class="bg-blue-50 hover:bg-blue-100 shadow-1 hover:shadow-3 border-1 border-blue-200 border-round-xl p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer transition-all transition-duration-200"');
htmlCode = htmlCode.replace(/class="surface-card border-1 border-green-300 border-round-md p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer hover:bg-green-50 transition-colors transition-duration-150"/g,
    'class="bg-green-50 hover:bg-green-100 shadow-1 hover:shadow-3 border-1 border-green-300 border-round-xl p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer transition-all transition-duration-200"');
htmlCode = htmlCode.replace(/class="surface-card border-1 border-orange-300 border-round-md p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer hover:bg-orange-50 transition-colors transition-duration-150"/g,
    'class="bg-orange-50 hover:bg-orange-100 shadow-1 hover:shadow-3 border-1 border-orange-300 border-round-xl p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer transition-all transition-duration-200"');

fs.writeFileSync(htmlPath, htmlCode, 'utf8');
console.log("Done");

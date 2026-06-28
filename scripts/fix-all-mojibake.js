const fs = require('fs');

function fixMojibake(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const replacements = {
        'AÃ±o': 'Año',
        'aÃ±o': 'año',
        'Ã±': 'ñ',
        'Ã‘': 'Ñ',
        'Ã¡': 'á',
        'Ã©': 'é',
        'Ã­': 'í',
        'Ã³': 'ó',
        'Ãº': 'ú',
        'Ã ': 'Á',
        'Ã‰': 'É',
        'Ã ': 'Í',
        'Ã“': 'Ó',
        'Ãš': 'Ú',
        'bÃ³squeda': 'búsqueda',
        'lÃ³nea': 'línea',
        'mÃ³nimo': 'mínimo',
        'Auditoróa': 'Auditoría', // From previous mis-replacement
        'ðŸ ·ï¸ ': '🏷️',
        'âš™ï¸ ': '⚙️',
        'ðŸ‘ ï¸ ': '👁️',
        'ðŸ™ˆ': '🙈',
        'ðŸ¤–': '🤖',
        'ðŸ“ˆ': '📈',
        'Proyeccin': 'Proyección',
        'Auditora': 'Auditoría',
        'Ao': 'Año',
        'ao': 'año',
        'Tambin': 'También',
        'caf': 'café',
        'Aqu': 'Aquí',
        'bsqueda': 'búsqueda',
        'mnimo': 'mínimo',
        'lnea': 'línea',
        'acompae': 'acompañe',
        '??': '👁️'
    };

    for (const [bad, good] of Object.entries(replacements)) {
        // We use split and join to replace all occurrences because replaceAll might not be available in older Node
        content = content.split(bad).join(good);
    }
    
    // Some TS specific exact replacements for the emojis
    content = content.replace(/return this\.showBaseBudgetMonthlyColumn\(\) \? ".*" : "🙈";/g, 'return this.showBaseBudgetMonthlyColumn() ? "👁️" : "🙈";');
    content = content.replace(/return this\.showBaseBudgetAnnualColumn\(\) \? ".*" : "🙈";/g, 'return this.showBaseBudgetAnnualColumn() ? "👁️" : "🙈";');
    content = content.replace(/return this\.showFiscalYearAnnualColumn\(\) \? ".*" : "🙈";/g, 'return this.showFiscalYearAnnualColumn() ? "👁️" : "🙈";');
    content = content.replace(/return this\.showProjectedExpenses\(\) \? ".*" : "🙈";/g, 'return this.showProjectedExpenses() ? "👁️" : "🙈";');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
}

const htmlPath = "D:/repos/luxuryapp-api/client/angular/.claude/worktrees/agent-ab5cf9e81ea94a3b9/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
const tsPath = "D:/repos/luxuryapp-api/client/angular/.claude/worktrees/agent-ab5cf9e81ea94a3b9/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.ts";

fixMojibake(htmlPath);
fixMojibake(tsPath);


const fs = require('fs');

const pathAudit = "D:/repos/luxuryapp-api/client/angular/.claude/worktrees/agent-ab5cf9e81ea94a3b9/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/budget-audit-dialog.ts";
let codeAudit = fs.readFileSync(pathAudit, 'utf8');
codeAudit = codeAudit.replace(/2025/g, "${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear - 1 || new Date().getFullYear() - 1}");
codeAudit = codeAudit.replace(/2026/g, "${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear || new Date().getFullYear()}");
fs.writeFileSync(pathAudit, codeAudit, 'utf8');

const pathForecast = "D:/repos/luxuryapp-api/client/angular/.claude/worktrees/agent-ab5cf9e81ea94a3b9/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/budget-forecast-dialog.ts";
let codeForecast = fs.readFileSync(pathForecast, 'utf8');
codeForecast = codeForecast.replace(/2025/g, "${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear - 1 || new Date().getFullYear() - 1}");
fs.writeFileSync(pathForecast, codeForecast, 'utf8');

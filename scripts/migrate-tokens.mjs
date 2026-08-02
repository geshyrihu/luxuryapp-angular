// ═══════════════════════════════════════════════════════════════════════
// 🔄 migrate-tokens.mjs — Codemod de nomenclatura de tokens (RN-DS-001)
// ═══════════════════════════════════════════════════════════════════════
// Reemplaza el uso de tokens legacy por los canónicos CTI en el código de
// la aplicación (scss/css/ts/html). Los tokens legacy permanecen como
// aliases en `theme/_variables.scss` durante 1 release de compatibilidad.
//
// Uso:
//   node scripts/migrate-tokens.mjs                      # dry-run + reporte
//   node scripts/migrate-tokens.mjs --apply              # aplica cambios
//   node scripts/migrate-tokens.mjs --apply --report=out.json
//
// Seguridad:
//   - No toca `theme/_variables.scss` (fuente de los aliases).
//   - No toca artefactos generados (`documentation.json`).
//   - Reemplaza solo `var(--legacy)` / `var(--legacy, fallback)`,
//     nunca definiciones de token en `:root`.
// ═══════════════════════════════════════════════════════════════════════

import fs from 'fs/promises';
import path from 'path';
import { globSync } from 'glob';

// Mapeo legacy → canónico (valores idénticos: alias 1 release)
const MIGRATIONS = {
  // Spacing (T04)
  '--ds-spacing-1': '--ds-space-xs',   // 4px
  '--ds-spacing-2': '--ds-space-sm',   // 8px
  '--ds-spacing-3': '--ds-space-md',   // 12px
  '--ds-spacing-4': '--ds-space-lg',   // 16px
  '--ds-spacing-6': '--ds-space-xl',   // 24px
  '--ds-spacing-8': '--ds-space-2xl',  // 32px
  '--ds-spacing-12': '--ds-space-3xl', // 48px
  // Tipografía (T05)
  '--ds-font-size-display': '--ds-type-display-lg',
  '--ds-font-size-page-title': '--ds-type-display-md',
  '--ds-font-size-section-title': '--ds-type-headline-lg',
  '--ds-font-size-card-title': '--ds-type-headline-md',
  '--ds-font-size-metric': '--ds-type-title-lg',
  '--ds-font-size-body': '--ds-type-body-lg',
  '--ds-font-size-table': '--ds-type-body-md',
  '--ds-font-size-help': '--ds-type-body-sm',
  '--ds-font-size-label': '--ds-type-label-lg',
  '--ds-font-size-micro': '--ds-type-label-md',
};

// Archivos excluidos: fuente de aliases + artefactos generados
const SKIP_FILES = [
  'src/styles/theme/_variables.scss',
  'documentation.json',
];

const FILE_GLOB = 'src/**/*.{scss,css,ts,html}';

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildReplacer(oldToken, newToken) {
  const re = new RegExp(`var\\(${escapeRegExp(oldToken)}([),])`, 'g');
  return (content) => content.replace(re, `var(${newToken}$1`);
}

async function run() {
  const apply = process.argv.includes('--apply');
  const reportFlag = process.argv.find((a) => a.startsWith('--report='));
  const reportPath = reportFlag ? reportFlag.split('=')[1] : null;

  const files = globSync(FILE_GLOB, { ignore: 'node_modules/**' });
  const report = [];
  let totalReplacements = 0;

  for (const file of files) {
    if (SKIP_FILES.some((s) => file.includes(s))) continue;

    const content = await fs.readFile(file, 'utf-8');
    let updated = content;
    const fileChanges = { file, replacements: {} };
    let fileTotal = 0;

    for (const [oldToken, newToken] of Object.entries(MIGRATIONS)) {
      const replace = buildReplacer(oldToken, newToken);
      const before = updated;
      updated = replace(updated);
      const count = (before.match(new RegExp(`var\\(${escapeRegExp(oldToken)}([),])`, 'g')) || []).length;
      if (count > 0) {
        fileChanges.replacements[`${oldToken} → ${newToken}`] = count;
        fileTotal += count;
        totalReplacements += count;
      }
    }

    if (fileTotal > 0) {
      report.push({ ...fileChanges, total: fileTotal });
      if (apply) await fs.writeFile(file, updated, 'utf-8');
    }
  }

  // Reporte
  const summary = {
    generated: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    filesTouched: report.length,
    totalReplacements,
    migrations: MIGRATIONS,
    report,
  };

  if (reportPath) {
    await fs.writeFile(reportPath, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`📄 Reporte escrito en ${reportPath}`);
  } else {
    console.log(`🔄 Migración de tokens (${apply ? 'APLICADA' : 'DRY-RUN'})`);
    console.log('─'.repeat(72));
    if (report.length === 0) {
      console.log('Sin usos legacy detectados. Todo limpio.');
    } else {
      for (const f of report) {
        console.log(`\n📁 ${f.file}  (${f.total} cambios)`);
        for (const [k, v] of Object.entries(f.replacements)) {
          console.log(`   ${v}x  ${k}`);
        }
      }
    }
    console.log('\n' + '─'.repeat(72));
    console.log(
      `Resumen: ${summary.filesTouched} archivos · ${summary.totalReplacements} reemplazos (${summary.mode})`
    );
  }
}

run().catch((err) => {
  console.error('Error fatal durante la migración:', err);
  process.exit(1);
});

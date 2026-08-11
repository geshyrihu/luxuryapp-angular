// ═════════════════════════════════════════════════════════════════════
// 🔍 audit-token-refs.mjs — Referencias de tokens (RN-DS-035 + RN-DS-007)
// ═════════════════════════════════════════════════════════════════════
// Comprobación 1 (BLOQUEANTE): todo var(--ds-*) referenciado en
//   src/app/shared/ui/** debe estar definido en src/styles/**. Es el único
//   alcance cerrado del DS; un huérfano aquí rompe el gate.
// Comprobación 1b (REPORTE, no bloqueante): todo var(--ds-*) referenciado
//   en src/app/** completo. Los huérfanos fuera de shared/ui son deuda de
//   módulos de negocio (RN-DS-026): se reportan, no se amplía el DS para
//   silenciarlos. No afecta el exit code.
// Comprobación 2 (BLOQUEANTE): ningún var(--…, <fallback>) dentro de
//   src/app/shared/ui/** (RN-DS-007 prohíbe fallbacks).
//
// Uso: node scripts/audit-token-refs.mjs
// Exit 0 solo si las comprobaciones bloqueantes pasan.
// ═════════════════════════════════════════════════════════════════════

import fs from 'fs';
import { globSync } from 'glob';

const SCOPE = 'src/app/shared/ui/**'; // alcance cerrado del DS (RN-DS-024/026)

function read(f) {
  return fs.readFileSync(f, 'utf-8');
}

// Conjunto de tokens --ds-* DEFINIDOS en src/styles
const styleFiles = globSync('src/styles/**/*.{scss,css}', { ignore: 'node_modules/**' });
const defined = new Set();
for (const f of styleFiles) {
  const c = read(f);
  const re = /--(ds-[\w-]+)\s*:/g;
  let m;
  while ((m = re.exec(c)) !== null) defined.add(m[1]);
}

// Tokens --ds-* REFERENCIADOS en un conjunto de archivos
function refsIn(files) {
  const set = new Set();
  for (const f of files) {
    const re = /var\(\s*--(ds-[\w-]+)/g;
    let m;
    const c = read(f);
    while ((m = re.exec(c)) !== null) set.add(m[1]);
  }
  return set;
}

const sharedFiles = globSync(`${SCOPE}/*.{ts,html,scss}`, { ignore: 'node_modules/**' });
const appFiles = globSync('src/app/**/*.{ts,html,scss}', { ignore: 'node_modules/**' });

const referencedShared = refsIn(sharedFiles);
const referencedAll = refsIn(appFiles);

const orphansShared = [...referencedShared].filter((t) => !defined.has(t)).sort();
const orphansAll = [...referencedAll].filter((t) => !defined.has(t)).sort();
// Huérfanos fuera del alcance cerrado (reportados, no bloquean)
const orphansOutOfScope = orphansAll.filter((t) => !orphansShared.includes(t)).sort();

// Comprobación 2 — fallbacks en shared/ui (escaneo con paréntesis balanceados)
function countFallbacks(text) {
  let count = 0;
  let i = 0;
  while (i < text.length) {
    const idx = text.indexOf('var(', i);
    if (idx === -1) break;
    let j = idx + 4;
    while (j < text.length && /\s/.test(text[j])) j++;
    let k = j;
    while (k < text.length && /[\w-]/.test(text[k])) k++;
    while (k < text.length && /\s/.test(text[k])) k++;
    if (text[k] === ',') count++;
    let depth = 1;
    let m = k;
    while (m < text.length && depth > 0) {
      if (text[m] === '(') depth++;
      else if (text[m] === ')') {
        depth--;
        if (depth === 0) break;
      }
      m++;
    }
    i = m + 1;
  }
  return count;
}
let fallbacks = 0;
const fallbackSamples = [];
for (const f of sharedFiles) {
  const n = countFallbacks(read(f));
  if (n > 0) {
    fallbacks += n;
    if (fallbackSamples.length < 10) fallbackSamples.push(`${f}: ${n}`);
  }
}

// ── Reporte ───────────────────────────────────────────────────────────
console.log('🔍 Auditoría de referencias de tokens (RN-DS-035 / RN-DS-007)\n');

console.log(`📌 Comprobación 1b (REPORTE, fuera de alcance — no bloquea): ${orphansOutOfScope.length} tokens --ds-* huérfanos en src/app/** fuera de ${SCOPE}:`);
for (const o of orphansOutOfScope) console.log(`   · ${o}`);
console.log('');

if (orphansShared.length === 0) {
  console.log(`✅ Comprobación 1 (BLOQUEANTE): 0 tokens --ds-* huérfanos en ${SCOPE} (de ${referencedShared.size} referenciados, ${defined.size} definidos).`);
} else {
  console.error(`❌ Comprobación 1 (BLOQUEANTE): ${orphansShared.length} tokens --ds-* huérfanos en ${SCOPE}:`);
  for (const o of orphansShared) console.error(`   - ${o}`);
}

if (fallbacks === 0) {
  console.log('✅ Comprobación 2: 0 fallbacks en src/app/shared/ui (RN-DS-007).');
} else {
  console.error(`❌ Comprobación 2: ${fallbacks} fallbacks vivos en src/app/shared/ui (RN-DS-007).`);
  for (const s of fallbackSamples) console.error(`   · ${s}`);
}

const blockingOk = orphansShared.length === 0 && fallbacks === 0;
console.log(`\n${blockingOk ? '✅' : '🚨'} Auditoría ${blockingOk ? 'superada (bloqueantes)' : 'fallida (bloqueantes)'}.`);
console.log(`   Nota: ${orphansOutOfScope.length} huérfano(s) fuera de alcance reportado(s) en modo REPORTE (RN-DS-026).`);
process.exit(blockingOk ? 0 : 1);

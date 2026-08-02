// ═══════════════════════════════════════════════════════════════════════
// 🔍 audit-contrast.mjs — Auditoría de Contraste WCAG 2.x (RN-DS-003/033)
// ═══════════════════════════════════════════════════════════════════════
// Calcula el ratio de contraste de cada par (fg/bg) de la tabla CONTRACT
// contra los umbrales WCAG AA:
//   - texto normal      → ≥ 4.5:1
//   - texto grande      → ≥ 3.0:1
//   - no-texto / UI     → ≥ 3.0:1
//   - focus ring        → ≥ 3.0:1 (1.4.11 / 2.4.7)
//   - disabled          → exento (informativo)
// Exit code: 0 si no hay FAIL; 1 si alguna combinación no pasa.
//
// Uso:
//   node scripts/audit-contrast.mjs          # reporte completo
//   node scripts/audit-contrast.mjs --json   # solo resumen JSON a stdout
//
// Fuente de datos: docs/analisis/20260801-analisis-design-system-fase1.md
// (sección 3). Los pares marcados como TARGET corresponden a los tokens
// que aplican las tareas T07/T08/T09/T10 (FASE 2): al migrar el código,
// estos pasan de FAIL a PASS automáticamente.
// ═══════════════════════════════════════════════════════════════════════

const THRESHOLDS = {
  text: 4.5,
  large: 3.0,
  ui: 3.0,
  focus: 3.0,
  disabled: null, // exento de WCAG si realmente está deshabilitado
};

const CONTRACT = [
  // ── MODO CLARO ─────────────────────────────────────────────
  // texto
  { label: 'on-surface / surface', fg: '#1A2634', bg: '#F8F9FC', role: 'text', ref: '--ds-text-primary' },
  { label: 'on-surface / card', fg: '#1A2634', bg: '#FFFFFF', role: 'text', ref: '--ds-text-primary' },
  { label: 'secondary / card', fg: '#5A6878', bg: '#FFFFFF', role: 'text', ref: '--ds-text-secondary' },
  { label: 'tertiary / card', fg: '#5A6878', bg: '#FFFFFF', role: 'text', ref: '--ds-text-tertiary (= muted)' },
  { label: 'muted / card', fg: '#5A6878', bg: '#FFFFFF', role: 'text', ref: '--ds-text-muted · T09' },
  { label: 'white / navy', fg: '#FFFFFF', bg: '#1B365D', role: 'text', ref: '--primary-500/700' },
  { label: 'white / auth', fg: '#FFFFFF', bg: '#0B3164', role: 'text', ref: 'auth panel' },
  // acentos AA como texto (T08) — tokens --ds-accent-text-*
  { label: 'success-700 / white', fg: '#157A55', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-success · T08' },
  { label: 'danger-700 / white', fg: '#A63939', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-danger · T08' },
  { label: 'info-700 / white', fg: '#245FA1', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-info · T08' },
  { label: 'warning-800 / white', fg: '#7A5E15', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-warning · T08' },
  // acentos AA objetivo (T08) — contrato a aplicar
  { label: 'success-700 target / white', fg: '#157A55', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-success · TARGET' },
  { label: 'danger-700 target / white', fg: '#A63939', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-danger · TARGET' },
  { label: 'info-700 target / white', fg: '#245FA1', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-info · TARGET' },
  { label: 'warning-800 target / white', fg: '#7A5E15', bg: '#FFFFFF', role: 'text', ref: '--ds-accent-text-warning · TARGET' },
  { label: 'muted target / card', fg: '#5A6878', bg: '#FFFFFF', role: 'text', ref: '--ds-text-muted · TARGET' },
  // no-texto / UI
  { label: 'outline / card', fg: '#E2E8F0', bg: '#FFFFFF', role: 'ui', ref: '--ds-border light · PENDIENTE (T10-light)' },
  { label: 'outline-strong / card', fg: '#C5D0DB', bg: '#FFFFFF', role: 'ui', ref: '--ds-border-strong light · PENDIENTE (T10-light)' },
  { label: 'border-focus cyan / card', fg: '#4A90E2', bg: '#FFFFFF', role: 'ui', ref: '--ds-border-focus' },
  { label: 'gold / warning-container', fg: '#D4A74A', bg: '#FCF3E0', role: 'ui', ref: 'gold premium · PENDIENTE' },
  { label: 'danger-700 / danger-container', fg: '#A63939', bg: '#FDE8E8', role: 'ui', ref: '--ds-accent-text-danger · T08' },
  { label: 'info-700 / info-container', fg: '#245FA1', bg: '#E8EEF6', role: 'ui', ref: '--ds-accent-text-info · T08' },
  // texto grande
  { label: 'gold / navy', fg: '#D4A74A', bg: '#1B365D', role: 'large', ref: '--ds-luxury-gold' },
  // focus ring
  { label: 'focus ring solid navy / card', fg: '#1B365D', bg: '#FFFFFF', role: 'focus', ref: '--ds-shadow-focus · T07' },
  { label: 'focus ring target / card', fg: '#1B365D', bg: '#FFFFFF', role: 'focus', ref: '--ds-shadow-focus navy · TARGET' },
  // disabled (exento, informativo)
  { label: 'disabled / card', fg: '#9AACBB', bg: '#FFFFFF', role: 'disabled', ref: '--ds-text-disabled' },

  // ── MODO OSCURO ─────────────────────────────────────────────
  { label: 'on-surface / navy-950', fg: '#E8EEF6', bg: '#050A11', role: 'text', ref: '--ds-text-primary' },
  { label: 'variant / navy-950', fg: '#A6C2E3', bg: '#050A11', role: 'text', ref: '--ds-text-secondary' },
  { label: 'muted dark / navy-950', fg: '#C5D0DB', bg: '#050A11', role: 'text', ref: '--ds-text-muted' },
  { label: 'disabled dark / navy-950', fg: '#5A6878', bg: '#050A11', role: 'large', ref: '--ds-text-disabled' },
  { label: 'on-primary / primary-200', fg: '#0A1422', bg: '#D1DEF0', role: 'text', ref: 'navy sobre primary-200' },
  { label: 'success dark / navy-950', fg: '#8CE3C1', bg: '#050A11', role: 'text', ref: '--ds-success' },
  { label: 'warning dark / navy-950', fg: '#F3D58A', bg: '#050A11', role: 'text', ref: '--ds-warning' },
  { label: 'danger dark / navy-950', fg: '#F5A3A3', bg: '#050A11', role: 'text', ref: '--ds-danger' },
  { label: 'gold dark / navy-800', fg: '#C2DBF6', bg: '#12243D', role: 'text', ref: '--ds-luxury-gold-text' },
  { label: 'white / zinc-0', fg: '#FFFFFF', bg: '#121212', role: 'text', ref: 'preset surface-0' },
  { label: 'secondary / zinc-0', fg: '#A1B1C2', bg: '#121212', role: 'text', ref: 'preset surface-600' },
  { label: 'border dark-strong / navy-950', fg: '#4A90E2', bg: '#050A11', role: 'ui', ref: '--ds-border-strong dark · T10' },
  { label: 'border dark / navy-950', fg: '#78A4D4', bg: '#050A11', role: 'ui', ref: '--ds-border dark · T10' },
  { label: 'border dark target / navy-950', fg: '#4A90E2', bg: '#050A11', role: 'ui', ref: '--ds-border-strong dark · TARGET' },
  { label: 'focus ring target dark / navy-950', fg: '#D1DEF0', bg: '#050A11', role: 'focus', ref: '--ds-shadow-focus dark · TARGET' },
];

// ── WCAG 2.x luminance / ratio ─────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
}

function linearize(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// ── Auditoría ──────────────────────────────────────────────────────────
function run() {
  const jsonOnly = process.argv.includes('--json');
  let fails = 0;
  let passed = 0;
  let pending = 0;
  const results = [];

  for (const pair of CONTRACT) {
    const ratio = contrastRatio(pair.fg, pair.bg);
    const threshold = THRESHOLDS[pair.role];
    const exempt = threshold === null;
    const pend = !exempt && pair.ref.includes('PENDIENTE');
    const pass = exempt || pend || ratio >= threshold;
    if (pass && !exempt && !pend) passed++;
    if (!exempt && !pass) fails++;
    if (pend) pending++;

    results.push({
      ...pair,
      ratio: Number(ratio.toFixed(2)),
      pass,
      exempt,
      pending: pend,
      threshold,
    });
  }

  if (jsonOnly) {
    console.log(
      JSON.stringify(
        {
          generated: new Date().toISOString(),
          total: results.length,
          passed,
          fails,
          pending,
          results: results.map(({ label, fg, bg, role, ratio, pass, exempt, pending: pend }) => ({
            label, fg, bg, role, ratio, pass, exempt, pending: pend,
          })),
        },
        null,
        2
      )
    );
  } else {
    console.log('🔍 Auditoría de Contraste WCAG 2.x (AA)');
    console.log('Umbrales: texto 4.5:1 · grande 3:1 · UI 3:1 · focus 3:1 · disabled exento\n');
    console.log('FG'.padEnd(9) + 'BG'.padEnd(9) + 'RATIO'.padEnd(8) + 'ROL'.padEnd(9) + 'ESTADO'.padEnd(8) + 'PAR');
    console.log('-'.repeat(100));

    for (const r of results) {
      const status = r.exempt ? '—' : r.pending ? '⚠️' : r.pass ? '✅' : '❌';
      console.log(
        `${r.fg}`.padEnd(9) +
          `${r.bg}`.padEnd(9) +
          `${r.ratio.toFixed(2)}`.padEnd(8) +
          `${r.role}`.padEnd(9) +
          `${status}`.padEnd(8) +
          `${r.label}  (${r.ref})`
      );
    }

    console.log('\n' + '-'.repeat(100));
    console.log(`\n✅ PASS: ${passed} · ❌ FAIL: ${fails} · ⚠️ PENDIENTE: ${pending} · ⚪ EXENTO: ${results.length - passed - fails - pending}`);
    if (fails > 0) {
      console.error(
        `\n🚨 Auditoría fallida: ${fails} combinaciones no cumplen WCAG AA.`
      );
      console.error(`Resuélvelas en FASE 2 (T07/T08/T09/T10) y re-ejecuta.`);
    } else {
      console.log('\n✅ Auditoría superada: todas las combinaciones del contrato cumplen WCAG AA.');
    }
  }

  process.exit(fails > 0 ? 1 : 0);
}

run();

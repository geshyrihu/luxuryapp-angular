// ═══════════════════════════════════════════════════════════════════════
// 🔍 audit-contrast.mjs — Auditoría de Contraste WCAG 2.x (RN-DS-003/023/033)
// ═══════════════════════════════════════════════════════════════════════
// Diferencia clave vs la versión anterior: NO usa una tabla de colores
// hardcodeada. Compila styles/theme/_variables.scss con `sass`, extrae los
// --ds-* (y --primary-*, --surface-dark-*) REALES resueltos de :root y
// body.theme-dark, y evalúa los pares de la tabla PAIRS contra ESOS valores.
// (Plan de Unificación de Color — Ancla única #003152, 2026-08-09 · T1.2)
//
// Uso:
//   node scripts/audit-contrast.mjs          # reporte completo
//   node scripts/audit-contrast.mjs --json   # solo resumen JSON a stdout
// ═══════════════════════════════════════════════════════════════════════

import * as sass from 'sass';
import path from 'path';

const THRESHOLDS = {
  text: 4.5,
  large: 3.0,
  ui: 3.0,
  focus: 3.0,
  disabled: null, // exento de WCAG si realmente está deshabilitado
};

// ── Compilar el partial de variables a CSS ───────────────────────────────
const ENTRY = path.resolve('src/styles/theme/_variables.scss');
const compiled = sass
  .compile(ENTRY, { loadPaths: [path.resolve('src/styles')], style: 'expanded' })
  .css;

// ── Extracción por barrido de líneas con control de profundidad ──────────
// Recorre el CSS compilado línea a línea; registra solo las declaraciones
// directas (profundidad 1) de `:root` y `body.theme-dark`, ignorando el
// contenido de bloques anidados (@media / @supports / @container).
function collectTokens(css) {
  const light = {};
  const dark = {};
  let depth = 0;
  let active = null; // 'light' | 'dark' | null
  for (const raw of css.split('\n')) {
    const line = raw.trim();
    const opens = (line.match(/{/g) || []).length;
    const closes = (line.match(/}/g) || []).length;

    // ¿Esta línea abre un bloque de interés?
    if (opens > 0) {
      if (depth === 0 && line.startsWith(':root')) active = 'light';
      else if (depth === 0 && line.startsWith('body.theme-dark')) active = 'dark';
      else if (depth === 0) active = null;
    }

    // Declaración directa (profundidad 1) dentro del bloque activo
    if (depth === 1 && active && line.startsWith('--') && line.includes(':')) {
      const m = line.match(/^--([\w-]+)\s*:\s*(.+?)\s*;?$/);
      if (m) {
        const val = m[2].replace(/\/\*[\s\S]*?\*\//g, '').replace(/;\s*$/, '').trim();
        (active === 'light' ? light : dark)[m[1]] = val;
      }
    }

    depth += opens - closes;
    if (depth === 0) active = null;
  }
  return { light, dark };
}

const { light: lightMap, dark: darkMapRaw } = collectTokens(compiled);
const darkMap = { ...lightMap, ...darkMapRaw };

// ── Resolución de var() (multi-paso) ─────────────────────────────────────
function resolve(token, map) {
  let v = map[token];
  if (v == null) return null;
  const seen = new Set();
  while (typeof v === 'string') {
    const mm = v.match(/var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/);
    if (!mm) break;
    if (seen.has(v)) break;
    seen.add(v);
    const next = map[mm[1].replace(/^--/, '')];
    if (next == null) {
      v = mm[2] != null ? mm[2].trim() : v;
      break;
    }
    v = next;
  }
  return typeof v === 'string' ? v.trim() : v;
}

function toHex(value) {
  if (!value) return null;
  const v = value.trim();
  if (/^#([0-9a-fA-F]{3,8})$/.test(v)) return v;
  // color-mix / rgba / hsl no se evalúan; se ignoran como no-resolubles
  return null;
}

// ── Pares a validar (fg/bg → nombre de token O hex literal) ───────────────
// Solo declara QUÉ pares validar y con qué umbral; los colores salen del CSS.
const PAIRS = [
  // ── MODO CLARO ──
  { label: 'text-primary / surface', fg: '--ds-text-primary', bg: '--ds-bg-surface', role: 'text' },
  { label: 'text-secondary / surface', fg: '--ds-text-secondary', bg: '--ds-bg-surface', role: 'text' },
  { label: 'text-muted / surface', fg: '--ds-text-muted', bg: '--ds-bg-surface', role: 'text' },
  { label: 'text-link / surface', fg: '--ds-text-link', bg: '--ds-bg-surface', role: 'text' },
  { label: 'on-primary / primary', fg: '--ds-on-primary', bg: '--ds-primary', role: 'text' },
  { label: 'accent-text-success / white', fg: '--ds-accent-text-success', bg: '#ffffff', role: 'text' },
  { label: 'accent-text-danger / white', fg: '--ds-accent-text-danger', bg: '#ffffff', role: 'text' },
  { label: 'accent-text-info / white', fg: '--ds-accent-text-info', bg: '#ffffff', role: 'text' },
  { label: 'accent-text-warning / white', fg: '--ds-accent-text-warning', bg: '#ffffff', role: 'text' },
  { label: 'border / surface (decorativo, exento 1.4.11)', fg: '--ds-border', bg: '--ds-bg-surface', role: 'disabled' },
  { label: 'border-control / surface', fg: '--ds-border-control', bg: '--ds-bg-surface', role: 'ui' },
  { label: 'border-strong / surface', fg: '--ds-border-strong', bg: '--ds-bg-surface', role: 'ui' },
  { label: 'border-focus / surface', fg: '--ds-border-focus', bg: '--ds-bg-surface', role: 'focus' },
  { label: 'gold / primary-700', fg: '--ds-luxury-gold', bg: '#003152', role: 'large' },

  // ── Paleta categórica (RN-DS-036 · Sprint 3 T3.1) ──
  { label: 'on-cat / cat-1', fg: '--ds-on-cat', bg: '--ds-cat-1', role: 'text' },
  { label: 'on-cat / cat-2', fg: '--ds-on-cat', bg: '--ds-cat-2', role: 'text' },
  { label: 'on-cat / cat-3', fg: '--ds-on-cat', bg: '--ds-cat-3', role: 'text' },
  { label: 'on-cat / cat-4', fg: '--ds-on-cat', bg: '--ds-cat-4', role: 'text' },
  { label: 'on-cat / cat-5', fg: '--ds-on-cat', bg: '--ds-cat-5', role: 'text' },
  { label: 'on-cat / cat-6', fg: '--ds-on-cat', bg: '--ds-cat-6', role: 'text' },
  { label: 'on-cat / cat-7', fg: '--ds-on-cat', bg: '--ds-cat-7', role: 'text' },
  { label: 'on-cat / cat-8', fg: '--ds-on-cat', bg: '--ds-cat-8', role: 'text' },

  // ── MODO OSCURO ──
  { label: 'dark: text-primary / surface', fg: '--ds-text-primary', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: text-secondary / surface', fg: '--ds-text-secondary', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: text-muted / surface', fg: '--ds-text-muted', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: text-link / surface', fg: '--ds-text-link', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: on-primary / primary', fg: '--ds-on-primary', bg: '--ds-primary', role: 'text', dark: true },
  { label: 'dark: success / surface', fg: '--ds-success', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: danger / surface', fg: '--ds-danger', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: info / surface', fg: '--ds-info', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: warning / surface', fg: '--ds-warning', bg: '--ds-bg-surface', role: 'text', dark: true },
  { label: 'dark: border / surface', fg: '--ds-border', bg: '--ds-bg-surface', role: 'ui', dark: true },
  { label: 'dark: border-strong / surface', fg: '--ds-border-strong', bg: '--ds-bg-surface', role: 'ui', dark: true },
  { label: 'dark: border-control / surface', fg: '--ds-border-control', bg: '--ds-bg-surface', role: 'ui', dark: true },
  { label: 'dark: border-focus / surface', fg: '--ds-border-focus', bg: '--ds-bg-surface', role: 'focus', dark: true },

  // ── Paleta categórica dark (RN-DS-036 · Sprint 3 T3.1) ──
  { label: 'dark: on-cat / cat-1', fg: '--ds-on-cat', bg: '--ds-cat-1', role: 'text', dark: true },
  { label: 'dark: on-cat / cat-2', fg: '--ds-on-cat', bg: '--ds-cat-2', role: 'text', dark: true },
  { label: 'dark: on-cat / cat-3', fg: '--ds-on-cat', bg: '--ds-cat-3', role: 'text', dark: true },
  { label: 'dark: on-cat / cat-4', fg: '--ds-on-cat', bg: '--ds-cat-4', role: 'text', dark: true },
  { label: 'dark: on-cat / cat-5', fg: '--ds-on-cat', bg: '--ds-cat-5', role: 'text', dark: true },
  { label: 'dark: on-cat / cat-6', fg: '--ds-on-cat', bg: '--ds-cat-6', role: 'text', dark: true },
  { label: 'dark: on-cat / cat-7', fg: '--ds-on-cat', bg: '--ds-cat-7', role: 'text', dark: true },
  { label: 'dark: on-cat / cat-8', fg: '--ds-on-cat', bg: '--ds-cat-8', role: 'text', dark: true },
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
  let unresolved = 0;
  const results = [];

  for (const p of PAIRS) {
    const map = p.dark ? darkMap : lightMap;
    const fgRaw = p.fg.startsWith('#') ? p.fg : resolve(p.fg.replace(/^--/, ''), map);
    const bgRaw = p.bg.startsWith('#') ? p.bg : resolve(p.bg.replace(/^--/, ''), map);
    const fg = toHex(fgRaw);
    const bg = toHex(bgRaw);
    if (!fg || !bg) {
      unresolved++;
      results.push({ ...p, ratio: null, pass: false, unresolved: true });
      continue;
    }
    const ratio = contrastRatio(fg, bg);
    const threshold = THRESHOLDS[p.role];
    const exempt = threshold === null;
    const pass = exempt || ratio >= threshold;
    if (pass && !exempt) passed++;
    if (!exempt && !pass) fails++;
    results.push({ ...p, ratio: Number(ratio.toFixed(2)), pass, exempt, unresolved: false, threshold });
  }

  if (jsonOnly) {
    console.log(JSON.stringify({ total: results.length, passed, fails, unresolved, results }, null, 2));
  } else {
    console.log('🔍 Auditoría de Contraste WCAG 2.x (AA) — valores reales desde _variables.scss');
    console.log('Umbrales: texto 4.5:1 · grande 3:1 · UI 3:1 · focus 3:1 · disabled exento\n');
    console.log('FG'.padEnd(9) + 'BG'.padEnd(9) + 'RATIO'.padEnd(8) + 'ROL'.padEnd(9) + 'ESTADO'.padEnd(8) + 'PAR');
    console.log('-'.repeat(100));
    for (const r of results) {
      const status = r.unresolved ? '❓' : r.pass ? '✅' : '❌';
      const fg = (r.fg.startsWith('#') ? r.fg : resolve(r.fg.replace(/^--/, ''), r.dark ? darkMap : lightMap)) || '?';
      const bg = (r.bg.startsWith('#') ? r.bg : resolve(r.bg.replace(/^--/, ''), r.dark ? darkMap : lightMap)) || '?';
      console.log(
        `${fg}`.padEnd(9) +
          `${bg}`.padEnd(9) +
          `${r.ratio != null ? r.ratio.toFixed(2) : 'n/a'}`.padEnd(8) +
          `${r.role}`.padEnd(9) +
          `${status}`.padEnd(8) +
          `${r.label}`,
      );
    }
    console.log('\n' + '-'.repeat(100));
    console.log(`\n✅ PASS: ${passed} · ❌ FAIL: ${fails} · ❓ SIN RESOLVER: ${unresolved}`);
    if (fails > 0) {
      console.error(`\n🚨 Auditoría fallida: ${fails} combinaciones no cumplen WCAG AA (valores reales).`);
    } else if (unresolved > 0) {
      console.error(`\n⚠️ Auditoría con ${unresolved} pares no resolubles (color-mix/rgba). Revisa los tokens.`);
    } else {
      console.log('\n✅ Auditoría superada: todas las combinaciones cumplen WCAG AA (valores reales).');
    }
  }

  // Falla si hay combinaciones que no pasan; los no resueltos no bloquean (información).
  process.exit(fails > 0 ? 1 : 0);
}

run();

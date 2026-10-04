// ============================================================
// Fase 2 codemod — rename web/** app-* -> lux-*-web  (+ residuos lux-*)
// Uso:  node scripts/fase2-rename.mjs [--dry-run]
// Idempotente. Solo codigo en src/.
//
// Reglas:
//   web/**                          app-<x>  -> lux-<x>-web
//   primitives|inputs|charts|ai-chat-widget|image-analysis-dialog
//                                   app-<x>  -> lux-<x>
//   mobile/**                       NO SE TOCA
//   directivas [attr] / no app-*    NO SE TOCAN
//   adaptive/icon/ (wrapper muerto) se ELIMINA (selector lux-icon, 0 usos)
// ============================================================
import { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rmdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const UI = path.join(SRC, "app", "shared", "ui");
const DRY = process.argv.includes("--dry-run");

const report = { filesTouched: new Set(), counters: {} };
function bump(k, n = 1) { report.counters[k] = (report.counters[k] || 0) + n; }
function rel(f) { return f.slice(ROOT.length + 1).split(path.sep).join("/"); }

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (["node_modules", ".git", ".kilo"].includes(e.name)) continue; walk(full, out); }
    else out.push(full);
  }
  return out;
}

function edit(file, transform) {
  const before = readFileSync(file, "utf8");
  const after = transform(before);
  if (after !== before) { report.filesTouched.add(rel(file)); if (!DRY) writeFileSync(file, after, "utf8"); return true; }
  return false;
}

// --- 1) recolectar mapas de selectores app-* ---
const WEB = path.join(UI, "web");
const NONWEB_DIRS = [
  path.join(UI, "primitives"),
  path.join(UI, "inputs"),
  path.join(UI, "charts"),
  path.join(UI, "ai-chat-widget"),
  path.join(UI, "image-analysis-dialog"),
];

function collectAppSelectors(dir, stripDirSuffix) {
  const map = new Map(); // app-<x> -> lux-<x>[-web]
  for (const f of walk(dir)) {
    if (!f.endsWith(".ts") || f.endsWith(".spec.ts")) continue;
    const content = readFileSync(f, "utf8");
    // matchAll: un archivo puede declarar VARIOS @Component (varios selectores app-*)
    const re = /selector:\s*["'](app-[a-z0-9-]+)["']/g;
    for (const m of content.matchAll(re)) {
      const old = m[1];
      let nu = old.replace(/^app-/, "lux-");
      if (stripDirSuffix) nu = nu + "-web";
      map.set(old, nu);
    }
  }
  return map;
}

function collectExistingTargets(dir, stripDirSuffix) {
  const map = new Map();
  for (const f of walk(dir)) {
    if (!f.endsWith(".ts") || f.endsWith(".spec.ts")) continue;
    const content = readFileSync(f, "utf8");
    const re = stripDirSuffix
      ? /selector:\s*["'](lux-[a-z0-9-]+-web)["']/g
      : /selector:\s*["'](lux-[a-z0-9-]+)["']/g;
    for (const m of content.matchAll(re)) {
      const target = m[1];
      const base = stripDirSuffix ? target.slice(0, -4) : target;
      map.set(`app-${base.slice(4)}`, target);
    }
  }
  return map;
}

const webMap = collectAppSelectors(WEB, true);
const nonWebMap = new Map();
for (const d of NONWEB_DIRS) for (const [k, v] of collectAppSelectors(d, false)) nonWebMap.set(k, v);
// Merge-state recovery: main may already contain renamed selectors while some
// reorganized templates still use old app-* tags. Recover mapping from target
// selectors so those references are repaired too.
for (const [k, v] of collectExistingTargets(WEB, true)) if (!webMap.has(k)) webMap.set(k, v);
for (const d of NONWEB_DIRS) {
  for (const [k, v] of collectExistingTargets(d, false)) if (!nonWebMap.has(k)) nonWebMap.set(k, v);
}

// --- 2) detectar colisiones y solapamientos ---
const all = new Map();
const collisions = [];
for (const [k, v] of [...webMap, ...nonWebMap]) {
  if (all.has(v) && all.get(v) !== k) collisions.push(`${v} <- ${all.get(v)} & ${k}`);
  all.set(v, k);
}
// colision con selectores ya existentes lux-*
// EXCLUYE el wrapper muerto adaptive/icon (se elimina en esta fase) -> libera lux-icon.
const DEAD_ICON = path.join(UI, "adaptive", "icon", "icon.ts");
const existing = new Set();
for (const f of walk(UI)) {
  if (!f.endsWith(".ts") || f.endsWith(".spec.ts")) continue;
  if (f === DEAD_ICON) continue;
  const content = readFileSync(f, "utf8");
  for (const m of content.matchAll(/selector:\s*["'](lux-[a-z0-9-]+)["']/g)) existing.add(m[1]);
}
const renamedTargets = new Set([...webMap.values(), ...nonWebMap.values()]);
for (const [nu, old] of all) {
  if (existing.has(nu) && !renamedTargets.has(nu)) collisions.push(`${nu} ya existe (para ${old})`);
}
// colision con adaptive/icon lux-icon
if (all.has("lux-icon") && all.get("lux-icon") === "app-icon") {
  // se resuelve borrando el wrapper muerto adaptive/icon
  report.counters["nota lux-icon: wrapper adaptive/icon se elimina"] = 1;
}
if (collisions.length) {
  console.error("COLISIONES:");
  for (const c of [...new Set(collisions)]) console.error("  " + c);
  process.exit(2);
}

const finalMap = new Map([...webMap, ...nonWebMap]);
report.counters["selectores web (sufijo -web)"] = webMap.size;
report.counters["selectores non-web (sin sufijo)"] = nonWebMap.size;

// --- 3) reescribir archivos ---
const TEXT_EXT = new Set([".ts", ".html"]);
const SKIP = new Set(["src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/shared/ui-dictionary.ts"]);
const FILES = walk(SRC).filter((f) => TEXT_EXT.has(path.extname(f)) && !SKIP.has(rel(f)));

for (const f of FILES) {
  edit(f, (txt) => {
    let out = txt;
    // ordenar por longitud descendente para evitar prefijos (app-tab vs app-tab-bar)
    const entries = [...finalMap.entries()].sort((a, b) => b[0].length - a[0].length);
    for (const [o, n] of entries) {
      out = out.replace(new RegExp(`<${o}(?=[\\s/>])`, "g"), () => { bump(`tag ${o}→${n}`); return `<${n}`; });
      out = out.replace(new RegExp(`</${o}\\s*>`, "g"), () => { bump(`tag ${o}→${n}`); return `</${n}>`; });
      // selector (solo en .ts de definicion; seguro en cualquier .ts)
      out = out.replace(new RegExp(`(selector:\\s*)(["'])${o}\\2`, "g"), (_m, pre, q) => { bump(`selector ${o}→${n}`); return `${pre}${q}${n}${q}`; });
    }
    return out;
  });
}

// --- 4) eliminar wrapper muerto adaptive/icon/ ---
const deadIcon = path.join(UI, "adaptive", "icon");
if (existsSync(deadIcon)) {
  const iconTs = path.join(deadIcon, "icon.ts");
  if (existsSync(iconTs)) {
    report.counters["elimina wrapper muerto adaptive/icon/icon.ts"] = 1;
    if (!DRY) unlinkSync(iconTs);
  }
  try { if (!DRY && readdirSync(deadIcon).length === 0) rmdirSync(deadIcon); } catch { /* noop */ }
}

console.log(DRY ? "=== DRY-RUN (sin escribir) ===" : "=== APLICADO ===");
console.log("Archivos tocados:", report.filesTouched.size);
for (const k of Object.keys(report.counters).sort()) console.log(`  ${k}: ${report.counters[k]}`);

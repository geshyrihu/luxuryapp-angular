// ============================================================
// Fase 1 codemod — rename mecanico adaptive/primitives/core
// Uso:  node scripts/fase1-rename.mjs [--dry-run]
// Idempotente. Solo codigo en src/ (no docs/strings/iconos).
//
// Transformaciones:
//   A) alias  @ui/base/   -> @ui/core/
//   B) alias  @ui/shared/ -> @ui/primitives/
//   C) imports RELATIVOS resueltos contra la ubicacion real del archivo;
//      solo se reescriben si el destino cae bajo las carpetas movidas:
//        shared/ui/base/**        -> shared/ui/core/**
//        shared/ui/inputs/base/** -> shared/ui/inputs/core/**
//        shared/ui/shared/**      -> shared/ui/primitives/**
//   D) selector adaptive  lx-*  -> lux-*
//   E) selector primitives app-* -> lux-*
//   F) mover carpetas (al final).
// ============================================================
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const UI = path.join(SRC, "app", "shared", "ui");
const DRY = process.argv.includes("--dry-run");

const report = { filesTouched: new Set(), counters: {} };
function bump(k, n = 1) { report.counters[k] = (report.counters[k] || 0) + n; }
function rel(f) { return f.slice(ROOT.length + 1).split(path.sep).join("/"); }

// Definicion de carpetas movidas: oldAbsPrefix -> newAbsPrefix
const MOVES = [
  { old: path.join(UI, "base"), new: path.join(UI, "core") },
  { old: path.join(UI, "inputs", "base"), new: path.join(UI, "inputs", "core") },
  { old: path.join(UI, "shared"), new: path.join(UI, "primitives") },
];
// Orden de aplicacion (mas especifico primero): inputs/base antes que base.
const MOVES_RESOLVE = [...MOVES].sort((a, b) => b.old.length - a.old.length);

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

function collectSelectors(dir, prefix) {
  const map = new Map();
  for (const f of walk(dir)) {
    if (!f.endsWith(".ts") || f.endsWith(".spec.ts")) continue;
    const m = readFileSync(f, "utf8").match(new RegExp(`selector:\\s*["'](${prefix}-[a-z0-9-]+)["']`));
    if (m) map.set(m[1], m[1].replace(new RegExp(`^${prefix}-`), "lux-"));
  }
  return map;
}

const adaptiveMap = collectSelectors(path.join(UI, "adaptive"), "lx");
const primitiveMap = collectSelectors(path.join(UI, "shared"), "app");

const collisions = [];
for (const [, aNew] of adaptiveMap) for (const [, pNew] of primitiveMap) if (aNew === pNew) collisions.push(aNew);
if (collisions.length) { console.error("COLISIONES:", [...new Set(collisions)].join(", ")); process.exit(2); }

// Reescribe un specifier de import relativo si su destino resuelto cae en una carpeta movida.
function rewriteRelativeSpecifier(spec, fromFile) {
  if (!spec.startsWith(".")) return null; // solo relativos
  const fromDir = path.dirname(fromFile);
  const targetAbs = path.resolve(fromDir, spec);
  // Normaliza a un path "pre-move" para comparar contra los prefijos old.
  // targetAbs puede ser un archivo o carpeta (sin extension).
  for (const mv of MOVES_RESOLVE) {
    const oldPrefix = mv.old + path.sep;
    if (targetAbs.startsWith(oldPrefix) || targetAbs === mv.old) {
      const remainder = targetAbs.slice(mv.old.length); // empieza con sep o vacio
      const newAbs = mv.new + remainder;
      let newRel = path.relative(fromDir, newAbs).split(path.sep).join("/");
      if (!newRel.startsWith(".")) newRel = "./" + newRel;
      return newRel;
    }
  }
  return null;
}

const IMPORT_RE = /(from\s+|import\s*\()(["'])(\.[^"']*)\2/g;

const TEXT_EXT = new Set([".ts", ".html"]);
const SKIP = new Set(["src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/shared/ui-dictionary.ts"]);
const FILES = walk(SRC).filter((f) => TEXT_EXT.has(path.extname(f)) && !SKIP.has(rel(f)));

for (const f of FILES) {
  edit(f, (txt) => {
    let out = txt;
    // A) @ui/base/ -> @ui/core/
    out = out.replace(/(["'])@ui\/base\//g, (_m, q) => { bump("alias @ui/base→@ui/core"); return `${q}@ui/core/`; });
    // B) @ui/shared/ -> @ui/primitives/
    out = out.replace(/(["'])@ui\/shared\//g, (_m, q) => { bump("alias @ui/shared→@ui/primitives"); return `${q}@ui/primitives/`; });
    // C) relativos: resolver contra ubicacion real
    out = out.replace(IMPORT_RE, (whole, kw, q, spec) => {
      const rewritten = rewriteRelativeSpecifier(spec, f);
      if (!rewritten) return whole;
      bump(`rel ${spec}→${rewritten}`);
      return `${kw}${q}${rewritten}${q}`;
    });
    // D) adaptive lx-* -> lux-*  (cierre tolera espacios/saltos antes de '>')
    for (const [o, n] of adaptiveMap) {
      out = out.replace(new RegExp(`<${o}(?=[\\s/>])`, "g"), () => { bump(`tag ${o}→${n}`); return `<${n}`; });
      out = out.replace(new RegExp(`</${o}\\s*>`, "g"), () => { bump(`tag ${o}→${n}`); return `</${n}>`; });
      out = out.replace(new RegExp(`selector:\\s*(["'])${o}\\1`, "g"), () => { bump(`selector ${o}→${n}`); return `selector: "${n}"`; });
    }
    // E) primitives app-* -> lux-*
    for (const [o, n] of primitiveMap) {
      out = out.replace(new RegExp(`<${o}(?=[\\s/>])`, "g"), () => { bump(`tag ${o}→${n}`); return `<${n}`; });
      out = out.replace(new RegExp(`</${o}\\s*>`, "g"), () => { bump(`tag ${o}→${n}`); return `</${n}>`; });
      out = out.replace(new RegExp(`selector:\\s*(["'])${o}\\1`, "g"), () => { bump(`selector ${o}→${n}`); return `selector: "${n}"`; });
    }
    return out;
  });
}

function moveDir(from, to) {
  if (!existsSync(from)) return;
  report.counters[`mover ${path.relative(UI, from)} → ${path.relative(UI, to)}`] = 1;
  if (!DRY) { if (existsSync(to)) throw new Error(`Destino ya existe: ${to}`); mkdirSync(path.dirname(to), { recursive: true }); renameSync(from, to); }
}
moveDir(path.join(UI, "base"), path.join(UI, "core"));
moveDir(path.join(UI, "inputs", "base"), path.join(UI, "inputs", "core"));
moveDir(path.join(UI, "shared"), path.join(UI, "primitives"));

console.log(DRY ? "=== DRY-RUN (sin escribir) ===" : "=== APLICADO ===");
console.log("Archivos tocados:", report.filesTouched.size);
for (const k of Object.keys(report.counters).sort()) console.log(`  ${k}: ${report.counters[k]}`);

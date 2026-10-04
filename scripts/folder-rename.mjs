// ============================================================
// Fase 1b codemod — SOLO renombres de carpeta sobre main
// Uso:  node scripts/folder-rename.mjs [--dry-run]
// Idempotente. Solo codigo en src/.
//
// Contexto: origin/main YA migro los selectores adaptive lx-*->lux-*
// y primitives app-*->lux-*. Esta fase aplica UNICAMENTE los
// renombres de carpeta que main no tiene:
//   shared/ui/base/**        -> shared/ui/core/**
//   shared/ui/inputs/base/** -> shared/ui/inputs/core/**
//   shared/ui/shared/**      -> shared/ui/primitives/**
// + aliases @ui/base -> @ui/core, @ui/shared -> @ui/primitives.
//
// NO toca selectores ni etiquetas (main ya lo hizo).
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

// oldAbsPrefix -> newAbsPrefix  (mas especifico primero)
const MOVES = [
  { old: path.join(UI, "inputs", "base"), new: path.join(UI, "inputs", "core") },
  { old: path.join(UI, "base"), new: path.join(UI, "core") },
  { old: path.join(UI, "shared"), new: path.join(UI, "primitives") },
];
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

// Reescribe un specifier relativo si su destino resuelto cae en una carpeta movida.
function rewriteRelativeSpecifier(spec, fromFile) {
  if (!spec.startsWith(".")) return null;
  const fromDir = path.dirname(fromFile);
  const targetAbs = path.resolve(fromDir, spec);
  for (const mv of MOVES_RESOLVE) {
    const oldPrefix = mv.old + path.sep;
    if (targetAbs.startsWith(oldPrefix) || targetAbs === mv.old) {
      const remainder = targetAbs.slice(mv.old.length);
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
    out = out.replace(/(["'])@ui\/base\//g, (_m, q) => { bump("alias @ui/base→@ui/core"); return `${q}@ui/core/`; });
    out = out.replace(/(["'])@ui\/shared\//g, (_m, q) => { bump("alias @ui/shared→@ui/primitives"); return `${q}@ui/primitives/`; });
    out = out.replace(IMPORT_RE, (whole, kw, q, spec) => {
      const rewritten = rewriteRelativeSpecifier(spec, f);
      if (!rewritten) return whole;
      bump(`rel ${spec}→${rewritten}`);
      return `${kw}${q}${rewritten}${q}`;
    });
    return out;
  });
}

function moveDir(from, to) {
  if (!existsSync(from)) return;
  report.counters[`mover shared/ui/${path.relative(UI, from).split(path.sep).join("/")} → shared/ui/${path.relative(UI, to).split(path.sep).join("/")}`] = 1;
  if (!DRY) { if (existsSync(to)) throw new Error(`Destino ya existe: ${to}`); mkdirSync(path.dirname(to), { recursive: true }); renameSync(from, to); }
}
moveDir(path.join(UI, "inputs", "base"), path.join(UI, "inputs", "core"));
moveDir(path.join(UI, "base"), path.join(UI, "core"));
moveDir(path.join(UI, "shared"), path.join(UI, "primitives"));

console.log(DRY ? "=== DRY-RUN (sin escribir) ===" : "=== APLICADO ===");
console.log("Archivos tocados:", report.filesTouched.size);
for (const k of Object.keys(report.counters).sort()) console.log(`  ${k}: ${report.counters[k]}`);

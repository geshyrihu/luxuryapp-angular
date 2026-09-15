// fix-eol.mjs — Normaliza finales de linea corruptos (CR CR LF -> LF).
//
// Uso:
//   node scripts/fix-eol.mjs            # normaliza todo el repo (working tree)
//   node scripts/fix-eol.mjs --check    # solo reporta; exit 1 si hay corrupcion
//   node scripts/fix-eol.mjs --staged   # revisa solo lo que esta en el index (staged)
//   node scripts/fix-eol.mjs archivo.ts # normaliza archivos puntuales
//
// Corrige el patron \r\r\n (y cualquier corrida de \r+) que algunos editores/agentes
// en Windows generan al reescribir archivos con CRLF sobre contenido que ya era CRLF.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SKIP_DIR = /(^|[\\/])(node_modules|\.git|dist|\.angular|\.playwright-cli|reports|coverage)([\\/]|$)/;
const EXTS = /\.(ts|html|scss|css|js|mjs|cjs|json|md)$/i;

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const staged = args.includes("--staged");
const explicit = args.filter((a) => !a.startsWith("--"));

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (SKIP_DIR.test(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && EXTS.test(e.name)) out.push(p);
  }
  return out;
}

function listStaged() {
  const out = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACM"], {
    encoding: "utf8",
  });
  return out.split("\n").map((l) => l.trim()).filter(Boolean).filter((f) => EXTS.test(f));
}

function readContent(file) {
  if (staged) {
    try {
      return execFileSync("git", ["show", ":" + file], { encoding: "buffer" }).toString("utf8");
    } catch {
      return null;
    }
  }
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

const files = explicit.length ? explicit : staged ? listStaged() : walk(".");

let corrupted = 0;
let fixed = 0;

for (const f of files) {
  const content = readContent(f);
  if (content === null) continue;
  const hasCorruption = /\r{2,}/.test(content);
  if (!hasCorruption) continue;

  corrupted++;
  if (checkOnly) {
    console.error(`  ✗ ${f}`);
    continue;
  }
  if (staged) {
    console.error(`  ! ${f} esta staged con CR repetido; corre 'npm run fix:eol' y re-add.`);
    continue;
  }
  const normalized = content.replace(/\r+\n/g, "\n").replace(/\r+/g, "\n");
  fs.writeFileSync(f, normalized, "utf8");
  fixed++;
  console.log(`  ✓ ${f}`);
}

if (checkOnly) {
  if (corrupted > 0) {
    console.error(`\n[fix-eol] ${corrupted} archivo(s) con CR repetido. Corre: npm run fix:eol`);
    process.exit(1);
  }
  console.log("[fix-eol] OK: sin CR repetido.");
} else if (staged) {
  if (corrupted > 0) process.exit(1);
  console.log("[fix-eol] OK: staged sin CR repetido.");
} else {
  console.log(`[fix-eol] Normalizados: ${fixed}. Corruptos encontrados: ${corrupted}.`);
}

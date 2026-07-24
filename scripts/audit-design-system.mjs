// ============================================================
// audit-design-system.mjs
// Verifica la gobernanza del Design System en las vistas (apps/):
// 1. Archivos .ts: Prohibido importar PrimeNG o @ionic/ (debe usar @ui/).
// 2. Archivos .scss/.css: Prohibido usar ::ng-deep y !important.
// 3. Archivos .html: Prohibido usar style="..." y [style].
// Falla (exit 1) si hay violaciones.
// ============================================================
import { readdirSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const appsRoot = path.join(process.cwd(), "src", "app", "apps");
const isStaged = process.argv.includes("--staged");

function collectFiles(dir) {
  let out = { ts: [], css: [], html: [] };
  
  if (isStaged) {
    try {
      const gitOutput = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf8" });
      const stagedFiles = gitOutput.split(/\r?\n/).filter(f => f.trim() !== "");
      
      for (const relPath of stagedFiles) {
        const absPath = path.resolve(process.cwd(), "..", "..", relPath);
        // Solo auditar archivos que caen dentro de client/angular/src/app/apps/
        if (absPath.startsWith(appsRoot)) {
          if (absPath.endsWith(".ts") && !absPath.endsWith(".spec.ts")) out.ts.push(absPath);
          else if (absPath.endsWith(".scss") || absPath.endsWith(".css")) out.css.push(absPath);
          else if (absPath.endsWith(".html")) out.html.push(absPath);
        }
      }
    } catch (e) {
      console.log("No se pudo obtener la lista de archivos de git (modo --staged).", e.message);
    }
    return out;
  }

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const sub = collectFiles(full);
      out.ts.push(...sub.ts);
      out.css.push(...sub.css);
      out.html.push(...sub.html);
    } else {
      if (e.name.endsWith(".ts") && !e.name.endsWith(".spec.ts")) out.ts.push(full);
      else if (e.name.endsWith(".scss") || e.name.endsWith(".css")) out.css.push(full);
      else if (e.name.endsWith(".html")) out.html.push(full);
    }
  }
  return out;
}

const files = collectFiles(appsRoot);
const violations = [];

// 1. Validar .ts (Imports prohibidos)
for (const file of files.ts) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/^\s*import\s+type\b/.test(line)) return;
    if (/from\s+["']primeng/.test(line)) {
      violations.push({ file, line: i + 1, msg: "importa PrimeNG directamente (usar @ui/*)" });
    }
    if (/from\s+["']@ionic\//.test(line)) {
      violations.push({ file, line: i + 1, msg: "importa @ionic directamente (usar @ui/*)" });
    }
  });
}

// 2. Validar estilos locales
for (const file of files.css) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/::ng-deep/.test(line)) {
      violations.push({ file, line: i + 1, msg: "uso de ::ng-deep en estilos locales" });
    }
    if (/!important/.test(line)) {
      violations.push({ file, line: i + 1, msg: "uso de !important en estilos locales" });
    }
  });
}

// 3. Validar HTML (Inline styles)
for (const file of files.html) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/\bstyle\s*=\s*["']/.test(line)) {
      violations.push({ file, line: i + 1, msg: 'uso de estilos inline (style="...")' });
    }
    if (/\[style\.[^\]]+\]\s*=/.test(line) || /\[style\]\s*=/.test(line)) {
      violations.push({ file, line: i + 1, msg: "uso de binding de estilos inline ([style]...)" });
    }
  });
}

if (violations.length === 0) {
  console.log("✅ apps/: Reglas de gobernanza del Design System respetadas.");
  process.exit(0);
}

// Formatear rutas relativas para mejor legibilidad
const relativeViolations = violations.map(v => {
  return { ...v, file: path.relative(process.cwd(), v.file).split(path.sep).join("/") };
});

console.error(`\n⛔ ${violations.length} violación(es) de gobernanza del Design System en apps/:\n`);
for (const v of relativeViolations) {
  console.error(`  ${v.file}:${v.line} — ${v.msg}`);
}
console.error(
  "\nReglas: NO PrimeNG/Ionic imports directos, NO ::ng-deep, NO !important, NO inline styles en apps/.\n"
);
process.exit(1);

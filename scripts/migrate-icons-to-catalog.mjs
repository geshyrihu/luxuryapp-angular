// ═══════════════════════════════════════════════════════════════════════════
// 🔧 migrate-icons-to-catalog.mjs — migración CONTROLADA y IDEMPOTENTE
//    literales material-symbols-light → constante tipada del catálogo.
//
// Correcciones respecto a la primera versión (incidentada):
//   • Campo de nombre FIJO y no colisionable: `IconCatalog`
//     (nunca `AppIcon`, que colisiona con el componente AppIcon).
//   • El import se inserta al INICIO del archivo (antes del primer `import`),
//     nunca dentro de un bloque import multilínea.
//   • El regex de inserción del campo admite `extends` e `implements`.
//   • Se IGNORAN líneas de `p-button`/`pButton` y contextos `class=`/`[class]`
//     (se tratan aparte en Fase 3); no se toca lo que no es binding de icono.
//   • Idempotente: re-ejecutar sobre lo ya migrado no cambia nada.
//   • Acepta un argumento de ruta para migrar por LOTES.
//
// Uso:
//   node scripts/migrate-icons-to-catalog.mjs                (dry-run, todo src)
//   node scripts/migrate-icons-to-catalog.mjs --apply        (aplica, todo src)
//   node scripts/migrate-icons-to-catalog.mjs src/app/apps/admin.luxuryapp --apply
// ═══════════════════════════════════════════════════════════════════════════

import fs from "fs";
import path from "path";

const APPLY = process.argv.includes("--apply");
const ROOT = process.argv[2] || "src";
const CATALOG = "src/app/shared/ui/shared/app-icon/app-icon.catalog.ts";

const IGNORE = new Set([
  "src/app/shared/ui/shared/app-icon/app-icon.catalog.ts",
  "src/app/shared/utils/icon-mapping.ts",
  "src/app/shared/utils/icon-mapping.spec.ts",
  "src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.service.ts",
  "src/index.html",
]);

const isIgnored = (rel) =>
  IGNORE.has(rel) ||
  rel.endsWith(".spec.ts") ||
  rel.includes(".bak.") ||
  rel.includes("/node_modules/");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules") continue;
      walk(p, acc);
    } else if (/\.(ts|html)$/.test(e.name)) {
      acc.push(p);
    }
  }
  return acc;
}

// ── Catálogo → mapa inverso valor → clave canónica ──────────────────────────
const catalogRaw = fs.readFileSync(CATALOG, "utf-8");
const entries = [...catalogRaw.matchAll(/(\w+):\s*"(material-symbols-light:[a-z0-9_-]+)"/g)];
const valueToKeys = {};
for (const [, key, val] of entries) (valueToKeys[val] ||= []).push(key);

const pascal = (s) =>
  s.split(/[-_]/).map((p) => (p ? p[0].toUpperCase() + p.slice(1) : "")).join("");

const reverse = {};
for (const [val, keys] of Object.entries(valueToKeys)) {
  const p = pascal(val.split(":")[1]);
  reverse[val] =
    keys.find((k) => k === p) ||
    [...keys].sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
}

const LIT = /material-symbols-light:[a-z0-9_-]+/g;
const litCount = (s) => (s.match(new RegExp(LIT.source, "g")) || []).length;
const isCommentLine = (line) => /^\s*(\/\/|\*|<!--|\/\*)/.test(line);

function transform(line, fieldTok) {
  if (isCommentLine(line)) return line;
  // p-button / pButton: bugs aparte (PrimeNG no renderiza Iconify). Fase 3.
  if (/\bp-button\b|\bpButton\b/.test(line)) return line;
  // contextos de clase CSS: no son binding de icono.
  if (/\[class\]|\bclass="/.test(line)) return line;
  if (!LIT.test(line)) return line;
  LIT.lastIndex = 0;
  let out = line;
  out = out.replace(
    /(icon|iconClass|fallbackIcon)="material-symbols-light:([a-z0-9_-]+)([^"]*)"/g,
    (_m, attr, name) => `[${attr}]="${fieldTok}.${reverse["material-symbols-light:" + name]}"`
  );
  out = out.replace(
    /\[(\w+)\]=\s*["'](['"]?)material-symbols-light:([a-z0-9_-]+)\2["']/g,
    (_m, attr, _q, name) => `[${attr}]="${fieldTok}.${reverse["material-symbols-light:" + name]}"`
  );
  out = out.replace(
    /['"]material-symbols-light:([a-z0-9_-]+)['"]/g,
    (_m, name) => `${fieldTok}.${reverse["material-symbols-light:" + name]}`
  );
  return out;
}

// ── Resolución de host (.ts del componente) ─────────────────────────────────
const allFiles = walk(ROOT).map((f) => f.replace(/\\/g, "/")).filter((rel) => !isIgnored(rel));
const allTs = allFiles.filter((f) => f.endsWith(".ts"));

// ── Precompute: quién ya expone `IconCatalog` (propio o por herencia) ────────
// Algunas clases base (p.ej. MobileButtonBase) ya declaran `IconCatalog`, así
// que sus subclases lo heredan y NO deben redeclararlo (TS4114).
const classParent = new Map();
const classFile = new Map();
const fileHasIconCatalog = new Set();
// Escanea TODO src (no solo el lote) para resolver la cadena de herencia.
for (const tsRel of walk("src").map((f) => f.replace(/\\/g, "/")).filter((f) => f.endsWith(".ts"))) {
  const c = fs.readFileSync(path.join(process.cwd(), tsRel), "utf8");
  if (/(?:readonly\s+)?\bIconCatalog\s*[:=]/.test(c)) fileHasIconCatalog.add(tsRel);
  for (const m of c.matchAll(/\bclass\s+(\w+)(?:\s*<[^>]*>)?(?:\s+extends\s+([\w$]+))?/g)) {
    classParent.set(m[1], m[2] || null);
    classFile.set(m[1], tsRel);
  }
}
function providesIconCatalog(cls) {
  const seen = new Set();
  let cur = cls;
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    if (fileHasIconCatalog.has(classFile.get(cur))) return true;
    cur = classParent.get(cur) || null;
  }
  return false;
}

const templateUrlMap = {};
for (const tsRel of walk("src").map((f) => f.replace(/\\/g, "/")).filter((f) => f.endsWith(".ts"))) {
  const c = fs.readFileSync(path.join(process.cwd(), tsRel), "utf8");
  for (const m of c.matchAll(/templateUrl\s*:\s*["'`]([^"'`]+)["'`]/g)) {
    const base = path.basename(m[1]);
    if (base.endsWith(".html")) templateUrlMap[base] = tsRel;
  }
}

function hostForHtml(htmlRel) {
  const exact = htmlRel.replace(/\.html$/, ".ts");
  if (fs.existsSync(path.join(process.cwd(), exact))) return exact;
  const base = path.basename(htmlRel);
  if (templateUrlMap[base]) return templateUrlMap[base];
  return null;
}

// ── Agrupar por host ────────────────────────────────────────────────────────
const hosts = new Map();
for (const rel of allFiles) {
  if (rel.endsWith(".ts")) {
    const h = hosts.get(rel) || { files: new Set(), moduleScope: false, needsField: false };
    h.files.add(rel);
    hosts.set(rel, h);
  } else {
    const tsHost = hostForHtml(rel);
    if (!tsHost) {
      console.warn("⚠️ HTML sin host (tratar manual en Fase 3): " + rel);
      continue;
    }
    const h = hosts.get(tsHost) || { files: new Set(), moduleScope: false, needsField: false };
    h.files.add(rel);
    hosts.set(tsHost, h);
  }
}

const writes = new Map();
let totalReplaced = 0;
let fieldsAdded = 0;
let importsAdded = 0;
const leftover = [];
const noHost = [];

for (const [hostRel, h] of hosts) {
  const hostPath = path.join(process.cwd(), hostRel);
  if (!fs.existsSync(hostPath)) continue;
  const hostContent = fs.readFileSync(hostPath, "utf8");
  const hasClass = /\b(class|abstract class)\s+\w+/.test(hostContent);
  h.moduleScope = !hasClass;

  const fieldTok = h.moduleScope ? "AppIconCatalog" : "IconCatalog";

  let hostHasLiteral = false;
  for (const f of h.files) {
    const p = path.join(process.cwd(), f);
    const orig = fs.readFileSync(p, "utf8");
    const before = litCount(orig);
    if (before === 0) continue;
    const newLines = orig.split("\n").map((l) => transform(l, fieldTok));
    const after = litCount(newLines.join("\n"));
    totalReplaced += before - after;
    if (after > 0) leftover.push(`${f} (${after})`);
    writes.set(f, newLines.join("\n"));
    if (f === hostRel) hostHasLiteral = true;
  }

  if (hostHasLiteral || [...h.files].some((f) => f !== hostRel)) {
    h.needsField = !h.moduleScope;
  }

  if (h.needsField || (h.moduleScope && hostHasLiteral)) {
    const clsMatch = hostContent.match(/\bclass\s+(\w+)/);
    const clsName = clsMatch ? clsMatch[1] : null;
    const inheritedCatalog = clsName && providesIconCatalog(clsName);
    if (inheritedCatalog) {
      // El catálogo ya está disponible vía herencia; no redeclarar.
      continue;
    }
    let hc = writes.get(hostRel) || hostContent;
    const relPath = path
      .relative(path.dirname(hostPath), path.join(process.cwd(), CATALOG))
      .replace(/\\/g, "/")
      .replace(/\.ts$/, "");
    if (!hc.includes("AppIcon as AppIconCatalog")) {
      const lines = hc.split("\n");
      let firstImport = -1;
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*import\s/.test(lines[i])) { firstImport = i; break; }
      }
      const imp = `import { AppIcon as AppIconCatalog } from "${relPath}";`;
      if (firstImport >= 0) lines.splice(firstImport, 0, imp);
      else lines.unshift(imp);
      hc = lines.join("\n");
      importsAdded++;
    }
    if (!h.moduleScope && !/readonly\s+IconCatalog\s*=/.test(hc)) {
      hc = hc.replace(
        /(class\s+[\w$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[\w$]+(?:\s*<[^>]*>)?)?(?:\s+implements\s+[^\{]+)?\s*\{)/,
        (m) => `${m}\n  protected readonly IconCatalog = AppIconCatalog;`
      );
      fieldsAdded++;
    }
    writes.set(hostRel, hc);
  }
}

if (APPLY) {
  for (const [rel, content] of writes) {
    fs.writeFileSync(path.join(process.cwd(), rel), content, "utf-8");
  }
  console.log(`✅ Aplicado. ${writes.size} archivos escritos.`);
} else {
  console.log("🔍 DRY-RUN (no se escribió nada). Usa --apply para aplicar.");
}

console.log(`   Literales reemplazados: ${totalReplaced}`);
console.log(`   Archivos a escribir: ${writes.size}`);
console.log(`   Fields añadidos: ${fieldsAdded}`);
console.log(`   Imports añadidos: ${importsAdded}`);
if (leftover.length) {
  console.log(`\n⚠️ Literales que QUEDARON (${leftover.length}) — revisar manualmente:`);
  for (const l of leftover.slice(0, 40)) console.log("   - " + l);
}

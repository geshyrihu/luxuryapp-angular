// ═══════════════════════════════════════════════════════════════════════════
// 🔧 migrate-icons-to-catalog.mjs — Literales material-symbols-light → AppIcon.Clave
// ═══════════════════════════════════════════════════════════════════════════
// Convierte todos los literales `material-symbols-light:X` del código en
// referencias tipadas `AppIcon.Clave`, exponiendo la constante del catálogo en
// cada componente. Deja intactos: el propio catálogo, el resolver icon-mapping
// (usa literales a propósito) y los archivos de documentación/pruebas.
//
// Uso:  node scripts/migrate-icons-to-catalog.mjs          (dry-run)
//       node scripts/migrate-icons-to-catalog.mjs --apply  (escribe)
// ═══════════════════════════════════════════════════════════════════════════

import fs from "fs";
import path from "path";

const APPLY = process.argv.includes("--apply");
const ROOT = "src";
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
  if (isCommentLine(line) || !LIT.test(line)) return line;
  LIT.lastIndex = 0;
  let out = line;
  // Patrón A: atributo de icono sin corchetes (permite texto extra tras el icono)
  out = out.replace(
    /(icon|iconClass|fallbackIcon)="material-symbols-light:([a-z0-9_-]+)([^"]*)"/g,
    (_m, attr, name) => `[${attr}]="${fieldTok}.${reverse["material-symbols-light:" + name]}"`
  );
  // Patrón B: corchetes con literal entrecomillado
  out = out.replace(
    /\[(\w+)\]=\s*["'](['"]?)material-symbols-light:([a-z0-9_-]+)\2["']/g,
    (_m, attr, _q, name) => `[${attr}]="${fieldTok}.${reverse["material-symbols-light:" + name]}"`
  );
  // Patrón C: cualquier literal entrecomillado restante (ternarios, datos .ts, defaults)
  out = out.replace(
    /['"]material-symbols-light:([a-z0-9_-]+)['"]/g,
    (_m, name) => `${fieldTok}.${reverse["material-symbols-light:" + name]}`
  );
  return out;
}

// ── Resolución de host (.ts del componente) ─────────────────────────────────
const allFiles = walk(ROOT).map((f) => f.replace(/\\/g, "/")).filter((rel) => !isIgnored(rel));
const allTs = allFiles.filter((f) => f.endsWith(".ts"));

// Mapa basename-de-template -> .ts que lo declara vía templateUrl
const templateUrlMap = {};
for (const tsRel of allTs) {
  const c = fs.readFileSync(path.join(process.cwd(), tsRel), "utf8");
  for (const m of c.matchAll(/templateUrl\s*:\s*["'`]([^"'`]+)["'`]/g)) {
    const target = m[1];
    const base = path.basename(target);
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
      console.warn("⚠️ HTML sin host (no migrado): " + rel);
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

for (const [hostRel, h] of hosts) {
  const hostPath = path.join(process.cwd(), hostRel);
  if (!fs.existsSync(hostPath)) continue;
  const hostContent = fs.readFileSync(hostPath, "utf8");
  const hasClass = /\b(class|abstract class)\s+\w+/.test(hostContent);
  h.moduleScope = !hasClass;

  let fieldTok = "AppIcon";
  // Colisión real: el archivo importa el COMPONENTE `AppIcon` (ruta .../app-icon["']),
  // no el alias `AppIcon as AppIconCatalog`. En ese caso renombramos el field a `AppIcons`.
  const importsAppIconComponent = /import\s*\{[^}]*\bAppIcon\b[^}]*\}\s*from\s*["'][^"']*app-icon["']/.test(hostContent);
  if (importsAppIconComponent) fieldTok = "AppIcons";
  if (h.moduleScope) fieldTok = "AppIconCatalog";

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
      if (!h.moduleScope) {
        // Auto-cura: quita cualquier field AppIcon/AppIcons previo inconsistente.
        hc = hc.replace(/^[ \t]*readonly[ \t]+(?:AppIcon|AppIcons)[ \t]*=[ \t]*AppIconCatalog;[ \t]*\r?\n/m, "");
        if (!new RegExp(`readonly\\s+${fieldTok}\\s*=`).test(hc)) {
          hc = hc.replace(
            /(class\s+[\w$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[\w$]+(?:\s*<[^>]*>)?)?(?:\s+implements\s+[^\{]+)?\s*\{)/,
            (m) => `${m}\n  readonly ${fieldTok} = AppIconCatalog;`
          );
          fieldsAdded++;
        }
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

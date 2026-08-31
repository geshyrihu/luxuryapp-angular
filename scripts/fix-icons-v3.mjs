// fix-icons-v3.mjs — migración CORREGIDA de referencias de iconos.
// Estrategia:
//   • .ts código            -> `AppIconCatalog.X` (constante de módulo importada).
//   • .html / template inline -> `IconCatalog.X` (campo de instancia del componente).
//   • Se inyecta `protected readonly IconCatalog = AppIconCatalog;` en la clase @Component.
//   • No usa regex con estado ni grupos sin captura (causa de la corrupción previa).
//
// Uso:
//   node scripts/fix-icons-v3.mjs                  (dry-run, todo src)
//   node scripts/fix-icons-v3.mjs --apply          (aplica, todo src)
//   node scripts/fix-icons-v3.mjs src/app/apps/public.luxuryapp --apply   (lote)

import fs from "fs";
import path from "path";

const APPLY = process.argv.includes("--apply");
const ROOT = process.argv[2] || "src";
const CATALOG = "src/app/shared/ui/shared/app-icon/app-icon.catalog.ts";

const IGNORE = new Set([
  "src/app/shared/ui/shared/app-icon/app-icon.catalog.ts",
  "src/app/shared/ui/shared/app-icon/app-icon.ts",
  "src/app/shared/utils/icon-mapping.ts",
  "src/app/shared/utils/icon-mapping.spec.ts",
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
    } else if (/\.(ts|html)$/.test(e.name)) acc.push(p);
  }
  return acc;
}
const allFiles = walk(ROOT)
  .map((f) => f.replace(/\\/g, "/"))
  .filter((rel) => !isIgnored(rel));

const relImport = (fileRel) => {
  let r = path
    .relative(path.dirname(fileRel), CATALOG)
    .replace(/\\/g, "/")
    .replace(/\.ts$/, "");
  if (!r.startsWith(".")) r = "./" + r;
  return r;
};

// Regex (NO globales para .test; globales solo para .replace)
const MEMBER_ALL = /\b(AppIcon|AppIconCatalog|IconCatalog)\.([A-Z]\w+)/g;
const HAS = /\b(AppIcon|AppIconCatalog|IconCatalog)\.[A-Z]\w+/;
const MEMBER_CODE = /\b(AppIcon|AppIconCatalog)\.([A-Z]\w+)/g;
const TMPL = /(template\s*:\s*`)([\s\S]*?)(`)/g;
const FIELD = /(?:readonly\s+)?\bIconCatalog\s*=\s*AppIconCatalog/;
const COMPONENT_OPEN =
  /(@Component\s*\([\s\S]*?\)\s*(?:export\s+)?(?:abstract\s+)?)(class\s+[\w$]+(?:<[^>]*>)?(?:\s+extends\s+[\w$]+(?:<[^>]*>)?)?(?:\s+implements\s+[^{]+)?\s*\{)/;

// jerarquía para decidir `override`
const classParent = new Map();
const classFile = new Map();
const fileHasField = new Set();
for (const rel of allFiles) {
  if (!rel.endsWith(".ts")) continue;
  const c = fs.readFileSync(path.join(process.cwd(), rel), "utf8");
  if (FIELD.test(c)) fileHasField.add(rel);
  for (const m of c.matchAll(/\bclass\s+([\w$]+)(?:<[^>]*>)?(?:\s+extends\s+([\w$]+))?/g)) {
    classParent.set(m[1], m[2] || null);
    classFile.set(m[1], rel);
  }
}
function ancestorHasField(cls) {
  const seen = new Set();
  let cur = classParent.get(cls);
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    if (fileHasField.has(classFile.get(cur))) return true;
    cur = classParent.get(cur) || null;
  }
  return false;
}

function addField(content) {
  const clsMatch = content.match(/@Component\s*\([\s\S]*?\)\s*(?:export\s+)?(?:abstract\s+)?class\s+([\w$]+)/);
  const mod = clsMatch && ancestorHasField(clsMatch[1]) ? "override" : "protected";
  return content.replace(COMPONENT_OPEN, (m, pre) => `${pre}\n  ${mod} readonly IconCatalog = AppIconCatalog;`);
}

const writes = new Map();
let tsN = 0, htmlN = 0, fields = 0;

for (const rel of allFiles) {
  const abs = path.join(process.cwd(), rel);
  let content = fs.readFileSync(abs, "utf8");
  if (!HAS.test(content)) continue;

  if (rel.endsWith(".ts")) {
    // 1) template inline -> IconCatalog
    content = content.replace(TMPL, (_m, open, inner, close) => {
      const fixed = inner.replace(MEMBER_ALL, (_x, _p, member) => `IconCatalog.${member}`);
      return open + fixed + close;
    });
    // 2) código -> AppIconCatalog (no toca IconCatalog de templates)
    content = content.replace(MEMBER_CODE, (_x, _p, member) => `AppIconCatalog.${member}`);
    // 3) import
    if (content.includes("AppIconCatalog.") && !content.includes("AppIcon as AppIconCatalog")) {
      content = `import { AppIcon as AppIconCatalog } from "${relImport(rel)}";\n` + content;
    }
    // 4) campo si tiene template inline
    if (/template\s*:\s*`/.test(content) && !FIELD.test(content)) {
      content = addField(content);
      fields++;
    }
    tsN++;
  } else {
    // .html -> IconCatalog
    content = content.replace(MEMBER_ALL, (_x, _p, member) => `IconCatalog.${member}`);
    htmlN++;
  }
  writes.set(rel, content);
}

// Hosts de .html: añadir campo + import
const hostClasses = new Set();
for (const rel of allFiles) {
  if (!rel.endsWith(".html")) continue;
  if (!writes.has(rel)) continue;
  const hostRel = (() => {
    const exact = rel.replace(/\.html$/, ".ts");
    if (fs.existsSync(path.join(process.cwd(), exact))) return exact;
    for (const tsRel of allFiles) {
      if (!tsRel.endsWith(".ts")) continue;
      const c = fs.readFileSync(path.join(process.cwd(), tsRel), "utf8");
      const m = c.match(/templateUrl\s*:\s*["'`]([^"'`]+)["'`]/);
      if (m && path.basename(m[1]) === path.basename(rel)) return tsRel;
    }
    return null;
  })();
  if (hostRel) hostClasses.add(hostRel);
}
for (const hostRel of hostClasses) {
  let content = writes.get(hostRel) || fs.readFileSync(path.join(process.cwd(), hostRel), "utf8");
  const clsMatch = content.match(/@Component\s*\([\s\S]*?\)\s*(?:export\s+)?(?:abstract\s+)?class\s+([\w$]+)/);
  if (!clsMatch) continue;
  if (ancestorHasField(clsMatch[1])) continue;
  if (FIELD.test(content)) continue;
  if (!content.includes("AppIcon as AppIconCatalog")) {
    content = `import { AppIcon as AppIconCatalog } from "${relImport(hostRel)}";\n` + content;
  }
  content = addField(content);
  fields++;
  writes.set(hostRel, content);
}

if (APPLY) {
  for (const [rel, c] of writes) fs.writeFileSync(path.join(process.cwd(), rel), c, "utf-8");
  console.log(`✅ Aplicado. ${writes.size} archivos (ts:${tsN}, html:${htmlN}), fields:${fields}`);
} else {
  console.log("🔍 DRY-RUN. Usa --apply. " + writes.size + " archivos (ts:" + tsN + ", html:" + htmlN + "), fields:" + fields);
}

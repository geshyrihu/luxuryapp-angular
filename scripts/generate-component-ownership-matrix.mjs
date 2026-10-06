import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const uiDir = path.join(root, "src/app/shared/ui");
const consumerRoots = [
  path.join(root, "src/app/modules"),
  path.join(root, "src/app/core"),
];
const outCsv = path.join(
  root,
  "../../docs/SharedLuxuryApp/UI/20261006-gate0-matriz-componentes.csv",
);
const outMd = path.join(
  root,
  "../../docs/SharedLuxuryApp/UI/20261006-gate0-matriz-componentes-resumen.md",
);

function walk(dir, fileList = [], opts = {}) {
  if (!fs.existsSync(dir)) return fileList;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (opts.excludeDirNames?.includes(entry)) continue;
      walk(full, fileList, opts);
    } else if (full.endsWith(".ts")) {
      if (opts.excludeSuffixes?.some((s) => full.endsWith(s))) continue;
      fileList.push(full);
    }
  }
  return fileList;
}

// 1) Index consumer files: for each @ui/* named import, record which consumer files use it.
console.log("Indexando consumidores (modules + core)...");
const consumerFiles = [];
for (const r of consumerRoots) {
  walk(r, consumerFiles, {
    excludeSuffixes: [".spec.ts", ".stories.ts"],
    excludeDirNames: ["node_modules"],
  });
}

// Map className -> Set<consumerFilePath>
const consumersByClassName = new Map();
const importLineRe = /import\s*\{([^}]+)\}\s*from\s*["']@ui\/[^"']+["']/g;

for (const file of consumerFiles) {
  const content = fs.readFileSync(file, "utf-8");
  let m;
  importLineRe.lastIndex = 0;
  while ((m = importLineRe.exec(content))) {
    const names = m[1]
      .split(",")
      .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
      .filter(Boolean);
    for (const name of names) {
      if (!consumersByClassName.has(name)) consumersByClassName.set(name, new Set());
      consumersByClassName.get(name).add(file);
    }
  }
}
console.log(`Consumidores indexados: ${consumerFiles.length} archivos, ${consumersByClassName.size} símbolos @ui/* importados.`);

// 1b) Resolver cadenas de re-export dentro de shared/ui (bridges de
// compatibilidad tipo "export { InputCheck as CustomInputCheckSignal } from
// '../adaptive/input-check/input-check'"). Sin esto, un componente consumido
// solo via su alias de barrel aparece falsamente como "sin consumidores".
console.log("Resolviendo alias de re-export en shared/ui...");
const allUiFilesForAlias = walk(uiDir, [], { excludeSuffixes: [".spec.ts", ".stories.ts"] });
const exportFromRe = /export\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g;

function resolveImportPath(fromFile, importPath) {
  if (!importPath.startsWith(".")) return null; // solo relativos dentro de shared/ui
  const base = path.resolve(path.dirname(fromFile), importPath);
  const candidates = [`${base}.ts`, path.join(base, "index.ts")];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

// edges: key `${resolvedTargetFile}::${originalName}` -> [{file, aliasName}, ...]
const reExportEdges = new Map();
for (const file of allUiFilesForAlias) {
  const content = fs.readFileSync(file, "utf-8");
  let m;
  exportFromRe.lastIndex = 0;
  while ((m = exportFromRe.exec(content))) {
    const target = resolveImportPath(file, m[2]);
    if (!target) continue;
    const names = m[1].split(",").map((s) => s.trim()).filter(Boolean);
    for (const n of names) {
      const parts = n.split(/\s+as\s+/);
      const originalName = parts[0].trim();
      const aliasName = (parts[1] || parts[0]).trim();
      const key = `${target}::${originalName}`;
      if (!reExportEdges.has(key)) reExportEdges.set(key, []);
      reExportEdges.get(key).push({ file, aliasName });
    }
  }
}

/** BFS desde (file, className) sobre reExportEdges; devuelve todos los nombres bajo los que se pudo importar este componente, en cualquier archivo de shared/ui. */
function resolveAllAliasNames(file, className) {
  const seen = new Set([className]);
  const queue = [{ file, name: className }];
  while (queue.length) {
    const { file: f, name } = queue.shift();
    const key = `${f}::${name}`;
    const edges = reExportEdges.get(key) || [];
    for (const e of edges) {
      if (!seen.has(e.aliasName)) {
        seen.add(e.aliasName);
        queue.push({ file: e.file, name: e.aliasName });
      }
    }
  }
  return seen;
}

// 2) Walk shared/ui components/directives.
console.log("Escaneando shared/ui...");
const uiFiles = walk(uiDir, [], { excludeSuffixes: [".spec.ts", ".stories.ts"] });

const decoratorRe = /@(Component|Directive)\(\{/;
const selectorRe = /selector:\s*["']([^"']+)["']/;
const classRe = /export\s+(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/;
const inputSignalRe = /\b(\w+)\s*=\s*input(?:<[^>]*>)?\s*\(/g;
const outputSignalRe = /\b(\w+)\s*=\s*output(?:<[^>]*>)?\s*\(/g;
const inputDecoratorRe = /@Input\(\)\s*(\w+)/g;
const outputDecoratorRe = /@Output\(\)\s*(\w+)/g;
const ariaRe = /aria-[a-z-]+|role\s*=/i;
// Whitelist de @core/* confirmada por triage manual (20261006-gate0-violaciones-frontera-triage.md):
// - services/platform.service, services/dialog-handler.service: mecanismos de
//   adaptacion de plataforma sancionados por el roadmap (§2).
// - interfaces/: imports type-only (contrato de datos, no comportamiento); no
//   es el tipo de acoplamiento que el roadmap prohibe.
// - services/{debug-console,message,date,filtro-calendar,global-table-filter,
//   custom-toast,image-processing}.service: utilidades transversales sin
//   logica de negocio (confirmado leyendo cada import, no solo el path).
// NO whitelisteado a proposito (queda flaggeado): @core/auth/*, @core/http/*,
// @core/constants/endpoints/*, @core/data/* (dato estatico mal ubicado,
// ver triage) y cualquier *.luxuryapp/* (modulo de negocio concreto).
const CORE_WHITELIST = [
  "services/platform.service",
  "services/dialog-handler.service",
  "services/debug-console.service",
  "services/message.service",
  "services/date.service",
  "services/filtro-calendar.service",
  "services/global-table-filter.service",
  "services/custom-toast.service",
  "services/image-processing.service",
];
const coreWhitelistRe = new RegExp(`^(interfaces/|(${CORE_WHITELIST.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$)`);

function isCoreImportViolation(content) {
  const re = /from\s*["'](@core\/([^"']+)|[^"']*\.luxuryapp\/[^"']+)["']/g;
  let m;
  while ((m = re.exec(content))) {
    const isCore = m[1].startsWith("@core/");
    if (isCore) {
      const subPath = m[2];
      if (coreWhitelistRe.test(subPath)) continue;
      return true;
    }
    return true; // *.luxuryapp/ directo: siempre cuenta
  }
  return false;
}

const rows = [];
for (const file of uiFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const decMatch = content.match(decoratorRe);
  if (!decMatch) continue;
  const classMatch = content.match(classRe);
  if (!classMatch) continue;

  const className = classMatch[1];
  const selectorMatch = content.match(selectorRe);
  const relPath = path.relative(uiDir, file).replace(/\\/g, "/");
  const layer = relPath.split("/")[0];

  const inputs = new Set();
  const outputs = new Set();
  let m;
  inputSignalRe.lastIndex = 0;
  while ((m = inputSignalRe.exec(content))) inputs.add(m[1]);
  outputSignalRe.lastIndex = 0;
  while ((m = outputSignalRe.exec(content))) outputs.add(m[1]);
  inputDecoratorRe.lastIndex = 0;
  while ((m = inputDecoratorRe.exec(content))) inputs.add(m[1]);
  outputDecoratorRe.lastIndex = 0;
  while ((m = outputDecoratorRe.exec(content))) outputs.add(m[1]);

  const specPath = file.replace(/\.ts$/, ".spec.ts");
  const hasSpec = fs.existsSync(specPath);
  const hasAria = ariaRe.test(content);
  const coreImportViolation = isCoreImportViolation(content);

  const aliasNames = resolveAllAliasNames(file, className);
  const consumerSet = new Set();
  for (const name of aliasNames) {
    const s = consumersByClassName.get(name);
    if (s) for (const f of s) consumerSet.add(f);
  }
  const consumerCount = consumerSet.size;
  const resolvedVia = [...aliasNames].filter((n) => n !== className).join("|");

  // Heuristica de madurez tentativa (NO decide ownership, solo clasifica señales objetivas).
  let madurezTentativa;
  if (coreImportViolation) madurezTentativa = "revisar-dependencia-core";
  else if (consumerCount === 0) madurezTentativa = "sin-consumidores";
  else if (hasSpec && consumerCount >= 1) madurezTentativa = "candidato-stable";
  else madurezTentativa = "experimental";

  rows.push({
    layer,
    path: `shared/ui/${relPath}`,
    decorator: decMatch[1],
    selector: selectorMatch ? selectorMatch[1] : "(sin selector, directiva por atributo o base abstracta)",
    className,
    inputs: [...inputs].join("|"),
    outputs: [...outputs].join("|"),
    hasSpec,
    hasAria,
    coreImportViolation,
    consumerCount,
    resolvedVia,
    madurezTentativa,
  });
}

rows.sort((a, b) => (a.layer !== b.layer ? a.layer.localeCompare(b.layer) : a.className.localeCompare(b.className)));

console.log(`Componentes/directivas detectados: ${rows.length}`);

// 3) CSV
const csvHeader = [
  "layer",
  "path",
  "decorator",
  "selector",
  "className",
  "inputs",
  "outputs",
  "hasSpec",
  "hasAria",
  "coreImportViolation",
  "consumerCount",
  "resolvedVia",
  "madurezTentativa",
  "owner",
  "madurezAprobada",
  "notas",
].join(",");

function csvEscape(v) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const csvLines = [csvHeader];
for (const r of rows) {
  csvLines.push(
    [
      r.layer,
      r.path,
      r.decorator,
      r.selector,
      r.className,
      r.inputs,
      r.outputs,
      r.hasSpec,
      r.hasAria,
      r.coreImportViolation,
      r.consumerCount,
      r.resolvedVia,
      r.madurezTentativa,
      "", // owner: pendiente, no se inventa
      "", // madurezAprobada: pendiente de revisión humana
      "",
    ]
      .map(csvEscape)
      .join(","),
  );
}
fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.writeFileSync(outCsv, csvLines.join("\n") + "\n", "utf-8");
console.log(`CSV escrito: ${outCsv}`);

// 4) Resumen Markdown (agregados, no las 300+ filas completas)
const byLayer = new Map();
const byMadurez = new Map();
const sinConsumidores = [];
const coreViolations = [];
const sinSpecConCero = [];

for (const r of rows) {
  byLayer.set(r.layer, (byLayer.get(r.layer) || 0) + 1);
  byMadurez.set(r.madurezTentativa, (byMadurez.get(r.madurezTentativa) || 0) + 1);
  if (r.consumerCount === 0) sinConsumidores.push(r);
  if (r.coreImportViolation) coreViolations.push(r);
  if (!r.hasSpec && r.consumerCount > 0) sinSpecConCero.push(r);
}

let md = `# Gate 0 — matriz de componentes shared/ui (generada)\n\n`;
md += `**Fecha:** 2026-10-06\n`;
md += `**Fuente:** \`scripts/generate-component-ownership-matrix.mjs\`, ejecutado sobre \`appsweb/angular\` en \`main\` local post Fase 2c.\n`;
md += `**Archivo completo (todas las filas):** [20261006-gate0-matriz-componentes.csv](./20261006-gate0-matriz-componentes.csv)\n\n`;
md += `Este resumen agrega el CSV; no reemplaza revisión humana de \`owner\`/\`madurezAprobada\` (columnas vacías a propósito, no se inventan).\n\n`;

md += `## Totales\n\n`;
md += `**Componentes/directivas detectados:** ${rows.length}\n\n`;

md += `## Por capa\n\n| Capa | Cantidad |\n|---|---:|\n`;
for (const [layer, count] of [...byLayer.entries()].sort((a, b) => b[1] - a[1])) {
  md += `| ${layer} | ${count} |\n`;
}

md += `\n## Madurez tentativa (heurística objetiva, no aprobada)\n\n`;
md += `Reglas: \`revisar-dependencia-core\` si importa \`@core/\` o un módulo de negocio directamente (viola frontera); \`sin-consumidores\` si cero archivos de \`modules/\`+\`core/\` lo importan; \`candidato-stable\` si tiene spec Y al menos 1 consumidor; \`experimental\` el resto.\n\n`;
md += `| Madurez tentativa | Cantidad |\n|---|---:|\n`;
for (const [k, count] of [...byMadurez.entries()].sort((a, b) => b[1] - a[1])) {
  md += `| ${k} | ${count} |\n`;
}

md += `\n## Violaciones de frontera (importan @core/ o negocio directo)\n\n`;
if (coreViolations.length === 0) {
  md += `Ninguna detectada.\n`;
} else {
  md += `| Path | Clase |\n|---|---|\n`;
  for (const r of coreViolations) md += `| \`${r.path}\` | \`${r.className}\` |\n`;
}

md += `\n## Sin consumidores en modules/core (candidatos a revisar: ¿app-specific, deprecated, o falso negativo del grep?)\n\n`;
md += `Total: ${sinConsumidores.length}. Antes de reclasificar cualquiera como \`deprecated\`, verificar manualmente (el grep solo indexa imports \`import { X } from "@ui/..."\"\; un re-export, un alias distinto o un uso solo dentro de shared/ui no cuenta como cero consumidores reales).\n\n`;
md += `| Path | Clase | Selector |\n|---|---|---|\n`;
for (const r of sinConsumidores.slice(0, 60)) md += `| \`${r.path}\` | \`${r.className}\` | \`${r.selector}\` |\n`;
if (sinConsumidores.length > 60) md += `\n_(${sinConsumidores.length - 60} filas más en el CSV completo)_\n`;

md += `\n## Con consumidores pero sin spec (${sinSpecConCero.length})\n\n`;
md += `Candidatos a priorizar para Fase 5 (cobertura funcional).\n\n`;
md += `| Path | Clase | Consumidores |\n|---|---|---:|\n`;
for (const r of sinSpecConCero.slice(0, 40)) md += `| \`${r.path}\` | \`${r.className}\` | ${r.consumerCount} |\n`;
if (sinSpecConCero.length > 40) md += `\n_(${sinSpecConCero.length - 40} filas más en el CSV completo)_\n`;

fs.mkdirSync(path.dirname(outMd), { recursive: true });
fs.writeFileSync(outMd, md, "utf-8");
console.log(`Resumen Markdown escrito: ${outMd}`);

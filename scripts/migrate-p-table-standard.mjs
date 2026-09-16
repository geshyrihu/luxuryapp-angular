import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const write = args.includes("--write");
const files = args.filter((arg) => arg !== "--write" && arg !== "--dry-run");

if (files.length === 0) {
  console.error("Uso: node scripts/migrate-p-table-standard.mjs [--dry-run|--write] <archivo>...");
  process.exitCode = 1;
  process.exit();
}

function findAppRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(current, "src", "app")) &&
      true
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(start);
    current = parent;
  }
}

const root = findAppRoot(process.cwd());
let reportRoot = root;
let candidateReportRoot = null;
while (true) {
  if (fs.existsSync(path.join(reportRoot, "docs", "migration-template"))) {
    candidateReportRoot = reportRoot;
  }
  const parent = path.dirname(reportRoot);
  if (parent === reportRoot) break;
  reportRoot = parent;
}
reportRoot = candidateReportRoot ?? root;
const reportPath = path.join(reportRoot, "docs", "migration-template", "dry-run-lote-piloto-script.md");
const transformed = [];
const excluded = [];
const warnings = [];

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function unifiedDiff(file, before, after) {
  if (before === after) return "(sin cambios)";
  const oldLines = before.replaceAll("\r\n", "\n").split("\n");
  const newLines = after.replaceAll("\r\n", "\n").split("\n");
  let prefix = 0;
  while (prefix < oldLines.length && prefix < newLines.length && oldLines[prefix] === newLines[prefix]) prefix++;
  let suffix = 0;
  while (
    suffix < oldLines.length - prefix &&
    suffix < newLines.length - prefix &&
    oldLines[oldLines.length - 1 - suffix] === newLines[newLines.length - 1 - suffix]
  ) suffix++;
  const oldMiddle = oldLines.slice(prefix, oldLines.length - suffix);
  const newMiddle = newLines.slice(prefix, newLines.length - suffix);
  const contextBefore = oldLines.slice(Math.max(0, prefix - 2), prefix);
  const contextAfter = oldLines.slice(oldLines.length - suffix, oldLines.length - suffix + 2);
  const oldStart = Math.max(1, prefix - contextBefore.length + 1);
  const newStart = oldStart;
  const lines = [
    `--- a/${relative(file)}`,
    `+++ b/${relative(file)}`,
    `@@ -${oldStart},${contextBefore.length + oldMiddle.length + contextAfter.length} +${newStart},${contextBefore.length + newMiddle.length + contextAfter.length} @@`,
    ...contextBefore.map((line) => ` ${line}`),
    ...oldMiddle.map((line) => `-${line}`),
    ...newMiddle.map((line) => `+${line}`),
    ...contextAfter.map((line) => ` ${line}`),
  ];
  return lines.join("\n");
}

function replaceHtml(before, file) {
  const issues = [];
  if (/pTemplate\s*=/.test(before)) return { excluded: "usa pTemplate" };
  if (/<p-sorticon\s*\/\s*>/.test(before)) return { excluded: "contiene p-sorticon sin field" };
  const opens = (before.match(/<p-table\b/g) ?? []).length;
  const closes = (before.match(/<\/p-table>/g) ?? []).length;
  if (opens === 0) return { excluded: "no contiene <p-table>" };
  if (opens !== closes) issues.push(`p-table desbalanceado (${opens} apertura(s), ${closes} cierre(s))`);
  if (issues.length) return { warning: issues.join("; ") };

  let after = before
    .replace(/<p-table\b/g, "<app-table")
    .replace(/<\/p-table>/g, "</app-table>")
    .replace(/\bpSortableColumn="/g, 'appSortableColumn="')
    .replace(/\[pSortableColumn\]="/g, '[appSortableColumn]="')
    .replace(/<p-sorticon\s+field="([^"]*)"\s*>\s*<\/p-sorticon>/g, '<app-sorticon field="$1" />')
    .replace(/<p-sorticon field="/g, '<app-sorticon field="')
    .replace(/<p-sorticon \[field\]="/g, '<app-sorticon [field]="')
    .replace(/<ng-template\s+(caption|header|body|emptymessage|paginatorleft)(?=[\s>])/g, '<ng-template #$1');
  return { after };
}

function replaceTypeScript(before, file) {
  const issues = [];
  const exactImport = 'import { TableModule } from "@ui/web/primeng-table/primeng-table";';
  const directImport = 'import { TableModule } from "primeng/table";';
  const multilineImport = /import\s*\{\s*([\w,\s]+)\}\s*from\s*"@ui\/web\/primeng-table\/primeng-table";/m;
  let after = before;
  if (before.includes(exactImport)) {
    after = after.replace(exactImport, 'import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";');
  } else if (before.includes(directImport)) {
    after = after.replace(directImport, 'import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";');
  } else if (multilineImport.test(before)) {
    const block = before.match(multilineImport)[0];
    const names = before.match(multilineImport)[1];
    if (!/TableLazyLoadEvent/.test(names)) {
      issues.push("import de TableModule no coincide exactamente con el patrón permitido");
    } else {
      after = after.replace(block, 'import { TableLazyLoadEvent } from "@ui/web/primeng-table/primeng-table";\nimport { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";');
    }
  } else {
    issues.push("no encontró import de TableModule desde @ui/web/primeng-table/primeng-table ni primeng/table");
  }
  const tokenCount = (after.match(/\bTableModule\b/g) ?? []).length;
  if (tokenCount !== 1) issues.push(`esperaba un único token TableModule en imports (encontrados: ${tokenCount})`);
  if (!issues.length) {
    after = after.replace(/^(\s*)TableModule,?$/m, "$1AppTable,\n$1AppSortableColumn,\n$1AppSorticon,");
    if (after === before) issues.push("encontró TableModule pero no pudo reemplazarlo dentro de imports");
  }
  return { after, issues };
}

for (const input of files) {
  const htmlFile = path.resolve(root, input);
  if (!fs.existsSync(htmlFile)) {
    excluded.push({ file: input, reason: "archivo no existe" });
    continue;
  }
  const originalHtml = fs.readFileSync(htmlFile, "utf8");
  const htmlResult = replaceHtml(originalHtml, htmlFile);
  if (htmlResult.excluded) {
    excluded.push({ file: relative(htmlFile), reason: htmlResult.excluded });
    continue;
  }
  if (htmlResult.warning) {
    warnings.push({ file: relative(htmlFile), reason: htmlResult.warning });
    continue;
  }
  const tsFile = path.extname(htmlFile) === ".ts" ? htmlFile : path.join(path.dirname(htmlFile), `${path.basename(htmlFile, ".html")}.ts`);
  if (!fs.existsSync(tsFile)) {
    warnings.push({ file: relative(htmlFile), reason: `no existe .ts correspondiente: ${relative(tsFile)}` });
    continue;
  }
  const originalTs = fs.readFileSync(tsFile, "utf8");
  const tsResult = replaceTypeScript(originalTs, tsFile);
  if (tsResult.issues.length) {
    warnings.push({ file: relative(htmlFile), reason: tsResult.issues.join("; ") });
    continue;
  }
  if (write) {
    fs.writeFileSync(htmlFile, htmlResult.after);
    fs.writeFileSync(tsFile, tsResult.after);
  }
  transformed.push({
    htmlFile,
    tsFile,
    htmlBefore: originalHtml,
    htmlAfter: htmlResult.after,
    tsBefore: originalTs,
    tsAfter: tsResult.after,
  });
}

const mode = write ? "--write" : "--dry-run";
const report = [
  "# Dry-run del codemod `<p-table>` estándar",
  "",
  `Modo ejecutado: \`${mode}\`. El modo predeterminado es \`--dry-run\`; esta corrida no escribe archivos de \`src/app/modules/\`.`,
  "",
  `Archivos transformados: **${transformed.length}**`,
  ...transformed.flatMap((item) => [
    "",
    `## ${relative(item.htmlFile)}`,
    "",
    "### HTML",
    "",
    "```diff",
    unifiedDiff(item.htmlFile, item.htmlBefore, item.htmlAfter),
    "```",
    "",
    `### TypeScript: ${relative(item.tsFile)}`,
    "",
    "```diff",
    unifiedDiff(item.tsFile, item.tsBefore, item.tsAfter),
    "```",
  ]),
  "",
  `## Excluidos (${excluded.length})`,
  "",
  ...(excluded.length ? excluded.map((item) => `- \`${item.file}\`: ${item.reason}.`) : ["- Ninguno."]),
  "",
  `## Patrones no calzados / advertencias (${warnings.length})`,
  "",
  ...(warnings.length ? warnings.map((item) => `- \`${item.file}\`: ${item.reason}.`) : ["- Ninguno."]),
  "",
  "## Seguridad",
  "",
  "- No se procesan archivos fuera de la lista recibida.",
  "- Los archivos con `pTemplate=` se excluyen antes de cualquier reemplazo.",
  "- Los `p-sorticon` sin `field` se excluyen; los cierres separados con `field` literal se normalizan a autocerrado.",
].join("\n");

fs.writeFileSync(reportPath, `${report}\n`);
console.log(report);

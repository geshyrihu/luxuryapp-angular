import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "src");
const ALLOWED_EXTENSIONS = new Set([".html", ".ts", ".js", ".mjs", ".scss", ".css", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".angular", "dist", "android"]);

// Patrones de mojibave por doble codificación UTF-8 → Latin-1 → UTF-8
const MOJIBAKE_RE = /Ã©|Ã¡|Ã­|Ã³|Ãº|Ã±|Ã¼|Ãª|Ã§|Ã£|Ãµ|Ã¢|Ã®|Ã´|Ã»|Ã«|Â¿|Â¡|Â§|Â°|Âµ|Â·|Ã€|Ã|Ã‚|Ãƒ|Ã„|Ã…|Ã†|Ã‡|Ãˆ|Ã‰|ÃŠ|Ã‹|ÃŒ|Ã|ÃŽ|Ã|Ã|Ã‘|Ã’|Ã“|Ã”|Ã•|Ã–|Ã˜|Ã™|Ãš|Ã›|Ãœ|Ã|Ãž|ÃŸ/g;

function collectFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) { files.push(...collectFiles(abs)); continue; }
    if (ALLOWED_EXTENSIONS.has(path.extname(entry.name))) files.push(abs);
  }
  return files;
}

let bomIssues = 0;
let mojibakeIssues = 0;

for (const file of collectFiles(sourceRoot)) {
  const buf = readFileSync(file);
  const rel = path.relative(projectRoot, file);

  // Check for BOM
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    console.log(`[BOM] ${rel}`);
    bomIssues++;
  }

  // Check for mojibave (readonly — no modifica nada)
  const text = buf.toString("utf-8");
  if (MOJIBAKE_RE.test(text)) {
    const matches = text.match(MOJIBAKE_RE);
    const samples = [...new Set(matches)].slice(0, 5).join(", ");
    console.log(`[MOJIBAKE] ${rel} — ${matches.length} ocurrencias (ej: ${samples})`);
    mojibakeIssues++;
  }
}

if (bomIssues > 0 || mojibakeIssues > 0) {
  if (bomIssues > 0) console.log(`\n⚠ ${bomIssues} archivo(s) con BOM.`);
  if (mojibakeIssues > 0) console.log(`\n⚠ ${mojibakeIssues} archivo(s) con mojibake. Corregir manualmente siguiendo AGENTS.md → Encoding Rules.`);
  process.exit(1);
} else {
  console.log("Encoding audit OK — sin BOM ni mojibake.");
}

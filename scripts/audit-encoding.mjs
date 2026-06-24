import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "src");
const ALLOWED_EXTENSIONS = new Set([".html", ".ts", ".js", ".mjs", ".scss", ".css", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".angular", "dist", "android"]);

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

let issues = 0;
for (const file of collectFiles(sourceRoot)) {
  const buf = readFileSync(file);
  const rel = path.relative(projectRoot, file);

  // Check for BOM
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    console.log(`[BOM] ${rel}`);
    issues++;
  }
}

if (issues > 0) {
  console.log(`\nFound ${issues} file(s) with BOM. Run scripts/reparar-encoding.ps1 to fix.`);
} else {
  console.log("Encoding audit OK — no BOM found.");
}

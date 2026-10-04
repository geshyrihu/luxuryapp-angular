import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src");
const replacements = [
  ["lux-table-caption/table-caption", "lux-table-caption/lux-table-caption"],
  ["lux-table-checkbox/table-checkbox", "lux-table-checkbox/lux-table-checkbox"],
  ["lux-table-empty-message/table-empty-message", "lux-table-empty-message/lux-table-empty-message"],
  ["lux-table-footer/table-footer", "lux-table-footer/lux-table-footer"],
  ["lux-table-global-filter/table-global-filter", "lux-table-global-filter/lux-table-global-filter"],
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|html)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let changed = 0;
let replacementsCount = 0;
for (const file of walk(root)) {
  const before = readFileSync(file, "utf8");
  let after = before;
  for (const [from, to] of replacements) {
    const matches = after.split(from).length - 1;
    if (matches) replacementsCount += matches;
    after = after.replaceAll(from, to);
  }
  if (after !== before) {
    writeFileSync(file, after, "utf8");
    changed++;
  }
}

console.log(`Files changed: ${changed}`);
console.log(`Import references fixed: ${replacementsCount}`);

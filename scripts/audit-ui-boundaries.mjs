// ============================================================
// audit-ui-boundaries.mjs
// Verifica la independencia de plataforma en shared/ui:
//   - mobile/ no puede importar PrimeNG ni web/ (ni @ui/web)
//   - web/    no puede importar Ionic  ni mobile/ (ni @ui/mobile)
//   - base/   no puede importar PrimeNG ni Ionic (solo lógica)
//   - adaptive/ es la ÚNICA excepción (puede cruzar).
// Falla (exit 1) si hay violaciones. Se ejecuta vía `npm run lint`.
// ============================================================
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const uiRoot = path.join(process.cwd(), "src", "app", "shared", "ui");

const RULES = [
  {
    layer: "mobile",
    dir: path.join(uiRoot, "mobile"),
    forbidden: [
      { re: /from\s+["'][^"']*primeng/, msg: "importa PrimeNG" },
      { re: /from\s+["']@ui\/web\//, msg: "importa @ui/web" },
      { re: /from\s+["'][^"']*shared\/ui\/web\//, msg: "importa web/" },
    ],
  },
  {
    layer: "web",
    dir: path.join(uiRoot, "web"),
    forbidden: [
      { re: /from\s+["']@ionic\//, msg: "importa Ionic" },
      { re: /from\s+["']@ui\/mobile\//, msg: "importa @ui/mobile" },
      { re: /from\s+["'][^"']*shared\/ui\/mobile\//, msg: "importa mobile/" },
    ],
  },
  {
    layer: "base",
    dir: path.join(uiRoot, "base"),
    forbidden: [
      { re: /from\s+["'][^"']*primeng/, msg: "importa PrimeNG (la base debe ser agnóstica)" },
      { re: /from\s+["']@ionic\//, msg: "importa Ionic (la base debe ser agnóstica)" },
    ],
  },
];

function collectTs(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(collectTs(full));
    else if (e.name.endsWith(".ts") && !e.name.endsWith(".spec.ts")) out.push(full);
  }
  return out;
}

const violations = [];
for (const rule of RULES) {
  for (const file of collectTs(rule.dir)) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      // Los imports type-only se borran en compilación → no violan la
      // independencia de runtime; se permiten en cualquier capa.
      if (/^\s*import\s+type\b/.test(line)) return;
      for (const f of rule.forbidden) {
        if (f.re.test(line)) {
          violations.push({
            layer: rule.layer,
            file: file.split(path.sep).join("/"),
            line: i + 1,
            msg: f.msg,
          });
        }
      }
    });
  }
}

if (violations.length === 0) {
  console.log("✅ shared/ui: fronteras web/móvil/base respetadas.");
  process.exit(0);
}

console.error(`\n⛔ ${violations.length} violación(es) de fronteras en shared/ui:\n`);
for (const v of violations) {
  console.error(`  [${v.layer}] ${v.file}:${v.line} — ${v.msg}`);
}
console.error(
  "\nRegla: mobile/ ✗ PrimeNG·web · web/ ✗ Ionic·mobile · base/ ✗ ambos. " +
    "Solo adaptive/ puede cruzar. Ver shared/ui/arquitectura-shared-ui.md.\n",
);
process.exit(1);

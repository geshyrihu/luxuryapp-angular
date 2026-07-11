// ============================================================
// audit-apps-boundaries.mjs
// Verifica la independencia de dominios en apps/:
//   - Un portal/app (ej. admin.luxuryapp) NO puede importar 
//     absolutamente NADA de otro portal (ej. operaciones.luxuryapp).
//   - Todas las apps deben estar completamente desacopladas.
// Falla (exit 1) si hay violaciones. Se ejecuta vía `npm run lint`.
// ============================================================
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const appsRoot = path.join(process.cwd(), "src", "app", "apps");

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

// Obtener la lista de todas las apps
let appsDirs = [];
try {
  appsDirs = readdirSync(appsRoot, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.endsWith(".luxuryapp"))
    .map(d => d.name);
} catch {
  console.log("No se pudo leer el directorio apps/");
  process.exit(0);
}

const violations = [];

for (const currentApp of appsDirs) {
  const currentAppDir = path.join(appsRoot, currentApp);
  
  // Para la app actual, cualquier otra app es una importación prohibida
  const forbiddenApps = appsDirs.filter(app => app !== currentApp);
  
  for (const file of collectTs(currentAppDir)) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      // Ignorar type-only imports si se desea, aunque lo mejor es aislar por completo.
      // if (/^\s*import\s+type\b/.test(line)) return; 
      
      for (const forbidden of forbiddenApps) {
        // Regex para buscar importaciones que contengan el nombre de la app prohibida
        // ej. from 'src/app/apps/operations.luxuryapp/...' o from '../../operations.luxuryapp/...'
        const regex = new RegExp(`from\\s+["'][^"']*apps\\/${forbidden}\\/`);
        if (regex.test(line)) {
          violations.push({
            app: currentApp,
            file: file.split(path.sep).join("/"),
            line: i + 1,
            msg: `importa de otra app prohibida (${forbidden})`,
          });
        }
      }
    });
  }
}

if (violations.length === 0) {
  console.log("✅ apps/: fronteras de monolito modular respetadas. Ninguna app cruza dominios.");
  process.exit(0);
}

console.error(`\n⛔ ${violations.length} violación(es) de fronteras en apps/:\n`);
for (const v of violations) {
  console.error(`  [${v.app}] ${v.file}:${v.line} — ${v.msg}`);
}
console.error(
  "\nRegla: Una app dentro de apps/ no puede importar de otra app. Deben ser dominios aislados.\n"
);
process.exit(1);

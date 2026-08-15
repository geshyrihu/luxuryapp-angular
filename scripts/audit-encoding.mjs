// audit-encoding.mjs — Delegado al scanner unificado de encoding.
// Mantiene `npm run audit:encoding` funcionando sin duplicar lógica.
// Scanner canónico del proyecto: scripts/scan-mojibake.mjs (raíz del repo).
// Cubre mojibake UTF-8→CP1252 Y los puntos ciegos del detector por roundtrip:
// controles C1, BOM, sustitución ñ→ó, ¿/¡ faltantes y CJK en código.
// El scanner resuelve rutas relativas a la raíz del repo, por eso pasamos la
// ruta del proyecto relativa a la raíz (p.ej. "client/angular").
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..", "..");
const rel = path.relative(repoRoot, process.cwd());
const scanner = path.join(repoRoot, "scripts", "scan-mojibake.mjs");

try {
  execFileSync(process.execPath, [scanner, rel], { stdio: "inherit", cwd: repoRoot });
  process.exit(0);
} catch (err) {
  process.exit(err.status ?? 1);
}

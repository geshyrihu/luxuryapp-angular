// audit-encoding.mjs — Delegado al scanner unificado de encoding.
// Mantiene `npm run audit:encoding` funcionando sin duplicar lógica.
// Scanner canónico: scripts/scan-mojibake.mjs (versionado en ESTE repo, no en
// la carpeta contenedora del monorepo). Hasta 2026-09-23 delegaba a
// d:\repos\luxuryapp-api\scripts\scan-mojibake.mjs (dos niveles arriba), que
// solo existe en el filesystem local y NO está versionado en ningún repo git:
// en un checkout de CI (actions/checkout solo trae este repo) ese path no
// existe y el gate fallaba con ENOENT. Se copió el scanner dentro de este
// repo para que sea autocontenido y funcione igual en local y en CI.
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const scanner = path.join(repoRoot, "scripts", "scan-mojibake.mjs");

try {
  execFileSync(process.execPath, [scanner, "."], { stdio: "inherit", cwd: repoRoot });
  process.exit(0);
} catch (err) {
  process.exit(err.status ?? 1);
}

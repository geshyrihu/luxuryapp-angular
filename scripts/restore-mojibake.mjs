import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const TARGETS = [
  "src/app/modules/human-resources.luxuryapp/evaluaciones-de-desempeno/evaluation-template/lista-plantilla-evaluacion.ts",
  "src/app/modules/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista.ts",
  "src/app/modules/maintenance.luxuryapp/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.ts",
  "src/app/modules/maintenance.luxuryapp/logs/tool-loan/tool-list.ts",
  "src/app/modules/operations.luxuryapp/incidencias-sanciones/incident/incident-list.ts",
  "src/app/modules/operations.luxuryapp/incidencias-sanciones/sanction/sanction-list.ts",
  "src/app/modules/recruitment.luxuryapp/expediente-del-empleado/employees/employees/employee-list.ts",
  "src/app/modules/recruitment.luxuryapp/reclutamiento-y-altas-bajas/recruitment-staff-board/recruitment-staff-board.ts",
];

const REPLACEMENTS = {
  "lista-plantilla-evaluacion.ts": [
    { before: "e);\n  router = inject(Router);\n  // Declaraci", char: "ó" },
    { before: "ect(Router);\n  // Declaraci", char: "ó" },
    { before: "tions();\n  // ", char: "?" }, // ambiguous: leading char before "Esta"
    { before: "Se recalcular", char: "á" },
    { before: "lcular", char: "á" },
  ],
  "ticket-legal-lista.ts": [
    { before: "color s", char: "ó" },
  ],
  "recepcion-pipas-agua-list.ts": [
    { before: "label: \"Pipa vac", char: "í" },
    { before: "lacas del cami", char: "ó" },
    { before: "Medidor despu", char: "é" },
    { before: "Nivel despu", char: "é" },
    { before: "rte de Recepci", char: "ó" },
    { before: "data-label\">T", char: "é" },
    { before: "Cisterna despu", char: "é" },
    { before: "title\">Fotograf", char: "í" },
  ],
  "tool-list.ts": [
    { before: "// Se", char: "ñ" },
  ],
  "incident-list.ts": [
    { before: "o de cancelaci", char: "ó" },
    { before: "a para firma f", char: "í" },
    { before: "rmada se guard", char: "ó" },
  ],
  "sanction-list.ts": [
    { before: "\"Aplicar Sanci", char: "ó" },
    { before: "tatus de Sanci", char: "ó" },
  ],
  "employee-list.ts": [
    { before: " \"Administraci", char: "ó" },
    { before: "ia]: \"Jardiner", char: "í" },
    { before: "n]: \"Supervisi", char: "ó" },
    { before: "nes]: \"Direcci", char: "ó" },
    { before: "ion]: \"Recepci", char: "ó" },
    { before: "ia]: \"Mensajer", char: "í" },
  ],
  "recruitment-staff-board.ts": [
    { before: " \"Administraci", char: "ó" },
    { before: "ia]: \"Jardiner", char: "í" },
    { before: "n]: \"Supervisi", char: "ó" },
    { before: "nes]: \"Direcci", char: "ó" },
    { before: "ion]: \"Recepci", char: "ó" },
    { before: "ia]: \"Mensajer", char: "í" },
  ],
};

function restoreFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const fileKey = path.basename(filePath);
  const repls = REPLACEMENTS[fileKey] || [];
  for (const r of repls) {
    const escaped = r.before.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped + "\\x00\\x00", "g");
    content = content.replace(regex, r.char);
  }
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Restored ${filePath}`);
}

for (const f of TARGETS) {
  if (fs.existsSync(f)) {
    restoreFile(f);
  } else {
    console.log(`! not found: ${f}`);
  }
}

console.log("\nDone.");
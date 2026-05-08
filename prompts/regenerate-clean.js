const fs = require("fs");
const data = JSON.parse(
  fs.readFileSync("src/app/extracted-endpoints.json", "utf8"),
);

let code = `/**
 * Archivo auto-generado con los endpoints del API.
 * Fase 1: Definición de las rutas pre-refactorización
 */
export const Endpoints = {
  // Módulo Banks (Payment) - Añadido para Phase 2
  "Banks": {
    "getAll": "banks",
    "getById": function(id: string) { return \`banks/\${id}\`; },
    "create": "Banks",
    "update": function(id: string) { return \`Banks/\${id}\`; },
    "delete": function(id: string) { return \`banks/\${id}\`; },
    "selectItems": "select-items/banks",
  },
`;

for (const module in data) {
  if (Object.keys(data[module]).length === 0) continue;

  code += `  "${module}": {\n`;
  for (const key in data[module]) {
    let val = data[module][key];
    if (typeof val !== "string") continue;

    if (module === "Tickets" && key === "getAll7") continue;

    if (!val.includes("${")) {
      code += `    "${key}": ${JSON.stringify(val)},\n`;
    } else {
      const varsMatch =
        val.match(/\\$\\{([^}]+)\\}/g) || val.match(/\$\{([^}]+)\}/g);
      let params = new Set();

      if (varsMatch) {
        varsMatch.forEach((v) => {
          let internal = v.replace(/^.*?\{/, "").replace(/\}$/, "");

          let safeName = internal
            .split(".")[0]
            .replace(/[\(\)\[\]"']/g, "")
            .trim();
          if (safeName === "true") safeName = "isTrue";
          else if (safeName === "false") safeName = "isFalse";
          else if (!isNaN(safeName)) safeName = "val" + safeName;
          else if (safeName === "this") safeName = "_this";
          else if (!safeName) safeName = "p";

          params.add(safeName);

          val = val.replace(v, "${" + safeName + "}");
        });
      }

      const paramList = Array.from(params)
        .map((p) => `${p}: any`)
        .join(", ");
      code += `    "${key}": function(${paramList}) { return \`${val}\`; },\n`;
    }
  }
  code += `  },\n`;
}

code += `} as const;\n`;

fs.writeFileSync("src/app/core/constants/endpoints.ts", code);
console.log("Regenerated Endpoints Perfectly with quoted keys!");

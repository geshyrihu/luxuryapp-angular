const fs = require("fs");
const htmlPath =
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
let htmlCode = fs.readFileSync(htmlPath, "utf8");

// Replace border-1 with border-2 for the cards
htmlCode = htmlCode.replace(/ border-1 border-/g, " border-2 border-");

fs.writeFileSync(htmlPath, htmlCode, "utf8");
console.log("Borders updated");

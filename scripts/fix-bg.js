const fs = require("fs");
const htmlPath =
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
let htmlCode = fs.readFileSync(htmlPath, "utf8");

// Fix dark buttons
htmlCode = htmlCode.replace(
  /bg-gray-900 border-1 border-gray-900 border-round-md p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer hover:bg-gray-800 transition-colors transition-duration-150/g,
  "bg-indigo-50 hover:bg-indigo-100 shadow-1 hover:shadow-3 border-1 border-indigo-200 border-round-xl p-2 w-full flex flex-column align-items-center justify-content-center cursor-pointer transition-all transition-duration-200",
);

// Fix text color in the buttons (white -> indigo)
htmlCode = htmlCode.replace(
  /class="text-xs text-center line-height-2 text-white"/g,
  'class="text-xs text-center line-height-2 text-indigo-700 font-medium"',
);

// Fix icon color (color:#ffffff -> color:#4338ca)
htmlCode = htmlCode.replace(
  /style="font-size:1\.5rem;color:#ffffff;"/g,
  'style="font-size:1.5rem;color:#4338ca;"',
);
htmlCode = htmlCode.replace(
  /style="font-size:1\.25rem;color:#ffffff;"/g,
  'style="font-size:1.25rem;color:#4338ca;"',
);

// Add forecast classes to tr (find by indexOf to avoid CRLF mismatch)
const trIndex = htmlCode.indexOf("<tr\r\n        [class.fila-nivel-2-hoja]");
if (trIndex === -1) {
  const trIndexLF = htmlCode.indexOf("<tr\n        [class.fila-nivel-2-hoja]");
  if (trIndexLF !== -1) {
    htmlCode =
      htmlCode.substring(0, trIndexLF) +
      '<tr\n        [class.fila-nivel-2-hoja]="item.nivelCuenta === 2 && !item.esFilaAgrupadora"\n        [class.fila-nivel-3-hoja]="item.nivelCuenta === 3 && !item.esFilaAgrupadora"\n        [class.fila-deficit]="isDeficit(item)"\n        [class.fila-alerta-incremento]="isHighIncrease(item)"\n      >' +
      htmlCode.substring(htmlCode.indexOf(">", trIndexLF) + 1);
  }
} else {
  htmlCode =
    htmlCode.substring(0, trIndex) +
    '<tr\r\n        [class.fila-nivel-2-hoja]="item.nivelCuenta === 2 && !item.esFilaAgrupadora"\r\n        [class.fila-nivel-3-hoja]="item.nivelCuenta === 3 && !item.esFilaAgrupadora"\r\n        [class.fila-deficit]="isDeficit(item)"\r\n        [class.fila-alerta-incremento]="isHighIncrease(item)"\r\n      >' +
    htmlCode.substring(htmlCode.indexOf(">", trIndex) + 1);
}

fs.writeFileSync(htmlPath, htmlCode, "utf8");
console.log("HTML fixed");

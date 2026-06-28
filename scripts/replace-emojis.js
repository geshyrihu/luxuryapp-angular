const fs = require('fs');
const htmlPath = "D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
let htmlCode = fs.readFileSync(htmlPath, 'utf8');

// Table replacements
htmlCode = htmlCode.replace(/>🛒 \|<\/span/g, '><app-icon icon="mdi:cart-outline" class="text-blue-500"></app-icon> |</span');
htmlCode = htmlCode.replace(/>🕒 \|<\/span/g, '><app-icon icon="mdi:history" class="text-indigo-500"></app-icon> |</span');
htmlCode = htmlCode.replace(/>📂 \|<\/span/g, '><app-icon icon="mdi:folder-outline" class="text-orange-500"></app-icon> |</span');

// Legend replacements
htmlCode = htmlCode.replace(/<span>🛒<\/span>/g, '<app-icon icon="mdi:cart-outline" class="text-blue-500"></app-icon>');
htmlCode = htmlCode.replace(/<span>🕒<\/span>/g, '<app-icon icon="mdi:history" class="text-indigo-500"></app-icon>');
htmlCode = htmlCode.replace(/<span>📂<\/span>/g, '<app-icon icon="mdi:folder-outline" class="text-orange-500"></app-icon>');

fs.writeFileSync(htmlPath, htmlCode, 'utf8');
console.log("Icons updated");

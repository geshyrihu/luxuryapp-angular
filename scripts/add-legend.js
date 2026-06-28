const fs = require('fs');
const htmlPath = "D:/repos/luxuryapp-api/client/angular/src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html";
let htmlCode = fs.readFileSync(htmlPath, 'utf8');

const legendHtml = `
      <!-- Leyenda y Acotaciones -->
      <div class="mt-3 surface-ground border-round-md p-3 border-1 surface-border">
        <div class="flex flex-wrap gap-4 align-items-center text-sm text-700">
          <div class="font-semibold text-800 flex align-items-center gap-1">
            <app-icon icon="mdi:information-outline" style="font-size:1.2rem;"></app-icon> 
            Guía Rápida:
          </div>
          
          <div class="flex align-items-center gap-2" pTooltip="La cuenta presenta un déficit en el presupuesto actual">
            <span class="w-1rem h-1rem border-round bg-red-100 border-1 border-red-300"></span>
            <span>Déficit Presupuestal</span>
          </div>
          
          <div class="flex align-items-center gap-2" pTooltip="La propuesta supera en más de 10% al presupuesto actual">
            <span class="w-1rem h-1rem border-round bg-yellow-100 border-1 border-yellow-300"></span>
            <span>Incremento > 10%</span>
          </div>
          
          <div class="flex align-items-center gap-2" pTooltip="Ver historial de compras asociadas a la cuenta">
            <span>🛒</span>
            <span>Historial Compras</span>
          </div>
          
          <div class="flex align-items-center gap-2" pTooltip="Ver histórico de movimientos contables">
            <span>🕒</span>
            <span>Historial Partida</span>
          </div>
          
          <div class="flex align-items-center gap-2" pTooltip="Ver cotizaciones y documentos soporte">
            <span>📂</span>
            <span>Documentos Soporte</span>
          </div>

          <div class="flex align-items-center gap-2" pTooltip="Diferencia positiva (aumento vs año anterior)">
            <span class="text-red-700 font-bold">(+)</span>
            <span>Aumento Presupuesto</span>
          </div>

          <div class="flex align-items-center gap-2" pTooltip="Diferencia negativa (ahorro vs año anterior)">
            <span class="text-green-700 font-bold">(-)</span>
            <span>Ahorro / Reducción</span>
          </div>
        </div>
      </div>
    </ng-template>`;

// We will find `    </ng-template>` that comes after the grid of buttons
// Specifically after `        </div>\n      </div>\n    </ng-template>`
const searchTarget = `        </div>
      </div>
    </ng-template>`;
const searchTargetCRLF = `        </div>\r\n      </div>\r\n    </ng-template>`;

if (htmlCode.includes(searchTargetCRLF)) {
    htmlCode = htmlCode.replace(searchTargetCRLF, `        </div>\r\n      </div>\r\n${legendHtml.replace(/\\n/g, '\\r\\n')}`);
} else if (htmlCode.includes(searchTarget)) {
    htmlCode = htmlCode.replace(searchTarget, `        </div>\n      </div>\n${legendHtml}`);
} else {
    console.log("Could not find the target string to insert the legend");
}

fs.writeFileSync(htmlPath, htmlCode, 'utf8');
console.log("Legend added successfully");

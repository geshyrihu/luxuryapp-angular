import fs from "fs";

const files = [
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/cobranza-online/pages/dashboard/cobranza-online-dashboard.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/modal-fee-comparison-by-indiviso.ts",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/maintenance/logs/bitacoras/medidores/medidores-list.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/announcements/announcement/announcement-analytics.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/diagrams/diagram/diagram-gallery/diagram-gallery.ts",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/inspecciones-y-auditora/reports-mantenance/report-consumos/report-consumos.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/inventarios-y-almacn/inventory-engine-system/inventory-engine-system.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/meetings/juntas-comite/junta-comite-minutas/resumen-minuta.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/meetings/juntas-comite/juntas-mensuales-session/juntas-mensuales-session.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/meetings/juntas-mensuales-backfill/juntas-mensuales-backfill.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/properties/property/property-occupant-manager.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/features/operations/reports/report-meeting/report-meeting.html",
  "D:/repos/luxuryapp-api/client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/pages/foundations/catalog-guia/catalog-guia.html",
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  let orig = content;

  // Fix multi-line #title
  content = content.replace(
    /<ng-template\s+#title\s*>([\s\S]*?)<\/div>/g,
    '<div class="text-xl font-bold mb-2">$1</div>',
  );
  content = content.replace(
    /<ng-template\s+pTemplate="title"\s*>([\s\S]*?)<\/div>/g,
    '<div class="text-xl font-bold mb-2">$1</div>',
  );

  content = content.replace(
    /<ng-template\s+#header\s*>([\s\S]*?)<\/div>/g,
    '<div class="card-header">$1</div>',
  );
  content = content.replace(
    /<ng-template\s+pTemplate="header"\s*>([\s\S]*?)<\/div>/g,
    '<div class="card-header">$1</div>',
  );

  // Notice the closing tag is `</div>` because my previous script replaced `</ng-template>` with `</div>` globally!

  // Now for other <ng-template> tags like #body
  let parts = content.split("<ng-template");
  for (let i = 1; i < parts.length; i++) {
    // If it has </ng-template> already, it wasn't replaced (e.g. maybe it was added later or escaped)
    if (parts[i].includes("</ng-template>")) continue;

    // Replace the very FIRST </div> with </ng-template> for this block
    parts[i] = parts[i].replace("</div>", "</ng-template>");
  }
  content = parts.join("<ng-template");

  if (content !== orig) {
    fs.writeFileSync(file, content, "utf8");
    console.log("Fixed", file);
  }
}

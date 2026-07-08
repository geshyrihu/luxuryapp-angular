#!/usr/bin/env node
/**
 * Migrate system/ and hr/ ion-item/ion-label → ili-list-item.
 * Usage: node scratchpad/migrate-system-hr.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

const FEATURES = "D:/repos/luxuryapp-api/client/angular/src/app/features";

function read(path) {
  try { return readFileSync(path, "utf-8"); } catch { return ""; }
}
function write(path, content) {
  writeFileSync(path, content, "utf-8");
}
function getTsFile(htmlPath) {
  return htmlPath.replace(/\.html$/, ".ts");
}

function hasImport(content, name) {
  return new RegExp(`\\b${name}\\b`).test(content);
}

// Find all HTML files with ion-item
const dirs = ["system", "hr"];
const ionItemFiles = [];
for (const dir of dirs) {
  const files = globSync(`${FEATURES}/${dir}/**/*.html`);
  for (const f of files) {
    const c = read(f);
    if (/<ion-item[\s>]/.test(c)) {
      ionItemFiles.push(f);
    }
  }
}

console.log(`Found ${ionItemFiles.length} HTML files with ion-item in system/ and hr/`);

let migrated = 0;
let skipped = 0;
let tsUpdated = 0;

for (const htmlPath of ionItemFiles) {
  let html = read(htmlPath);
  const tsPath = getTsFile(htmlPath);
  let ts = read(tsPath);

  // Check if this file has already been migrated (no more ion-item)
  if (!/<ion-item[\s>]/.test(html)) {
    skipped++;
    continue;
  }

  // ---- Migrate ion-item → ili-list-item ----

  // Replace ion-item opener: remove attributes, convert to ili-list-item
  // Handle various attribute combos:
  //   <ion-item lines="full" class="ion-no-padding" detail="false">
  //   <ion-item lines="full" detail="false" class="ion-no-padding">
  //   <ion-item lines="full" class="ion-no-padding">
  //   <ion-item lines="full">
  //   etc.
  html = html.replace(
    /<ion-item\s+[^>]*?>/g,
    (match) => {
      // Check for button and (click) — preserve click
      const hasClick = /\(click\)="[^"]*"/.test(match);
      const hasRouterLink = /\[routerLink\]="[^"]*"/.test(match);
      // Just convert to ili-list-item, losing ionic-specific attributes
      return "<ili-list-item>";
    }
  );

  // Replace </ion-item> with </ili-list-item>
  html = html.replace(/<\/ion-item>/g, "</ili-list-item>");

  // Replace <ion-label with open tag removal (just delete the opening tag)
  // <ion-label class="..."> → remove, keep content
  // <ion-label> → remove
  html = html.replace(/<ion-label[^>]*>/g, "");
  html = html.replace(/<\/ion-label>/g, "");

  // Replace slot="start" → start
  html = html.replace(/slot="start"/g, "start");

  // Replace slot="end" → end
  html = html.replace(/slot="end"/g, "end");

  // Replace <ion-note ...> → <span ...>
  html = html.replace(/<ion-note\s+/g, "<span ");
  html = html.replace(/<\/ion-note>/g, "</span>");

  // Replace <ion-list inset="true" class="m-0"> → just <div class="m-0">
  html = html.replace(/<ion-list[^>]*>/g, (match) => {
    const cls = match.match(/class="([^"]*)"/);
    const clsStr = cls ? cls[1] : "";
    return `<div class="${clsStr}">`;
  });
  html = html.replace(/<\/ion-list>/g, "</div>");

  // Replace <ion-avatar ...> → <div ...>
  html = html.replace(/<ion-avatar/g, "<div");
  html = html.replace(/<\/ion-avatar>/g, "</div>");

  // Replace <ion-accordion-group ...> → <div ...>
  html = html.replace(/<ion-accordion-group/g, "<div");
  html = html.replace(/<\/ion-accordion-group>/g, "</div>");

  // Replace <ion-accordion ...> → <div ...>
  html = html.replace(/<ion-accordion/g, "<div");
  html = html.replace(/<\/ion-accordion>/g, "</div>");

  // Remove color="light", color="medium", etc from remaining ion-* elements
  html = html.replace(/\s+color="[^"]*"/g, "");

  // Remove ion-specific classes
  html = html.replace(/\s+class="ion-no-padding"/g, "");
  html = html.replace(/\s+class="ion-text-wrap"/g, "");
  html = html.replace(/ion-no-padding\s+/g, "");
  html = html.replace(/ion-text-wrap\s+/g, "");

  // Remove detail="false", detail="true", lines="full", button
  html = html.replace(/\s+detail="false"/g, "");
  html = html.replace(/\s+detail="true"/g, "");
  html = html.replace(/\s+lines="full"/g, "");
  html = html.replace(/\s+button/g, "");

  // ---- Update TS imports ----

  // Remove IonItem, IonLabel, IonNote, IonAvatar, etc from import
  if (ts.includes('"@ionic/angular/standalone"')) {
    // Remove the import line entirely
    ts = ts.replace(/import \{ [^}]* \} from "@ionic\/angular\/standalone";\n?/g, "");

    // Remove Ionic components from imports: array
    const ionicComponents = [
      "IonItem", "IonLabel", "IonNote", "IonAvatar", "IonBadge",
      "IonAccordion", "IonAccordionGroup", "IonCard", "IonCardContent",
      "IonCardHeader", "IonCardTitle", "IonChip", "IonCol", "IonGrid",
      "IonIcon", "IonList", "IonRow", "IonThumbnail",
    ];
    for (const comp of ionicComponents) {
      ts = ts.replace(new RegExp(`,\\s*\\b${comp}\\b`, "g"), "");
      ts = ts.replace(new RegExp(`\\b${comp}\\b,?\\s*`, "g"), "");
    }
    tsUpdated++;
  }

  // Add MobileListItem if the HTML now uses ili-list-item
  if (html.includes("<ili-list-item") && !hasImport(ts, "MobileListItem")) {
    // Add import
    ts = ts.replace(
      /import \{ DataViewMobile \} from "@ui\/mobile\/data-view-mobile\/data-view-mobile";/,
      `import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";\nimport { MobileListItem } from "@ui/mobile/list-item/list-item";`
    );

    // Also try alternative patterns
    if (!ts.includes("MobileListItem")) {
      ts = ts.replace(
        /import \{ MobileActionMenu \} from "@ui\/mobile\/action-menu-mobile\/action-menu-mobile";/,
        `import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";\nimport { MobileListItem } from "@ui/mobile/list-item/list-item";`
      );
    }

    // Add to imports: array
    if (!ts.includes("MobileListItem")) {
      // Try to find the end of the imports array
      ts = ts.replace(
        /MobileActionMenu,(\s*\n\s*WebButtonIcon|\s*\n\s*PrimeNg)/,
        "MobileActionMenu,\n    MobileListItem,$1"
      );
    }
  }

  write(htmlPath, html);
  write(tsPath, ts);
  migrated++;
  console.log(`  ✓ ${htmlPath.replace(FEATURES, "").replace(/\\/g, "/")}`);
}

console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}, TS updated: ${tsUpdated}`);

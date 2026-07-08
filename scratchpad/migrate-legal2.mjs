#!/usr/bin/env node
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

const files = globSync(`${FEATURES}/legal/**/*.html`);
const ionFiles = [];
for (const f of files) {
  const c = read(f);
  if (/<ion-[\s>]/.test(c) || /<ion-/i.test(c)) {
    ionFiles.push(f);
  }
}

console.log(`Found ${ionFiles.length} HTML files with ion- in legal/`);

for (const htmlPath of ionFiles) {
  let html = read(htmlPath);
  const tsPath = getTsFile(htmlPath);
  let ts = read(tsPath);

  // Replace ion-item-group
  html = html.replace(/<ion-item-group[^>]*>/g, '<div class="surface-card mb-3 border-round">');
  html = html.replace(/<\/ion-item-group>/g, "</div>");

  // Replace ion-item-divider
  html = html.replace(/<ion-item-divider[^>]*>/g, '<div class="p-3 border-bottom-1 surface-border">');
  html = html.replace(/<\/ion-item-divider>/g, "</div>");

  // Replace ion-grid
  html = html.replace(/<ion-grid[^>]*>/g, (match) => {
    const cls = match.match(/class="([^"]*)"/);
    return `<div class="grid ${cls ? cls[1] : ''}">`;
  });
  html = html.replace(/<\/ion-grid>/g, "</div>");

  // Replace ion-row
  html = html.replace(/<ion-row[^>]*>/g, '<div class="flex flex-wrap w-full">');
  html = html.replace(/<\/ion-row>/g, "</div>");

  // Replace ion-col size="6"
  html = html.replace(/<ion-col[^>]*>/g, (match) => {
    const cls = match.match(/class="([^"]*)"/);
    const size = match.match(/size="([^"]*)"/);
    const s = size ? size[1] : '12';
    return `<div class="col-${s} ${cls ? cls[1] : ''}">`;
  });
  html = html.replace(/<\/ion-col>/g, "</div>");

  // Replace ion-card
  html = html.replace(/<ion-card[^>]*>/g, (match) => {
    // Preserve (click)
    const hasClick = match.match(/\(click\)="[^"]*"/);
    const clickStr = hasClick ? ` ${hasClick[0]}` : "";
    
    // Convert to a nice div card
    const clsMatch = match.match(/class="([^"]*)"/);
    const clsStr = clsMatch ? clsMatch[1] : "border-1 surface-border shadow-1 border-round-xl";
    return `<div class="${clsStr}"${clickStr}>`;
  });
  html = html.replace(/<\/ion-card>/g, "</div>");

  // Replace ion-card-content
  html = html.replace(/<ion-card-content[^>]*>/g, (match) => {
    const cls = match.match(/class="([^"]*)"/);
    return `<div class="${cls ? cls[1] : 'p-3'}">`;
  });
  html = html.replace(/<\/ion-card-content>/g, "</div>");

  // Remove ion-label
  html = html.replace(/<ion-label[^>]*>/g, (match) => {
    const cls = match.match(/class="([^"]*)"/);
    return `<span class="${cls ? cls[1] : ''}">`;
  });
  html = html.replace(/<\/ion-label>/g, "</span>");

  // Update TS
  if (ts.includes('"@ionic/angular/standalone"')) {
    ts = ts.replace(/import \{ [^}]* \} from "@ionic\/angular\/standalone";\n?/g, "");
    const ionicComponents = [
      "IonItem", "IonLabel", "IonNote", "IonAvatar", "IonBadge",
      "IonAccordion", "IonAccordionGroup", "IonCard", "IonCardContent",
      "IonCardHeader", "IonCardTitle", "IonChip", "IonCol", "IonGrid",
      "IonIcon", "IonList", "IonRow", "IonThumbnail", "IonItemGroup", "IonItemDivider"
    ];
    for (const comp of ionicComponents) {
      ts = ts.replace(new RegExp(`,\\s*\\b${comp}\\b`, "g"), "");
      ts = ts.replace(new RegExp(`\\b${comp}\\b,?\\s*`, "g"), "");
    }
  }

  write(htmlPath, html);
  write(tsPath, ts);
  console.log(`  ✓ ${htmlPath.replace(FEATURES, "").replace(/\\/g, "/")}`);
}
console.log("Done");

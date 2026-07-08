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

const files = globSync(`${FEATURES}/operations/**/*.html`);
const ionFiles = [];
for (const f of files) {
  const c = read(f);
  // Match ion- but not ion-input
  if (/<ion-(?!input)[a-z-]+[\s>]/.test(c)) {
    ionFiles.push(f);
  }
}

console.log(`Found ${ionFiles.length} HTML files with other ion- tags in operations/`);

for (const htmlPath of ionFiles) {
  let html = read(htmlPath);
  const tsPath = getTsFile(htmlPath);
  let ts = read(tsPath);

  // Replace ion-list
  html = html.replace(/<ion-list[^>]*>/g, '<div class="surface-card mb-3 border-round">');
  html = html.replace(/<\/ion-list>/g, "</div>");

  // Replace ion-list-header
  html = html.replace(/<ion-list-header[^>]*>/g, '<div class="p-3 font-bold border-bottom-1 surface-border">');
  html = html.replace(/<\/ion-list-header>/g, "</div>");

  // Replace ion-note
  html = html.replace(/<ion-note[^>]*>/g, (match) => {
    const clsMatch = match.match(/class="([^"]*)"/);
    return `<span class="${clsMatch ? clsMatch[1] : ''}">`;
  });
  html = html.replace(/<\/ion-note>/g, "</span>");

  // Replace ion-text
  html = html.replace(/<ion-text[^>]*>/g, (match) => {
    const clsMatch = match.match(/class="([^"]*)"/);
    return `<span class="${clsMatch ? clsMatch[1] : ''}">`;
  });
  html = html.replace(/<\/ion-text>/g, "</span>");

  // Replace ion-icon
  html = html.replace(/<ion-icon[^>]*name="([^"]*)"[^>]*>/g, (match, name) => {
    return `<app-icon icon="mdi:${name}"></app-icon>`;
  });
  html = html.replace(/<\/ion-icon>/g, ""); // app-icon usually doesn't have content

  // Replace ion-avatar
  html = html.replace(/<ion-avatar[^>]*>/g, '<div class="mr-3">');
  html = html.replace(/<\/ion-avatar>/g, "</div>");

  // Replace ion-badge
  html = html.replace(/<ion-badge[^>]*>/g, '<lx-tag>');
  html = html.replace(/<\/ion-badge>/g, "</lx-tag>");

  // Remove ion-ripple-effect
  html = html.replace(/<ion-ripple-effect[^>]*><\/ion-ripple-effect>/g, "");

  // Update TS
  if (ts.includes('"@ionic/angular/standalone"')) {
    ts = ts.replace(/import \{ [^}]* \} from "@ionic\/angular\/standalone";\n?/g, "");
    const ionicComponents = [
      "IonItem", "IonLabel", "IonNote", "IonAvatar", "IonBadge", "IonButton", "IonSegment", "IonSegmentButton", "IonChip", "IonList",
      "IonListHeader", "IonText", "IonIcon", "IonRippleEffect"
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

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
  if (/<ion-[a-z-]+[\s>]/.test(c)) {
    ionFiles.push(f);
  }
}

for (const htmlPath of ionFiles) {
  let html = read(htmlPath);
  const tsPath = getTsFile(htmlPath);
  let ts = read(tsPath);

  // Replace ion-chip
  html = html.replace(/<ion-chip[^>]*>/g, '<div class="p-1 border-round surface-100 mr-2 mb-2 inline-flex align-items-center">');
  html = html.replace(/<\/ion-chip>/g, "</div>");

  // Replace ion-item
  html = html.replace(/<ion-item[^>]*>/g, '<div class="surface-card p-3 mb-2 shadow-1 border-round flex justify-content-between align-items-center">');
  html = html.replace(/<\/ion-item>/g, "</div>");

  // Replace ion-button
  html = html.replace(/<ion-button[^>]*>/g, (match) => {
    let cls = "p-button p-button-rounded p-button-text p-button-sm";
    if (match.includes('color="danger"')) cls += " p-button-danger";
    else if (match.includes('color="medium"')) cls += " p-button-secondary";
    else cls += " p-button-primary";

    const clickMatch = match.match(/\(click\)="[^"]*"/);
    const clickStr = clickMatch ? ` ${clickMatch[0]}` : "";
    
    return `<button class="${cls}"${clickStr}>`;
  });
  html = html.replace(/<\/ion-button>/g, "</button>");

  // Replace ion-segment and buttons
  html = html.replace(/<ion-segment[^>]*\((ionChange|click)\)="([^"]*)"[^>]*>/g, (match, evt, fn) => {
    // extract value binding
    const valMatch = match.match(/\[value\]="([^"]*)"/);
    const valStr = valMatch ? ` ${valMatch[0]}` : "";
    // We will just create a div flex container
    return `<div class="flex gap-2 mb-3 bg-surface-100 p-1 border-round">`;
  });
  html = html.replace(/<\/ion-segment>/g, "</div>");

  html = html.replace(/<ion-segment-button[^>]*value="([^"]*)"[^>]*>/g, (match, val) => {
    // we use a button
    return `<button class="p-button p-button-text p-button-sm flex-1" (click)="onSegmentChange('${val}')">`;
  });
  html = html.replace(/<\/ion-segment-button>/g, "</button>");

  // Update TS
  if (ts.includes('"@ionic/angular/standalone"')) {
    ts = ts.replace(/import \{ [^}]* \} from "@ionic\/angular\/standalone";\n?/g, "");
    const ionicComponents = [
      "IonItem", "IonLabel", "IonNote", "IonAvatar", "IonBadge", "IonButton", "IonSegment", "IonSegmentButton", "IonChip", "IonList"
    ];
    for (const comp of ionicComponents) {
      ts = ts.replace(new RegExp(`,\\s*\\b${comp}\\b`, "g"), "");
      ts = ts.replace(new RegExp(`\\b${comp}\\b,?\\s*`, "g"), "");
    }
  }

  write(htmlPath, html);
  write(tsPath, ts);
}
console.log("Done");


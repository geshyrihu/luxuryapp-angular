#!/usr/bin/env node
/**
 * Migrate purchasing/ and recruitment/ from direct PrimeNG/Ionic to shared wrappers.
 *
 * Families: p-card, p-tag, p-dialog, p-message, p-fileupload, ion-item/ion-label
 *
 * Usage: node scratchpad/migrate-purchasing-recruitment.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { globSync } from "glob";

const FEATURES = "D:/repos/luxuryapp-api/client/angular/src/app/features";
const MODULES = ["purchasing", "recruitment"];
const ROOT = "D:/repos/luxuryapp-api/client/angular/src/app";

// Helpers
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

// ---- Migrators ----

function migratePCard(html, filePath) {
  let result = html;
  let count = 0;

  // Cases with ng-template #content (unwrap content)
  result = result.replace(
    /<p-card\s+class="([^"]*)"[\s\S]*?>[\s\S]*?<ng-template\s+#content>([\s\S]*?)<\/ng-template>[\s\S]*?<\/p-card>/g,
    (match, cls, content) => {
      const hasP0 = /p-0/.test(cls);
      const padded = hasP0 ? ' [padded]="false"' : '';
      count++;
      return `<lx-card${padded}>\n${content.trim()}\n</lx-card>`;
    }
  );

  // Cases with class="p-0" but no ng-template
  result = result.replace(
    /<p-card\s+class="([^"]*p-0[^"]*)"[^>]*>([\s\S]*?)<\/p-card>/g,
    (match, cls, content) => {
      count++;
      return `<lx-card [padded]="false">\n${content.trim()}\n</lx-card>`;
    }
  );

  // Cases with other class attributes
  result = result.replace(
    /<p-card\s+class="([^"]*)"[^>]*>([\s\S]*?)<\/p-card>/g,
    (match, cls, content) => {
      // Only if not already matched above (p-0)
      if (/p-0/.test(cls)) return match; // skip, already handled
      count++;
      // Keep the class on lx-card
      return `<lx-card class="${cls}">\n${content.trim()}\n</lx-card>`;
    }
  );

  // Plain p-card with no attributes
  result = result.replace(
    /<p-card>([\s\S]*?)<\/p-card>/g,
    (match, content) => {
      count++;
      return `<lx-card>\n${content.trim()}\n</lx-card>`;
    }
  );

  // Self-closing shouldn't happen for p-card, but just in case
  if (count > 0) console.log(`  ${filePath}: ${count} p-card → lx-card`);
  return result;
}

function migratePTag(html, filePath) {
  let result = html;
  let count = 0;

  // All p-tag tags: self-closing or with content
  // Matches: <p-tag ... /> or <p-tag ...>...</p-tag>
  result = result.replace(
    /<p-tag\s+([\s\S]*?)\s*(\/>|>[\s\S]*?<\/p-tag>)/g,
    (match, attrs, closer) => {
      count++;
      let newAttrs = attrs
        .replace(/\bpTooltip\b/g, "tooltip")
        .replace(/\bborder-round\b/g, "rounded")
        .replace(/fluid\s*/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const isSelfClosing = closer.trim() === '/>';
      const content = closer.startsWith('>') ? closer.slice(1, closer.lastIndexOf('</p-tag>')).trim() : '';

      if (isSelfClosing || !content) {
        return `<lx-tag ${newAttrs} />`;
      }
      return `<lx-tag ${newAttrs}>${content}</lx-tag>`;
    }
  );

  if (count > 0) console.log(`  ${filePath}: ${count} p-tag → lx-tag`);
  return result;
}

function migratePDialog(html, filePath) {
  let result = html;
  let count = 0;

  // p-dialog with attributes
  result = result.replace(
    /<p-dialog\s+([^>]*)>([\s\S]*?)<\/p-dialog>/g,
    (match, attrs, content) => {
      count++;
      // Keep relevant attrs: header, [(visible)], [closable], (onDialogHide)→(dismiss)
      let newAttrs = attrs
        .replace(/\(onDialogHide\)/g, "(dismiss)")
        .replace(/\[style\]="[^"]*"/g, "") // remove style (not supported by lx-modal)
        .replace(/style="[^"]*"/g, "") // remove style
        .replace(/\[modal\]="[^"]*"/g, "") // not supported
        .replace(/\[dismissableMask\]="[^"]*"/g, "") // not supported
        .replace(/\[draggable\]="[^"]*"/g, "") // not supported
        .replace(/\[resizable\]="[^"]*"/g, "") // not supported
        .replace(/\[position\]="[^"]*"/g, "") // not supported
        .replace(/\[breakpoints\]="[^"]*"/g, "") // not supported
        .replace(/\[maximizable\]="[^"]*"/g, "") // not supported
        .replace(/\[blockScroll\]="[^"]*"/g, "") // not supported
        .replace(/\[closeOnEscape\]="[^"]*"/g, "") // not supported
        .replace(/\[focusOnShow\]="[^"]*"/g, "") // not supported
        .replace(/\[baseZIndex\]="[^"]*"/g, "") // not supported
        .replace(/\[autoZIndex\]="[^"]*"/g, "") // not supported
        .replace(/\[minX\]="[^"]*"/g, "") // not supported
        .replace(/\[minY\]="[^"]*"/g, "") // not supported
        .replace(/\s+/g, " ")
        .trim();

      return `<lx-modal ${newAttrs}>\n${content.trim()}\n</lx-modal>`;
    }
  );

  if (count > 0) console.log(`  ${filePath}: ${count} p-dialog → lx-modal`);
  return result;
}

function migratePMessage(html, filePath) {
  let result = html;
  let count = 0;

  // p-message with content (not self-closing)
  result = result.replace(
    /<p-message\s+([^>]*)>([\s\S]*?)<\/p-message>/g,
    (match, attrs, content) => {
      count++;
      let newAttrs = attrs
        .replace(/\(onClose\)/g, "(close)")
        .replace(/\(onClick\)/g, "(click)")
        .replace(/\s+/g, " ")
        .trim();
      return `<lx-message ${newAttrs}>${content.trim()}</lx-message>`;
    }
  );

  // Self-closing p-message
  result = result.replace(
    /<p-message\s+([^>]*)\s*\/>/g,
    (match, attrs) => {
      count++;
      let newAttrs = attrs
        .replace(/\(onClose\)/g, "(close)")
        .replace(/\(onClick\)/g, "(click)")
        .replace(/\s+/g, " ")
        .trim();
      return `<lx-message ${newAttrs} />`;
    }
  );

  if (count > 0) console.log(`  ${filePath}: ${count} p-message → lx-message`);
  return result;
}

function migratePFileUpload(html, filePath) {
  let result = html;
  let count = 0;

  // p-fileupload (usually with mode="basic" or as a block)
  result = result.replace(
    /<p-fileupload\s+([^>]*)>([\s\S]*?)<\/p-fileupload>/g,
    (match, attrs, content) => {
      count++;
      return `<app-file-upload ${attrs}>${content}</app-file-upload>`;
    }
  );

  result = result.replace(
    /<p-fileupload\s+([^>]*)\s*\/>/g,
    (match, attrs) => {
      count++;
      return `<app-file-upload ${attrs} />`;
    }
  );

  if (count > 0) console.log(`  ${filePath}: ${count} p-fileupload → app-file-upload`);
  return result;
}

function migrateIonItems(html, filePath) {
  let result = html;
  let countItem = 0;
  let countLabel = 0;

  // ion-item with slot="start"/"end" → ili-list-item with start/end attributes
  result = result.replace(
    /<ion-item>([\s\S]*?)<\/ion-item>/g,
    (match, content) => {
      countItem++;
      // Convert slot="start" to ili-list-item's start attr
      // Convert slot="end" to ili-list-item's end attr
      // Remove ion-label (content goes to default slot)
      let newContent = content
        .replace(/slot="start"/g, "start")
        .replace(/slot="end"/g, "end");
      // Remove ion-label wrappers but keep inner content
      newContent = newContent.replace(/<ion-label[^>]*>/g, "");
      newContent = newContent.replace(/<\/ion-label>/g, "");
      return `<ili-list-item>\n${newContent.trim()}\n</ili-list-item>`;
    }
  );

  // Also handle ion-item with attributes (like lines="none", class, etc.)
  result = result.replace(
    /<ion-item\s+([^>]*)>([\s\S]*?)<\/ion-item>/g,
    (match, attrs, content) => {
      countItem++;
      let newAttrs = attrs
        .replace(/lines="[^"]*"/g, "")
        .replace(/detail="[^"]*"/g, "")
        .replace(/\s+/g, " ")
        .trim();
      let newContent = content
        .replace(/slot="start"/g, "start")
        .replace(/slot="end"/g, "end");
      newContent = newContent.replace(/<ion-label[^>]*>/g, "");
      newContent = newContent.replace(/<\/ion-label>/g, "");
      return `<ili-list-item ${newAttrs}>\n${newContent.trim()}\n</ili-list-item>`;
    }
  );

  // Remove standalone ion-label (not inside ion-item)
  result = result.replace(/<ion-label[^>]*>([\s\S]*?)<\/ion-label>/g, "$1");

  if (countItem > 0) console.log(`  ${filePath}: ${countItem} ion-item → ili-list-item`);
  return result;
}

// ---- Main ----

const allHtmlFiles = [];
for (const mod of MODULES) {
  const files = globSync(`${FEATURES}/${mod}/**/*.html`, { nodir: true });
  allHtmlFiles.push(...files);
}

console.log(`Found ${allHtmlFiles.length} HTML files in purchasing/ + recruitment/\n`);

for (const htmlFile of allHtmlFiles) {
  let html = read(htmlFile);
  if (!html.trim()) continue;

  const shortPath = htmlFile.replace(FEATURES, "features");
  let modified = false;

  // Check what violations exist
  const hasCard = /<p-card[>\s]/.test(html);
  const hasTag = /<p-tag[>\s]/.test(html);
  const hasDialog = /<p-dialog[>\s]/.test(html);
  const hasMessage = /<p-message[>\s]/.test(html);
  const hasFileUpload = /<p-fileupload[>\s]/.test(html);
  const hasIonItem = /<ion-item[>\s]/.test(html);
  const hasIonLabel = /<ion-label[>\s]/.test(html);

  if (!hasCard && !hasTag && !hasDialog && !hasMessage && !hasFileUpload && !hasIonItem && !hasIonLabel) continue;

  const tsFile = getTsFile(htmlFile);
  const ts = read(tsFile);

  // Migrate HTML
  if (hasCard) html = migratePCard(html, shortPath);
  if (hasTag) html = migratePTag(html, shortPath);
  if (hasDialog) html = migratePDialog(html, shortPath);
  if (hasMessage) html = migratePMessage(html, shortPath);
  if (hasFileUpload) html = migratePFileUpload(html, shortPath);
  if (hasIonItem || hasIonLabel) html = migrateIonItems(html, shortPath);

  write(htmlFile, html);
  modified = true;

  // ---- Update TS imports ----
  if (ts.trim()) {
    let newTs = ts;
    let tsModified = false;

    // Determine which wrappers need to be imported
    const needsLxTag = /<lx-tag[>\s]/.test(html);
    const needsLxCard = /<lx-card[>\s]/.test(html);
    const needsLxModal = /<lx-modal[>\s]/.test(html);
    const needsLxMessage = /<lx-message[>\s]/.test(html);
    const needsFileUpload = /<app-file-upload[>\s]/.test(html);
    const needsMobileListItem = /<ili-list-item[>\s]/.test(html);
    const needsAppIcon = /<app-icon[>\s]/.test(html);

    const needsImports = [];
    const removeImports = [];
    const removeFromArray = [];

    if (needsLxTag) {
      needsImports.push([`import { LxTag } from "@ui/adaptive/tag/tag";`, "LxTag"]);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/tag['"]\s*;?/g);
      removeFromArray.push("TagModule");
    }
    if (needsLxCard) {
      needsImports.push([`import { LxCard } from "@ui/adaptive/card/card";`, "LxCard"]);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/card['"]\s*;?/g);
      removeFromArray.push("CardModule");
    }
    if (needsLxModal) {
      needsImports.push([`import { LxModal } from "@ui/adaptive/modal/modal";`, "LxModal"]);
      // Remove both primeng/dialog and primeng/drawer imports
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/dialog['"]\s*;?/g);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/drawer['"]\s*;?/g);
      removeFromArray.push("Dialog", "DialogModule", "Drawer", "DrawerModule");
    }
    if (needsLxMessage) {
      needsImports.push([`import { LxMessage } from "@ui/adaptive/message/message";`, "LxMessage"]);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/messages?['"]\s*;?/g);
      removeFromArray.push("MessageModule", "MessagesModule");
    }
    if (needsFileUpload) {
      needsImports.push([`import { FileUpload } from "@ui/web/file-upload/file-upload";`, "FileUpload"]);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/fileupload['"]\s*;?/g);
      removeFromArray.push("FileUploadModule");
    }
    if (needsMobileListItem) {
      needsImports.push([`import { MobileListItem } from "@ui/mobile/list-item/list-item";`, "MobileListItem"]);
      removeFromArray.push("IonItem", "IonLabel");
    }
    if (needsAppIcon && !hasImport(newTs, "AppIcon")) {
      needsImports.push([`import { AppIcon } from "@ui/shared/app-icon/app-icon.component";`, "AppIcon"]);
    }

    // Remove old PrimeNG import lines
    for (const re of removeImports) {
      newTs = newTs.replace(re, "");
    }

    // Remove IonItem/IonLabel imports from Ionic
    newTs = newTs.replace(/import\s*\{[^}]*\}\s*from\s*['"]@ionic\/angular['"]\s*;?/g, "");

    // Remove from imports array
    for (const name of removeFromArray) {
      newTs = newTs.replace(new RegExp(`,\\s*\\b${name}\\b`, "g"), "");
      newTs = newTs.replace(new RegExp(`\\b${name}\\b,?\\s*`, "g"), "");
    }

    // Clean up empty imports arrays and double commas
    newTs = newTs.replace(/imports:\s*\[\s*\]/g, "imports: []");
    newTs = newTs.replace(/,(\s*)\]/g, "$1]");

    // Add new imports (after last import or before @Component)
    for (const [importStmt, name] of needsImports) {
      if (!hasImport(newTs, name)) {
        // Find the last import line and insert after it
        const lastImport = newTs.lastIndexOf("import ");
        const endOfLine = newTs.indexOf("\n", lastImport);
        if (endOfLine > 0) {
          const afterLine = newTs.slice(endOfLine + 1);
          // If there's a blank line after last import, insert before the blank line
          const blankLineMatch = afterLine.match(/^\s*$/);
          if (blankLineMatch) {
            newTs = newTs.slice(0, endOfLine + 1) + importStmt + "\n" + afterLine;
          } else {
            newTs = newTs.slice(0, endOfLine + 1) + importStmt + "\n" + afterLine;
          }
        }
        tsModified = true;
      }
    }

    // Add to imports array
    for (const [, name] of needsImports) {
      if (hasImport(newTs, name)) {
        // Check if already in imports array
        const importArrayMatch = newTs.match(/imports:\s*\[([^\]]*)\]/);
        if (importArrayMatch) {
          const existing = importArrayMatch[1];
          if (!existing.includes(name)) {
            // Add to the array
            const arrContent = importArrayMatch[1].trim();
            if (arrContent) {
              newTs = newTs.replace(importArrayMatch[0], `imports: [${arrContent}, ${name}]`);
            } else {
              newTs = newTs.replace(importArrayMatch[0], `imports: [${name}]`);
            }
            tsModified = true;
          }
        }
      }
    }

    if (tsModified) {
      write(tsFile, newTs);
      console.log(`  ${shortPath.replace(".html", ".ts")}: imports updated`);
    }
  }

  if (modified) console.log(`✓ ${shortPath}`);
}

console.log("\nDone.");

#!/usr/bin/env node
/**
 * Migrate features/accounting/ from direct PrimeNG/Ionic to shared wrappers.
 *
 * Families: p-tag, p-card, p-dialog, p-drawer, p-message, p-fileupload,
 *           p-select, ion-item/ion-label
 *
 * Usage: node scratchpad/migrate-accounting.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { globSync } from "glob";

const FEATURES = "D:/repos/luxuryapp-api/client/angular/src/app/features";
const ACCOUNTING = `${FEATURES}/accounting`;

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

// Normalize multiline attributes in HTML snippets
function normalizeAttrs(attrs) {
  return attrs
    .replace(/\r?\n\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---- Migrators ----

function migratePCard(html) {
  let result = html;

  // Cases with ng-template #content (unwrap content)
  result = result.replace(
    /<p-card\s+class="([^"]*)"[\s\S]*?>[\s\S]*?<ng-template\s+#content>([\s\S]*?)<\/ng-template>[\s\S]*?<\/p-card>/g,
    (match, cls, content) => {
      const hasP0 = /p-0/.test(cls);
      const padded = hasP0 ? ' [padded]="false"' : '';
      return `<lx-card${padded}>\n${content.trim()}\n</lx-card>`;
    }
  );

  // Cases with class="p-0" but no ng-template
  result = result.replace(
    /<p-card\s+class="([^"]*p-0[^"]*)"[\s\S]*?>([\s\S]*?)<\/p-card>/g,
    (match, cls, content) => {
      return `<lx-card [padded]="false">\n${content.trim()}\n</lx-card>`;
    }
  );

  // Cases with other class attributes
  result = result.replace(
    /<p-card\s+class="([^"]*)"[\s\S]*?>([\s\S]*?)<\/p-card>/g,
    (match, cls, content) => {
      if (/p-0/.test(cls)) return match;
      return `<lx-card class="${cls}">\n${content.trim()}\n</lx-card>`;
    }
  );

  // Cases with non-class attributes (e.g. header=) but no class=
  result = result.replace(
    /<p-card\s+([\s\S]*?)>([\s\S]*?)<\/p-card>/g,
    (match, attrs, content) => {
      if (/class\s*=/.test(attrs)) return match;
      return `<lx-card>\n${content.trim()}\n</lx-card>`;
    }
  );

  // Plain p-card with no attributes
  result = result.replace(
    /<p-card>([\s\S]*?)<\/p-card>/g,
    (match, content) => {
      return `<lx-card>\n${content.trim()}\n</lx-card>`;
    }
  );

  return result;
}

function migratePTag(html) {
  let result = html;
  let count = 0;

  result = result.replace(
    /<p-tag\s+([\s\S]*?)\s*(\/>|>[\s\S]*?<\/p-tag>)/g,
    (match, attrs, closer) => {
      count++;
      let newAttrs = attrs
        .replace(/\bpTooltip\b/g, "tooltip")
        .replace(/\bborder-round\b/g, "rounded")
        .replace(/fluid\s*/g, "")
        .replace(/\r?\n\s*/g, " ")
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

  return result;
}

function migratePDialog(html) {
  let result = html;

  result = result.replace(
    /<p-dialog\s+([\s\S]*?)>([\s\S]*?)<\/p-dialog>/g,
    (match, attrs, content) => {
      let newAttrs = attrs
        .replace(/\(onDialogHide\)/g, "(dismiss)")
        .replace(/\[style\]="[^"]*"/g, "")
        .replace(/style="[^"]*"/g, "")
        .replace(/\[modal\]="[^"]*"/g, "")
        .replace(/\[dismissableMask\]="[^"]*"/g, "")
        .replace(/\[draggable\]="[^"]*"/g, "")
        .replace(/\[resizable\]="[^"]*"/g, "")
        .replace(/\[position\]="[^"]*"/g, "")
        .replace(/\[breakpoints\]="[^"]*"/g, "")
        .replace(/\[maximizable\]="[^"]*"/g, "")
        .replace(/\[blockScroll\]="[^"]*"/g, "")
        .replace(/\[closeOnEscape\]="[^"]*"/g, "")
        .replace(/\[focusOnShow\]="[^"]*"/g, "")
        .replace(/\[baseZIndex\]="[^"]*"/g, "")
        .replace(/\[autoZIndex\]="[^"]*"/g, "")
        .replace(/\r?\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return `<lx-modal ${newAttrs}>\n${content.trim()}\n</lx-modal>`;
    }
  );

  return result;
}

function migratePDrawer(html) {
  let result = html;

  result = result.replace(
    /<p-drawer\s+([\s\S]*?)>([\s\S]*?)<\/p-drawer>/g,
    (match, attrs, content) => {
      let newAttrs = attrs
        .replace(/\r?\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return `<lx-sidebar ${newAttrs}>\n${content.trim()}\n</lx-sidebar>`;
    }
  );

  return result;
}

function migratePMessage(html) {
  let result = html;

  // Self-closing p-message
  result = result.replace(
    /<p-message\s+([\s\S]*?)\s*\/>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/\(onClose\)/g, "(close)")
        .replace(/\(onClick\)/g, "(click)")
        .replace(/\r?\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return `<lx-message ${newAttrs} />`;
    }
  );

  // Non-self-closing p-message
  result = result.replace(
    /<p-message\s+([\s\S]*?)>([\s\S]*?)<\/p-message>/g,
    (match, attrs, content) => {
      let newAttrs = attrs
        .replace(/\(onClose\)/g, "(close)")
        .replace(/\(onClick\)/g, "(click)")
        .replace(/\r?\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const trimmed = content.trim();
      if (!trimmed) return `<lx-message ${newAttrs} />`;
      return `<lx-message ${newAttrs}>${trimmed}</lx-message>`;
    }
  );

  return result;
}

function migratePFileUpload(html) {
  let result = html;

  result = result.replace(
    /<p-fileupload\s+([\s\S]*?)>([\s\S]*?)<\/p-fileupload>/g,
    (match, attrs, content) => {
      return `<app-file-upload ${attrs.trim()}>${content}</app-file-upload>`;
    }
  );
  result = result.replace(
    /<p-fileupload\s+([\s\S]*?)\s*\/>/g,
    (match, attrs) => {
      return `<app-file-upload ${attrs.trim()} />`;
    }
  );

  return result;
}

function migratePSelect(html) {
  let result = html;

  result = result.replace(
    /<p-select\s+([\s\S]*?)>([\s\S]*?)<\/p-select>/g,
    (match, attrs, content) => {
      let newAttrs = attrs
        .replace(/\boptions\b/g, "data")
        .replace(/\[optionLabel\]="'([^']*)'"/g, 'optionLabel="$1"')
        .replace(/\[optionValue\]="'([^']*)'"/g, 'optionValue="$1"')
        .replace(/\r?\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return `<custom-input-select-signal ${newAttrs}>\n${content.trim()}\n</custom-input-select-signal>`;
    }
  );
  result = result.replace(
    /<p-select\s+([\s\S]*?)\s*\/>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/\boptions\b/g, "data")
        .replace(/\[optionLabel\]="'([^']*)'"/g, 'optionLabel="$1"')
        .replace(/\[optionValue\]="'([^']*)'"/g, 'optionValue="$1"')
        .replace(/\r?\n\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return `<custom-input-select-signal ${newAttrs} />`;
    }
  );

  return result;
}

function migrateIonItems(html) {
  let result = html;

  // ion-item with attributes
  result = result.replace(
    /<ion-item\s+([^>]*)>([\s\S]*?)<\/ion-item>/g,
    (match, attrs, content) => {
      let newAttrs = attrs
        .replace(/lines="[^"]*"/g, "")
        .replace(/detail="[^"]*"/g, "")
        .replace(/\r?\n\s*/g, " ")
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

  // ion-item without attributes
  result = result.replace(
    /<ion-item>([\s\S]*?)<\/ion-item>/g,
    (match, content) => {
      let newContent = content
        .replace(/slot="start"/g, "start")
        .replace(/slot="end"/g, "end");
      newContent = newContent.replace(/<ion-label[^>]*>/g, "");
      newContent = newContent.replace(/<\/ion-label>/g, "");
      return `<ili-list-item>\n${newContent.trim()}\n</ili-list-item>`;
    }
  );

  // Remove standalone ion-label
  result = result.replace(/<ion-label[^>]*>([\s\S]*?)<\/ion-label>/g, "$1");

  return result;
}

// ---- Main ----

console.log("Scanning accounting/ for violations...\n");

const allHtmlFiles = globSync(`${ACCOUNTING}/**/*.html`, { nodir: true });
console.log(`Found ${allHtmlFiles.length} HTML files in accounting/\n`);

for (const htmlFile of allHtmlFiles) {
  let html = read(htmlFile);
  if (!html.trim()) continue;

  const shortPath = htmlFile.replace(FEATURES, "features");

  // Check violations
  const hasCard = /<p-card[>\s]/.test(html);
  const hasTag = /<p-tag[>\s]/.test(html);
  const hasDialog = /<p-dialog[>\s]/.test(html);
  const hasDrawer = /<p-drawer[>\s]/.test(html);
  const hasMessage = /<p-message[>\s]/.test(html);
  const hasFileUpload = /<p-fileupload[>\s]/.test(html);
  const hasSelect = /<p-select[>\s]/.test(html);
  const hasIonItem = /<ion-item[>\s]/.test(html);
  const hasIonLabel = /<ion-label[>\s]/.test(html);

  if (!hasCard && !hasTag && !hasDialog && !hasDrawer && !hasMessage && !hasFileUpload && !hasSelect && !hasIonItem && !hasIonLabel) continue;

  // Normalize multiline closing tags globally before any migration
  html = html.replace(/<\/(p-message|p-tag|p-card|p-dialog|p-drawer|p-fileupload|p-select|ion-item|ion-label)\s+>/g, "</$1>");

  const tsFile = getTsFile(htmlFile);
  let ts = read(tsFile);

  // Migrate HTML
  if (hasCard) html = migratePCard(html);
  if (hasTag) html = migratePTag(html);
  if (hasDialog) html = migratePDialog(html);
  if (hasDrawer) html = migratePDrawer(html);
  if (hasMessage) html = migratePMessage(html);
  if (hasFileUpload) html = migratePFileUpload(html);
  if (hasSelect) html = migratePSelect(html);
  if (hasIonItem || hasIonLabel) html = migrateIonItems(html);

  // Post-migration cleanup: strip attrs not supported by wrappers
  html = html.replace(/<lx-modal\s+([\s\S]*?)>/g, (match, attrs) => {
    let cleaned = attrs
      .replace(/\[modal\]="[^"]*"/g, "")
      .replace(/\[maximizable\]="[^"]*"/g, "")
      .replace(/\[resizable\]="[^"]*"/g, "")
      .replace(/\[draggable\]="[^"]*"/g, "")
      .replace(/\[dismissableMask\]="[^"]*"/g, "")
      .replace(/\[position\]="[^"]*"/g, "")
      .replace(/\[breakpoints\]="[^"]*"/g, "")
      .replace(/\[blockScroll\]="[^"]*"/g, "")
      .replace(/\[closeOnEscape\]="[^"]*"/g, "")
      .replace(/\[focusOnShow\]="[^"]*"/g, "")
      .replace(/\[baseZIndex\]="[^"]*"/g, "")
      .replace(/\[autoZIndex\]="[^"]*"/g, "")
      .replace(/appendTo="[^"]*"/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return `<lx-modal ${cleaned}>`;
  });
  html = html.replace(/<lx-sidebar\s+([\s\S]*?)>/g, (match, attrs) => {
    let cleaned = attrs
      .replace(/\[blockScroll\]="[^"]*"/g, "")
      .replace(/\[dismissable\]="[^"]*"/g, "")
      .replace(/appendTo="[^"]*"/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return `<lx-sidebar ${cleaned}>`;
  });

  write(htmlFile, html);

  // ---- Update TS imports ----
  if (ts.trim()) {
    let newTs = ts;
    let tsModified = false;

    // Determine which wrappers are needed in the template
    const needsLxTag = /<lx-tag[>\s]/.test(html);
    const needsLxCard = /<lx-card[>\s]/.test(html);
    const needsLxModal = /<lx-modal[>\s]/.test(html);
    const needsLxSidebar = /<lx-sidebar[>\s]/.test(html);
    const needsLxMessage = /<lx-message[>\s]/.test(html);
    const needsFileUpload = /<app-file-upload[>\s]/.test(html);
    const needsInputSelect = /<custom-input-select-signal[>\s]/.test(html);
    const needsMobileListItem = /<ili-list-item[>\s]/.test(html);
    const needsAppIcon = /<app-icon[>\s]/.test(html);
    const needsWebButtonLabel = /<il-button[>\s]/.test(html);

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
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/dialog['"]\s*;?/g);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/drawer['"]\s*;?/g);
      removeFromArray.push("Dialog", "DialogModule", "Drawer", "DrawerModule");
    }
    if (needsLxSidebar) {
      needsImports.push([`import { LxSidebar } from "@ui/adaptive/sidebar/sidebar";`, "LxSidebar"]);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/sidebar['"]\s*;?/g);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/drawer['"]\s*;?/g);
      removeFromArray.push("Sidebar", "SidebarModule", "Drawer", "DrawerModule");
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
    if (needsInputSelect) {
      needsImports.push([`import { InputSelect } from "@ui/inputs/adaptive/input-select/input-select";`, "InputSelect"]);
      removeImports.push(/import\s*\{[^}]*\}\s*from\s*['"]primeng\/select['"]\s*;?/g);
      removeFromArray.push("SelectModule");
    }
    if (needsMobileListItem) {
      needsImports.push([`import { MobileListItem } from "@ui/mobile/list-item/list-item";`, "MobileListItem"]);
      removeFromArray.push("IonItem", "IonLabel");
    }
    if (needsAppIcon && !hasImport(newTs, "AppIcon")) {
      needsImports.push([`import { AppIcon } from "@ui/shared/app-icon/app-icon.component";`, "AppIcon"]);
    }
    if (needsWebButtonLabel && !hasImport(newTs, "WebButtonLabel")) {
      // Don't add by default - only if not already imported
      // WebButtonLabel might already be imported under @ui/buttons/web-label/button
    }

    // Remove old PrimeNG import lines
    for (const re of removeImports) {
      newTs = newTs.replace(re, "");
    }

    // Remove IonItem/IonLabel imports from Ionic
    newTs = newTs.replace(/import\s*\{[^}]*\}\s*from\s*['"]@ionic\/angular['"]\s*;?/g, "");

    // Remove module names from imports: [ ] array only (not from import {} statements)
    const importArrayRegex = /(imports:\s*\[)([^\]]*)(\])/;
    const importArrMatch = newTs.match(importArrayRegex);
    if (importArrMatch && removeFromArray.length > 0) {
      let arrContent = importArrMatch[2];
      for (const name of removeFromArray) {
        arrContent = arrContent
          .replace(new RegExp(`,\\s*\\b${name}\\b`, "g"), "")
          .replace(new RegExp(`\\b${name}\\b,?\\s*`, "g"), "");
      }
      arrContent = arrContent.replace(/,(\s*)\]/g, "$1]").trim();
      newTs = newTs.replace(importArrayRegex, `$1${arrContent}$3`);
    }

    // Clean up empty imports arrays and double commas
    newTs = newTs.replace(/imports:\s*\[\s*\]/g, "imports: []");

    // Add new imports — find the LAST complete import statement (ending with ;)
    const importEndRegex = /import\s[^;]+;/g;
    const allImports = [...newTs.matchAll(importEndRegex)];
    let insertPos = 0;
    if (allImports.length > 0) {
      const lastMatch = allImports[allImports.length - 1];
      insertPos = lastMatch.index + lastMatch[0].length;
    }

    for (const [importStmt, name] of needsImports) {
      if (!hasImport(newTs, name)) {
        if (insertPos > 0) {
          const before = newTs.slice(0, insertPos);
          const after = newTs.slice(insertPos);
          newTs = before + "\n" + importStmt + after;
          insertPos += importStmt.length + 1;
        }
        tsModified = true;
      }
    }

    // Add to imports array
    const finalArrMatch = newTs.match(importArrayRegex);
    if (finalArrMatch) {
      let arrContent = finalArrMatch[2];
      for (const [, name] of needsImports) {
        if (hasImport(newTs, name) && !arrContent.includes(name)) {
          const trimmed = arrContent.trim();
          if (trimmed) {
            arrContent = `${trimmed}, ${name}`;
          } else {
            arrContent = name;
          }
          tsModified = true;
        }
      }
      if (tsModified) {
        newTs = newTs.replace(importArrayRegex, `$1${arrContent}$3`);
      }
    }

    if (tsModified) {
      write(tsFile, newTs);
      console.log(`  ↑ ${shortPath.replace(".html", ".ts")}: imports`);
    }
  }

  console.log(`✓ ${shortPath}`);
}

console.log("\nDone.");

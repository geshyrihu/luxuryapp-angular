#!/usr/bin/env node
/**
 * Migrate HTML: p-tag → lx-tag, p-card → lx-card, p-dialog → lx-modal, p-drawer → lx-sidebar
 * in features/system/ and features/hr/ (excluding catalog-component-ui).
 * 
 * TS imports were already migrated by a previous step.
 */

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const ROOT = 'D:/repos/luxuryapp-api/client/angular/src/app/features';
const DIRS = ['system', 'hr'];

function read(path) { return readFileSync(path, 'utf-8'); }
function write(path, content) { writeFileSync(path, content, 'utf-8'); }

// ---------------------------------------------------------------------------
// Transformers
// ---------------------------------------------------------------------------

function fixVisibleBinding(html) {
  // [visible]="expr" (visibleChange)="setter" → [(visible)]="expr"
  // Matches patterns like:
  // [visible]="inactivosVisible()" (visibleChange)="inactivosVisible.set($event)"
  // [visible]="drawerVisible()" (visibleChange)="drawerVisible.set($event)"
  // But NOT [visible]="true" (visibleChange)="..." (simple constant)
  return html.replace(
    /\[visible\]="([^"]+)"\s+\(visibleChange\)="\w+\.set\(\$event\)"/g,
    '[(visible)]="$1"'
  );
}

function removeAttrs(html, attrs) {
  // Remove attributes like [modal]="true" [style]="{...}" [draggable]="false"
  for (const attr of attrs) {
    // Match [attrName]="anyContent" with optional spaces before
    const re = new RegExp(`\\s+${attr}="[^"]*"`, 'g');
    html = html.replace(re, '');
  }
  return html;
}

function transformTag(html) {
  const original = html;
  // p-tag → lx-tag
  html = html.replace(/<p-tag\b/gi, '<lx-tag');
  html = html.replace(/<\/p-tag>/gi, '</lx-tag>');
  
  // p-tooltip → tooltip
  html = html.replace(/\[pTooltip\]/g, '[tooltip]');
  
  // Remove tooltipPosition="..."
  html = html.replace(/\s+tooltipPosition="[^"]*"/g, '');
  
  return html;
}

function transformCard(html) {
  // p-card → lx-card
  html = html.replace(/<p-card\b/gi, '<lx-card');
  html = html.replace(/<\/p-card>/gi, '</lx-card>');
  
  // If p-card had shadow classes, add [elevated]="true"
  // Check if the tag has class containing 'shadow'
  // We do a simple check: if <lx-card ... class="...shadow...", add elevated
  html = html.replace(
    /<lx-card([^>]*class="[^"]*shadow[^"]*"[^>]*)>/g,
    '<lx-card$1 [elevated]="true">'
  );
  
  return html;
}

function transformDialog(html) {
  html = html.replace(/<p-dialog\b/gi, '<lx-modal');
  html = html.replace(/<\/p-dialog>/gi, '</lx-modal>');
  
  // Fix visible binding
  html = fixVisibleBinding(html);
  
  // Remove specific p-dialog attributes
  html = removeAttrs(html, ['\\[modal\\]', '\\[style\\]', '\\[draggable\\]', '\\[resizable\\]', '\\[closable\\]']);
  
  return html;
}

function transformDrawer(html) {
  html = html.replace(/<p-drawer\b/gi, '<lx-sidebar');
  html = html.replace(/<\/p-drawer>/gi, '</lx-sidebar>');
  
  // Fix visible binding
  html = fixVisibleBinding(html);
  
  // Remove specific p-drawer attributes
  html = removeAttrs(html, ['\\[style\\]', '\\[closable\\]']);
  
  return html;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let totalFiles = 0;
let stats = { tag: 0, card: 0, dialog: 0, drawer: 0 };

for (const dir of DIRS) {
  const pattern = `${ROOT}/${dir}/**/*.html`;
  const files = globSync(pattern, { nodir: true });
  
  for (const file of files) {
    // Skip catalog-component-ui
    if (file.includes('catalog-component-ui')) continue;
    
    let html = read(file);
    let changed = false;
    let original = html;
    
    if (/<p-tag\b/i.test(html)) {
      html = transformTag(html);
      stats.tag++;
      changed = true;
    }
    if (/<p-card\b/i.test(html)) {
      html = transformCard(html);
      stats.card++;
      changed = true;
    }
    if (/<p-dialog\b/i.test(html)) {
      html = transformDialog(html);
      stats.dialog++;
      changed = true;
    }
    if (/<p-drawer\b/i.test(html)) {
      html = transformDrawer(html);
      stats.drawer++;
      changed = true;
    }
    
    if (changed) {
      write(file, html);
      totalFiles++;
      console.log(`✓ ${file.replace(ROOT, 'features')}`);
    }
  }
}

console.log('\n--- Done ---');
console.log(`Files modified: ${totalFiles}`);
console.log(`p-tag → lx-tag: ${stats.tag} files`);
console.log(`p-card → lx-card: ${stats.card} files`);
console.log(`p-dialog → lx-modal: ${stats.dialog} files`);
console.log(`p-drawer → lx-sidebar: ${stats.drawer} files`);

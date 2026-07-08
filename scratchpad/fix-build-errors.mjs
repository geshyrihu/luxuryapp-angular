#!/usr/bin/env node
/**
 * Fix build errors caused by incomplete TS migration:
 * 1. CardModule/TagModule references in imports[] without actual import line
 * 2. [(visible)]="signal()" two-way binding → [visible] + (visibleChange)
 * 3. Duplicate import lines
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { globSync } from 'glob';

const ROOT = 'D:/repos/luxuryapp-api/client/angular/src/app/features';

// ---------------------------------------------------------------------------
// Fix 1: Replace CardModule → LxCard, TagModule → LxTag in imports arrays
//        where the import statement no longer exists
// ---------------------------------------------------------------------------

const FILES_WITH_CARDMODULE = [
  'hr/expediente-del-empleado/employees/employee-internal/pages/employee-avatar-form.ts',
  'hr/expediente-del-empleado/hr-employees/employee-internal/pages/employee-avatar-form.ts',
  'hr/expediente-del-empleado/employees/employees/pages/card-employee.ts',
  'hr/expediente-del-empleado/hr-employees/employees/pages/card-employee.ts',
  'hr/expediente-del-empleado/recursos-humanos/leave-request-approval/permiso-detalle-aprobar.ts',
  'hr/expediente-del-empleado/recursos-humanos/vacation-request-approval/vacacion-solicitud-detalle.ts',
  'system/access/application-user/pages/update-password-account.ts',
  'system/access/user-profile/update-user-photo.ts',
];

const FILES_WITH_TAGMODULE = [
  'hr/expediente-del-empleado/recursos-humanos/calendario-vacaciones-permisos/modal-permiso-detalle.ts',
  'hr/expediente-del-empleado/recursos-humanos/calendario-vacaciones-permisos/modal-vacacion-detalle.ts',
  'hr/expediente-del-empleado/recursos-humanos/leave-request/mi-permiso-detalle.ts',
];

function fixImportsArray(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let changed = false;

  // Replace CardModule → LxCard in imports array
  if (content.includes('CardModule')) {
    content = content.replace(/\bCardModule\b/g, 'LxCard');
    changed = true;
  }

  // Replace TagModule → LxTag in imports array
  if (content.includes('TagModule')) {
    content = content.replace(/\bTagModule\b/g, 'LxTag');
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ Fixed imports in ${filePath.replace(ROOT, 'features')}`);
  }
}

// ---------------------------------------------------------------------------
// Fix 2: [(visible)]="signal()" → [visible]="signal()" (visibleChange)="signal.set($event)"
// ---------------------------------------------------------------------------

const filesWithLxModalOrSidebar = globSync(`${ROOT}/**/*.html`, { nodir: true })
  .filter(f => !f.includes('catalog-component-ui'));

function fixTwoWayBindings(html) {
  // [(visible)]="something()" → [visible]="something()" (visibleChange)="something.set($event)"
  // But we need to extract the signal name from the expression
  return html.replace(
    /\[\(visible\)\]="(\w+)\(\)"/g,
    '[visible]="$1()" (visibleChange)="$1.set($event)"'
  );
}

// ---------------------------------------------------------------------------
// Fix 3: Duplicate CommonModule/JsonPipe imports
// ---------------------------------------------------------------------------

function fixDuplicateImports(content) {
  // Check if there are duplicate import lines from @angular/common
  const lines = content.split('\n');
  const seen = new Set();
  const result = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // If it's an import from @angular/common, check for duplicates
    if (trimmed.startsWith('import {') && trimmed.includes('@angular/common')) {
      if (seen.has('@angular/common')) {
        // Skip duplicate
        console.log('  Removed duplicate @angular/common import');
        continue;
      }
      seen.add('@angular/common');
    }
    result.push(line);
  }
  
  return result.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('=== Fix 1: CardModule/TagModule in imports[] ===');
for (const file of [...FILES_WITH_CARDMODULE, ...FILES_WITH_TAGMODULE]) {
  const fullPath = `${ROOT}/${file}`;
  if (existsSync(fullPath)) {
    fixImportsArray(fullPath);
  } else {
    console.log(`  ✗ NOT FOUND: ${file}`);
  }
}

console.log('\n=== Fix 2: Two-way binding signal() → [visible] + (visibleChange) ===');
let fix2Count = 0;
for (const file of filesWithLxModalOrSidebar) {
  let html = readFileSync(file, 'utf-8');
  const original = html;
  html = fixTwoWayBindings(html);
  if (html !== original) {
    writeFileSync(file, html, 'utf-8');
    fix2Count++;
    console.log(`  ✓ Fixed two-way binding in ${file.replace(ROOT, 'features')}`);
  }
}
console.log(`  Total files fixed: ${fix2Count}`);

console.log('\n=== Fix 3: Duplicate imports ===');
const updateDbFile = `${ROOT}/system/test/test/update-data-base/update-data-base.ts`;
if (existsSync(updateDbFile)) {
  let content = readFileSync(updateDbFile, 'utf-8');
  let after = fixDuplicateImports(content);
  if (after !== content) {
    writeFileSync(updateDbFile, after, 'utf-8');
    console.log('  ✓ Fixed duplicate imports');
  } else {
    console.log('  No duplicates found');
  }
}

// Also check infrastructure copy
const infraDbFile = `${ROOT}/system/infrastructure/debug/test/update-data-base/update-data-base.ts`;
if (existsSync(infraDbFile)) {
  let content = readFileSync(infraDbFile, 'utf-8');
  let after = fixDuplicateImports(content);
  if (after !== content) {
    writeFileSync(infraDbFile, after, 'utf-8');
    console.log('  ✓ Fixed duplicate imports in infra copy');
  } else {
    console.log('  No duplicates in infra copy');
  }
}

console.log('\nDone!');

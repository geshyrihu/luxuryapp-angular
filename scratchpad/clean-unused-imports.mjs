#!/usr/bin/env node
/**
 * Remove unused LxCard/LxTag/LxModal imports from TS files
 * where the corresponding HTML template doesn't use the component.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { globSync } from 'glob';

const ROOT = 'D:/repos/luxuryapp-api/client/angular/src/app/features';
const DIRS = ['system', 'hr'];

const IMPORT_MAP = {
  LxCard: { importPath: '@ui/adaptive/card/card', tag: 'lx-card' },
  LxTag: { importPath: '@ui/adaptive/tag/tag', tag: 'lx-tag' },
  LxModal: { importPath: '@ui/adaptive/modal/modal', tag: 'lx-modal' },
};

const allFiles = new Set();
for (const dir of DIRS) {
  const files = globSync(`${ROOT}/${dir}/**/*.ts`, { nodir: true });
  for (const f of files) allFiles.add(f);
}

for (const tsFile of allFiles) {
  let content = readFileSync(tsFile, 'utf-8');
  let modified = false;

  const htmlFile = tsFile.replace(/\.ts$/, '.html');
  let htmlContent = '';
  if (existsSync(htmlFile)) {
    htmlContent = readFileSync(htmlFile, 'utf-8');
  }

  for (const [component, info] of Object.entries(IMPORT_MAP)) {
    // Check if this component is imported
    const importRegex = new RegExp(`import\\s*\\{[^}]*\\b${component}\\b[^}]*\\}\\s*from\\s*["']${info.importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'm');
    if (!importRegex.test(content)) continue;

    // Check if the tag is used in HTML
    const tagUsed = htmlContent.includes(`<${info.tag}`);

    if (!tagUsed) {
      // Remove the import line
      content = content.replace(importRegex, '');
      // Remove from imports array: ", LxCard" or "LxCard," or "LxCard "
      content = content.replace(new RegExp(`,\\s*\\b${component}\\b`, 'g'), '');
      content = content.replace(new RegExp(`\\b${component}\\b,?\\s*`, 'g'), '');
      // Clean up empty imports arrays and double commas
      content = content.replace(/imports:\s*\[\s*\]/g, 'imports: []');
      content = content.replace(/,(\s*)\]/g, '$1]');
      modified = true;
      const shortPath = tsFile.replace(ROOT, 'features');
      console.log(`  Removed ${component} from ${shortPath}`);
    }
  }

  if (modified) {
    writeFileSync(tsFile, content, 'utf-8');
  }
}

console.log('\nDone cleaning unused imports.');

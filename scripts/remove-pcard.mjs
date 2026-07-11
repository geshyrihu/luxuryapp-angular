import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  // HTML logic removed to prevent breaking ng-template tags.
  // There are 0 p-card usages in the codebase.
}
function processTs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Remover import de CardModule
  content = content.replace(/import\s+{\s*CardModule\s*}\s+from\s+["']primeng\/card["'];?\r?\n?/g, '');
  
  // Remover de imports array
  content = content.replace(/CardModule\s*,?\s*/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modificado TS:', filePath);
  }
}

const files = process.argv.slice(2);
files.forEach(f => {
  if (f.endsWith('.html')) processFile(f);
  if (f.endsWith('.ts')) processTs(f);
});

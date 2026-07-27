import fs from 'fs/promises';
import { globSync } from 'glob';
import path from 'path';

const SRC_DIR = path.resolve('src');

// Patrones a reemplazar con seguridad
const REPLACEMENTS = [
  { regex: /\bborder-round-sm\b/g, replace: 'rounded-sm' },
  { regex: /\bborder-round-md\b/g, replace: 'rounded-md' },
  { regex: /\bborder-round-lg\b/g, replace: 'rounded-lg' },
  { regex: /\bborder-round-xl\b/g, replace: 'rounded-xl' },
  { regex: /\bborder-round\b/g, replace: 'rounded' },
  
  { regex: /\bshadow-[1-2]\b/g, replace: 'shadow-sm' },
  { regex: /\bshadow-[3-4]\b/g, replace: 'shadow' },
  { regex: /\bshadow-[5-6]\b/g, replace: 'shadow-md' },
  { regex: /\bshadow-[7-8]\b/g, replace: 'shadow-lg' },
  
  { regex: /\bp-flex\b/g, replace: 'flex' },
  { regex: /\bp-grid\b/g, replace: 'grid grid-cols-12' },
  { regex: /\bp-col-([0-9]+)\b/g, replace: 'col-span-$1' }
];

async function runAutoFix() {
  console.log('🔧 Iniciando Auto-Fix de Clases CSS Legacy...');
  
  const files = globSync('**/*.{html,ts,scss}', {
    cwd: SRC_DIR,
    ignore: ['**/node_modules/**', '**/dist/**']
  });
  
  let filesModified = 0;
  
  for (const relativePath of files) {
    const filePath = path.resolve(SRC_DIR, relativePath);
    const content = await fs.readFile(filePath, 'utf-8');
    let newContent = content;
    let changed = false;
    
    for (const rule of REPLACEMENTS) {
      if (rule.regex.test(newContent)) {
        newContent = newContent.replace(rule.regex, rule.replace);
        changed = true;
      }
    }
    
    if (changed) {
      await fs.writeFile(filePath, newContent, 'utf-8');
      filesModified++;
    }
  }
  
  console.log(`✅ Auto-Fix completado. Se modificaron ${filesModified} archivos de forma segura.`);
}

runAutoFix().catch(err => {
  console.error('Error durante el auto-fix:', err);
  process.exit(1);
});

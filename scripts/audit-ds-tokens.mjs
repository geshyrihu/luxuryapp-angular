import fs from 'fs/promises';
import path from 'path';
import { globSync } from 'glob';

// Define the patterns we want to forbid in application code
const HARDCODED_COLOR_REGEX = /(color|background(-color)?|border(-color)?|fill|stroke):\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\))/gi;

// Ignored files (e.g. legacy files that we know are bad but can't fix right now)
const IGNORE_FILES = [
  // example: 'src/app/legacy/old-component.scss'
];

async function runAudit() {
  console.log('🔍 Iniciando auditoría de Design System Tokens...');
  
  // Find all component SCSS files
  const files = globSync('src/app/**/*.scss', { ignore: 'node_modules/**' });
  
  let totalErrors = 0;
  
  for (const file of files) {
    // Skip ignored files
    if (IGNORE_FILES.some(ignorePath => file.includes(ignorePath))) {
      continue;
    }

    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip if the line has an explicit ignore comment
      if (line.includes('// ds-ignore')) continue;
      // Skip if the previous line has an explicit ignore comment
      if (i > 0 && lines[i - 1].includes('// ds-ignore')) continue;

      let match;
      // We need to match globally across the line. We must reset lastIndex.
      HARDCODED_COLOR_REGEX.lastIndex = 0;
      while ((match = HARDCODED_COLOR_REGEX.exec(line)) !== null) {
        console.error(`❌ [Token Violation] Color hardcodeado encontrado en ${file}:${i + 1}`);
        console.error(`   > ${line.trim()}`);
        console.error(`   💡 Recomendación: Usa var(--ds-*) o una variable de PrimeNG.`);
        totalErrors++;
      }
    }
  }

  if (totalErrors > 0) {
    console.error(`\n🚨 Auditoría fallida: Se encontraron ${totalErrors} violaciones a los tokens de diseño.`);
    console.error(`Por favor, reemplaza los valores hardcodeados por variables del Design System o agrega '// ds-ignore' al final de la línea si es intencional.`);
    process.exit(1);
  } else {
    console.log('\n✅ Auditoría superada: No se detectaron colores hardcodeados en los componentes.');
  }
}

runAudit().catch(err => {
  console.error('Error fatal durante la auditoría:', err);
  process.exit(1);
});

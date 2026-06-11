import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Script de auditoría para detectar caracteres corruptos (Mojibake).
 * Acepta un directorio como argumento (por defecto el actual).
 */

const MOJIBAKE_REGEX = /\u00C3\u0192\u00C2[\u00A1\u00A9\u00AD\u00B3\u00BA\u00B1]|\u00C3\u0192\u00C3\u2013|\u00C3\u0192\u00C6\u2019\u00C3\u201A/;

const EXTENSIONS = ['.ts', '.html', '.json', '.scss', '.cs', '.cshtml', '.js', '.md'];
const IGNORE_DIRS = ['node_modules', '.git', '.angular', 'dist', 'bin', 'obj', '.venv', '__pycache__'];

let errorsFound = 0;

function checkFiles(dir) {
  let files;
  try {
    files = readdirSync(dir);
  } catch (err) {
    return;
  }
  
  for (const file of files) {
    const path = join(dir, file);
    let stats;
    try {
      stats = statSync(path);
    } catch (err) {
      continue;
    }

    if (stats.isDirectory()) {
      if (!IGNORE_DIRS.some(d => path.includes(d))) checkFiles(path);
    } else if (EXTENSIONS.some(ext => path.endsWith(ext))) {
      try {
        const content = readFileSync(path, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (MOJIBAKE_REGEX.test(line)) {
            if (path.includes('audit-encoding.mjs')) return;
            console.error(`❌ [ERROR ENCODING] ${path}:${index + 1}`);
            console.error(`   Línea: "${line.trim()}"\n`);
            errorsFound++;
          }
        });
      } catch (err) {
      }
    }
  }
}

const targetDir = process.argv[2] || '.';
console.log(`🔍 Iniciando auditoría de codificación en: ${resolve(targetDir)}`);
checkFiles(targetDir);

if (errorsFound > 0) {
  console.error(`\nTotal de errores de codificación encontrados: ${errorsFound}`);
  process.exit(1);
} else {
  console.log("✅ No se detectaron errores de codificación.");
  process.exit(0);
}

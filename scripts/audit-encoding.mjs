import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Script de auditoría para detectar caracteres corruptos (Mojibake).
 * Busca patrones resultantes de interpretar UTF-8 como ISO-8859-1.
 */

// Patrones de caracteres corruptos (Mojibake)
// Detecta: Ã¡ (á), Ã© (é), Ã­ (í), Ã³ (ó), Ãº (ú), Ã± (ñ), Â¿ (¿), Â¡ (¡), ÃƒÂ (doble encoding)
const MOJIBAKE_REGEX = /Ã[¡©³±­±]|Â¿|Â¡|ÃƒÂ|Ã±|Ã“|Ãš|Ã‰|Ã/;
const EXTENSIONS = ['.ts', '.html', '.json', '.scss'];
const IGNORE_DIRS = ['node_modules', '.git', '.angular', 'dist'];

let errorsFound = 0;

function checkFiles(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const path = join(dir, file);
    const stats = statSync(path);
    
    if (stats.isDirectory()) {
      if (!IGNORE_DIRS.some(d => path.includes(d))) checkFiles(path);
    } else if (EXTENSIONS.some(ext => path.endsWith(ext))) {
      try {
        const content = readFileSync(path, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (MOJIBAKE_REGEX.test(line)) {
            // Ignorar el propio regex de este script si se auto-analiza
            if (path.includes('audit-encoding.mjs')) return;
            
            console.error(`❌ [ERROR ENCODING] ${path}:${index + 1}`);
            console.error(`   Línea: "${line.trim()}"\n`);
            errorsFound++;
          }
        });
      } catch (err) {
        console.error(`Error leyendo archivo ${path}: ${err.message}`);
      }
    }
  }
}

console.log("🔍 Iniciando auditoría de codificación UTF-8...");
checkFiles('./src');
// También auditar la carpeta public para los JSON de i18n
checkFiles('./public');

if (errorsFound > 0) {
  console.error(`\nTotal de errores de codificación encontrados: ${errorsFound}`);
  console.error("------------------------------------------------------------------");
  console.error("REGLA: No se permiten caracteres mojibake (corruptos).");
  console.error("Causa probable: Archivo guardado con codificación incorrecta.");
  console.error("Solución: Asegúrate de que tu editor use UTF-8.");
  console.error("------------------------------------------------------------------");
  process.exit(1);
} else {
  console.log("✅ No se detectaron errores de codificación.");
  process.exit(0);
}

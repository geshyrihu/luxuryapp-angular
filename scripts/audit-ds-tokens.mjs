import fs from 'fs/promises';
import path from 'path';
import { globSync } from 'glob';

// Define the patterns we want to forbid in application code
const HARDCODED_COLOR_REGEX = /(color|background(-color)?|border(-color)?|fill|stroke):\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\))/gi;

// Ignored files (e.g. legacy files that we know are bad but can't fix right now)
const IGNORE_FILES = [
  // example: 'src/app/legacy/old-component.scss'
];

// ── LUGARES AUTORIZADOS A DECLARAR COLOR (RN-DS-024 / RN-DS-041) ──────────
// Hasta 2026-08-10 este gate solo miraba `src/app/**`: nunca inspeccionó las
// hojas del propio Design System, donde vivían 335 valores sin vigilancia.
// Al extenderlo hay que distinguir los sitios donde declarar color es correcto
// de los que son deuda. Un archivo no listado aquí NO puede declarar color:
// debe referenciar un token.
//
//   scope 'all'        → todo el archivo puede declarar color.
//   scope 'root-block' → solo dentro de su primer bloque `:root { … }`
//                        (patrón de capa con alcance de módulo, RN-DS-041).
const COLOR_SOURCE_ALLOWLIST = [
  {
    file: 'src/styles/core/_colors.scss',
    scope: 'all',
    why: 'Paleta fuente del DS. Es el único lugar donde nacen los valores.',
  },
  {
    file: 'src/styles/theme/_variables.scss',
    scope: 'all',
    why: 'Exposición de tokens a CSS + bloques de alto contraste (RN-DS-013).',
  },
  {
    file: 'src/styles/custom/_financial-tables.scss',
    scope: 'root-block',
    why: 'Capa --rf-* con alcance de módulo, documentada (RN-DS-041, Sprint 4).',
  },
];

const norm = (f) => f.replace(/\\/g, '/');

function allowlistEntry(file) {
  const f = norm(file);
  return COLOR_SOURCE_ALLOWLIST.find((e) => f.endsWith(e.file)) || null;
}

// Rango de líneas del primer bloque `:root { … }` (1-indexado, inclusivo).
function rootBlockRange(content) {
  const start = content.indexOf(':root');
  if (start === -1) return null;
  let depth = 0;
  let i = content.indexOf('{', start);
  if (i === -1) return null;
  let j = i;
  for (; j < content.length; j++) {
    if (content[j] === '{') depth++;
    else if (content[j] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const lineOf = (idx) => content.slice(0, idx).split('\n').length;
  return { from: lineOf(start), to: lineOf(j) };
}

// Extrae el contenido de los bloques inline de estilos/plantilla de un .ts
// para no reportar hex de lógica de negocio (p.ej. chart series en strings).
function extractTsStyleBlocks(content) {
  const blocks = [];

  const extractFrom = (keyword) => {
    const re = new RegExp(`${keyword}\\s*:`, 'g');
    let m;
    while ((m = re.exec(content)) !== null) {
      let i = m.index + m[0].length;
      // saltar espacios en blanco
      while (i < content.length && /\s/.test(content[i])) i++;
      if (content[i] === '`') {
        // template string: capturar hasta el siguiente backtick
        const end = content.indexOf('`', i + 1);
        if (end > i) blocks.push(content.slice(i + 1, end));
      } else if (content[i] === '[') {
        // array de strings: balancear corchetes
        let depth = 0;
        let j = i;
        for (; j < content.length; j++) {
          if (content[j] === '[') depth++;
          else if (content[j] === ']') {
            depth--;
            if (depth === 0) break;
          }
        }
        blocks.push(content.slice(i, j + 1));
      }
    }
  };

  extractFrom('styles');
  extractFrom('template');
  return blocks;
}

// Heurística de coherencia de tema (RN-DS-040):
// Si un archivo resuelve tokens --ds-* en JS vía getComputedStyle/getPropertyValue,
// debe referenciar ThemeService.themeMode (un effect() que fuerce el repintado).
// Si no, es candidato a "token congelado": conserva colores del tema en que se pintó.
const STYLE_READ_REGEX = /getComputedStyle|getPropertyValue/;
const DS_TOKEN_REGEX = /--ds[\w-]*/;
const THEME_DEP_REGEX = /themeMode|ThemeService/;
// La auditoría de tokens rige la librería del DS (shared/ui). Fuera de ahí se
// reporta como señal pero no falla el sello (RN-DS-024: el gate cubre donde vive
// el código; la cobertura de app/business queda en otro alcance).
const DS_LIB_SCOPE = /(^|\/)shared\/ui\//;

async function runAudit() {
  console.log('🔍 Iniciando auditoría de Design System Tokens...');

  // Cubre `src/app` (componentes, incl. bloques inline de los .ts) y, desde
  // 2026-08-10, también `src/styles`: las hojas del propio Design System.
  const appFiles = globSync('src/app/**/*.{scss,ts}', { ignore: 'node_modules/**' });
  const styleFiles = globSync('src/styles/**/*.{scss,css}', { ignore: 'node_modules/**' });
  const files = [...appFiles, ...styleFiles];

  let totalErrors = 0;
  const stylesFindings = [];

  for (const file of files) {
    // Skip ignored files
    if (IGNORE_FILES.some((ignorePath) => file.includes(ignorePath))) {
      continue;
    }

    const content = await fs.readFile(file, 'utf-8');
    const isStyles = norm(file).includes('src/styles/');

    // Lugares autorizados a declarar color
    const allow = isStyles ? allowlistEntry(file) : null;
    if (allow && allow.scope === 'all') continue;
    const rootRange = allow && allow.scope === 'root-block' ? rootBlockRange(content) : null;

    // Para .ts solo auditamos los bloques de estilos/plantilla inline
    const chunks =
      file.endsWith('.ts') && !file.endsWith('.scss')
        ? extractTsStyleBlocks(content)
        : [content];

    for (const chunk of chunks) {
      const lines = chunk.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNo = i + 1;

        // Skip if the line has an explicit ignore comment
        if (line.includes('// ds-ignore')) continue;
        // Skip if the previous line has an explicit ignore comment
        if (i > 0 && lines[i - 1].includes('// ds-ignore')) continue;
        // Línea comentada por completo: es código muerto, no una declaración viva
        if (/^\s*(\/\/|\/\*|\*)/.test(line)) continue;
        // `rgba(var(--token), .4)` ya usa un token; solo le aplica opacidad.
        // No es un color hardcodeado y no debe reportarse (falso positivo).
        if (/rgba?\(\s*var\(--/.test(line)) continue;
        // Dentro del bloque :root autorizado de una capa con alcance
        if (rootRange && lineNo >= rootRange.from && lineNo <= rootRange.to) continue;

        let match;
        // We need to match globally across the line. We must reset lastIndex.
        HARDCODED_COLOR_REGEX.lastIndex = 0;
        while ((match = HARDCODED_COLOR_REGEX.exec(line)) !== null) {
          if (isStyles) {
            stylesFindings.push({ file: norm(file), line: lineNo, text: line.trim() });
          } else {
            console.error(`❌ [Token Violation] Color hardcodeado encontrado en ${file}:${lineNo}`);
            console.error(`   > ${line.trim()}`);
            console.error(`   💡 Recomendación: Usa var(--ds-*) o una variable de PrimeNG.`);
          }
          totalErrors++;
        }
      }
    }
  }

  // ── Resumen de `src/styles` agrupado por archivo ──────────────────────────
  if (stylesFindings.length > 0) {
    const byFile = new Map();
    for (const f of stylesFindings) {
      if (!byFile.has(f.file)) byFile.set(f.file, []);
      byFile.get(f.file).push(f);
    }
    console.error(`\n❌ [Design System] ${stylesFindings.length} colores declarados fuera de un lugar autorizado, en ${byFile.size} archivo(s):`);
    for (const [file, items] of [...byFile.entries()].sort((a, b) => b[1].length - a[1].length)) {
      console.error(`\n   ${file}  (${items.length})`);
      for (const it of items.slice(0, 6)) console.error(`     ${it.line}: ${it.text}`);
      if (items.length > 6) console.error(`     … y ${items.length - 6} más`);
    }
    console.error(`\n   💡 Opciones: referenciar un token existente, o —si el color solo lo usa`);
    console.error(`      este módulo— declarar una capa con alcance y registrarla en`);
    console.error(`      COLOR_SOURCE_ALLOWLIST con scope 'root-block' (RN-DS-041).`);
  }

  // ── Coherencia de tema (RN-DS-040): token resuelto en JS sin dependencia de tema ──
  for (const file of files) {
    if (IGNORE_FILES.some((ignorePath) => file.includes(ignorePath))) continue;

    const content = await fs.readFile(file, 'utf-8');

    const readsStyle = STYLE_READ_REGEX.test(content);
    const mentionsDsToken = DS_TOKEN_REGEX.test(content);
    const hasThemeDep = THEME_DEP_REGEX.test(content);

    if (readsStyle && mentionsDsToken && !hasThemeDep) {
      const inScope = DS_LIB_SCOPE.test(file);
      const msg = `⚠️  [Token Congelado?] ${file} resuelve --ds-* en JS (getComputedStyle/getPropertyValue) sin referenciar themeMode/ThemeService.`;
      if (inScope) {
        console.error(`❌ ${msg}`);
        console.error(`   💡 Añade un effect() sobre ThemeService.themeMode que repinte (ver RN-DS-040).`);
        totalErrors++;
      } else {
        console.warn(`ℹ️  ${msg} (fuera del alcance shared/ui: señal, no falla el sello).`);
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

runAudit().catch((err) => {
  console.error('Error fatal durante la auditoría:', err);
  process.exit(1);
});

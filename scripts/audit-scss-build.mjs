// ═══════════════════════════════════════════════════════════════════════════
// 🔍 audit-scss-build.mjs — Compilación de TODOS los puntos de entrada SCSS
// ═══════════════════════════════════════════════════════════════════════════
// Por qué existe (2026-08-10):
//   Un cambio en `web/_buttons.scss` rompió el build y la verificación no lo
//   detectó, porque se compiló `styles.scss` y ese archivo entra por
//   `ds-entry.scss`. El comando era correcto; su alcance no. Es la misma forma
//   de falla que RN-DS-024 describe para los gates.
//
// Qué hace:
//   Lee los puntos de entrada declarados en `angular.json`, se queda con los
//   `.scss` del proyecto (ignora los de node_modules) y compila cada uno.
//   Falla si alguno no compila.
//
// Uso:  node scripts/audit-scss-build.mjs
// ═══════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import * as sass from 'sass';

const angularJson = JSON.parse(fs.readFileSync('angular.json', 'utf-8'));
const project = Object.values(angularJson.projects)[0];
const declared = project?.architect?.build?.options?.styles ?? [];

const entries = declared
  .map((s) => (typeof s === 'string' ? s : s.input))
  .filter(Boolean)
  .filter((f) => f.endsWith('.scss'))
  .filter((f) => !f.includes('node_modules'));

console.log('🔍 Compilación de puntos de entrada SCSS\n');

if (entries.length === 0) {
  console.error('❌ No se encontró ningún punto de entrada .scss en angular.json.');
  console.error('   Revisa `projects.*.architect.build.options.styles`.');
  process.exit(1);
}

let failed = 0;

for (const entry of entries) {
  const abs = path.resolve(entry);
  if (!fs.existsSync(abs)) {
    console.error(`❌ ${entry} — declarado en angular.json pero no existe en disco.`);
    failed++;
    continue;
  }
  try {
    // Las deprecaciones de Sass (@import, funciones color globales) son
    // preexistentes y ahogan la señal de este gate. Se cuentan, no se imprimen.
    let deprecations = 0;
    sass.compile(abs, {
      loadPaths: ['src', 'src/styles', 'node_modules'],
      quietDeps: true,
      logger: {
        warn: () => {
          deprecations++;
        },
        debug: () => {},
      },
    });
    const nota = deprecations > 0 ? `  (${deprecations} deprecaciones de Sass)` : '';
    console.log(`✅ ${entry}${nota}`);
  } catch (err) {
    console.error(`❌ ${entry}`);
    console.error(
      String(err.message || err)
        .split('\n')
        .map((l) => `     ${l}`)
        .join('\n'),
    );
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n🚨 ${failed} de ${entries.length} punto(s) de entrada no compilan.`);
  process.exit(1);
}

console.log(`\n✅ Los ${entries.length} puntos de entrada compilan.`);

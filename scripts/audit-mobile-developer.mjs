#!/usr/bin/env node

/**
 * 🔍 AUDITORÍA: Mobile Developer (§2, §13, §15)
 *
 * Verificaciones ejecutables de CONVENTIONS.md para Mobile Developer (Ionic/Flutter)
 * Ver: docs/AUDITORIA_POR_ROL.md — AUDITORÍA 3: Mobile Developer
 *
 * Severidades:
 * 🔴 CRÍTICA: Bloquea merge
 * 🟠 ALTA: Bloquea en patrón
 * 🟡 MEDIA: Comentario en PR
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const icons = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  check: '✅',
  cross: '❌',
  warn: '⚠️',
  mobile: '📱',
};

let failures = [];
let warnings = [];
let passCount = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.message || '', stderr: error.stderr?.toString() || '' };
  }
}

function checkMobileComponentsObligation() {
  log('\n[1/5] Verificando Componentes Móviles Obligatorios (§2.8, §15.4)', 'blue');

  const { output: listFiles } = exec(
    'find src/app/apps -name "*-list.ts" -o -name "*-list.component.ts" 2>/dev/null | grep -v ".spec.ts"'
  );

  const lists = listFiles.split('\n').filter(f => f.trim());

  if (lists.length === 0) {
    log(`${icons.warn} No se encontraron componentes de listado`, 'yellow');
    passCount++;
    return;
  }

  let missingMobile = [];
  lists.forEach(listFile => {
    const dir = path.dirname(listFile);
    const basename = path.basename(listFile, '.ts').replace('.component', '');

    const { output } = exec(`find "${dir}" -name "*mobile*" 2>/dev/null | grep -i "${basename}"'`);

    if (!output.trim()) {
      missingMobile.push(basename);
    }
  });

  if (missingMobile.length > 0) {
    failures.push({
      severity: 'critical',
      check: 'Mobile Components',
      message: `Encontrados ${missingMobile.length} listado(s) sin versión móvil: ${missingMobile.join(', ')}`,
      fix: 'Crear componente *-mobile.ts para cada listado',
    });
  } else {
    log(`${icons.check} Todos los listados tienen versión móvil`, 'green');
    passCount++;
  }
}

function checkIonicComponents() {
  log('\n[2/5] Verificando Componentes Ionic (§3, §15.4-15.9)', 'blue');

  const { output: ionicCount } = exec(
    'grep -r "ion-list\\|ion-item\\|ion-infinite-scroll" src/app/apps --include="*.html" 2>/dev/null | wc -l'
  );

  const count = parseInt(ionicCount.trim()) || 0;

  if (count === 0) {
    warnings.push({
      severity: 'high',
      check: 'Ionic Components',
      message: 'No se encontraron componentes Ionic. Verificar que se usan en mobile components.',
    });
  } else {
    log(`${icons.check} Encontrados ${count} componentes Ionic`, 'green');
    passCount++;
  }

  // Buscar DynamicDialog en mobile
  const { output: dynamicDialog } = exec(
    'grep -r "DynamicDialog" src/app/apps --include="*.ts" 2>/dev/null | grep -i mobile'
  );

  if (dynamicDialog.trim()) {
    failures.push({
      severity: 'high',
      check: 'Ionic Components',
      message: 'Encontrado DynamicDialog en mobile. Prohibido, usar ion-modal',
      fix: 'Reemplazar DynamicDialog con ion-modal para mobile',
    });
  }
}

function checkResponsiveMobile() {
  log('\n[3/5] Verificando Responsive Mobile (§15)', 'blue');

  const { output: mediaQueries } = exec(
    'grep -r "@media" src/app/apps --include="*.scss" 2>/dev/null | grep -E "375|768" | wc -l'
  );

  const mqCount = parseInt(mediaQueries.trim()) || 0;

  if (mqCount === 0) {
    warnings.push({
      severity: 'medium',
      check: 'Responsive Mobile',
      message: 'No se encontraron media queries para 375px/768px',
      fix: 'Agregar media queries para breakpoints móviles',
    });
  } else {
    log(`${icons.check} Media queries para breakpoints móviles: ${mqCount}`, 'green');
    passCount++;
  }
}

function checkStrictTypeScript() {
  log('\n[4/5] Verificando Strict TypeScript (§2.7)', 'blue');

  const tsconfigPath = 'tsconfig.json';
  if (!fs.existsSync(tsconfigPath)) {
    failures.push({
      severity: 'critical',
      check: 'Strict TypeScript',
      message: 'tsconfig.json no encontrado',
    });
    return;
  }

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  if (tsconfig.compilerOptions?.strict !== true) {
    failures.push({
      severity: 'critical',
      check: 'Strict TypeScript',
      message: '"strict": true no está configurado',
      file: tsconfigPath,
    });
  } else {
    log(`${icons.check} Strict TypeScript configurado`, 'green');
    passCount++;
  }
}

function checkMobilePatternB() {
  log('\n[5/5] Verificando Patrón B: XDesktop + XMobile (§15.4)', 'blue');

  const { output: webComponents } = exec(
    'find src/app/apps -name "*-web.ts" 2>/dev/null | wc -l'
  );
  const { output: mobileComponents } = exec(
    'find src/app/apps -name "*-mobile.ts" 2>/dev/null | wc -l'
  );

  const webCount = parseInt(webComponents.trim()) || 0;
  const mobileCount = parseInt(mobileComponents.trim()) || 0;

  if (webCount === 0 && mobileCount === 0) {
    log(`${icons.warn} No se encontró estructura Patrón B (-web/-mobile)`, 'yellow');
    log(`        (Es posible que usen estructura diferente - verificar manualmente)`, 'yellow');
    passCount++;
  } else {
    log(`${icons.check} Patrón B encontrado: ${webCount} web + ${mobileCount} mobile`, 'green');
    passCount++;
  }
}

function printSummary() {
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log(`${icons.mobile} RESUMEN DE AUDITORÍA: Mobile Developer`, 'cyan');
  log('════════════════════════════════════════════════════════════', 'cyan');

  if (failures.length === 0 && warnings.length === 0) {
    log(`\n✅ AUDITORÍA EXITOSA\n`, 'green');
    log(`Todas las verificaciones pasaron (${passCount}/5)`, 'green');
    return 0;
  }

  if (failures.length > 0) {
    log(`\n${icons.critical} CRÍTICAS (${failures.length}):\n`, 'red');
    failures.forEach((f, i) => {
      log(`  ${i + 1}. ${f.check}`, 'red');
      log(`     ${f.message}`, 'red');
      if (f.fix) log(`     FIX: ${f.fix}`, 'yellow');
      if (f.file) log(`     FILE: ${f.file}`, 'red');
    });
  }

  if (warnings.length > 0) {
    log(`\n${icons.high} ADVERTENCIAS (${warnings.length}):\n`, 'yellow');
    warnings.forEach((w, i) => {
      log(`  ${i + 1}. ${w.check}`, 'yellow');
      log(`     ${w.message}`, 'yellow');
      if (w.fix) log(`     FIX: ${w.fix}`, 'yellow');
    });
  }

  log(`\nPasadas: ${passCount}/5`, passCount === 5 ? 'green' : 'yellow');
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('\n📌 NOTA: Algunas verificaciones requieren manual testing en 375px viewport', 'cyan');

  return failures.length > 0 ? 1 : 0;
}

// Ejecutar auditoría
try {
  checkMobileComponentsObligation();
  checkIonicComponents();
  checkResponsiveMobile();
  checkStrictTypeScript();
  checkMobilePatternB();

  const exitCode = printSummary();
  process.exit(exitCode);
} catch (error) {
  log(`\n❌ Error durante auditoría: ${error.message}`, 'red');
  process.exit(1);
}

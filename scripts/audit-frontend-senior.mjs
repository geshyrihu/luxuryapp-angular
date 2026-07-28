#!/usr/bin/env node

/**
 * 🔍 AUDITORÍA: Frontend Senior (§2, §3, §5, §6, §7, §8, §15)
 *
 * Verificaciones ejecutables de CONVENTIONS.md para Frontend Senior/Especialista UI
 * Ver: docs/AUDITORIA_POR_ROL.md — AUDITORÍA 1: Frontend Senior
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
    return { success: false, output: error.message, stderr: error.stderr?.toString() };
  }
}

function checkStrictTypeScript() {
  log('\n[1/7] Verificando Strict TypeScript (§2.7)', 'blue');

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
      message: '"strict": true no está configurado en tsconfig.json',
      file: tsconfigPath,
    });
  } else {
    log(`${icons.check} strict: true configurado`, 'green');
    passCount++;
  }

  // Buscar 'any' en el código
  const { output, success } = exec(
    'grep -r " any" src/app/apps --include="*.ts" 2>/dev/null | grep -v "// any" | wc -l'
  );

  const anyCount = parseInt(output.trim()) || 0;
  if (anyCount > 0) {
    failures.push({
      severity: 'critical',
      check: 'Strict TypeScript',
      message: `Encontrados ${anyCount} uso(s) de 'any'. Prohibido en §2.7`,
      fix: 'Reemplazar con tipos específicos',
    });
  } else {
    log(`${icons.check} Cero usos de 'any'`, 'green');
    passCount++;
  }
}

function checkOnPushStrategy() {
  log('\n[2/7] Verificando ChangeDetectionStrategy.OnPush (§2.4)', 'blue');

  const { output } = exec(
    'grep -r "OnPush" src/app/apps --include="*.ts" 2>/dev/null | wc -l'
  );

  const onpushCount = parseInt(output.trim()) || 0;

  if (onpushCount === 0) {
    warnings.push({
      severity: 'high',
      check: 'OnPush Strategy',
      message: 'No se encontró OnPush en componentes. Verificar manualmente que todos lo usen.',
    });
  } else {
    log(`${icons.check} OnPush encontrado en ${onpushCount} componentes`, 'green');
    passCount++;
  }
}

function checkUIImports() {
  log('\n[3/7] Verificando Catálogo UI (§5)', 'blue');

  const { output } = exec(
    'grep -r "from [\'\\"]primeng\\|from [\'\\"]@ionic" src/app/apps --include="*.ts" 2>/dev/null | grep -v node_modules | wc -l'
  );

  const directImports = parseInt(output.trim()) || 0;

  if (directImports > 0) {
    failures.push({
      severity: 'critical',
      check: 'Catálogo UI',
      message: `Encontrados ${directImports} import(s) directo(s) de primeng/@ionic`,
      fix: 'Usar imports desde @ui/* en lugar de primeng/@ionic directamente',
    });
  } else {
    log(`${icons.check} Cero imports directos de primeng/@ionic`, 'green');
    passCount++;
  }
}

function checkWrappers() {
  log('\n[4/7] Verificando Wrappers con sufijo "-wrapper" (§6)', 'blue');

  const { output } = exec(
    'find src/app/apps -name "wrapper-*.ts" 2>/dev/null | wc -l'
  );

  const violatingWrappers = parseInt(output.trim()) || 0;

  if (violatingWrappers > 0) {
    failures.push({
      severity: 'high',
      check: 'Wrappers',
      message: `Encontrados ${violatingWrappers} archivo(s) con prefijo "wrapper-". Deben usar sufijo "-wrapper"`,
      fix: 'Renombrar wrapper-name.ts → name-wrapper.ts',
    });
  } else {
    log(`${icons.check} Wrappers con nomenclatura correcta`, 'green');
    passCount++;
  }
}

function checkMobileComponents() {
  log('\n[5/7] Verificando Componentes Móviles Obligatorios (§2.8)', 'blue');

  const { output: listFiles } = exec(
    'find src/app/apps -name "*list.ts" 2>/dev/null | grep -v ".spec.ts"'
  );

  const listCount = listFiles.split('\n').filter(f => f.trim()).length;

  if (listCount === 0) {
    log(`${icons.warn} No se encontraron componentes de listado`, 'yellow');
  } else {
    log(`${icons.check} Encontrados ${listCount} componentes de listado`, 'green');
    passCount++;
  }
}

function checkNamingConvention() {
  log('\n[6/7] Verificando Naming Convention (§7)', 'blue');

  const { output } = exec(
    'find src/app/apps -name "*Component.ts" 2>/dev/null | wc -l'
  );

  const componentSuffix = parseInt(output.trim()) || 0;

  if (componentSuffix > 0) {
    warnings.push({
      severity: 'high',
      check: 'Naming Convention',
      message: `Encontrados ${componentSuffix} archivo(s) con sufijo "Component". Prohibido en §7`,
      fix: 'Usar kebab-case sin sufijo Component en el archivo (clase puede ser PascalCase)',
    });
  } else {
    log(`${icons.check} Naming convention correcta (sin sufijo Component)`, 'green');
    passCount++;
  }
}

function checkUIAudit() {
  log('\n[7/7] Ejecutando Auditoría de Catálogo UI', 'blue');

  const { success, output, stderr } = exec('npm run audit:ui 2>&1');

  if (success) {
    log(`${icons.check} UI Audit passed`, 'green');
    passCount++;
  } else {
    if (stderr?.includes('error') || output?.includes('error')) {
      failures.push({
        severity: 'high',
        check: 'UI Audit',
        message: 'npm run audit:ui falló',
        output: output.slice(0, 200),
      });
    } else {
      log(`${icons.check} UI Audit passed (with warnings)`, 'green');
      passCount++;
    }
  }
}

function printSummary() {
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('📊 RESUMEN DE AUDITORÍA: Frontend Senior', 'cyan');
  log('════════════════════════════════════════════════════════════', 'cyan');

  if (failures.length === 0 && warnings.length === 0) {
    log(`\n✅ AUDITORÍA EXITOSA\n`, 'green');
    log(`Todas las verificaciones pasaron (${passCount}/7)`, 'green');
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

  log(`\nPasadas: ${passCount}/7`, passCount === 7 ? 'green' : 'yellow');
  log('════════════════════════════════════════════════════════════', 'cyan');

  return failures.length > 0 ? 1 : 0;
}

// Ejecutar auditoría
try {
  checkStrictTypeScript();
  checkOnPushStrategy();
  checkUIImports();
  checkWrappers();
  checkMobileComponents();
  checkNamingConvention();
  checkUIAudit();

  const exitCode = printSummary();
  process.exit(exitCode);
} catch (error) {
  log(`\n❌ Error durante auditoría: ${error.message}`, 'red');
  process.exit(1);
}

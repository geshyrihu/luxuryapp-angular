#!/usr/bin/env npx tsx
/**
 * audit-css-classes.ts
 * 
 * PROPÓSITO:
 * Escanea todos los archivos .html, .ts y .scss del proyecto para detectar:
 * - Clases problemáticas (conflictos, deprecated, prohibidas)
 * - Uso de !important
 * - Uso de ::ng-deep
 * - Clases PrimeFlex legacy (p-flex, p-grid, p-col-*)
 * - Clases dark: de Tailwind (no usar en este proyecto)
 * 
 * GENERA:
 * - audit-report.json (reporte detallado)
 * - audit-report.csv (para abrir en Excel)
 * - Resumen en consola
 * 
 * USO:
 * npx tsx scripts/audit-css-classes.ts
 */

import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, relative } from 'path';

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════

const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src');

// Patrones de detección de problemas
const PROBLEMATIC_PATTERNS = [
  {
    name: 'important',
    regex: /!important/g,
    severity: 'critical' as const,
    suggestion: 'Eliminar !important y usar @layer primeng-brand o tokens CSS',
  },
  {
    name: 'ng-deep',
    regex: /::ng-deep/g,
    severity: 'high' as const,
    suggestion: 'Usar CSS variables (--p-*) o @layer primeng-brand',
  },
  {
    name: 'primeflex-flex',
    regex: /\bp-flex\b/g,
    severity: 'critical' as const,
    suggestion: 'Reemplazar con "flex" de Tailwind',
  },
  {
    name: 'primeflex-grid',
    regex: /\bp-grid\b/g,
    severity: 'critical' as const,
    suggestion: 'Reemplazar con "grid" de Tailwind',
  },
  {
    name: 'primeflex-col',
    regex: /\bp-col-\d+/g,
    severity: 'critical' as const,
    suggestion: 'Reemplazar con "col-span-*" de Tailwind',
  },
  {
    name: 'border-round',
    regex: /\bborder-round\b/g,
    severity: 'medium' as const,
    suggestion: 'Usar "rounded" o "rounded-lg" de Tailwind',
  },
  {
    name: 'shadow-legacy',
    regex: /\bshadow-[1-8]\b/g,
    severity: 'medium' as const,
    suggestion: 'Usar shadow-sm, shadow, shadow-md, shadow-lg de Tailwind',
  },
  {
    name: 'surface-legacy',
    regex: /\bsurface-\d{3}\b/g,
    severity: 'medium' as const,
    suggestion: 'Usar bg-slate-* o tokens --ds-*',
  },
  {
    name: 'bootstrap-flex',
    regex: /\bd-flex\b/g,
    severity: 'medium' as const,
    suggestion: 'Usar "flex" de Tailwind',
  },
  {
    name: 'bootstrap-spacing',
    regex: /\b(ms|me|fs|fw)-\d+\b/g,
    severity: 'medium' as const,
    suggestion: 'Usar ml-*, mr-*, text-*, font-* de Tailwind',
  },
  {
    name: 'dark-mode-tailwind',
    regex: /\bdark:\w+/g,
    severity: 'high' as const,
    suggestion: 'Usar html.theme-dark + tokens CSS en SCSS',
  },
];

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface AuditIssue {
  file: string;
  line: number;
  content: string;
  pattern: string;
  patternName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
}

interface AuditReport {
  timestamp: string;
  totalFilesScanned: number;
  totalIssues: number;
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byPattern: Record<string, number>;
  issues: AuditIssue[];
}

// ═══════════════════════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════════════════════

/**
 * Escanea un archivo y retorna los issues encontrados
 */
function auditFile(filePath: string, relativePath: string): AuditIssue[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues: AuditIssue[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const pattern of PROBLEMATIC_PATTERNS) {
      pattern.regex.lastIndex = 0; // Reset regex state
      
      if (pattern.regex.test(line)) {
        // Extraer contexto (trim y truncar si es muy largo)
        const trimmed = line.trim();
        const context = trimmed.length > 120 ? trimmed.substring(0, 120) + '...' : trimmed;
        
        issues.push({
          file: relativePath,
          line: i + 1,
          content: context,
          pattern: pattern.regex.source,
          patternName: pattern.name,
          severity: pattern.severity,
          suggestion: pattern.suggestion,
        });
      }
    }
  }

  return issues;
}

/**
 * Genera reporte CSV
 */
function generateCSV(issues: AuditIssue[]): string {
  const header = 'Archivo,Línea,Patrón,Severidad,Contenido,Sugerencia';
  const rows = issues.map((issue) => {
    const file = `"${issue.file}"`;
    const line = issue.line;
    const pattern = `"${issue.patternName}"`;
    const severity = `"${issue.severity}"`;
    const content = `"${issue.content.replace(/"/g, '""')}"`;
    const suggestion = `"${issue.suggestion}"`;
    return `${file},${line},${pattern},${severity},${content},${suggestion}`;
  });

  return [header, ...rows].join('\n');
}

/**
 * Genera resumen en consola
 */
function printSummary(report: AuditReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('  🔍 AUDITORÍA DE CLASES CSS COMPLETADA');
  console.log('='.repeat(60));
  console.log(`\n📊 Archivos escaneados: ${report.totalFilesScanned}`);
  console.log(`\n📋 Total de issues: ${report.totalIssues}`);
  console.log('\n🔴 Críticos:', report.bySeverity.critical);
  console.log('🟠 Altos:', report.bySeverity.high);
  console.log('🟡 Medios:', report.bySeverity.medium);
  console.log('🟢 Bajos:', report.bySeverity.low);
  
  console.log('\n📈 Issues por patrón:');
  for (const [pattern, count] of Object.entries(report.byPattern)) {
    console.log(`   - ${pattern}: ${count}`);
  }

  console.log('\n📄 Reportes generados:');
  console.log('   - audit-report.json (detalle completo)');
  console.log('   - audit-report.csv (para Excel)');
  console.log('\n' + '='.repeat(60));

  // Top 10 archivos con más issues
  if (report.issues.length > 0) {
    const fileCounts = report.issues.reduce((acc, issue) => {
      acc[issue.file] = (acc[issue.file] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topFiles = Object.entries(fileCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log('\n🏆 Top 10 archivos con más issues:');
    for (const [file, count] of topFiles) {
      console.log(`   ${count.toString().padStart(3)}  ${file}`);
    }
    console.log('');
  }
}

// ═══════════════════════════════════════════════════════════
// EJECUCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════

async function runAudit(): Promise<void> {
  console.log('🔍 Iniciando auditoría de clases CSS...\n');

  const allIssues: AuditIssue[] = [];

  // 1. Escanear archivos HTML
  console.log('📂 Escaneando archivos HTML...');
  const htmlFiles = await glob('**/*.html', {
    cwd: SRC,
    ignore: ['**/node_modules/**', '**/dist/**', '**/ui-catalog/**'],
  });

  for (const file of htmlFiles) {
    const fullPath = resolve(SRC, file);
    const issues = auditFile(fullPath, file);
    allIssues.push(...issues);
  }
  console.log(`   ✅ ${htmlFiles.length} archivos HTML`);

  // 2. Escanear archivos TypeScript (templates inline)
  console.log('📂 Escaneando archivos TypeScript...');
  const tsFiles = await glob('**/*.ts', {
    cwd: SRC,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.spec.ts', '**/ui-catalog/**'],
  });

  for (const file of tsFiles) {
    const fullPath = resolve(SRC, file);
    const issues = auditFile(fullPath, file);
    allIssues.push(...issues);
  }
  console.log(`   ✅ ${tsFiles.length} archivos TS`);

  // 3. Escanear archivos SCSS/CSS
  console.log('📂 Escaneando archivos de estilos...');
  const cssFiles = await glob('**/*.{scss,css}', {
    cwd: resolve(SRC, 'styles'),
    ignore: ['**/node_modules/**', 'tailwind-entry.css', 'tokens.css', 'primeng-overrides.css'],
  });

  for (const file of cssFiles) {
    const fullPath = resolve(SRC, 'styles', file);
    const issues = auditFile(fullPath, `src/styles/${file}`);
    allIssues.push(...issues);
  }
  console.log(`   ✅ ${cssFiles.length} archivos SCSS/CSS`);

  // 4. Generar reporte
  const totalFiles = htmlFiles.length + tsFiles.length + cssFiles.length;
  
  const bySeverity = {
    critical: allIssues.filter((i) => i.severity === 'critical').length,
    high: allIssues.filter((i) => i.severity === 'high').length,
    medium: allIssues.filter((i) => i.severity === 'medium').length,
    low: allIssues.filter((i) => i.severity === 'low').length,
  };

  const byPattern: Record<string, number> = {};
  for (const issue of allIssues) {
    byPattern[issue.patternName] = (byPattern[issue.patternName] || 0) + 1;
  }

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    totalFilesScanned: totalFiles,
    totalIssues: allIssues.length,
    bySeverity,
    byPattern,
    issues: allIssues,
  };

  // 5. Escribir reportes
  const jsonPath = resolve(ROOT, 'audit-report.json');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const csvPath = resolve(ROOT, 'audit-report.csv');
  writeFileSync(csvPath, generateCSV(allIssues));

  // 6. Imprimir resumen
  printSummary(report);

  // 7. Exit code basado en severidad (para CI)
  if (bySeverity.critical > 0) {
    console.log('⚠️  Hay issues CRÍTICOS. Revisar audit-report.json para detalles.\n');
    process.exit(1); // Fallar en CI si hay críticos
  }
}

// Ejecutar
runAudit().catch((error) => {
  console.error('❌ Error en auditoría:', error);
  process.exit(1);
});

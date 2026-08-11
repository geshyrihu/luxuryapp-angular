// ═════════════════════════════════════════════════════════════════════
// 🪓 audit-a11y.mjs — Baseline de accesibilidad con axe-core (RN-DS-037)
// ═════════════════════════════════════════════════════════════════════
// MODO REPORTE (Fase A): escribe un JSON versionado con el baseline y no
// bloquea (exit 0). MODO NO-REGRESIÓN (E0.2): compara el conteo de
// violaciones contra el baseline guardado (este mismo archivo) y hace exit 1
// si empeora. Todavía no exige cero: exige que no empeore.
//
// La lista de URLs vive en a11y-targets.json. Cada target marca
// `"auth": "anonymous" | "session"`. El script corre dos pasadas: contexto
// limpio para los anónimos, y contexto con storageState (A11Y_AUTH_STATE o
// temporal del sistema, FUERA del repo) para el resto.
//
// Por cada violación se guarda: ruleId, impact, y por nodo el `target`
// (selector CSS de axe), los primeros ~160 chars del `html`, y para
// color-contrast el `data` (fgColor, bgColor, contrastRatio, expected...).
//
// Uso:
//   node scripts/audit-a11y.mjs                 # usa a11y-targets.json
//   node scripts/audit-a11y.mjs ruta.json      # usa el archivo indicado
//
// Salida: docs/analisis/a11y-last-run.json (cada corrida, se pisa) y, solo con
// --seed y cobertura total, docs/analisis/20260809-a11y-baseline-referencia.json
// (no se sobrescribe automáticamente; una corrida parcial no lo degrada).
// ═════════════════════════════════════════════════════════════════════

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const DEFAULT_CONFIG = path.join(ROOT, 'a11y-targets.json');
const OUT_DIR = path.join(REPO_ROOT, 'docs', 'analisis');
const OUT_LAST = path.join(OUT_DIR, 'a11y-last-run.json');
const OUT_REFERENCE = path.join(OUT_DIR, '20260809-a11y-baseline-referencia.json');
// Estado de sesión FUERA del árbol del repo (por variable de entorno, fallback tmp).
const AUTH_STATE =
  process.env.A11Y_AUTH_STATE || path.join(os.tmpdir(), 'luxury-a11y-auth.json');
const SEED_FLAG = process.argv.includes('--seed');

// Extrae el data relevante de un nodo axe (fgColor/bgColor/contrastRatio para
// color-contrast; otro data para otras reglas). axe lo pone en any/all/none[].data.
function nodeData(n) {
  for (const arr of [n.any, n.all, n.none]) {
    if (Array.isArray(arr) && arr[0] && arr[0].data) return arr[0].data;
  }
  return undefined;
}

// Ejecuta axe sobre una página ya cargada y devuelve {violations, passes, incomplete, detail}
function summarizeResults(results) {
  const detail = [];
  let nodes = 0;
  for (const v of results.violations) {
    const vNodes = v.nodes.map((n) => ({
      target: Array.isArray(n.target) ? n.target.join(' ') : n.target,
      html: (n.html || '').slice(0, 160),
      data: nodeData(n),
    }));
    nodes += vNodes.length;
    detail.push({
      ruleId: v.id,
      impact: v.impact,
      help: v.help,
      nodes: vNodes,
    });
  }
  return {
    violations: results.violations.length,
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    detail,
  };
}

async function auditTargets(page, baseUrl, targets, axeTagValues, pageOpts, timeoutMs, out) {
  for (const t of targets) {
    const url = `${baseUrl}${t.path}`;
    try {
      await page.goto(url, { waitUntil: pageOpts.waitUntil || 'load', timeout: timeoutMs });
      if (pageOpts.waitSelector) {
        await page.waitForSelector(pageOpts.waitSelector, { timeout: timeoutMs }).catch(() => {});
      }
      await page.waitForTimeout(pageOpts.settleMs || 2500);

      const landedUrl = page.url();
      const finalPath = new URL(landedUrl).pathname;
      const isLoginPath = t.path === '/login' || t.path.startsWith('/auth');
      const landedLogin = /(^|\/)(auth|login)(\/|$)/i.test(finalPath);
      const redirected = landedLogin && !isLoginPath;

      if (redirected) {
        out.routesBlockedByAuth.push({
          path: t.path,
          label: t.label,
          auth: t.auth || 'session',
          requested: url,
          landed: landedUrl,
          reason: 'auth-redirect',
        });
        console.log(`   🔒 ${t.path.padEnd(20)} bloqueada por auth → ${finalPath}`);
        continue;
      }

      const results = await new AxeBuilder({ page })
        .withTags(axeTagValues || ['wcag2a', 'wcag2aa'])
        .analyze();

      const sum = summarizeResults(results);

      // Agregación global por regla
      for (const v of results.violations) {
        if (!out.byRule[v.id]) {
          out.byRule[v.id] = { description: v.help, impact: v.impact, count: 0, nodes: 0 };
        }
        out.byRule[v.id].count += 1;
        out.byRule[v.id].nodes += v.nodes.length;
      }
      out.totalViolations += sum.violations;

      out.routesEvaluated.push({
        path: t.path,
        label: t.label,
        auth: t.auth || 'session',
        requested: url,
        landedUrl,
        violations: sum.violations,
        passes: sum.passes,
        incomplete: sum.incomplete,
        violationsDetail: sum.detail,
      });
      console.log(`   ${sum.violations === 0 ? '✅' : '⚠️ '} [${t.auth || 'session'}] ${t.path.padEnd(20)} ${sum.violations} violación(es)`);
    } catch (err) {
      const reason = err.name === 'TimeoutError' ? 'timeout' : 'navigation-error';
      out.routesUnreachable.push({
        path: t.path,
        label: t.label,
        auth: t.auth || 'session',
        url,
        reason,
        detail: err.message.split('\n')[0],
      });
      console.log(`   ⛔ ${t.path.padEnd(20)} inalcanzable (${reason}): ${err.message.split('\n')[0]}`);
    }
  }
}

async function main() {
  const configPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_CONFIG;
  if (!fs.existsSync(configPath)) {
    console.error(`❌ No encontré el config de targets: ${configPath}`);
    process.exit(0);
  }
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const baseUrl = (cfg.baseUrl || 'http://localhost:4200').replace(/\/$/, '');
  const targets = cfg.targets || [];
  const axeOptions = cfg.axeOptions || {};
  const pageOpts = cfg.pageOptions || {};
  const timeoutMs = pageOpts.timeoutMs || 30000;
  const mode = cfg.mode || process.env.A11Y_MODE || 'report';

  const anonTargets = targets.filter((t) => (t.auth || 'session') === 'anonymous');
  const sessionTargets = targets.filter((t) => (t.auth || 'session') !== 'anonymous');

  console.log(`🪓 Baseline de accesibilidad — axe-core (modo: ${mode})\n`);
  console.log(`   Config : ${path.relative(ROOT, configPath)}`);
  console.log(`   Base   : ${baseUrl}`);
  console.log(`   Targets: ${targets.length} (${anonTargets.length} anónimos, ${sessionTargets.length} sesión)\n`);

  const out = {
    routesEvaluated: [],
    routesUnreachable: [],
    routesBlockedByAuth: [],
    byRule: {},
    totalViolations: 0,
  };

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.warn(`⚠️  No se pudo lanzar el navegador (Playwright). Se reporta cobertura nula honesta.`);
    console.warn(`    Causa: ${err.message.split('\n')[0]}`);
    for (const t of targets) {
      out.routesUnreachable.push({ path: t.path, label: t.label, auth: t.auth, reason: 'browser-unavailable' });
    }
    finalize(out, cfg, baseUrl, mode, null);
    return;
  }

  // Pasada 1 — anónima (contexto limpio)
  if (anonTargets.length > 0) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    console.log(`   ── Pasada ANÓNIMA (${anonTargets.length}) ──`);
    await auditTargets(page, baseUrl, anonTargets, axeOptions.runOnly?.values, pageOpts, timeoutMs, out);
    await ctx.close();
  }

  // Pasada 2 — sesión (storageState)
  if (sessionTargets.length > 0) {
    if (!fs.existsSync(AUTH_STATE)) {
      console.warn(`   ⚠️  Sin ${path.relative(ROOT, AUTH_STATE)}: las rutas de sesión no se evaluarán.`);
      for (const t of sessionTargets) {
        out.routesUnreachable.push({ path: t.path, label: t.label, auth: 'session', reason: 'no-auth-state' });
      }
    } else {
      const ctx = await browser.newContext({ storageState: AUTH_STATE });
      const page = await ctx.newPage();
      console.log(`   ── Pasada SESIÓN (${sessionTargets.length}) ──`);
      await auditTargets(page, baseUrl, sessionTargets, axeOptions.runOnly?.values, pageOpts, timeoutMs, out);
      await ctx.close();
    }
  }

  await browser.close();
  finalize(out, cfg, baseUrl, mode, null);

  function finalize(o, c, b, m, _unused) {
    const report = {
      generatedAt: new Date().toISOString(),
      mode: m === 'regression' ? 'NO-REGRESIÓN (falla si empeora)' : 'REPORTE (no bloqueante)',
      tool: 'axe-core / @axe-core/playwright',
      config: path.relative(ROOT, configPath),
      baseUrl: b,
      axeTags: axeOptions.runOnly?.values || ['wcag2a', 'wcag2aa'],
      summary: {
        targetsTotal: targets.length,
        anonymousTargets: anonTargets.length,
        sessionTargets: sessionTargets.length,
        routesEvaluated: o.routesEvaluated.length,
        routesBlockedByAuth: o.routesBlockedByAuth.length,
        routesUnreachable: o.routesUnreachable.length,
        totalViolations: o.totalViolations,
        distinctRules: Object.keys(o.byRule).length,
      },
      routesEvaluated: o.routesEvaluated,
      routesBlockedByAuth: o.routesBlockedByAuth,
      routesUnreachable: o.routesUnreachable,
      violationsByRule: Object.entries(o.byRule)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => b.nodes - a.nodes),
      coverage: {
        declared:
          o.routesEvaluated.length > 0 ||
          o.routesBlockedByAuth.length > 0 ||
          o.routesUnreachable.length > 0,
        note:
          o.routesBlockedByAuth.length > 0
            ? `Cobertura parcial: ${o.routesEvaluated.length} rutas evaluadas. ${o.routesBlockedByAuth.length} rutas siguieron redirigiendo al muro de auth pese a la sesión: hallazgo de la app (permisos/ruta inexistente), no fallo del script.`
            : o.routesUnreachable.length > 0
              ? `Cobertura parcial: ${o.routesUnreachable.length} rutas no alcanzadas. Se declara explícitamente.`
              : `Cobertura completa de las rutas objetivo.`,
        routesUnreachableReasons: [...new Set(o.routesUnreachable.map((r) => r.reason))],
      },
    };

    // Modo no-regresión: compara contra la REFERENCIA (nunca contra el last-run).
    let regression = null;
    if (m === 'regression') {
      const prev = fs.existsSync(OUT_REFERENCE)
        ? JSON.parse(fs.readFileSync(OUT_REFERENCE, 'utf-8'))
        : null;
      if (prev) {
        const prevTotal = prev.summary?.totalViolations ?? 0;
        const prevByRule = Object.fromEntries((prev.violationsByRule || []).map((r) => [r.id, r.nodes]));
        const newByRule = Object.fromEntries((report.violationsByRule || []).map((r) => [r.id, r.nodes]));
        let worse = false;
        if (report.summary.totalViolations > prevTotal) worse = true;
        for (const [id, n] of Object.entries(newByRule)) {
          if (prevByRule[id] !== undefined && n > prevByRule[id]) worse = true;
        }
        regression = { previousTotal: prevTotal, currentTotal: report.summary.totalViolations, regressed: worse };
      } else {
        // Sin referencia: no se puede comparar. NO sembrar automáticamente
        // (la referencia solo se crea con --seed y cobertura total).
        regression = { previousTotal: null, currentTotal: report.summary.totalViolations, regressed: false, noReference: true };
      }
      report.regression = regression;
    }

    fs.mkdirSync(OUT_DIR, { recursive: true });
    // Resultado de ESTA corrida: se pisa siempre.
    fs.writeFileSync(OUT_LAST, JSON.stringify(report, null, 2));

    // Referencia de no-regresión: SOLO con --seed y 100% de cobertura.
    // Una medición parcial NUNCA puede degradar la línea base.
    const fullCoverage =
      o.routesEvaluated.length === targets.length &&
      o.routesUnreachable.length === 0 &&
      o.routesBlockedByAuth.length === 0;
    if (SEED_FLAG) {
      if (!fullCoverage) {
        console.warn(
          `⚠️  --seed solicitado pero la corrida es PARCIAL (${o.routesEvaluated.length}/${targets.length} rutas, ` +
            `${o.routesUnreachable.length} inalcanzables, ${o.routesBlockedByAuth.length} bloqueadas por auth). ` +
            `NO se actualiza la referencia para no degradar la línea base.`,
        );
      } else {
        fs.writeFileSync(OUT_REFERENCE, JSON.stringify(report, null, 2));
        console.log(`   🌱 Referencia actualizada: ${path.relative(REPO_ROOT, OUT_REFERENCE)}`);
      }
    }

    console.log(`\n📊 Resumen (modo ${m}):`);
    console.log(`   Rutas evaluadas    : ${o.routesEvaluated.length}/${targets.length}`);
    console.log(`   Bloqueadas por auth: ${o.routesBlockedByAuth.length}`);
    console.log(`   Rutas inalcanzables: ${o.routesUnreachable.length}`);
    console.log(`   Violaciones totales: ${o.totalViolations}`);
    console.log(`   Reglas distintas   : ${Object.keys(o.byRule).length}`);
    console.log(`   JSON (last-run)     : ${path.relative(REPO_ROOT, OUT_LAST)}`);
    if (regression) {
      const tag = regression.noReference
        ? '⚠️  sin referencia (ejecuta con --seed y cobertura total)'
        : regression.regressed
          ? '❌ EMPEORÓ'
          : '✅ ok';
      console.log(`   No-regresión      : ${tag} (prev ${regression.previousTotal} → actual ${regression.currentTotal})`);
    }
    console.log(`\n   Cobertura: ${report.coverage.note}`);

    if (m === 'regression' && regression && regression.regressed) {
      process.exit(1); // primer gate de a11y que puede fallar: por crecimiento, no por deuda
    }
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(`⚠️  Error inesperado en audit-a11y: ${err.message}`);
  process.exit(0);
});

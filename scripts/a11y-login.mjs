// ═════════════════════════════════════════════════════════════════════
// 🔐 a11y-login.mjs — Sesión autenticada para el baseline de a11y
// ═════════════════════════════════════════════════════════════════════
// Hace login UNA vez contra la ruta real de auth (/auth/login) y guarda el
// estado de sesión (storageState) FUERA del árbol del repo (variable de entorno
// A11Y_AUTH_STATE, con fallback a un temporal del sistema). Antes de escribir,
// filtra de `localStorage` cualquier clave que parezca secreto (pass/pwd/secret/
// token/credential) para no duplicar la contraseña en claro a disco.
//
// REGLA DURA: las credenciales SOLO vienen de variables de entorno
// (A11Y_USER / A11Y_PASS). NUNCA se hardcodean, ni en este script, ni en
// a11y-targets.json, ni en ningún archivo del repo.
//
//   PowerShell: $env:A11Y_USER='admin'; $env:A11Y_PASS='<password>'
//   bash:       export A11Y_USER=admin; export A11Y_PASS=<password>
//
// El estado de sesión resultante es una sesión viva (NO inocua) y vive FUERA
// del repo. No lo commitees.
// ═════════════════════════════════════════════════════════════════════

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
// El estado se escribe FUERA del árbol del repo (por variable de entorno, con
// fallback a un temporal del sistema). Nunca dentro de client/angular, para no
// versionar ni dejar rastros de la sesión en el repo.
const AUTH_STATE =
  process.env.A11Y_AUTH_STATE || path.join(os.tmpdir(), 'luxury-a11y-auth.json');
const BASE = (process.env.A11Y_BASE || 'http://localhost:4200').replace(/\/$/, '');

const USER = process.env.A11Y_USER;
const PASS = process.env.A11Y_PASS;

if (!USER || !PASS) {
  console.error('❌ Faltan credenciales. Define las variables de entorno (no en archivos):');
  console.error('   PowerShell: $env:A11Y_USER="admin"; $env:A11Y_PASS="..."');
  console.error('   bash:       export A11Y_USER=admin; export A11Y_PASS=...');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

try {
  console.log(`🔐 Login de sesión para baseline a11y`);
  console.log(`   Base : ${BASE}`);
  console.log(`   User : ${USER}`);
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 30000 });

  // Rellenar usuario/contraseña. El form usa componentes custom cuyo host y el
  // <input> interior comparten id; apuntamos al <input> explícitamente.
  await page.fill('input#username-global', USER, { timeout: 10000 });
  await page.fill('input#password-global', PASS, { timeout: 10000 });

  // Enviar. Un <button type="submit"> nativo dispara la navegación del
  // formulario (recarga) en lugar del (ngSubmit) de Angular; usamos
  // requestSubmit() sobre el <form> para activar el handler de Angular sin
  // navegación nativa.
  await page.locator('form').first().evaluate((f) => f.requestSubmit());

  // Esperar a salir de la pantalla de login (redirección post-auth)
  await page
    .waitForFunction(() => {
      const p = location.pathname;
      return p !== '/auth/login' && !/(^|\/)(auth|login)(\/|$)/i.test(p);
    }, { timeout: 20000 })
    .catch(() => {});

  await page.waitForTimeout(2500); // estabilizar router/post-login

  const after = page.url();
  const afterPath = new URL(after).pathname;
  const stillLogin = /(^|\/)(auth|login)(\/|$)/i.test(afterPath);

  if (stillLogin) {
    const errText = await page
      .locator('div.border-red-300, .text-red-800, app-toast, p-text')
      .first()
      .innerText()
      .catch(() => '(sin mensaje legible)');
    console.error(`❌ El login no redirigió fuera de auth. URL actual: ${after}`);
    console.error(`   Posible causa: credenciales incorrectas o backend no disponible.`);
    console.error(`   Mensaje en pantalla: ${errText}`);
    process.exit(1);
  }

  // Guardar el estado FUERA del repo, filtrando cualquier clave de localStorage
  // que pueda contener secreto (contraseña, token, credencial). La sesión real
  // viaja en las cookies httpOnly (identity/refresh), NO en localStorage, así
  // que quitar savedPassword aquí NO rompe la sesión: solo evita duplicar la
  // contraseña en claro a disco. Si algún día la app pasara a depender de
  // localStorage para mantener sesión, filtrar lo rompería y habría que
  // reportarlo como hallazgo más grave que S2.
  const SECRET_KEY = /pass|pwd|secret|token|credential/i;
  const state = await context.storageState();
  for (const origin of state.origins || []) {
    if (Array.isArray(origin.localStorage)) {
      const before = origin.localStorage.length;
      origin.localStorage = origin.localStorage.filter(
        (item) => !SECRET_KEY.test(item.name),
      );
      if (before !== origin.localStorage.length) {
        console.log(
          `   ↳ filtradas ${before - origin.localStorage.length} clave(s) de localStorage con posible secreto (p.ej. savedPassword)`,
        );
      }
    }
  }
  fs.mkdirSync(path.dirname(AUTH_STATE), { recursive: true });
  fs.writeFileSync(AUTH_STATE, JSON.stringify(state, null, 2));
  console.log(`✅ Sesión autenticada guardada en ${AUTH_STATE}`);
  console.log(`   URL tras login: ${after}`);
  process.exit(0);
} catch (err) {
  console.error(`❌ Error durante el login: ${err.message.split('\n')[0]}`);
  process.exit(1);
} finally {
  await browser.close();
}

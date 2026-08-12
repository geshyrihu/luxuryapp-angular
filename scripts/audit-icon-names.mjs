// ═══════════════════════════════════════════════════════════════════════════
// 🔍 audit-icon-names.mjs — Todo icono usado debe existir en el catálogo
// ═══════════════════════════════════════════════════════════════════════════
// Por qué existe (2026-08-11):
//   La migración de `mdi:` a `material-symbols-light:` cambió el prefijo sin
//   traducir el nombre en los literales que el compilador no podía ver (los
//   que pasan por inputs `string` como `iconClass`, o por datos en `.ts`).
//   Resultado: 606 usos apuntando a nombres inexistentes. `<iconify-icon>` no
//   falla ante un nombre desconocido: simplemente no dibuja. Ningún gate, ni
//   el compilador, ni una prueba lo detectaron — solo el ojo humano, y solo
//   en las pantallas que alguien abriera.
//
//   Es la misma familia de falla que RN-DS-023/025: un control que no puede
//   fallar no es un control. Este cierra el hueco.
//
// Qué comprueba:
//   Todo literal `material-symbols-light:*` del código debe ser uno de los
//   valores declarados en `app-icon.catalog.ts`. El catálogo es la lista de
//   nombres revisados uno a uno contra el set real de Iconify; validar contra
//   él es offline, determinista y además obliga a que las altas pasen por la
//   traducción curada en vez de inventar nombres.
//
// Lo que NO puede ver (declarado a propósito):
//   Los nombres que se arman en ejecución — concatenaciones y el último
//   recurso de `resolveToIconify`. Ver la nota en `icon-mapping.ts`.
//
// Uso:  node scripts/audit-icon-names.mjs
// ═══════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';

const CATALOGO = 'src/app/shared/ui/shared/app-icon/app-icon.catalog.ts';
const RAIZ = 'src';

// Nombres que pueden aparecer fuera del catálogo. Cada alta exige una razón.
const PERMITIDOS = new Set([
  // (vacío: hoy todo literal vivo está en el catálogo)
]);

if (!fs.existsSync(CATALOGO)) {
  console.error(`❌ No se encontró el catálogo en ${CATALOGO}.`);
  process.exit(1);
}

const catalogo = fs.readFileSync(CATALOGO, 'utf-8');
const valores = new Set(
  [...catalogo.matchAll(/"(material-symbols-light:[a-z0-9-]+)"/g)].map((m) => m[1]),
);

if (valores.size === 0) {
  console.error('❌ El catálogo no declara ningún valor. ¿Cambió su formato?');
  process.exit(1);
}

function recorrer(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      recorrer(p, acc);
    } else if (/\.(ts|html)$/.test(e.name)) {
      acc.push(p);
    }
  }
  return acc;
}

console.log('🔍 Nombres de icono contra el catálogo\n');

const hallazgos = new Map(); // nombre -> [{archivo, linea}]
let literales = 0;

for (const archivo of recorrer(RAIZ)) {
  const rel = archivo.replace(/\\/g, '/');
  if (rel === CATALOGO) continue;

  const lineas = fs.readFileSync(archivo, 'utf-8').split('\n');
  lineas.forEach((linea, i) => {
    // Una línea comentada es código muerto, no un icono que se dibuje.
    if (/^\s*(\/\/|\*|<!--)/.test(linea)) return;

    for (const m of linea.matchAll(/material-symbols-light:[a-z0-9-]+/g)) {
      literales++;
      const nombre = m[0];
      if (valores.has(nombre) || PERMITIDOS.has(nombre)) continue;
      if (!hallazgos.has(nombre)) hallazgos.set(nombre, []);
      hallazgos.get(nombre).push({ archivo: rel, linea: i + 1 });
    }
  });
}

console.log(`   Catálogo: ${valores.size} valores distintos`);
console.log(`   Código  : ${literales} literales\n`);

// ── Comprobación 2: no vuelven las clases de PrimeIcons ───────────────────
// El proyecto usa un solo paquete de iconos. `pi pi-*` se retiró por completo
// el 2026-08-11 (137 usos). Se tolera únicamente donde se *quita* el prefijo
// de datos heredados, y en las pruebas que verifican esa tolerancia.
const PI_PERMITIDO = [
  'src/app/shared/utils/icon-mapping.ts',
  'src/app/shared/utils/icon-mapping.spec.ts',
  'src/app/shared/ui/buttons/base/base-button.ts', // comentario histórico
  'src/app/shared/ui/buttons/mobile-button-base.ts', // comentario histórico
];

const pi = [];
for (const archivo of recorrer(RAIZ)) {
  const rel = archivo.replace(/\\/g, '/');
  if (PI_PERMITIDO.includes(rel)) continue;
  const lineas = fs.readFileSync(archivo, 'utf-8').split('\n');
  lineas.forEach((linea, i) => {
    if (/\bpi pi-/.test(linea)) pi.push({ archivo: rel, linea: i + 1, texto: linea.trim().slice(0, 110) });
  });
}

if (pi.length > 0) {
  console.error(`❌ ${pi.length} uso(s) de clases PrimeIcons (\`pi pi-*\`):\n`);
  for (const p of pi.slice(0, 25)) console.error(`   ${p.archivo}:${p.linea}\n     ${p.texto}`);
  if (pi.length > 25) console.error(`   … y ${pi.length - 25} más`);
  console.error(`\n   💡 Usa <app-icon> con un valor del catálogo. Si el icono va dentro`);
  console.error(`      de un componente PrimeNG, pásalo por <ng-template #icon>:`);
  console.error(`      su input \`icon\` espera una clase CSS y no entiende Iconify.`);
  process.exit(1);
}

if (hallazgos.size === 0) {
  console.log('✅ Auditoría superada: todo icono usado existe en el catálogo');
  console.log('   y no quedan clases de PrimeIcons.');
  process.exit(0);
}

const usos = [...hallazgos.values()].reduce((a, l) => a + l.length, 0);
console.error(`❌ ${hallazgos.size} nombre(s) fuera del catálogo, en ${usos} uso(s):\n`);

for (const [nombre, sitios] of [...hallazgos.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.error(`   ${nombre}  (${sitios.length})`);
  for (const s of sitios.slice(0, 5)) console.error(`     ${s.archivo}:${s.linea}`);
  if (sitios.length > 5) console.error(`     … y ${sitios.length - 5} más`);
}

console.error(`\n   💡 Un nombre fuera del catálogo NO falla en ejecución: si no existe`);
console.error(`      en Material Symbols, el icono simplemente no se dibuja.`);
console.error(`      Da de alta el concepto en ${CATALOGO}`);
console.error(`      (verificando el nombre contra el set real de Iconify) y úsalo desde ahí.`);
process.exit(1);

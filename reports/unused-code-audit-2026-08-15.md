# Auditoria de codigo no utilizado — `client/angular/src`

Fecha: 2026-08-15
Alcance: `D:\repos\luxuryapp-api\client\angular\src` (4244 archivos)
Modo: **solo lectura**. Ningun archivo fue movido, renombrado ni eliminado.

---

## SECCION 1 — RESUMEN EJECUTIVO

| Metrica | Valor |
|---|---|
| Total de archivos analizados (src/) | 4244 |
| Total KEEP (uso confirmado o sin evidencia suficiente para tocar) | 4137 |
| Total REVIEW_MANUAL | 5 |
| Total QUARANTINE_CANDIDATE | 79 |
| Total SAFE_TO_REMOVE_HIGH_CONFIDENCE | 23 |
| **Total candidatos (no-KEEP)** | **107** |
| Nivel de certeza global | Medio-alto para los clusters estructurales (evidencia cruzada por 3+ metodos); medio para DTOs/interfaces aisladas (evidencia por ausencia de referencias en todo el arbol, sin poder descartar 100% un consumo futuro planeado) |

**Como se llego a estos numeros:** no se leyo cada uno de los 4244 archivos linea por linea (inviable en una sola pasada). Se uso un motor de analisis estatico de tres capas y luego se verifico a mano cada patron encontrado:

1. **Grafo de dependencias** (`madge`, resolviendo `paths` de `tsconfig.json`: `@ui/*`, `src/*`) sobre los 2275 archivos `.ts` no-spec → 282 archivos sin ninguna arista entrante ("orphans").
2. **BFS de alcanzabilidad real desde `src/main.ts`** sobre el grafo completo → 385 archivos no alcanzables desde el punto de entrada de la app (superset que incluye tooling/tests legitimos, ver mas abajo).
3. **Cruce por texto en todo `src`** (no solo `.ts`): para cada huerfano se extrajeron sus simbolos exportados (clase/interfaz/enum/const/función/type), su `selector` de `@Component`, su `name` de `@Pipe`, y su nombre de archivo base; cada uno se buscó con `ripgrep` en la totalidad del arbol (HTML, SCSS, JSON, MD, TS) para detectar imports dinamicos, `loadComponent`/`loadChildren`, uso en plantillas y referencias documentales.

Sobre el resultado de ese cruce se hizo **verificacion manual archivo por archivo** de cada patron repetido (routing real vs. placeholders, duplicados de feature, imports comentados, colisiones de nombre) antes de asignar el nivel de confianza. El detalle completo de cada uno de los 107 candidatos esta en `reports/unused-code-audit-2026-08-15.json` / `.csv` (columnas: `filePath, fileType, status, confidence, reason, referencesFound, dynamicUsagePossible, referencedOnlyByTests, referencedOnlyByUnusedFiles, validationSuggested`).

**Riesgos detectados (mas alla de "codigo muerto"):**
- Un `*.spec.ts` (`pagination.service.spec.ts`) importa una clase (`PaginationService`) que ya no existe en el proyecto — fallaria si `vitest` lo recogiera. Esto no es limpieza opcional, es una prueba rota.
- Tres features completas con codigo real (no placeholders) quedaron sin ruta de entrada tras alguna refactorizacion: la app `security.luxuryapp` completa, el submodulo "Visitas" de `resident.luxuryapp`, y un segundo intento de `database-backup` en `system.luxuryapp` (la version real de esta ultima SI esta viva, via `admin.luxuryapp`).
- Existe una copia completa duplicada del feature "Fondeos SAT" (`contabilidad.luxuryapp/general-ledger/sat-funding/`) que quedo huerfana cuando el equipo migro a `contabilidad.luxuryapp/fondeos-y-reporteo/sat-funding/` (la copia activa). **La subcarpeta `interfaces/` de la copia huerfana SI se sigue usando desde la copia activa — no debe borrarse junto con el resto.**

**No se debe interpretar este informe como una lista para borrar de inmediato.** Es un mapa de candidatos con evidencia; la Seccion 6 propone el flujo seguro de validacion antes de cualquier eliminacion.

---

## SECCION 2 — TABLA DE RESULTADOS (candidatos, agrupados por hallazgo)

> Se omiten los 4137 archivos KEEP de esta tabla por volumen (ver Seccion 4 y el JSON para el criterio aplicado a cada tipo). Tabla completa y sin agrupar en `unused-code-audit-2026-08-15.csv`.

### Grupo A — Scaffolding de apps nunca conectado (23 archivos)

| Archivo | Tipo | Estado | Confianza | Motivo | Uso dinamico posible | Recomendacion |
|---|---|---|---|---|---|---|
| `apps/{contabilidad,direccion,legal,mantenimiento,operations,public,reclutamiento,recursos-humanos,resident,security,supplier,system,web}.luxuryapp/INDEX.ts` (13 archivos) | barrel | SAFE_TO_REMOVE_HIGH_CONFIDENCE | HIGH | Cada uno contiene solo `// Public API for X`, sin exports, sin referencias en todo `src` | No | Eliminar |
| `apps/{contabilidad,direccion,legal,mantenimiento,operations,public,reclutamiento,recursos-humanos,supplier,web}.luxuryapp/<app>.routes.ts` (10 archivos) | route | SAFE_TO_REMOVE_HIGH_CONFIDENCE | HIGH | Placeholder vacio; el enrutado real de cada app vive en `<app>.routing.ts` (nombre distinto: *routing* vs *routes*), confirmado leyendo cada `pages.routes.ts` / `app.routes.ts` | No | Eliminar |

### Grupo B — Features reales sin punto de entrada (24 archivos) — requieren decision de producto, no solo limpieza

| Archivo | Tipo | Estado | Confianza | Motivo | Recomendacion |
|---|---|---|---|---|---|
| `apps/resident.luxuryapp/resident.routes.ts` + `access-control/{visit-list,visit-form,visit-detail}.{ts,html}` (7) | route+component | QUARANTINE_CANDIDATE | HIGH | Feature "Visitas" con codigo funcional completo, pero `resident.luxuryapp` solo se enruta hoy via `directory.routing.ts` (owner-list, propiedades-list), que nunca importa `resident.routes.ts` | Confirmar con producto si "Visitas" debe reactivarse o abandonarse |
| `apps/security.luxuryapp/security.routes.ts` + `access-control/{access-scan,active-visits}.{ts,html}` (5) | route+component | QUARANTINE_CANDIDATE | HIGH | La app `security.luxuryapp` no tiene NINGUN punto de entrada de routing en toda la app; la unica mencion fuera de su propia carpeta es un comentario en `operations.endpoints.ts` | Confirmar con producto si el modulo "seguridad" (escaneo/visitas activas) sigue vigente |
| `apps/system.luxuryapp/system.routes.ts` (1) | route | QUARANTINE_CANDIDATE | HIGH | Segundo intento de ruta para `DatabaseBackupList`; la version realmente usada esta wireada en `admin.luxuryapp/admin.routes.ts` (`/admin/database-backup`) | Eliminar solo el archivo de rutas; el componente sigue vivo via admin |
| `apps/contabilidad.luxuryapp/general-ledger/sat-funding/**` (9: routes + sat-funding-list + sat-funding-detail + sat-funding-invoice-edit-form + sat-reconciliation-dialog, cada uno .ts+.html) | route+component | QUARANTINE_CANDIDATE | HIGH | Copia duplicada de `fondeos-y-reporteo/sat-funding/` (misma clase `SAT_FUNDING_ROUTES`, `SatFundingListComponent`, etc.); `pages.routes.ts:516-517` importa la copia de `fondeos-y-reporteo`, nunca esta | **No tocar** `general-ledger/sat-funding/interfaces/` (se sigue usando desde la copia activa) |
| `apps/contabilidad.luxuryapp/fondeos-y-reporteo/sat-funding/sat-reconciliation-dialog/*.{ts,html}` (2) | component | REVIEW_MANUAL | MEDIUM | Dentro del arbol ACTIVO: unica referencia es un `import` **comentado** en `funding-detail.ts` (feature deshabilitada, no huerfana por accidente) | Confirmar con el equipo si se reactivara |

### Grupo C — Catalogo interno de componentes (`herramientas-dev`), subpaginas desconectadas (10 archivos)

| Archivo | Estado | Confianza | Motivo |
|---|---|---|---|
| `catalog-mobile/mobile-layout/mobile-layout.ts` | REVIEW_MANUAL | MEDIUM | No importado por `catalog-mobile-item` ni por `catalog-mobile/index.ts`, a diferencia de sus pares |
| `catalog-mobile/mobile-page-structure/mobile-page-structure.ts` | REVIEW_MANUAL | MEDIUM | Mismo patron |
| `showcase/{buttons,data,dictionary,forms,layout,mobile,overlays}-showcase.component.ts` (7) | QUARANTINE_CANDIDATE | HIGH | Subcarpeta completa sin ninguna referencia, ni siquiera dentro del propio catalogo (que usa el patron `*-item.ts`, no `*-showcase.component.ts`) |
| `interfaces/print-config.interface.ts` | QUARANTINE_CANDIDATE | MEDIUM | Su unico "consumidor" es un spec placeholder que no prueba nada real |

### Grupo D — Interfaces/DTOs/servicios/componentes aislados sin ninguna referencia (45 archivos)

Ver tabla completa en el JSON/CSV (`status: QUARANTINE_CANDIDATE`, `fileType` in `interface|service|component|constant|model|util|directive|route|enum`). Resumen por carpeta:

| Carpeta | Cantidad | Confianza tipica |
|---|---|---|
| `app/core/interfaces/**` (DTOs de auth, recurring-tasks, almacen, notification, product-*, etc.) | 16 | HIGH |
| `app/apps/*.luxuryapp/**/interfaces|dto` (admin, auth, cobranza, contabilidad, mantenimiento, operations, reclutamiento, supplier) | 12 | HIGH |
| Servicios (`contabilidad-ai.service.ts`, `manual-pdf.service.ts`) | 2 | HIGH |
| Componentes standalone sueltos (`file-section.ts`, `recorrido-mantenimiento-bitacora-add.ts`, `register-employe-to-vacancy.ts`, `cedula-cliente-list.ts`) | 4 | HIGH |
| `app/core/constants/{critical-customer-ids,mx-masks}.ts`, `app/routing/permissions.routing.ts`, `app/shared/ui/base/menu-item.model.ts`, `app/shared/ui/headless/use-button.ts`, `app/core/testing/ionic-mock-factory.ts` | 6 | HIGH |
| Cadenas (solo referenciados por otro archivo tambien candidato): `projected-expenses.interface.ts` (x2 copias), `request-type.interface.ts`/`tipo-solicitud.interface.ts`, `primeng-tooltip.ts` | 5 | MEDIUM |

### Grupo E — Specs huerfanos o rotos (4 archivos)

| Archivo | Estado | Confianza | Motivo |
|---|---|---|---|
| `admin.luxuryapp/.../interfaces/print-config.model.spec.ts` | QUARANTINE_CANDIDATE | HIGH | Placeholder (`expect(true).toBe(true)`); nombre no coincide con ningun archivo real |
| `admin.luxuryapp/.../customer-modul/interfaces/customer-modul.dto.spec.ts` | QUARANTINE_CANDIDATE | HIGH | Placeholder; no existe `customer-modul.dto.ts` |
| `app/core/services/pagination.service.spec.ts` | **REVIEW_MANUAL (URGENTE)** | HIGH | **Roto**: importa `./pagination.service` y `PaginationService`, ninguno existe hoy (el servicio se convirtio en `pagination-store.ts`, sin esa clase) |
| `apps/supplier.luxuryapp/providers/provider/employee-provider-form.spec.ts` | QUARANTINE_CANDIDATE | HIGH | Prueba una ruta vieja; el componente real vive en `provider/` (singular) y tiene otros consumidores |

### Grupo F — Assets (1 archivo)

| Archivo | Estado | Confianza | Motivo |
|---|---|---|---|
| `apps/cobranza.luxuryapp/cobranza-online/image.png` | QUARANTINE_CANDIDATE | MEDIUM | Imagen suelta en carpeta de feature (no en `assets/`), sin referencias por nombre en HTML/CSS/TS |

**Estilos SCSS/CSS:** 0 candidatos. Los 6 archivos que inicialmente parecian huerfanos por busqueda de nombre completo resultaron ser partials de Sass referenciados sin extension/guion bajo (`@use "../../procedures-shared"`, `@import "custom/committee"`, etc.) — ver Seccion 5.

---

## SECCION 3 — CANDIDATOS DETALLADOS

El detalle completo por archivo (ruta, tipo, razon, busquedas realizadas, referencias encontradas, si es solo-tests, si es solo-referenciado-por-no-usados, riesgo de uso dinamico, validacion recomendada, confianza) esta en:

- `reports/unused-code-audit-2026-08-15.json` (estructura pedida en la Seccion 8, 107 filas)
- `reports/unused-code-audit-2026-08-15.csv` (misma informacion, tabular)

Los clusters mas significativos (Grupos A-C) ya se documentan con evidencia completa en la Seccion 2; para los 45 archivos del Grupo D, la "busqueda realizada" fue identica en todos: extraccion de simbolo exportado -> `rg -w '<Simbolo>' src` (sin resultados fuera del propio archivo) + verificacion de que no son ambient `.d.ts`, ni estan en `tsconfig*.json`/`angular.json`/`package.json`/configs de `vitest`/`storybook`.

---

## SECCION 4 — ARCHIVOS QUE NO DEBEN BORRARSE

Aunque en algun momento del analisis automatico aparecieron como "sin arista entrante" (orphans de `madge`) o "sin referencia por nombre de archivo", los siguientes se confirmaron como KEEP tras verificacion manual, y ilustran los falsos positivos tipicos de Angular/TS que este informe evito:

| Archivo | Por que es KEEP |
|---|---|
| `main.ts`, `index.html`, `environments/environment.ts`, `angular.json` | Entry points / configuracion de build |
| `test-setup.ts` | Referenciado en `vitest.config.ts` (`setupFiles`) y `tsconfig.spec.json` |
| `test-shims/oxc-decorate.ts` | Referenciado en `vitest.cobranza-nativa.config.ts` |
| `types/onesignal.d.ts`, `typings.d.ts`, `styles/design-tokens.d.ts` | Declaraciones ambient globales; TypeScript las incluye automaticamente sin necesidad de `import` |
| `stories/*.stories.ts`, `stories/*.component.ts`, `stories/user.ts`, `stories/assets/*.{png,svg,avif}`, `app/shared/ui/web/charts/chart-wrapper.stories.ts` | Recogidos por el glob de `.storybook/main.ts` (`../src/**/*.stories.@(...)`, `../src/**/*.mdx`); las imagenes se referencian desde `stories/Configure.mdx` |
| Los 105 archivos `.scss`/`.css` de `src/` | Todos importados via `@use`/`@import`/`styleUrls`/`url()`; los 6 que parecian huerfanos por nombre completo son partials Sass referenciados sin `_` ni extension |
| `app/apps/contabilidad.luxuryapp/general-ledger/sat-funding/interfaces/*` | Aunque su carpeta hermana (`sat-funding-list`, `sat-funding-detail`, `sat-funding.routes.ts`) esta huerfana, esta subcarpeta especifica SI se importa desde la copia activa en `fondeos-y-reporteo/sat-funding/sat-funding-detail/sat-funding-invoice-edit-form.ts` |
| `apps/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.ts` (componente, no la ruta) | Vivo via `admin.luxuryapp/admin.routes.ts`, aunque el archivo de rutas de `system.luxuryapp` que "deberia" cargarlo esta muerto |
| 919 - 4 = 915 archivos `*.spec.ts` restantes | Cada uno tiene un archivo fuente homónimo existente en su misma carpeta |

---

## SECCION 5 — FALSOS POSITIVOS DETECTADOS

Durante el analisis, los siguientes patrones generaron candidatos iniciales que se descartaron tras verificacion, documentados para que futuras auditorias no repitan el error:

1. **Colision de nombre entre placeholder y archivo real.** Los 5 archivos `apps/{direccion,legal,operations,public,web}.luxuryapp/<app>.routes.ts` exportan una constante (`direccionRoutes`, `legalRoutes`, etc.) con el **mismo nombre** que la constante exportada por el archivo REAL y activo `<app>.routing.ts` (sufijo distinto: *routing* vs *routes*). Una busqueda de texto simple por nombre de simbolo los marca como "usados" porque encuentra el `.routing.ts` activo. Solo la lectura manual de cada `import(...)` en `pages.routes.ts`/`app.routes.ts` revelo que apuntan siempre a `*.routing.ts`, nunca a `*.routes.ts`.
2. **Referencia dentro de comentario.** `sat-reconciliation-dialog.ts` (copia activa en `fondeos-y-reporteo`) tiene una linea `// import { SatReconciliationDialog } from ...` en `funding-detail.ts`. Una busqueda de texto sin distinguir comentarios lo marca como "referenciado"; la linea esta comentada, por lo que en tiempo de compilacion no hay ninguna referencia real.
3. **Import dinamico (`loadComponent`/`loadChildren`) hacia archivo tambien huerfano.** `sat-funding-list.ts` y `sat-funding-detail.ts` (copia de `general-ledger`) SI tienen una arista entrante en el grafo estatico (la importa `sat-funding.routes.ts`), por lo que `madge --orphans` no los marca como huerfanos. Solo el BFS de alcanzabilidad desde `main.ts` revela que esa arista nace en un nodo el mismo inalcanzable.
4. **Glob de Storybook (`.mdx`/`.stories.ts`).** Los archivos en `src/stories/` y `chart-wrapper.stories.ts` no tienen ningun `import` estatico desde la app, pero Storybook los descubre por glob (`.storybook/main.ts`). Sin leer esa configuracion, se habrian marcado como candidatos de alta confianza.
5. **Declaraciones ambient (`.d.ts`).** `typings.d.ts`, `types/onesignal.d.ts` no aparecen importados en ningun archivo (es el comportamiento normal de TypeScript para tipos globales), lo que los hace parecer huerfanos a cualquier herramienta basada en grafo de imports.
6. **Partials de Sass sin `_` ni extension.** `@use "../../procedures-shared"` no contiene el nombre completo de archivo (`_procedures-shared.scss`), por lo que una busqueda por nombre de archivo completo no lo encuentra; hubo que normalizar el nombre de modulo (quitar `_` y extension) antes de buscar.

---

## SECCION 6 — PLAN DE LIMPIEZA SEGURA

**No se ejecuto ninguna fase destructiva.** Plan propuesto:

- **Fase 1 — Solo reporte (COMPLETADA con este documento).**
- **Fase 2 — Cuarentena de los 23 archivos `SAFE_TO_REMOVE_HIGH_CONFIDENCE` (Grupo A).**
  ```powershell
  git checkout -b chore/unused-files-analysis
  New-Item -ItemType Directory -Force _quarantine | Out-Null
  # mover cada archivo del Grupo A preservando la ruta relativa, ej.:
  # Move-Item "src/app/apps/contabilidad.luxuryapp/INDEX.ts" "_quarantine/app/apps/contabilidad.luxuryapp/INDEX.ts"
  ```
- **Fase 3 — Build + tests.**
  ```powershell
  npm ci
  npx ng build --configuration production
  npx vitest run
  npx tsc --noEmit
  npm run lint
  ```
  Si falla: revertir (`git checkout -- .` sobre los archivos movidos), marcar el archivo como KEEP/REVIEW_MANUAL y registrar que referencia causo el fallo.
  Si pasa: los 23 archivos quedan como "candidatos validados por build+tests", pendientes de aprobacion humana para borrado definitivo.
- **Fase 4 — Revision manual de los Grupos B, C, D, E, F (84 archivos).** Estos requieren una decision humana adicional porque:
  - Grupo B son **features reales** sin wireado — la decision es de producto ("¿reactivar o abandonar Visitas / seguridad / conciliacion SAT?"), no solo tecnica.
  - Grupo E incluye un spec **roto** (`pagination.service.spec.ts`) que conviene arreglar o eliminar cuanto antes, independientemente del resto del plan.
  - Grupo D son DTOs/interfaces que podrian ser contratos pendientes de consumir desde el backend (no hay forma de descartar eso solo con analisis estatico del frontend).
- **Fase 5 — Eliminacion definitiva (opcional, requiere aprobacion explicita por archivo o grupo).** No se ejecuta como parte de este informe.

---

## SECCION 7 — COMANDOS DE VALIDACION SUGERIDOS

```powershell
# Listar archivos de un candidato especifico
Get-ChildItem -Path "D:\repos\luxuryapp-api\client\angular\src\app\apps\security.luxuryapp" -Recurse -File

# Confirmar cero referencias tras mover a cuarentena (ejemplo: INDEX.ts de contabilidad)
rg -n "contabilidad.luxuryapp/INDEX" "D:\repos\luxuryapp-api\client\angular\src"

# Confirmar que un simbolo exportado no se usa en ningun lado (ejemplo: PaginationService)
rg -n "\bPaginationService\b" "D:\repos\luxuryapp-api\client\angular\src"

# Ejecutar el spec roto para confirmar el fallo antes de tocarlo
npx vitest run src/app/core/services/pagination.service.spec.ts

# Build de produccion tras mover el Grupo A a _quarantine/
npx ng build --configuration production

# Suite completa de tests
npx vitest run

# Chequeo de tipos sin emitir
npx tsc --noEmit
```

Adaptar `rg`/`Get-ChildItem` a cada archivo especifico antes de decidir su eliminacion definitiva.

---

## SECCION 8 — SALIDA ESTRUCTURADA

Ver `reports/unused-code-audit-2026-08-15.json` y `reports/unused-code-audit-2026-08-15.csv` (107 filas, esquema pedido: `filePath, fileType, status, confidence, reason, referencesFound, dynamicUsagePossible, referencedOnlyByTests, referencedOnlyByUnusedFiles, validationSuggested`).

---

## Restricciones aplicadas

- No se inventaron referencias: toda afirmacion de "sin uso" se baso en busqueda exhaustiva en `src` completo (no solo `.ts`), mas lectura manual del archivo consumidor mas probable en cada cluster.
- No se asumio "no usado" solo por ausencia de imports visibles: se verificaron selectores, `@Pipe` names, imports dinamicos, colisiones de nombre y comentarios antes de confirmar cada candidato.
- No se asumio "usado" solo por existir en una carpeta activa (ver Grupo C, subpaginas del catalogo interno).
- Rutas lazy, componentes standalone, selectores en HTML, assets referenciados desde SCSS/HTML, y specs se revisaron explicitamente (Secciones 2 y 4).
- Ningun candidato se marco `HIGH` sin haber comprobado rutas, imports dinamicos, `angular.json`/`tsconfig`/`package.json`/configs de testing y storybook.

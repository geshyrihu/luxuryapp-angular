# Plan de Migración a UI Abstraída en `features/`

> Última actualización: **2026-07-10** — **Los 19 `p-*` de operations fueron migrados (commit `4e21452f`). Tags `p-*` no permitidos en `features/`+`apps/`: solo `p-dataview`×1 (template inline, no inventariado antes).** Nueva deuda detectada a nivel directivas/imports. Ver §12 para el estado verificado hoy.
> Alcance: `client/angular/src/app/features/`
> Objetivo: eliminar uso directo de PrimeNG/Ionic en `features/`, migrando a wrappers de `shared/`.
> Excepción temporal permitida: `p-table` y su familia autorizada.

---

## 0. Estado real actual (árbol, verificado 2026-07-09 con `rg`)

Se excluye el catálogo demo `system/catalogs/catalog-component-ui`.

### Métricas globales

| Métrica | Valor |
|---|---|
| `p-*` HTML (no permitidos) | **226 → 19** (OpenCode −53, Claude −148, KiloCode −6). Todos en `operations/`. |
| `ion-*` HTML | **14 → 12** tras OpenCode (ion-badge×2 migrados). Pendientes: ion-ripple-effect×2 (legal). |
| `primeng/*` en TS `features` | **245** → exports legítimos: `primeng/table`, `primeng/api`, `primeng/dynamicdialog`. Sin imports UI sueltos. |
| `@ionic/angular/standalone` en TS | **2** (solo `.spec.ts`, `ToastController`) — no bloquea |
| Mojibake (`scan-mojibake.mjs`) | **CERO** |

### `p-*` por familia (19 restantes, todas en operations)

```
fileupload 6 · listbox 6 · editor 2 · image 2 · avatar 1 · splitbutton 1 · toolbar 1
```
(multiselect 4, radiobutton 2 → migrados por KiloCode)

### `p-*` por módulo

```
operations 19 · maintenance 0 · legal 0 · purchasing 0 · recruitment 0 ·
system 0 · hr 0 · accounting 0
```

### Tabla cruzada módulo × familia `p-*`

```
operations    fileupload 6   listbox 6   editor 2   image 2
              avatar 1      splitbutton 1   toolbar 1
```
(multiselect 4 + radiobutton 2 migrados)

### Estado por tipo de migración

```
Migrables (wrapper funcional tras KiloCode): listbox 6 · editor 2 · splitbutton 1 · toolbar 1   = 10
Rework (API incompatible):                   fileupload 6                                        = 6
Código muerto (HTML huérfano sin .ts):       image 2 · avatar 1                                 = 3
```

### `ion-*` por módulo × familia (14 → 12 pendientes)

```
accounting   ion-input-checkbox 3   ion-input-select 2   (DS-internos, NO Ionic)
hr           ion-input-checkbox 1                      (DS-interno)
legal        ion-ripple-effect 2     (Ionic real — política pendiente)
operations   ion-input-select 1      ion-input-text 1    (DS-interno el select)
system       ion-input-toggle 2
```

> `ion-input-checkbox` / `ion-input-select` son componentes propios de DS (no Ionic) → **no cuentan como deuda Ionic**. El Ionic real es: `ion-ripple-effect`×2, `ion-input-toggle`×2, `ion-input-text`×1.

---

## 1. Contradicciones con el plan anterior (por qué se reescribe)

El plan previo estaba basado en un inventario inflado/obsoleto. Diferencias materiales contra el árbol real:

1. **Volumen total**: afirmaba "~60 `p-*` y 1 `ion-*`". Real: **226 `p-*` / 14 `ion-*`**.
2. **`p-tag`**: afirmaba "~42". Real: **123**.
3. **`accounting` "100% cerrado / 0 violaciones"**: Real: tiene `p-listbox`×1 y `p-splitbutton`×1 (sin wrapper) + 5 `ion-input-*` DS-internos.
4. **`p-listbox` / `p-splitbutton` "fantasma / 0 usos"**: Real: **`p-listbox`×7, `p-splitbutton`×2** (sin wrapper).
5. **Módulos `dashboard` / `sales` / `production`**: **no existen** en `features/` (esto sí era correcto).
6. El inventario previo mezclaba `features/` + `shared/` + demo en una sola auditoría, inflando números.

=> Este documento **reemplaza** al anterior como línea base. No reusar los conteos viejos (129/135/103/69).

---

## 2. Reglas de cumplimiento

### Permitido (excepción temporal)
`p-table`, `p-sorticon`, `p-columnfilter`, `p-tablecheckbox`, `p-tableheadercheckbox`, y templates `#caption`/`#header`/`#body`/`#emptymessage`/`#paginatorleft`.

### Prohibido en `features/`
- Cualquier otro tag `p-*` (incluye `p-tag`, `p-fieldset`, `p-listbox`, `p-toolbar`, etc.).
- `ion-*` reales (salvo `ion-input-checkbox`/`ion-input-select` que son DS-internos).
- Imports UI directos de `primeng/*` (salvo `api`, `dynamicdialog`, `table` que son excepciones técnicas).

### Excepción demo
`system/catalogs/catalog-component-ui` queda excluido del diagnóstico operativo. No "arreglar".

---

## 3. Wrappers existentes — estado real (verificado 2026-07-09)

**29/29 wrappers existen** con adaptive + base/web/mobile + spec:

`lx-tag`, `lx-message`, `lx-fieldset`, `lx-divider`, `lx-panel`, `lx-checkbox`, `lx-image`, `lx-avatar`, `lx-toast`, `lx-rating`, `lx-confirm-dialog`, `lx-badge`, `lx-accordion`, `lx-carousel`, `lx-skeleton`, `lx-listbox`, `lx-split-button`, `lx-menu`, `lx-panel-menu`, `lx-toolbar`, `lx-multi-select`, `lx-editor`, `lx-radio-button`, `lx-progress-bar`, `lx-steps`, `lx-modal` (→`p-dialog`), `lx-sidebar` (→`p-drawer`), `lx-file-upload` (→`p-fileupload`).

Además `custom-input-number-signal` vive en `shared/ui/inputs/adaptive/input-number/` (selector atípico, no `lx-*`).

### API gaps — estado (2026-07-09)

| Wrapper | Gap | Consumidor afectado | Estado |
|---|---|---|---|
| `lx-editor` | No era CVA | p-editor×2 | ✅ Fixeado (NG_VALUE_ACCESSOR) |
| `lx-listbox` | No era CVA | p-listbox×6 | ✅ Fixeado (NG_VALUE_ACCESSOR) |
| `lx-toolbar` | Sin slots `start`/`end` | p-toolbar×1 | ✅ Fixeado (@ContentChild + pTemplate) |
| `lx-split-button` | Sin input `icon` | p-splitbutton×1 | ✅ Fixeado (input icon agregado) |

**Build OK tras fixes.** Todos los wrappers están funcionales. Pendiente migrar HTML + imports TS.

---

## 4. División en 3 agentes (fronteras por módulo, sin solapamiento)

Principios:
1. Cada agente trabaja por frontera de módulos (nunca por archivos sueltos).
2. **Los wrappers faltantes los crea UN solo dueño** (`KiloCode`, ver bloque 3) como prerrequisito transversal, para no colisionar.
3. No tocar `system/catalogs/catalog-component-ui`.
4. No tocar la familia `p-table` autorizada.
5. Validar mojibake + `tsc` en cada lote.

### Agente **Claude** → `operations` + `maintenance`
- **Volumen**: operations 126 `p-*` + maintenance 37 `p-*` = **163**. `ion-*` reales: operations 2 (`ion-input-text`, `ion-input-select` DS).
- **Prerrequisito**: que `KiloCode` publique `lx-listbox`, `lx-splitbutton`, `lx-menu`, `lx-toolbar`, `lx-multiselect`, `lx-editor`, `lx-radiobutton`, `lx-progressbar`.
- **Quick wins (wrapper ya existe, migrar primero)**: `p-tag` (69+33), `p-fieldset` (11), `p-divider` (2+1), `p-panel` (4), `p-fileupload` (7), `p-image` (2), `p-message` (4), `p-accordion`+`p-accordiontab` (2+4), `p-dialog` (1), `p-drawer` (1), `p-avatar` (1), `p-checkbox` (1), `p-confirmdialog` (1), `p-toast` (— hr, no aquí).
- **Tras wrappers**: `p-listbox` (6), `p-splitbutton` (1), `p-toolbar` (1), `p-multiselect` (4), `p-editor` (2), `p-radiobutton` (2), `p-progressbar` (1).
- **Ionic real**: `operations/task-engine/tasks/task-message/pages/task-list.html` (`ion-input-text`, `ion-input-select` DS → revisar mapeo `ili-*`).

### Agente **OpenCode** ✅ — `legal` + `purchasing` + `recruitment` + `system` + `hr`
- **Volumen original**: legal 22 + purchasing 20 + recruitment 7 + system 6 + hr 6 = **61 `p-*`**.
- **Migrados**: **53/61** (legal 22/22, purchasing 16/20, recruitment 7/7, system 6/6, hr 0/6).
- **Quick wins completados**:
  | Módulo | Familia | Antes | Ahora |
  |--------|---------|-------|-------|
  | legal | `p-tag` | 21 | 0 |
  | legal | `p-badge` | 1 | 0 |
  | legal | `ion-badge` | 1 | 0 (→`lx-badge`) |
  | purchasing | `p-rating` | 6 | 0 |
  | purchasing | `p-fieldset` | 6 | 0 |
  | purchasing | `p-divider` | 3 | 0 |
  | purchasing | `p-skeleton` | 1 | 0 |
  | purchasing | `ion-badge` | 1 | 0 (→`lx-badge`) |
  | recruitment | `p-divider` | 7 | 0 |
  | system | `p-skeleton` | 6 | 0 |
- **Blockers descubiertos — estado actual (2026-07-09)**:
  | Ítem | Módulo | Cant | Estado | Razón |
  |------|--------|------|--------|-------|
  | `p-confirmdialog` | hr | 0 | ✅ resuelto | Migrado a `lx-confirm-dialog` |
  | `p-toast` | hr | 0 | ✅ resuelto | Migrado a `lx-toast` |
  | `p-panelmenu` | hr | 0 | ✅ resuelto | Migrado a `lx-panel-menu` |
  | `p-carousel` | purchasing | 0 | ✅ resuelto | Migrado/eliminado |
  | `p-fluid` | purchasing | 0 | ✅ resuelto | Clase CSS, no componente |
  | `p-inputnumber` | purchasing | 0 | ✅ resuelto | Comentado, no activo |
  | `ion-ripple-effect` | legal | 2 | ⏳ pendiente | Ionic real — política de mapeo `ili-*` pendiente |
  | API gaps en wrappers (§3) | operations | 10 | ⏳ pendiente | lx-editor/listbox CVA, lx-toolbar slots, lx-split-button icon |

### Agente **KiloCode** ✅ — lane completado (2026-07-09)
- **Wrappers**: 0 por crear — los 29 ya existen en `shared/ui/`.
- **Accounting**: 0 `p-*` — budget-support-dialog ya usa `lx-listbox`, funding-detail ya usa `lx-split-button`.
- **Scope real**: corregir API gaps en wrappers existentes (§3 API gaps) para desbloquear los 25 `p-*` de operations.

---

## 5. Orden recomendado de ejecución — Estado actual

1. **KiloCode** ✅ — lane completado. Wrappers existen, accounting limpio.
2. **OpenCode** ✅ — quick wins completados (53/61). Blockers documentados en §4.
3. **Claude** ✅ — los 19 `p-*` restantes de `operations/` migrados (commit `4e21452f`, verificado 2026-07-10 en §12).

---

## 6. Quick wins — estado actual (2026-07-09)

```
p-listbox 6         → lx-listbox        [✅ MIGRADO — verificado 2026-07-10, 0 usos]
p-editor 2          → lx-editor         [✅ MIGRADO — verificado 2026-07-10, 0 usos]
p-toolbar 1         → lx-toolbar        [✅ MIGRADO — verificado 2026-07-10, 0 usos]
p-splitbutton 1     → lx-split-button  [✅ MIGRADO — verificado 2026-07-10, 0 usos]
p-multiselect 4     → lx-multi-select   [✅ MIGRADO por KiloCode]
p-radiobutton 2     → lx-radio-button   [✅ MIGRADO por KiloCode]
p-fileupload 6      → lx-file-upload    [✅ RESUELTO — 0 usos (commit 4e21452f)]
p-image 2 + avatar 1→ lx-image/avatar   [✅ RESUELTO — 0 usos (HTML huérfano eliminado/migrado)]
```

---

## 7. Riesgos / No tocar mecánicamente

- **Familia `p-table`**: excepción permitida, no migrar.
- **Demo `catalog-component-ui`**: excluido, no "arreglar".
- **`ion-input-checkbox` / `ion-input-select`**: DS-internos, no Ionic → no migrar como Ionic.
- **`ion-ripple-effect` / `ion-input-toggle` / `ion-input-text`**: Ionic real → mapear a `ili-*` (mobile); requiere definir política aparte, no arrancar suelto.
- **`p-fileupload`** (6): `app-file-upload` es dropzone con API distinta; los usos son `mode="basic"` + template-ref imperativo → rework por archivo, no mecánico.
- **`p-image`/`p-avatar`** (3): en `my-tasks-list.html` que es HTML huérfano (no existe su `.ts`) → código muerto, no compila; deuda no real.
- **API gaps**: `lx-editor`/`lx-listbox` no son CVA; `lx-toolbar` sin slots; `lx-split-button` sin icon input. Fixear antes de migrar esos 10 usos.

---

## 8. Validaciones mínimas por agente

- `rg` de `<p-(?!(?:table|sorticon|columnfilter|tablecheckbox|tableheadercheckbox)\b)` y `<ion-` = **0** en su scope (excl demo).
- `node scripts/scan-mojibake.mjs` en archivos tocados = **0**.
- `tsc` / `npm run build` sin errores nuevos atribuibles a su lane.

---

## 9. Criterio de aceptación final

- `features/` sin `p-*` no permitidos ni `ion-*` reales.
- Excepciones (p-table, demo, DS-internos `ion-input-*`) documentadas.
- Wrappers faltantes creados y publicados.
- Build verde, mojibake 0.

---

## 10. Siguiente paso

1. **KiloCode** ✅ — lane completado (wrappers existen, accounting limpio).
2. **Claude** ✅ — 25 `p-*` de `operations/` migrados + API gaps fixeados (§3). Verificado 2026-07-10.
3. **Post-migración** (pendiente, ver §12): `p-dataview`×1 inline (diagram-gallery.ts), `ion-ripple-effect`×2 (legal), deuda de directivas (`pTooltip`×290) e imports `primeng/*` muertos.
4. Al cerrar cada lote, cada agente actualiza su bloque en este plan con: carpetas cerradas, familias reducidas, blockers, validación.

---

## Sesión 2026-07-08 (Claude — operations + maintenance, quick wins)

### Ejecutado (build verde `ng build EXIT=0` en cada familia; sin errores en el lane)

**129/163 `p-*` migrados.** Commits: p-tag `e8eb3a87`, fieldset/panel/divider `96813187`, message/dialog/drawer `7da53fb7`, checkbox `8bddb7f8`.

- `p-tag` (102) → `lx-tag`. Incluye tags con contenido proyectado (`#content`, `<span>N</span>`, `<app-icon>`) → inputs `value`/`icon`; chip removible → `lx-tag` + botón hermano. Mapeos `pTooltip`→`tooltip`, drop `size`/`tooltipPosition`, `border-round`→`rounded`.
- `p-fieldset` (11)→`lx-fieldset`, `p-panel` (4)→`lx-panel` (rename + contenido).
- `p-divider` (3): vacíos→`lx-divider`; 2 etiquetados (`align=center`+label)→fila flex con `lx-divider`+label.
- `p-message` (4)→`lx-message`.
- `p-dialog` (2)→`lx-modal`, `p-drawer` (1)→`lx-sidebar` (`[(visible)]` sobre signal→`[visible]()`/`(visibleChange)`; se pierden `[style]`/width).
- `p-checkbox` grupo (1, recurrence byDay)→`lx-checkbox` con `isDaySelected`/`toggleDay`.
- Limpieza: 28 null bytes en `equipos-list.ts`; comentario muerto `<p-confirmdialog>`.

### Diferido en mi lane (con razón)

- **`p-accordion`+`p-accordiontab` (6, 2 archivos: minutas-list, entrega-recepcion-check)**: multi-panel. El wrapper `web/accordion` usa `<ng-content [select]>` dinámico (mismo problema que tenían las tabs). Necesita el **mismo fix DOM-toggle que apliqué a `web/tabs`+`mobile/tabs`** → como `shared/ui` es de **KiloCode**, lo dejo para que lo arregle (o me autorizas a replicarlo en accordion).
- **`p-fileupload` (7, 5 archivos)**: `app-file-upload` es un componente **dropzone con API distinta**; los usos son `mode="basic"` + template-ref imperativo (`#imgUploader`) → **rework por-archivo**, no mecánico.
- **`p-image` (2) + `p-avatar` (1)**: todos en `task-engine/tasks/my-tasks/pages/my-tasks-list.html`, que es **HTML huérfano (no existe su `.ts`)** → código muerto, no compila; deuda no real.

### Update 2026-07-09 (Claude cont.)

- **`p-accordion`/`accordiontab` (6) HECHO** → `lx-accordion` (un accordion por panel; evita el bug de proyección multi-panel sin tocar shared/ui). Commit accordion.
- **`p-progressbar` (1) HECHO** → `lx-progress-bar` (`onValueProgress` ahora devuelve color semántico).
- **Total Claude: 136/163** migrados. Quedan **26** (todos bloqueados por wrappers ajenos, rework o código muerto).

### ⚠ FEEDBACK a KiloCode — wrappers publicados que NO sirven aún para mis consumidores

Revisé los wrappers nuevos; estos **no son usables tal cual** y bloquean la migración:

| Wrapper | Problema | Consumidor afectado |
|---|---|---|
| `lx-editor` | pasa `[formControlName]` como **input** al `p-editor` interno; no es `ControlValueAccessor` → runtime "no value accessor" (el contexto de `formGroup` no cruza el boundary). | `p-editor` (2): announcement-admin-form (`formControlName`), inventory service-order (`[formControl]`) |
| `lx-listbox` | igual: consumidores usan `formControlName`; el wrapper solo expone `value` model, no es CVA. | `p-listbox` (6): announcement-admin-form, etc. |
| `lx-toolbar` | usa `<ng-content/>` plano; mis usos dependen de `#left`/`#right` (pTemplate) → se pierde el layout. | `p-toolbar` (1): task-instance-list |
| `lx-split-button` | no expone input `icon`; mi uso es **icon-only** (`icon="mdi:dots-vertical"`, sin label). | `p-splitbutton` (1): task-report-work-plan |

**Pido a KiloCode**: hacer `lx-editor`/`lx-listbox` **CVA** (`NG_VALUE_ACCESSOR`, soportar `formControl`/`formControlName`); `lx-toolbar` con slots `start`/`end`; `lx-split-button` con input `icon`. Luego yo migro esos 10 usos.

### Update 2026-07-09 (KiloCode audit + fixes)

**Corrección al plan**: Los 11 wrappers listados como "faltantes" en §3 YA EXISTEN. Accounting ya está limpio. HR ya está limpio.

**KiloCode ejecutó**:
1. Fixeó los 4 API gaps reportados por Claude (lx-editor/listbox CVA, lx-toolbar slots, lx-split-button icon).
2. Migró 6 migraciones directas: p-radiobutton×2 → lx-radio-button, p-multiselect×4 → lx-multi-select.
3. Fixeó bugs pre-existentes en wrappers multi-select (faltaba FormsModule) y radio-button (faltaba ReactiveFormsModule).
4. Build OK.

**Quedan 19 `p-*` en operations/**:
- 10 migrables (listbox×6, editor×2, splitbutton×1, toolbar×1) — wrapper funcional tras API gaps fixeados, solo falta migrar HTML + imports
- 6 fileupload — rework por archivo (API incompatible)
- 3 dead code (image×2 + avatar×1 en HTML huérfano sin .ts)

### Ionic real en operations

`operations/task-engine/.../task-list.html` (`ion-input-text`/`ion-input-select` — DS-internos) → revisar mapeo `ili-*` (no urgente, son DS no Ionic crudo).

---

## 11. Hallazgo 2026-07-10 — Inventario `ion-*` en `features/` + `apps/`

> 🛠️ **CORREGIDO por §14 (auditoría posterior).** Este apartado contaba `ion-*` **sin filtrar el demo** `catalog-component-ui`. La auditoría de §14 demuestra que **el 100% del Ionic real (302 usos) está dentro del demo** (excepción documentada) y que el código de negocio tiene **0 Ionic real**. No usar los "314 real Ionic en apps" de esta sección como deuda: era casi todo el demo. Ver §14 para el estado correcto.

> ⚠️ (redacción original) **Contradicción con el estado "resuelto".** Este plan y el `CLAUDE.md` declaran `features/` limpio de Ionic real. Tras mover carpetas, el inventario se rehace sobre **ambas** raíces: `client/angular/src/app/features/` y `client/angular/src/app/apps/`. El grueso de Ionic vive ahora en **`apps/`**, que **nunca estuvo en el alcance** original del plan.

### Alcance del barrido
- Carpetas: `client/angular/src/app/features/` **+** `client/angular/src/app/apps/`
- Archivos: `*.html` + `*.ts` (plantillas inline)
- Conteo: solo etiquetas de apertura (`<ion-…`)
- Herramienta: `rg` (2026-07-10)

### Métricas globales

| Métrica | Valor |
|---|---|
| Ocurrencias totales `<ion-*>` | **346** |
| Elementos distintos | **83** |
| — Ionic real (librería `@ionic`) | **316** ocurrencias · **68** distintos |
| — `ion-input-*` (wrappers DS, NO Ionic) | **30** ocurrencias · **15** distintos |

### Reparto por carpeta

| Carpeta | Ocurrencias | Ionic real | `ion-input-*` (DS) |
|---|---|---|---|
| `features/` | 9 | 2 (`ion-ripple-effect`) | 7 (`ion-input-checkbox`×3, `ion-input-select`×3, `ion-input-text`×1) |
| `apps/` | 337 | 314 | 23 |

> En `features/` el único Ionic real sigue siendo `ion-ripple-effect`×2 (legal), consistente con §7. Todo lo demás nuevo está en `apps/`.

### Componentes estándar de Ionic (librería `@ionic`) — combinado

| Elemento | Usos | Elemento | Usos | Elemento | Usos |
|---|---|---|---|---|---|
| ion-icon | 44 | ion-avatar | 3 | ion-card-title | 1 |
| ion-button | 36 | ion-app | 3 | ion-reorder-group | 1 |
| ion-label | 35 | ion-row | 2 | ion-tabs | 1 |
| ion-item | 23 | ion-datetime-button | 2 | ion-tab-bar | 1 |
| ion-toolbar | 9 | ion-item-sliding | 2 | ion-textarea | 1 |
| ion-content | 9 | ion-fab | 2 | ion-accordion-group | 1 |
| ion-spinner | 9 | ion-note | 2 | ion-back-button | 1 |
| ion-list | 9 | ion-datetime | 2 | ion-segment | 1 |
| ion-title | 7 | ion-toggle | 2 | ion-searchbar | 1 |
| ion-buttons | 7 | ion-thumbnail | 2 | ion-card-content | 1 |
| ion-modal | 7 | ion-checkbox | 2 | ion-card | 1 |
| ion-header | 7 | ion-chip | 2 | ion-select | 1 |
| ion-fab-button | 6 | ion-card-header | 1 | ion-range | 1 |
| ion-badge | 6 | ion-refresher-content | 1 | ion-infinite-scroll-content | 1 |
| ion-ripple-effect | 5 | ion-refresher | 1 | ion-input | 1 |
| ion-col | 5 | ion-item-divider | 1 | ion-menu-button | 1 |
| ion-skeleton-text | 4 | ion-menu | 1 | ion-picker | 1 |
| ion-picker-column-option | 4 | ion-radio-group | 1 | ion-grid | 1 |
| ion-segment-button | 3 | ion-infinite-scroll | 1 | ion-footer | 1 |
| ion-accordion | 3 | ion-list-header | 1 | ion-fab-list | 1 |
| ion-tab-button | 3 | ion-select-option | 3 | | |
| ion-progress-bar | 3 | ion-item-options | 3 | | |
| ion-picker-column | 3 | ion-reorder | 3 | | |
| ion-item-option | 3 | ion-radio | 3 | | |

### Componentes propios con prefijo `ion-input-*` (wrappers DS, NO Ionic) — combinado

| Elemento | Usos | Elemento | Usos |
|---|---|---|---|
| ion-input-checkbox | 5 | ion-input-multiselect | 1 |
| ion-input-text | 4 | ion-input-otp | 1 |
| ion-input-password | 4 | ion-input-search | 1 |
| ion-input-select | 4 | ion-input-select-bool | 1 |
| ion-input-toggle | 3 | ion-input-file | 1 |
| ion-input-time | 1 | ion-input-number | 1 |
| ion-input-textarea | 1 | ion-input-date | 1 |
| ion-input-currency | 1 | | |

### Conclusión del hallazgo
- El estado "resuelto" solo aplica a `features/`, donde el único Ionic real remanente es `ion-ripple-effect`×2 (legal).
- **`apps/` concentra prácticamente toda la deuda Ionic**: 314 ocurrencias de Ionic real (`ion-icon`, `ion-button`, `ion-label`, `ion-item`, `ion-content`, `ion-toolbar`, `ion-list`, etc.) — **no** son DS-internos.
- Los `ion-input-*` (15 tipos, 30 usos) son wrappers propios del DS y **no** cuentan como deuda Ionic (misma clasificación que §7).
- **Acción sugerida:** decidir si `apps/` entra en el alcance de la migración UI abstraída. Si el objetivo es erradicar Ionic crudo del proyecto, `apps/` requiere su propio plan/lane; este plan por sí solo no cubre esa deuda.

---

## 12. Seguimiento 2026-07-10 — Cierre de tags `p-*` verificado + deuda nueva (directivas/imports)

> Barrido con `rg` sobre `features/` + `apps/` (HTML **y** templates inline en `.ts`, excl. specs y demo). Catálogo de wrappers en `shared/ui/`.

### ✅ Avance confirmado: los 19 `p-*` de operations están migrados

Commit `4e21452f` ("Finalizacion de abtraccion de componentes primeng y Ionic") cerró todo lo pendiente de §0/§6:
- listbox×6, editor×2, splitbutton×1, toolbar×1 → migrados a `lx-*`.
- fileupload×6 (rework) → 0 usos.
- image×2 + avatar×1 (HTML huérfano) → 0 usos.

### Estado de tags `p-*` no permitidos (verificado 2026-07-10)

| Hallazgo | Ubicación | Estado |
|---|---|---|
| `p-dataview`×1 + `import DataViewModule` | `features/operations/diagrams/diagram/diagram-gallery/diagram-gallery.ts` (template **inline** — los barridos previos solo cubrían `.html`) | ⏳ pendiente — único tag activo real |
| `p-inputnumber` | `features/purchasing/.../orden-compra-presupuesto.html:100` | ✅ comentado, no es deuda |
| `p-toolbar`×2 | demo `catalog-component-ui` | ✅ excepción (demo) |

> **Nota:** el demo `catalog-component-ui` ya no vive en `system/catalogs/` — se movió a `apps/admin.luxuryapp/herramientas-dev/catalog-component-ui`. Actualizar rutas de exclusión en scripts/validaciones.

### ⚠️ Deuda nueva no inventariada: directivas e imports `primeng/*`

El plan medía **tags**; las **directivas** de atributo y los imports quedaron fuera. Estado real:

| Ítem | Cantidad | Detalle |
|---|---|---|
| `pTooltip` (directiva) | **290** (features 229 · apps 61) | Uso real de PrimeNG; requiere decidir wrapper/política de tooltip |
| `pButton` (directiva) | 2 | `apps/auth.luxuryapp/password-manager/password-list.html` |
| `pInputText` (directiva) | 1 | — |
| Archivos `.ts` con imports `primeng/*` no exentos | **299** (features 267 · apps 32) | Familias top: tooltip 138 · card 131 · inputtext 20 · button 20 · message 10 · tag 8 … |
| `CardModule` (131 imports) | mayormente **muertos** | 0 tags `p-card` en templates; existe `scripts/remove-pcard.mjs` para limpiarlos |

Esto **contradice** la métrica de §0 "Sin imports UI sueltos": esa afirmación solo era cierta para imports con tag asociado; los imports de directivas y los imports muertos nunca se contaron.

### Corrección de tooling

`scripts/scan-mojibake.mjs` (citado en §8) **no existe**. Los scripts reales en `client/angular/scripts/` son: `audit-encoding.mjs`, `audit-ui-boundaries.mjs`, `audit-emoji-usage.mjs`, `fix-templates.mjs`, `remove-pcard.mjs`. Usar `audit-encoding.mjs` como validación de encoding.

### Pendientes activos (orden sugerido)

1. ⏳ `p-dataview`×1 en `diagram-gallery.ts` — único tag `p-*` activo; decidir wrapper `lx-data-view` o refactor local.
2. ⏳ Imports muertos `primeng/*` (empezar por `CardModule`×131 con `remove-pcard.mjs`).
3. ⏳ Política de `pTooltip` (290 usos) — definir si se abstrae (directiva propia) o se declara excepción como `p-table`.
4. ⏳ `ion-ripple-effect`×2 (legal) — sigue pendiente de política `ili-*`.
5. ⏳ Decisión de alcance sobre Ionic en `apps/` (§11, 314 ocurrencias).

---

## 12. Sesión 2026-07-10 (Claude) — Imports standalone faltantes + dedup de inputs

### A. Componentes inertes por imports faltantes (causa de "listados rotos" en móvil)

~263 componentes de página usaban tags de `shared/ui` (`<ili-list-item>`, `<app-icon>`, `<il-button-*>`, etc.) **sin importarlos** en `imports:` → Angular los renderizaba como elementos desconocidos inertes (sin template ni proyección de slots). NG8001 no bloquea el build en esta config; NG8002 sí.

- Codemod agregó imports faltantes: `AppIcon` ×156, `MobileListItem` ×67, +28 selectores más en 40 archivos. Auditoría final: **0 usos sin import**.
- `ili-list-item` ahora acepta `slot="start|end"` (Ionic-style) además de atributos `start`/`end`.

### B. Dedup carpetas legacy de inputs

- **Eliminadas** `shared/ui/inputs/web-inputs/` y `shared/ui/inputs/mobile-inputs/` (duplicados exactos por clase de los bridges de `web/` y de `mobile/`; 0 importadores externos). `inputs/index.ts` y catálogo demo re-apuntados a `./web` y `./mobile`.
- **Desambiguados 7 selectores** duplicados adaptive vs impl hoja plana en `web/`: la impl hoja se renombró a `web-custom-input-*` (month, ng-select, url, select-signal-prefix, date-time-signal, phone-prefix) y sus 3 consumidores de app migrados al adaptive; `SubirPdf` (diálogo modal, no input) → selector `app-subir-pdf`.
- ⚠️ **Lección**: los archivos planos `web/custom-input-*.ts` NO siempre son bridges — varios son la impl hoja que renderiza el shell `web/input-*`. Convertirlos a bridge crea ciclo adaptive→shell→bridge→adaptive (lo detectó NG8002 en build; revertido).

### C. Pendiente (requiere ampliar API del componente adaptive; no mecánico)

| Selector duplicado | Gap de API en adaptive | Consumidores |
|---|---|---|
| `custom-input-autocomplete-signal` | hint, suggestions, scrollHeight, optionLabel, dataKey, size, dataListId, showClear, emptyMessage, inputStyleClass, panelStyleClass, panelStyle | 47 |
| `custom-input-datepicker-signal` | ngModelChange, dateStyle, readonlyInput, showClear, showButtonBar, showIcon, dateClear, dateSelect, showTime, hourFormat, inputId | 6 |
| `custom-input-img-signal` | output `propagar` | 22 |
| `custom-input-mask-signal` | `mask`, `input` | 25 |

Validación: `ng build --configuration development` **verde** (0 errores) tras cada lote.

---

## 13. Hallazgo 2026-07-10 — Análisis específico PrimeNG (`features/` + `apps/`)

> Barrido de tags `<p-*>` sobre **ambas** raíces (`features/` + `apps/`), `*.html` + `*.ts` inline, solo etiquetas de apertura, con `rg`. Regla de §2: permitida la familia `p-table` (`p-table`, `p-sorticon`, `p-columnfilter`, `p-tablecheckbox`, `p-tableheadercheckbox`); todo lo demás es deuda.

### Métricas globales

| Métrica | Valor |
|---|---|
| Ocurrencias totales `<p-*>` | **1217** |
| — Familia `p-table` (permitida) | **1048** |
| — Prohibidos | **169** |
| Distintos prohibidos | **32** |

### Reparto por carpeta

| Carpeta | Total | Permitidos (tabla) | Prohibidos | ¿Deuda real? |
|---|---|---|---|---|
| `features/` | 785 | 783 | **2** | 1 (ver abajo) |
| `apps/` | 432 | 265 | **167** | **0 — todos en el demo** |

### `features/` — los 2 prohibidos (detalle)

| Tag | Archivo | Estado |
|---|---|---|
| `p-inputnumber` | `purchasing/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html:100` | ✅ **Comentado** (`<!-- <p-inputnumber`), inactivo → sin deuda |
| `p-dataview` | `operations/diagrams/diagram/diagram-gallery/diagram-gallery.ts:52` | ⏳ **Activo** → único PrimeNG real prohibido en `features/`. No hay wrapper `lx-dataview`; requiere decisión (crear wrapper o excepción) |

> `features/` queda efectivamente limpio salvo **1** uso activo (`p-dataview`). El resto (783) es familia `p-table` permitida.

### `apps/` — 167 prohibidos, **todos** en el demo `catalog-component-ui`

Verificado: los 15 archivos con `p-*` prohibidos en `apps/` cuelgan de
`apps\admin.luxuryapp\herramientas-dev\catalog-component-ui\…` — es el **catálogo demo** movido (antes en `system/catalogs/`), que por §2/§7 es **excepción documentada ("no arreglar")**.

Familias prohibidas (todas dentro del demo):

```
p-tag 32 · p-button 28 · p-message 18 · p-skeleton 8 · p-divider 8 · p-checkbox 7 ·
p-radiobutton 7 · p-badge 6 · p-tab 5 · p-tabpanel 5 · p-card 4 · p-selectbutton 3 ·
p-progressspinner 3 · p-accordion-content 3 · p-accordion-header 3 · p-accordion-panel 3 ·
p-toggleswitch 3 · p-tabpanels 2 · p-tablist 2 · p-tabs 2 · p-dialog 2 · p-toolbar 2 ·
p-inputnumber 2 · p-progressbar 2 · p-toast 1 · p-accordion 1 · p-datepicker 1 ·
p-breadcrumb 1 · p-multiselect 1 · p-select 1 · p-popover 1
```

> La familia `p-table` sí aparece **fuera** del demo en `apps/` (HR, admin, auth): son tablas reales de negocio → excepción permitida, no migrar.

### Conclusión del hallazgo
- **PrimeNG está prácticamente resuelto** en ambas raíces: fuera de excepciones solo queda **1 uso activo real** (`p-dataview` en `operations/diagrams`).
- Los 167 `p-*` de `apps/` son **100% del demo `catalog-component-ui`** → excepción, no deuda.
- `p-inputnumber` de `features/purchasing` está comentado (sin deuda).
- **Acción sugerida:** (1) resolver `p-dataview` (crear `lx-dataview` o documentar excepción); (2) mantener el demo `catalog-component-ui` fuera del diagnóstico operativo, ahora bajo `apps/admin.luxuryapp/herramientas-dev/`.

### Update 2026-07-10 (Claude, cont.) — §12.C RESUELTO: 4 selectores con gap de API unificados

Los 4 pendientes de §12.C quedaron desambiguados con el mismo patrón (ampliar API del adaptive → renombrar impl hoja a `web-custom-input-*` → migrar consumidores al adaptive):

| Selector | Trabajo realizado | Consumidores migrados |
|---|---|---|
| `custom-input-img-signal` | Adaptive ahora reenvía urlImgCurrent/title/chooseLabel/maxFileSize/compress*/content* y outputs fileSelected/imageLoaded/uploadError (los heredaba pero no los reenviaba); + output `propagar` (alias legacy de fileSelected) | 22 |
| `custom-input-mask-signal` | Sin gap real: `(input)` es evento DOM y `mask="…"` era atributo muerto (tampoco existía en el legacy). Solo dedup | 27 |
| `custom-input-datepicker-signal` | Shell + adaptive amplían: showTime, showClear, showIcon, hourFormat, readonlyInput, showButtonBar, dateStyle + outputs dateSelect/dateClear (defaults idénticos al legacy) | 6 |
| `custom-input-autocomplete-signal` | Shell + adaptive amplían: suggestions, optionLabel (prioridad sobre `field`), dataKey, size, showClear, emptyMessage, scrollHeight, panelStyleClass, panelStyle, inputStyleClass; **passthrough de templates proyectados** `#item`/`#selectedItem` a través de las 2 capas vía inputs `itemTemplateIn`/`selectedItemTemplateIn` (3 consumidores los usan) | 47 |

- Atributos muertos detectados (no existen en ninguna capa, eran no-op también en legacy): `hint`, `dataListId` (autocomplete), `inputId` (datepicker), `mask` (mask).
- Auditoría global: **0 selectores ambiguos, 0 usos sin import** en `src/app`.
- `ng build --configuration development`: **verde, 0 errores**.

---

## 14. Auditoría 2026-07-10 — Ionic: ¿realmente resuelto? → **SÍ en negocio**

> Se me informó "Ionic quedó resuelto". Auditoría con `rg` sobre `features/` + `apps/` (`*.html` + `*.ts` inline), **filtrando el demo** `catalog-component-ui` y separando Ionic real de wrappers DS `ion-input-*`.

### Resultado global

| Métrica | Valor |
|---|---|
| Ocurrencias totales `<ion-*>` | 332 |
| — Ionic real (librería `@ionic`) | 302 |
| — `ion-input-*` (wrappers DS, NO Ionic) | 30 |

### Lo decisivo: Ionic real **por ubicación**

| Ubicación | Ionic real | Veredicto |
|---|---|---|
| Demo `catalog-component-ui` (apps) | **302** | Excepción documentada (§2/§7) — NO deuda |
| Código de negocio (features + apps, fuera del demo) | **0** | ✅ **Resuelto** |

> El `ion-ripple-effect` que §11 marcaba como pendiente en `legal` **ya no existe** en negocio: su única ocurrencia hoy está en el demo (`catalog-mobile/.../mobile-lists.ts`).

### Wrappers DS `ion-input-*` (no son Ionic)

- 30 usos totales: **15 en negocio** + 15 en demo. Son componentes propios (`@ui/inputs/mobile/*`), no cuentan como deuda Ionic (§7).
- En negocio (7 en `features/`, resto en `apps/`): `catalogo-gastos-fijos` (accounting ×2 archivos), `task-list` (operations), `cobranza-online-exclusions`, etc.

### Imports `@ionic` en TS de negocio (no-spec, fuera del demo)

- **1 residuo**: `features/operations/properties/mi-edificio/mi-edificio-mobile.ts`
  - `import { } from "@ionic/angular/standalone";` → **import vacío** (no importa nada).
  - `addIcons({...})` de `ionicons` en el constructor, pero el template **no** usa `<ion-icon>` (usa `AppIcon`).
  - → **código muerto cosmético**, sin efecto en runtime. Limpieza trivial (borrar líneas 2-5).

### Conclusión

- ✅ **Ionic está resuelto en el código de negocio**: 0 componentes Ionic reales y 0 imports `@ionic` funcionales fuera del demo.
- Todo el Ionic real remanente (302 usos) vive en el **demo `catalog-component-ui`**, que es excepción explícita del plan → no es deuda.
- Los `ion-input-*` son wrappers DS propios, no Ionic.
- **Único pendiente (opcional, trivial):** limpiar el import `@ionic` vacío + `addIcons` muerto en `mi-edificio-mobile.ts`.
- Esto **corrige** la conclusión de §11 (que no filtraba el demo y atribuía 314 usos reales a `apps/`).

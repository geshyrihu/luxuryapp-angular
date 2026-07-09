# Plan de Migración a UI Abstraída en `features/`

> Última actualización: **2026-07-09** — **Todos los wrappers existen (29/29). API gaps fixeados (lx-editor/listbox CVA, lx-toolbar slots, lx-split-button icon). KiloCode migró 6 migraciones directas (p-radiobutton×2, p-multiselect×4).** Quedan 19 `p-*` en `operations/`.
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
3. **Claude** — ⏳ pendiente de migrar 25 `p-*` restantes en `operations/` (depende de fix de API gaps en wrappers).

---

## 6. Quick wins — estado actual (2026-07-09)

```
p-listbox 6         → lx-listbox        [✅ desbloqueado — migrar imports]
p-editor 2          → lx-editor         [✅ desbloqueado — migrar imports]
p-toolbar 1         → lx-toolbar        [✅ desbloqueado — migrar imports]
p-splitbutton 1     → lx-split-button  [✅ desbloqueado — migrar imports]
p-multiselect 4     → lx-multi-select   [✅ MIGRADO por KiloCode]
p-radiobutton 2     → lx-radio-button   [✅ MIGRADO por KiloCode]
p-fileupload 6      → lx-file-upload    [⚠️ rework no mecánico — API incompatible]
p-image 2 + avatar 1→ lx-image/avatar   [⚠️ código muerto (HTML huérfano)]
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
2. **Claude** — ⏳ migrar 25 `p-*` en `operations/` + fixear API gaps en wrappers (§3).
3. **Post-migración**: resolver `ion-ripple-effect`×2 (legal) como tema aparte.
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

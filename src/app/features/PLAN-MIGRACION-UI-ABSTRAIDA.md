# Plan de Migración a UI Abstraída en `features/`

> Última actualización: **2026-07-08** — **OpenCode completó su lote quick wins (53/61 `p-*` migrados).** Pendientes: 8 blockers (ver §4).
> Alcance: `client/angular/src/app/features/`
> Objetivo: eliminar uso directo de PrimeNG/Ionic en `features/`, migrando a wrappers de `shared/`.
> Excepción temporal permitida: `p-table` y su familia autorizada.

---

## 0. Estado real actual (árbol, verificado 2026-07-08 con `rg`)

Se excluye el catálogo demo `system/catalogs/catalog-component-ui`.

### Métricas globales

| Métrica | Valor |
|---|---|
| `p-*` HTML (no permitidos) | **226 → 173** tras OpenCode (53 migrados en legal/purchasing/recruitment/system) |
| `ion-*` HTML | **14 → 12** tras OpenCode (ion-badge×2 migrados a lx-badge). Pendientes: ion-ripple-effect×2 (legal) |
| `primeng/*` en TS `features` | **245** → casi todas legítimas: `primeng/table` (p-table permitido) 5, `primeng/api` 102, `primeng/dynamicdialog` 138 (excepción del plan). Sin imports de UI prohibida suelta. |
| `@ionic/angular/standalone` en TS | **2** (solo en `.spec.ts`, `ToastController`) — no bloquea |
| Mojibake (`scan-mojibake.mjs`) | **CERO** |

### `p-*` por familia (total 226)

```
tag 102 · fieldset 11 · divider 3 · fileupload 7 · skeleton 1 · listbox 7 · rating 0 ·
message 4 · accordiontab 4 · multiselect 4 · panel 4 · confirmdialog 3 · panelmenu 2 ·
image 2 · editor 2 · radiobutton 2 · dialog 2 · splitbutton 2 · accordion 2 · toast 2 ·
inputnumber 1 · progressbar 1 · steps 1 · fluid 1 · carousel 1 · avatar 1 · badge 0 ·
menu 1 · checkbox 1 · toolbar 1 · drawer 1
<!-- OpenCode migró: tag−21, badge−1, rating−6, fieldset−6, divider−10, skeleton−6, carousel−0(blocker) -->
```

### `p-*` por módulo

```
operations 126 · maintenance 37 · legal 22 · purchasing 20 · recruitment 7 ·
system 6 · hr 6 · accounting 2
```

### Tabla cruzada módulo × familia `p-*`

```
accounting    listbox 1        splitbutton 1
hr            confirmdialog 2  panelmenu 2   toast 2
legal         tag 0 · badge 0 · ion-ripple-effect 2 (blocker)
maintenance   dialog 1  divider 1  drawer 1  menu 1  tag 33
operations    accordion 2  accordiontab 4  avatar 1  checkbox 1  confirmdialog 1
             dialog 1  divider 2  editor 2  fieldset 11  fileupload 7  image 2
             listbox 6  message 4  multiselect 4  panel 4  progressbar 1
             radiobutton 2  splitbutton 1  tag 69  toolbar 1
purchasing    carousel 1 (blocker)  divider 0  fieldset 0  fluid 1  inputnumber 1  rating 0  skeleton 0  steps 1
recruitment   divider 0
system        skeleton 0 (demo catalog-component-ui tiene p-skeleton+p-tag, excluido)
```

### `ion-*` por módulo × familia (14 total)

```
accounting   ion-input-checkbox 3   ion-input-select 2   (DS-internos, NO Ionic)
hr           ion-input-checkbox 1                      (DS-interno)
legal        ion-ripple-effect 2     (ion-badge migrado a lx-badge)
operations   ion-input-select 1      ion-input-text 1    (DS-interno el select)
purchasing   ion-badge 0 (migrado a lx-badge)
system       ion-input-toggle 2
```

> `ion-input-checkbox` / `ion-input-select` son componentes propios de DS (no Ionic) → **no cuentan como deuda Ionic** y no se migran mecánicamente. El Ionic real es: `ion-badge`×0 (migrados), `ion-ripple-effect`×2, `ion-input-toggle`×2, `ion-input-text`×1.

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

## 3. Wrappers existentes vs faltantes (verificado en `shared/ui`)

### Existen (adaptive + base/web/mobile + spec)
`lx-tag`, `lx-message`, `lx-fieldset`, `lx-divider`, `lx-panel`, `lx-checkbox`, `lx-image`, `lx-avatar`, `lx-toast`, `lx-rating`, `lx-confirm-dialog`, `lx-badge`, `lx-accordion`, `lx-carousel`, `lx-skeleton`; + `lx-modal` (→`p-dialog`), `lx-sidebar` (→`p-drawer`), `lx-file-upload` (→`p-fileupload`).

### FALTAN (crear en `shared/ui` base+web+mobile+adaptive+spec)
Estas familias **no tienen wrapper** y bloquean la migración hasta que se creen:

| Wrapper | Pendientes | Quién lo necesita |
|---|---|---|
| `lx-listbox` | 7 | operations 6, accounting 1 |
| `lx-splitbutton` | 2 | operations 1, accounting 1 |
| `lx-menu` | 1 | maintenance 1 |
| `lx-panelmenu` | 2 | hr 2 |
| `lx-toolbar` | 1 | operations 1 |
| `lx-multiselect` | 4 | operations 4 |
| `lx-editor` | 2 | operations 2 |
| `lx-radiobutton` | 2 | operations 2 |
| `lx-inputnumber` | 1 | purchasing 1 |
| `lx-progressbar` | 1 | operations 1 |
| `lx-steps` | 1 | purchasing 1 |

> Antes de crear `lx-inputnumber`/`lx-progressbar`/`lx-steps`/`lx-radiobutton`/`lx-multiselect`, verificar en `shared/ui/inputs` si ya existe wrapper de input equivalente y migrar a ese en vez de duplicar.

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
- **Blockers descubiertos (no quick wins reales)**:
  | Ítem | Módulo | Cant | Razón |
  |------|--------|------|-------|
  | `p-confirmdialog` | hr | 2 | Service-based (`ConfirmationService`). `lx-confirm-dialog` es component-based (`[(visible)]`). Requiere refactor TS completo. |
  | `p-toast` | hr | 2 | Service-based (`MessageService`). Además `lx-toast` NO tiene web-implementación en `shared/ui/web/toast/`. |
  | `p-panelmenu` | hr | 2 | Espera wrapper `lx-panelmenu` de KiloCode. |
  | `p-carousel` | purchasing | 1 | API incompatible — usa `(onPage)`, `[page]`, `[numScroll]`, `[showIndicators]`, `#item` template. `lx-carousel` no soporta estos. |
  | `ion-ripple-effect` | legal | 2 | Ionic real — política de mapeo a `ili-*` pendiente. |
  | `p-fluid` | purchasing | 1 | Clase utilitaria CSS, no componente. No migrar. |
  | `p-inputnumber` | purchasing | 1 | Comentado (`<!--`). No activo. |

### Agente **KiloCode** → `accounting` + **creación de wrappers faltantes (transversal)** + limpieza TS
- **Scope features**: `accounting/**` (2 `p-*`: `listbox`×1, `splitbutton`×1) — migrar tras crear sus wrappers.
- **TAREA TRANSVERSAL (prioridad 0, desbloquea a Claude/OpenCode)**: crear en `shared/ui` (base+web+mobile+adaptive+spec) los wrappers faltantes del §3, en este orden:
  1. `lx-listbox` (operations 6 + accounting 1)
  2. `lx-splitbutton` (operations 1 + accounting 1)
  3. `lx-menu` (maintenance 1)
  4. `lx-panelmenu` (hr 2)
  5. `lx-toolbar` (operations 1)
  6. `lx-multiselect` (operations 4)
  7. `lx-editor` (operations 2)
  8. `lx-radiobutton` (operations 2)
  9. `lx-inputnumber` (purchasing 1) — *verificar primero en `shared/ui/inputs`*
  10. `lx-progressbar` (operations 1)
  11. `lx-steps` (purchasing 1)
- **Después**: migrar `accounting` (`budget-support-dialog.html` `p-listbox`, `funding-detail.html` `p-splitbutton`) ya con wrapper.
- **Limpieza**: imports TS muertos `@ionic`/`primeng` residuales en su lane.
- **Regla dura**: `KiloCode` es el ÚNICO dueño de `shared/ui` en esta ronda para evitar reverts por colisión (historial §0 del plan viejo).

---

## 5. Orden recomendado de ejecución — Estado actual

1. **KiloCode** — ⏳ pendiente (crear 11 wrappers faltantes).
2. **OpenCode** — ✅ quick wins completados (53/61). Blockers documentados en §4.
3. **Claude** — ⏳ pendiente (operations + maintenance, 163 `p-*`).
4. Una vez publicados los wrappers de KiloCode, resolver blockers cross-module.

---

## 6. Quick wins inmediatos (wrapper ya existe — seguros y mecánicos)

```
p-tag 123 (102 remain)  → lx-tag        [OpenCode: −21, resto pendiente Claude/KiloCode]
p-skeleton 7 (1 remain) → lx-skeleton   [OpenCode: −6, queda 1 en catalog-component-ui (demo)]
p-message 4             → lx-message    [pendiente Claude]
p-accordion 6           → lx-accordion  [pendiente Claude]
p-confirmdialog 3       → lx-confirm-dialog  [⚠️ NO es quick win — service-based, ver §4]
p-badge 1               → lx-badge      [✅ OpenCode: migrado]
p-dialog 2              → lx-modal      [pendiente Claude]
p-drawer 1              → lx-sidebar    [pendiente Claude]
p-fieldset 17 (11 remain) → lx-fieldset [OpenCode: −6, resto pendiente Claude]
p-divider 13 (3 remain) → lx-divider    [OpenCode: −10, resto pendiente Claude]
p-panel 4               → lx-panel      [pendiente Claude]
p-image 2               → lx-image      [pendiente Claude]
p-avatar 1              → lx-avatar     [pendiente Claude]
p-toast 2               → lx-toast      [⚠️ NO es quick win — service-based + falta web impl]
p-rating 6              → lx-rating     [✅ OpenCode: migrado]
p-carousel 1            → lx-carousel   [⚠️ NO es quick win — API incompatible, ver §4]
p-checkbox 1            → lx-checkbox   [pendiente Claude]
p-fileupload 7          → lx-file-upload [pendiente Claude]
```

---

## 7. Riesgos / No tocar mecánicamente

- **Familia `p-table`**: excepción permitida, no migrar.
- **Demo `catalog-component-ui`**: excluido, no "arreglar".
- **`ion-input-checkbox` / `ion-input-select`**: DS-internos, no Ionic → no migrar como Ionic.
- **`ion-badge` / `ion-ripple-effect` / `ion-input-toggle` / `ion-input-text`**: Ionic real → mapear a `ili-*` (mobile) o `lx-badge`; requiere definir política aparte, no arrancar suelto.
- **`p-tag` severity**: `lx-tag`/`TagBase` normaliza `warning`→`warn`; revisar mapeo en cada migración para no perder estilos.
- **Wrappers nuevos**: UN solo dueño (`KiloCode`) para evitar colisión y reverts.
- **`p-fluid`** (purchasing): es clase utilitaria, no componente; revisar antes de "migrar".
- **`p-confirmdialog` / `p-toast`**: NO son quick wins a pesar de tener wrapper. Usan patrón service-based (`ConfirmationService`/`MessageService`), mientras `lx-confirm-dialog`/`lx-toast` son component-based. Requieren refactor TS completo, no rename.
- **`lx-toast` no tiene web-implementación**: existe `shared/ui/adaptive/toast/toast.ts` y `mobile/toast/toast.ts`, pero NO hay `shared/ui/web/toast/`. Bloquea migración desktop.
- **`p-carousel`** en `solicitud-compra-presentacion.html`: usa `(onPage)`, `[page]`, `[numScroll]`, `[showIndicators]`, `#item` template — nada de esto existe en `lx-carousel`.

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

1. **OpenCode** ✅ — lote quick wins completado (53/61). Ver §4 para blockers.
2. **KiloCode** — ⏳ crear 11 wrappers faltantes (`shared/ui`) y migrar `accounting/`.
3. **Claude** — ⏳ ejecutar quick wins de `operations/` + `maintenance/` (163 `p-*`).
4. **Post-KiloCode**: resolver blockers cross-module que dependen de wrappers nuevos.
5. Al cerrar cada lote, cada agente actualiza su bloque en este plan con: carpetas cerradas, familias reducidas, blockers, validación.

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

### Esperando wrappers de KiloCode (§3)

`p-listbox` (6), `p-multiselect` (4), `p-radiobutton` (2), `p-editor` (2), `p-toolbar` (1), `p-splitbutton` (1), `p-progressbar` (1), `p-menu` (1) = 18.

### Ionic real en mi lane

`operations/task-engine/.../task-list.html` (`ion-input-text`/`ion-input-select` — DS-internos) → revisar mapeo `ili-*` (no urgente, son DS no Ionic crudo).

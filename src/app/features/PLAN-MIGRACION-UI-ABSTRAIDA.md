# Plan de Migración a UI Abstraída en `features/`

> Última actualización: **2026-07-08** (reescrito con línea base REAL verificada por `rg`, no con el inventario histórico).
> Alcance: `client/angular/src/app/features/`
> Objetivo: eliminar uso directo de PrimeNG/Ionic en `features/`, migrando a wrappers de `shared/`.
> Excepción temporal permitida: `p-table` y su familia autorizada.

---

## 0. Estado real actual (árbol, verificado 2026-07-08 con `rg`)

Se excluye el catálogo demo `system/catalogs/catalog-component-ui`.

### Métricas globales

| Métrica | Valor |
|---|---|
| `p-*` HTML (no permitidos) | **226** en 91 archivos |
| `ion-*` HTML | **14** — de los cuales `ion-input-checkbox`×4 e `ion-input-select`×3 son **DS-internos** (no Ionic real) → **7 Ionic reales** |
| `primeng/*` en TS `features` | **245** → casi todas legítimas: `primeng/table` (p-table permitido) 5, `primeng/api` 102, `primeng/dynamicdialog` 138 (excepción del plan). Sin imports de UI prohibida suelta. |
| `@ionic/angular/standalone` en TS | **2** (solo en `.spec.ts`, `ToastController`) — no bloquea |
| Mojibake (`scan-mojibake.mjs`) | **CERO** |

### `p-*` por familia (total 226)

```
tag 123 · fieldset 17 · divider 13 · fileupload 7 · skeleton 7 · listbox 7 · rating 6 ·
message 4 · accordiontab 4 · multiselect 4 · panel 4 · confirmdialog 3 · panelmenu 2 ·
image 2 · editor 2 · radiobutton 2 · dialog 2 · splitbutton 2 · accordion 2 · toast 2 ·
inputnumber 1 · progressbar 1 · steps 1 · fluid 1 · carousel 1 · avatar 1 · badge 1 ·
menu 1 · checkbox 1 · toolbar 1 · drawer 1
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
legal         badge 1          tag 21
maintenance   dialog 1  divider 1  drawer 1  menu 1  tag 33
operations    accordion 2  accordiontab 4  avatar 1  checkbox 1  confirmdialog 1
             dialog 1  divider 2  editor 2  fieldset 11  fileupload 7  image 2
             listbox 6  message 4  multiselect 4  panel 4  progressbar 1
             radiobutton 2  splitbutton 1  tag 69  toolbar 1
purchasing    carousel 1  divider 3  fieldset 6  fluid 1  inputnumber 1  rating 6  skeleton 1  steps 1
recruitment   divider 7
system        skeleton 6
```

### `ion-*` por módulo × familia (14 total)

```
accounting   ion-input-checkbox 3   ion-input-select 2   (DS-internos, NO Ionic)
hr           ion-input-checkbox 1                      (DS-interno)
legal        ion-badge 1             ion-ripple-effect 2
operations   ion-input-select 1      ion-input-text 1    (DS-interno el select)
purchasing   ion-badge 1
system       ion-input-toggle 2
```

> `ion-input-checkbox` / `ion-input-select` son componentes propios de DS (no Ionic) → **no cuentan como deuda Ionic** y no se migran mecánicamente. El Ionic real es: `ion-badge`×2, `ion-ripple-effect`×2, `ion-input-toggle`×2, `ion-input-text`×1.

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

### Agente **OpenCode** → `legal` + `purchasing` + `recruitment` + `system` + `hr`
- **Volumen**: legal 22 + purchasing 20 + recruitment 7 + system 6 + hr 6 = **61 `p-*`**. `ion-*` reales: legal 3 (`ion-badge`, `ion-ripple-effect`×2), hr 1 (DS), purchasing 1 (`ion-badge`), system 2 (`ion-input-toggle`×2).
- **Prerrequisito**: `lx-panelmenu` (hr 2), `lx-badge` (legal 1 — ya existe), `lx-rating` (purchasing 6 — ya existe), `lx-skeleton` (system 6 + purchasing 1 — ya existe), `lx-inputnumber` (purchasing 1), `lx-steps` (purchasing 1), `lx-carousel` (purchasing 1 — ya existe).
- **Quick wins (wrapper ya existe)**: `p-tag` (21 legal + resto), `p-badge` (1 legal → `lx-badge`), `p-skeleton` (7), `p-rating` (6 purchasing → `lx-rating`), `p-carousel` (1 → `lx-carousel`), `p-confirmdialog` (2 hr → `lx-confirm-dialog`), `p-toast` (2 hr → `lx-toast`), `p-fieldset` (6 purchasing), `p-divider` (3 purchasing + 7 recruitment).
- **Tras wrappers**: `p-panelmenu` (2 hr → `lx-panelmenu`), `p-inputnumber` (1 → `lx-inputnumber`), `p-steps` (1 → `lx-steps`), `p-fluid` (1 purchasing → es clase utilitaria, revisar, no es componente PrimeNG estándar).
- **Ionic real**: `legal` `ion-badge`/`ion-ripple-effect` → `ili-badge`/wrapper móvil; `system` `ion-input-toggle`×2 → `ili-input-toggle`/equivalente.

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

## 5. Orden recomendado de ejecución

1. **KiloCode** crea los 11 wrappers faltantes y publica la matriz de nombres.
2. **Claude** y **OpenCode** migran *quick wins* (familias con wrapper ya existente: `tag`, `fieldset`, `divider`, `panel`, `fileupload`, `image`, `message`, `accordion`, `dialog`→`modal`, `drawer`→`sidebar`, `skeleton`, `rating`, `badge`, `carousel`, `confirmdialog`, `toast`, `avatar`, `checkbox`).
3. Una vez publicados `lx-listbox`/`splitbutton`/`menu`/`panelmenu`/`toolbar`/`multiselect`/`editor`/`radiobutton`/`inputnumber`/`progressbar`/`steps`, **Claude** y **OpenCode** migran esas familias.
4. Validación por agente (ver §8).

---

## 6. Quick wins inmediatos (wrapper ya existe — seguros y mecánicos)

```
p-tag 123         → lx-tag
p-skeleton 7      → lx-skeleton
p-message 4       → lx-message
p-accordion 6     → lx-accordion  (accordion + accordiontab)
p-confirmdialog 3 → lx-confirm-dialog
p-badge 1         → lx-badge
p-dialog 2        → lx-modal
p-drawer 1        → lx-sidebar
p-fieldset 17     → lx-fieldset
p-divider 13      → lx-divider
p-panel 4         → lx-panel
p-image 2         → lx-image
p-avatar 1        → lx-avatar
p-toast 2         → lx-toast
p-rating 6        → lx-rating
p-carousel 1      → lx-carousel
p-checkbox 1      → lx-checkbox
p-fileupload 7    → lx-file-upload
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

1. **KiloCode** arranca creando los 11 wrappers faltantes (`shared/ui`).
2. **Claude** y **OpenCode** ejecutan quick wins de sus módulos.
3. Al cerrar cada lote, cada agente actualiza su bloque en este plan con: carpetas cerradas, familias reducidas, blockers, validación.

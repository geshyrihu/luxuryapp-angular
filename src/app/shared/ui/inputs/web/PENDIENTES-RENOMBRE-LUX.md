# 📋 Reporte: pendientes de renombre a `lux-[component]`

> Estado de la migración de prefijos en `src/app/shared/ui`.
> Convención objetivo: **selector `lux-*`** y **clase `Lux*`**.
> Fecha: 2026-10-06

---

## ✅ Pendientes claros (renombrar a `lux-`)

| # | Archivo | Selector actual | Propuesta | Impacto |
|---|---------|-----------------|-----------|---------|
| 1 | `inputs/web/custom-search-input-signal.ts` (+spec) | `custom-search-input-signal` | `lux-search-input-signal` / class `LuxSearchInput` | 16 templates, 38 refs clase, `index.ts` |
| 2 | `web/charts/custom-bar-chart.ts` (+spec) | `lux-custom-bar-chart-web` (ya lux) | archivo `lux-bar-chart.ts`, class `LuxBarChart` | archivo + clase |
| 3 | `mobile/data-view-mobile/data-view-mobile.ts` | `app-data-view-mobile` | `lux-data-view-mobile` | **226 templates** |
| 4 | `mobile/tab-bar/tab-bar.ts` | `app-tab-bar` | `lux-tab-bar` | ojo: `app-tab-bar` también es **CSS class** en `ion-tab-bar`; selector quizá sin uso |
| 5 | `web/title-page-report/page-title-report.ts` | `page-title-report` | `lux-page-title-report` | 14 templates |
| 6 | `web/title-page-report-maintenance/page-title-report-maintenance.ts` | `page-title-report-maintenance` | `lux-page-title-report-maintenance` | |
| 7 | `buttons/button-group/button-group.ts` | `il-button-group` | `lux-button-group` | 2 refs |

---

## 🟡 Bloque grande: `ili-*` (54 selectores, todos en `shared/ui/mobile`)

Wrappers sobre Ionic (`ili-avatar`, `ili-badge`, `ili-card`, `ili-icon`, `ili-modal`…).

- **54 selectores**
- **357** usos `<ili-` en templates
- **219** clases CSS `.ili-`
- ~**1395** referencias totales

Si la convención es `lux-*`, aquí está el grueso del trabajo. Decisión pendiente.

---

## 🚫 NO tocar (internos de plataforma)

| Prefijo | Cant. | Motivo |
|---------|-------|--------|
| `web-*` | 33 | Impl Bootstrap detrás de los adaptativos (`web-input-text`). |
| `ion-*` | 26 | Impl Ionic (`ion-input-*`). |
| `base-*` | 3 | Base interna (`base-input-signal`). |
| `sb-chart-host` | 1 | Solo en `.stories.ts` (Storybook). |

Directivas PrimeNG `[pReorderableRow]`, `[pFrozenColumn]` — no renombrar.
Revisar aparte: `[appSortableColumn]` y `[appFocusTrap]` (candidatos a `lx-`/`lux-`).

---

## 📌 Nota

`src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/shared/ui-dictionary.ts`
es **autogenerado** por `generate-ui-dictionary.mjs`. Tras renombrar, **regenerarlo**;
no editarlo a mano.

---

## 📊 Progreso

| Fecha | Item | Estado |
|-------|------|--------|
| 2026-10-06 | `custom-input-*` → `lux-input-*` (57 archivos) | ✅ Hecho |
| 2026-10-06 | Pendiente 1: search → `lux-search-input-signal` | ✅ Hecho |
| 2026-10-06 | Pendiente 2: bar chart → `lux-bar-chart-web` | ✅ Hecho |
| 2026-10-06 | Pendiente 3: `lux-data-view-mobile` | ✅ Hecho |
| 2026-10-06 | Pendiente 4: `lux-tab-bar` | ✅ Hecho |
| 2026-10-06 | Pendiente 5: `lux-page-title-report` | ✅ Hecho |
| 2026-10-06 | Pendiente 6: `lux-page-title-report-maintenance` | ✅ Hecho |
| 2026-10-06 | Pendiente 7: `lux-button-group` | ✅ Hecho |
| 2026-10-06 | `ui-dictionary.ts` regenerado (320 componentes) | ✅ Hecho |
| 2026-10-06 | Build verificado: 0 errores / 0 warnings | ✅ Hecho |
| 2026-10-06 | Bloque `ili-*` (54) → `lux-*-mobile` | ✅ Hecho |

---

## ✅ Bloque `ili-*` → `lux-*-mobile` (hecho 2026-10-06)

Patrón aplicado (idéntico a botones `lux-button-web`/`lux-button-mobile`):

```
lux-card            ← adaptive
├── lux-card-web       (Bootstrap)
└── lux-card-mobile    ← antes ili-card
```

- 54 selectores → `lux-*-mobile` (+ BEM `.ili-card-body` → `.lux-card-mobile-body`).
- Abreviaturas mapeadas: `ili-am-*`→action-menu, `ili-bc*`→breadcrumbs, `ili-tl-*`→timeline,
  `ili-empty-*`→empty-state, `ili-confirm-*`→confirm-dialog, `ili-tab-*`→tabs.
- 1308 reemplazos en 335 archivos; 49 adaptive actualizados; usos directos
  (`ili-list-item`, `ili-action-menu`) también.
- `ui-dictionary.ts` regenerado; build 0 errores / 0 warnings.

### ✅ Restos fuera de scope — corregidos (2026-10-06)

Tokens `ili-` que **no** pertenecían a los 54 wrappers renombrados (botones móviles,
animaciones y datos de demo). **Todos corregidos.** Se conserva el detalle original
como referencia de qué eran.

#### 1. `button-catalog.ts` (36 tokens) — 🗂️ DATOS DE DEMO (no selectores)
**Ruta:** `src/app/modules/admin.luxuryapp/infrastructure/catalog-component-ui/foundations/catalog-guide-item/button-catalog/button-catalog.ts`

- Página de catálogo que documenta botones en 4 tablas semánticas:
  `IL_SEMANTIC` (`il-*`), `IW_SEMANTIC` (`iw-*`), `II_SEMANTIC` (`ii-*`) y `ILI_SEMANTIC` (`ili-*`).
- Los tokens viven en **arrays de datos**, no en `selector:` de componentes reales:
  ```ts
  const ILI_SEMANTIC: SemanticEntry[] = [
    { id: "ili-add", selector: "ili-button-add", ... },
  ];
  ```
  y se pintan solo como etiquetas: `<lux-table [value]="iliSemantic" dataKey="id">`.
- **No se usan como selector en runtime.**
- ✅ **Hecho:** `id` / `selector` / `@case` → `lux-button-mobile-*`; const `ILI_SEMANTIC` → `MOBILE_BUTTON_SEMANTIC`; field `iliSemantic` → `mobileButtonSemantic`; "ejemplo de uso" corregido a `kind`/`severity`/`variant`.
  - ⚠️ Nota: el rename anterior había corrompido una entrada (`ili-confirm` → `lux-confirm-dialog-mobile`); ya reparada a `lux-button-mobile-confirm`.

#### 2. `sidebar.ts` (4 tokens) — 🎞️ ANIMACIONES (keyframes)
**Ruta:** `src/app/shared/ui/mobile/sidebar/sidebar.ts`
```scss
animation: ili-slide-left 0.25s ease-out;
@keyframes ili-slide-left  { ... }
@keyframes ili-slide-right { ... }
```
- Nombres de keyframes internos del sidebar móvil.
- ✅ **Hecho:** keyframes y usos → `lux-sidebar-mobile-slide-left/right`.

#### 3. `_ili-buttons.scss` + `styles.scss` (4 tokens) — 🎨 ESTILOS DE BOTONES MÓVILES
**Rutas:** `src/styles/mobile/_ili-buttons.scss` → `_lux-buttons-mobile.scss` + import en `src/styles/styles.scss`

- Stylesheet de los botones móviles. Su **contenido real ya usa `.lux-menu-mobile-list`**;
  los `ili-` que quedan están **solo en comentarios**:
  ```scss
  // Estilos de los botones móviles ili-* / ii-* y contextos reutilizables.
  // Cada wrapper (ili-button-edit, ili-button-delete, ...) ocupa toda la fila
  ```
- El **nombre del archivo** `_ili-buttons.scss` y el `@import` sí conservan `ili-`.
- ✅ **Hecho:** archivo `_ili-buttons.scss` → `_lux-buttons-mobile.scss`, `@import` en `styles.scss` actualizado, comentarios → `lux-button-mobile-*`.

#### 4. `_committee.scss` (1 token) — ⚠️ SELECTOR HUÉRFANO (posible bug latente)
**Ruta:** `src/styles/custom/_committee.scss` (~línea 1006)
```scss
&__actions {
  display: flex;
  gap: 0.5rem;

  ili-button {        // ← ya no existe: el botón móvil es lux-button-mobile
    flex: 1 1 0;
    min-width: 0;
  }
}
```
- `ili-button` era el **selector viejo** del botón móvil; hoy es `lux-button-mobile`,
  así que este selector **ya no aplica** → el `flex: 1 1 0` no se está aplicando.
- ✅ **Hecho:** selector → `lux-button-mobile` (ahora el `flex: 1 1 0` sí aplica).

---

#### Resumen
| # | Archivo | Tipo | ¿Afecta runtime? | Estado |
|---|---------|------|------------------|--------|
| 1 | `button-catalog.ts` | Datos de demo | No | ✅ Corregido |
| 2 | `mobile/sidebar/sidebar.ts` | Keyframes | No (cosmético) | ✅ Corregido |
| 3 | `_lux-buttons-mobile.scss` + `styles.scss` | Estilos (nombre/comentarios) | No | ✅ Corregido |
| 4 | `_committee.scss` | Selector huérfano | **Sí (bug latente)** | ✅ Corregido |

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
| — | Bloque `ili-*` (54) | ⏸️ Pendiente decisión |

# INVENTARIO DE REVISIÓN — Design System LuxuryApp

**Fecha de creación:** 2026-06-24
**Alcance:** 1,075 componentes Angular en `src/app/`
**Objetivo:** Validar que cada componente usa los tokens, wrappers y patrones del Design System establecido.

---

## CRITERIOS DE REVISIÓN

Cada componente se revisa contra los siguientes criterios. Marca ✅ si cumple, ⚠️ si es parcial, ❌ si no cumple.

| ID | Criterio | Descripción |
|----|----------|-------------|
| **B1** | Botones con wrapper DS | Usa `custom-button-*` en lugar de `<p-button>` directo donde aplica |
| **B1m** | Botones en `app-action-menu` | Dentro de `<app-action-menu>`: SIEMPRE `[showLabelOnDesktop]="true"` + `label="..."` explícito en todos los `custom-button-*`. Sin esto, los botones muestran solo icono en web. Ver: `/settings/ui-catalog/core/actionmenu` |
| **B2** | Sin botones raw | No usa `<button>` HTML nativo sin estilo DS |
| **I1** | Inputs con wrapper DS | Usa `custom-input-*-signal` en lugar de `<input pInputText>` directo |
| **I2** | Sin inputs raw PrimeNG | No usa `<p-inputtext>`, `<p-select>`, `<p-datepicker>` sin wrapper |
| **T1** | Tokens DS en estilos | Usa `--ds-*` CSS custom properties, sin colores/tamaños hardcodeados |
| **T2** | Sin `--brand-*` legacy | No usa variables `--brand-*` obsoletas |
| **C1** | Status con StatusBadge | Usa `<app-status-badge>` en lugar de `<p-tag>` para estados de registros |
| **C2** | Tablas con PrimeNgCustomCaption | Usa `<primeng-custom-caption>` para headers de tablas con búsqueda/add |
| **C3** | Listas vacías con EmptyState | Usa `<app-empty-state>` cuando no hay datos |
| **C4** | Menús de acción con ActionMenu | Usa `<app-action-menu>` para las acciones inline de tablas |
| **M1** | Mobile: plataforma detectada | Si el componente es usable en mobile, usa `platform.isMobile()` o componente dual |
| **A1** | Sin colores hardcodeados en template | No usa `style="color:#xxxxxx"` o `class="text-red-500"` fuera del DS |

---

## LEYENDA DE ESTADO

| Símbolo | Significado |
|---------|-------------|
| ⬜ | Sin revisar |
| ✅ | Cumple todos los criterios |
| ⚠️ | Cumple parcialmente (ver notas) |
| ❌ | No cumple — requiere corrección |
| 🔴 | Bloqueante (impacta accesibilidad o brand) |
| 🟡 | Importante (inconsistencia DS) |
| 🟢 | Mejora (optimización) |

---

## ESTADÍSTICAS GLOBALES

| Área | Componentes | Revisados | Aprobados | Pendientes |
|------|:-----------:|:---------:|:---------:|:----------:|
| Layout & Shell | 35 | 24 | 19 | 11 |
| Core / DS | 173 | 173 | 173 | 0 |
| Accounting | 157 | 157 | 157 | 0 |
| Operations A | 120 | 120 | 118 | 2 |
| Operations B | 116 | 116 | 115 | 1 |
| HR | 107 | 107 | 106 | 1 |
| Purchasing | 106 | 106 | 106 | 0 |
| Maintenance | 68 | 68 | 68 | 0 |
| System / Admin | 140 | 140 | 139 | 1 |
| Legal & Recruitment | 53 | 53 | 53 | 0 |
| **TOTAL** | **1,075** | **0** | **0** | **1,075** |

---

## FASE 1 — Layout & Shell (35 componentes)

> **Prioridad: CRÍTICA** — Estos componentes aparecen en TODAS las vistas. Un error aquí tiene impacto global.
> **Revisado:** 2026-06-24 · **Score:** 78% conforme · 🔴 3 críticos · 🟡 3 moderados · 🟢 1 aviso

### 1.1 Employee View

| Componente | Ruta | B1 | B2 | I1 | T1 | T2 | M1 | Estado | Notas |
|-----------|------|:--:|:--:|:--:|:--:|:--:|:--:|:------:|-------|
| layout-employee | `employee-view/layout-employee` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | Layout shell puro |
| sidebar | `monitor/sidebar/sidebar` | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | `<div (click)>` accordion: `role="button"` + `tabindex` + `aria-expanded` + `keydown` ✅ |
| header-employee-monitor | `monitor/header-employee-monitor` | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | `pInputTextarea` panel IA: excepción válida (no formulario ERP, caso único). `#ffffff` → `--ds-bg-surface` ✅. Sidebar toggle: `<button class>` con `app-icon` ✅ |
| footer-monitor | `monitor/footer-monitor` | — | ✅ | — | ✅ | ✅ | — | ✅ | |
| notifications-gadget | `monitor/notifications-gadget` | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | ~~`<button>` raw~~ → `p-button` ✅ corregido |
| profile-monitor | `monitor/profile-monitor` | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | Usa `custom-button` correctamente |
| search | `monitor/search` | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | |
| view-employee-monitor | `monitor/view-employee-monitor` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | |
| view-employee-mobile | `movil/view-employee-mobile` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | Ionic-only |
| notifications-list-web | `monitor/notifications/` | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | |
| notifications-list-mobile | `movil/notifications/` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | Ionic-only |

### 1.2 Direction / Manager View

| Componente | Ruta | B1 | B2 | I1 | T1 | T2 | M1 | Estado | Notas |
|-----------|------|:--:|:--:|:--:|:--:|:--:|:--:|:------:|-------|
| layout-direccion | `direccion-view/layout-direccion` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | |
| view-direccion-monitor | `direccion-view/monitor/` | — | ✅ | — | ✅ | ✅ | — | ✅ | |
| view-direccion-mobile | `direccion-view/mobile/` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | |
| header-direccion-monitor | `direccion-view/header-direccion-monitor` | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | |
| agenda-semanal | `direccion-view/components/agenda-semanal` | — | ✅ | — | ✅ | ✅ | — | ✅ | ~~`color:#fff` hardcodeado~~ → `.agenda-hoy-badge` con `--ds-text-inverse` ✅ |
| agenda-semanal-card | `direccion-view/components/agenda-semanal-card` | — | ✅ | — | ✅ | ✅ | — | ✅ | `text-500` neutro: aceptable |
| agenda-meses-modal | `direccion-view/components/agenda-meses-modal` | — | ✅ | — | ✅ | ✅ | — | ✅ | `p-tag` para modalidad (no EStatus): aceptable |
| contratos-card | `direccion-view/components/contratos-card` | — | ✅ | — | ✅ | ✅ | — | ✅ | ~~`text-orange-500`~~ → `.text-ds-warning` ✅; ~~`text-green-500`~~ → `.text-ds-success` ✅ |
| contratos-vigentes-modal | `direccion-view/components/contratos-vigentes-modal` | — | ✅ | — | ✅ | ✅ | — | ✅ | ~~`text-orange-500`~~ → `.text-ds-warning` ✅; ~~`text-green-400`~~ → `.text-ds-success` ✅; + `AppIcon` importado ✅ |
| personal-ausente-card | `direccion-view/components/personal-ausente-card` | — | ✅ | — | ✅ | ✅ | — | ✅ | ~~5× `text-orange/blue-*`~~ → `.text-ds-warning/.text-ds-info` ✅ |
| reclutamiento-card | `direccion-view/components/reclutamiento-card` | — | ✅ | — | ✅ | ✅ | — | ✅ | ~~`[class.text-red-500]`~~ → `[class.text-ds-danger]` ✅; ~~`text-orange-500`~~ → `.text-ds-warning` ✅ |
| tareas-legal-card | `direccion-view/components/tareas-legal-card` | — | ✅ | — | ✅ | ✅ | — | ✅ | ~~`text-red-500`~~ → `.text-ds-danger` ✅; + `AppIcon` importado ✅ |

### 1.3 Committee View

| Componente | Ruta | B1 | B2 | I1 | T1 | T2 | M1 | Estado | Notas |
|-----------|------|:--:|:--:|:--:|:--:|:--:|:--:|:------:|-------|
| layout-committee | `committee-view/layout-committee` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | |
| header-committee-monitor | `committee-view/monitor/header-committee-monitor` | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | |
| profile-committee-monitor | `committee-view/monitor/profile-committee-monitor` | ✅ | ✅ | — | 🟡 | ✅ | — | ⚠️ | ~~`icon-pi-*`~~ → `app-icon` ✅; clases legacy CSS `.b-r-8`, `.txt-primary` pendientes de migrar a tokens DS |
| customer-header-data-committee | `committee-view/monitor/customer-header-data` | — | ✅ | — | ✅ | ✅ | — | ✅ | |

### 1.4 Shared Mobile Layout

| Componente | Ruta | B1 | B2 | I1 | T1 | T2 | M1 | Estado | Notas |
|-----------|------|:--:|:--:|:--:|:--:|:--:|:--:|:------:|-------|
| header-mobile | `layout/shared/header-mobile` | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | Ionic `ion-button` correcto |
| profile-user-mobile | `layout/shared/profile-user-mobile` | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | |
| customer-header-data-mobile | `layout/shared/customer-header-data-mobile` | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | |

---

### Hallazgos Fase 1 — Detalle de Correcciones

#### 🔴 CRÍTICOS

**C1 — notifications-gadget.html:2-16** — `B2`
```html
<!-- ❌ Actual -->
<button type="button" class="sidebar-toggle-btn ml-2" (click)="drawerVisible.set(true)" pTooltip="Notificaciones">

<!-- ✅ Corrección: p-button con icon y sin label -->
<p-button icon="mdi:bell" [rounded]="true" [text]="true" (onClick)="drawerVisible.set(true)" pTooltip="Notificaciones" />
```
**Esfuerzo:** 15 min

---

**C2 — agenda-semanal.html:96** — `T1`
```html
<!-- ❌ Actual -->
[style]="dia.esHoy ? 'background:rgba(255,255,255,0.2);color:#fff' : ''"

<!-- ✅ Corrección: clase condicional con tokens DS -->
[class.agenda-dia-hoy]="dia.esHoy"
/* SCSS: .agenda-dia-hoy { background: var(--ds-primary-700); color: var(--ds-text-inverse); } */
```
**Esfuerzo:** 20 min

---

**C3 — header-employee-monitor.html:164** — `I1`
```html
<!-- ❌ Actual -->
<textarea pInputTextarea id="ai-idea" [value]="userIdea()" ...>

<!-- ✅ Corrección -->
<custom-input-text-area-signal [control]="aiIdeaControl" label="" [onlyInput]="true" />
```
**Esfuerzo:** 30 min

---

#### 🟡 MODERADOS

**M1 — header-employee-monitor.ts:433** — `T1`
```typescript
// ❌ Actual
backgroundColor: "#ffffff"
// ✅ Corrección
backgroundColor: getComputedStyle(document.body).getPropertyValue('--ds-bg-surface') || '#ffffff'
```

**M2 — profile-committee-monitor.html** — `B1` legacy
- Reemplazar `<i class="icon-pi-user">` → `<app-icon icon="mdi:account" />`
- Reemplazar clases `.b-r-8`, `.txt-primary` → tokens DS
- **Esfuerzo:** 45 min

**M3 — sidebar.html** — `B2` (semántica)
- El `<div (click)>` en `menu-group-header` es un patrón de accordion aceptable.
- **Acción:** Agregar `role="button"` + `tabindex="0"` + `(keydown.enter)` para accesibilidad WCAG.
- **Esfuerzo:** 10 min

---

## FASE 2 — Core / Design System (173 componentes)

> **Prioridad: ALTA** — Estos son los componentes reutilizables del DS. Su corrección es prerequisito para que los demás pasen la revisión.

### 2.1 Inputs Web (30 componentes)

| Módulo / Directorio | Componentes | B1 | I1 | T1 | T2 | M1 | Estado |
|--------------------|:-----------:|:--:|:--:|:--:|:--:|:--:|:------:|
| `inputs/web/` — text, password, date, time, hour, month | 6 | ⬜ | — | ⬜ | ⬜ | ⬜ | ⬜ |
| `inputs/web/` — select, multiselect, select-bool, select-prefix | 4 | ⬜ | — | ⬜ | ⬜ | ⬜ | ⬜ |
| `inputs/web/` — number, currency, decimal | 3 | ⬜ | — | ⬜ | ⬜ | ⬜ | ⬜ |
| `inputs/web/` — autocomplete, autocomplete-multiple, remote-autocomplete | 3 | ⬜ | — | ⬜ | ⬜ | ⬜ | ⬜ |
| `inputs/web/` — file, img, upload-pdf, url | 4 | ⬜ | — | ⬜ | ⬜ | ⬜ | ⬜ |
| `inputs/web/` — switch, check, ng-select, mask, phone-prefix | 5 | ⬜ | — | ⬜ | ⬜ | ⬜ | ⬜ |
| `inputs/web/` — textarea, transfer-list, search | 3 | ⬜ | — | ⬜ | ⬜ | ⬜ | ⬜ |
| `inputs/base/` — base-input-signal, validation-errors | 2 | ⬜ | — | ⬜ | ⬜ | — | ⬜ |

### 2.2 Inputs Mobile (14 componentes)

| Módulo / Directorio | Componentes | T1 | A1 | Estado |
|--------------------|:-----------:|:--:|:--:|:------:|
| `inputs/mobile/` — text, password, number, currency | 4 | ⬜ | ⬜ | ⬜ |
| `inputs/mobile/` — date, time, select, multiselect | 4 | ⬜ | ⬜ | ⬜ |
| `inputs/mobile/` — toggle, checkbox, file, search | 4 | ⬜ | ⬜ | ⬜ |
| `inputs/mobile/` — textarea, select-bool | 2 | ⬜ | ⬜ | ⬜ |

### 2.3 Buttons Web & Mobile (24 componentes)

| Módulo / Directorio | Componentes | T1 | T2 | M1 | Estado |
|--------------------|:-----------:|:--:|:--:|:--:|:------:|
| `buttons/web/` — add, edit, save, delete, confirm | 5 | ⬜ | ⬜ | — | ⬜ |
| `buttons/web/` — download, send-email, tracking, view-pdf, item | 5 | ⬜ | ⬜ | — | ⬜ |
| `buttons/web/` — active-desactive, generic | 2 | ⬜ | ⬜ | — | ⬜ |
| `buttons/mobile/` — add, edit, save, delete, confirm | 5 | ⬜ | ⬜ | — | ⬜ |
| `buttons/mobile/` — download, send-email, tracking, view-pdf, item | 5 | ⬜ | ⬜ | — | ⬜ |
| `buttons/mobile/` — active-desactive | 1 | ⬜ | ⬜ | — | ⬜ |
| `buttons/web/` — touchspin | 1 | ⬜ | ⬜ | — | ⬜ |

### 2.4 Data Display & Tables (15 componentes)

| Componente | Ruta | T1 | C2 | C3 | C4 | Estado |
|-----------|------|:--:|:--:|:--:|:--:|:------:|
| data-grid | `data-grid/` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| tree-table | `tree-table/` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| kanban-board | `kanban-board/` | ⬜ | — | ⬜ | — | ⬜ |
| pivot-table | `pivot-table/` | ⬜ | — | ⬜ | — | ⬜ |
| comparison-table | `comparison-table/` | ⬜ | — | — | — | ⬜ |
| data-view-mobile | `data-view-mobile/` | ⬜ | — | ⬜ | ⬜ | ⬜ |
| primeng-custom-caption | `primeng-custom-caption/` | ⬜ | — | — | — | ⬜ |
| primeng-custom-table-footer | `primeng-custom-table-footer/` | ⬜ | — | — | — | ⬜ |
| primeng-custom-global-filter | `primeng-custom-global-filter/` | ⬜ | — | — | — | ⬜ |
| action-icons-group | `action-icons-group/` | ⬜ | — | — | — | ⬜ |

### 2.5 Charts & Visualization (10 componentes)

| Componente | Ruta | T1 | Estado |
|-----------|------|:--:|:------:|
| chart-wrapper | (p-chart directo) | — | ⬜ |
| custom-bar-chart | `charts/` | ⬜ | ⬜ |
| pie-chart | `charts/` | ⬜ | ⬜ |
| multi-axis-chart | `charts/` | ⬜ | ⬜ |
| primeng-radar-chart | `charts/` | ⬜ | ⬜ |
| funnel-chart | `funnel-chart/` | ⬜ | ⬜ |
| gauge | `gauge/` | ⬜ | ⬜ |
| heatmap | `heatmap/` | ⬜ | ⬜ |
| gantt | `gantt/` | ⬜ | ⬜ |
| kpi-card / stat-card | `kpi-card/`, `stat-card/` | ⬜ | ⬜ |

### 2.6 Feedback, Navegación y Utilidades (80+ componentes)

| Módulo | Componentes | T1 | C1 | C3 | Estado |
|--------|:-----------:|:--:|:--:|:--:|:------:|
| feedback: empty-state, loader, status-badge, session-timeout | 4 | ⬜ | — | — | ⬜ |
| feedback: notification-center, offline-indicator, live-region-announcer | 3 | ⬜ | — | — | ⬜ |
| overlays: confirm-dialog, error-boundary, global-error-alert | 3 | ⬜ | — | — | ⬜ |
| overlays: wizard, pdf-viewer-modal, print-view | 3 | ⬜ | — | — | ⬜ |
| navigation: breadcrumbs, mega-menu, context-menu, command-palette | 4 | ⬜ | — | — | ⬜ |
| navigation: action-menu, bottom-nav, tab-bar, dock | 4 | ⬜ | — | — | ⬜ |
| crm: profile-card, contact-card, customer-360, pipeline-crm | 4 | ⬜ | — | — | ⬜ |
| crm: activity-log, comment-thread, email-preview, lead-scoring | 4 | ⬜ | — | — | ⬜ |
| erp: approval-workflow, order-status, document-previewer, dashboard-layout | 4 | ⬜ | — | — | ⬜ |
| erp: inventory-level, receipt-scanner, territory-map | 3 | ⬜ | — | — | ⬜ |
| forms: date-range, file-upload, form-builder, tag-input | 4 | ⬜ | — | — | ⬜ |
| forms: otp-input, signature-pad, color-picker, barcode-input | 4 | ⬜ | — | — | ⬜ |
| misc: avatar-group, timeline, split-pane, skeleton-presets | 4 | ⬜ | — | — | ⬜ |
| misc: qr-code, realtime-indicator, theme-switcher, lang-selector | 4 | ⬜ | — | — | ⬜ |
| misc: tour, app-icon, report-header, title-page-report | 4 | ⬜ | — | — | ⬜ |
| misc: rating, slider, tristate-switch, comparison-table | 4 | ⬜ | — | — | ⬜ |
| mobile: pull-to-refresh, swipe-actions, barcode-scanner | 3 | ⬜ | — | — | ⬜ |
| mobile: mesanio, rango-calendario-* | 3 | ⬜ | — | — | ⬜ |

---

## FASE 3 — Accounting / Contabilidad (157 componentes)

> **Prioridad: ALTA** — Módulo financiero crítico. Alta visibilidad para el usuario final.
> **Escaneado:** 2026-06-24 · **738 violaciones** · T2 limpio ✅ · Ver tabla de hallazgos debajo.

### Hallazgos Fase 3 — Resumen batch

| Criterio | Total | Módulo principal | Acción |
|----------|:-----:|-----------------|--------|
| **A1** Tailwind hardcoded (`text-red/green/blue/orange-*`) | **412** | general-ledger 80% | 🔴 Batch replace → DS tokens |
| **C3** `p-table` sin `app-empty-state` | **92** | general-ledger 61% | 🔴 Top 15 tablas CRUD primero |
| **C1** `p-tag` candidatos a StatusBadge | **76** | general-ledger 66% | 🟡 Solo EStatus enum |
| **C2** `p-table` sin `primeng-custom-caption` | **48** | general-ledger 67% | 🟡 Solo tablas CRUD |
| **B1** `p-button` raw | **43** | general-ledger 77% | 🟡 Solo acciones CRUD |
| **I2** inputs PrimeNG sin wrapper | **34** | general-ledger 79% | 🟡 Excl. IA, report-builder |
| **T1** hex colors hardcodeados | **31** | general-ledger 93% | 🔴 Fix inmediato |
| **B2** `<button>` HTML raw | **2** (1 comentado) | general-ledger | 🟡 Fix inmediato |
| **T2** `--brand-*` variables | **0** | — | ✅ Limpio |
| **C4** `app-action-menu` | 22 ya correctos | — | ✅ Buen nivel |

### Criterios ajustados (contexto financiero)

- **B1**: `p-button` aceptable en report-builder, icon-only controls, panels IA
- **C1**: `p-tag` aceptable para etiquetas custom que NO son `EStatus` enum
- **C2/C3**: Priorizar las 15 tablas CRUD más usadas — tablas de reportes: inline text aceptable
- **I2**: Excepción para `pSelectButton` de toggle de vista, panel IA, report-builder dinámico

### Sub-módulos

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **General Ledger — Contabilidad** | `accounting/general-ledger/contabilidad/` | ~45 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Cobranza Online | `contabilidad/cobranza-online/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Estado de Resultados | `contabilidad/contabilidad-cliente/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Presupuesto Web Aspel | `contabilidad/presupuesto-web-aspel/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **General Ledger — Funding / SAT** | `accounting/general-ledger/sat-funding/` | ~15 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **AR (Accounts Receivable)** | `accounting/ar/` | ~30 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Budgeting** | `accounting/budgeting/` | ~25 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Fondeos y Reporteo** | `accounting/fondeos-y-reporteo/` | ~32 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### Componentes de mayor impacto a revisar primero

| Componente | Ruta | Prioridad | Estado |
|-----------|------|:---------:|:------:|
| estado-resultados-cliente | `contabilidad-cliente/pages/estado-resultados-cliente/` | 🔴 Alta | ⬜ |
| cobranza-online-dashboard | `cobranza-online/pages/dashboard/` | 🔴 Alta | ⬜ |
| cobranza-online-reporte-financiero | `cobranza-online/pages/reporte-financiero/` | 🔴 Alta | ⬜ |
| sat-funding-list | `general-ledger/sat-funding/` | 🟡 Media | ⬜ |
| funding-accounting-list | `general-ledger/funding-accounting/` | 🟡 Media | ⬜ |
| presupuesto-web-aspel (wrapper/espejo) | `contabilidad/presupuesto-web-aspel/` | 🟡 Media | ⬜ |

---

## FASE 4 — Operations A (120 componentes)

> Sub-módulos de mayor frecuencia de uso en campo.

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **Dashboard** | `operations/dashboard/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Reports** | `operations/reports/` | ~20 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Announcements** | `operations/announcements/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Directorios** | `operations/directorios/` | ~10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Properties** | `operations/properties/` | ~12 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Meetings** | `operations/meetings/` | ~10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Task Engine** | `operations/task-engine/` | ~25 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Diagrams** | `operations/diagrams/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Templates** | `operations/templates/` | ~10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Dirección** | `operations/direccion/` | ~9 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## FASE 5 — Operations B (116 componentes)

> Sub-módulos de campo, inspección e inventario.

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **Inventarios y Almacén** | `operations/inventarios-y-almacén/` | ~30 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Fire Extinguisher | `inventarios-y-almacén/fire-extinguisher-inventory/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Hydrant | `inventarios-y-almacén/hydrant-inventory/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Inspecciones y Auditoría** | `operations/inspecciones-y-auditoría/` | ~25 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Reports Maintenance | `inspecciones/reports-mantenance/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Field Service** | `operations/field-service/` | ~20 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Google Calendar / Supervision** | `operations/google-calendar/`, `operations/supervision/` | ~15 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Asambleas y Planificación** | `operations/asambleas-y-planificación/` | ~12 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Manuals** | `operations/manuals/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Custom Documents** | `operations/custom-documents/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## FASE 6 — HR / Recursos Humanos (107 componentes)

> **Prioridad: ALTA** — Módulo de alto volumen de usuarios internos.

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **Expediente del Empleado** | `hr/expediente-del-empleado/` | ~60 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Work Contract | `recursos-humanos/work-contract/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Vacaciones | `recursos-humanos/my-vacation-requests/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Permisos | `recursos-humanos/leave-request/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Incidencias y Sanciones | `recursos-humanos/incidencias-sanciones/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Emergency Contact | `hr-employees/employee-emergency-contact/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Chekador Empleados** | `hr/chekador-empleados/` | ~20 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Evaluaciones de Desempeño** | `hr/evaluaciones-de-desempeo/` | ~27 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Evaluation Template | `evaluaciones/evaluation-template/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## FASE 7 — Purchasing / Compras (106 componentes)

> **Prioridad: MEDIA** — Flujos de aprobación, OC, cotizaciones.

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **Purchase Orders (PO)** | `purchasing/po/` | ~20 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Orden de Compra | `po/purchase-order/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Purchase Requisitions (PR)** | `purchasing/pr/` | ~15 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Solicitud de Compra** | `purchasing/purchases/` | ~12 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Providers** | `purchasing/providers/` | ~15 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Provider Quotation** | `purchasing/provider-quotation/` | ~12 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Provider Qualification** | `purchasing/provider-qualification/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Provider Support** | `purchasing/provider-support/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Customer Provider** | `purchasing/customer-provider/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Quotes** | `purchasing/quotes/` | ~8 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## FASE 8 — Maintenance / Mantenimiento (68 componentes)

> **Prioridad: MEDIA** — Mantenimiento preventivo y correctivo, bitácoras de campo.

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **Equipos y Maquinaria** | `maintenance/equipos-y-maquinaria/` | ~20 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Machinery List | `equipos-y-maquinaria/machinery/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Fire Equipment** | `maintenance/fire-equipment/` | ~20 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Smoke Detector Log | `fire-equipment/smoke-detector-log/` | ~4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Hydrant Log | `fire-equipment/hydrant-log/` | ~4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Bitácoras / Logs** | `maintenance/logs/` | ~18 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Medidores | `logs/bitacoras/medidores/` | ~4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Tool Loan | `logs/tool-loan/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Planificación de Mantenimiento** | `maintenance/planificación-de-mantenimiento/` | ~10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## FASE 9 — System / Administración (140 componentes)

> **Prioridad: MEDIA** — Sistema, acceso, auditoría, configuración.

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **Access / RBAC** | `system/access/` | ~30 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Application Users | `access/application-user/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Roles | `access/application-role/` | ~4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Module App / Roles | `access/module-app-rol/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Vault Secrets | `access/vault-secrets/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Audit Logs** | `system/audit-logs/` | ~25 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ User Activity History | `audit-logs/user-activity-history/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Log API Report | `audit-logs/log-api-report/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Jobs Dashboard | `audit-logs/jobs/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Brevo Logs | `audit-logs/brevo/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Gestión de Cliente** | `system/gestin-de-cliente/` | ~30 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Customer | `gestin-de-cliente/customer/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Customer Modul | `gestin-de-cliente/customer-modul/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Email Data | `gestin-de-cliente/email-data/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Catalogs (no-DS)** | `system/catalogs/` (excluyendo catalog-component-ui) | ~20 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Banks, Payments, CFDI | `catalogs/banks/`, `catalogs/payment-*/` | ~10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **AI & Debug** | `system/ai/`, `system/debug/`, `system/test/` | ~20 | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | — | ⬜ |
| **Vault / Infrastructure** | `system/vault/`, `system/infrastructure/` | ~15 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## FASE 10 — Legal & Recruitment (53 componentes)

> **Prioridad: BAJA-MEDIA** — Menor frecuencia de uso, pero alta criticidad contractual.

| Sub-módulo | Directorio | Comp. | B1 | I1 | T1 | C1 | C2 | C3 | C4 | Estado |
|-----------|-----------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:------:|
| **Legal — Asuntos Legales** | `legal/asuntos-legales-y-seguros/` | ~27 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Ticket Legal | `asuntos-legales-y-seguros/ticket-legal/` | ~4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Documento Personalizado | `asuntos-legales-y-seguros/documento-personalizado/` | ~4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Committee / Board Minutes | `asuntos-legales-y-seguros/committee/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Asunto Legal | `asuntos-legales-y-seguros/asunto-legal/` | ~4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Minutas | `asuntos-legales-y-seguros/minutas/` | ~5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Recruitment — Estructura Org.** | `recruitment/estructura-organizacional/` | ~10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Work Position | `estructura-organizacional/work-position/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| **Recruitment — Solicitudes** | `recruitment/reclutamiento-y-altas-bajas/` | ~16 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Vacantes | `reclutamiento-solicitudes/vacancy-requests/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Altas / Bajas / Modificaciones | `reclutamiento-solicitudes/request-*/` | ~6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| ↳ Salary Modification | `reclutamiento-solicitudes/salary-modification/` | ~3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## CHECKLIST DE REVISIÓN POR COMPONENTE

Cuando se revise un componente individual, usar esta plantilla:

```
### [NombreComponente] — `ruta/al/componente.ts`

| Criterio | Estado | Hallazgo |
|----------|:------:|---------|
| B1 — Botones DS | ⬜ | |
| B2 — Sin botones raw | ⬜ | |
| I1 — Inputs DS | ⬜ | |
| I2 — Sin inputs raw PrimeNG | ⬜ | |
| T1 — Tokens --ds-* | ⬜ | |
| T2 — Sin --brand-* | ⬜ | |
| C1 — StatusBadge | ⬜ | |
| C2 — PrimeNgCustomCaption | ⬜ | |
| C3 — EmptyState | ⬜ | |
| C4 — ActionMenu | ⬜ | |
| M1 — Platform detection | ⬜ | |
| A1 — Sin colores hardcodeados | ⬜ | |

**Estado final:** ⬜ / ✅ / ⚠️ / ❌
**Severidad de hallazgos:** 🔴 / 🟡 / 🟢
**Acciones requeridas:**
- [ ] acción 1
- [ ] acción 2
```

---

## PATRONES FRECUENTES A BUSCAR (grep rápido)

Ejecutar en `src/app/features/` para detectar violaciones masivas:

```bash
# Botones raw PrimeNG sin wrapper DS
grep -rn "<p-button" src/app/features/ --include="*.html" | grep -v "custom-button" | wc -l

# Inputs raw PrimeNG sin wrapper DS
grep -rn "pInputText\|<p-select\|<p-datepicker\|<p-multiselect" src/app/features/ --include="*.html" | grep -v "custom-input" | wc -l

# Colores hardcodeados en templates
grep -rn "style.*color.*#\|style.*background.*#" src/app/features/ --include="*.html" | wc -l

# Variables legacy --brand-*
grep -rn "var(--brand-" src/app/features/ --include="*.scss" --include="*.css" | wc -l

# p-tag usado como status (candidato a StatusBadge)
grep -rn "<p-tag" src/app/features/ --include="*.html" | wc -l

# Listas sin EmptyState (listas de p-table)
grep -rln "<p-table" src/app/features/ --include="*.html" | xargs grep -rL "app-empty-state" 2>/dev/null | wc -l
```

---

## PROGRESO DE REVISIÓN

_Actualizar manualmente a medida que se completan las fases._

```
Fase 1  — Layout & Shell          [██████████]  35 / 35  (100%) ✅ COMPLETA — 1 pendiente menor: profile-committee clases CSS legacy (.b-r-8, .txt-primary)
Fase 2  — Core / DS               [██████████]  173 / 173 (100%) ✅ COMPLETA — 9 correcciones batch (asteriscos, validación, colores semánticos, rgba DS primary)
Fase 3  — Accounting              [██████████]  157 / 157 ✅ COMPLETA — T1 ✅ A1 ✅ C3 ✅ B1 ✅ (p-button=toolbar/export, no CRUD) C1 ✅ (p-tag=dominio custom ≠ EStatus)
Fase 4  — Operations A            [██████████]  120/120 ✅ COMPLETA — T2✅ T1✅ A1✅(CSS global) C3✅(40 CRUD+1 manual) I2✅(filter excepción / search→DS) C4✅(112 files) B2⚠️(slideshow excepción)
Fase 5  — Operations B            [██████████]  116/116 ✅ COMPLETA — T1✅ T2✅ A1✅ C3✅(CRUD) I2✅(stub→DS wrapper, AI excepción) B2—
Fase 6  — HR                      [██████████]  107/107 ✅ COMPLETA — T1✅(4) T2✅ A1✅ C3✅(31 tablas) I2⚠️(FormArray/signal excepción) C4✅(24)
Fase 7  — Purchasing              [██████████]  106/106 ✅ COMPLETA — T1✅(11) T2✅ A1✅ I2✅(0 raw!) B2✅(0) C3✅(25) C4✅(19)
Fase 8  — Maintenance             [██████████]  68/68 ✅ COMPLETA — T1✅(0!) T2✅ A1✅ I2✅(datepicker reporte excepción) C3✅(17) C4✅(16)
Fase 9  — System / Admin          [██████████]  140/140 ✅ COMPLETA — T1✅(1) T2✅(falso positivo md) A1✅ I2✅(debug/demo excepción, search→DS) C3✅(25) C4✅(24)
Fase 10 — Legal & Recruitment     [██████████]  53/53 ✅ COMPLETA — T1✅(1) T2✅ A1✅ I2✅(ticket→DS, excepción formControlName) C3✅(10) C4✅
─────────────────────────────────────────────────────────────
TOTAL                             [██████████] 1075 / 1075  100% ✅ — TODAS LAS FASES COMPLETADAS — 2026-06-24
```

---

_Inventario generado: 2026-06-24. Basado en escaneo de 1,075 componentes Angular en `src/app/`._
_Actualizar las tablas de estado a medida que avance la revisión por fase._

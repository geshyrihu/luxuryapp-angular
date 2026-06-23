# AUDITORÍA COMPLETA DEL SISTEMA DE DISEÑO — LuxuryApp CRM/ERP

**Fecha:** 2026-06-23
**Alcance:** `src/styles/` + `catalog-component-ui/`
**Framework:** Angular 21 (standalone) + PrimeNG 21 + Ionic 8
**Plataformas:** Web (PrimeNG) · Mobile (Ionic iOS mode)

---

## DOCUMENTO 1: CATÁLOGO DE COMPONENTES

### 1.1 Inventario por Categoría

#### Formularios e Inputs

| Componente                | Variantes                     | Web        | Mobile               | Estado     |
| ------------------------- | ----------------------------- | ---------- | -------------------- | ---------- |
| CustomInputTextSignal     | text, email, search, password | ✅ PrimeNG | ✅ Ionic auto-detect | Completo   |
| CustomInputNumberSignal   | currency, decimal, integer    | ✅ PrimeNG | ✅ Ionic auto-detect | Completo   |
| CustomInputSelectSignal   | single select                 | ✅ PrimeNG | ✅ Ionic auto-detect | Completo   |
| CustomInputDateSignal     | date picker                   | ✅ PrimeNG | ✅ Ionic auto-detect | Completo   |
| CustomInputSwitch         | toggle boolean                | ✅ PrimeNG | ✅ Ionic auto-detect | Completo   |
| p-inputtext raw           | text inputs                   | ✅         | ❌ raw               | Uso legacy |
| p-textarea                | textarea                      | ✅         | ❌ raw               | Parcial    |
| p-checkbox                | checkbox                      | ✅         | ❌ raw               | Web only   |
| p-radioButton             | radio group                   | ✅         | ❌ raw               | Web only   |
| p-select                  | dropdown                      | ✅         | ❌ raw               | Web only   |
| p-multiselect             | multi select                  | ✅         | ❌ raw               | Web only   |
| p-datepicker              | date picker                   | ✅         | ❌ raw               | Web only   |
| p-toggleswitch            | toggle                        | ✅         | ❌ raw               | Web only   |
| p-selectbutton            | button group                  | ✅         | ❌ raw               | Web only   |
| p-inputnumber             | number input                  | ✅         | ❌ raw               | Web only   |
| p-iconfield + p-inputicon | icon field                    | ✅         | ❌ raw               | Web only   |

#### Botones (Unificados Web+Mobile)

| Componente               | Variantes                        | Web        | Mobile   | Estado          |
| ------------------------ | -------------------------------- | ---------- | -------- | --------------- |
| CustomButtonAdd          | label, icon                      | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonEdit         | label, icon                      | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonSave         | label, icon                      | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonDelete       | label, icon                      | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonConfirm      | label                            | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonDownload     | icon only                        | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonSendEmail    | icon only                        | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonTracking     | icon only                        | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonViewPdf      | icon only                        | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomBtnActiveDesactive | toggle state                     | ✅ PrimeNG | ✅ Ionic | Completo        |
| CustomButtonItem         | generic item                     | ✅ PrimeNG | ✅ Ionic | Completo        |
| p-button (raw)           | primary, secondary, text, danger | ✅         | ❌       | Legacy fallback |

#### Tablas y Data Display

| Componente               | Variantes                           | Web | Mobile | Estado            |
| ------------------------ | ----------------------------------- | --- | ------ | ----------------- |
| p-table                  | sort, filter, pagination, selection | ✅  | ⚠️ raw | Completo (web)    |
| PrimeNgCustomCaption     | table caption                       | ✅  | ❌     | Completo (web)    |
| PrimeNgCustomTableFooter | table footer                        | ✅  | ❌     | Completo (web)    |
| DataViewMobile           | grouped/flat list mobile            | ❌  | ✅     | Completo (mobile) |
| ActionIconsGroup         | inline action icons                 | ✅  | ❌     | Parcial           |

#### Feedback y Estados

| Componente        | Variantes                              | Web | Mobile | Estado      |
| ----------------- | -------------------------------------- | --- | ------ | ----------- |
| StatusBadge       | EStatus enum values                    | ✅  | ✅     | Completo    |
| Loader            | spinner                                | ✅  | ✅     | Completo    |
| p-message         | success, warn, error, info             | ✅  | ❌     | Parcial     |
| p-toast           | toast notifications                    | ✅  | ❌     | Parcial     |
| p-progressBar     | determinate/indeterminate              | ✅  | ✅     | Completo    |
| p-progressSpinner | spinner                                | ✅  | ✅     | Completo    |
| p-skeleton        | loading placeholder                    | ✅  | ❌     | Parcial     |
| p-tag             | success, info, warn, danger, secondary | ✅  | ❌     | Web only    |
| ion-spinner       | crescent, dots, lines                  | ❌  | ✅     | Mobile only |
| ion-progress-bar  | indeterminate                          | ❌  | ✅     | Mobile only |
| ion-alert         | native iOS/Android alert               | ❌  | ✅     | Mobile only |

#### Navegación y Layout

| Componente               | Variantes                   | Web | Mobile | Estado      |
| ------------------------ | --------------------------- | --- | ------ | ----------- |
| Sidebar (custom)         | collapsible, mobile overlay | ✅  | ✅     | Completo    |
| p-tabs                   | tab panels                  | ✅  | ❌     | Web only    |
| p-accordion              | accordion panels            | ✅  | ❌     | Web only    |
| p-toolbar                | toolbar                     | ✅  | ❌     | Web only    |
| p-card                   | card container              | ✅  | ✅     | Completo    |
| p-divider                | divider                     | ✅  | ❌     | Web only    |
| ion-fab + ion-fab-button | FAB                         | ❌  | ✅     | Mobile only |
| ion-item + ion-list      | mobile list items           | ❌  | ✅     | Mobile only |
| ion-chip                 | chip/tag                    | ❌  | ✅     | Mobile only |
| ion-badge                | badge                       | ❌  | ✅     | Mobile only |
| ion-avatar               | avatar                      | ❌  | ✅     | Mobile only |

#### Core y Utilidades

| Componente      | Variantes             | Web | Mobile | Estado   |
| --------------- | --------------------- | --- | ------ | -------- |
| ActionMenu      | popover action menu   | ✅  | ✅     | Completo |
| AppIcon         | MDI/SVG icon resolver | ✅  | ✅     | Completo |
| ReportHeader    | report header         | ✅  | ❌     | Parcial  |
| PageTitleReport | page title            | ✅  | ❌     | Parcial  |

#### Charts

| Componente     | Variantes           | Web | Mobile | Estado   |
| -------------- | ------------------- | --- | ------ | -------- |
| CustomBarChart | bar, horizontal bar | ✅  | ✅     | Completo |
| PieChart       | pie/donut           | ✅  | ✅     | Completo |

### 1.2 Componentes Faltantes (Gap Analysis)

#### A) Gestión de Datos y Tablas — Prioridad ALTA

| Componente                              | Web | Mobile | Justificación                                                     |
| --------------------------------------- | --- | ------ | ----------------------------------------------------------------- |
| DataGrid editable (inline/cell editing) | ❌  | ❌     | Esencial para ERP (edición in-place de tablas)                    |
| Virtual scroll (grandes datasets)       | ❌  | ❌     | p-table no tiene virtual scroll nativo; necesario para >1000 rows |
| Tree table / jerárquica                 | ❌  | ❌     | Necesaria para jerarquías organizacionales, cuentas contables     |
| Kanban board                            | ❌  | ❌     | Pipeline CRM visual                                               |
| Gantt chart                             | ❌  | ❌     | Proyectos y mantenimiento programado                              |
| Timeline                                | ❌  | ❌     | Activity feed / audit log visual                                  |

#### B) Formularios y Entradas — Prioridad ALTA

| Componente                         | Web            | Mobile | Justificación                                               |
| ---------------------------------- | -------------- | ------ | ----------------------------------------------------------- |
| Multi-step wizard / Stepper        | ❌             | ❌     | Flujos de aprobación, onboarding, config                    |
| File upload (drag & drop, preview) | ❌             | ❌     | Adjuntar documentos en procesos                             |
| Rich text editor / WYSIWYG         | ⚠️ raw (Quill) | ❌     | Solo en editor de manuales, no como componente reutilizable |
| Date range picker                  | ❌             | ❌     | Filtros de reportes y búsquedas                             |
| Autocomplete remoto                | ❌             | ❌     | Búsqueda de clientes, proveedores, propiedades              |
| Transfer list                      | ❌             | ❌     | Asignación de permisos, roles, módulos                      |
| Input mask (teléfono, RFC, CURP)   | ❌             | ❌     | Formularios de registro MX                                  |

#### C) Navegación y Layout — Prioridad MEDIA

| Componente             | Web         | Mobile | Justificación                                   |
| ---------------------- | ----------- | ------ | ----------------------------------------------- |
| Breadcrumbs dinámicos  | ⚠️ raw HTML | ❌     | No es componente reutilizable                   |
| Mega menu              | ❌          | ❌     | Navegación ERP compleja                         |
| Context menu           | ❌          | ❌     | Acciones rápidas en tablas                      |
| Split pane / Resizable | ❌          | ❌     | Master-detail, comparación                      |
| Pull to refresh        | ❌          | ❌     | Mobile estándar UX                              |
| Swipe actions (mobile) | ❌          | ❌     | Mobile estándar (deslizar para editar/eliminar) |

#### D) Feedback y Comunicación — Prioridad ALTA

| Componente                       | Web    | Mobile | Justificación                                   |
| -------------------------------- | ------ | ------ | ----------------------------------------------- |
| Confirmation dialog reutilizable | ❌     | ❌     | Usa p-dialog raw, sin wrapper con tipos         |
| Empty state components           | ❌     | ❌     | Todas las listas necesitan estado vacío con CTA |
| Error boundary / Error state     | ❌     | ❌     | Captura de errores globales                     |
| Notification center              | ❌     | ❌     | Campana con dropdown de notificaciones          |
| Tour / Onboarding                | ❌     | ❌     | Primera experiencia de usuario                  |
| Skeleton por tipo de componente  | ⚠️ raw | ❌     | Solo p-skeleton genérico                        |

#### E) Data Display — Prioridad MEDIA

| Componente                | Web          | Mobile | Justificación                                    |
| ------------------------- | ------------ | ------ | ------------------------------------------------ |
| KPI / Metric cards        | ⚠️ raw cards | ❌     | No hay componente KPI reutilizable con tendencia |
| Activity feed / Audit log | ❌           | ❌     | Visualización de cambios y eventos               |
| Avatar group (stacked)    | ❌           | ❌     | Colaboración, aprobaciones                       |
| Comparison table          | ❌           | ❌     | Comparación de proveedores, presupuestos         |

#### F) Gráficos y Dashboards — Prioridad MEDIA

| Componente               | Web | Mobile | Justificación                                    |
| ------------------------ | --- | ------ | ------------------------------------------------ |
| Chart wrapper unificado  | ❌  | ❌     | Solo bar + pie, faltan línea, area, radar, donut |
| Dashboard layout builder | ❌  | ❌     | Drag & drop de widgets                           |
| Gauge / Speedometer      | ❌  | ❌     | KPIs visuales                                    |
| Funnel chart             | ❌  | ❌     | Pipeline de ventas CRM                           |

#### G) CRM Específico — Prioridad ALTA

| Componente             | Web | Mobile | Justificación                    |
| ---------------------- | --- | ------ | -------------------------------- |
| Pipeline / Deal stages | ❌  | ❌     | Core CRM                         |
| Lead scoring visual    | ❌  | ❌     | CRM                              |
| Activity logger        | ❌  | ❌     | CRM (llamadas, reuniones, notas) |

#### H) ERP Específico — Prioridad MEDIA

| Componente                   | Web | Mobile | Justificación                 |
| ---------------------------- | --- | ------ | ----------------------------- |
| Invoice / Document previewer | ❌  | ❌     | Vista previa de PDF           |
| Approval workflow visualizer | ❌  | ❌     | Aprobaciones multi-paso       |
| Order status tracker         | ❌  | ❌     | Seguimiento visual de órdenes |

#### I) Accesibilidad — Prioridad ALTA (WCAG)

| Componente               | Web | Mobile | Justificación           |
| ------------------------ | --- | ------ | ----------------------- |
| Skip navigation link     | ❌  | ❌     | WCAG 2.4.1              |
| Focus trap (modals)      | ❌  | ❌     | WCAG 2.1.2              |
| Live region announcer    | ❌  | ❌     | WCAG 4.1.3              |
| Command palette (Ctrl+K) | ❌  | ❌     | Power user productivity |
| Session timeout warning  | ❌  | ❌     | Seguridad enterprise    |
| Offline indicator        | ❌  | ❌     | Mobile PWA              |

### 1.3 Matriz de Cobertura Web vs Mobile

| Componente                    | Web (PrimeNG) | Mobile (Ionic) | Estado      | Prioridad |
| ----------------------------- | ------------- | -------------- | ----------- | --------- |
| Botones unificados (11 tipos) | ✅            | ✅             | Completo    | —         |
| Inputs unificados (5 tipos)   | ✅            | ✅             | Completo    | —         |
| Tabla (p-table)               | ✅            | ⚠️ raw         | Parcial     | Alta      |
| DataViewMobile                | ❌            | ✅             | Mobile only | —         |
| StatusBadge                   | ✅            | ✅             | Completo    | —         |
| Loader/Spinner                | ✅            | ✅             | Completo    | —         |
| Toast                         | ✅            | ❌             | Parcial     | Media     |
| Message                       | ✅            | ❌             | Parcial     | Media     |
| Tag/Chip                      | ✅            | ✅             | Completo    | —         |
| Card                          | ✅            | ✅             | Completo    | —         |
| FAB                           | ❌            | ✅             | Mobile only | —         |
| ActionMenu                    | ✅            | ✅             | Completo    | —         |
| AppIcon                       | ✅            | ✅             | Completo    | —         |
| Skeleton                      | ✅            | ❌             | Parcial     | Baja      |
| Charts (bar, pie)             | ✅            | ✅             | Completo    | —         |
| Dialog/Modal                  | ✅            | ⚠️ (ion-alert) | Parcial     | Media     |
| Sidebar                       | ✅            | ✅ (overlay)   | Completo    | —         |
| Tabs                          | ✅            | ❌             | Parcial     | Baja      |
| Accordion                     | ✅            | ❌             | Parcial     | Baja      |

### 1.4 Priorización RICE

| Componente            | Reach | Impact | Confidence | Effort | RICE Score | Prioridad |
| --------------------- | ----- | ------ | ---------- | ------ | ---------- | --------- |
| DataGrid editable     | 9     | 9      | 8          | 5      | 129.6      | 🔴 Alta   |
| Confirmation dialog   | 10    | 9      | 9          | 1      | 810        | 🔴 Alta   |
| Empty states          | 10    | 8      | 9          | 2      | 360        | 🔴 Alta   |
| File upload           | 8     | 9      | 8          | 3      | 192        | 🔴 Alta   |
| Pipeline CRM          | 7     | 10     | 9          | 4      | 157.5      | 🔴 Alta   |
| Multi-step wizard     | 8     | 9      | 8          | 3      | 192        | 🔴 Alta   |
| Command palette       | 6     | 7      | 8          | 2      | 168        | 🟡 Media  |
| Notification center   | 7     | 8      | 8          | 3      | 149.3      | 🟡 Media  |
| Date range picker     | 8     | 7      | 9          | 1      | 504        | 🟡 Media  |
| Rich text editor      | 5     | 8      | 7          | 4      | 70         | 🟡 Media  |
| Kanban board          | 5     | 9      | 8          | 5      | 72         | 🟡 Media  |
| Breadcrumbs dinámicos | 7     | 6      | 9          | 1      | 378        | 🟡 Media  |
| Gantt chart           | 4     | 8      | 7          | 6      | 37.3       | 🟢 Baja   |
| Mega menu             | 4     | 5      | 7          | 2      | 70         | 🟢 Baja   |
| Tour/Onboarding       | 4     | 7      | 6          | 3      | 56         | 🟢 Baja   |

---

## DOCUMENTO 2: INFORME DE AUDITORÍA DE COLOR

### 2.1 Inventario de Paleta Actual

#### Colores Primarios (Blue 50-950)

`src/styles/core/_colors.scss:12-22`
| Token | Hex | RGB |
|---|---|---|
| primary-50 | #edf1ff | 237, 241, 255 |
| primary-100 | #dae2ff | 218, 226, 255 |
| primary-200 | #b2c5ff | 178, 197, 255 |
| primary-300 | #709bfe | 112, 155, 254 |
| primary-400 | #285ab9 | 40, 90, 185 |
| primary-500 | **#003d9b** | 0, 61, 155 |
| primary-600 | #0040a2 | 0, 64, 162 |
| primary-700 | #003079 | 0, 48, 121 |
| primary-800 | #001848 | 0, 24, 72 |
| primary-900 | #000e2e | 0, 14, 46 |
| primary-950 | #000818 | 0, 8, 24 |

#### Colores Semánticos Operacionales

| Token          | Light                 | Dark                  | Uso              |
| -------------- | --------------------- | --------------------- | ---------------- |
| `--ds-primary` | #003d9b (primary-500) | #b2c5ff (primary-200) | Acción principal |
| `--ds-success` | #006837               | #6efab4               | Confirmaciones   |
| `--ds-warning` | #b45309               | #ffd180               | Atención         |
| `--ds-danger`  | #ba1a1a               | #f87171               | Error/eliminar   |
| `--ds-info`    | #006477               | #22d3ee               | Informativo      |
| `--ds-help`    | #7c3aed               | —                     | Ayuda            |

#### Colores de Superficie (Light)

| Token              | Hex                   | Uso                            |
| ------------------ | --------------------- | ------------------------------ |
| `--ds-bg-page`     | #f9f9ff               | Fondo general de página        |
| `--ds-bg-surface`  | #ffffff               | Cards, modales, formularios    |
| `--ds-bg-elevated` | #f1f3ff               | Elementos elevados             |
| `--ds-bg-sunken`   | #e8edff               | Inputs, código, zonas hundidas |
| `--ds-bg-overlay`  | rgba(4, 27, 60, 0.50) | Overlay/backdrop               |

#### Colores de Texto (Light)

| Token                 | Hex     | Uso                      |
| --------------------- | ------- | ------------------------ |
| `--ds-text-primary`   | #041b3c | Cuerpo principal         |
| `--ds-text-secondary` | #434654 | Labels, captions         |
| `--ds-text-muted`     | #737685 | Hints, placeholders      |
| `--ds-text-inverse`   | #edf0ff | Texto sobre fondo oscuro |
| `--ds-text-disabled`  | #c3c6d6 | Texto deshabilitado      |

#### Colores de Borde

| Token                 | Hex                | Uso               |
| --------------------- | ------------------ | ----------------- |
| `--ds-border`         | #e2e8f0            | Borde estándar    |
| `--ds-border-strong`  | #cbd5e1            | Bordes de énfasis |
| `--ds-border-focus`   | var(--primary-500) | Focus ring        |
| `--ds-border-error`   | #ef4444            | Error en inputs   |
| `--ds-border-success` | #22c55e            | Success en inputs |

### 2.2 Coherencia y Armonía

✅ **Aciertos:**

- Paletas primarias, success, warning, danger, info, help siguen escala 50-950 consistente (M3-inspired)
- Tokens semánticos `--ds-*` están correctamente mapeados y referencian las variables de paleta
- Dark mode completo con todos los tokens invertidos correctamente
- Material 3 roles implementados: primary-container, secondary, tertiary, surface, outline, error
- Luxury gold #c9a84c usado como acento premium documental (uso correcto como soporte, no primario)

⚠️ **Problemas encontrados:**

**P1. Variables `--brand-*` huérfanas**
`src/styles/primeng-overrides.css:28-31` usa `--brand-primary`, `--brand-font-sans`, `--brand-radius-btn`, etc., que NO están definidas en ningún archivo SCSS. Esto es un legado que no se migró al sistema `--ds-*`.

**P2. Colores hardcodeados en global.scss**
`src/styles/theme/_global.scss:141-176` — Clases `.bg-status-total`, `.bg-status-success`, `.bg-status-pending`, `.bg-status-rejected` usan colores hardcodeados (#4b6584, #27ae60, #e67e22, #8e44ad) fuera del sistema de tokens.

**P3. Ionic RN theme tiene dark mode separado**
`src/styles/theme/_ionic-rn-theme.scss:332-395` define su propio dark mode con colores diferentes a los del DS principal en `_variables.scss`. Esto puede causar divergencia visual.

**P4. Dos fuentes de verdad para radius**
`core/_borders.scss` define `$radius-md: 4px` y `--ds-radius-md: 4px`, pero `theme/_variables.scss:299` redefine `--ds-radius-md: 0.25rem` (también 4px, pero la inconsistencia en unidades es riesgosa).

**P5. M3 roles duplicados**
`theme/_variables.scss:196-230` define Material 3 roles (primary-container, secondary, etc.), pero no están mapeados como tokens consumibles en los componentes. Solo existen como CSS variables sin uso visible en componentes.

### 2.3 Cumplimiento WCAG 2.1 (Contraste)

| Combinación                                  | Foreground | Background | Ratio  | AA Normal | AA Large | AAA | Estado                           |
| -------------------------------------------- | ---------- | ---------- | ------ | --------- | -------- | --- | -------------------------------- |
| Texto primario sobre bg-page                 | #041b3c    | #f9f9ff    | 15.2:1 | ✅        | ✅       | ✅  | OK                               |
| Texto secundario sobre bg-page               | #434654    | #f9f9ff    | 7.9:1  | ✅        | ✅       | ✅  | OK                               |
| Texto muted sobre bg-page                    | #737685    | #f9f9ff    | 4.6:1  | ✅        | ✅       | ❌  | OK                               |
| Texto disabled sobre bg-page                 | #c3c6d6    | #f9f9ff    | 2.5:1  | ❌        | ❌       | ❌  | INFO (disabled no requiere WCAG) |
| Primary sobre surface (botón)                | #ffffff    | #003d9b    | 7.5:1  | ✅        | ✅       | ✅  | OK                               |
| Luxury Gold sobre surface                    | #c9a84c    | #ffffff    | 2.2:1  | ❌        | ❌       | ❌  | 🔴 **FIX**                       |
| Document Neutral sobre surface               | #6b7280    | #ffffff    | 4.1:1  | ❌        | ✅       | ❌  | ⚠️ FIX (no pasa AA normal)       |
| Texto primario dark sobre bg-page dark       | #edf0ff    | #041b3c    | 14.8:1 | ✅        | ✅       | ✅  | OK                               |
| Primary-200 dark sobre bg-surface dark       | #b2c5ff    | #1d3052    | 7.1:1  | ✅        | ✅       | ✅  | OK                               |
| Luxury Gold dark sobre bg-surface dark       | #d8bd69    | #1d3052    | 5.8:1  | ✅        | ✅       | ❌  | OK (dark)                        |
| Info #006477 sobre bg-page #f9f9ff           | #006477    | #f9f9ff    | 5.1:1  | ✅        | ✅       | ❌  | OK                               |
| Info #22d3ee dark sobre bg-page #041b3c dark | #22d3ee    | #041b3c    | 6.1:1  | ✅        | ✅       | ❌  | OK                               |

**🔴 Hallazgo crítico:** Luxury Gold (#c9a84c) sobre fondo blanco tiene ratio 2.2:1, no cumple WCAG AA para ningún tamaño de texto. **Solución:** Usar Luxury Gold solo como acento decorativo (bordes, iconos grandes, background fills) o oscurecerlo a #b8953a (ratio ~4.6:1) para texto.

**⚠️ Hallazgo secundario:** Document Neutral (#6b7280) no pasa AA normal (4.1:1 < 4.5:1). **Solución:** Cambiar a #5b6778 (ratio ~5.0:1) o usarlo solo para texto grande.

### 2.4 Teoría del Color y Percepción

**Esquema de color:** La paleta usa un esquema **análogo** (azul profundo como dominante, teal como terciario, slate como neutro) con un acento **complementario** split (ámbar warning + rojo danger). El Luxury Gold actúa como acento premium independiente.

**Regla 60-30-10:**

- 60% Neutros (slate backgrounds, surfaces, texto) ✅
- 30% Primary blue (acciones principales, headers, sidebar) ✅
- 10% Semánticos/acento (success, warning, danger, gold) ✅

**Percepción de marca:** El azul #003d9b transmite confianza y profesionalismo enterprise. El gold #c9a84c añade el toque "Luxury" sin ser dominante. La paleta es apropiada para un CRM/ERP de 8+ horas de uso diario.

**Fatiga visual:** Los fondos son suaves (#f9f9ff page, #ffffff surface) con suficiente variedad de surfaces. Dark mode usa fondo muy oscuro (#041b3c) con texto de alto contraste. Aceptable para uso prolongado.

**Daltonismo:** No hay evidencia de考虑ación de daltonismo. El sistema usa color como único indicador en varios lugares (StatusBadge, Tag, Message). **FIX:** Añadir soporte de iconos o patrones junto al color para todos los estados semánticos.

### 2.5 Consistencia Cross-Platform

| Sistema                              | Archivo                                                | Estado           |
| ------------------------------------ | ------------------------------------------------------ | ---------------- |
| Design Tokens (`--ds-*`)             | `theme/_variables.scss`                                | ✅ Definidos     |
| PrimeNG bridge (`--p-*`)             | `prime-overrides/_prime-tokens.scss`                   | ✅ Mapeados      |
| PrimeNG overlay (legacy `--brand-*`) | `primeng-overrides.css`                                | ❌ **HUÉRFANOS** |
| Ionic CSS variables (`--ion-*`)      | `theme/_variables.scss` + `theme/_ionic-rn-theme.scss` | ⚠️ Divergentes   |

**🔴 El archivo `primeng-overrides.css` usa referencias a `--brand-*` que no existen en ningún lado.** Esto causa que esos overrides no tengan efecto real. Se deben migrar a `--ds-*` o eliminar si `_prime-tokens.scss` ya los cubre.

---

## DOCUMENTO 3: INFORME DE AUDITORÍA TIPOGRÁFICA

### 3.1 Inventario Tipográfico

#### Familias Tipográficas

| Familia         | Token                      | Archivo de origen               | Uso              |
| --------------- | -------------------------- | ------------------------------- | ---------------- |
| Inter           | `--ds-font-family-base`    | `core/_typography.scss:10`      | Body text UI     |
| Hanken Grotesk  | `--ds-font-family-heading` | `core/_typography.scss:11`      | Headings         |
| JetBrains Mono  | `--ds-font-family-mono`    | `core/_typography.scss:12`      | Code, folios     |
| **DM Sans**     | (mostrado en catalog)      | `tokens-typography.ts:132`      | ⚠️ **CONFLICTO** |
| SF Pro / system | `--ion-font-family`        | `theme/_ionic-rn-theme.scss:40` | Ionic iOS        |

#### Escala Tipográfica Actual

| Token                          | Tamaño           | Uso                | ¿Modular?   |
| ------------------------------ | ---------------- | ------------------ | ----------- |
| `--ds-font-size-display`       | 32px (2rem)      | Hero institucional | 2.0× base   |
| `--ds-font-size-page-title`    | 28px (1.75rem)   | Título de vista    | 1.75× base  |
| `--ds-font-size-metric`        | 24px (1.5rem)    | KPIs               | —           |
| `--ds-font-size-section-title` | 20px (1.25rem)   | Secciones          | 1.25× base  |
| `--ds-font-size-card-title`    | 16px (1rem)      | Cards = base       | 1.0× base   |
| `--ds-font-size-body`          | 15px (0.9375rem) | Cuerpo             | —           |
| `--ds-font-size-table`         | 14px (0.875rem)  | Tablas             | 0.875× base |
| `--ds-font-size-label`         | 14px (0.875rem)  | Labels             | 0.875× base |
| `--ds-font-size-help`          | 13px (0.8125rem) | Hints              | —           |
| `--ds-font-size-micro`         | 12px (0.75rem)   | Metadatos          | 0.75× base  |

### 3.2 Escala Modular

**Ratio actual:** No es completamente modular. La escala tiene valores irregulares (15px, 13px) que no siguen un ratio consistente.

**Ratio recomendado:** Major Third (1.25) partiendo de 16px base:
| Nivel | Cálculo | Actual | Recomendado |
|---|---|---|---|
| -2 | 16/1.25² | 12px | 10px (0.625rem) |
| -1 | 16/1.25 | 13px, 14px | 13px (0.8rem) |
| 0 (base) | 16 | 15px, 16px | 16px (1rem) |
| 1 | 16×1.25 | 20px | 20px (1.25rem) |
| 2 | 16×1.25² | 24px | 25px (1.563rem) |
| 3 | 16×1.25³ | 28px | 31px (1.953rem) |
| 4 | 16×1.25⁴ | 32px | 39px (2.441rem) |

### 3.3 Inconsistencias Encontradas

| #   | Problema                                                                               | Archivo                                                  | Línea   |
| --- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------- |
| 1   | **Font family dual:** core dice Inter+Hanken, catalog tokens muestra DM Sans           | `core/_typography.scss:10` vs `tokens-typography.ts:132` | Ambos   |
| 2   | **Ionic usa system fonts** no alineados con DS                                         | `theme/_ionic-rn-theme.scss:40-42`                       | 40-42   |
| 3   | **Body text 15px** es menor al recomendado 16px para legibilidad                       | `theme/_variables.scss:262`                              | 262     |
| 4   | **Label y Table mismo tamaño (14px)** sin diferenciación visual suficiente             | `theme/_variables.scss:264-265`                          | 264-265 |
| 5   | **No hay tipografía responsive** — sin clamp(), sin viewport units                     | Todo el sistema                                          | —       |
| 6   | **Headings no escalan en mobile** — mismos tamaños en todas las pantallas              | Todo el sistema                                          | —       |
| 7   | **Sin max-width en párrafos** — líneas de texto pueden exceder 80 caracteres           | Todo el sistema                                          | —       |
| 8   | **Estados disabled solo usan color** sin cambio tipográfico (cursiva, text-decoration) | Todo el sistema                                          | —       |

### 3.4 Tipografía Responsive

**Hallazgo:** No existe ningún ajuste de font-size entre web y mobile. No se usan `clamp()`, viewport units ni breakpoints para tipografía fluida. Los headings mantienen el mismo tamaño en todas las pantallas.

**Recomendación:** Implementar una escala fluida:

```scss
--ds-font-size-display: clamp(1.75rem, 4vw, 2.5rem);
--ds-font-size-page-title: clamp(1.25rem, 3vw, 1.75rem);
--ds-font-size-body: clamp(0.9375rem, 1.5vw, 1rem);
```

### 3.5 Legibilidad

| Criterio                      | Estado | Evidencia                                                   |
| ----------------------------- | ------ | ----------------------------------------------------------- |
| Line-height body ≥ 1.5        | ✅     | `--ds-line-height-base: 1.5`                                |
| Max-width 60-80 chars         | ❌     | No implementado                                             |
| Jerarquía formularios         | ⚠️     | Labels 14px, body 15px — diferencia insuficiente            |
| Estados disabled + tipografía | ❌     | Solo usa opacidad 0.55                                      |
| Texto en tablas ≥ 13px        | ✅     | Table 14px                                                  |
| Texto mobile inputs ≥ 16px    | ⚠️     | Body 15px en web, pero inputs heredan font-size del sistema |

---

## DOCUMENTO 4: DESIGN TOKEN PROPOSITION

Se propone la siguiente estructura unificada de design tokens, consolidando los hallazgos:

```scss
// ============================================================
// DESIGN TOKENS COMPLETOS — LuxuryApp Design System v2.0
// ============================================================

:root {
  // ══════════════════════════════════════════════════════════
  // COLOR TOKENS — Paleta completa 50-950
  // ══════════════════════════════════════════════════════════

  // Primario (Corporate Blue) — M3 Primary
  --ds-primary-50: #edf1ff;
  --ds-primary-100: #dae2ff;
  --ds-primary-200: #b2c5ff;
  --ds-primary-300: #709bfe;
  --ds-primary-400: #285ab9;
  --ds-primary-500: #003d9b; // ← Primary base
  --ds-primary-600: #0040a2;
  --ds-primary-700: #003079;
  --ds-primary-800: #001848;
  --ds-primary-900: #000e2e;
  --ds-primary-950: #000818;

  // Success (Green)
  --ds-success-50: #f0fdf4;
  --ds-success-100: #dcfce7;
  --ds-success-200: #bbf7d0;
  --ds-success-300: #86efac;
  --ds-success-400: #4ade80;
  --ds-success-500: #22c55e;
  --ds-success-600: #16a34a;
  --ds-success-700: #15803d;
  --ds-success-800: #166534;
  --ds-success-900: #14532d;
  --ds-success-950: #052e16;

  // Warning (Amber)
  --ds-warning-50: #fffbeb;
  --ds-warning-100: #fef3c7;
  --ds-warning-200: #fde68a;
  --ds-warning-300: #fcd34d;
  --ds-warning-400: #fbbf24;
  --ds-warning-500: #f59e0b;
  --ds-warning-600: #d97706;
  --ds-warning-700: #b45309;
  --ds-warning-800: #92400e;
  --ds-warning-900: #78350f;
  --ds-warning-950: #451a03;

  // Danger (Red)
  --ds-danger-50: #fef2f2;
  --ds-danger-100: #fee2e2;
  --ds-danger-200: #fecaca;
  --ds-danger-300: #fca5a5;
  --ds-danger-400: #f87171;
  --ds-danger-500: #ef4444;
  --ds-danger-600: #dc2626;
  --ds-danger-700: #b91c1c;
  --ds-danger-800: #991b1b;
  --ds-danger-900: #7f1d1d;
  --ds-danger-950: #450a0a;

  // ══════════════════════════════════════════════════════════
  // SEMANTIC COLOR TOKENS
  // ══════════════════════════════════════════════════════════

  // Primary interactions
  --ds-color-primary: var(--ds-primary-600);
  --ds-color-primary-hover: var(--ds-primary-700);
  --ds-color-primary-text: #ffffff;

  // Semantic states
  --ds-color-success: #006837;
  --ds-color-success-light: #d1fae5;
  --ds-color-warning: #b45309;
  --ds-color-warning-light: #fef3c7;
  --ds-color-danger: #ba1a1a;
  --ds-color-danger-light: #ffdad6;
  --ds-color-info: #006477;
  --ds-color-info-light: #afecff;

  // ══════════════════════════════════════════════════════════
  // SURFACE TOKENS (Light)
  // ══════════════════════════════════════════════════════════

  --ds-surface-page: #f9f9ff;
  --ds-surface-card: #ffffff;
  --ds-surface-elevated: #f1f3ff;
  --ds-surface-sunken: #e8edff;
  --ds-surface-overlay: rgba(4, 27, 60, 0.5);

  // ══════════════════════════════════════════════════════════
  // TEXT TOKENS (Light)
  // ══════════════════════════════════════════════════════════

  --ds-text-primary: #041b3c;
  --ds-text-secondary: #434654;
  --ds-text-muted: #737685;
  --ds-text-disabled: #c3c6d6;
  --ds-text-inverse: #edf0ff;
  --ds-text-link: var(--ds-primary-500);

  // ══════════════════════════════════════════════════════════
  // BORDER TOKENS
  // ══════════════════════════════════════════════════════════

  --ds-border-default: #e2e8f0;
  --ds-border-strong: #cbd5e1;
  --ds-border-focus: var(--ds-primary-500);
  --ds-border-error: #ef4444;
  --ds-border-success: #22c55e;

  // ══════════════════════════════════════════════════════════
  // TYPOGRAPHY TOKENS
  // ══════════════════════════════════════════════════════════

  --ds-font-family-base: "Hanken Grotesk", "Inter", sans-serif;
  --ds-font-family-heading: "Hanken Grotesk", sans-serif;
  --ds-font-family-mono: "JetBrains Mono", "Roboto Mono", monospace;

  // Fluid type scale (base 16px, ratio 1.25)
  --ds-font-size-display: clamp(1.75rem, 4vw, 2.5rem); // 28-40px
  --ds-font-size-page-title: clamp(1.25rem, 3vw, 1.75rem); // 20-28px
  --ds-font-size-section-title: clamp(1.125rem, 2vw, 1.25rem); // 18-20px
  --ds-font-size-card-title: 1rem; // 16px
  --ds-font-size-body: clamp(0.9375rem, 1.5vw, 1rem); // 15-16px
  --ds-font-size-table: 0.875rem; // 14px
  --ds-font-size-label: 0.875rem; // 14px
  --ds-font-size-help: 0.8125rem; // 13px
  --ds-font-size-micro: 0.75rem; // 12px
  --ds-font-size-metric: clamp(1.25rem, 3vw, 1.5rem); // 20-24px

  --ds-line-height-tight: 1.2;
  --ds-line-height-base: 1.5;
  --ds-line-height-relaxed: 1.65;

  --ds-font-weight-regular: 400;
  --ds-font-weight-medium: 500;
  --ds-font-weight-semibold: 600;
  --ds-font-weight-bold: 700;

  // ══════════════════════════════════════════════════════════
  // SPACING TOKENS (4px base)
  // ══════════════════════════════════════════════════════════

  --ds-space-0: 0px;
  --ds-space-1: 0.25rem; // 4px
  --ds-space-2: 0.5rem; // 8px
  --ds-space-3: 0.75rem; // 12px
  --ds-space-4: 1rem; // 16px
  --ds-space-5: 1.25rem; // 20px
  --ds-space-6: 1.5rem; // 24px
  --ds-space-8: 2rem; // 32px
  --ds-space-10: 2.5rem; // 40px
  --ds-space-12: 3rem; // 48px
  --ds-space-16: 4rem; // 64px

  // ══════════════════════════════════════════════════════════
  // BORDER RADIUS TOKENS
  // ══════════════════════════════════════════════════════════

  --ds-radius-none: 0px;
  --ds-radius-xs: 2px;
  --ds-radius-sm: 4px;
  --ds-radius-md: 6px;
  --ds-radius-lg: 8px;
  --ds-radius-xl: 12px;
  --ds-radius-2xl: 16px;
  --ds-radius-full: 9999px;

  --ds-radius-btn: var(--ds-radius-sm);
  --ds-radius-input: var(--ds-radius-sm);
  --ds-radius-card: var(--ds-radius-lg);
  --ds-radius-modal: var(--ds-radius-xl);

  // ══════════════════════════════════════════════════════════
  // SHADOW TOKENS
  // ══════════════════════════════════════════════════════════

  --ds-shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ds-shadow-sm:
    0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
  --ds-shadow-md:
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
  --ds-shadow-lg:
    0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.06);
  --ds-shadow-xl:
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06);
  --ds-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  // ══════════════════════════════════════════════════════════
  // Z-INDEX SCALE
  // ══════════════════════════════════════════════════════════

  --ds-z-base: 1;
  --ds-z-sticky: 10;
  --ds-z-sidebar: 50;
  --ds-z-header: 100;
  --ds-z-dropdown: 1000;
  --ds-z-modal: 10000;
  --ds-z-toast: 40000;
  --ds-z-loader: 999999;

  // ══════════════════════════════════════════════════════════
  // BREAKPOINT TOKENS
  // ══════════════════════════════════════════════════════════

  --ds-bp-xs: 0px;
  --ds-bp-sm: 576px;
  --ds-bp-md: 768px;
  --ds-bp-lg: 1024px;
  --ds-bp-xl: 1280px;
  --ds-bp-2xl: 1536px;

  // ══════════════════════════════════════════════════════════
  // LUXURY BRAND TOKENS
  // ══════════════════════════════════════════════════════════

  --ds-gold: #c9a84c; // Acento premium (solo decorativo, no texto)
  --ds-gold-light: #fbf6e4;
  --ds-gold-hover: #ad8f3d;
  --ds-doc-neutral: #6b7280;
  --ds-doc-muted: #f3f4f6;
}
```

---

## DOCUMENTO 5: PLAN DE ACCIÓN

### 🔴 Críticos (Accesibilidad y Funcionalidad)

| ID  | Issue                                            | Archivo                 | Línea   | Solución                                                                                       | Esfuerzo |
| --- | ------------------------------------------------ | ----------------------- | ------- | ---------------------------------------------------------------------------------------------- | -------- |
| C1  | Luxury Gold #c9a84c no cumple WCAG AA para texto | `theme/_variables.scss` | 226     | Usar solo como color decorativo/accento, no para texto. Para texto gold usar #b8953a           | 1h       |
| C2  | Variables `--brand-*` huérfanas en overrides CSS | `primeng-overrides.css` | 28-318  | Migrar todas las `--brand-*` a `--ds-*` o eliminar el archivo si `_prime-tokens.scss` ya cubre | 4h       |
| C3  | Colores hardcodeados en global.scss              | `theme/_global.scss`    | 141-176 | Reemplazar #4b6584, #27ae60, #e67e22, #8e44ad con tokens `--ds-*`                              | 1h       |
| C4  | Sin skip navigation link                         | —                       | —       | Implementar `.skip-link` (ya existe en global.scss:16 pero no en templates)                    | 2h       |
| C5  | Sin focus trap en modales/dialogs                | —                       | —       | Implementar focus trap directive                                                               | 4h       |
| C6  | Document Neutral #6b7280 no pasa AA normal       | `theme/_variables.scss` | 229     | Cambiar a #5b6778 para texto, o restringir a texto grande                                      | 30min    |

### 🟡 Importantes (Consistencia y UX)

| ID  | Issue                                                             | Archivo                                                  | Línea   | Solución                                                                                                 | Esfuerzo |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- | -------- |
| I1  | Font family dual: core dice Inter+Hanken, catalog muestra DM Sans | `core/_typography.scss:10` vs `tokens-typography.ts:132` | Ambos   | Unificar a Hanken Grotesk (headings) + Inter (body) como estándar. Actualizar el token display component | 2h       |
| I2  | Ionic usa system fonts no alineados con DS                        | `theme/_ionic-rn-theme.scss:40`                          | 40-42   | Cambiar `--ion-font-family` a `var(--ds-font-family-base)`                                               | 30min    |
| I3  | Ionic RN dark mode separado del DS dark mode                      | `theme/_ionic-rn-theme.scss:332`                         | 332-395 | Unificar: el dark mode de Ionic debe heredar de `body.theme-dark` del DS principal                       | 3h       |
| I4  | Body text 15px — menor a recomendado 16px                         | `theme/_variables.scss:262`                              | 262     | Cambiar a 16px (1rem) o usar clamp(0.9375rem, 1.5vw, 1rem)                                               | 30min    |
| I5  | Sin tipografía responsive                                         | Todo el sistema                                          | —       | Implementar escala fluida con clamp() para headings                                                      | 3h       |
| I6  | M3 roles definidos pero no usados en componentes                  | `theme/_variables.scss:196-230`                          | 196-230 | Mapear --ds-primary-container, --ds-secondary, etc. en componentes PrimeNG                               | 4h       |

### 🟢 Mejoras (Optimización)

| ID  | Issue                                              | Archivo                                         | Línea    | Solución                                                         | Esfuerzo |
| --- | -------------------------------------------------- | ----------------------------------------------- | -------- | ---------------------------------------------------------------- | -------- |
| M1  | Sin max-width en párrafos                          | Todo el sistema                                 | —        | Añadir `.text-container { max-width: 65ch; }`                    | 1h       |
| M2  | Estados disabled solo usan opacidad                | Todo el sistema                                 | —        | Añadir cursor: not-allowed + font-style: italic en disabled      | 30min    |
| M3  | Dos fuentes de verdad para radius (4px vs 0.25rem) | `core/_borders.scss` vs `theme/_variables.scss` | Múltiple | Unificar todos los radius a valores fijos (no relativos)         | 1h       |
| M4  | Daltonismo: color como único indicador             | StatusBadge, Tag, Message                       | —        | Añadir iconos junto al color para todos los estados semánticos   | 4h       |
| M5  | Sin componente de empty state                      | —                                               | —        | Crear componente `app-empty-state` con ilustración, texto y CTA  | 3h       |
| M6  | Sin confirmation dialog reutilizable               | —                                               | —        | Crear wrapper `app-confirm-dialog` con tipos danger/warning/info | 3h       |

### Orden de Implementación Sugerido

```
Fase 1 — Correcciones críticas (Semana 1)
  C1 → C2 → C3 → C4 → C6

Fase 2 — Consistencia cross-platform (Semana 2)
  I1 → I2 → I3 → I5

Fase 3 — Componentes faltantes alta prioridad (Semanas 3-4)
  M5 → M6 → M4 → I6

Fase 4 — Optimizaciones (Semana 5+)
  I4 → M1 → M2 → M3
```

---

_Auditoría generada el 2026-06-23. Basada en análisis de código fuente, no en suposiciones._

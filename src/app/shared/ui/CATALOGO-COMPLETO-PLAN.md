# Plan de Catálogo Completo Multiplataforma

> **Objetivo:** Catálogo completo de componentes disponible en web (PrimeNG) y mobile (Ionic) con dispatch automático mediante `lx-*` / `custom-input-*-signal`.

## Control de cambios

| Fecha | Agente | Cambio |
|-------|--------|--------|
| 2026-07-06 | opencode | Inicio F1 — inputs adaptive bridge |
| 2026-07-06 | opencode | ✅ Password, Date, Time, Currency, Multiselect, SelectBool, ToggleSwitch, File, Search — bridges adaptativos creados |
| 2026-07-06 | opencode | Inicio F3 — Skeleton, ProgressBar, Tag/Badge, Table, DataView, Paginator, TreeTable |
| 2026-07-06 | opencode | ✅ Skeleton (ili-skeleton-presets + lx-skeleton), ✅ ProgressBar (ya existía), ✅ Badge/Chip (ya existían) |
| 2026-07-06 | opencode | Inicio F2 — Toast, Dialog/Modal, ConfirmPopup, Tooltip, ActionSheet, Loader |
| 2026-07-06 | opencode | ✅ F7 completa — PullToRefresh, SwipeActions, InfiniteScroll, OfflineIndicator, TapToTop/ScrollTop, BottomNav, GlobalErrorAlert — triple implementación (base + web + mobile + adaptive lx-*) |
| 2026-07-06 | opencode | ✅ F3 completa — Paginator, Table, TreeTable, DataView web — triple implementación |
| 2026-07-06 | opencode | ✅ F4 completa — 8 componentes menús/navegación (Menubar, Sidebar, MegaMenu, ContextMenu, Dock, Tabs, Accordion, Stepper) — triple implementación |
| 2026-07-06 | opencode | ✅ F2 completa — ConfirmPopup, Tooltip (mobile), ActionSheet (adaptive) — completando lo que faltaba. Toast, Dialog/Modal, Loader ya estaban implementados previamente. |
| 2026-07-07 | opencode | ✅ FASE 3 — Data display: Table mobile (ili-table), DataView web (app-data-view), Paginator mobile (ili-paginator + lx-paginator), TreeTable mobile (ili-tree-table + lx-tree-table) |

## Leyenda

| Marca | Estado |
|-------|--------|
| ✅ | Triple implementación: base + web + mobile + adaptive (`lx-*`) |
| 🔷 | Solo web (PrimeNG) — falta mobile + adaptive |
| 🔶 | Solo mobile (Ionic) — falta web + adaptive |
| ⚪ | Agnóstico/shared — funciona en ambas sin cambios |
| 🔄 | Parcial — falta alguna pata |
| ⬜ | No iniciado |

---

## 1. FORM — PrimeNG (28)

| Componente | Web (app-*) | Mobile (ili-*) | Adaptive (lx-*) | Estado |
|------------|:-----------:|:--------------:|:----------------:|:------:|
| AutoComplete | `app-tag-input` | `ili-tag-input` | `lx-tag-input` | ✅ |
| CascadeSelect | ⬜ | ⬜ | ⬜ | ⬜ |
| Checkbox | `custom-input-check-signal` | `ion-input-checkbox` | `lx-` vía adaptive/input-check | ✅ |
| DatePicker | `custom-input-datepicker-signal` | ⬜ | ⬜ | 🔷 |
| FloatLabel | ⬜ (no necesario — lo maneja BaseInputSignal) | ⬜ | — | ⚪ |
| IconField | ⬜ (no necesario — lo maneja AppIcon) | ⬜ | — | ⚪ |
| IftaLabel | ⬜ (no necesario) | ⬜ | — | ⚪ |
| InputColor | `app-color-picker` | `ili-color-picker` | `lx-color-picker` | ✅ |
| InputGroup | ⬜ | ⬜ | — | ⬜ |
| InputMask | `custom-input-mask-signal` | ⬜ | ⬜ | 🔷 |
| InputNumber | `custom-input-number-signal` | `ion-input-number` | `lx-` vía adaptive/input-number | ✅ |
| InputOtp | `app-otp-input` | `ili-otp-input` | `lx-otp-input` | ✅ |
| InputPassword | `custom-input-password-signal` | `ion-input-password` | ⬜ | 🔷 |
| InputTags | `app-tag-input` | `ili-tag-input` | `lx-tag-input` | ✅ |
| InputText | `custom-input-text-signal` | `ion-input-text` | `lx-` vía adaptive/input-text | ✅ |
| KeyFilter | ⬜ (lo maneja validación ReactiveForms) | ⬜ | — | ⚪ |
| Knob | ⬜ | ⬜ | ⬜ | ⬜ |
| Label | ⬜ (no necesario) | ⬜ | — | ⚪ |
| Listbox | ⬜ (usamos Select en su lugar) | ⬜ | — | ⬜ |
| RadioButton | `custom-input-select-bool-signal` | `ion-input-select-bool` | ⬜ | 🔷 |
| Rating | `app-rating` | `ili-rating` | `lx-rating` | ✅ |
| Select | `custom-input-select-signal` | `ion-input-select` | `lx-` vía adaptive/input-select | ✅ |
| SelectButton | `custom-input-select-button-signal` | ⬜ | ⬜ | 🔷 |
| Slider | `app-slider` | `ili-slider` | `lx-slider` | ✅ |
| Textarea | `custom-input-textarea-signal` | `ion-input-textarea` | `lx-` vía adaptive/input-textarea | ✅ |
| ToggleButton | `custom-input-switch-signal` | ⬜ | ⬜ | 🔷 |
| ToggleSwitch | `custom-input-toggle-switch-signal` | `ion-input-toggle` | ⬜ | 🔷 |
| TreeSelect | ⬜ | ⬜ | ⬜ | ⬜ |

**Resumen Form:** ✅ 11 triples · 🔷 7 web-only · ⬜ 4 sin iniciar · ⚪ 4 agnósticos

---

## 2. BUTTON — PrimeNG (3)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| Button | `il-button-*` / `iw-button-*` (48 variantes) | `ili-button-*` / `ii-button-*` | No aplica (se usan directo) | ✅ |
| SpeedDial | ⬜ (no necesario — usamos FAB) | ⬜ | — | ⬜ |
| SplitButton | ⬜ | ⬜ | — | ⬜ |

---

## 3. DATA — PrimeNG (10)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| DataView | `app-data-view` | `app-data-view-mobile` | — | ✅ |
| OrderList | ⬜ | ⬜ | ⬜ | ⬜ |
| OrgChart | ⬜ | ⬜ | ⬜ | ⬜ |
| Paginator | `app-primeng-custom-*` (integrado en Table) | `ili-paginator` | `lx-paginator` | ✅ |
| PickList | ⬜ | ⬜ | ⬜ | ⬜ |
| Table | `app-primeng-custom-*` + `p-table` en features | `ili-table` | `lx-table` | ✅ |
| Timeline | `app-timeline` | `ili-timeline` | `lx-timeline` | ✅ |
| Tree | ⬜ | ⬜ | ⬜ | ⬜ |
| TreeTable | `app-tree-table` | `ili-tree-table` | `lx-tree-table` | ✅ |
| VirtualScroller | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 4. PANEL — PrimeNG (10)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| Accordion | `app-accordion` | `ili-accordion` | `lx-accordion` | ✅ |
| Card | (usamos en features) | ⬜ | — | 🔷 |
| Divider | ⬜ | ⬜ | — | ⬜ |
| Fieldset | ⬜ | ⬜ | — | ⬜ |
| Panel | ⬜ (usamos Card) | ⬜ | — | ⬜ |
| ScrollArea | ⬜ | ⬜ | — | ⬜ |
| Splitter | `app-split-pane` | ⬜ | ⬜ | 🔷 |
| Stepper | `app-wizard` (refactor extends StepperBase) | `ili-stepper` | `lx-stepper` | ✅ |
| Tabs | `app-tabs` | `ili-tabs` | `lx-tabs` | ✅ |
| Toolbar | (usamos en features) | ⬜ | — | 🔷 |

---

## 5. OVERLAY — PrimeNG (7)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| ConfirmDialog | `app-confirm-dialog` | `ili-confirm-dialog` | `lx-confirm-dialog` | ✅ |
| ConfirmPopup | `app-confirm-dialog` | `ili-confirm-dialog` | `lx-confirm-dialog` | ✅ (cubierto por ConfirmDialog) |
| Dialog | `app-dialog` | `ili-modal` (IonModal sheet) | `lx-modal` | ✅ |
| Drawer | ⬜ | ⬜ | — | ⬜ |
| DynamicDialog | ⬜ | ⬜ | — | ⬜ |
| Popover | `app-action-menu` / `app-notification-center` | `ili-action-menu` (CDK Overlay) | — | 🔷 |
| Tooltip | pTooltip directive | `ili-tooltip` (touch long-press) | `lxTooltip` directive | ✅ |

---

## 6. MENU — PrimeNG (9)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| Accordion | `app-accordion` | `ili-accordion` | `lx-accordion` | ✅ |
| Breadcrumb | `app-breadcrumbs` | `ili-breadcrumbs` | `lx-breadcrumbs` | ✅ |
| CommandMenu | `app-command-palette` | ⬜ | ⬜ | 🔷 |
| ContextMenu | `app-context-menu` (refactor) | `ili-context-menu` (long-press) | `lx-context-menu` | ✅ |
| Dock | `app-dock` (refactor) | `ili-dock` | `lx-dock` | ✅ |
| MegaMenu | `app-mega-menu` (refactor) | `ili-mega-menu` (accordion-style) | `lx-mega-menu` | ✅ |
| Menu | (usamos en features) | ⬜ | — | 🔷 |
| Menubar | `app-menubar` | `ili-menubar` (hamburger) | `lx-menubar` | ✅ |
| Sidebar | `app-sidebar` | `ili-sidebar` (overlay) | `lx-sidebar` | ✅ |
| Stepper | `app-wizard` (refactor) | `ili-stepper` | `lx-stepper` | ✅ |
| Tabs | `app-tabs` | `ili-tabs` | `lx-tabs` | ✅ |
| TieredMenu | ⬜ | ⬜ | — | ⬜ |

---

## 7. MESSAGES — PrimeNG (2)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| Message | ⬜ (usamos Toast) | ⬜ | — | ⬜ |
| Toast | `app-primeng-custom-toast` | ⬜ | — | 🔷 |

---

## 8. MEDIA — PrimeNG (3)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| Carousel | ⬜ | ⬜ | — | ⬜ |
| Gallery | ⬜ | ⬜ | — | ⬜ |
| Compare | `app-comparison-table` | ⬜ | — | 🔷 |

---

## 9. FILE — PrimeNG (1)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| FileUpload | `app-file-upload` / `custom-input-file-signal` / `custom-input-upload-pdf-signal` | `ion-input-file` | ⬜ | 🔷 |

---

## 10. MISC — PrimeNG (20)

| Componente | Web | Mobile | Adaptive | Estado |
|------------|:---:|:------:|:--------:|:------:|
| AnimateOnScroll | ⬜ | ⬜ | — | ⬜ |
| AutoFocus | ⬜ (nativo Angular) | ⬜ | — | ⚪ |
| Avatar | `app-avatar-group` | ⬜ | — | 🔷 |
| Badge | `app-badge` | `ili-badge` | `lx-badge` | ✅ |
| Bind | ⬜ | ⬜ | — | ⬜ |
| BlockUI | ⬜ | ⬜ | — | ⬜ |
| Chip | `app-chip` | `ili-chip` | `lx-chip` | ✅ |
| ClassNames | ⬜ | ⬜ | — | ⬜ |
| Fluid | ⬜ | ⬜ | — | ⬜ |
| FocusTrap | `[appFocusTrap]` | ⬜ | — | 🔷 |
| Inplace | ⬜ | ⬜ | — | ⬜ |
| MeterGroup | ⬜ (usamos Gauge) | ⬜ | — | ⬜ |
| ProgressBar | `app-progress-bar` | `ili-progress-bar` | `lx-progress-bar` | ✅ |
| ProgressSpinner | `app-spinner` | `ili-spinner` | `lx-spinner` | ✅ |
| Ripple | ⬜ (global PrimeNG) | ⬜ | — | ⚪ |
| ScrollTop | ⬜ | `ili-tap-to-top` | — | 🔶 |
| Skeleton | `app-skeleton-presets` | ⬜ | — | 🔷 |
| StyleClass | ⬜ | ⬜ | — | ⬜ |
| Tag | (usamos en status-badge, contact-card, profile-card) | (usamos en status-badge) | — | 🔷 |
| Terminal | ⬜ | ⬜ | — | ⬜ |

---

## 11. IONIC — Componentes específicos mobile (sin equivalente PrimeNG directo)

| Componente | Mobile (ili-*) | Web (app-*) | Adaptive | Estado |
|------------|:--------------:|:-----------:|:--------:|:------:|
| Action Sheet | `ili-action-menu` (CDK Overlay) | `app-action-menu` (p-popover) | `lx-action-sheet` | ✅ |
| Bottom Nav | `ili-bottom-nav` | `app-bottom-nav` (p-tabMenu) | `lx-bottom-nav` | ✅ |
| Data View Mobile | `app-data-view-mobile` | ⬜ | — | 🔶 |
| Global Error Alert | `ili-global-error-alert` | `app-global-error-alert` (p-message) | `lx-global-error-alert` | ✅ |
| Infinite Scroll | `ili-infinite-scroll` (IonInfiniteScroll) | `app-infinite-scroll` (IntersectionObserver) | `lx-infinite-scroll` | ✅ |
| Loader | `ili-loader` | `app-loader` | `lx-loader` | ✅ |
| Offline Indicator | `ili-offline-indicator` | `app-offline-indicator` | `lx-offline-indicator` | ✅ |
| Pull to Refresh | `ili-pull-to-refresh` (touch) | `app-pull-to-refresh` (mouse) | `lx-pull-to-refresh` | ✅ |
| Searchbar | `app-data-view-mobile` | `custom-search-input-signal` | — | 🔷 |
| Swipe Actions | `ili-swipe-actions` (touch) | `app-swipe-actions` (mouse) | `lx-swipe-actions` | ✅ |
| Tab Bar | `ili-tab-bar` | ⬜ | — | 🔶 |
| Tap to Top | `ili-tap-to-top` | `app-scroll-top` (p-scrollTop) | `lx-scroll-top` | ✅ |

---

## 12. COMPONENTES AGNÓSTICOS (ya funcionan en ambas plataformas)

| Componente | Selector | Notas |
|------------|----------|-------|
| ActionIconsGroup | `app-action-icons-group` | Solo layout flex |
| ActivityLog | `app-activity-log` | Timeline visual, sin framework |
| AppIcon | `app-icon` | Wrapper de Iconify — universal |
| ApprovalWorkflow | `app-approval-workflow` | CSS puro |
| AvatarGroup | `app-avatar-group` | CSS puro |
| FocusTrap | `[appFocusTrap]` | Directive, sin UI |
| Gauge | `app-gauge` | SVG puro |
| InventoryLevel | `app-inventory-level` | CSS puro |
| KpiCard | `app-kpi-card` | CSS puro |
| LeadScoring | `app-lead-scoring` | CSS puro |
| LiveRegionAnnouncer | servicio | a11y |
| OrderStatus | `app-order-status` | CSS puro |
| RealtimeIndicator | `app-realtime-indicator` | CSS puro |
| StatCard | `app-stat-card` | CSS puro |
| Tour | `app-tour` | CDK Overlay |
| TristateSwitch | `app-tristate-switch` | CSS puro |
| PrintableDirective | `[appPrintable]` | Directive |
| PaginationCommonDTO | modelo | TypeScript |

---

## 13. SISTEMA DE INPUTS — Estado completo

### Web → Mobile → Adaptive bridge

| Input | Web (PrimeNG) | Mobile (Ionic) | Adaptive bridge | Estado |
|-------|:-------------:|:--------------:|:---------------:|:------:|
| Text | ✅ web-input-text | ✅ ion-input-text | ✅ custom-input-text-signal | ✅ |
| Number | ✅ web-input-number | ✅ ion-input-number | ✅ custom-input-number-signal | ✅ |
| Select | ✅ web-input-select | ✅ ion-input-select | ✅ custom-input-select-signal | ✅ |
| Checkbox | ✅ web-input-check | ✅ ion-input-checkbox | ✅ custom-input-check-signal | ✅ |
| Textarea | ✅ web-input-textarea | ✅ ion-input-textarea | ✅ custom-input-textarea-signal | ✅ |
| Password | ✅ custom-input-password-signal | ✅ ion-input-password | ⬜ | 🔷 |
| Date | ✅ custom-input-date-signal | ✅ ion-input-date | ⬜ | 🔷 |
| DateTime | ✅ custom-input-date-time-signal | ⬜ | ⬜ | 🔷 |
| Time | ✅ custom-input-time-signal | ✅ ion-input-time | ⬜ | 🔷 |
| Currency | ✅ custom-input-currency-signal | ✅ ion-input-currency | ⬜ | 🔷 |
| Decimal | ✅ custom-input-decimal-signal | ⬜ | ⬜ | 🔷 |
| Mask | ✅ custom-input-mask-signal | ⬜ | ⬜ | 🔷 |
| Multiselect | ✅ custom-input-multiselect-signal | ✅ ion-input-multiselect | ⬜ | 🔷 |
| SelectBool | ✅ custom-input-select-bool-signal | ✅ ion-input-select-bool | ⬜ | 🔷 |
| Switch | ✅ custom-input-switch-signal | ⬜ | ⬜ | 🔷 |
| ToggleSwitch | ✅ custom-input-toggle-switch-signal | ✅ ion-input-toggle | ⬜ | 🔷 |
| File | ✅ custom-input-file-signal | ✅ ion-input-file | ⬜ | 🔷 |
| Upload PDF | ✅ custom-input-upload-pdf-signal | ⬜ | ⬜ | 🔷 |
| Img | ✅ custom-input-img-signal | ⬜ | ⬜ | 🔷 |
| URL | ✅ custom-input-url-signal | ⬜ | ⬜ | 🔷 |
| Phone Prefix | ✅ custom-input-phone-prefix | ⬜ | ⬜ | 🔷 |
| Search | ✅ custom-search-input-signal | ✅ ion-input-search | ⬜ | 🔷 |
| Hour | ✅ custom-input-hour-signal | ⬜ | ⬜ | 🔷 |
| Month | ✅ custom-input-month-signal | ⬜ | ⬜ | 🔷 |
| DatePicker | ✅ custom-input-datepicker-signal | ⬜ | ⬜ | 🔷 |
| SelectButton | ✅ custom-input-select-button-signal | ⬜ | ⬜ | 🔷 |
| SelectPrefix | ✅ custom-input-select-prefix-signal | ⬜ | ⬜ | 🔷 |
| NgSelect | ✅ custom-input-ng-select-signal | ⬜ | ⬜ | 🔷 |
| AutoComplete | ✅ custom-input-autocomplete-signal | ⬜ | ⬜ | 🔷 |
| AutoCompleteMultiple | ✅ custom-input-autocomplete-multiple-signal | ⬜ | ⬜ | 🔷 |
| DateTimeNative | ✅ custom-input-date-time-native | ⬜ | ⬜ | 🔷 |

---

## 14. SISTEMA DE BOTONES — Estado completo

| Categoría | Web label+icon | Web icon-only | Mobile label+icon | Mobile icon-only |
|-----------|:--------------:|:-------------:|:-----------------:|:----------------:|
| Genérico | ✅ il-button | ✅ iw-button | ✅ ili-button | ✅ ii-button |
| Add | ✅ il-button-add | ✅ iw-button-add | ✅ ili-button-add | ✅ ii-button-add |
| Edit | ✅ il-button-edit | ✅ iw-button-edit | ✅ ili-button-edit | ✅ ii-button-edit |
| Delete | ✅ il-button-delete | ✅ iw-button-delete | ✅ ili-button-delete | ✅ ii-button-delete |
| Save | ✅ il-button-save | ✅ iw-button-save | ✅ ili-button-save | ✅ ii-button-save |
| Download | ✅ il-button-download | ✅ iw-button-download | ✅ ili-button-download | ✅ ii-button-download |
| Confirm | ✅ il-button-confirm | ✅ iw-button-confirm | ✅ ili-button-confirm | ✅ ii-button-confirm |
| Send Email | ✅ il-button-send-email | ✅ iw-button-send-email | ✅ ili-button-send-email | ✅ ii-button-send-email |
| View PDF | ✅ il-button-view-pdf | ✅ iw-button-view-pdf | ✅ ili-button-view-pdf | ✅ ii-button-view-pdf |
| Tracking | ✅ il-button-tracking | ✅ iw-button-tracking | ✅ ili-button-tracking | ✅ ii-button-tracking |
| Item | ✅ il-button-item | ✅ iw-button-item | ✅ ili-button-item | ✅ ii-button-item |
| Active/Desactive | ✅ il-button-active-desactive | ✅ iw-button-active-desactive | ✅ ili-button-active-desactive | ✅ ii-button-active-desactive |

**Botones: 48/48 — COMPLETO** ✅

---

## 15. GAP ANALYSIS — Prioridades

### Grado de completitud general

| Capa | Existentes | Pendientes | % |
|------|:----------:|:----------:|:-:|
| **PrimeNG web** (`app-*`) | ~55/93 | ~38 | 59% |
| **Ionic mobile** (`ili-*`) | ~27/37 familias | ~10 | 73% |
| **Adaptive bridge** (`lx-*`) | 17/17 wrappers prioritarios | +muchos | 100% (wrappers actuales) |
| **Inputs (web)** | 31/31 | 0 | 100% |
| **Inputs (mobile)** | 14/31 | 17 | 45% |
| **Inputs (adaptive)** | 14/31 | 17 | **45%** ↑ |
| **Skeleton** | web + mobile + adaptive | 0 | **100%** ✅ |
| **ProgressBar / Badge / Chip** | web + mobile + adaptive | 0 | **100%** ✅ |
| **Table / Paginator / TreeTable** | web + mobile + adaptive | 0 | **100%** ✅ |
| **DataView** | web + mobile | 0 | **100%** ✅ |
| **Buttons** | 48/48 | 0 | 100% |

---

## 16. PLAN DE IMPLEMENTACIÓN POR FASES

### FASE 1 — Core Components ya iniciados (completar triple implementación)
> Asignado: **opencode** · Esfuerzo: bajo · Impacto: alto · Prioridad: **CRÍTICA**

- ✅ `Password`: mobile `ion-input-password` existe → crear adaptive `lx-password` [opencode]
- ✅ `Date`: mobile `ion-input-date` existe → crear adaptive `lx-date` [opencode]
- ✅ `Time`: mobile `ion-input-time` existe → crear adaptive `lx-time` [opencode]
- ✅ `Currency`: mobile `ion-input-currency` existe → crear adaptive `lx-currency` [opencode]
- ✅ `Multiselect`: mobile `ion-input-multiselect` existe → crear adaptive `lx-multiselect` [opencode]
- ✅ `SelectBool`: mobile `ion-input-select-bool` existe → crear adaptive `lx-select-bool` [opencode]
- ✅ `ToggleSwitch`: mobile `ion-input-toggle` existe → crear adaptive `lx-toggle-switch` [opencode]
- ✅ `File`: mobile `ion-input-file` existe → crear adaptive `lx-file` [opencode]
- ✅ `Search`: mobile `ion-input-search` existe → crear adaptive `lx-search` [opencode]
- ⬜ `RadioButton` web: crear mobile `ion-input-radio` + adaptive
- ⬜ `SelectButton` web: crear mobile equivalent + adaptive
- ⬜ `ToggleButton` web: crear mobile equivalent + adaptive

### FASE 2 — Overlay & Feedback multiplataforma
> Asignado: **opencode** · Esfuerzo: medio · Impacto: alto · Prioridad: **ALTA**

- ✅ `Toast`: crear `ili-toast` (Ionic) + `lx-toast` adaptive [opencode]
- ✅ `Dialog/Modal`: crear `ili-modal` (IonModal) + `lx-modal` adaptive [opencode]
- ✅ `ConfirmPopup`: cubierto por ConfirmDialog [opencode]
- ✅ `Tooltip`: `ili-tooltip` (touch long-press) + `lxTooltip` directive [opencode]
- ✅ `ActionSheet` mobile: `lx-action-sheet` wrapper creado. Se mantiene CDK Overlay (decisión técnica: más flexible que ion-action-sheet) [opencode]
- ✅ `Loader/Spinner`: crear `app-loader` (PrimeNG) + adaptive [opencode]

### FASE 3 — Data display multiplataforma
> Asignado: **opencode** · Esfuerzo: alto · Impacto: muy alto · Prioridad: **ALTA** · **COMPLETADA** ✅

- ✅ `Skeleton` mobile: crear `ili-skeleton-presets` + `lx-skeleton` [opencode]
- ✅ `ProgressBar` adaptive: ya existía triple impl (base/web/mobile/adaptive) [opencode]
- ✅ `Badge` adaptive: ya existía triple impl (base/web/mobile/adaptive) [opencode]
- ✅ `Chip` adaptive: ya existía triple impl (base/web/mobile/adaptive) [opencode]
- ✅ `Table` mobile: crear `ili-table` (versión mobile de p-table con tarjetas en lugar de filas) + `base/table.base.ts` + `lx-table` [opencode]
- ✅ `DataView` web: crear `app-data-view` (web) sincronizado con `app-data-view-mobile` [opencode]
- ✅ `Paginator` mobile: crear `ili-paginator` + `base/paginator.base.ts` + `lx-paginator` [opencode]
- ✅ `TreeTable` mobile: crear `ili-tree-table` + `base/tree-table.base.ts` + `lx-tree-table` [opencode]

### FASE 4 — Menús & Navegación multiplataforma
> Esfuerzo: medio · Impacto: medio · Prioridad: **MEDIA** · **COMPLETADA** ✅

- [x] `Menu/Menubar` mobile: crear `ili-menubar` (hamburger) + `lx-menubar` + `app-menubar` (PrimeNG) + `base/menubar.base.ts`
- [x] `Sidebar` mobile: crear `ili-sidebar` (overlay panel) + `lx-sidebar` + `app-sidebar` (PrimeNG) + `base/sidebar.base.ts`
- [x] `MegaMenu` mobile: crear `ili-mega-menu` (accordion-style) + `lx-mega-menu` + refactor `app-mega-menu` → `MegaMenuBase` + `base/mega-menu.base.ts`
- [x] `ContextMenu` mobile: crear `ili-context-menu` (long-press) + `lx-context-menu` + refactor `app-context-menu` → `ContextMenuBase` + `base/context-menu.base.ts`
- [x] `Dock` mobile: crear `ili-dock` + `lx-dock` + refactor `app-dock` → `DockBase` + `base/dock.base.ts`
- [x] `Tabs` adaptive: crear `lx-tabs` + `app-tabs` (PrimeNG TabView) + `ili-tabs` + `base/tabs.base.ts`
- [x] `Accordion` mobile: crear `ili-accordion` + `lx-accordion` + `app-accordion` (PrimeNG) + `base/accordion.base.ts`
- [x] `Stepper` mobile: crear `ili-stepper` + `lx-stepper` + refactor `app-wizard` → `StepperBase` + `base/stepper.base.ts`

### FASE 5 — Form inputs restantes (mobile)
> Esfuerzo: medio · Impacto: medio · Prioridad: **MEDIA**

- [ ] `DateTime` mobile: crear `ion-input-date-time` + adaptive
- [ ] `Month` mobile: crear `ion-input-month` + adaptive
- [ ] `Hour` mobile: crear `ion-input-hour` + adaptive
- [ ] `Decimal` mobile: crear `ion-input-decimal` + adaptive (o reusar Number)
- [ ] `Mask` mobile: crear `ion-input-mask` + adaptive
- [ ] `DatePicker` mobile: crear `ion-input-datepicker` + adaptive
- [ ] `AutoComplete` mobile: crear `ion-input-autocomplete` + adaptive
- [ ] `AutoCompleteMultiple` mobile: crear `ion-input-autocomplete-multiple` + adaptive
- [ ] `UploadPdf` mobile: crear `ion-input-upload-pdf` + adaptive
- [ ] `Img` mobile: crear `ion-input-img` + adaptive
- [ ] `URL` mobile: crear `ion-input-url` + adaptive
- [ ] `PhonePrefix` mobile: crear `ion-input-phone-prefix` + adaptive
- [ ] `SelectPrefix` mobile: crear `ion-input-select-prefix` + adaptive
- [ ] `NgSelect` mobile: crear `ion-input-ng-select` + adaptive

### FASE 6 — Componentes especializados
> Esfuerzo: alto · Impacto: bajo · Prioridad: **BAJA**

- [ ] `Carousel` web + mobile + adaptive
- [ ] `Gallery` web + mobile + adaptive
- [ ] `OrgChart` web + mobile + adaptive
- [ ] `OrderList` web + mobile + adaptive
- [ ] `PickList` web + mobile + adaptive
- [ ] `Tree` web + mobile + adaptive
- [ ] `VirtualScroller` web + mobile + adaptive
- [ ] `Knob` web + mobile + adaptive
- [ ] `CascadeSelect` web + mobile + adaptive
- [ ] `TreeSelect` web + mobile + adaptive
- [ ] `MeterGroup` web + mobile + adaptive
- [ ] `BlockUI` web + mobile + adaptive
- [ ] `InputGroup` web + mobile + adaptive
- [ ] `AnimateOnScroll` web + mobile + adaptive
- [ ] `Inplace` web + mobile + adaptive
- [ ] `Terminal` web + mobile + adaptive
- [ ] `Fluid` web + mobile + adaptive
- [ ] `StyleClass` web + mobile + adaptive

### FASE 7 — Componentes mobile-only con backport a web
> Esfuerzo: medio · Impacto: medio · Prioridad: **BAJA**

- [x] `PullToRefresh` web: `app-pull-to-refresh` (mouse events) + `ili-pull-to-refresh` (mobile refactor) + `lx-pull-to-refresh`
- [x] `SwipeActions` web: `app-swipe-actions` (mouse events) + `ili-swipe-actions` (mobile refactor) + `lx-swipe-actions`
- [x] `InfiniteScroll` web: `app-infinite-scroll` (IntersectionObserver) + `ili-infinite-scroll` (IonInfiniteScroll) + `lx-infinite-scroll`
- [x] `OfflineIndicator` web: `app-offline-indicator` + `ili-offline-indicator` (mobile refactor) + `lx-offline-indicator`
- [x] `TapToTop` web: `app-scroll-top` (p-scrollTop) + `ili-tap-to-top` (mobile refactor) + `lx-scroll-top`
- [x] `BottomNav` web: `app-bottom-nav` (p-tabMenu) + `ili-bottom-nav` (mobile refactor) + `lx-bottom-nav`
- [x] `GlobalErrorAlert` web: `app-global-error-alert` (p-message) + `ili-global-error-alert` (mobile refactor) + `lx-global-error-alert`

---

## 17. MÉTRICA OBJETIVO

| Fase | Componentes nuevos | Adaptive wrappers nuevos | % acumulado catálogo completo |
|:----:|:------------------:|:-----------------------:|:----------------------------:|
| Hoy | — | 17 | ~40% |
| F1 | 9 ✅ | 9 ✅ | **~49%** |
| F3 | 4 ✅ | +4 ❌ ya existían | **~52%** |
| F2 | 6 ✅ | 6 ✅ | **~55%** ✅ |
| F3 | 6 ✅ | 6 ✅ | **~62%** ✅ |
| F4 | 8 ✅ | 8 ✅ | **~70%** ✅ |
| F5 | 14 | 14 | ~82% |
| F6 | 18 | 18 | ~95% |
| F7 | 7 ✅ | 7 ✅ | **100%** ✅ |

---

## 18. PRINCIPIOS DE IMPLEMENTACIÓN

1. **Base primero**: siempre crear/extender `*.base.ts` con `@Directive()` abstracta antes que cualquier template
2. **Web con PrimeNG**, **Mobile con Ionic**, **Adaptive con `lx-*`** — no mezclar
3. **Standalone siempre** — no crear NgModules nuevos
4. **CSS vía `--ds-*` tokens** — ni hex, ni rgba (excepto excepciones documentadas en AGENTS.md)
5. **Iconos vía `app-icon`** — no `ion-icon`, no `pi` directo
6. **Tests por componente** — al menos `.spec.ts` básico
7. **`PlatformService.isMobile()`** es la única fuente de verdad para el dispatch

# PLAN DE ACCIÓN PROGRESIVO — LuxuryApp Design System

> Plan basado en la auditoría completa (`AUDITORIA-COMPLETA.md`).
> Cada paso está verificado para ejecución secuencial. Marca con `[x]` al completar.

---

## ⚡ FASE 0 — PREPARACIÓN (30 min)

### 0.1 Backup de estado actual
- [x] `git checkout -b fix/ds-audit-phase0`
- [x] `git add -A && git commit -m "backup pre-audit"`

### 0.2 Verificar estructura de archivos crítica
- [x] Confirmar que `src/styles/theme/_variables.scss` existe y es el source of truth
- [x] Confirmar que `src/styles/primeng-overrides.css` no está referenciado en `angular.json` (si lo está, marcar para migración)
- [x] Confirmar que `src/styles/ds-entry.scss` es el entry point del DS

---

## 🔴 FASE 1 — CORRECCIONES CRÍTICAS (Accesibilidad y Datos Huérfanos)

### 1.1 Migrar variables `--brand-*` huérfanas → `--ds-*`
**Archivo:** `src/styles/primeng-overrides.css`
- [x] Identificar todas las `--brand-*` en el archivo (28 ocurrencias)
- [x] Mapear cada una a su equivalente `--ds-*`:
  - `--brand-primary` → `--ds-primary`
  - `--brand-primary-hover` → `--ds-primary-hover`
  - `--brand-primary-contrast` → `--ds-primary-text`
  - `--brand-primary-active` → `--ds-primary-active`
  - `--brand-font-sans` → `--ds-font-family-base`
  - `--brand-font-size-sm` → `--ds-font-size-body`
  - `--brand-font-size-xs` → `--ds-font-size-micro`
  - `--brand-font-size-lg` → `--ds-font-size-card-title`
  - `--brand-radius-btn` → `--ds-radius-btn`
  - `--brand-radius-input` → `--ds-radius-input`
  - `--brand-radius-card` → `--ds-radius-card`
  - `--brand-radius-overlay` → `--ds-radius-modal`
  - `--brand-border` → `--ds-border`
  - `--brand-border-strong` → `--ds-border-strong`
  - `--brand-border-focus` → `--ds-border-focus`
  - `--brand-bg-sunken` → `--ds-bg-sunken`
  - `--brand-bg-surface` → `--ds-bg-surface`
  - `--brand-bg-overlay` → `--ds-bg-overlay`
  - `--brand-text-primary` → `--ds-text-primary`
  - `--brand-text-secondary` → `--ds-text-secondary`
  - `--brand-text-disabled` → `--ds-text-disabled`
  - `--brand-success` → `--ds-success`
  - `--brand-success-bg` → `--ds-success-light`
  - `--brand-success-text` → `--ds-success`
  - `--brand-danger` → `--ds-danger`
  - `--brand-danger-bg` → `--ds-danger-light`
  - `--brand-danger-text` → `--ds-danger`
  - `--brand-warning-bg` → `--ds-warning-light`
  - `--brand-warning-text` → `--ds-warning`
  - `--brand-info-bg` → `--ds-info-light`
  - `--brand-info-text` → `--ds-info`
  - `--brand-transition-base` → `--ds-transition-base`
  - `--brand-transition-fast` → `--ds-transition-fast`
  - `--brand-shadow-xl` → `--ds-shadow-xl`
  - `--brand-shadow-sm` → `--ds-shadow-sm`
  - `--brand-shadow-lg` → `--ds-shadow-lg`
  - `--brand-shadow-focus` → `--ds-shadow-focus`
- [x] Reemplazar todas las ocurrencias en `primeng-overrides.css`
- [x] Verificar que no queda ningún `--brand-` en el archivo

### 1.2 Validar contraste de Luxury Gold
**Archivo:** `src/styles/theme/_variables.scss`
- [x] Buscar usos de `--ds-luxury-gold` para texto en templates (grep)
- [x] Si se usa como color de texto, reemplazar con `#b8953a` (ratio 4.6:1)
- [x] Si solo es decorativo (bordes, fondos, iconos grandes), mantener `#c9a84c`
- [x] Añadir comentario: `/* ⚠️ Solo para uso decorativo — no usar en texto < 18px bold */`

### 1.3 Reemplazar colores hardcodeados en global.scss
**Archivo:** `src/styles/theme/_global.scss`
- [x] `.bg-status-total` → usar `--ds-primary` o `--ds-info`
- [x] `.bg-status-success` → usar `--ds-success`
- [x] `.bg-status-pending` → usar `--ds-warning`
- [x] `.bg-status-rejected` → usar `--ds-danger`

### 1.4 Validar contraste de Document Neutral
**Archivo:** `src/styles/theme/_variables.scss`
- [x] Cambiar `--ds-document-neutral: #6b7280` a `#5b6778` (pasa AA 5.0:1)
- [x] O añadir restricción: solo usar para texto ≥ 14px bold

### 1.5 Commit Fase 1
- [x] `git add -A && git commit -m "fix: migrate brand tokens, fix gold contrast, replace hardcoded colors"`

---

## 🟡 FASE 2 — CONSISTENCIA CROSS-PLATFORM (Tipografía y Tema)

### 2.1 Unificar fuente tipográfica (Inter + Hanken Grotesk como estándar)
**Archivo:** `src/styles/core/_typography.scss`
- [x] Confirmar `$font-family-base: 'Inter', 'Hanken Grotesk', sans-serif`
- [x] Confirmar `$font-family-heading: 'Hanken Grotesk', 'Inter', sans-serif`
- [x] Confirmar `$font-family-mono: 'JetBrains Mono', 'Roboto Mono', monospace`

**Archivo:** `src/styles/theme/_variables.scss`
- [x] Verificar `--ds-font-family-base` coincide con core
- [x] Verificar `--ds-font-family-mono` coincide con core

**Archivo:** `src/app/features/system/catalogs/catalog-component-ui/shared/tokens-typography/tokens-typography.ts`
- [x] Cambiar display de "DM Sans" a "Inter" en `families` array
- [x] Actualizar ejemplo de preview para reflejar Inter

### 2.2 Alinear Ionic font-family con DS
**Archivo:** `src/styles/theme/_ionic-rn-theme.scss`
- [x] Cambiar `--ion-font-family` de system stack a `var(--ds-font-family-base)`

### 2.3 Unificar Dark Mode de Ionic con DS principal
**Archivo:** `src/styles/theme/_ionic-rn-theme.scss`
- [x] En `body.theme-dark {}` dentro de ionic-rn-theme, cambiar:
  - `--ion-background-color: #000000` → `var(--ds-bg-page)`
  - `--ion-text-color: #ffffff` → `var(--ds-text-primary)`
  - `--ion-item-background: #1c1c1e` → `var(--ds-bg-surface)`
  - `--ion-card-background: #1c1c1e` → `var(--ds-bg-surface)`
  - `--ion-item-border-color: #38383a` → `var(--ds-border)`
  - `--ion-border-color: #38383a` → `var(--ds-border)`
  - `--ion-toolbar-background` → `var(--ds-bg-elevated)`

### 2.4 Aumentar body text a 16px
**Archivo:** `src/styles/theme/_variables.scss`
- [x] Cambiar `--ds-font-size-body: 0.9375rem` → `clamp(0.9375rem, 1.5vw, 1rem)`
- [x] Verificar que no hay componentes que dependan de 15px exacto (grep `0.9375rem`)

### 2.5 Implementar tipografía responsive con clamp()
**Archivo:** `src/styles/theme/_variables.scss`
- [x] `--ds-font-size-display: clamp(1.75rem, 4vw, 2.5rem)`
- [x] `--ds-font-size-page-title: clamp(1.25rem, 3vw, 1.75rem)`
- [x] `--ds-font-size-section-title: clamp(1.125rem, 2vw, 1.25rem)`
- [x] `--ds-font-size-metric: clamp(1.25rem, 3vw, 1.5rem)`

### 2.6 Commit Fase 2
- [x] `git add -A && git commit -m "fix: unify typography to Inter+Hanken, align Ionic dark mode, add responsive type"`

---

## 🟡 FASE 3 — COMPONENTES AUSENTES DE ALTA PRIORIDAD

### 3.1 Crear componente `app-empty-state`
**Archivo:** `src/app/core/components/empty-state/`
- [x] Crear `empty-state.ts` (standalone) con inputs:
  - `icon: string` — icono MDI
  - `title: string` — título del estado vacío
  - `message: string` — descripción
  - `actionLabel: string` — texto del CTA
  - `actionIcon: string` — icono del botón
  - `actionSeverity: string` — severidad del botón
- [x] Componente standalone importado directamente por ruta
- [x] Añadir al catálogo en `catalog-component-ui.ts`

### 3.2 Crear componente `app-confirm-dialog`
**Archivo:** `src/app/core/components/confirm-dialog/`
- [x] Crear `confirm-dialog.ts` (standalone) con inputs:
  - `visible: boolean`
  - `title: string`
  - `message: string`
  - `type: 'danger' | 'warning' | 'info' | 'success'`
  - `confirmLabel: string`
  - `cancelLabel: string`
  - `icon: string`
  - Outputs: `confirm`, `cancel`
- [x] Usar `p-dialog` internamente con color mapping según type
- [x] Añadir focus trap automático (nativo de p-dialog)
- [x] Componente standalone importado directamente por ruta

### 3.3 Mejorar StatusBadge con soporte de daltonismo
**Archivo:** `src/app/core/components/status-badge/`
- [x] Añadir input `showIcon: boolean`
- [x] Mapear cada estado a un icono MDI específico:
  - Concluido → `mdi:check-circle`
  - Pendiente → `mdi:clock-outline`
  - Proceso → `mdi:progress-check`
  - Cancelado → `mdi:cancel`
  - noAutorizado → `mdi:block-helper`
- [x] Mostrar icono siempre junto al color

### 3.4 Crear componente `app-date-range`
**Archivo:** `src/app/core/components/date-range/`
- [x] Crear `date-range.ts`
- [x] Wrapper sobre dos inputs date con validación de rango
- [x] Presets de rango rápido

### 3.5 Commit Fase 3
- [x] `git add -A && git commit -m "feat: add empty-state, confirm-dialog, date-range components; improve status-badge a11y"`

---

## 🟢 FASE 4 — OPTIMIZACIONES UX

### 4.1 Añadir max-width a párrafos
**Archivo:** `src/styles/core/_typography.scss`
- [x] Añadir clase `.text-container { max-width: 65ch; }`
- [x] Añadir `p { max-width: 65ch; }` como estilo base (o clase opt-in)

### 4.2 Mejorar feedback visual de estados disabled
**Archivo:** `src/styles/prime-overrides/_prime-input.scss` (o global)
- [x] Añadir `font-style: italic` para inputs disabled
- [x] Añadir `cursor: not-allowed`
- [x] Mantener `opacity: 0.55`

### 4.3 Unificar border-radius (eliminar dualidad 4px vs 0.25rem)
**Archivo:** `src/styles/theme/_variables.scss`
- [x] Asegurar que `--ds-radius-md` es `6px` (valor único)
- [x] Asegurar que `--ds-radius-sm` es `4px`
- [x] Asegurar que `--ds-radius-lg` es `8px`
- [x] Verificar que `core/_borders.scss` y `theme/_variables.scss` no divergen

### 4.4 Mapear Material 3 roles en componentes PrimeNG
**Archivo:** `src/styles/prime-overrides/_prime-tokens.scss`
- [x] `--p-primary-container-background: var(--ds-primary-container)`
- [x] `--p-secondary-color: var(--ds-secondary)`
- [x] `--p-tertiary-color: var(--ds-tertiary)`
- [x] `--p-surface-variant: var(--ds-surface-variant)`

### 4.5 Commit Fase 4
- [x] `git add -A && git commit -m "feat: improve a11y disabled states, unify border-radius, map M3 roles"`

---

## 🧩 FASE 5 — COMPONENTES NUEVOS (Prioridad Media)

### 5.1 Notification Center
**Archivo:** `src/app/core/components/notification-center/`
- [x] Campana con badge de cantidad no leída
- [x] Dropdown con lista de notificaciones
- [x] Acción de marcar como leída
- [x] Soporte web + mobile

### 5.2 Multi-step Wizard / Stepper
**Archivo:** `src/app/core/components/wizard/`
- [x] Steps navegables con estado (completed, active, pending)
- [x] Validación por paso
- [x] Template transcluido por paso

### 5.3 File Upload Avanzado
**Archivo:** `src/app/core/components/file-upload/`
- [x] Drag & drop zone
- [x] Preview de imágenes
- [x] Barra de progreso
- [x] Eliminar archivos individuales
- [x] Soporte mobile (cámara + galería) — ✅ confirmado en AUDITORIA (capture="environment" + galería)

### 5.4 Commit Fase 5
- [x] `git add -A && git commit -m "feat: add notification-center, wizard, file-upload components"`

---

### Hallazgos post-rebarrido ANALISIS-PROMPT.md
- [x] Ionic theme migrado a DS tokens (`_ionic-rn-theme.scss` — 0 colores hardcodeados)
- [x] Componentes nuevos registrados en el catálogo visual (catalog-component-ui)
- [x] Platform detection service exists (`src/app/core/services/platform.service.ts`)
- [x] NotificationCenter migrado de OverlayPanel (deprecated) a Popover
- [x] confirm-dialog header trasparente corregido (ng-deep → `background: var(--ds-bg-surface)`)
- [x] Wizard SCSS cambiado a estilos globales (`:host` → selectores de clase)
- [x] page-title-report agregado input `icon` opcional
- [x] `scripts/audit-encoding.mjs` agregado (lint reparado)
- [x] StatusBadge migrado de p-tag a layout personalizado con AppIcon

## ✅ CHECKLIST GLOBAL DE VERIFICACIÓN

### Accesibilidad
- [x] Luxury Gold no se usa para texto < 18px bold
- [x] Document Neutral #5b6778 pasa AA
- [x] Skip navigation link presente en layouts principales (verificado en `global.scss:16`)
- [x] Focus trap en todos los modales/dialogs (nativo en p-dialog)
- [x] StatusBadge muestra icono + color (custom layout con app-icon + DS tokens)
- [x] Estados disabled tienen font-style: italic + cursor: not-allowed

### Consistencia Cross-Platform
- [x] `--brand-*` migradas a `--ds-*` (0 ocurrencias de --brand-)
- [x] Ionic usa `--ds-font-family-base`
- [x] Dark mode Ionic unificado con DS principal
- [x] Body text ≥ 16px en todas las plataformas
- [x] Tipografía responsive con clamp() en headings

### Design Tokens
- [x] Sin colores hardcodeados en global.scss
- [x] Border-radius unificado (sin dualidad 4px/0.25rem)
- [x] Material 3 roles mapeados en PrimeNG bridge
- [x] Sin variables `--brand-*` en ningún archivo

### Componentes
- [x] `app-empty-state` creado + registrado en catálogo
- [x] `app-confirm-dialog` creado + registrado en catálogo
- [x] `app-date-range` creado + registrado en catálogo
- [x] `app-notification-center` creado (Popover, no OverlayPanel)
- [x] `app-wizard` creado + registrado en catálogo
- [x] `app-file-upload` creado + registrado en catálogo

### Verificación Técnica
- [x] `npm run build` sin errores
- [x] `npm run lint` sin errores (se agregó `scripts/audit-encoding.mjs`)
- [ ] Revisión visual: light mode + dark mode
- [ ] Revisión visual: web (1920px) + mobile (375px)
- [ ] Revisión: componentes del catálogo UI siguen funcionando

### Hallazgos Post-Rebarrido Corregidos
- [x] Ionic theme migrado 100% a DS tokens
- [x] Componentes nuevos registrados en el catálogo visual
- [x] Platform detection service verificado
- [x] NotificationCenter migrado de OverlayPanel (deprecado) a Popover
- [x] confirm-dialog header trasparente corregido
- [x] Wizard SCSS cambiado a estilos globales
- [x] page-title-report con input `icon` agregado
- [x] Lint reparado (scripts/audit-encoding.mjs agregado)
- [x] StatusBadge reemplazó p-tag por layout personalizado con AppIcon

---

## 🎯 FASE 6 — COMPONENTES PENDIENTES (Próximos Pasos)

### 6.1 Alta Prioridad
- [x] **DataGrid editable** — `app-data-grid` (cell/row editing + virtual scroll + sort/filter/selection)
- [x] **Virtual scroll** — incluido en `DataGrid` (p-table virtualScroll)
- [x] **Tree table** jerárquica — `app-tree-table` (wrapper PrimeNG TreeTable)
- [x] **Autocomplete remoto** — `custom-input-remote-autocomplete-signal` (búsqueda asíncrona con searchFn)
- [x] **Transfer list** — `custom-input-transfer-list-signal` (wrapper PrimeNG PickList)
- [x] **Input mask MX presets** — `MX_MASKS` constants (teléfono, RFC, CURP, CP, etc.)
- [x] **Pipeline CRM / Deal stages** — ✅ `AppPipelineCrm` — implementado en Fase 9.1
- [x] **Activity logger** — `ActivityLog` (timeline CRM con grouped por fecha)
- [x] **Error boundary / Error state** — `ErrorBoundary` + `GlobalErrorHandler` (provider en app.config.ts)
- [x] **Kanban board** — `app-kanban-board` (drag & drop, CRM pipeline)
- [x] **File-upload soporte mobile** (cámara + galería + input nativo)
- [ ] **Empty states** en todas las listas existentes

### 6.2 Media Prioridad ✅ FASE 7 COMPLETADA
- [x] **Breadcrumbs dinámicos** — ✅ `Breadcrumbs`
- [x] **KPI / Metric cards** con tendencia — ✅ `KpiCard`
- [x] **Avatar group** (stacked para colaboración) — ✅ `AvatarGroup`
- [x] **Chart wrapper unificado** (línea, área, radar, donut) — ✅ `ChartWrapper`
- [x] **Command palette** (Ctrl+K, power user) — ✅ `CommandPalette`
- [x] **Context menu** (acciones rápidas en tablas) — ✅ `ContextMenu`
- [x] **Split pane / Resizable** (master-detail) — ✅ `SplitPane`
- [x] **Timeline** (activity feed / audit log visual) — ✅ `Timeline`
- [x] **Rich text editor** (wrapper reutilizable sobre Quill) — ✅ `RichTextEditor`
- [x] **Mega menu** (navegación ERP compleja) — ✅ `MegaMenu`
- [x] **Tour / Onboarding** (primera experiencia) — ✅ `Tour`
- [x] **Skeleton** por tipo de componente — ✅ `SkeletonPresets`
- [x] **Comparison table** (proveedores, presupuestos) — ✅ `ComparisonTable`

### 6.3 Baja Prioridad ✅ FASE 8 COMPLETADA (excepto Gantt)
- [x] **Gantt chart** (proyectos) — ✅ `AppGantt` — implementado en Fase 9.3
- [x] **Funnel chart** (CRM pipeline) — ✅ `FunnelChart`
- [x] **Dashboard layout builder** (drag & drop widgets) — ✅ `DashboardLayout`
- [x] **Invoice / Document previewer** (PDF inline) — ✅ `DocumentPreviewer`
- [x] **Approval workflow visualizer** (multi-paso) — ✅ `ApprovalWorkflow`
- [x] **Order status tracker** (seguimiento visual) — ✅ `OrderStatus`
- [x] **Lead scoring visual** (CRM) — ✅ `LeadScoring`
- [x] **Live region announcer** (WCAG 4.1.3) — ✅ `LiveRegionAnnouncer`
- [x] **Session timeout warning** (seguridad) — ✅ `SessionTimeout`
- [x] **Offline indicator** (mobile PWA) — ✅ `OfflineIndicator`
- [x] **Gauge / Speedometer** (KPIs visuales) — ✅ `Gauge`
- [x] **Pull to refresh** (mobile) — ✅ `PullToRefresh`
- [x] **Swipe actions** (mobile) — ✅ `SwipeActions`

---

## 🆕 FASE 9 — SEGUNDA RONDA (ANALISIS-PROMPT-V2)

> 28 componentes pendientes (29 identificados, pero `whats-new/` ya existe y cubre Changelog). Gantt también se incluye como pendiente de Fase 6.3. Pipeline CRM aparece en Fase 6.1 como pendiente — la implementación va aquí.

### 9.1 Alta Prioridad (RICE > 400) ✅ COMPLETADA

- [x] **Slider / Range slider** — ✅ `AppSlider` — `src/app/core/components/slider/slider.ts`
- [x] **Rating / Stars** — ✅ `AppRating` — `src/app/core/components/rating/rating.ts`
- [x] **OTP input** — ✅ `AppOtpInput` — `src/app/core/components/otp-input/otp-input.ts`
- [x] **Profile card / User card** — ✅ `AppProfileCard` — `src/app/core/components/profile-card/profile-card.ts`
- [x] **Theme switcher** — ✅ `AppThemeSwitcher` — `src/app/core/components/theme-switcher/theme-switcher.ts`
- [x] **Pipeline / Deal stages (CRM)** — ✅ `AppPipelineCrm` — `src/app/core/components/pipeline-crm/pipeline-crm.ts`

### 9.2 Media Prioridad ✅ COMPLETADA

- [x] **Tag/Chip system con autocomplete** — ✅ `AppTagInput` — `src/app/core/components/tag-input/tag-input.ts`
- [x] **Contact card con acciones rápidas** — ✅ `AppContactCard` — `src/app/core/components/contact-card/contact-card.ts`
- [x] **Bottom navigation (mobile)** — ✅ `AppBottomNav` — `src/app/core/components/bottom-nav/bottom-nav.ts`
- [x] **Tab bar (mobile)** — ✅ `AppTabBar` — `src/app/core/components/tab-bar/tab-bar.ts`
- [x] **Stat cards con sparklines** — ✅ `AppStatCard` — `src/app/core/components/stat-card/stat-card.ts`
- [x] **Changelog / What's new modal** — ✅ `whats-new/` ya existe en `src/app/core/components/whats-new/`
- [x] **Customer 360 view layout** — ✅ `AppCustomer360` — `src/app/core/components/customer-360/customer-360.ts`
- [x] **Print-friendly view wrapper** — ✅ `AppPrintView` — `src/app/core/components/print-view/print-view.ts`
- [x] **Language/region selector** — ✅ `AppLangSelector` — `src/app/core/components/lang-selector/lang-selector.ts`
- [x] **Comment thread / Discussion** — ✅ `AppCommentThread` — `src/app/core/components/comment-thread/comment-thread.ts`
- [x] **Email template previewer** — ✅ `AppEmailPreview` — `src/app/core/components/email-preview/email-preview.ts`

### 9.3 Baja Prioridad ✅ COMPLETADA

- [x] **Form builder dinámico (JSON/schema)** — ✅ `AppFormBuilder` — `src/app/core/components/form-builder/form-builder.ts`
- [x] **Signature pad** — ✅ `AppSignaturePad` — `src/app/core/components/signature-pad/signature-pad.ts`
- [x] **Color picker** — ✅ `AppColorPicker` — `src/app/core/components/color-picker/color-picker.ts`
- [x] **Toggle switch con estados intermedios** — ✅ `AppTristateSwitch` — `src/app/core/components/tristate-switch/tristate-switch.ts`
- [x] **Dock / Toolbar personalizable** — ✅ `AppDock` — `src/app/core/components/dock/dock.ts`
- [x] **QR code generator/viewer** — ✅ `AppQrCode` — `src/app/core/components/qr-code/qr-code.ts` (lib: `qrcode`)
- [x] **Heatmap** — ✅ `AppHeatmap` — `src/app/core/components/heatmap/heatmap.ts` (SVG/CSS puro)
- [x] **Real-time data indicator** — ✅ `AppRealtimeIndicator` — `src/app/core/components/realtime-indicator/realtime-indicator.ts`
- [x] **Inventory level indicator (ERP)** — ✅ `AppInventoryLevel` — `src/app/core/components/inventory-level/inventory-level.ts`
- [x] **Receipt/PO scanner (mobile)** — ✅ `AppReceiptScanner` — `src/app/core/components/receipt-scanner/receipt-scanner.ts`
- [x] **Barcode/QR lookup input** — ✅ `AppBarcodeInput` — `src/app/core/components/barcode-input/barcode-input.ts` (BarcodeDetector API)
- [x] **Territory map (CRM)** — ✅ `AppTerritoryMap` — `src/app/core/components/territory-map/territory-map.ts`
- [x] **Barcode scanner (mobile)** — ✅ `AppBarcodeScanner` — `src/app/core/components/barcode-scanner/barcode-scanner.ts`
- [x] **Gantt chart** — ✅ `AppGantt` — `src/app/core/components/gantt/gantt.ts` (SVG puro)

### 9.4 Commits Fase 9

- [x] `git commit -m "feat(ds): Slider, Rating, OTP, ProfileCard, ThemeSwitcher — fase 9 alta prioridad"`
- [x] `git commit -m "feat(ds): TagInput, ContactCard, BottomNav, StatCard, Changelog — fase 9 media"`
- [x] `git commit -m "feat(ds): PipelineCRM, Customer360, PrintView, LangSelector — fase 9 CRM/UX"`
- [x] `git commit -m "feat(ds): FormBuilder, SignaturePad, ColorPicker, Heatmap, Gantt — fase 9 baja"`

---

## 🆕 FASE 10 — ÚLTIMAS BRECHAS (ANALISIS-PROMPT-V2)

> Componentes identificados en el gap analysis original que ninguna fase anterior cubrió. Son los últimos 2 items + verificación de accesibilidad.

### 10.1 Pivot Table
**Archivo:** `src/app/core/components/pivot-table/pivot-table.ts`
- [x] **Pivot table** — tabla multidimensional con agrupación dinámica de filas/columnas, totales, drill-down. Necesario para reportes financieros y análisis de ventas CRM. ✅ `PivotTable`
  - Inputs: `data`, `rows` (PivotDimension[]), `columns` (PivotDimension), `values` (PivotValue[])
  - Soportes: sum/avg/count/min/max, formatos number/currency/percent
  - Drill-down: expandir/colapsar grupos por nivel jerárquico
  - Totales por fila, columna y gran total

### 10.2 Focus Trap Wrapper
**Archivo:** `src/app/core/components/focus-trap/focus-trap.ts`
- [x] **Focus trap standalone** — directive `[appFocusTrap]` para modales que no usen p-dialog (WCAG 2.1.2). ✅ `FocusTrap`
  - Selector: `[appFocusTrap]` — se aplica como atributo a cualquier contenedor
  - Input `active` — enable/disable dinámico
  - Atrapa tab/shift+tab entre el primer y último elemento focusable

### 10.3 Verificación Skip Navigation
- [x] **Skip navigation link** — ✅ VERIFICADO. Ya existe en `index.html:57-60` como `<a href="#app-root-outlet" class="skip-link">`. Target `#app-root-outlet` está en `app.html:4`. Cubre todos los layouts automáticamente (WCAG 2.4.1 compliant). No requiere cambios.

### 10.4 Commits Fase 10
- [ ] `git commit -m "feat(ds): PivotTable, FocusTrap, SkipNav verification — fase 10"`

---

---

## 📱 FASE 11 — INPUTS WEB: BRANCH MOBILE (Pendiente)

> Los componentes `CustomInput*Signal` en `inputs/web/` siempre renderizan PrimeNG incluso en mobile.  
> Los botones ya lo resuelven con `@if (platform.isMobile())` — los inputs deben seguir el mismo patrón.

### 11.1 Mapeo Web → Mobile

| Web (`inputs/web/`) | Mobile (`inputs/mobile/`) | Archivo |
|---|---|---|
| `CustomInputTextSignal` | `IonInputText` | `custom-input-text-signal.ts` |
| `CustomInputPassword` | `IonInputPassword` | `custom-input-password-signal.ts` |
| `CustomInputNumberSignal` | `IonInputNumber` | `custom-input-number-signal.ts` |
| `CustomInputSelectSignal` | `IonInputSelect` | `custom-input-select-signal.ts` |
| `CustomInputDateSignal` | `IonInputDate` | `custom-input-date-signal.ts` |
| `CustomInputSwitch` | `IonInputToggle` | `custom-input-switch-signal.ts` |
| `CustomInputTextarea` | `IonInputTextarea` | `custom-input-textarea-signal.ts` |
| `CustomInputCurrency` | `IonInputCurrency` | `custom-input-currency-signal.ts` |
| `CustomInputCheckbox` | `IonInputCheckbox` | `custom-input-check-signal.ts` |
| `CustomInputMultiselect` | `IonInputMultiselect` | `custom-input-multiselect-signal.ts` |
| `CustomInputTime` | `IonInputTime` | `custom-input-time-signal.ts` |
| `CustomInputSelectBool` | `IonInputSelectBool` | `custom-input-select-bool-signal.ts` |

### 11.2 Patrón a aplicar en cada web input

```typescript
import { IonInputText } from "../mobile/ion-input-text";
// ... en el template:
@if (platform.isMobile()) {
  <ion-input-text
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [readonly]="readonly()"
    [required]="requiredInput()"
    [horizontal]="horizontal()"
    [noMargin]="noMargin()"
    [description]="description()"
    [hidden]="hidden()"
    [type]="type()"
    [customClass]="customClass()"
    [size]="size()"
  />
} @else {
  <!-- template PrimeNG existente -->
}
```

### 11.3 Check FASE 11
- [x] CustomInputTextSignal → branch mobile
- [x] CustomInputPassword → branch mobile
- [x] CustomInputNumberSignal → branch mobile
- [x] CustomInputSelectSignal → branch mobile
- [x] CustomInputDateSignal → branch mobile
- [x] CustomInputSwitch → branch mobile
- [x] CustomInputTextarea → branch mobile
- [x] CustomInputCurrency → branch mobile
- [x] CustomInputCheckbox → branch mobile
- [x] CustomInputMultiselect → branch mobile
- [x] CustomInputTime → branch mobile
- [x] CustomInputSelectBool → branch mobile
- [x] `npm run build` sin errores
- [x] `npm run lint` sin errores

- [ ] `git commit -m "fix: add mobile branch to 12 web input components using IonInput* from inputs/mobile"`

---

## 📐 MAPA DE ARCHIVOS A MODIFICAR

```
FASE 1 — Críticos
  ├── src/styles/primeng-overrides.css          (28+ reemplazos --brand- → --ds-)
  ├── src/styles/theme/_variables.scss           (gold contrast, doc-neutral)
  └── src/styles/theme/_global.scss              (hardcoded bg-status colors)

FASE 2 — Consistencia
  ├── src/styles/core/_typography.scss           (verificar fuentes)
  ├── src/styles/theme/_variables.scss           (responsive clamp, body 16px)
  ├── src/styles/theme/_ionic-rn-theme.scss      (font-family, dark mode)
  └── src/.../tokens-typography/tokens-typography.ts  (DM Sans → Inter)

FASE 3 — Componentes Alta Prioridad
  ├── src/app/core/components/empty-state/       (nuevo)
  ├── src/app/core/components/confirm-dialog/    (nuevo)
  ├── src/app/core/components/status-badge/      (mejora iconos)
  └── src/app/core/components/inputs/web/        (date-range nuevo)

FASE 4 — Optimizaciones
  ├── src/styles/core/_typography.scss           (max-width 65ch)
  ├── src/styles/prime-overrides/_prime-input.scss (disabled italic)
  ├── src/styles/theme/_variables.scss           (radius unificado)
  └── src/styles/prime-overrides/_prime-tokens.scss (M3 roles)

FASE 5 — Componentes Media Prioridad
  ├── src/app/core/components/notification-center/ (nuevo)
  ├── src/app/core/components/wizard/            (nuevo)
  ├── src/app/core/components/file-upload/       (nuevo)
  ├── src/app/core/components/date-range/        (nuevo)
  └── src/app/core/components/empty-state/       (nuevo)

FASE 6 — COMPONENTES ALTA PRIORIDAD (Completados ✅)
  ├── src/app/core/components/inputs/web/custom-input-remote-autocomplete-signal.ts  (nuevo ✅)
  ├── src/app/core/components/inputs/web/custom-input-transfer-list-signal.ts        (nuevo ✅)
  ├── src/app/core/components/error-boundary/error-boundary.ts                       (nuevo ✅)
  ├── src/app/core/services/global-error-handler.service.ts                          (nuevo ✅)
  ├── src/app/core/components/data-grid/data-grid.ts            (nuevo ✅)
  ├── src/app/core/components/tree-table/tree-table.ts          (nuevo ✅)
  ├── src/app/core/components/kanban-board/kanban-board.ts        (nuevo ✅)
  ├── src/app/core/components/activity-log/activity-log.ts  (nuevo ✅)
  ├── src/app/core/components/breadcrumbs/       (nuevo ✅)
  ├── src/app/core/components/kpi-card/          (nuevo ✅)
  ├── src/app/core/components/chart-wrapper/     (nuevo ✅)
  ├── src/app/core/components/command-palette/   (nuevo ✅)
  ├── src/app/core/components/timeline/          (nuevo ✅)
  └── src/app/core/components/rich-text-editor/  (nuevo ✅)

FASE 7 — COMPONENTES MEDIA PRIORIDAD (Completados ✅)
  ├── src/app/core/components/breadcrumbs/breadcrumbs.ts                   (nuevo ✅)
  ├── src/app/core/components/kpi-card/kpi-card.ts                        (nuevo ✅)
  ├── src/app/core/components/avatar-group/avatar-group.ts                (nuevo ✅)
  ├── src/app/core/components/charts/chart-wrapper.ts                     (nuevo ✅)
  ├── src/app/core/components/context-menu/context-menu.ts                (nuevo ✅)
  ├── src/app/core/components/split-pane/split-pane.ts                    (nuevo ✅)
  ├── src/app/core/components/mega-menu/mega-menu.ts                      (nuevo ✅)
  ├── src/app/core/components/rich-text-editor/rich-text-editor.ts        (nuevo ✅)
  ├── src/app/core/components/command-palette/command-palette.ts          (nuevo ✅)
  ├── src/app/core/components/tour/tour.ts                                (nuevo ✅)
  ├── src/app/core/components/timeline/timeline.ts                        (nuevo ✅)
  ├── src/app/core/components/comparison-table/comparison-table.ts        (nuevo ✅)
  └── src/app/core/components/skeleton-presets/skeleton-presets.ts        (nuevo ✅)

FASE 8 — COMPONENTES BAJA PRIORIDAD (Completados ✅)
  ├── src/app/core/components/gauge/gauge.ts                              (nuevo ✅)
  ├── src/app/core/components/funnel-chart/funnel-chart.ts                (nuevo ✅)
  ├── src/app/core/components/dashboard-layout/dashboard-layout.ts        (nuevo ✅)
  ├── src/app/core/components/document-previewer/document-previewer.ts    (nuevo ✅)
  ├── src/app/core/components/approval-workflow/approval-workflow.ts      (nuevo ✅)
  ├── src/app/core/components/order-status/order-status.ts                (nuevo ✅)
  ├── src/app/core/components/lead-scoring/lead-scoring.ts                (nuevo ✅)
  ├── src/app/core/components/pull-to-refresh/pull-to-refresh.ts          (nuevo ✅)
  ├── src/app/core/components/swipe-actions/swipe-actions.ts              (nuevo ✅)
  ├── src/app/core/components/session-timeout/session-timeout.ts          (nuevo ✅)
  ├── src/app/core/components/offline-indicator/offline-indicator.ts      (nuevo ✅)
  └── src/app/core/services/live-region-announcer.service.ts              (nuevo ✅)

FASE 9 — SEGUNDA RONDA V2 (Completados ✅)
  ├── src/app/core/components/slider/slider.ts                            (nuevo ✅)
  ├── src/app/core/components/rating/rating.ts                            (nuevo ✅)
  ├── src/app/core/components/otp-input/otp-input.ts                      (nuevo ✅)
  ├── src/app/core/components/profile-card/profile-card.ts                (nuevo ✅)
  ├── src/app/core/components/theme-switcher/theme-switcher.ts            (nuevo ✅)
  ├── src/app/core/components/pipeline-crm/pipeline-crm.ts                (nuevo ✅)
  ├── src/app/core/components/tag-input/tag-input.ts                      (nuevo ✅)
  ├── src/app/core/components/contact-card/contact-card.ts                (nuevo ✅)
  ├── src/app/core/components/bottom-nav/bottom-nav.ts                    (nuevo ✅)
  ├── src/app/core/components/tab-bar/tab-bar.ts                          (nuevo ✅)
  ├── src/app/core/components/stat-card/stat-card.ts                      (nuevo ✅)
  ├── src/app/core/components/whats-new/whats-new.component.ts            (nuevo ✅)
  ├── src/app/core/components/customer-360/customer-360.ts                (nuevo ✅)
  ├── src/app/core/components/print-view/print-view.ts                    (nuevo ✅)
  ├── src/app/core/components/lang-selector/lang-selector.ts              (nuevo ✅)
  ├── src/app/core/components/comment-thread/comment-thread.ts            (nuevo ✅)
  ├── src/app/core/components/email-preview/email-preview.ts              (nuevo ✅)
  ├── src/app/core/components/form-builder/form-builder.ts                (nuevo ✅)
  ├── src/app/core/components/signature-pad/signature-pad.ts              (nuevo ✅)
  ├── src/app/core/components/color-picker/color-picker.ts                (nuevo ✅)
  ├── src/app/core/components/tristate-switch/tristate-switch.ts          (nuevo ✅)
  ├── src/app/core/components/dock/dock.ts                                (nuevo ✅)
  ├── src/app/core/components/qr-code/qr-code.ts                          (nuevo ✅)
  ├── src/app/core/components/heatmap/heatmap.ts                          (nuevo ✅)
  ├── src/app/core/components/realtime-indicator/realtime-indicator.ts    (nuevo ✅)
  ├── src/app/core/components/inventory-level/inventory-level.ts          (nuevo ✅)
  ├── src/app/core/components/receipt-scanner/receipt-scanner.ts          (nuevo ✅)
  ├── src/app/core/components/barcode-input/barcode-input.ts              (nuevo ✅)
  ├── src/app/core/components/territory-map/territory-map.ts              (nuevo ✅)
  ├── src/app/core/components/barcode-scanner/barcode-scanner.ts          (nuevo ✅)
  └── src/app/core/components/gantt/gantt.ts                              (nuevo ✅)

FASE 10 — ÚLTIMAS BRECHAS (Completados ✅)
  ├── src/app/core/components/pivot-table/pivot-table.ts                  (nuevo ✅)
  ├── src/app/core/components/focus-trap/focus-trap.ts                    (nuevo ✅)
  └── skip nav: verificado en index.html + app.html                       (verificado ✅)

FASE 11 — WEB INPUTS: BRANCH MOBILE (Completados ✅)
  ├── inputs/web/custom-input-text-signal.ts       (+ IonInputText)       (modificado ✅)
  ├── inputs/web/custom-input-password-signal.ts   (+ IonInputPassword)   (modificado ✅)
  ├── inputs/web/custom-input-number-signal.ts     (+ IonInputNumber)     (modificado ✅)
  ├── inputs/web/custom-input-select-signal.ts     (+ IonInputSelect)     (modificado ✅)
  ├── inputs/web/custom-input-date-signal.ts       (+ IonInputDate)       (modificado ✅)
  ├── inputs/web/custom-input-switch-signal.ts     (+ IonInputToggle)     (modificado ✅)
  ├── inputs/web/custom-input-textarea-signal.ts   (+ IonInputTextarea)   (modificado ✅)
  ├── inputs/web/custom-input-currency-signal.ts   (+ IonInputCurrency)   (modificado ✅)
  ├── inputs/web/custom-input-check-signal.ts      (+ IonInputCheckbox)   (modificado ✅)
  ├── inputs/web/custom-input-multiselect-signal.ts (+ IonInputMultiselect)(modificado ✅)
  ├── inputs/web/custom-input-time-signal.ts       (+ IonInputTime)       (modificado ✅)
  └── inputs/web/custom-input-select-bool-signal.ts (+ IonInputSelectBool)(modificado ✅)
```

---

## 🧹 FASE 12 — LIMPIEZA DE PÁGINAS HUÉRFANAS EN catalog-component-ui

> Auditoría de los 5 directorios `pages/`: 3 estaban huérfanos (no importados). 2 se integraron, 1 se eliminó.

### 12.1 Diagnóstico

| Directorio `pages/` | Nav item | ¿Importado? | Decisión |
|---|---|---|---|
| `catalog-web/` | Web (PrimeNG) | ✅ Importado | — |
| `catalog-layouts/` | Layouts | ✅ Importado | — |
| `catalog-mobile/` | Mobile (Ionic) | ❌ No importado (~250 líneas inline) | ✅ **Integrado** — reemplazó inline |
| `catalog-charts/` | Gráficos | ❌ No importado (solo 2 charts inline) | ✅ **Integrado** — ahora muestra 5 tipos |
| `catalog-documents/` | Estándar Documental | ❌ No importado (contenido duplicado) | ❌ **Eliminado** — dead code |

### 12.2 Archivos modificados

```
src/app/features/system/catalogs/catalog-component-ui/
├── catalog-component-ui.ts
│   ├── + import CatalogCharts from "./pages/catalog-charts"
│   ├── + import CatalogMobile from "./pages/catalog-mobile"
│   ├── + imports array: CatalogCharts, CatalogMobile
│   ├── - import CustomBarChart (unused after integration)
│   ├── - import PieChart (unused after integration)
│   ├── - barChartData, pieChartData properties (unused)
│   └── - Charts section in imports array
├── catalog-component-ui.html
│   ├── ~ Mobile section: ~250 líneas inline → <app-catalog-mobile />
│   └── ~ Charts section: inline 2 charts → <app-catalog-charts [isDarkMode]="isDarkMode()" />
└── pages/
    ├── catalog-mobile/   ← ahora se renderiza
    ├── catalog-charts/   ← ahora se renderiza
    └── catalog-documents/ ← ELIMINADO (directorio completo)
```

### 12.3 Commits
- [ ] `git commit -m "fix: integrate catalog-mobile/catalog-charts, delete orphaned catalog-documents"`

---

> **Pro tip:** Ejecuta `grep -rn "brand-" src/styles/` antes y después de la Fase 1 para verificar migración completa.
> **Pro tip 2:** Usa `grep -rn "#c9a84c" src/` para encontrar todos los usos de Luxury Gold.
> **Pro tip 3:** Consulta `AUDITORIA-COMPLETA.md` → Documento 5 para ver el detalle de cada hallazgo y su priorización RICE.

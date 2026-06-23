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
- [x] Crear `empty-state.component.ts` con inputs:
  - `icon: string` — icono MDI
  - `title: string` — título del estado vacío
  - `message: string` — descripción
  - `actionLabel: string` — texto del CTA
  - `actionIcon: string` — icono del botón
  - `actionSeverity: string` — severidad del botón
- [x] Crear `empty-state.component.html` con layout centrado + icono + texto + botón opcional
- [x] Crear `empty-state.component.scss` con estilos (usando `--ds-*` tokens)
- [ ] Exportar desde `index.ts`
- [ ] Añadir al catálogo en `catalog-component-ui.ts`

### 3.2 Crear componente `app-confirm-dialog`
**Archivo:** `src/app/core/components/confirm-dialog/`
- [x] Crear `confirm-dialog.component.ts` con inputs:
  - `visible: boolean`
  - `title: string`
  - `message: string`
  - `type: 'danger' | 'warning' | 'info' | 'success'`
  - `confirmLabel: string`
  - `cancelLabel: string`
  - `icon: string`
  - Outputs: `confirm`, `cancel`
- [x] Usar `p-dialog` internamente con color mapping según type
- [x] Añadir focus trap automático
- [ ] Exportar desde `index.ts`

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
- [ ] Soporte mobile (cámara + galería)

### 5.4 Commit Fase 5
- [x] `git add -A && git commit -m "feat: add notification-center, wizard, file-upload components"`

---

## ✅ CHECKLIST GLOBAL DE VERIFICACIÓN

### Accesibilidad
- [x] Luxury Gold no se usa para texto < 18px bold
- [x] Document Neutral #5b6778 pasa AA
- [ ] Skip navigation link presente en layouts principales
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
- [x] `app-empty-state` creado
- [x] `app-confirm-dialog` creado
- [x] `app-date-range` creado
- [x] `app-notification-center` creado (opcional)
- [x] `app-wizard` creado (opcional)
- [x] `app-file-upload` creado (opcional)

### Verificación Técnica
- [x] `npm run build` sin errores
- [ ] `npm run lint` sin errores (falla pre-existente: falta `scripts/audit-encoding.mjs`)
- [ ] Revisión visual: light mode + dark mode
- [ ] Revisión visual: web (1920px) + mobile (375px)
- [ ] Revisión: componentes del catálogo UI siguen funcionando

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

FASE 5 — Componentes Media Prioridad (opcional)
  ├── src/app/core/components/notification-center/ (nuevo)
  ├── src/app/core/components/wizard/            (nuevo)
  └── src/app/core/components/file-upload/       (nuevo)
```

---

> **Pro tip:** Ejecuta `grep -rn "brand-" src/styles/` antes y después de la Fase 1 para verificar migración completa.
> **Pro tip 2:** Usa `grep -rn "#c9a84c" src/` para encontrar todos los usos de Luxury Gold.

# AUDITORÍA COMPLETA DEL SISTEMA DE DISEÑO — LuxuryApp CRM/ERP

**Fecha:** 2026-06-23 (actualizado 2026-06-27)
**Alcance:** `src/styles/` + `catalog-component-ui/`
**Framework:** Angular 21 (standalone) + PrimeNG 21 + Ionic 8

---

## AUDITORÍA 1 — Catálogo de Componentes (2026-06-23)

### Resumen
- 50+ componentes faltantes identificados con scoring RICE
- Top prioridades: Confirmation dialog (810), Empty states (360), File upload (192)
- Cobertura Ionic: < 40% de los 90+ componentes nativos disponibles

### Estado post-sesión (2026-06-27)
- **Completados:** web-overlays, web-navigation, web-empty-states, web-progress, catalog-layouts
- **Pendiente:** mobile-overlays, mobile-gestures, mobile-pickers, mobile-toast
- Catálogo mobile ahora existe (catalog-mobile.ts creado)

---

## AUDITORÍA 2 — Sistema de Colores (2026-06-23)

### Problemas originales P1-P5
| ID | Problema | Estado |
|---|---|---|
| P1 | Variables `--brand-*` huérfanas | ✅ Migradas a `--ds-*` |
| P2 | Colores hardcodeados en `global.scss` | ⚠️ Parcial (fallbacks incorrectos pendientes) |
| P3 | Ionic RN theme divergente del DS | ⚠️ Parcial (RGB hardcoded pendiente) |
| P4 | Border radius inconsistente (4px vs 0.25rem) | ✅ Unificado con `--ds-radius-*` tokens |
| P5 | M3 roles duplicados | ✅ Eliminados, `--ds-primary-container` corregido |

### Nuevos hallazgos (2026-06-27)
- `--ds-border` estaba duplicado en `_variables.scss` → **RESUELTO**
- `p-button-secondary` con hardcodes `#f1f5f9` → **RESUELTO** con tokens DS
- `.card` y `.p-card` con `rgba(0,0,0,0.07)` → **RESUELTO** con `var(--ds-border)`
- `p-message` backgrounds hardcodeados → **RESUELTO** con `var(--ds-*-light)`
- `.btn-help`, `.btn-icon-shell--warning` aún hardcodeados → **PENDIENTE** (Fase 16)
- `.alert-*` no responden a dark mode → **PENDIENTE** (Fase 16)

### Paleta actual (Corporate Integrity System)
```
$primary-500: #003d9b   ← PRIMARY (antes #0b3164)
$primary-100: #dae2ff   ← primary-fixed (FloatLabel label bg)
$primary-200: #b2c5ff   ← inverse-primary (dark mode primary)
$success:     #006837
$warning:     #b45309
$danger:      #ba1a1a
$info:        #006477
```

---

## AUDITORÍA 3 — Sistema Tipográfico (2026-06-23)

### Problemas originales I1-I8
| ID | Problema | Estado |
|---|---|---|
| I1 | Font family dual (DM Sans vs Inter) | ✅ Inter + Hanken Grotesk unificado |
| I2 | Ionic usa system fonts | ✅ `--ion-font-family: var(--ds-font-family-base)` |
| I3 | Ionic dark mode tipografía separada | ✅ Unificado |
| I4 | Body 15px < 16px recomendado | ⚠️ Mantenido por decisión de diseño ERP |
| I5 | Sin tipografía responsive | ⚠️ Sin clamp() — pendiente |
| I6 | M3 roles duplicados | ✅ Eliminados |
| I7 | StatusBadge limitado | ⚠️ Sin cambios |
| I8 | Wizard SCSS no global | ⚠️ Sin cambios |

---

## AUDITORÍA 4 — Design Tokens (2026-06-27) — NUEVA

### Arquitectura actual de tokens (simplificada)
```
core/_colors.scss          ← Única fuente Sass ($primary-*, $help-*, etc.)
theme/_variables.scss      ← Genera CSS custom properties (--primary-*, --ds-*, --ion-*, --z-*)
  @use '../core/colors' as c   ← Importa desde la fuente única
prime-overrides/           ← Override de PrimeNG con tokens DS
  _prime-tokens.scss       ← Bridge --p-* ↔ --ds-*
  _prime-button.scss       ← padding explícito + secondary tokens
  _prime-card.scss         ← border con token
  _prime-message.scss      ← border left 4px + backgrounds tokens
  _prime-input.scss        ← border + height inputs
mypreset.ts                ← Preset JS (tag, message, datatable colors)
```

### Duplicaciones resueltas en 2026-06-27
| Token | Antes | Después |
|---|---|---|
| `--ds-border` | 2 definiciones en `:root` | 1 (sección Bordes, línea ~293) |
| `$primary-*` en `_variables.scss` | Redefinidos | Eliminados, vienen de `c.$primary-*` |
| `--ds-primary-container` | `#0052cc` (sólido, incorrecto) | `#{c.$primary-100}` (#dae2ff, claro) |

### Hallazgos pendientes (9 hardcodes restantes)
Ver `PLAN-DE-ACCION.md` Fase 16 para el detalle y plan de resolución.

---

## AUDITORÍA 5 — Inputs Web (2026-06-27) — NUEVA

### Problema original (Fase 11)
Los 12 inputs web tenían `@if (platform.isMobile())` con ramas Ionic que:
1. Usaban componentes Ionic (IonInput, IonSelect, etc.)
2. Tenían labels pegados al borde (sin padding-inline-start)
3. Los selects aparecían detrás de modales PrimeNG (z-index conflicto)

### Solución implementada
- Eliminadas todas las ramas Ionic de los 12 inputs web
- `base-input-signal.ts`: simplificado a contenedor + validación
- FloatLabel `variant="on"` directo en cada componente hijo (no via ng-content)
- `mobileSize` signal heredable por todos los hijos
- Z-index: `ion-action-sheet/alert/popover { z-index: 20001 }`
- Default select interface: `"alert"` (en vez de `"action-sheet"`)

### Estado post-fix
| Input | FloatLabel | Ionic removido |
|---|---|---|
| custom-input-text-signal | ✅ | ✅ |
| custom-input-number-signal | ✅ | ✅ |
| custom-input-currency-signal | ✅ | ✅ |
| custom-input-password-signal | ✅ | ✅ |
| custom-input-textarea-signal | ✅ | ✅ |
| custom-input-select-signal | ✅ | ✅ |
| custom-input-select-bool-signal | ✅ | ✅ |
| custom-input-multiselect-signal | ✅ | ✅ |
| custom-input-time-signal | ✅ | ✅ |
| custom-input-date-signal | ✅ | ✅ |
| custom-input-check-signal | N/A (checkbox) | ✅ |
| custom-input-switch-signal | N/A (toggle) | ✅ |

---

## AUDITORÍA 6 — Estilos Globales Full Scan (2026-06-27) — NUEVA

Ver `src/styles/AUDIT-STYLES.md` para instrucciones detalladas de re-ejecución.

### Hallazgos por severidad
| Severidad | Total | Resueltos | Pendientes |
|---|---|---|---|
| Crítica | 3 | 2 | 1 (`_alerts.scss` dark mode) |
| Alta | 2 | 2 | 0 |
| Media | 8 | 3 | 5 |
| Baja | 5 | 0 | 5 |

### Resueltos en sesión
1. `_prime-message.scss` backgrounds → tokens DS ✅
2. `_prime-button.scss` secondary → tokens DS ✅
3. `_prime-card.scss` + `_cards.scss` border → `var(--ds-border)` ✅
4. `_sidebar.scss` online-indicator → `var(--ds-success)` ✅
5. `_sidebar.scss` `@use 'core/colors'` eliminado ✅
6. `mypreset.ts` info dark mode tag ✅
7. `--ds-border` duplicado eliminado ✅

### Pendientes (ver Fase 16)
- `_buttons.scss`: `.btn-help`, `.btn-icon-shell--warning`
- `_prime-dropdown.scss`: focus shadow
- `_alerts.scss`: backgrounds no responden a dark mode
- `_global.scss`: skip-link fallbacks incorrectos
- `_ionic-rn-theme.scss`: RGB hardcoded
- `_design-system-utilities.scss`: verificar si puede eliminarse

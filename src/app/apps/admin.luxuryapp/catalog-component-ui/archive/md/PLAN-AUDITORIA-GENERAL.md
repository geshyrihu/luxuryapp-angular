# PLAN DE AUDITORÍA GENERAL — Design System LuxuryApp

**Basado en:** Análisis de `catalog-component-ui/`, `core/` y escaneo completo de `features/`
**Fecha:** 2026-06-27
**Contexto:** Post-Fase 15 (DS Infrastructure Cleanup completada)

---

## 1. RESUMEN DE VIOLACIONES DETECTADAS

### Reglas del Design System
| Código | Regla | Descripción |
|--------|-------|-------------|
| **B1** | `custom-button-*` | No `<p-button>` raw, usar wrappers DS |
| **I1** | `custom-input-*-signal` | No `<p-inputtext>`, `<p-select>`, `<p-inputnumber>` raw |
| **C3** | `app-empty-state` | Toda `<p-table>` debe tener `app-empty-state` en emptymessage |
| **A1** | `var(--ds-*)` tokens | Sin colores hex hardcodeados en `style` |
| **C2** | `PrimeNgCustomCaption` | Tablas deben usar caption con Add/Search |
| **C4** | `ActionMenu` | Menús de acción deben usar `ActionMenu` |
| **FL** | FloatLabel `variant="on"` | Inputs de formulario con FloatLabel |
| **T1/T2** | Tokens DS | Usar `--ds-*`, no `--brand-*` legacy |

### Violaciones cuantificadas (features/ — 809 HTMLs escaneados)

| Regla | Total | accounting | operations | hr | system | purchasing | maintenance | legal | recruitment |
|-------|-------|-----------|------------|----|--------|------------|-------------|-------|-------------|
| **C3** | 144 | 63 | 43 | 7 | 10 | 16 | 4 | 1 | 0 |
| **A1** | 122 | 16 | 36 | 25 | 22 | 2 | 14 | 7 | 0 |
| **B1** | 36 | 10 | 2 | 1 | 11 | 8 | 4 | 0 | 0 |
| **I1** | 32 | 9 | 7 | 0 | 5 | 10 | 1 | 0 | 0 |
| **Total** | **~334** | **98** | **88** | **33** | **48** | **36** | **23** | **8** | **0** |

### Hallazgos estructurales
1. **Duplicación de directorios**: `accounting/ar/` ≈ `general-ledger/`; `purchasing/` ×10 sub-áreas; `hr/employees/` ≈ `hr/hr-employees/`; `system/ai/` ≈ `system/infrastructure/debug/ia-test/`
2. **Inconsistencia estilos**: 70% sin .scss, 15% inline, 15% styleUrl, 1 .css
3. **Cross-feature coupling**: HR → recruitment; operations → recruitment + legal + operations
4. **Lifecycle mixto**: `OnInit` vs `effect()` vs ambos
5. **Avance actual**: 12/386 del CSV previo (3.1%), mayoría como "excepción"

---

## 2. PLAN DE EJECUCIÓN POR FASES

### FASE 0 — Regenerar inventario base (1 sesión)
- [ ] Escanear features/ completo con los 4 criterios (B1, I1, C3, A1)
- [ ] Separar falsos positivos documentados
- [ ] Generar CSV con prioridad por módulo + severidad
- [ ] **Output**: `INVENTARIO-COMPONENTES-V2.csv`

### FASE 1 — C3: Empty states en tablas (144 archivos)
**Prioridad:** 🔴 Alta — más masivo, más mecánico, bajo riesgo

| Módulo | Archivos | Sesiones |
|--------|----------|----------|
| accounting | 63 | 2 |
| operations | 43 | 2 |
| purchasing | 16 | 1 |
| system | 10 | 1 |
| hr | 7 | 1 |
| maintenance | 4 | 1 |
| legal | 1 | 1 |
| **Total** | **144** | **~5** |

**Criterio**: Agregar `app-empty-state` en `#emptymessage` de `<p-table>`. Excepciones: sub-tablas en modales, tablas con @if/@else que ya manejan vacío.

### FASE 2 — A1: Hardcodes hex a tokens DS (122 archivos)
**Prioridad:** 🔴 Alta — impacto visual en dark mode

| Módulo | Archivos | Sesiones |
|--------|----------|----------|
| operations | 36 | 2 |
| hr | 25 | 1 |
| system | 22 | 1 |
| accounting | 16 | 1 |
| maintenance | 14 | 1 |
| legal | 7 | 1 |
| purchasing | 2 | 1 |
| **Total** | **122** | **~5** |

**Criterio**: Reemplazar `#[0-9a-f]{3,6}` en `style=""` por `var(--ds-*)`. Excepciones: fallbacks en `var(--ds-*, #fallback)`.

### FASE 3 — B1: p-button raw a custom-button-* (36 archivos)
**Prioridad:** 🟡 Media — requiere criterio

| Módulo | Archivos | Sesiones |
|--------|----------|----------|
| system | 11 | 1 |
| accounting | 10 | 1 |
| purchasing | 8 | 1 |
| maintenance | 4 | 1 |
| operations | 2 | 1 |
| hr | 1 | 1 |
| **Total** | **36** | **~3** |

**Criterio**: Usar `custom-button-add/edit/delete/save/confirm/item/download/send-email/tracking/view-pdf/active-desactive`. Excepciones: `p-splitButton`, botones en toolbars complejos, navegación tipo tabs.

### FASE 4 — I1: Inputs raw a custom-input-*-signal (32 archivos)
**Prioridad:** 🟡 Media — requiere criterio

| Módulo | Archivos | Sesiones |
|--------|----------|----------|
| purchasing | 10 | 1 |
| accounting | 9 | 1 |
| operations | 7 | 1 |
| system | 5 | 1 |
| maintenance | 1 | 1 |
| **Total** | **32** | **~4** |

**Criterio**: Usar `custom-input-text-signal/select-signal/number-signal/etc`. Excepciones: `p-selectButton` (toggle UI), `p-dropdown` en toolbars de filtros.

### FASE 5 — DS: Hardcodes SCSS pendientes (Fase 16 original)
**Prioridad:** 🟢 Baja — 1 sesión

| Archivo | Ítem |
|---------|------|
| `_buttons.scss` | `.btn-help`, `.btn-icon-shell--warning` → tokens |
| `_prime-dropdown.scss` | Focus/error box-shadow → tokens |
| `_alerts.scss` | `.alert-*` backgrounds → dark mode |
| `_global.scss` | skip-link fallbacks → tokens |
| `_ionic-rn-theme.scss` | RGB hardcoded → derivar |
| `_design-system-utilities.scss` | Evaluar eliminación |

### FASE 6 — Crear app-table wrapper (Fase 18 original)
**Prioridad:** 🟢 Baja — 2 sesiones

Crear `core/components/app-table/` que encapsule el boilerplate de `p-table` (caption, header, body, emptymessage, paginator, footer).

### FASE 7 — Deduplicación estructural
**Prioridad:** 🟢 Baja — 3 sesiones

Consolidar: `accounting/ar/` vs `general-ledger/`, `purchasing/` sub-áreas, `hr/employees/` vs `hr-employees/`, `system/ai/` vs `infrastructure/`.

### FASE 8 — Homogeneización de patrones
**Prioridad:** 🟢 Baja — 2 sesiones

Unificar: lifecycle (`OnInit` vs `effect()`), estilo (cuándo usar .scss), naming (kebab-case), imports (barrel vs directo).

---

## 3. ESTIMACIÓN TOTAL

| Fase | Ítems | Sesiones | Esfuerzo relativo |
|------|-------|----------|-------------------|
| 0 — Inventario | — | 1 | ⭐ |
| 1 — C3 empty-state | 144 | 5 | ⭐⭐⭐⭐⭐ |
| 2 — A1 hardcodes | 122 | 5 | ⭐⭐⭐⭐⭐ |
| 3 — B1 botones | 36 | 3 | ⭐⭐⭐ |
| 4 — I1 inputs | 32 | 4 | ⭐⭐⭐⭐ |
| 5 — SCSS hardcodes | 9 | 1 | ⭐ |
| 6 — app-table | 1 | 2 | ⭐⭐ |
| 7 — Dedup | 4 áreas | 3 | ⭐⭐⭐ |
| 8 — Homogeneizar | 4 patrones | 2 | ⭐⭐ |
| **Total** | **~344** | **~26** | |

**Regla de oro:** Un componente a la vez, commit individual, build + lint después de cada uno. Sin scripts batch.

---

## 4. RIESGOS Y DEPENDENCIAS

- **C3 es el más seguro** (solo agrega HTML, no toca lógica) → empezar por aquí
- **A1 requiere ojo** para no romper fallbacks intencionales
- **B1/I1 los más riesgosos** (cambian imports en .ts + estructura en .html)
- **La Fase 6 (app-table)** podría reducir drásticamente el boilerplate de Fase 1 si se implementa primero
- **El inventario actual CSV** tiene 386 entries pero 374 son "excepciones" no resueltas → **hay que regenerarlo**

---

## 5. ORDEN RECOMENDADO DE EJECUCIÓN

```
Fase 0 (Inventario) → Fase 6 (app-table) → Fase 1 (C3) → Fase 2 (A1) → Fase 3 (B1) → Fase 4 (I1) → Fase 5 (SCSS) → Fase 7 (Dedup) → Fase 8 (Homog)
```

**Razón:** app-table antes que C3 porque reduciría el trabajo de C3 al tener un wrapper reutilizable para las tablas.

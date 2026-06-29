# PLAN DE ACCIÓN — Design System v2 (2026-06-26)

> Basado en auditoría real del catálogo DS + features.
> **Enfoque: lento, seguro, componente por componente. Sin scripts batch.**
> Cada component se revisa manualmente, se corrige a mano y se verifica.

---

## FASE 15 — DS Infrastructure Cleanup (Completada 2026-06-27)

### Objetivo
Limpiar deuda técnica acumulada en estilos, tokens y arquitectura de inputs.

### Completado
- [x] Brand rebrand: ERP Premium · Deep Navy (`$primary-700: #1b365d`, primary: `#1b365d`)
- [x] Paleta Sass centralizada en `core/_colors.scss` — sin redefinición en `_variables.scss`
- [x] `--ds-border` duplicado eliminado
- [x] Sidebar/Topbar white, menú items visibles, botón toggle TailAdmin
- [x] Inputs web: eliminadas 12 ramas Ionic, FloatLabel `variant="on"` en cada uno
- [x] `base-input-signal`: simplificado + `mobileSize` computed signal
- [x] `p-button padding`, `p-card border`, `p-message` backgrounds/border: tokens DS
- [x] `mypreset.ts`: `info` dark mode tag añadida
- [x] `_prime-button.scss` secondary: hardcodes → tokens
- [x] Auditoría completa ejecutada (AUDIT-STYLES.md)

---

## FASE 16 — Hardcodes Pendientes de Auditoría (PRÓXIMA)

> 9 hallazgos restantes del audit 2026-06-27. Prioridad: media/baja.
> No bloquean funcionalidad pero sí afectan dark mode y mantenibilidad.

### 16.1 · `_buttons.scss` — hardcodes en clases utilitarias
**Archivo:** `src/styles/components/_buttons.scss`

| Línea aprox | Problema | Fix |
|---|---|---|
| `.btn-help` | `#7c3aed`, `#6d28d9` hardcoded | → `var(--ds-help)`, `var(--ds-help-hover)` |
| `.btn-icon-shell--warning` | `#92400e` hardcoded | → `var(--ds-warning)` |

```scss
// ANTES
.btn-help { background: #7c3aed; &:hover { background: #6d28d9; } }

// DESPUÉS
.btn-help { background: var(--ds-help); &:hover { background: var(--ds-help-hover); } }
```

### 16.2 · `_prime-dropdown.scss` — focus shadow hardcoded
**Archivo:** `src/styles/prime-overrides/_prime-dropdown.scss`

| Línea aprox | Problema | Fix |
|---|---|---|
| Focus box-shadow | `rgba(59, 130, 246, 0.2)` | → `var(--ds-shadow-focus)` |
| Error box-shadow | `rgba(239, 68, 68, 0.2)` | → `0 0 0 3px rgba(var(--ds-danger-rgb, 186,26,26), 0.2)` |

### 16.3 · `_alerts.scss` — no responde a dark mode
**Archivo:** `src/styles/components/_alerts.scss`

Los `.alert-*` tienen backgrounds hardcodeados que no cambian en dark mode:
```scss
// ANTES (hardcoded)
.alert-success { background-color: #f0fdf4; color: #006837; }

// DESPUÉS (responsive)
.alert-success { background-color: var(--ds-success-light); color: var(--ds-success); }
.alert-danger  { background-color: var(--ds-danger-light);  color: var(--ds-danger);  }
.alert-warning { background-color: var(--ds-warning-light); color: var(--ds-warning); }
.alert-info    { background-color: var(--ds-info-light);    color: var(--ds-info);    }
```

### 16.4 · `_global.scss` — fallback values incorrectos
**Archivo:** `src/styles/theme/_global.scss`

| Línea | Problema | Fix |
|---|---|---|
| `.skip-link` outline | fallback `#2563eb` (otro proyecto) | → `var(--primary-500)` sin fallback |
| Focus outline | fallback `#93c5fd`, `#60a5fa` | → `var(--primary-300)`, `var(--primary-400)` |

### 16.5 · `_ionic-rn-theme.scss` — RGB hardcoded
**Archivo:** `src/styles/theme/_ionic-rn-theme.scss`

```scss
// Estos valores debería derivarse automáticamente:
--ion-background-color-rgb: 249, 249, 255;  // hardcoded → no cambia si cambia --ds-bg-page
--ion-text-color-rgb: 4, 27, 60;            // hardcoded → no cambia si cambia --ds-text-primary
```

Estrategia: mantener como documentación pero añadir comentario de que son valores derivados del token.

### 16.6 · `_design-system-utilities.scss` — Dead code documentado
**Archivo:** `src/styles/custom/_design-system-utilities.scss`

El archivo ya tiene banner de advertencia. Antes de eliminarlo:
1. Grep en todo el proyecto: `grep -r "input-text\|input-select\|btn-primary\|alert-" src/app --include="*.html"`
2. Si hay 0 resultados → eliminar el archivo
3. Si hay usos → migrar clases al componente correcto primero

---

## FASE 17 — Revisión Manual de Componentes B1/I1 (PENDIENTE)

> 385 componentes identificados con violaciones en `INVENTARIO-COMPONENTES.csv`
> Avance actual: 4/385 (3.1%)

### Próximos 10 componentes a revisar (por prioridad)

Seguir el orden del CSV priorizando `accounting/` primero:

1. `accounting/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html`
2. `accounting/ar/aspel-customer-empresa/aspel-customer-empresa-list.html`
3. `accounting/fondeos-y-reporteo/funding/funding-list.html`
4. `accounting/fondeos-y-reporteo/funding-accounting/funding-accounting-list.html`
5. `accounting/general-ledger/contabilidad/cobranza-online/pages/dashboard/cobranza-online-dashboard.html`

**Checklist por componente:**
- [ ] B1: `<p-button>` raw → `<custom-button-*>`
- [ ] I1: Inputs PrimeNG raw → `<custom-input-*-signal>`
- [ ] C3: `<p-table>` → verificar si tiene `app-empty-state`
- [ ] A1: Colores hardcodeados en template → tokens `var(--ds-*)`
- [ ] Build sin errores tras cambio
- [ ] Commit individual con referencia al componente

---

## FASE 18 — app-table Component (PENDIENTE)

Ver `PROPUESTA-APP-TABLE.md` para especificaciones detalladas.

Crear `src/app/core/components/app-table/`:
- [ ] `app-table.types.ts` — ColDef interface
- [ ] `app-table.ts` — componente standalone
- [ ] `app-table.html` — template con dynamic columns
- [ ] Integrar en catálogo (`web-tables.ts`)
- [ ] Migrar 3 componentes piloto como validación

---

## FASE 19 — FloatLabel Visual Verification (PENDIENTE)

Después de los cambios de inputs, verificar visualmente:

- [ ] Todos los inputs muestran label flotante `variant="on"` correctamente
- [ ] En mobile (< 768px): size="small" se aplica
- [ ] En modales PrimeNG: selects abren sobre el diálogo (z-index correcto)
- [ ] Dark mode: labels y borders visibles
- [ ] Validación inline: errores visibles debajo del FloatLabel
- [ ] Casos edge: input sin label, input readonly, input disabled

**Para verificar:** Navegar a `localhost:4200/settings/ui-catalog` → sección "Smart Inputs"

---

## FASE 20 — Catálogo Mobile Expansion (PENDIENTE)

Objetivo: igualar cobertura mobile con la sección web (PrimeNG).

Secciones faltantes en `catalog-mobile/`:
- [ ] `mobile-overlays.ts` — IonModal, IonActionSheet, IonAlert, IonPopover
- [ ] `mobile-toast.ts` — IonToast patterns
- [ ] `mobile-gestures.ts` — Swipe, pull-to-refresh patterns
- [ ] `mobile-pickers.ts` — IonDatetime, IonPicker
- [ ] `mobile-empty-states.ts` — Estados vacíos estilo mobile

---

## Criterios de "listo" por fase

| Criterio | Requerido |
|---|---|
| Build Angular sin errores | ✅ obligatorio |
| Visual en browser | ✅ obligatorio |
| Dark mode verificado | ✅ obligatorio para tokens |
| Commit individual | ✅ obligatorio por componente |
| CSV actualizado | ✅ para Fase 17 |

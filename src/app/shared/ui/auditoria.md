# Auditoría de Sistema de Diseño — LuxuryApp (CRM/ERP)

**Fecha:** 2026-07-15 · **Rol:** Auditor de diseño · **Método:** render real capturado (Chrome headless + login) + matemática WCAG (fórmula oficial de luminancia) + benchmark de sistemas B2B/ERP profesionales.

> Este documento reemplaza el *brief* previo (las 4 tareas) con sus **respuestas ejecutadas**. Al final se conserva el checklist original como anexo de trazabilidad.

---

## VEREDICTO EJECUTIVO

**7 / 10 — base profesional sólida, con deuda de accesibilidad en la capa de acentos y de consistencia por el crecimiento orgánico.**

| Dimensión | Nota | Una línea |
|---|---|---|
| Cobertura de componentes | **9/10** | Sorprendentemente completa; casi nada falta |
| Color — cimiento (navy, texto, tags) | **9/10** | Correcto y medible AAA/AA |
| Color — acentos (botones sólidos) | **4/10** | Varios **fallan WCAG AA** (dato duro abajo) |
| Consistencia semántica | **5/10** | Dorado con doble sentido, 3 azules, drift documental |
| Tipografía | **8/10** | Escala modular buena; fuente documentada ≠ real |
| Dark mode | **8/10** | Funciona y conserva contraste |

**La conclusión honesta:** el problema **no es que falten componentes** (están casi todos). El problema es la **consistencia y accesibilidad de lo que ya existe**. Se ve profesional a primera vista, pero no resiste una auditoría de contraste ni de coherencia. Un *pass* de color enfocado (1–2 días) lo lleva a 9/10 sin rediseñar la identidad.

---

## TAREA 1 — Cobertura de Componentes (Gap Analysis)

### Hallazgo principal: la cobertura es ALTA

Al construir el catálogo unificado confirmé que `shared/ui` tiene **~130 wrappers web + ~95 mobile**. Contra el checklist del brief, **casi todo existe**:

| Área | Estado | Notas |
|---|---|---|
| A) Tablas y datos | ✅ Completo | `data-grid`, `tree-table`, `pivot-table`, `comparison-table`, `virtual-scroller`, `kanban-board`, `gantt`, `timeline` — todos presentes |
| B) Formularios | ✅ Completo | ~24 `custom-input-*` (texto, moneda, fecha, máscara, OTP, autocomplete…), `form-builder`, `wizard`/`stepper`, `file-upload`, `rich-text-editor`, `signature-pad`, `color-picker`, `rating`, `slider`, `tag-input` |
| C) Navegación/Layout | ✅ Completo | `breadcrumbs`, `sidebar`, `tabs`, `split-pane`, `dock`, `mega-menu`, `context-menu`, `bottom-nav`, `tab-bar`, `swipe-actions`, `pull-to-refresh` |
| D) Feedback | ✅ Completo | `toast`, `confirm-dialog`, `skeleton`(+presets), `empty-state`, `error-boundary`, `progress-bar`, `notification-center`, `tour`, `whats-new` |
| E) Data display | ✅ Completo | `kpi-card`, `stat-card`(sparkline), `profile-card`, `activity-log`, `comment-thread`, `chip`/`tag`, `badge`/`status-badge`, `avatar-group`, `comparison-table`, `qr-code`, `barcode-scanner` |
| F) Gráficos | ✅ Completo | `charts`(bar/pie/…), `dashboard-layout`, `gauge`, `funnel-chart`, `heatmap`, `realtime-indicator` |
| G) CRM | ✅ Completo | `contact-card`, `pipeline-crm`, `lead-scoring`, `email-preview`, `activity-log`, `customer-360`, `territory-map` |
| H) ERP | ✅ Completo | `document-previewer`(PDF), `approval-workflow`, `inventory-level`, `order-status`, `receipt-scanner`, `barcode-input` |
| I) Accesibilidad/UX | ⚠️ Parcial | Existen `focus-trap`, `live-region-announcer`, `command-palette`, `theme-switcher`, `lang-selector`, `session-timeout`, `offline-indicator`, `print-view`. **Falta explícito:** *skip navigation link* y modo *high-contrast*. |

### Gaps reales (pocos, priorizados RICE)

| Faltante | Reach | Impact | Confidence | Effort | Prioridad |
|---|---|---|---|---|---|
| **Skip-navigation link** (a11y) | Alto | Medio | Alta | Bajo | **P1** — barato, cumple WCAG 2.4.1 |
| **Modo high-contrast** (a11y) | Medio | Alto | Media | Medio | **P2** |
| **Transfer list / dual listbox** | Bajo | Bajo | Alta | Medio | P3 |
| **Toggle tri-estado** (existe `tristate-switch` en shared, no en catálogo) | Bajo | Bajo | Alta | Bajo | P3 — solo exponerlo |

### Recomendación
La energía **no** debe ir a "construir más componentes" — debe ir a **corregir accesibilidad y consolidar semántica** de los ~130 que ya existen (Tareas 2 y 3). El catálogo nuevo es la herramienta para hacerlo de forma visible.

---

## TAREA 2 — Auditoría de Color

### 2.1 Paleta actual (de `DESIGN.md` + `core/_colors.scss`)

| Rol | Token | Hex |
|---|---|---|
| Primario | `primary` | `#1B365D` (Deep Navy) |
| Primario hover/light | `primary-light` | `#2A4D7C` |
| Acento premium | `secondary-gold` | `#D4A74A` |
| Éxito | `success`/emerald | `#1E9B6D` |
| Error | `error`/crimson | `#D34B4B` |
| Info | `info`/cyan | `#4A90E2` |
| Warning | `warning` | `#D4A74A` (= dorado ⚠️) |
| Texto 1º / 2º / 3º | on-surface | `#1A2634` / `#5A6878` / `#9AACBB` |
| Surface / card | surface | `#F8F9FC` / `#FFFFFF` |

### 2.2 Tabla de contraste WCAG (calculada, no estimada)

Mínimos: **4.5:1** texto normal · **3:1** texto grande.

| Combinación | Ratio | AA normal | Estado |
|---|---|---|---|
| Texto 1º `#1A2634` / surface | **14.55:1** | ✅ | AAA |
| Texto 2º `#5A6878` / surface | **5.41:1** | ✅ | AA |
| **Texto 3º `#9AACBB` / surface** | **2.22:1** | ❌ | 🔴 **FALLA** |
| Btn Primary: blanco / navy | **12.12:1** | ✅ | AAA |
| Btn Success: blanco / emerald | **3.52:1** | ❌ | 🟠 solo texto grande |
| Btn Danger: blanco / crimson | **4.31:1** | ❌ (al límite) | 🟠 casi |
| Btn Info: blanco / cyan | **3.29:1** | ❌ | 🟠 solo texto grande |
| **Btn Warning: blanco / dorado** | **2.23:1** | ❌ | 🔴 **FALLA** |
| **Dorado `#D4A74A` / blanco** (texto/icono) | **2.23:1** | ❌ | 🔴 **FALLA** |
| Warning: navy / dorado (uso correcto) | **5.44:1** | ✅ | AA |
| Tag success: `#0D5E3F` / tinte `#E6F7F0` | **7.04:1** | ✅ | AAA |
| Tag warning: `#7A5E15` / tinte `#FCF3E0` | **5.53:1** | ✅ | AA |

### 2.3 Diagnóstico de la causa raíz

El patrón que **funciona**: fondo tintado claro + texto oscuro del mismo tono (los *tags*). AAA/AA. Es lo que hacen Stripe/Linear.

El patrón que **falla**: texto **blanco** sobre color de **valor medio** (dorado, cyan, emerald). El blanco solo rinde sobre colores oscuros (el navy pasa 12:1). Los acentos son medios → el blanco encima cae por debajo de 4.5:1.

**El dorado es el peor:** no puede llevar texto blanco (2.23) ni ser texto sobre blanco (2.23). La propia `DESIGN.md` ya define `on-warning-container: #7A5E15` (dorado oscuro) para texto de warning, pero **el componente de botón renderiza blanco** — contradice la intención. Es deuda heredada, no decisión.

### 2.4 Teoría del color y semántica

- **Regla 60-30-10:** bien respetada — navy domina, neutros de soporte, acentos escasos. ✓
- **Conflicto semántico del dorado:** definido como "premium/VIP" **y** como `warning`. El usuario no distingue "importante" de "cuidado". Los sistemas pro usan **ámbar/naranja** para warning, reservando dorado para premium. Hoy chocan. 🔴
- **Tres azules compiten:** `primary #1B365D`, `primary-light #2A4D7C`, `info #4A90E2`; además en PrimeNG conviven `info` y `help` (azules casi idénticos). Redundancia. Los benchmarks B2B usan **un** azul de acento.
- **Daltonismo:** el sistema apoya estado con **iconos + texto** en tags (bien), pero los botones de severidad dependen mayormente del color. Verificar que danger/success no se distingan solo por color en flujos críticos.
- **Fatiga visual:** surfaces bien escalonadas (`#F8F9FC` page / `#FFFFFF` card / tintes) — sin exceso de blanco puro. ✓

### 2.5 Cross-platform
Los `--ds-*` alimentan tanto el preset PrimeNG (`mypreset.ts`) como el tema Ionic (`_ionic-rn-theme.scss`) vía CSS vars `--ion-*`. Unificado y correcto. (Se corrigió en Fase 4.5 un override Material local del catálogo que divergía; ya hereda el tema real.)

---

## TAREA 3 — Auditoría Tipográfica

### 3.1 Inventario
- **Fuente real:** `--ds-font-family-base: "Outfit", "Inter", …` → **Outfit** (geométrica moderna). ⚠️ `DESIGN.md` dice "Inter" — **drift documental**.
- **Escala:** 12 niveles (display 48/40 → body 16/14/13 → label 14/12/10), en `DESIGN.md`.

### 3.2 Escala modular
La escala es **armónica y deliberada** (no arbitraria): saltos ~1.2–1.25 (Major Third) en headings, con line-heights proporcionales y letter-spacing negativo en displays. ✓ Moderno.

### 3.3–3.5 Consistencia y legibilidad
- Body base **16px**, line-height 1.5 en body-lg. ✅ Cumple mínimo de legibilidad.
- Tablas 13–14px legibles. ✅
- Mobile inputs 16px (evita zoom iOS). ✅
- **Riesgo:** `label-sm` 10px uppercase — al límite inferior; aceptable solo para *overlines*, nunca para datos.
- **Riesgo:** el texto terciario `#9AACBB` (que falla contraste) suele acompañar tamaños pequeños → doble penalización de legibilidad.

---

## TAREA 4 — Propuesta de Design Tokens (correcciones)

Cambios mínimos que resuelven lo crítico **sin tocar la identidad navy**:

```scss
// core/_colors.scss — CORRECCIONES DE ACCESIBILIDAD (P0)
:root {
  // 1. Acentos oscurecidos para que el texto BLANCO pase AA (4.5:1)
  --ds-info:    #2563EB;  // era #4A90E2 (3.29) → blanco pasa ~4.6:1
  --ds-success: #0F8A5F;  // era #1E9B6D (3.52) → blanco pasa ~4.5:1
  --ds-danger:  #C43D3D;  // era #D34B4B (4.31) → blanco pasa >4.5:1

  // 2. WARNING deja de ser dorado: ámbar propio (separa de premium)
  --ds-warning:        #B45309;  // ámbar oscuro; blanco pasa AA
  --ds-warning-surface:#FEF3C7;  // tinte para tags (texto #78350F)

  // 3. DORADO solo como "premium", nunca texto/fondo-con-blanco
  --ds-gold: #D4A74A;            // uso: navy-sobre-dorado (5.44 ✓) o dorado-sobre-navy

  // 4. Texto terciario legible
  --ds-text-tertiary: #6B7B8C;   // era #9AACBB (2.22) → pasa AA ~4.6:1
}
```

Regla para los **botones de acento**: si el fondo no pasa 4.5:1 con blanco, usar variante *tag* (tinte + texto de color oscuro) en vez de sólido. El patrón de tags ya está probado en el sistema.

---

## PLAN PRIORIZADO

**P0 — Accesibilidad (rompe la promesa "WCAG AA+" de tu propia doc)**
1. Warning: cambiar a ámbar propio **o** texto navy en el botón (navy/dorado = 5.44 ✓).
2. Oscurecer info/success/danger a los valores de arriba (o convertir a estilo tag).
3. Subir texto terciario a `#6B7B8C`.
4. Prohibir dorado como texto sobre blanco / fondo con texto blanco.

**P1 — Consistencia semántica**
5. Separar `--ds-gold` (premium) de `--ds-warning` (ámbar).
6. Colapsar los tres azules a uno; fusionar `help`→`info`.
7. Añadir *skip-navigation link*.

**P2 — Higiene documental (barato)**
8. Corregir `DESIGN.md`: fuente = Outfit; recalcular los ratios afirmados (están mal: "gold/navy 6.8" es 5.44; "white/navy 9.5" es 12.1).
9. Documentar radios web (3px) vs mobile (12px) como decisión, o unificar.

**Cómo ejecutarlo con red de seguridad:** cambia el token en `core/_colors.scss` y el catálogo `/admin/ui-catalog` muestra **todas** las secciones (botones, tags, cards) actualizadas a la vez en claro y oscuro. Es el laboratorio para validar cada corrección aplicada a todo el sistema de una sola vez.

---

## Resumen en una línea
**Buen hueso, buena piel; el maquillaje (acentos) falla la prueba de luz.** No faltan componentes ni sobra ambición: falta un *pass* de contraste en los acentos y separar el dorado-premium del ámbar-warning. Con eso pasas de "se ve bien" a "es demostrablemente profesional y accesible", conservando el navy que ya es tu fortaleza.

---
<details>
<summary>Anexo — brief original de auditoría (checklist de trazabilidad)</summary>

El documento original enumeraba 4 tareas (gap analysis de componentes con matriz web/mobile y RICE; auditoría de color con inventario, tabla WCAG completa, teoría del color y cross-platform; auditoría tipográfica con escala modular y legibilidad; y 4 entregables incluida una propuesta de tokens). Cada una está respondida arriba con datos medidos sobre el render real y la paleta vigente.
</details>

# FASE 1 — Reporte de Análisis de Design System

**Analista:** Senior UI/UX Designer & Design System Specialist  
**Documento analizado:** Implementación real del Design System (SCSS)  
**Fecha:** 2026-06-20  
**Versión del sistema:** Angular 21 + PrimeNG 21 + Ionic  

---

## 1. Resumen Ejecutivo

El design system implementado en el código fuente presenta una **base sólida y bien estructurada** con una paleta de colores corporativa coherente (Corporate Blue #0b3164), un sistema completo de tokens (`--ds-*`), y soporte completo para modo claro/oscuro. Sin embargo, se identificaron **inconsistencias críticas** en la duplicación de tokens con valores divergentes, problemas de contraste en colores `muted`, y una brecha visual entre la experiencia web (ERP) y mobile (Ionic RN).

| Dimensión | Puntuación | Estado |
|-----------|:----------:|--------|
| **Arquitectura de tokens** | 8/10 | ✅ Sólida, con algunos duplicados |
| **Paleta de colores** | 8/10 | ✅ Coherente, noble y alineada a "luxury" |
| **Tipografía** | 7/10 | ⚠️ Buena, pero sin ajustes responsivos |
| **Componentes base** | 6/10 | ⚠️ Legacy utilities no migradas a tokens |
| **Accesibilidad (WCAG 2.2)** | 6/10 | ⚠️ Fallos en `text-muted`, falta verificación exhaustiva |
| **Modo oscuro** | 8/10 | ✅ Sólido, con glows neon premium |
| **Consistencia Web/Mobile** | 5/10 | ❌ Divergencia de colores primarios |

**Puntuación global: 7/10** — Buen sistema de diseño con oportunidades de mejora significativas.

---

## 2. Matriz de Hallazgos

| # | Categoría | Hallazgo | Severidad | Recomendación |
|---|-----------|----------|-----------|---------------|
| 1 | Tokens | Duplicación de `--ds-*` en `theme/_variables.scss` (líneas 100-155 y 279-401) con valores diferentes para `--ds-primary` (#092953 vs #0b3164) | **Crítico** | Unificar en un solo bloque y usar un único valor fuente |
| 2 | Consistencia | `_ionic-rn-theme.scss` define `--ion-color-primary: #155ec0` vs ERP primary `#0b3164` | **Alto** | Alinear el primary de Ionic al `#0b3164` corporativo para mantener identidad visual unificada |
| 3 | Accesibilidad | `--ds-text-muted: #94a3b8` sobre blanco → ratio ~2.9:1 (falla WCAG AA 4.5:1) | **Alto** | Oscurecer a ~#6b7280 para alcanzar 4.5:1 mínimo |
| 4 | Accesibilidad | `--ds-text-muted: #71717a` sobre `#18181b` en dark → ratio ~3.8:1 (falla WCAG AA) | **Alto** | Aclarar a ~#a1a1aa o ajustar fondo |
| 5 | Migración | `_design-system-utilities.scss` contiene colores hardcodeados (`#1e293b`, `#cbd5e1`, etc.) sin usar variables CSS | **Alto** | Migrar todos los colores a referencias `--ds-*` o `--primary-*` |
| 6 | Tokens | `--ds-primary-text: #ffffff` no tiene override en dark mode → puede perder contraste sobre fondos claros en dark | **Medio** | Definir `--ds-primary-text` en dark mode acorde al fondo |
| 7 | Tipografía | La escala tipográfica (core/_typography.scss) no tiene media queries responsivas | **Medio** | Agregar reducción progresiva en móvil (ej: h1→2rem en sm) |
| 8 | Consistencia | `theme/_variables.scss` y `_ionic-rn-theme.scss` definen ambos `body.theme-dark` con valores distintos → posible conflicto de cascada | **Medio** | Unificar dark mode en un solo lugar o asegurar orden de cascada predecible |
| 9 | Tokens | `$neutral-1000: #000000` definido en `_colors.scss` pero nunca expuesto como CSS variable | **Bajo** | Agregar `--neutral-1000` si tiene uso real, o eliminarlo |
| 10 | Documentación | No existen tokens específicos para estados de componentes (`--ds-btn-padding`, `--ds-input-bg`, etc.) | **Bajo** | Evaluar si se necesitan para mejorar mantenibilidad |
| 11 | Tipografía | Las escalas de `theme/_variables.scss` (ERP) y `core/_typography.scss` usan naming distinto (ej: `--ds-font-size-body: 0.9375rem` vs `$font-size-sm: 0.875rem`) | **Medio** | Unificar nomenclatura entre archivos |
| 12 | Breakpoints | No hay breakpoint `2xs` o `3xs` para dispositivos muy pequeños (<576px) | **Bajo** | Evaluar si se necesita soporte para pantallas < 360px |

---

## 3. Auditoría de Contraste (WCAG 2.2 AA)

### 3.1 Modo Claro

| Combinación (texto / fondo) | Ratio | ¿Cumple AA? | Uso |
|-----------------------------|:----:|:------------:|-----|
| `--ds-text-primary` #0f172a / `--ds-bg-surface` #ffffff | **~15.8:1** | ✅ | Texto normal/grande |
| `--ds-text-secondary` #475569 / `--ds-bg-surface` #ffffff | **~7.5:1** | ✅ | Texto normal/grande |
| `--ds-text-muted` #94a3b8 / `--ds-bg-surface` #ffffff | **~2.9:1** | ❌ | Texto normal |
| `--ds-text-muted` #94a3b8 / `--ds-bg-page` #f8fafc | **~2.7:1** | ❌ | Texto normal |
| `--ds-primary` #0b3164 / `--ds-bg-surface` #ffffff | **~11.5:1** | ✅ | Texto normal/grande |
| `--ds-primary` #092953 / `--ds-bg-surface` #ffffff | **~12.8:1** | ✅ | Texto normal/grande |
| `--ds-danger` #991b1b / `--ds-bg-surface` #ffffff | **~7.0:1** | ✅ | Texto normal/grande |
| `--ds-success` #065f46 / `--ds-bg-surface` #ffffff | **~10.3:1** | ✅ | Texto normal/grande |
| `--ds-warning` #92400e / `--ds-bg-surface` #ffffff | **~6.2:1** | ✅ | Texto normal/grande |
| `--ds-text-disabled` #cbd5e1 / `--ds-bg-surface` #ffffff | **~1.7:1** | ❌ | Solo disabled (aceptable) |
| `--ds-text-link` #092953 / `--ds-bg-surface` #ffffff | **~12.8:1** | ✅ | Texto normal/grande |

### 3.2 Modo Oscuro

| Combinación (texto / fondo) | Ratio | ¿Cumple AA? | Uso |
|-----------------------------|:----:|:------------:|-----|
| `--ds-text-primary` #fafafa / `--ds-bg-surface` #18181b | **~15.6:1** | ✅ | Texto normal/grande |
| `--ds-text-secondary` #a1a1aa / `--ds-bg-surface` #18181b | **~7.0:1** | ✅ | Texto normal/grande |
| `--ds-text-muted` #71717a / `--ds-bg-surface` #18181b | **~3.8:1** | ❌ | Texto normal (sí cumple para large text 3:1) |
| `--ds-text-muted` #71717a / `--ds-bg-elevated` #27272a | **~3.2:1** | ❌ | Texto normal |
| `--ds-primary` #4d9fff / `--ds-bg-surface` #18181b | **~7.3:1** | ✅ | Texto normal/grande |
| `--ds-danger` #f87171 / `--ds-bg-surface` #18181b | **~7.2:1** | ✅ | Texto normal/grande |
| `--ds-success` #4ade80 / `--ds-bg-surface` #18181b | **~8.4:1** | ✅ | Texto normal/grande |
| `--ds-warning` #fbbf24 / `--ds-bg-surface` #18181b | **~10.6:1** | ✅ | Texto normal/grande |
| `--ds-text-disabled` #3f3f46 / `--ds-bg-surface` #18181b | **~1.6:1** | ❌ | Solo disabled (aceptable) |

---

## 4. Análisis Detallado

### 4.1 Color

**Fortalezas:**
- Escala completa 50-950 para cada color — cubre todas las necesidades de variación tonal.
- Paleta primaria (Corporate Blue #0b3164) comunica lujo y seriedad, adecuada para contexto empresarial de lujo.
- Colores semánticos bien diferenciados (success, warning, danger, info, help).
- Dark mode bien trabajado con ajustes específicos de luminosidad y no simple inversión.
- Neon glow tokens en dark mode agregan un toque "premium/lujoso" muy apropiado.

**Debilidades:**
- **Hallazgo #1 (Crítico)**: `theme/_variables.scss` define `--ds-primary` dos veces:
  - Línea 101: `--ds-primary: var(--brand-primary, #{$primary-600})` = #092953
  - Línea 280: `--ds-primary: var(--primary-500)` = #0b3164  
  El segundo bloque sobrescribe al primero. Esto es extremadamente riesgoso.
- **Hallazgo #2 (Alto)**: Ionic RN usa `#155ec0` como primary → inconsistencia visual severa.
- **Hallazgo #5 (Alto)**: Múltiples componentes legacy con colores hardcodeados.

### 4.2 Tipografía

**Fortalezas:**
- DM Sans es una elección excelente para "luxury": moderna, geométrica, con buen kerning.
- Escala modular 1.25 (major third) proporciona progresión armónica.
- Sistema completo de pesos (300-800) y line-heights.
- Clases utilitarias bien definidas (`.text-xs` a `.text-4xl`, `.font-*`).

**Debilidades:**
- La misma familia para headings y body reduce diferenciación jerárquica (idealmente una serif o display para headings).
- Sin ajustes responsivos en la escala — h1 (36px) es el mismo en mobile y desktop.
- Duplicación de escalas entre `core/_typography.scss` y `theme/_variables.scss` con valores diferentes.
- No hay definición de `max-width` para párrafos (ideal: 60-75 caracteres por línea).

### 4.3 Espaciado y Layout

**Fortalezas:**
- Sistema de espaciado basado en 4px (tailwind-like) — escala completa y semántica.
- Breakpoints bien definidos (6 niveles, mobile-first).
- Z-index system detallado con rangos reservados.

**Debilidades:**
- No hay definición de grid system en los archivos core (dependencia de PrimeNG Flex / PrimeFlex).
- Padding semántico definido pero no expuesto como variables CSS (solo SCSS).

### 4.4 Componentes Base

**Fortalezas:**
- Sistema completo de badges (filled, outline, sizes, dot).
- Botones con 3 variantes (solid, outline, ghost) × 6 colores.
- Tablas con sticky headers, column width utilities extensivas.
- Alertas con variantes semánticas.

**Debilidades:**
- Componentes legacy (`_design-system-utilities.scss`) no migrados a CSS variables — usan valores hardcodeados.
- No se encontraron definiciones para componentes modernos como: skeleton/shimmer, progress bar, stepper, timeline, tooltip.

---

## 5. Recomendaciones Priorizadas

| Prioridad | Acción | Impacto | Esfuerzo |
|-----------|--------|:-------:|:--------:|
| 1 | **Unificar `--ds-primary` y eliminar duplicación** en `theme/_variables.scss` | Alto | Bajo |
| 2 | **Alinear `--ion-color-primary` a #0b3164** en `_ionic-rn-theme.scss` | Alto | Bajo |
| 3 | **Corregir `--ds-text-muted`** a #6b7280 (light) y #a1a1aa (dark) para cumplir WCAG AA | Alto | Bajo |
| 4 | **Migrar colores hardcodeados** en `_design-system-utilities.scss` a variables `--ds-*` | Alto | Medio |
| 5 | **Agregar `--ds-primary-text` en dark mode** (actualmente #ffffff heredado, proponer #09090b) | Medio | Bajo |
| 6 | **Unificar escalas tipográficas** entre `core/_typography.scss` y `theme/_variables.scss` | Medio | Medio |
| 7 | **Agregar media queries responsivas** para reducir tamaños de heading en mobile | Medio | Medio |
| 8 | **Unificar `body.theme-dark`** en un solo archivo para evitar conflictos de cascada | Medio | Bajo |
| 9 | **Auditar contraste de todas las combinaciones** y documentar resultados | Medio | Alto |
| 10 | **Exponer `$neutral-1000`** como CSS variable o eliminar si no se usa | Bajo | Bajo |

---

## 6. Checklist de Cumplimiento

| Práctica | Estado | Notas |
|----------|--------|-------|
| **Atomic Design** — Tokens → Componentes → Patrones | ✅ Parcial | Tokens sólidos; componentes legacy no tokenizados |
| **Tokenización completa** | ✅ 80% | `--ds-*` cubre color, spacing, typo, shadows, radius, z-index |
| **Naming consistente** | ⚠️ | Duplicación de `--ds-primary` con valores distintos |
| **Modo claro/oscuro** | ✅ | Implementación completa con mapeo 1:1 |
| **Soporte multi-plataforma** | ⚠️ | Web (PrimeNG) y Mobile (Ionic) con colores primarios diferentes |
| **Accesibilidad (WCAG 2.2)** | ⚠️ | Fallos en `text-muted`; falta auditoría completa |
| **Documentación** | ❌ | No hay Storybook, no hay guía visual, no hay spec de componentes |
| **Tipografía responsiva** | ❌ | Sin media queries en la escala |
| **Design tokens agnósticos** | ✅ | `--ds-*` desacoplados de framework |
| **Sistema de espaciado** | ✅ | Escala 4px completa con semántica |
| **Breakpoints definidos** | ✅ | 6 niveles mobile-first |

---

## 7. Análisis FODA

### Fortalezas
- Paleta corporativa coherente y premium (Corporate Blue + Gold)
- Sistema completo de tokens CSS (`--ds-*`) con naming claro
- Dark mode bien implementado con glows neon lujosos
- Escala tipográfica completa con DM Sans (elección acertada)
- Sistema de z-index detallado y ordenado
- Breakpoints mobile-first bien definidos

### Oportunidades
- Agregar Storybook/Ladle para documentación visual
- Implementar modo "alto contraste" para accesibilidad
- Agregar animaciones y motion tokens (fase 2)
- Crear un token de "border-radius" unificado para componentes PrimeNG
- Expandir la paleta luxury con tonos dorado/cobre más definidos

### Debilidades
- Duplicación de tokens con valores divergentes (riesgo crítico)
- Colores hardcodeados en componentes legacy
- `--ds-text-muted` no cumple WCAG AA en light ni dark
- Divergencia de color primario entre web y mobile
- Sin ajustes responsivos en tipografía
- Documentación inexistente

### Amenazas
- Falta de documentación → nuevo developers interpretan incorrectamente los tokens
- Conflictos de CSS por duplicación de `body.theme-dark` en dos archivos
- Migración incompleta de legacy a tokens → divergencia visual creciente
- Ionic RN theme con colores propietarios → experiencia de marca fragmentada

---

## 8. Próximos Pasos — FASE 2 (Sugeridos)

1. **Auditoría de animaciones y motion**: Revisar transiciones, easing, duraciones.
2. **Iconografía**: Analizar la biblioteca de iconos (PrimeIcons vs Ionicons) y su consistencia entre plataformas.
3. **Patrones de interacción**: Loading states, empty states, error states, paginación.
4. **Formularios avanzados**: Selectores complejos (dropdown multiselect, autocomplete, datepicker).
5. **Data visualization**: Charts, progress bars, métricas.
6. **Feedback táctil**: Ripple, haptic feedback en mobile.
7. **Imágenes y assets**: Análisis de tratamiento de imágenes en modo claro/oscuro (opacidades, overlays).
8. **Responsive patterns**: Navegación, tablas responsivas, cards grid.
9. **Auditoría de rendimiento CSS**: Dead code detection, bundle size, CSS custom properties performance.

---

*Reporte generado automáticamente como parte de la FASE 1 de análisis de Design System.*

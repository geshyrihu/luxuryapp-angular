# AUDITORÍA COMPLETA DE SISTEMA DE DISEÑO — CRM/ERP (LuxuryApp)

## CONTEXTO

Hemos realizado múltiples cambios y ajustes en las siguientes rutas:

- **Componentes:** `D:\repos\luxuryapp-api\client\angular\src\app\features\system\catalogs\catalog-component-ui`
- **Estilos globales:** `D:\repos\luxuryapp-api\client\angular\src\styles`

La aplicación es un **CRM/ERP de nivel enterprise** con soporte dual:

- 🖥️ **Web:** Angular + PrimeNG
- 📱 **Mobile:** Ionic (Angular)

---

## TAREA 1: ANÁLISIS DE BRECHAS DE COMPONENTES (GAP ANALYSIS)

### 1.1 Inventario Actual

Analiza TODOS los componentes existentes en `catalog-component-ui/` y genera:

- Un catálogo completo organizado por categoría (formularios, tablas, navegación, feedback, data display, layout, overlay, media, etc.)
- Para cada componente: nombre, propósito, variantes disponibles, plataformas soportadas (web/mobile/ambas)

### 1.2 Componentes Faltantes para un CRM/ERP Completo

Evalúa contra las necesidades típicas de un CRM/ERP empresarial e identifica qué componentes **faltan o están incompletos**. Considera las siguientes áreas funcionales:

#### A) Gestión de Datos y Tablas

- [ ] Tablas avanzadas (sort, filter, paginación, selección múltiple, columnas reordenables, export)
- [ ] DataGrid editable (inline editing, cell editing)
- [ ] Virtual scroll para grandes datasets
- [ ] Tree table / Tabla jerárquica
- [ ] Pivot table
- [ ] Kanban board
- [ ] Gantt chart
- [ ] Timeline / Línea de tiempo

#### B) Formularios y Entradas

- [ ] Form builder dinámico (generador de formularios desde JSON/schema)
- [ ] Multi-step form / Wizard / Stepper
- [ ] File upload avanzado (drag & drop, preview, progress, múltiple)
- [ ] Rich text editor / WYSIWYG
- [ ] Signature pad
- [ ] Color picker
- [ ] Date range picker avanzado
- [ ] Autocomplete/combobox con búsqueda remota
- [ ] Transfer list (dual listbox)
- [ ] Input mask / Formatted inputs (teléfono, moneda, documento ID)
- [ ] Rating / Stars
- [ ] Toggle switch con estados intermedios
- [ ] Slider / Range slider
- [ ] OTP input

#### C) Navegación y Layout

- [ ] Breadcrumbs dinámicos
- [ ] Sidebar colapsable con menú multinivel
- [ ] Tab panels con lazy loading
- [ ] Split pane / Resizable panels
- [ ] Dock / Toolbar personalizable
- [ ] Mega menu
- [ ] Context menu / Right-click menu
- [ ] Bottom navigation (mobile)
- [ ] Tab bar (mobile)
- [ ] Floating Action Button (mobile)
- [ ] Pull to refresh (mobile)
- [ ] Swipe actions (mobile)

#### D) Feedback y Comunicación

- [ ] Toast/Snackbar con cola y posiciones
- [ ] Confirmation dialog (reutilizable, con tipos: danger, warning, info)
- [ ] Skeleton/Loading placeholders (por tipo de componente)
- [ ] Empty state components (ilustrados, con CTA)
- [ ] Error boundary / Error state
- [ ] Progress indicators (linear, circular, step progress)
- [ ] Notification center / Bell con badge y dropdown
- [ ] Tour / Onboarding / Coach marks
- [ ] Changelog / What's new modal

#### E) Data Display

- [ ] KPI cards / Metric cards con tendencia
- [ ] Stat cards con sparklines
- [ ] Profile card / User card
- [ ] Activity feed / Audit log viewer
- [ ] Comment thread / Discussion component
- [ ] Tag/Chip system con autocomplete
- [ ] Badge system (con variantes de severidad)
- [ ] Avatar group (stacked)
- [ ] Comparison table
- [ ] QR code generator/viewer
- [ ] Barcode scanner (mobile)

#### F) Gráficos y Dashboards

- [ ] Chart wrapper (barras, líneas, pie, donut, area, radar)
- [ ] Dashboard layout builder (drag & drop widgets)
- [ ] Metric gauge / Speedometer
- [ ] Funnel chart
- [ ] Heatmap
- [ ] Real-time data indicator

#### G) CRM Específico

- [ ] Contact card con acciones rápidas
- [ ] Pipeline / Deal stages visual
- [ ] Lead scoring visual component
- [ ] Email template previewer
- [ ] Activity logger (calls, meetings, emails, notes)
- [ ] Customer 360 view layout
- [ ] Territory map

#### H) ERP Específico

- [ ] Invoice/document previewer (PDF inline)
- [ ] Approval workflow visualizer
- [ ] Inventory level indicator
- [ ] Order status tracker (visual steps)
- [ ] Receipt/PO scanner (mobile)
- [ ] Barcode/QR lookup input

#### I) Accesibilidad y UX

- [ ] Skip navigation link
- [ ] Focus trap (modals, dialogs)
- [ ] Live region announcer (screen readers)
- [ ] Keyboard shortcut manager / Command palette (Ctrl+K)
- [ ] Theme switcher (light/dark/high-contrast)
- [ ] Language/region selector
- [ ] Session timeout warning
- [ ] Offline indicator
- [ ] Print-friendly view wrapper

### 1.3 Matriz de Cobertura Web vs Mobile

Genera una matriz que cruce:
| Componente | Web (PrimeNG) | Mobile (Ionic) | Estado | Prioridad |
|------------|:---:|:---:|:---:|:---:|
| ... | ✅/⚠️/❌ | ✅/⚠️/❌ | Completo/Parcial/Faltante | Alta/Media/Baja |

### 1.4 Recomendaciones de Priorización

Usa el framework **RICE** (Reach, Impact, Confidence, Effort) o similar para priorizar los componentes faltantes según:

- Frecuencia de uso en módulos CRM/ERP
- Impacto en la experiencia del usuario
- Complejidad de implementación
- Dependencias con otros componentes

---

## TAREA 2: AUDITORÍA DEL SISTEMA DE COLORES

### 2.1 Inventario de Paleta Actual

Analiza todos los archivos en `src/styles/` (SCSS/CSS variables, themes, tokens) y extrae:

- **Colores primarios:** hex, rgb, hsl
- **Colores secundarios y acentos**
- **Colores semánticos:** success, warning, danger/error, info
- **Colores neutros/grises:** escala completa
- **Colores de fondo:** surfaces, backgrounds, elevated surfaces
- **Colores de texto:** primary, secondary, disabled, inverse
- **Colores de borde**
- **Colores de overlay/backdrop**
- **Colores de focus/accessibility**
- **Gradientes definidos**

### 2.2 Coherencia y Armonía de Color

Evalúa:

- ¿Los colores siguen una **escala cromática consistente** (mismos pasos de luminosidad/saturación)?
- ¿Existe un **sistema de tokens/nombres semánticos** o se usan valores hardcodeados?
- ¿Hay **colores huérfanos** (usados una sola vez, fuera de la paleta)?
- ¿Los colores de PrimeNG y Ionic están **unificados** o divergen?
- ¿Existe coherencia entre light mode y dark mode (si aplica)?
- Genera un **mapa visual de la paleta** con todos los tokens encontrados

### 2.3 Cumplimiento WCAG 2.1/2.2 (Accesibilidad)

Para CADA combinación de color usada (texto sobre fondo, icono sobre fondo, borde sobre fondo):

- **Contraste mínimo AA (4.5:1)** para texto normal
- **Contraste mínimo AA Large (3:1)** para texto grande (≥18px o ≥14px bold)
- **Contraste mínimo AAA (7:1)** para texto normal (recomendado)
- **Contraste de elementos no-texto (3:1)** para iconos, bordes de input, indicadores

Genera una tabla:
| Combinación | Foreground | Background | Ratio | AA Normal | AA Large | AAA | Estado |
|-------------|-----------|------------|-------|-----------|----------|-----|--------|
| Texto primario sobre bg | #XXXXXX | #XXXXXX | X.X:1 | ✅/❌ | ✅/❌ | ✅/❌ | OK/FIX |

### 2.4 Teoría del Color y Percepción

- ¿La paleta usa un **esquema de color coherente** (complementario, análogo, triádico, split-complementary)?
- ¿Se respeta la **regla 60-30-10** (dominante, secundario, acento)?
- ¿Los colores transmiten la **identidad de marca** apropiada para un CRM/ERP enterprise (confianza, profesionalismo, claridad)?
- Análisis de **fatiga visual**: ¿los fondos son demasiado blancos/demasiado oscuros? ¿Hay suficiente variedad de surfaces?
- ¿Se consideran usuarios con **daltonismo** (deuteranopia, protanopia, tritanopia)? ¿Se usa solo color para transmitir información o hay soporte con iconos/patrones?

### 2.5 Consistencia Cross-Platform

- ¿Los mismos tokens de color se aplican en PrimeNG theme y Ionic theme?
- ¿Los componentes nativos de Ionic (que usan CSS variables propias) están sobreescritos correctamente?
- Genera un **mapeo de variables** entre el design token system → PrimeNG variables → Ionic CSS variables

---

## TAREA 3: AUDITORÍA DEL SISTEMA TIPOGRÁFICO

### 3.1 Inventario Tipográfico

Extrae de los estilos:

- **Familias tipográficas** usadas (font-family stack completo)
- **Escala tipográfica** (todos los font-size definidos, organizados de menor a mayor)
- **Pesos tipográficos** (font-weight) en uso
- **Alturas de línea** (line-height) por cada tamaño
- **Letter-spacing** por cada tamaño
- **Estilos de texto** definidos (headings, body, caption, overline, etc.)

### 3.2 Escala Tipográfica Modular

Verifica si los tamaños siguen una **escala modular armónica**:

- ¿Se usa un ratio consistente (Major Third 1.25, Perfect Fourth 1.333, Golden Ratio 1.618)?
- ¿O los tamaños son arbitrarios?
- Genera la escala actual vs una escala recomendada

### 3.3 Consistencia en Componentes

Para cada componente analizado, verifica:

- ¿Usa los tokens tipográficos del sistema o tiene valores hardcodeados?
- ¿Los headings mantienen jerarquía visual clara (h1 > h2 > h3 > h4)?
- ¿El body text tiene al menos 16px para legibilidad?
- ¿Los textos auxiliares (labels, captions, hints) tienen contraste y tamaño suficiente?
- ¿Los textos en tablas son legibles (mínimo 13-14px)?
- ¿Los textos en mobile son touch-friendly y legibles (mínimo 16px para inputs, evitar zoom)?

### 3.4 Tipografía Responsive

- ¿Existe ajuste de font-size entre web y mobile?
- ¿Se usa clamp(), viewport units, o breakpoints para tipografía fluida?
- ¿Los headings se escalan proporcionalmente en mobile?

### 3.5 Legibilidad y UX

- ¿El line-height es al menos 1.5 para body text?
- ¿El max-width de líneas de texto largo es 60-80 caracteres?
- ¿Los textos de formularios (labels, placeholders, errors, hints) tienen jerarquía clara?
- ¿Los estados (disabled, readonly) se comunican tipográficamente además del color?

---

## TAREA 4: ENTREGABLES ESPERADOS

### Documento 1: Catálogo de Componentes

- Lista completa con clasificación
- Matriz de cobertura web/mobile
- Gap analysis con priorización

### Documento 2: Informe de Auditoría de Color

- Paleta extraída y visualizada
- Tabla de contraste WCAG completa
- Lista de violaciones con sugerencias de corrección (color alternativo más cercano que cumpla)
- Recomendaciones de tokens faltantes

### Documento 3: Informe de Auditoría Tipográfica

- Escala actual vs recomendada
- Lista de inconsistencias por componente
- Propuesta de type scale unificada

### Documento 4: Design Token Proposal

Proponer un sistema completo de design tokens en formato SCSS variables y/o CSS custom properties:

```scss
// Ejemplo de estructura esperada
:root {
  // Color tokens
  --color-primary-50: #...;
  --color-primary-100: #...;
  // ... hasta 900

  // Semantic tokens
  --color-surface-default: #...;
  --color-surface-elevated: #...;
  --color-text-primary: #...;
  --color-text-secondary: #...;

  // Typography tokens
  --font-family-base: "...", sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  // ...

  // Spacing tokens (si aplica)
  --spacing-xs: 0.25rem;
  // ...

  // Border radius tokens
  --radius-sm: 4px;
  // ...
}
```

Documento 5: Plan de Acción
Issues clasificados por severidad: 🔴 Crítico (accesibilidad), 🟡 Importante (consistencia), 🟢 Mejora (optimización)
Orden de implementación sugerido
Estimación de esfuerzo por tarea
REGLAS DE ANÁLISIS
No asumas: Si no encuentras evidencia en el código, márcalo como "No encontrado" en vez de inventar
Sé específico: Cita el archivo y línea exacta donde encuentres cada hallazgo
Propón soluciones: Cada problema debe venir con al menos una solución concreta (código o valor alternativo)
Prioriza la accesibilidad: WCAG AA es el mínimo obligatorio, AAA es el objetivo
Piensa enterprise: Los usuarios usan la app 8+ horas al día, la fatiga visual y la eficiencia son críticas
Doble plataforma: Cada hallazgo debe considerar tanto PrimeNG (web) como Ionic (mobile)
Luxury branding: Al ser una app "Luxury", la estética debe transmitir premium, sofisticación y confianza sin sacrificar usabilidad
Comienza analizando primero los archivos en src/styles/ para establecer el baseline del sistema de diseño, luego procede al análisis de componentes en catalog-component-ui/.

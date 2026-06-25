# AUDITORÍA COMPLETA DE SISTEMA DE DISEÑO — CRM/ERP (LuxuryApp)

## CONTEXTO

Hemos realizado múltiples cambios y ajustes en las siguientes rutas:

- **Componentes:** `D:\repos\luxuryapp-api\client\angular\src\app\features\system\catalogs\catalog-component-ui`
- **Estilos globales:** `D:\repos\luxuryapp-api\client\angular\src\styles`

La aplicación es un **CRM/ERP de nivel enterprise** con soporte dual:

- 🖥️ **Web:** Angular + PrimeNG 21
- 📱 **Mobile:** Ionic (Angular 21)

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

### 1.4 Auditoría de Cobertura Ionic Nativo

Para la página `catalog-mobile/`, contrasta **todos los componentes Ionic disponibles** en `node_modules/@ionic/core/components/` contra los **realmente importados/usados** en `catalog-mobile/components/*.ts` y `shared/mobile-core-coverage.ts`.

Genera una tabla por cada categoría listando cada componente Ionic nativo, indicando si está ✅ implementado, ⚠️ parcial o ❌ ausente:

| Categoría | Componente Ionic | Implementado | Ubicación |
|-----------|-----------------|:---:|----------|

#### A) Estructura de Página (Layout)

| Componente | Descripción |
|-----------|-------------|
| `ion-header` | Barra superior fija |
| `ion-footer` | Barra inferior fija |
| `ion-content` | Área de contenido scrollable |
| `ion-toolbar` | Toolbar dentro de header/footer |
| `ion-title` | Título dentro de toolbar |
| `ion-buttons` | Contenedor de botones en toolbar |
| `ion-back-button` | Botón de retroceso por defecto |
| `ion-split-pane` | Panel dividido responsive |
| `ion-app` | Contenedor raíz de la app |

#### B) Navegación y Tabs

| Componente | Descripción |
|-----------|-------------|
| `ion-tabs` | Contenedor de tabs |
| `ion-tab-bar` | Barra de tabs inferior |
| `ion-tab-button` | Botón individual de tab |
| `ion-segment` | Segment control (tabs estilizados) |
| `ion-segment-button` | Botón de segment |
| `ion-segment-content` | Contenido de segment |
| `ion-segment-view` | Vista de segment |
| `ion-menu` | Menú lateral (drawer) |
| `ion-menu-button` | Botón para abrir menú |
| `ion-menu-toggle` | Toggle de menú |
| `ion-nav` | Navegación stack |
| `ion-nav-link` | Link de navegación |
| `ion-router-outlet` | Router outlet nativo |

#### C) Formularios y Entradas

| Componente | Descripción |
|-----------|-------------|
| `ion-input` | Input de texto nativo |
| `ion-textarea` | Área de texto nativa |
| `ion-searchbar` | Barra de búsqueda Ionic |
| `ion-select` | Select nativo |
| `ion-select-modal` | Modal de selección |
| `ion-select-popover` | Popover de selección |
| `ion-select-option` | Opción de select |
| `ion-checkbox` | Checkbox nativo |
| `ion-radio` | Radio button nativo |
| `ion-radio-group` | Grupo de radios |
| `ion-toggle` | Toggle/switch nativo |
| `ion-range` | Range slider nativo |
| `ion-datetime` | Date/time picker nativo |
| `ion-datetime-button` | Botón que dispara datetime |
| `ion-picker` | Picker wheel |
| `ion-picker-column` | Columna de picker |
| `ion-picker-column-option` | Opción de picker column |
| `ion-input-otp` | Input OTP (código de verificación) |
| `ion-input-password-toggle` | Toggle de visibilidad de password |

#### D) Feedback y Overlays

| Componente | Descripción |
|-----------|-------------|
| `ion-alert` | Alerta/dialogo nativo |
| `ion-action-sheet` | Action sheet bottom |
| `ion-toast` | Toast notification |
| `ion-loading` | Loading overlay |
| `ion-modal` | Modal dialog |
| `ion-popover` | Popover contextual |
| `ion-spinner` | Spinner de carga |
| `ion-progress-bar` | Barra de progreso |
| `ion-skeleton-text` | Skeleton placeholder |
| `ion-infinite-scroll` | Scroll infinito |
| `ion-infinite-scroll-content` | Contenido de scroll infinito |

#### E) Data Display

| Componente | Descripción |
|-----------|-------------|
| `ion-card` | Card container |
| `ion-card-header` | Header de card |
| `ion-card-content` | Contenido de card |
| `ion-card-title` | Título de card |
| `ion-card-subtitle` | Subtítulo de card |
| `ion-avatar` | Avatar circular |
| `ion-badge` | Badge numérico |
| `ion-chip` | Chip/tag |
| `ion-icon` | Icono Ionic |
| `ion-img` | Imagen optimizada |
| `ion-thumbnail` | Thumbnail cuadrado |
| `ion-text` | Texto con estilos |
| `ion-note` | Nota/ texto secundario |
| `ion-accordion` | Acordeón individual |
| `ion-accordion-group` | Grupo de acordeones |
| `ion-label` | Label de formulario |

#### F) Listas y Gestos

| Componente | Descripción |
|-----------|-------------|
| `ion-list` | Lista container |
| `ion-list-header` | Header de lista |
| `ion-item` | Item de lista |
| `ion-item-divider` | Divisor de items |
| `ion-item-group` | Grupo de items |
| `ion-item-sliding` | Item con swipe actions |
| `ion-item-options` | Contenedor de swipe options |
| `ion-item-option` | Opción individual de swipe |
| `ion-reorder` | Handle para reordenar |
| `ion-reorder-group` | Grupo reordenable |
| `ion-refresher` | Pull-to-refresh |
| `ion-refresher-content` | Contenido del refresher |
| `ion-ripple-effect` | Efecto ripple touch |

#### G) FAB y Acciones

| Componente | Descripción |
|-----------|-------------|
| `ion-fab` | Floating action button container |
| `ion-fab-button` | FAB button |
| `ion-fab-list` | Lista de FAB actions |
| `ion-button` | Button nativo Ionic |
| `ion-route` | Ruta interna |
| `ion-route-redirect` | Redirección interna |
| `ion-router` | Router interno |

#### H) Grid y Layout

| Componente | Descripción |
|-----------|-------------|
| `ion-grid` | Grid container |
| `ion-row` | Fila de grid |
| `ion-col` | Columna de grid |

#### I) Componentes Actualmente Implementados (a modo de baseline)

| Categoría | Componentes | Estado |
|-----------|-------------|:------:|
| Buttons | Uso de wrappers `custom-button-*` (web compilado, auto-detecta plataforma) | ✅ |
| Inputs | Wrappers `custom-input-*-signal` (web compilado, auto-detecta plataforma) | ✅ |
| Lists | `ion-list`, `ion-item`, `ion-item-divider`, `ion-label`, `ion-badge` | ⚠️ Parcial |
| Data Display | `ion-avatar`, `ion-chip`, `ion-icon`, `ion-badge` | ⚠️ Parcial |
| Feedback | `ion-spinner`, `ion-progress-bar` | ⚠️ Parcial |
| Navigation | `ion-fab`, `ion-fab-button` | ❌ Mínimo |
| Forms (nativos) | `ion-checkbox`, `ion-radio`, `ion-radio-group`, `ion-range`, `ion-toggle`, `ion-datetime`, `ion-select`, `ion-select-option` | ⚠️ Parcial |

### 1.5 Recomendaciones de Priorización

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
---

## TAREA 5: AUDITORÍA DE PÁGINAS DEL CATÁLOGO (PAGE-LEVEL AUDIT)

### 5.1 Inventario de Páginas vs Navegación

Genera un mapeo completo entre las 5 categorías del menú de navegación (nav) de `catalog-component-ui` y sus fuentes de contenido (nota: las rutas planas `/web`, `/mobile`, `/charts`, `/patterns`, `/layouts`, `/docs`, `/audit`, `/guia` se conservan como legacy, pero el menú las agrupa en 5 categorías):

| # | Grupo Nav | Sub-secciones | Directorios `pages/` involucrados |
|---|-----------|--------------|----------------------------------|
| 1 | Tokens & Identidad | — | `catalog-tokens/`, `catalog-tokens-item/` |
| 2 | Componentes | Web (PrimeNG), Mobile (Ionic), Gráficos | `catalog-web/`, `catalog-web-item/`, `catalog-mobile/`, `catalog-mobile-item/`, `catalog-charts/`, `catalog-charts-item/` |
| 3 | Core Components | — | `catalog-core/`, `catalog-core-item/` |
| 4 | Patrones y Layouts | Patrones UX, Layouts | `catalog-patterns/`, `catalog-patterns-item/`, `catalog-layouts/`, `catalog-layouts-item/` |
| 5 | Guía y Estándares | Guía ERP, Estándar Documental, Auditoría | `catalog-guia/`, `catalog-guia-item/`, `catalog-docs/`, `catalog-docs-item/`, `catalog-audit/`, `catalog-audit-item/` |

### 5.2 Verificaciones

#### 5.2.1 Análisis detallado por archivo de cada página

Para **cada directorio** `pages/catalog-{x}/` existente, analiza **todos** sus archivos:

- **`catalog-{x}.ts`**: componente, imports, dependencias, plataforma (web/mobile/ambas), si usa `standalone`, template y estilos asociados
- **`catalog-{x}.html`**: template completo, componentes renderizados, directivas estructurales (`@if`, `@for`), data binding, slots/ng-content
- **`catalog-{x}.scss`**: estilos, uso de `--ds-*` design tokens, valores hardcodeados, media queries, variables locales
- **`components/`** (si existe): listar todos los sub-componentes, verificar imports y uso dentro de la página
- **`index.ts`** (si existe): verificar que exporte correctamente el componente principal

Para cada archivo encontrado, documenta:
- Ruta completa y línea donde se define/importa cada elemento relevante
- Si la página contiene lógica de plataforma (detección web vs mobile)
- Si hay estilos inline vs hoja de estilos separada
- Si usa componentes PrimeNG en página mobile o viceversa (cross-platform leak)

#### 5.2.2 Verificación del patrón `*-item` (páginas item)

Cada categoría tiene un segundo directorio `pages/catalog-{x}-item/` que normalmente contiene un componente contenedor para vista de detalle/ítem individual. Verifica:

- [ ] ¿`catalog-{x}-item.ts` está correctamente importado y registrado?
- [ ] ¿Cuál es su propósito vs la página principal (`catalog-{x}`)?
- [ ] ¿Tiene template y estilos propios o es solo un re-export?
- [ ] ¿Comparte componentes con su página principal?
- [ ] ¿Hay duplicación de lógica entre `catalog-{x}` y `catalog-{x}-item`?

#### 5.2.3 Verificaciones de importación y consistencia

Para cada directorio `pages/` existente:

- [ ] ¿Está importado en `index.ts` raíz de `catalog-component-ui/`?
- [ ] ¿Está incluido en el `imports` array del @Component del layout principal?
- [ ] ¿Se renderiza en el template del layout dentro del `@if` / routing correspondiente?
- [ ] ¿Sus sub-componentes (en `components/`) están correctamente importados y usados dentro de la página?
- [ ] ¿Hay componentes huérfanos (en disco pero no importados)?
- [ ] ¿Hay componentes duplicados (mismo contenido en página principal e item)?

### 5.3 Consistencia de Contenido

- [ ] El contenido de cada página componente coincide con lo que la nav label describe
- [ ] Las páginas usan `--ds-*` design tokens en lugar de valores hardcodeados
- [ ] Las páginas implementan detección de plataforma donde corresponde (web vs mobile)
- [ ] No hay PrimeNG imports en páginas marcadas como 100% Ionic

### 5.4 Cobertura de Componentes por Página

Verifica que cada página contenga al menos los componentes que su categoría del nav promete:

| Categoría | Componentes esperados en pantalla |
|-----------|----------------------------------|
| Tokens & Identidad | Color palette, Typography scale |
| Web (PrimeNG) | Todos los wrappers de PrimeNG (inputs, buttons, data, overlays, feedback) |
| Mobile (Ionic) | **Todos los componentes Ionic nativos** listados en la sección 1.4 (A-I). No solo los 7 grupos actuales. Debe incluir estructura de página, navegación, tabs, segment, menú, overlays, gestos, pickers, OTP, skeleton, refresher, reorder, sliding items, grid, card, accordion, etc. |
| Gráficos | Bar, Pie, Line, Doughnut, Radar charts |
| Core Components | ActionMenu, AppIcon, StatusBadge, Loader, Wizard, EmptyState, etc. |
| Patrones UX | Complex Card, Data Table Hybrid, Login Reference, Navigation Reference |
| Estándar Documental | Document Types, Nomenclature, Access Matrix |
| Auditoría | Content Blocks, Quick Checklist |
| Layouts | Full Width, Sidebar+Content, Master-Detail, Wizard, Split Panels |
| Guía ERP | Identity, Color Validation, Component Catalog, Button Rules, Reference Form |

### 5.5 Acciones Correctivas

Si se encuentra algún desajuste:
- **Página no importada pero con contenido inline**: integrar la página (reemplazar inline)
- **Página no importada sin contenido inline**: eliminar (dead code)
- **Página importada pero sin contenido**: eliminar o crear contenido
- **Página duplicada vs inline**: consolidar (elegir uno, eliminar el otro)

### 5.6 Verificación de Cobertura Ionic (Mobile Catalog)

Para la página `catalog-mobile/`, verifica **exhaustivamente** qué componentes Ionic están cubiertos:

#### 5.6.1 Inventario de imports Ionic

Analiza todos los archivos en:
- `pages/catalog-mobile/catalog-mobile.ts`
- `pages/catalog-mobile/components/*/mobile-*.ts`
- `pages/catalog-mobile-item/catalog-mobile-item.ts`
- `shared/mobile-core-coverage.ts`

Extrae la lista completa de imports de `@ionic/angular/standalone`. Luego contrasta contra los ~90+ componentes disponibles en `node_modules/@ionic/core/components/`.

#### 5.6.2 Matriz de brecha (gap) por sub-componente

Para **cada uno** de los componentes listados en 1.4.A a 1.4.H, genera una entrada:

| Componente | ¿Importado? | ¿Renderizado en template? | ¿En página principal o item? | Severidad |
|-----------|:-----------:|:------------------------:|:---------------------------:|:---------:|
| `ion-header` | ❌ | ❌ | — | 🔴 Alta |
| `ion-tabs` | ❌ | ❌ | — | 🔴 Alta |
| ... | ❌ | ❌ | — | 🟡 Media |

#### 5.6.3 Verificación de patrones mobile específicos

- [ ] ¿Existe showcase de **pull-to-refresh** (`ion-refresher`)?
- [ ] ¿Existe showcase de **swipe actions** (`ion-item-sliding`, `ion-item-options`, `ion-item-option`)?
- [ ] ¿Existe showcase de **tab navigation** (`ion-tabs`, `ion-tab-bar`, `ion-tab-button`)?
- [ ] ¿Existe showcase de **segment control** (`ion-segment`, `ion-segment-button`)?
- [ ] ¿Existe showcase de **menú lateral** (`ion-menu`)?
- [ ] ¿Existe showcase de **action sheet** (`ion-action-sheet`)?
- [ ] ¿Existe showcase de **alert dialog** (`ion-alert`)?
- [ ] ¿Existe showcase de **modal** (`ion-modal`)?
- [ ] ¿Existe showcase de **toast** (`ion-toast`)?
- [ ] ¿Existe showcase de **loading overlay** (`ion-loading`)?
- [ ] ¿Existe showcase de **skeleton text** (`ion-skeleton-text`)?
- [ ] ¿Existe showcase de **infinite scroll** (`ion-infinite-scroll`)?
- [ ] ¿Existe showcase de **picker** (`ion-picker`, `ion-picker-column`)?
- [ ] ¿Existe showcase de **OTP input** (`ion-input-otp`)?
- [ ] ¿Existe showcase de **card** (`ion-card`, `ion-card-header`, `ion-card-content`, `ion-card-title`, `ion-card-subtitle`)?
- [ ] ¿Existe showcase de **accordion** (`ion-accordion`, `ion-accordion-group`)?
- [ ] ¿Existe showcase de **grid** (`ion-grid`, `ion-row`, `ion-col`)?
- [ ] ¿Existe showcase de **searchbar** (`ion-searchbar`)?
- [ ] ¿Existe showcase de **datetime button** (`ion-datetime-button`)?
- [ ] ¿Existe showcase de **reorder** (`ion-reorder`, `ion-reorder-group`)?
- [ ] ¿Existe showcase de **ripple effect** (`ion-ripple-effect`)?
- [ ] ¿Existe showcase de **split pane** (`ion-split-pane`)?
- [ ] ¿Existe showcase de **estructura de página completa** (`ion-header` + `ion-content` + `ion-footer`)?
- [ ] ¿Existe showcase de **back button** (`ion-back-button`)?

#### 5.6.4 Reporte de cobertura general

Genera un resumen con:

```
Cobertura Ionic: X / ~95 componentes (Y%)
  - Estructura:     X/9  (listado de faltantes)
  - Navegación:     X/11 (listado de faltantes)
  - Formularios:    X/17 (listado de faltantes)
  - Feedback:       X/10 (listado de faltantes)
  - Data Display:   X/15 (listado de faltantes)
  - Listas/Gestos:  X/13 (listado de faltantes)
  - FAB/Acciones:   X/7  (listado de faltantes)
  - Grid:           X/3  (listado de faltantes)
  - Implementados:  X/20 (listado actual)
```

---

REGLAS DE ANÁLISIS
No asumas: Si no encuentras evidencia en el código, márcalo como "No encontrado" en vez de inventar
Sé específico: Cita el archivo y línea exacta donde encuentres cada hallazgo
Propón soluciones: Cada problema debe venir con al menos una solución concreta (código o valor alternativo)
Prioriza la accesibilidad: WCAG AA es el mínimo obligatorio, AAA es el objetivo
Piensa enterprise: Los usuarios usan la app 8+ horas al día, la fatiga visual y la eficiencia son críticas
Doble plataforma: Cada hallazgo debe considerar tanto PrimeNG (web) como Ionic (mobile)
Luxury branding: Al ser una app "Luxury", la estética debe transmitir premium, sofisticación y confianza sin sacrificar usabilidad
Comienza analizando primero los archivos en src/styles/ para establecer el baseline del sistema de diseño, luego procede al análisis de componentes en catalog-component-ui/.

**Cobertura Ionic es una verificación OBLIGATORIA.** No omitir. La sección 1.4 y 5.6 deben ejecutarse siempre. La meta es alcanzar >80% de cobertura de componentes Ionic nativos en el catálogo mobile.

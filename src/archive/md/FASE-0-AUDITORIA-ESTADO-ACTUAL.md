# Fase 0 - Auditoría Técnica y de Diseño

**Fecha:** 2026-06-27
**Ruta auditada:** `client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/`
**Fuentes contrastadas:** `src/styles/`, `src/app/core/`, `src/app/core/layout/employee-view/monitor/sidebar/sidebar.ts`, `src/app/routing/settings.routing.ts`, `src/app/mypreset.ts`

## 1. Diagnóstico Ejecutivo

El catálogo UI ya existe, enruta y tiene una base de tokens real. El problema no es ausencia de infraestructura; el problema es **gobierno**.

Estado real:

- La fuente de verdad implementada para color y tipografía vive en `src/styles/core/_colors.scss`, `src/styles/core/_typography.scss` y `src/styles/theme/_variables.scss`.
- El catálogo actual mezcla cuatro capas en un mismo espacio: documentación, demos de PrimeNG/Ionic, showcase de componentes core y deuda técnica histórica.
- El `sidebar.ts` sí funciona como índice navegable, pero **no es todavía el índice oficial de un catálogo atómico dual Web/Móvil**. Hoy es un árbol híbrido de demos.
- Hay evidencia de **encoding corrupto** en múltiples `.md` y `.ts` (`ActÃºa`, `GrÃ¡ficos`, `CatÃ¡logos`, etc.), lo cual contradice la regla de UTF-8 sin BOM.
- Existen hardcodes todavía dentro del catálogo, sobre todo en demos de calendario, avatar, email preview y estilos inline con fallbacks.

Conclusión:

El siguiente paso correcto no es rehacer tokens. El paso correcto es **consolidar la documentación, declarar una sola verdad implementada y separar catálogo oficial vs. sandbox de demos**.

---

## 2. Informe de Depuración `.md`

### 2.1 Clasificación de archivos

| Archivo                                 | Clasificación           | Acción                                  | Motivo                                                                            |
| --------------------------------------- | ----------------------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| `ANALISIS-PROMPT-V2.md`                 | Servible y reutilizable | Conservar                               | Define el objetivo de auditoría Fase 0.                                           |
| `AUDITORIA-COMPLETA.md`                 | A migrar                | Consolidar en `DESIGN_SYSTEM_LEGACY.md` | Tiene hallazgos históricos útiles, pero mezcla estado resuelto con backlog viejo. |
| `INVENTARIO-DS-REVISION.md`             | A migrar                | Consolidar en `DESIGN_SYSTEM_LEGACY.md` | Útil como referencia histórica, no como fuente actual.                            |
| `PLAN-AUDITORIA-GENERAL.md`             | Obsoleto o redundante   | Archivar                                | Parte de un contexto previo; ya no refleja el estado real del repositorio.        |
| `PLAN-DE-ACCION-ARCHIVO.md`             | Obsoleto o redundante   | Archivar                                | El propio nombre y contenido lo declaran histórico.                               |
| `PLAN-DE-ACCION.md`                     | Servible y reutilizable | Conservar                               | Sigue siendo útil como backlog operativo DS.                                      |
| `PROPUESTA-APP-TABLE.md`                | A migrar                | Consolidar en `DESIGN_SYSTEM_LEGACY.md` | El concepto es valioso, pero no debe vivir aislado del catálogo.                  |
| `SESION-PROGRESO.md`                    | Servible y reutilizable | Conservar                               | Es útil como bitácora de continuidad.                                             |
| `pages/catalog-charts/DESIGN-SYSTEM.md` | A migrar                | Consolidar en `DESIGN_SYSTEM_LEGACY.md` | Aporta contexto temático, pero no debe fragmentar el estándar.                    |
| `src/styles/AUDIT-STYLES.md`            | Servible y reutilizable | Conservar                               | Es la mejor guía actual para auditar la capa de estilos.                          |
| `src/styles/estandar-hoja-estilos.md`   | Servible y reutilizable | Conservar                               | Documenta la arquitectura real de `src/styles/`.                                  |
| `AGENTS.md`                             | Servible y reutilizable | Conservar                               | Define restricciones operativas del repo.                                         |
| `CLAUDE.md`                             | Obsoleto o redundante   | Archivar                                | No aporta valor directo al Design System.                                         |
| `GEMINI.md`                             | Obsoleto o redundante   | Archivar                                | No aporta valor directo al Design System.                                         |

### 2.2 Comandos sugeridos para limpieza / archivo

No recomiendo borrar todavía. Recomiendo **archivar** primero.

```powershell
New-Item -ItemType Directory -Force client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/archive/md
Move-Item client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/PLAN-AUDITORIA-GENERAL.md client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/archive/md/
Move-Item client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/PLAN-DE-ACCION-ARCHIVO.md client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/archive/md/
Move-Item CLAUDE.md client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/archive/md/
Move-Item GEMINI.md client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/archive/md/
```

### 2.3 Archivo legado consolidado

Se creó:

- `client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui/DESIGN_SYSTEM_LEGACY.md`

Su propósito es concentrar los insumos históricos rescatables y quitar presión documental al árbol principal.

---

## 3. Design Tokens Definitivos

### 3.1 Fuente de verdad implementada

La verdad actual del sistema no está en los `.md`. Está en:

- `src/styles/core/_colors.scss`
- `src/styles/core/_typography.scss`
- `src/styles/core/_variables.scss`
- `src/styles/theme/_variables.scss`

### 3.2 Tokens canónicos propuestos

```scss
// Color
$primary-500: #003d9b;
$primary-600: #0040a2;
$primary-700: #003079;
$primary-100: #dae2ff;

$secondary-900: #0f172a;
$secondary-600: #475569;
$secondary-200: #e2e8f0;

$success-600: #16a34a;
$warning-500: #f59e0b;
$danger-600: #dc2626;
$info-600: #0891b2;

// Typography
$font-family-base: "Inter", "Hanken Grotesk", sans-serif;
$font-family-heading: "Hanken Grotesk", "Inter", sans-serif;
$font-family-mono: "JetBrains Mono", "Roboto Mono", "Courier New", monospace;
```

### 3.3 Reglas de gobierno

- `core/_colors.scss` define la paleta SCSS.
- `theme/_variables.scss` expone CSS custom properties `--ds-*`.
- `prime-overrides/` consume tokens; no inventa marca.
- `catalog-component-ui` solo debe **mostrar** tokens, no redefinirlos.

---

## 4. Matriz de Inconsistencias de Marca

| #   | Token / criterio          | Documentado                                  | Implementado                                                                              | Severidad | Recomendación                                                                 |
| --- | ------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| 1   | Fuente de verdad DS       | Varios `.md` compiten entre sí               | `src/styles/core/*` + `theme/_variables.scss`                                             | Alta      | Declarar una única fuente de verdad implementada.                             |
| 2   | Estructura del catálogo   | Catálogo dual por componente                 | Navegación segmentada por dominio (`web`, `mobile`, `core`, `charts`)                     | Alta      | Separar catálogo oficial de sandbox.                                          |
| 3   | Encoding                  | UTF-8 sin BOM exigido                        | Hay mojibake visible en `.md`, `sidebar.ts`, `settings.routing.ts`, `mypreset.ts` y demos | Crítica   | Corregir encoding antes de seguir expandiendo documentación.                  |
| 4   | Color warning como texto  | Uso semántico amplio                         | `#f59e0b` sobre blanco da `2.15:1`                                                        | Crítica   | No usar `warning` como texto normal; solo badge, borde o fondo.               |
| 5   | Success / info como texto | Se usan como acento general                  | `#16a34a` = `3.3:1`, `#0891b2` = `3.68:1` sobre blanco                                    | Alta      | Restringirlos a texto grande, iconografía o fondos suaves.                    |
| 6   | Hardcodes en demos        | El catálogo debería ser token-driven         | Persisten hex en `catalog-web-item.ts` y `catalog-core-item.ts`                           | Alta      | Sustituir por `var(--ds-*)` o documentar excepción.                           |
| 7   | Catálogo de color         | Tokens estructurales y operativos ya existen | Algunos demos aún muestran valores embebidos                                              | Media     | Centralizar cualquier muestra cromática en `tokens-colors.ts`.                |
| 8   | Sidebar como arquitectura | Debería ser índice oficial                   | Hoy mezcla guías, docs, auditoría, core, charts y layouts                                 | Alta      | Reducirlo a Foundations / Atoms / Molecules / Organisms / Templates / Legacy. |

---

## 5. Auditoría de Componentes

## 5.1 `catalog-component-ui` - inventario funcional

| Área                    | Tipo   | Estado               | Hallazgo                                                                  | Acción                                          |
| ----------------------- | ------ | -------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- |
| `catalog-tokens-item`   | Ambos  | Apto                 | Usa `tokens-colors` y `tokens-typography` como punto único de exhibición. | Mantener como base del catálogo.                |
| `catalog-web-item`      | Web    | Candidato a refactor | Un solo archivo muy grande con showcase + reglas + ejemplos + hardcodes.  | Partir por componente o por patrón.             |
| `catalog-mobile-item`   | Mobile | Candidato a refactor | Está segregado por familias mobile, no por paridad con Web.               | Reorganizar por componente dual.                |
| `catalog-core-item`     | Ambos  | Candidato a refactor | Mezcla componentes genéricos con widgets de negocio y demos muy extensos. | Separar `core reusable` vs `business showcase`. |
| `catalog-charts-item`   | Web    | Candidato a refactor | Útil, pero charts deben quedar como organismo, no como isla documental.   | Reubicar bajo `organisms/data-visualization`.   |
| `catalog-docs-item`     | Ambos  | Candidato a refactor | Más guía de dominio que componente reusable.                              | Mover a documentación, no al catálogo atómico.  |
| `catalog-guia-item`     | Ambos  | A migrar             | Es estándar/gobernanza, no componente.                                    | Reubicar como documentación del sistema.        |
| `catalog-audit-item`    | Ambos  | A migrar             | Auditoría interna, no parte del escaparate final.                         | Archivar o mover a `legacy`.                    |
| `catalog-patterns-item` | Ambos  | Apto con refactor    | Tiene valor como patrones de composición.                                 | Mantener, pero fuera de átomos/moléculas.       |
| `catalog-layouts-item`  | Ambos  | Apto con refactor    | Encaja como templates/layouts.                                            | Mantener como capa superior del catálogo.       |

## 5.2 `core/components` - clasificación estratégica

### Aptos para el catálogo

- `action-menu`
- `app-icon`
- `data-view-mobile`
- `loader`
- `empty-state`
- `confirm-dialog`
- `date-range`
- `status-badge`
- `wizard`
- `avatar-group`
- `kpi-card`
- `timeline`
- `slider`
- `rating`
- `skeleton-presets`
- `comparison-table`
- `context-menu`
- `split-pane`
- `command-palette`
- `gauge`
- `funnel-chart`
- `dock`
- `qr-code`

### Candidatos a refactorización

- `app-table`
- `buttons/*`
- `inputs/*`
- `file-upload`
- `data-grid`
- `pipeline-crm`
- `tree-table`
- `kanban-board`
- `dashboard-layout`
- `document-previewer`
- `approval-workflow`
- `order-status`
- `lead-scoring`
- `comment-thread`
- `email-preview`
- `form-builder`
- `signature-pad`
- `color-picker`
- `tristate-switch`
- `heatmap`
- `gantt`
- `pivot-table`
- `otp-input`

### Obsoletos, demasiado específicos o fuera del catálogo reusable

- `bitacora-filtro-fecha`
- `header-customer`
- `mesanio`
- `rango-calendario-mes-anio`
- `rango-calendario-yyyymmdd`
- `report-header`
- `title-page-report`
- `title-page-report-maintenance`
- `title-solicitud-pago-pdf`
- `customer-360`
- `inventory-level`
- `barcode-scanner`
- `receipt-scanner`

Diagnóstico:

- El `core` sí tiene materia prima valiosa.
- Pero todavía conviven componentes framework-level con componentes acoplados a dominio, reporteo y CRM.
- Sin esta separación, el catálogo seguirá inflado y ambiguo.

---

## 6. Sidebar-Catálogo - diagnóstico y propuesta

### 6.1 Hallazgos

- `sidebar.ts` usa `dsMenuItems` funcionales y consistentes con `settings.routing.ts`.
- Las rutas existen y navegan.
- El problema no es routing; el problema es **arquitectura de información**.
- Hoy el árbol está organizado por procedencia técnica, no por nivel de sistema de diseño.

### 6.2 Propuesta de estructura oficial

```ts
export const catalogMenuItems: MenuItem[] = [
  {
    label: "FOUNDATIONS",
    items: [
      {
        label: "Colores",
        routerLink: ["/", "settings", "ui-catalog", "tokens", "colors"],
      },
      {
        label: "Tipografía",
        routerLink: ["/", "settings", "ui-catalog", "tokens", "typography"],
      },
      {
        label: "Espaciado y Elevación",
        routerLink: ["/", "settings", "ui-catalog", "tokens", "spacing"],
      },
    ],
  },
  {
    label: "ATOMS",
    items: [
      {
        label: "Button",
        routerLink: ["/", "settings", "ui-catalog", "components", "button"],
      },
      {
        label: "Input",
        routerLink: ["/", "settings", "ui-catalog", "components", "input"],
      },
      {
        label: "Badge / Tag / Status",
        routerLink: ["/", "settings", "ui-catalog", "components", "status"],
      },
      {
        label: "Icon",
        routerLink: ["/", "settings", "ui-catalog", "components", "icon"],
      },
    ],
  },
  {
    label: "MOLECULES",
    items: [
      {
        label: "Empty State",
        routerLink: [
          "/",
          "settings",
          "ui-catalog",
          "components",
          "empty-state",
        ],
      },
      {
        label: "Date Range",
        routerLink: ["/", "settings", "ui-catalog", "components", "date-range"],
      },
      {
        label: "Action Menu",
        routerLink: [
          "/",
          "settings",
          "ui-catalog",
          "components",
          "action-menu",
        ],
      },
      {
        label: "File Upload",
        routerLink: [
          "/",
          "settings",
          "ui-catalog",
          "components",
          "file-upload",
        ],
      },
    ],
  },
  {
    label: "ORGANISMS",
    items: [
      {
        label: "Table",
        routerLink: ["/", "settings", "ui-catalog", "components", "table"],
      },
      {
        label: "Kanban",
        routerLink: ["/", "settings", "ui-catalog", "components", "kanban"],
      },
      {
        label: "Timeline",
        routerLink: ["/", "settings", "ui-catalog", "components", "timeline"],
      },
      {
        label: "Charts",
        routerLink: ["/", "settings", "ui-catalog", "components", "charts"],
      },
    ],
  },
  {
    label: "TEMPLATES",
    items: [
      {
        label: "Layouts",
        routerLink: ["/", "settings", "ui-catalog", "layouts"],
      },
      {
        label: "Patterns",
        routerLink: ["/", "settings", "ui-catalog", "patterns"],
      },
    ],
  },
  {
    label: "LEGACY",
    items: [
      {
        label: "Auditoría Histórica",
        routerLink: ["/", "settings", "ui-catalog", "legacy", "audit"],
      },
      {
        label: "Guías Anteriores",
        routerLink: ["/", "settings", "ui-catalog", "legacy", "docs"],
      },
    ],
  },
];
```

### 6.3 Estado del escaparate dual

No cumple aún.

Faltantes frente al prompt:

- Una sola página por componente con pestañas `Web` y `Mobile`.
- Controles de estado (`default`, `hover`, `active`, `disabled`, `error`).
- Switch explícito de `light/dark`.
- Paridad de variantes entre PrimeNG e Ionic por componente.

---

## 7. Accesibilidad - matriz de contraste

| Combinación                     | Texto     | Fondo     | Ratio     | AA texto normal | AA texto grande | ¿Pasa?  |
| ------------------------------- | --------- | --------- | --------- | --------------- | --------------- | ------- |
| Texto primario sobre surface    | `#0f172a` | `#ffffff` | `17.85:1` | Sí              | Sí              | Sí      |
| Texto secundario sobre surface  | `#475569` | `#ffffff` | `7.58:1`  | Sí              | Sí              | Sí      |
| Primary 500 sobre surface       | `#003d9b` | `#ffffff` | `9.81:1`  | Sí              | Sí              | Sí      |
| Primary 600 sobre surface       | `#0040a2` | `#ffffff` | `9.31:1`  | Sí              | Sí              | Sí      |
| Danger 600 sobre surface        | `#dc2626` | `#ffffff` | `4.83:1`  | Sí              | Sí              | Sí      |
| Warning 500 sobre surface       | `#f59e0b` | `#ffffff` | `2.15:1`  | No              | No              | No      |
| Success 600 sobre surface       | `#16a34a` | `#ffffff` | `3.30:1`  | No              | Sí              | Parcial |
| Info 600 sobre surface          | `#0891b2` | `#ffffff` | `3.68:1`  | No              | Sí              | Parcial |
| Texto inverso sobre primary 500 | `#ffffff` | `#003d9b` | `9.81:1`  | Sí              | Sí              | Sí      |
| Texto inverso sobre warning 500 | `#ffffff` | `#f59e0b` | `2.15:1`  | No              | No              | No      |

### Regla de decisión

- `primary` y `danger` sí pueden funcionar como color de texto.
- `warning`, `success` e `info` deben tratarse como **acentos**, no como texto base sobre blanco, salvo en tamaño grande.
- `luxury gold` debe seguir siendo decorativo, no texto principal.

---

## 8. Hallazgos Técnicos de Deuda

### 8.1 Hardcodes localizados en el catálogo

Confirmados en:

- `pages/catalog-web-item/catalog-web-item.ts`
- `pages/catalog-core-item/catalog-core-item.ts`

Ejemplos reales:

- `calendarDemoEvents` usa `#003d9b`, `#94a3b8`, `#fff`
- `avatarList` usa colores hex directos
- `emailHtml` usa `#003d9b`, `#f4f5f8`, `#6b7280`
- `colorValue = signal<string>('#003d9b')`

Decisión:

- Si el hardcode es parte del ejemplo visual del token, tolerable si está claramente documentado.
- Si el hardcode controla apariencia del catálogo o del componente demo, debe tokenizarse.

### 8.2 Encoding roto

El repositorio muestra mojibake visible en múltiples salidas de lectura:

- `ANALISIS-PROMPT-V2.md`
- `sidebar.ts`
- `settings.routing.ts`
- `mypreset.ts`
- varios `.md` del catálogo

Decisión:

- Esto ya no es un detalle cosmético. Es deuda de integridad documental y de mantenibilidad.
- Antes de seguir produciendo más documentación DS, hay que normalizar encoding UTF-8 sin BOM.

---

## 9. Plan de Acción - Fase 1

Prioridad real:

1. Corregir encoding UTF-8 sin BOM en documentación y archivos del catálogo más visibles.
2. Separar `legacy` de `catálogo oficial`.
3. Rediseñar el catálogo por componente, no por stack.
4. Tokenizar hardcodes restantes dentro de demos.
5. Reducir `catalog-web-item.ts` y `catalog-core-item.ts` en componentes más pequeños y mantenibles.
6. Mantener `src/styles` como única fuente de verdad para tokens.

### Corte arquitectónico recomendado

- `catalog-component-ui/foundations/*`
- `catalog-component-ui/components/*`
- `catalog-component-ui/patterns/*`
- `catalog-component-ui/templates/*`
- `catalog-component-ui/legacy/*`

### Qué no haría

- No rehacería `_tokens.scss` desde cero.
- No mezclaría auditoría histórica con páginas demo productivas.
- No seguiría agregando rutas al sidebar actual sin antes redefinir su taxonomía.

---

## 10. Veredicto

La base del sistema de diseño ya existe y es rescatable. Lo que falta no es infraestructura sino disciplina:

- una sola verdad,
- un solo catálogo oficial,
- una sola taxonomía,
- y cero tolerancia a encoding roto y hardcodes arbitrarios dentro del escaparate.

Ese es el punto de partida correcto para la Fase 1.

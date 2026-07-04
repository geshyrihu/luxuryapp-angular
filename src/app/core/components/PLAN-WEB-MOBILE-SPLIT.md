# Plan: separación Web / Ionic (mobile) de `core/components`

> Documento de referencia. **No incluye cambios de código todavía.**
> Alcance: todo `src/app/core/components` **excepto `buttons/` e `inputs/`** (que ya
> tienen el split correcto y sirven de patrón).

## 1. El patrón objetivo (el que ya tienen `buttons` e `inputs`)

| Capa | Tecnología | Prefijo selector | Base |
|---|---|---|---|
| **Web** | PrimeNG / HTML+CSS | `iw-` (icon) / `il-` (label) | `BaseButton` / `BaseInput` |
| **Mobile** | Ionic (`@ionic/angular/standalone`) | `ili-` | `MobileButtonBase` |
| **Compartido** | `app-icon`, base abstracta, lógica | — | — |

Estructura por componente: `web-<x>/`, `mobile-<x>/`, `base/`, `shared/`.

## 2. Diagnóstico actual

- **Todos** los componentes de `shared/`, `web/`, `mobile/` usan el prefijo `app-*`.
  No hay distinción web/mobile en selectores.
- `shared/` (77) es un cajón de sastre: **46 usan PrimeNG** (son web disfrazados de
  "shared"), 2 usan Ionic, ~29 son agnósticos.
- `web/` (16) es genuinamente web. `mobile/` (3) es genuinamente mobile.
- Casi **no existe** ninguna versión Ionic de los componentes web.

## 3. Convención propuesta para el split

- **Web**: conservar el selector actual `app-<x>` (evita reescribir todos los
  templates que ya lo consumen). Vive en `web/<x>/` o `<x>/web-<x>/`.
- **Mobile/Ionic**: nuevo componente con selector **`ili-<x>`**, en `mobile/<x>/` o
  `<x>/mobile-<x>/`, usando `@ionic/angular/standalone`.
- **Lógica común** (tipos, servicios, estado, validación): extraer a una `base-<x>`
  abstracta o a un servicio, consumida por ambas versiones.

## 4. Categorías

### Categoría INFRA — se quedan agnósticos (sin split)
Utilidades transversales; no son UI de plataforma.

| Componente | Carpeta | Selector | Nota |
|---|---|---|---|
| app-icon | shared | `app-icon` | Wrapper Iconify, compartido por todo |
| focus-trap | shared | `[appFocusTrap]` | Directiva a11y |
| live-region-announcer | shared | (service/util) | a11y |
| inputs (re-export) | shared | — | Barrel, no es componente |

### Categoría A — Solo Web (mantener/mover a `web/`, NO requiere Ionic)
Intrínsecamente de escritorio (data densa, reportes, PDF, overlays de mouse).

| Componente | Carpeta hoy | Selector web | Motivo |
|---|---|---|---|
| data-grid | shared | `app-data-grid` | Tabla densa |
| tree-table | shared | `app-tree-table` | Tabla jerárquica |
| pivot-table | shared | `app-pivot-table` | Tabla dinámica |
| gantt | shared | `app-gantt` | Diagrama Gantt |
| kanban-board | shared | `app-kanban-board` | Tablero drag&drop |
| pipeline-crm | shared | `app-pipeline-crm` | Pipeline ancho |
| funnel-chart | shared | `app-funnel-chart` | Gráfico |
| heatmap | shared | `app-heatmap` | Mapa de calor |
| territory-map | shared | `app-territory-map` | Mapa |
| comparison-table | shared | `app-comparison-table` | Tabla comparativa |
| command-palette | shared | `app-command-palette` | Cmd+K (teclado) |
| context-menu | shared | `app-context-menu` | Click derecho |
| mega-menu | shared | `app-mega-menu` | Menú ancho |
| dock | shared | `app-dock` | Dock escritorio |
| form-builder | shared | `app-form-builder` | Constructor formularios |
| rich-text-editor | shared | `app-rich-text-editor` | Editor WYSIWYG |
| pdf-viewer-modal | shared | `app-pdf-viewer-modal` | Visor PDF |
| print-view | shared | `app-print-view` | Impresión |
| email-preview | shared | `app-email-preview` | Preview email |
| customer-360 | shared | `app-customer-360` | Dashboard denso |
| document-previewer | shared | `app-document-previewer` | Preview docs |
| dashboard-layout | shared | `app-dashboard-layout` | Layout escritorio |
| session-timeout | shared | `app-session-timeout` | Overlay/lógica |
| skeleton-presets | shared | `app-skeleton-presets` | Skeletons (revisar → puede ser C) |
| **todo `web/`** (16) | web | `app-*` / `primeng-custom-*` | Reportes, títulos PDF, calendarios, charts, primeng-custom |

### Categoría B — Solo Mobile (mantener/mover a `mobile/`, NO requiere Web)
Interacciones nativas de móvil.

| Componente | Carpeta hoy | Selector | Motivo |
|---|---|---|---|
| pull-to-refresh | shared | `app-pull-to-refresh` | Gesto móvil |
| swipe-actions | shared | `app-swipe-actions` | Swipe |
| bottom-nav | shared | `app-bottom-nav` | Nav inferior |
| tab-bar | shared | `app-tab-bar` | Tab bar móvil |
| offline-indicator | shared | `app-offline-indicator` | Estado móvil |
| action-menu | mobile | `app-action-menu` | Action sheet |
| data-view-mobile | mobile | `app-data-view-mobile` | Lista móvil |
| tap-to-top | mobile | `app-tap-to-top` | Scroll-to-top móvil |
| global-error-alert | shared | `app-global-error-alert` | Ya usa Ionic |

### Categoría C — Necesitan AMBAS (crear versión Ionic `ili-*`)
El trabajo real. Ordenado por prioridad sugerida.

#### Prioridad ALTA (uso frecuente en pantallas móviles)
| Componente | Selector web (mantener) | Selector Ionic propuesto |
|---|---|---|
| confirm-dialog | `app-confirm-dialog` | `ili-confirm-dialog` (ion-alert/action-sheet) |
| empty-state | `app-empty-state` | `ili-empty-state` |
| loader | `app-loader` | `ili-loader` (ya ionic → falta web) |
| status-badge | `app-status-badge` | `ili-status-badge` (ion-badge) |
| rating | `app-rating` | `ili-rating` |
| file-upload | `app-file-upload` | `ili-file-upload` |
| date-range | `app-date-range` | `ili-date-range` (ion-datetime) |
| otp-input | `app-otp-input` | `ili-otp-input` |
| notification-center | `app-notification-center` | `ili-notification-center` |
| avatar-group | `app-avatar-group` | `ili-avatar-group` (ion-avatar) |
| kpi-card | `app-kpi-card` | `ili-kpi-card` (ion-card) |
| stat-card | `app-stat-card` | `ili-stat-card` (ion-card) |
| contact-card | `app-contact-card` | `ili-contact-card` |
| profile-card | `app-profile-card` | `ili-profile-card` |
| action-icons-group | `app-action-icons-group` | `ili-action-icons-group` |
| tag-input | `app-tag-input` | `ili-tag-input` (ion-chip) |

#### Prioridad MEDIA
| Componente | Selector web | Selector Ionic |
|---|---|---|
| color-picker | `app-color-picker` | `ili-color-picker` |
| slider | `app-slider` | `ili-slider` (ion-range) |
| breadcrumbs | `app-breadcrumbs` | `ili-breadcrumbs` |
| theme-switcher | `app-theme-switcher` | `ili-theme-switcher` (ion-toggle) |
| lang-selector | `app-lang-selector` | `ili-lang-selector` |
| tristate-switch | `app-tristate-switch` | `ili-tristate-switch` |
| timeline | `app-timeline` | `ili-timeline` |
| activity-log | `app-activity-log` | `ili-activity-log` |
| order-status | `app-order-status` | `ili-order-status` |
| gauge | `app-gauge` | `ili-gauge` |
| qr-code | `app-qr-code` | `ili-qr-code` |
| signature-pad | `app-signature-pad` | `ili-signature-pad` |
| barcode-input | `app-barcode-input` | `ili-barcode-input` |
| barcode-scanner | `app-barcode-scanner` | `ili-barcode-scanner` (cámara nativa) |
| receipt-scanner | `app-receipt-scanner` | `ili-receipt-scanner` (cámara nativa) |
| comment-thread | `app-comment-thread` | `ili-comment-thread` |
| split-pane | `app-split-pane` | `ili-split-pane` (ion-split-pane) |

#### Prioridad BAJA
| Componente | Selector web | Selector Ionic |
|---|---|---|
| whats-new | `app-whats-new` | `ili-whats-new` |
| tour | `app-tour` | `ili-tour` |
| wizard | `app-wizard` | `ili-wizard` |
| error-boundary | `app-error-boundary` | `ili-error-boundary` |
| approval-workflow | `app-approval-workflow` | `ili-approval-workflow` |
| inventory-level | `app-inventory-level` | `ili-inventory-level` |
| lead-scoring | `app-lead-scoring` | `ili-lead-scoring` |
| realtime-indicator | `app-realtime-indicator` | `ili-realtime-indicator` |

## 5. Resumen numérico

| Categoría | Cantidad aprox. | Acción |
|---|---|---|
| INFRA (agnóstico) | 4 | Ninguna |
| A — Solo Web | ~24 + 16 (`web/`) = ~40 | Reubicar a `web/`, sin Ionic |
| B — Solo Mobile | ~9 | Reubicar a `mobile/`, sin Web |
| C — Ambas | ~41 | Crear versión Ionic `ili-*` |

## 6. Roadmap sugerido (por fases)

1. **Fase 0 — Reorganización (bajo riesgo):** mover PrimeNG de `shared/` → `web/`;
   dejar en `shared/` solo INFRA + lógica común. Actualizar imports/barrels.
2. **Fase 1 — Bases comunes:** extraer lógica compartida de la categoría C a
   `base-<x>` / servicios (para no duplicar lógica entre web e ionic).
3. **Fase 2 — Ionic ALTA:** crear `ili-*` de los ~16 de prioridad alta.
4. **Fase 3 — Ionic MEDIA/BAJA:** el resto de la categoría C.
5. **Fase 4 — Catálogo:** añadir sección "Mobile (Ionic)" en el design system
   (`catalog-mobile`) que muestre cada `ili-*`.

## 7. Decisiones abiertas (requieren tu confirmación)

- **Selector web:** ¿mantener `app-<x>` o migrar a `iw-<x>` para alinear con
  buttons/inputs? (Mantener `app-*` evita romper templates existentes.)
- **Estructura de carpetas:** ¿`web/<x>/` + `mobile/<x>/` separadas, o
  `<x>/{web,mobile,base}/` por componente (como buttons)?
- **Selección de plataforma en runtime:** ¿un wrapper que renderice `app-*` o
  `ili-*` según Capacitor/`Platform`, o el consumidor elige explícitamente?
- **Categoría C real:** validar caso por caso; algunos "ALTA" podrían ser solo web
  si no aparecen en pantallas móviles reales.

## 8. Decisiones tomadas (cerradas)

1. **Selector web:** se mantiene `app-<x>` (no se rompe ningún template existente).
2. **Estructura:** plana — `web/<x>/`, `mobile/<x>/`, base en `shared/<x>/`.
3. **Plataforma:** wrapper automático `lx-<x>` que usa `PlatformService.isMobile()`.
4. **Detección:** `PlatformService` (ya existe) → `isMobile()` = `hybrid` (Capacitor)
   o `window.innerWidth < 768`.

## 9. Receta de implementación (validada con empty-state, confirm-dialog, status-badge)

Por cada componente de categoría C se crean/ajustan **4 archivos**:

### 9.1 Base — `shared/<x>/<x>-base.ts`
`@Directive()` abstracto con **toda** la API pública (inputs/outputs) y la lógica
compartida (getters, config maps, métodos). Aquí también van enums/interfaces/consts
que consumidores importen.

```ts
import { Directive, input, output /*, model*/ } from "@angular/core";

@Directive()
export abstract class XBase {
  // inputs / outputs / model
  // lógica compartida (getters, métodos)
}
```

### 9.2 Web — `web/<x>/<x>.ts` (selector `app-<x>`)
Refactor: `extends XBase`, se **borran** las declaraciones de inputs/outputs/lógica
(ahora heredadas), se conserva template + estilos PrimeNG.
Si el archivo exportaba enums/interfaces, **re-exportarlas** desde la base para no
romper consumidores:
```ts
export { EFoo, type BarEvent } from "src/app/core/components/shared/<x>/<x>-base";
export class X extends XBase {}
```

### 9.3 Mobile — `mobile/<x>/<x>.ts` (selector `ili-<x>`)
Nuevo. `extends XBase`, template con `@ionic/angular/standalone` (`ion-button`, etc.)
y ajustes táctiles: sin `pTooltip`, targets más grandes, bottom-sheet en vez de modal
centrado, `ion-*` nativos donde aplique.

### 9.4 Wrapper — `shared/<x>/<x>.ts` (selector `lx-<x>`)
`extends XBase` + `inject(PlatformService)`. Reenvía todos los inputs/outputs a la
versión web o mobile según `platform.isMobile()`.
```ts
@Component({
  selector: "lx-<x>",
  imports: [X, MobileX],
  template: `
    @if (platform.isMobile()) { <ili-<x> [in]="in()" (out)="out.emit($event)" /> }
    @else { <app-<x> [in]="in()" (out)="out.emit($event)" /> }
  `,
})
export class LxX extends XBase { protected platform = inject(PlatformService); }
```
Para inputs `model()` (two-way) usar `[(prop)]="prop"` en ambas ramas.

### 9.5 Verificación
`npx tsc --noEmit -p tsconfig.app.json` → exit 0.
(Si el dev server muestra errores de "export inexistente" tras mover carpetas:
borrar `.angular/cache` y reiniciar `ng serve`.)

### 9.6 Migración de consumidores (opcional, cuando se quiera auto-switch)
- Pantallas de feature (web, responsivas) → cambiar `app-<x>` por `lx-<x>`.
- Componentes ya mobile-only → usar `ili-<x>` directo (no el wrapper).
- Infra web pura (tablas PrimeNG, catálogo/design-system) → dejar en `app-<x>`.

### Progreso categoría C

**Split completo (17)** — base + `app-*` + `ili-*` + `lx-*`, tsc verde:
- [x] empty-state (piloto) · consumidores migrados
- [x] confirm-dialog
- [x] status-badge
- [x] rating
- [x] otp-input
- [x] tag-input
- [x] date-range
- [x] contact-card
- [x] profile-card
- [x] color-picker
- [x] slider
- [x] notification-center
- [x] breadcrumbs
- [x] timeline
- [x] theme-switcher
- [x] lang-selector
- [x] comment-thread

**NO llevan split (validado caso por caso):**
- Agnósticos puros (idénticos web/mobile): `kpi-card`, `stat-card`, `avatar-group`,
  `activity-log`, `order-status`, `gauge`.
- Casi agnósticos (solo difiere un botón): `qr-code`.
- Ya híbridos (touch/cámara resuelto internamente con APIs web estándar —
  `getUserMedia`, `BarcodeDetector`, `<input type=file capture>`, canvas + touch,
  o media queries): `file-upload`, `signature-pad`, `barcode-scanner`,
  `barcode-input`, `receipt-scanner`, `loader`.
- Singletons globales (no reutilizables; los web-components Ionic ya renderizan en
  escritorio): `global-error-alert`.
- Web-only por naturaleza (categoría A): `command-palette`, `mega-menu`,
  `context-menu`, `dock`, `split-pane` (+ toda la carpeta `web/`).

**Pendientes con tratamiento especial (no simple UI-swap):**
- `wizard` — `p-stepper` usa proyección de contenido dinámica; una versión nativa
  exige rediseñar la API (selects estáticos). `p-stepper` ya es responsive → diferido.

**Conclusión:** la fase de splits limpios de categoría C está COMPLETA (17
componentes). Lo restante no requiere split (ya híbrido / agnóstico / web-only /
singleton) o exige rediseño de API (`wizard`).

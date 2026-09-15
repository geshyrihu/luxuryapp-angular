# Reporte de Análisis - PrimeNG / PrimeIcons / PrimeFlex

## Proyecto: luxuryapp-api/appsweb/angular

**Fecha de análisis:** 2026-09-14
**Versión Angular:** ^22.1.6
**Versión PrimeNG:** 22.1.1
**Versión PrimeFlex:** ^4.0.0
**Versión PrimeIcons:** 8.0.1
**Versión TypeScript:** ~6.0.3

---

## 1. Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| Archivos `.ts` analizados | 3,205 |
| Archivos `.html` analizados | 885 |
| Archivos `.scss` analizados | 64 |
| Sub-paquetes PrimeNG importados | 79 únicos |
| Sentencias `primeng/*` en TS | 434 |
| Selectores `<p-*>` en HTML | 1,095 |
| Directiva `pSortableColumn` | 678 |
| Módulos PrimeNG importados | 65+ únicos |
| Archivos wrapper `primeng-*` | 45 directorios |
| Archivos `.spec.ts` importando primeng | 137 |
| Archivos SCSS con overrides PrimeNG | 9 dedicados + 4 complementarios |
| Clases PrimeFlex en HTML | ~25,000+ ocurrencias |
| Iconos PrimeIcons en HTML | 17 líneas / 8 archivos |
| Iconos Iconify (material-symbols-light) | 2,337 referencias |

---

## 2. Estructura del Proyecto Analizado

```
appsweb/angular/src/
├── app/
│   ├── core/              # Auth, constants, directives, services, layout
│   ├── modules/           # 18 feature modules
│   │   ├── accounting.luxuryapp/
│   │   ├── admin.luxuryapp/
│   │   ├── auth.luxuryapp/
│   │   ├── collections.luxuryapp/
│   │   ├── committee.luxuryapp/
│   │   ├── human-resources.luxuryapp/
│   │   ├── legal.luxuryapp/
│   │   ├── maintenance.luxuryapp/
│   │   ├── management.luxuryapp/
│   │   ├── operations.luxuryapp/
│   │   ├── public.luxuryapp/
│   │   ├── purchases.luxuryapp/
│   │   ├── recruitment.luxuryapp/
│   │   ├── resident.luxuryapp/
│   │   ├── shared.luxuryapp/
│   │   ├── supplier.luxuryapp/
│   │   ├── system.luxuryapp/
│   │   └── web.luxuryapp/
│   ├── shared/
│   │   └── ui/web/        # 176 componentes wrapper (45 son primeng-*)
│   └── routing/
├── assets/
├── environments/
├── stories/
├── styles/
│   ├── web/               # 9 archivos _prime-*.scss
│   ├── theme/             # mypreset.ts (LuxuryPreset)
│   └── shared/            # _toast.scss, _sidebar.scss
└── types/
```

---

## 3. Hallazgos PrimeNG

### 3.1 Componentes utilizados en templates HTML

| Componente | Selector | Ocurrencias | Archivos únicos |
|---|---|---|---|
| SortIcon | `<p-sorticon>` | 679 | 178 |
| Table | `<p-table>` | 51 | 45 |
| ColumnFilter | `<p-columnfilter>` | 5 | 3 |
| InputGroup | `<p-inputgroup>` | 4 | 1 |
| Dialog | `<p-dialog>` | 2 | 2 |
| ConfirmDialog | `<p-confirmdialog>` | 1 | 1 |
| Select | `<p-select>` | 1 | 1 |
| Button | `<p-button>` | 0 (comentado) | 0 |
| **Total** | | **1,095** | |

#### Archivos con más uso de `<p-sorticon>`:

| Ocurrencias | Archivo |
|---|---|
| 25 | `modules/collections.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.html` |
| 11 | `modules/human-resources.luxuryapp/time-off/historial-solicitudes/solicitudes-historial.html` |
| 10 | `modules/resident.luxuryapp/property/propiedades-list.html` |
| 8 | `modules/maintenance.luxuryapp/logs/elevator-spare-parts/elevator-spare-parts-change-list.html` |
| 8 | `modules/operations.luxuryapp/inventarios-y-almacn/radio-communication-inventory/radio-comunicacion-list.html` |
| 8 | `modules/operations.luxuryapp/supervision/supervision/agenda-supervision/agenda-supervision.html` |
| 8 | `modules/supplier.luxuryapp/po/purchase-order/orden-compra-list.html` |

### 3.2 Directivas

| Directiva | Ocurrencias | Archivos únicos |
|---|---|---|
| `pSortableColumn` | 678 | 178 |
| `pInputText` | 6 | 4 |
| `pTooltip` | vía wrapper `LxTooltipDirective` | — |
| **Total** | **684** | |

#### Archivos con `pInputText`:

| Línea | Archivo |
|---|---|
| 63 | `core/pages-extras/comingsoon/comingsoon.html` |
| 6, 17 | `shared/ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd.html` |
| 5, 16 | `shared/ui/web/rango-calendario-mes-anio/calendar-range.html` |
| 28 | `modules/operations.luxuryapp/inventarios-y-almacn/product-exit/product-output-form.html` |

### 3.3 Módulos importados (65+ únicos)

#### Top 10 módulos por frecuencia de importación:

| Módulo | Archivos |
|---|---|
| `ButtonModule` | 37 |
| `DynamicDialogModule` | (re-export en `primeng-dynamicdialog`) |
| `InputTextModule` | 13 |
| `DialogModule` | 8 |
| `TableModule` | 8 |
| `SelectModule` | 7 |
| `InputGroupModule` | 5 |
| `InputGroupAddonModule` | 5 |
| `TagModule` | 4 |
| `IconFieldModule` | 4 |

#### Módulos con uso único (1 archivo cada uno):

`AccordionModule`, `AnimateOnScrollModule`, `AvatarModule`, `BadgeModule`, `BlockUIModule`, `BreadcrumbModule`, `CarouselModule`, `CascadeSelectModule`, `CheckboxModule`, `ChipModule`, `ColorPickerModule`, `ConfirmDialogModule`, `ConfirmPopupModule`, `ContextMenuModule`, `DockModule`, `DividerModule`, `FieldsetModule`, `FluidModule`, `FloatLabelModule`, `GalleriaModule`, `ImageModule`, `InplaceModule`, `InputOtpModule`, `KnobModule`, `ListboxModule`, `MenuModule`, `MegaMenuModule`, `MenubarModule`, `MeterGroupModule`, `OrderListModule`, `OrganizationChartModule`, `PaginatorModule`, `PanelMenuModule`, `PickListModule`, `ProgressSpinnerModule`, `RadioButtonModule`, `RatingModule`, `RippleModule`, `ScrollerModule`, `ScrollTopModule`, `SliderModule`, `SplitButtonModule`, `SplitterModule`, `StepsModule`, `StepperModule`, `StyleClassModule`, `TerminalModule`, `TimelineModule`, `ToolbarModule`, `TooltipModule`, `TreeModule`, `TreeSelectModule`, `TreeTableModule`

### 3.4 Servicios

#### Servicios PrimeNG proporcionados globalmente (`app.config.ts`):

| Servicio | Línea | Tipo |
|---|---|---|
| `ConfirmationService` | 154 | Singleton global |
| `DialogService` | 155 | Singleton global |
| `MessageService` (PrimeNG) | 152 | Alias → custom `MessageService` |
| `providePrimeNG()` | 122 | Configuración central |

#### Archivos importando `ConfirmationService`:

| Archivo | Línea |
|---|---|
| `shared/ui/web/confirm-popup/confirm-popup.ts` | 11 |
| `modules/system.luxuryapp/.../ai-knowledge-base-list.ts` | 17 |
| `modules/accounting.luxuryapp/.../accounting-catalog.ts` | 12 |
| `modules/legal.luxuryapp/.../work-contract-list.ts` | 42 |
| `modules/supplier.luxuryapp/.../orden-compra.ts` | 17 |
| `modules/operations.luxuryapp/.../send-operation-report-web.ts` | 9 |
| `modules/management.luxuryapp/.../presentacion-junta-comite.ts` | 21 |
| `modules/management.luxuryapp/.../presentacion-junta-comite-contador.ts` | 21 |
| `modules/operations.luxuryapp/.../service-order.ts` | 8 |

#### Archivos importando `DialogService` (~72 archivos):

- Producción: `app.config.ts`, `dialog-handler.service.ts`, `ai-knowledge-base-list.ts`, `modal-funding-upload-invoices.ts`
- Tests: ~67 archivos `.spec.ts` en todos los módulos

#### Archivos importando `MessageService` desde primeng:

- Producción: `app.config.ts` (linea 52, como `PrimeMessageService`)
- Tests: ~80 archivos `.spec.ts`

#### Servicios wrapper custom:

| Archivo | Función |
|---|---|
| `core/services/message.service.ts` | Reemplazo custom de PrimeNG MessageService |
| `core/services/dialog-handler.service.ts` | Wrapper de DialogService |
| `core/services/primeng-notification.service.ts` | Wrapper de notificaciones |

### 3.5 Pipes

No se detectaron pipes PrimeNG específicos importados directamente.

### 3.6 Re-export Wrappers (`primeng-*`)

| Wrapper | Re-exporta desde |
|---|---|
| `shared/ui/web/primeng-api/primeng-api.ts` | `primeng/api` + custom MessageService |
| `shared/ui/web/primeng-button/primeng-button.ts` | `primeng/button` |
| `shared/ui/web/primeng-inputtext/primeng-inputtext.ts` | `primeng/inputtext` |
| `shared/ui/web/primeng-table/primeng-table.ts` | `primeng/table` |
| `shared/ui/web/primeng-dialog/primeng-dialog.ts` | `primeng/dialog` |
| `shared/ui/web/primeng-select/primeng-select.ts` | `primeng/select` |
| `shared/ui/web/primeng-dynamicdialog/primeng-dynamicdialog.ts` | `primeng/dynamicdialog` |

#### Directorios wrapper completos (45):

```
primeng-accordion        primeng-datepicker      primeng-inputtext
primeng-api              primeng-dialog          primeng-menu
primeng-autocomplete     primeng-divider         primeng-message
primeng-avatar           primeng-dynamicdialog   primeng-multiselect
primeng-badge            primeng-floatlabel      primeng-popover
primeng-breadcrumb       primeng-iconfield       primeng-progressbar
primeng-button           primeng-inputgroup      primeng-progressspinner
primeng-carousel         primeng-inputgroupaddon primeng-radiobutton
primeng-checkbox         primeng-inputicon       primeng-ripple
primeng-chip             primeng-inputnumber     primeng-select
primeng-custom-caption   primeng-selectbutton    primeng-skeleton
primeng-custom-global-filter  primeng-splitbutton primeng-table
primeng-custom-table-emptymessage primeng-tabs   primeng-tag
primeng-custom-table-footer      primeng-toast   primeng-toggleswitch
primeng-custom-toast       primeng-toolbar
primeng-dataview
```

---

## 4. Hallazgos PrimeIcons

### 4.1 Iconos utilizados en templates HTML

**Hallazgo clave:** PrimeIcons está prácticamente **migrado a Iconify** (Material Symbols Light). Solo quedan 17 líneas con clases `pi` en 8 archivos HTML.

| Archivo | Línea | Uso |
|---|---|---|
| `core/layout/unauthorized.html` | 10 | `class="pi text-primary text-9xl"` |
| `core/layout/unauthorized.html` | 47 | `class="pi me-2"` |
| `core/layout/page500.html` | 11, 13 | `class="pi text-primary text-8xl mx-3"` |
| `core/layout/page500.html` | 60, 68 | `class="pi"` |
| `core/layout/page404.html` | 13 | `class="pi text-primary text-8xl mx-3"` |
| `core/layout/page404.html` | 59, 67 | `class="pi"` |
| `shared/ui/web/contratos-card/contratos-card.html` | 3 | `class="pi-spin text-primary"` |
| `shared/ui/web/agenda-semanal-card/agenda-semanal-card.html` | 3 | `class="pi-spin text-primary"` |
| `shared/ui/web/agenda-semanal/agenda-semanal.html` | 61 | `class="pi-spin text-primary"` |
| `core/layout/employee-view/desktop/header-employee-desktop/header-employee-desktop.html` | 92 | `[class.pi-spin]="navIcon.iconExtraClass?.includes('pi-spin')"` |
| `shared/ui/web/financial-reports-wrapper/financial-reports-wrapper.html` | 115 | `'material-symbols-light:progress-activity pi-spinner'` |
| `modules/operations.luxuryapp/.../automated-services.html` | 202 | `class="pi"` |
| `shared/ui/web/ai-chat-widget/ai-chat-widget.html` | 6, 8, 22, 39 | `class="pi text-2xl text-white"` |

### 4.2 Iconos referenciados en TypeScript

| Clase | Uso |
|---|---|
| `pi-spin` | Animación de carga en header y cards |
| `pi-spinner` | Combinado con Iconify para loading |
| `pi` | Clase base PrimeIcons (portador de font-family) |

### 4.3 Frecuencia de uso por icono

| Icono | Veces usado |
|---|---|
| `pi` (base) | 12 |
| `pi-spin` | 5 |
| `pi-spinner` | 1 |

### 4.4 Sistema de iconos alternativo (Iconify)

El proyecto usa predominantemente **Iconify** con `material-symbols-light`:
- **2,337 referencias** en HTML
- Wrapper: `<app-icon>` component
- Mapping system: `shared/utils/icon-mapping.ts` convierte nombres PrimeIcons → Iconify

### 4.5 PrimeIcons en SCSS

| Archivo | Uso |
|---|---|
| `styles/shared/_buttons.scss` | `> .pi { ... }` (override de tamaño) |
| `modules/admin.luxuryapp/.../approval-rules.scss` | `.pi { font-size: 0.68rem !important; }` |
| Maintenance module SCSS files | 13 ocurrencias de `pi-` en selectores |

---

## 5. Hallazgos PrimeFlex

> **Nota importante:** PrimeFlex `^4.0.0` está instalado pero **NO se carga explícitamente** como CSS en `angular.json` ni via `@import` en SCSS. Las clases utility (d-flex, col-*, gap-*, etc.) que dominan los templates son proporcionadas por **Bootstrap 5.3.8** (cargado via `_bootstrap-entry.scss`), que comparte nomenclatura similar con PrimeFlex.

### 5.1 Clases de Flexbox

| Clase | Ocurrencias | Archivos |
|---|---|---|
| `d-flex` | 3,323 | 622 |
| `flex-column` | 853 | 301 |
| `flex-shrink-0` | 326 | 200 |
| `flex-wrap` | 252 | 133 |
| `flex-fill` | 175 | 102 |
| `flex-grow-1` | 123 | 77 |
| `flex-row` | 3 | 3 |
| **Total** | **5,055** | |

### 5.2 Clases de Grid

| Clase | Ocurrencias |
|---|---|
| `col-*` (todas) | 2,470+ |
| `col-1` | 1,799 |
| `col-md-6` | 488 |
| `col-md-4` | 274 |
| `col-lg-3` | 119 |
| `col-sm-6` | 107 |
| `col-5` | 130 |
| `col-6` | 116 |
| `col-offset-*` | 0 (no usado) |
| `row` | (integrado en contenedores) |
| `grid` | 53 |
| **Total** | **~3,500+** |

### 5.3 Clases de Spacing

| Clase | Ocurrencias |
|---|---|
| `gap-*` (todas) | 1,631 |
| `gap-2` | 364 |
| `gap-3` | 201 |
| `gap-1` | 112 |
| `gap-4` | 36 |
| `p-*` (padding) | 1,545 |
| `p-3` | 387 |
| `p-2` | 155 |
| `p-4` | 141 |
| `px-*` | 361 |
| `py-*` | 404 |
| `m-*` (margin) | 1,117 |
| `m-0` | 335 |
| `mx-*` | 23 |
| `my-*` | 51 |
| **Total** | **~5,132** |

### 5.4 Clases de Tipografía

| Clase | Ocurrencias |
|---|---|
| `text-*` (todas) | 7,385 |
| `text-body-secondary` | 1,331 |
| `text-sm` | 688 |
| `text-body` | 627 |
| `text-xs` | 423 |
| `text-center` | 395 |
| `text-uppercase` | 321 |
| `text-primary` | 286 |
| `text-xl` | 153 |
| `text-lg` | 138 |
| `font-*` (todas) | 376 |
| `font-mono` | 78 |
| `font-semibold` | 14 |
| **Total** | **~7,761** |

### 5.5 Otras utilidades

| Clase | Ocurrencias | Archivos |
|---|---|---|
| `rounded` | 1,321 | 430 |
| `border-*` | 1,169 | 266 |
| `block` | 899 | — |
| `w-full` | 381 | 193 |
| `shadow-*` | 380 | 149 |
| `h-full` | 329 | 106 |
| `hidden` | 171 | — |
| `surface-*` | ~54 | ~20 |
| `inline` | 48 | — |
| **Total** | **~4,749** | |

### 5.6 PrimeFlex en SCSS

| Archivo | Contexto |
|---|---|
| `styles/shared/_utilities.scss` | "Complemento a PrimeFlex" — agrega tracking, h-15rem, max-w-* |
| `styles/shared/_dark-mode.scss` | "Clases numericas PrimeFlex / TailwindCSS usadas en templates" |
| `styles/shared/_global.scss` | "Necesarios porque las utilidades de PrimeFlex tienen menor prioridad" |
| `styles/shared/_custom-table.scss` | "Las utilidades de PrimeFlex (.text-left, .text-center...)" |
| `styles/shared/_print.scss` | "paddings y margenes (basados en PrimeFlex)" |
| `cobranza-online.styles.scss` | 8 líneas con `@apply flex flex-column align-items-center...` |

---

## 6. Estadísticas y Métricas

### 6.1 Top 10 componentes PrimeNG más usados (en templates)

| # | Componente | Ocurrencias |
|---|---|---|
| 1 | `<p-sorticon>` | 679 |
| 2 | `<p-table>` | 51 |
| 3 | `<p-columnfilter>` | 5 |
| 4 | `<p-inputgroup>` | 4 |
| 5 | `<p-dialog>` | 2 |
| 6 | `<p-confirmdialog>` | 1 |
| 7 | `<p-select>` | 1 |

### 6.2 Top 10 iconos PrimeIcons más usados

| # | Icono | Ocurrencias |
|---|---|---|
| 1 | `pi` (base) | 12 |
| 2 | `pi-spin` | 5 |
| 3 | `pi-spinner` | 1 |

> **Nota:** El proyecto migró a Iconify (material-symbols-light) con 2,337 referencias.

### 6.3 Top 10 clases PrimeFlex/Bootstrap más usadas

| # | Clase | Ocurrencias |
|---|---|---|
| 1 | `text-*` | 7,385 |
| 2 | `d-flex` | 3,323 |
| 3 | `col-*` | 2,470+ |
| 4 | `align-items-*` | 1,989 |
| 5 | `justify-content-*` | 1,396 |
| 6 | `gap-*` | 1,631 |
| 7 | `p-*` (padding) | 1,545 |
| 8 | `rounded` | 1,321 |
| 9 | `border-*` | 1,169 |
| 10 | `m-*` (margin) | 1,117 |

### 6.4 Distribución por tipo de archivo

| Tipo | Hallazgos PrimeNG |
|---|---|
| `.ts` | 434 importaciones, 65+ módulos, 3 servicios globales |
| `.html` | 1,095 selectores, 678 directivas, ~25,000 clases utility |
| `.scss` | 201 referencias a clases PrimeNG, 9 archivos override dedicados |
| `.json` | 3 dependencias (primeng, primeflex, primeicons) |

---

## 7. Archivos Afectados

### 7.1 Archivos TS con imports PrimeNG (producción, no spec)

| Sub-paquete | Cantidad | Archivos representativos |
|---|---|---|
| `primeng/dynamicdialog` | 10+ prod | `app.config.ts`, `dialog-handler.service.ts`, `ionic-dialog-modal.ts` |
| `primeng/api` | 15+ prod | `app.config.ts`, layout headers, shared/ui/web/*, base classes |
| `primeng/button` | 35+ prod | `shared/ui/web/*` (35 componentes wrapper) |
| `primeng/inputtext` | 12 prod | `comingsoon.ts`, `sidebar.ts`, `form-builder.ts`, `data-grid.ts` |
| `primeng/table` | 7 prod | `pagination-request.dto.ts`, `data-grid.ts`, 4 feature modules |
| `primeng/dialog` | 7 prod | `whats-new.ts`, `command-palette.ts`, `session-timeout.ts`, `dialog.ts` |
| `primeng/select` | 6 prod | `data-grid.ts`, `form-builder.ts`, `lang-selector.ts` |

### 7.2 Archivos HTML con componentes PrimeNG

| Módulo | Archivos afectados |
|---|---|
| `operations.luxuryapp` | ~40+ archivos |
| `accounting.luxuryapp` | ~30+ archivos |
| `maintenance.luxuryapp` | ~25+ archivos |
| `recruitment.luxuryapp` | ~15+ archivos |
| `collections.luxuryapp` | ~12+ archivos |
| `admin.luxuryapp` | ~15+ archivos |
| `human-resources.luxuryapp` | ~12+ archivos |
| `supplier.luxuryapp` | ~8+ archivos |
| `resident.luxuryapp` | ~5+ archivos |
| `shared/ui/web` | ~10+ archivos |
| `core/layout` | ~5+ archivos |

### 7.3 Archivos SCSS con overrides PrimeNG

| Archivo | Propósito |
|---|---|
| `styles/web/_prime-tokens.scss` | Bridge de tokens DS → PrimeNG (90 líneas) |
| `styles/web/_prime-table.scss` | Override visual de p-table/p-datatable (100 líneas) |
| `styles/web/_prime-dialog.scss` | Override visual de p-dialog (67 líneas) |
| `styles/web/_prime-button.scss` | Override de p-button (140 líneas) |
| `styles/web/_prime-input.scss` | Override de InputText, Select, Checkbox, Radio (80 líneas) |
| `styles/web/_prime-message.scss` | Override de p-message (51 líneas) |
| `styles/web/_prime-tag.scss` | Override de p-tag (28 líneas) |
| `styles/web/_prime-dropdown.scss` | Override de Select, Autocomplete overlay (116 líneas) |
| `styles/web/_prime-card.scss` | Override de p-card (19 líneas) |
| `styles/shared/_toast.scss` | Customización `.p-toast` (14 selectores) |
| `styles/shared/_sidebar.scss` | Customización `.p-panelmenu` (20+ selectores) |
| `styles/custom/_financial-tables.scss` | Override `.p-datatable` financial |
| `styles/styles.scss` | Override `.p-dialog` border, `.p-image-mask` z-index |

---

## 8. Observaciones y Recomendaciones

### 8.1 Dependencias detectadas en `package.json`

| Paquete | Versión | Estado |
|---|---|---|
| `primeng` | `22.1.1` | Activo, licencia comunitaria |
| `primeflex` | `^4.0.0` | Instalado pero **no cargado explícitamente** |
| `primeicons` | `8.0.1` | Cargado en angular.json, **migrado a Iconify** |
| `@primeuix/themes` | `3.0.0` | Activo (LuxuryPreset) |
| `@primeuix/utils` | `^0.8.2` | Activo |

### 8.2 Observaciones críticas

1. **PrimeFlex fantasma:** PrimeFlex `^4.0.0` está en `package.json` pero NO se carga como CSS en `angular.json` ni via `@import`/`@use` en SCSS. Las clases utility son proporcionadas por **Bootstrap 5.3.8**. Recomendación: evaluar si PrimeFlex es necesario o si se puede eliminar de `package.json`.

2. **PrimeIcons migrado:** Solo quedan 17 líneas con clases `pi` en 8 archivos. El proyecto usa Iconify (2,337 referencias). Recomendación: eliminar `primeicons` de `angular.json` styles y `package.json` si se completa la migración.

3. **Dominancia de `<p-sorticon>` + `pSortableColumn`:** 1,357 ocurrencias combinadas en 178 archivos. Patrón repetitivo → posible candidato a abstracción en componente wrapper.

4. **45 wrappers `primeng-*`:** Capa de abstracción bien estructurada. Facilita migración futura.

5. **Dualidad de temas:** `mypreset.ts` en `app/` usa **Lara** base; `styles/theme/mypreset.ts` usa **Aura** base. Solo `LuxuryPreset` (Aura) está activo en `app.config.ts`. El `MyPreset` (Lara) parece legacy/no usado.

6. **`!important` en SCSS overrides:** `_prime-message.scss` y `_prime-dropdown.scss` usan `!important` para contrarrestar la especificidad de PrimeNG 21+ que inyecta estilos en runtime. Patrón documentado y justificado.

7. **CSS Layers:** El proyecto define capas CSS en orden: `ionic, reset, tokens, primeng, primevue, primeng-brand, base, components, utilities, overrides`. Esto es correcto para control de especificidad.

8. **Spec files:** 137 archivos `.spec.ts` importan de primeng (mayormente `MessageService` y `DialogService` para mocking). Impacto significativo si se cambia la capa de servicios.

### 8.3 Sugerencias para migración o refactorización

| Prioridad | Acción | Impacto |
|---|---|---|
| Alta | Evaluar eliminación de `primeflex` si Bootstrap cubre todas las utility classes | Reducción de bundle |
| Alta | Completar migración PrimeIcons → Iconify (quedan 8 archivos) | Consistencia de iconos |
| Media | Crear wrapper para `<p-sorticon>` + `pSortableColumn` (patrón repetido 678 veces) | Menos duplicación |
| Media | Reconciliar los dos `mypreset.ts` (eliminar legacy Lara-based) | Claridad |
| Media | Auditar `!important` en SCSS overrides para verificar si siguen siendo necesarios | Mantenibilidad |
| Baja | Evaluar si los 45 wrappers `primeng-*` todos son necesarios o si algunos son vacíos | Limpieza |
| Baja | Migrar `<p-dialog>` directo (2 usos) al wrapper `LxDialogService` | Consistencia |

---

## 9. Anexos

### 9.1 Listado completo de sub-paquetes PrimeNG importados (79)

```
accordion        animateonscroll  api              autocomplete
avatar           badge            blockui          breadcrumb
button           carousel         cascadeselect    checkbox
chip             colorpicker      confirmdialog    confirmpopup
config           contextmenu      dataview         datepicker
dialog           dock             divider          dynamicdialog
editor           fieldset         fileupload       floatlabel
galleria         iconfield        image            inplace
inputgroup       inputgroupaddon  inputicon        inputnumber
inputotp         inputtext        knob             listbox
menu             megamenu         menubar          metergroup
multiselect      orderlist        organizationchart paginator
panelmenu        picklist         popover          progressbar
progressspinner  radiobutton      rating           ripple
scroller         scrolltop        select           selectbutton
slider           splitbutton      splitter         steps
stepper          styleclass       table            tabs
tag              terminal         textarea         timeline
toast            toggleswitch     toolbar          tooltip
tree             treeselect       treetable
```

### 9.2 Comandos útiles para futuras auditorías

```bash
# Contar imports PrimeNG en TypeScript
rg "from 'primeng/" --type ts src/ | wc -l

# Listar todos los sub-paquetes usados
rg "from 'primeng/(\w+)" --type ts src/ -o --replace '$1' | sort -u

# Contar selectores <p-*> en HTML
rg "<p-\w+" --type html src/ | wc -l

# Buscar clases pi-* residuales
rg "class=.*\mpi[\s-]" --type html src/

# Contar clases de layout flex
rg "d-flex" --type html src/ | wc -l

# Verificar que primeflex no se carga
rg "primeflex" angular.json

# Buscar !important en overrides PrimeNG
rg "!important" src/styles/web/_prime-*.scss

# Contar archivos afectados por módulo
for mod in src/app/modules/*/; do
  count=$(rg -l "primeng" "$mod" --type ts --type html 2>/dev/null | wc -l)
  echo "$count $mod"
done | sort -rn
```

### 9.3 Configuración PrimeNG (`app.config.ts`)

```typescript
const primeNgConfig: PrimeNGConfigType = {
  license: "eyJpZCI6IjYwMjZhNmI2...",  // PrimeUI community license
  theme: {
    preset: LuxuryPreset,  // Aura-based, H=204, ancla #003152
    options: {
      darkModeSelector: '[data-theme="dark"], .theme-dark',
      cssLayer: {
        name: "primeng",
        order: "primeng, primeflex",
      },
    },
  },
  translation: PrimeNgSpanishLocale,  // Full Spanish locale
};
```

---

*Reporte generado el 2026-09-14. Angular 22.1.6 / PrimeNG 22.1.1 / PrimeFlex ^4.0.0 / PrimeIcons 8.0.1*

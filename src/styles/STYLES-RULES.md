# Reglas de estilos CSS - LuxuryApp Angular

> Stack vigente: Angular 21 + PrimeNG 21.0.2 + PrimeFlex 4 + SCSS DS
> Fecha de actualizacion: 23 de abril de 2026

Bootstrap y Tailwind CSS no forman parte del stack activo. No introducir clases nuevas de esos sistemas.

## Arquitectura activa

- `client/angular/angular.json` define el orden global de estilos.
- `src/styles/ds-entry.scss` es el punto de entrada del Design System.
- `src/styles/theme/_variables.scss` es la **única fuente de verdad** que define la identidad visual, paleta, tipografía (**DM Sans**), radios, sombras, tokens base `--ds-*` y el mapeo nativo hacia `--ion-color-*`.
- `src/styles/prime-overrides/*.scss` contiene los overrides activos de PrimeNG 21.
- `src/styles/components/*.scss` contiene componentes propios reutilizables del DS.
- `src/styles/styles.scss` es la hoja global legacy/maestra.
- `src/styles/theme/_dark-mode.scss` contiene ajustes globales para modo oscuro.

## Responsabilidad por nivel

`src/styles` debe contener las reglas transversales del producto:

- Identidad visual, paleta y tipografia: `src/styles/theme/_variables.scss`.
- Overrides globales de PrimeNG: `src/styles/prime-overrides/_prime-[component].scss`.
- Componentes reutilizables propios: `src/styles/components/_buttons.scss`, `_inputs.scss`, `_cards.scss`, `_tables.scss`, `_alerts.scss`, etc.
- Utilidades propias no equivalentes a PrimeFlex: `src/styles/custom/_design-system-utilities.scss`.
- Dark mode global: `src/styles/theme/_dark-mode.scss`.

Los SCSS dentro de `src/app/**` solo deben resolver composicion local de una pantalla o variaciones de un caso de uso especifico. Si una clase, color, borde, sombra o patron se repite en dos features, debe moverse a `src/styles`.

## Regla para features y paginas

En templates Angular:

- Usar componentes PrimeNG y clases PrimeFlex para layout.
- Usar clases del Design System cuando ya exista un patron reutilizable.
- No usar Tailwind.
- No usar estilos inline para colores, bordes, tipografia, sombras o layout.
- No duplicar tokens con hexadecimales propios dentro del feature.
- No aplicar utilidades como `border-none` sobre `.p-button`, `.btn`, `.p-inputtext`, `.p-password`, `.p-select` o controles base si se espera conservar el borde global del sistema.

En SCSS local de feature:

- Permitido: nombres semanticos de pantalla como `.manual-card`, `.manual-detail`, `.manuals-editor`.
- Permitido: consumir tokens `var(--ds-*)` con fallback solo cuando ayude a robustez.
- Prohibido: declarar una nueva paleta local que compita con `theme/_variables.scss`.
- Prohibido: overrides globales de PrimeNG desde un componente; deben vivir en `src/styles/prime-overrides`.

Excepcion tecnica: editores externos como Draw.io/diagrams.net pueden requerir colores literales dentro de XML/configuracion. En ese caso, los valores deben mapearse a la paleta oficial y documentarse cerca de la configuracion.

## Orden de carga

```json
"styles": [
  "node_modules/primeflex/primeflex.css",
  "flatpickr/dist/flatpickr.css",
  "node_modules/primeicons/primeicons.css",
  "src/styles/ds-entry.scss",
  "src/styles/styles.scss",
  "node_modules/animate.css/animate.min.css"
]
```

## Overrides de PrimeNG 21

Para sobrescribir estilos globales de PrimeNG:

1. Buscar si existe un token `--p-*`.
2. Si existe, ajustarlo en `src/styles/prime-overrides/_prime-tokens.scss` o en el partial del componente.
3. Si no existe, usar selector global con especificidad controlada en `src/styles/prime-overrides/_prime-[component].scss`.
4. Registrar el partial en `src/styles/ds-entry.scss`.

Ejemplo:

```scss
body .p-button {
  border-width: var(--ds-control-border-width, 1px);
}
```

No usar `src/styles/primeng-overrides.css` para cambios nuevos; no esta cargado por `angular.json`.

## Borde base de botones e inputs

El token central vigente es:

```scss
--ds-control-border-width: 1px;
```

Este token se aplica a botones e inputs propios del DS. Las cards base del DS y `p-card` usan borde por defecto de `1px solid var(--ds-border)`.

- Botones: `.btn`, `.p-button`.
- Botones alternos: `.p-togglebutton` y botones dentro de `.p-selectbutton`.
- Inputs: `.input`, `.p-inputtext`, `.p-textarea`.
- Wrappers: `.p-inputnumber-input`, `.p-password-input`, `.p-datepicker-input`.
- Selectores: `.p-select`, `.p-multiselect`, `.p-autocomplete-input`.
- Controles simples DS: `.checkbox`, `.radio`.
- Controles simples PrimeNG: `.p-checkbox-box`, `.p-radiobutton-box`, `.p-toggleswitch-slider`.

## Layout

Usar PrimeFlex 4:

```html
<div class="grid">
  <div class="col-12 md:col-6">...</div>
</div>

<div class="flex align-items-center justify-content-between gap-3">...</div>
```

Permitido:

- `grid`, `col-*`, `md:col-*`, `lg:col-*`
- `flex`, `flex-column`, `flex-wrap`
- `gap-*`, `align-items-*`, `justify-content-*`
- `border-round`, `border-round-xl`, `shadow-1` a `shadow-8`

Prohibido en codigo nuevo:

- Tailwind: `grid-cols-*`, `col-span-*`, `flex-col`, `items-center`, `justify-between`, `rounded-*`, `shadow-sm`
- Legacy: `p-grid`, `p-col-*`, `row`, `col-md-*`
- Inline styles para layout/colores.

## Colores y tokens

Preferir tokens:

```scss
var(--ds-primary)
var(--ds-bg-page)
var(--ds-bg-surface)
var(--ds-border)
var(--ds-border-strong)
var(--ds-control-border-width)
var(--ds-text-primary)
var(--ds-text-secondary)
```

Para PrimeNG, preferir variables `--p-*` antes que propiedades directas.

## Dark mode

El selector activo es exclusivamente:

```scss
body.theme-dark
```

`ThemeService` y otros componentes de control (como el UI Catalog) aplican la clase `theme-dark` directamente en la etiqueta `body` (e idealmente también en `html`). Los tokens CSS reaccionan a este selector directamente dentro de `theme/_variables.scss` para invertir los colores del sistema.

## Auditoria

```bash
rg -n "grid-cols-|col-span-|flex-col|items-center|justify-between|rounded-|shadow-sm|shadow-md|shadow-lg" src/app
rg -n "p-grid|p-col-|row|col-md-" src/app
rg -n "style=\".*(?:display|flex|grid|margin|padding|color|background)" src/app
rg -n "::ng-deep|ViewEncapsulation\\.None|!important" src/app
```

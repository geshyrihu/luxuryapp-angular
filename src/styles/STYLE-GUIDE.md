# Style Guide - Angular 21 + PrimeNG 21 + PrimeFlex 4

> Proyecto: LuxuryApp API (Client Angular)
> Version: 2.2
> Actualizado: 23 de abril de 2026
> Stack: Angular 21.0.8, PrimeNG 21.0.2, PrimeFlex 4.0.0, SCSS Design System

## Regla de oro

```text
1. PrimeNG 21      -> componentes UI, overlays, accesibilidad y validacion visual.
2. PrimeFlex 4     -> layout, spacing, responsive y utilidades en templates.
3. Design System   -> tokens --ds-*, botones, inputs, cards, tablas y alerts propios.
4. Prime overrides -> ajustes globales de PrimeNG desde src/styles/prime-overrides.
```

No usar estilos inline para layout, colores o overrides de componentes.

## Mapa de decisiones

Antes de crear una clase o tocar un estilo, decidir su nivel:

- Identidad visual: editar `src/styles/theme/_variables.scss`.
- PrimeNG global: editar o crear `src/styles/prime-overrides/_prime-[component].scss` y registrarlo en `src/styles/ds-entry.scss`.
- Componente reusable propio: editar o crear un partial en `src/styles/components`.
- Utilidad transversal: editar `src/styles/custom/_design-system-utilities.scss`.
- Caso local de una pantalla: usar el SCSS del componente Angular en `src/app/**`.

Una regla pasa de `src/app/**` a `src/styles` cuando se repite en mas de una feature, representa identidad visual, corrige PrimeNG globalmente, o define una convencion reutilizable para el ERP.

## Identidad LuxuryApp

La identidad ERP usa azul institucional como accion primaria y la paleta documental como soporte premium:

```scss
--ds-primary
--ds-luxury-gold
--ds-document-neutral
--ds-document-bg-muted
--ds-document-ink
--ds-document-surface
```

Uso recomendado:

- `--ds-primary`: acciones principales, encabezados operativos, estados activos y foco de navegacion.
- `--ds-luxury-gold`: acentos premium, portadas documentales, marcas de seccion o detalles de jerarquia alta.
- `--ds-document-neutral`: metadatos, texto secundario y leyendas documentales.
- `--ds-document-bg-muted`: fondos suaves de documentos, guias, cajas de ayuda o superficies no interactivas.
- `--ds-document-ink`: texto formal en documentos o vistas de lectura.
- `--ds-document-surface`: superficies de lectura/documento.

No crear paletas locales por modulo. Si Biblioteca, Configuracion o un componente core necesitan el mismo lenguaje visual, deben consumir estos tokens.

## Orden real de carga

El orden esta definido en `client/angular/angular.json`:

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

`ds-entry.scss` carga el Design System y los overrides activos de PrimeNG.
`styles.scss` carga la hoja global legacy/maestra y dark mode.

## PrimeNG 21

PrimeNG se configura en `src/app/app.config.ts` con:

```ts
providePrimeNG({
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '[data-theme="dark"], .theme-dark',
      cssLayer: {
        name: "primeng",
        order: "primeng, primeflex"
      }
    }
  }
})
```

PrimeNG queda dentro de la capa `primeng`. Los overrides locales del Design System son SCSS global sin capa, por eso pueden ganar sin `!important`.

## Donde sobrescribir PrimeNG

El punto de entrada correcto es `src/styles/ds-entry.scss`.

Para un componente PrimeNG nuevo:

1. Crear `src/styles/prime-overrides/_prime-[component].scss`.
2. Agregarlo en `src/styles/ds-entry.scss` junto a los demas `@use`.
3. Preferir tokens `--p-*` cuando existan.
4. Si el token no alcanza, usar especificidad controlada: `body .p-component`.
5. Evitar `::ng-deep`; usarlo solo en casos locales sin alternativa.

Archivos activos actuales:

- `prime-overrides/_prime-tokens.scss`: puente de tokens y compatibilidad de clases legacy.
- `prime-overrides/_prime-input.scss`: inputs, textarea y wrappers de fecha/password/number.
- `prime-overrides/_prime-button.scss`: botones PrimeNG.
- `prime-overrides/_prime-dialog.scss`: dialogos.
- `prime-overrides/_prime-table.scss`: datatable.
- `prime-overrides/_prime-dropdown.scss`: select, multiselect y autocomplete.

`src/styles/primeng-overrides.css` no esta en `angular.json`; no usarlo para nuevos cambios.

## Borde base de controles

El ancho base vigente para botones e inputs es:

```scss
--ds-control-border-width: 1px;
```

Se aplica a:

- `.btn` del Design System.
- `.input`, `.checkbox` y `.radio` del Design System.
- `.p-button` de PrimeNG.
- `.p-togglebutton` y botones dentro de `.p-selectbutton`.
- `.p-inputtext`, `.p-textarea`, `.p-inputnumber-input`, `.p-password-input`, `.p-datepicker-input`.
- `.p-select`, `.p-multiselect`, `.p-autocomplete-input`.
- `.p-checkbox-box`, `.p-radiobutton-box`, `.p-toggleswitch-slider`.

## PrimeFlex 4

Usar PrimeFlex para composicion:

```html
<div class="grid">
  <div class="col-12 md:col-6">...</div>
  <div class="col-12 md:col-6">...</div>
</div>

<div class="flex justify-content-between align-items-center gap-3">...</div>
```

No usar clases Tailwind ni legacy:

- `grid-cols-*`, `col-span-*`, `flex-col`, `items-center`, `justify-between`
- `p-grid`, `p-col-*`
- `row`, `col-md-*`

## Angular y encapsulacion

- Mantener `ViewEncapsulation.Emulated` por defecto.
- Usar `host: { class: "block" }` cuando el componente solo necesita layout base.
- Para PrimeNG, preferir `styleClass`, `inputStyleClass` o tokens antes de CSS local profundo.
- `ViewEncapsulation.None` solo para wrappers globales justificados.

## Auditoria rapida

```bash
rg -n "grid-cols-|col-span-|flex-col|items-center|justify-between|rounded-|shadow-sm|shadow-md|shadow-lg" src/app
rg -n "p-grid|p-col-|row|col-md-" src/app
rg -n "style=\".*(?:display|flex|grid|margin|padding|color|background)" src/app
rg -n "::ng-deep|ViewEncapsulation\\.None|!important" src/app
```

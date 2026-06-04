# Guía Definitiva: Alineación Perfecta de Toolbars (UI/UX)

Este documento detalla el estándar técnico de LuxuryApp para lograr una alineación "pixel-perfect" en las barras de herramientas (Toolbars) y cabeceras de tablas. Al combinar PrimeNG con Flexbox, es muy fácil que los elementos queden desalineados o encimados si no se estructuran correctamente.

## 🎯 El Problema
Al colocar componentes complejos (como `primeng-custom-caption`, botones nativos y selects) en un mismo contenedor, suelen aparecer desajustes de altura, "escalones" visuales o desbordamientos en pantallas pequeñas debido a márgenes residuales y comportamientos block/inline inconsistentes.

---

## 🛠️ La Solución: "El Patrón Compacto Flex"

Para garantizar una alineación prístina tanto en Mobile como en Desktop, usamos un patrón de triple capa basado en utilidades de PrimeFlex.

### 1. La Estructura HTML (El Layout Base)

El contenedor principal de la barra de herramientas **SIEMPRE** debe ser un contenedor `flex` que cambie de columna a fila según la resolución, distribuyendo el espacio de forma inteligente.

```html
<!-- Cabecera / Caption de la Tabla -->
<ng-template #caption>
  <!-- Contenedor Maestro: Apila en móvil, alinea en línea en escritorio -->
  <div class="flex flex-column md:flex-row md:align-items-center justify-content-between p-2 gap-2 surface-ground border-round">
    
    <!-- LADO IZQUIERDO: Buscador y Título (Toma el espacio libre) -->
    <div class="flex-grow-1">
      <primeng-custom-caption
        [title]="'Título'"
        (add)="onModalAddOrEdit()"
        [dt]="dt"
        [noPadding]="true" <!-- 🔥 CRÍTICO: Remueve márgenes internos del componente -->
        [noMargin]="true"  <!-- 🔥 CRÍTICO: Evita colisiones de grid -->
      />
    </div>

    <!-- LADO DERECHO: Filtros, Acciones y Toggles -->
    <div class="flex flex-column sm:flex-row align-items-center gap-2">
        
      <!-- Filtro Select (Ancho mínimo fluido) -->
      <div style="min-width: 200px">
        <custom-input-select-signal
          [control]="miControl"
          [noMargin]="true" <!-- 🔥 Elimina el margin-bottom 1rem del form-field -->
        />
      </div>

      <!-- Botón de Estado / Acción Estándar (Ancho fijo preventivo) -->
      <div class="flex-shrink-0" style="width: 150px">
        <custom-button-active-desactive
          [state]="estado"
        />
      </div>

    </div>
  </div>
</ng-template>
```

### 2. Reglas de Oro para Componentes Hijos

Para que los componentes vivan en armonía dentro del layout flex, debemos forzarlos a respetar las métricas del Design System.

#### A. Componentes Base (`primeng-custom-caption`)
Al insertarlo en un layout controlado por flex, siempre debes pasar las propiedades:
*   `[noPadding]="true"`
*   `[noMargin]="true"`
Esto desactiva los márgenes internos que fueron pensados para cuando el componente está aislado, evitando que empuje hacia abajo a los elementos vecinos.

#### B. Componentes de Input (`custom-input-select-signal`, `custom-input-text-signal`)
Estos componentes internamente renderizan un `<div class="field mb-3">`. Para usarlos en una barra horizontal:
*   Pasa `[noMargin]="true"`.
*   Asegúrate de que no tengan `size="small"` explícito si deseas que su altura (40px) coincida con la de los botones del Design System. El tamaño por defecto es el correcto.

#### C. Botones y Toggles (`custom-button-active-desactive`)
*   Nunca uses `width: 100%` en un flex container sin limitar a su padre. Envuelve el botón en un `<div class="flex-shrink-0" style="width: 150px">` para evitar que flexbox lo comprima o lo estire de forma irregular.
*   Mantén su altura coherente usando las clases estándar (`.btn` y sus modificadores de tipo "outline").

---

## 📱 Mobile First: Slots de Filtros

En pantallas pequeñas, apilar todo en el `caption` de la tabla suele ser engorroso. Si estás usando `app-data-view-mobile`, delega los filtros adicionales (como el de Activo/Inactivo o el agrupador) al slot `customFilters` para que se rendericen de forma nativa en la parte superior del listado.

```html
<app-data-view-mobile [data]="data()" [dt]="dt">
  <!-- Slot Dedicado para Filtros Móviles -->
  <div customFilters>
    <div class="px-4 py-2">
      <!-- Encabezado sutil -->
      <h5 class="m-0 mb-2 text-secondary text-xs uppercase tracking-wider">
        Filtrar por Estado
      </h5>
      
      <!-- Control fluido para aprovechar el 100% del ancho del móvil -->
      <ion-button-active-desactive
        fluid
        [state]="state()"
      />
    </div>
  </div>
  
  <ng-template #listItemTemplate let-item>...</ng-template>
</app-data-view-mobile>
```

## 📋 Checklist de Revisión Visual

Antes de dar por alineado un Toolbar, verifica:
1.  **Altura Horizontal:** ¿La barra de búsqueda, el selector de "Agrupar por" y los botones están todos sobre una misma línea recta invisible sin "saltos"?
2.  **Responsividad Desktop:** Si achicas la pantalla del navegador pero sigues en vista Desktop (md), ¿los elementos mantienen sus proporciones o se amontonan rompiendo el grid? (El uso de `flex-wrap` o `flex-column md:flex-row` lo soluciona).
3.  **Cohesión de Estilo:** ¿Tienen los botones secundarios un estilo "outline" (`[variant]="'outlined'"`) para no competir visualmente con el botón azul principal de "Nuevo Registro"?

Siguiendo esta guía, cualquier vista nueva mantendrá la elegancia y simetría característica del Design System de LuxuryApp. 🚀

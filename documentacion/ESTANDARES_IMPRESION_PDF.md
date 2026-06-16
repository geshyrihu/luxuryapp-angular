# 🖨️ Estándares de Generación e Impresión PDF - LuxuryApp

Este documento rige la normativa técnica para la exportación de documentos PDF dentro del Frontend en Angular. **Todo nuevo componente o reporte debe regirse estrictamente bajo estas dos modalidades**.

---

## 🏗️ 1. Modalidad Data-Driven (Reportes Estándar)

Ideal para listados tabulares, facturas, recibos y reportes generados a partir de datos (DTOs) donde el diseño de la pantalla no importa, sino la presentación formal corporativa.

### 📜 Reglas de Implementación

- 🛠️ **Servicio obligatorio:** `HtmlPrintService`.
- 🚫 **Restricciones:** Prohibido el uso de librerías de Canvas (ej. `html2canvas`, `jspdf`). Todo se renderiza usando `iframe` oculto + HTML puro nativo.
- 🎨 **Layout Corporativo:** 
  - Todo reporte debe invocar `buildStandardHeader(logo, titulo, folio, fecha, badge)` y `buildStandardFooter()`.
  - Los estilos base **deben** inyectarse llamando a `getStandardCss()`. Esto garantiza la consistencia del color corporativo (franja dorada, fuentes, logotipo dinámico) sin importar la vista de origen.
  - Para evitar fallos en la tipografía, el CSS inyectado cuenta con un *fallback* a la fuente del sistema en caso de que la variable CSS no esté disponible en el iframe (`var(--ds-font-family-document, "DM Sans", sans-serif)`).

---

## 🖥️ 2. Modalidad WYSIWYG (Basado en el DOM)

Se utiliza cuando la pantalla actual tiene un diseño complejo, rico visualmente (dashboards, infografías, **manuales operativos** con grids 50/50, tarjetas nativas e iconos SVG). Aquí la meta es: *"Lo que ves en pantalla, es lo que obtienes en PDF"*.

### 📜 Reglas de Implementación

- 🛠️ **Servicio obligatorio:** `PrintService` (`printElement()`). Este servicio invoca la ventana de impresión nativa del navegador sobre el DOM en vivo.
- 🚫 **Restricciones:** No crear componentes HTML paralelos o *gemelos* para ocultarlos en el DOM. Reutiliza el HTML vivo controlando la visibilidad con CSS.

### 📐 Reglas de Estilos (`_print.scss`)

Toda pantalla WYSIWYG debe aislar sus ajustes de impresión en `src/styles/custom/_print.scss` usando el selector de su componente base (ej. `app-manuals-and-processes-detail { ... }`). 

Debes respetar los siguientes lineamientos CSS para evitar distorsiones del layout:

#### 💡 2.1. Bloqueo de Columnas (PrimeFlex)
Al imprimir, el navegador simula un ancho reducido, forzando a PrimeFlex a colapsar todo en columnas (`flex-column`). Para conservar grids (ej. 50/50), fuerza el ancho con `!important`:
```css
.col-12.lg\:col-6 {
  width: 50% !important;
  max-width: 50% !important;
  flex: 0 0 50% !important;
}
```

#### 🖼️ 2.2. Protección de Imágenes (Logotipos)
Si una imagen (logo) se estira horriblemente deformándose al imprimir, es porque su contenedor padre colapsó a `flex-column` y activó `align-items: stretch`. 
* **Solución UI:** Agrega la clase `w-auto` a la etiqueta `<img>` o envuelve la imagen en un `<div>` neutro.

#### ✂️ 2.3. Saltos de Página
Para prevenir que una tarjeta, paso de manual o bloque quede cortado por la mitad en el salto de página:
```css
article, .surface-card {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}
```

#### 🌲 2.4. Ahorro de Papel (Compactación)
Los tamaños de texto de lectura en pantalla son demasiado grandes para papel. El archivo `_print.scss` contiene una regla global en su bloque `@media print`:
```css
html, body {
  font-size: 11px !important;
}
```
Esto reduce la unidad `rem`. Automáticamente, todos los márgenes, paddings y fuentes de PrimeFlex en toda la app se encogen un 30% proporcionalmente, ahorrando hojas de impresión sin romper el diseño.

#### 🔄 2.5. Orientación de Página
⚠️ **Jamás** incluyas `size: landscape;` o `size: portrait;` dentro de la etiqueta `@page` a nivel global.
Forzar un tamaño orientativo le roba al usuario (en Chrome/Edge) el menú desplegable para elegir entre orientación Vertical/Horizontal. Deja la regla `@page` únicamente para márgenes (`margin: 0.4in 0.5in;`).

---
_Última actualización: Junio 2026_

# Arquitectura de Layout: Monitor de Empleado (View Employee Monitor)

Este documento describe la estrategia de diseño utilizada en `view-employee-monitor.html` para resolver problemas persistentes de superposición, scroll global y conflictos de estilos.

## Estrategia: CSS Grid Nativo (Sin Frameworks)

Se ha implementado un layout basado en **CSS Grid Nativo** utilizando estilos en línea (`style="..."`) en el contenedor principal.

### ¿Por qué esta decisión?

Hemos optado por esta estrategia "agresiva" para:

1.  **Aislar el Layout:** Evitar que clases de Tailwind CSS, PrimeFlex o SCSS heredado interfieran con la geometría básica de la página.
2.  **Forzar Estructura:** El CSS Grid nativo garantiza que las áreas (Sidebar, Header, Body) respeten sus dimensiones y posiciones sin depender de `position: fixed` o `absolute`, que fallan fácilmente en contextos de apilamiento complejos.
3.  **Eliminar Scroll Global:** Al definir `height: 100vh` y `overflow: hidden` en el contenedor padre, evitamos que el navegador genere barras de scroll en el `body` principal.

## Estructura del Grid

El contenedor `#pageWrapper` define la siguiente retícula:

```css
display: grid;
grid-template-columns: auto 1fr; /* Columna 1: Sidebar (Ancho automático), Columna 2: Contenido (Resto) */
grid-template-rows: 90px 1fr; /* Fila 1: Header (90px fijos), Fila 2: Cuerpo (Resto del alto) */
width: 100vw;
height: 100vh;
overflow: hidden;
```

### Áreas Definidas

1.  **Sidebar (Izquierda Completa)**
    - **Ubicación:** Columna 1, Fila 1 hasta Fila 2 (`grid-row: 1 / span 2`).
    - **Comportamiento:** Ocupa todo el alto de la ventana (100vh). Se encuentra "al lado" del contenido principal, no "debajo" del header.
    - **Z-Index:** 60 (Superior al Header para proyectar sombra si es necesario).

2.  **Header (Arriba Derecha)**
    - **Ubicación:** Columna 2, Fila 1.
    - **Comportamiento:** Altura fija de 90px. Se mantiene siempre visible en la parte superior del área de contenido.
    - **Z-Index:** 50.

3.  **Main Content (Abajo Derecha)**
    - **Ubicación:** Columna 2, Fila 2.
    - **Comportamiento:** Ocupa el espacio restante. **AQUÍ reside el scroll interno.**
    - **Propiedades Clave:** `overflow-y: auto`, `overflow-x: hidden`. Esto asegura que solo el contenido central se desplace, manteniendo el Header y Sidebar fijos.

## Reglas de Mantenimiento

> [!WARNING]
> **NO MODIFICAR la estructura CSS Grid del `#pageWrapper`.**

- **NO** intentar reemplazar los estilos inline del grid con clases de utilidad (ej. `grid grid-cols-[auto_1fr]`) a menos que se verifique exhaustivamente. Las clases de utilidad a veces incluyen `min-height` o reset de estilos que pueden romper este delicado equilibrio.
- **NO** agregar `position: fixed` al Header o Sidebar dentro de esta estructura. El Grid ya se encarga de posicionarlos.
- Si se requiere modificar el ancho del Sidebar, hacerlo a través de la variable o propiedad en el componente `app-sidebar`, el Grid se ajustará automáticamente (`auto`).

---

**Fecha de Implementación:** 16/02/2026
**Autor:** Antigravity (Assistant)
## 4. Custom Sidebar Menu (Guide Light) - [Implementado: 16/02/2026]
**Decisión:** Se reemplazó el componente `p-panelMenu` (PrimeNG) por un template recursivo personalizado para resolver conflictos de layout y estilos.

### Estructura
- **Template Recursivo:** Usa `<ng-template #recursiveMenu>` en `sidebar.html`.
- **Lógica:** Método `toggle(item)` en `sidebar.ts` maneja el estado de expansión localmente.
- **Clases CSS Estrictas:**
    - `.guide-menu-list`: Fuerza layout de columna vertical, elimina bullets y padding.
    - `.guide-menu-item`: Maneja el estilo de los enlaces (rounded-right, padding).
    - `.guide-menu-item a.active-link`: Aplica el acento azul y borde izquierdo del estilo "Guide Light".

### Animación
- **fadeInDown:** `@keyframes` personalizados en `styles.scss` para expansión suave de subdirectorios.

### Beneficios Clave
1. **Control Total:** Sin pelear con overrides `!important` de frameworks.
2. **Performance:** Estructura HTML ligera sin overhead de componentes pesados.
3. **Consistencia:** Coincide exactamente con la guía de diseño (tipografía, espaciado, colores).

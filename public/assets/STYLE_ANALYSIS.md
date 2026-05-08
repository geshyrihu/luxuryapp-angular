# ANÁLISIS INTEGRAL DE ESTILOS Y GUÍA DE REFACTORIZACIÓN

**Fecha:** 16 de Febrero, 2026
**Ubicación:** `src/assets/STYLE_ANALYSIS.md`

Este documento detalla el estado actual de la arquitectura de estilos del proyecto `LuxuryApp`, identifica deuda técnica y propone una hoja de ruta para la refactorización hacia un estándar moderno usando **PrimeNG v21 + Tailwind CSS**.

---

## 1. ARQUITECTURA ACTUAL

El sistema de estilos actual es un **híbrido** que mezcla tres metodologías:

1.  **SCSS Global y Modular:** Herencia de arquitecturas clásicas (`assets/scss/theme`, `assets/scss/custom`).
2.  **PrimeNG Theming (Legacy & Modern):** Overrides manuales de CSS (`_custom-table-primeng.scss`) coexistiendo con el nuevo sistema de Presets (`mypreset.ts`).
3.  **Ionic Framework:** Variables de Ionic (`--ion-color-primary`) definidas manualmente en `_variables.scss`.
4.  **Tailwind CSS:** Configurado e importado, pero subutilizado en componentes antiguos.

### Flujo de Variables (Variable Chain)

Existe una cadena de dependencia crítica que debe respetarse o refactorizarse con cuidado:

1.  **Definición SCSS (`_variables.scss`):**
    - Define `$primary-500: #3f5e95;`
2.  **Exposición CSS (`_variables.scss` :root):**
    - Mapea SCSS a CSS Var: `--primary-500: #{$primary-500};`
    - Mapea a Ionic: `--ion-color-primary: #{$primary-500};`
3.  **Consumo en PrimeNG (`mypreset.ts`):**
    - Lee la CSS Var: `500: "var(--primary-500)"`
4.  **Consumo en Componentes:**
    - Usan clases de utilidad o variables CSS directamente.

---

## 2. INVENTARIO DE ARCHIVOS SCSS

Hemos escaneado el proyecto (`src/**/*.scss`) y clasificado los archivos según su función y estado.

### A. Core & Configuración (NO ELIMINAR AÚN)

Estos archivos son estructurales.

- `src/styles.scss`: Punto de entrada principal.
- `src/assets/fonts/_fonts.scss`: Definiciones de tipografía.
- `src/assets/scss/theme/_variables.scss`: **CRÍTICO.** Fuente de verdad de colores.
- `src/assets/scss/theme/_global.scss`: Resets globales.
- `src/assets/scss/theme/_sidebar.scss`, `_layout.scss`: Estructura del layout principal (posiblemente refactorizable a Tailwind).

### B. Custom Overrides (CANDIDATOS A REFACTORIZACIÓN)

Estos archivos sobrescriben estilos de PrimeNG "a la fuerza". El objetivo es eliminarlos y usar la configuración del `Preset`.

- `assets/scss/custom/_custom-table-primeng.scss`: _Deuda técnica alta._ Debería configurarse en el Preset.
- `assets/scss/custom/_custom-card-comite.scss`: Estilos ad-hoc.
- `assets/scss/custom/_custom-dialog-primeng.scss`: Override de diálogos.
- `assets/scss/custom/_custom-prime-icons.scss`: Ajustes de iconos.
- `assets/scss/custom/_list.scss`, `_loader.scss`, `_timeline-v.scss`: Componentes personalizados que deberían ser componentes de Angular o usar Tailwind.

### C. Estilos de Páginas (LEGACY)

Estilos específicos de vistas que deberían estar en el componente o ser Tailwind.

- `assets/scss/pages/login.scss`
- `assets/scss/pages/hr/_employee-form.scss`
- `assets/scss/pages/calendar/_maintenance-list.scss`
- ... y otros en `assets/scss/pages/`.

### D. Componentes con SCSS "Húerfanos" u Obsoletos

Componentes que definen utilidades que ya existen en Tailwind.

- `presupuesto-individual.scss`: Define clases como `.th-width-30`, `.flex-align-center`.
  - _Solución:_ Reemplazar `.th-width-30` con `w-[30%]` o `w-4/12` y `.flex-align-center` con `flex items-center`.

---

## 3. ANÁLISIS DE `MYPRESET.TS`

El archivo `src/app/mypreset.ts` es la **pieza clave de la modernización**.

- **Estado:** Correctamente implementado usando `definePreset(Lara, ...)`.
- **Estrategia:** Usa un enfoque "Bridge" (Puente), donde los tokens semánticos de PrimeNG apuntan a las variables CSS definidas en `_variables.scss`.
  - Ejemplo: `500: "var(--primary-500)"`
- **Ventaja:** Permite cambiar el tema "en caliente" modificando solo las variables CSS en el `root`, sin recompilar el JS.
- **Oportunidad:** Faltan definiciones de `borderRadius` y otros tokens de componentes que actualmente se hacen por CSS manual.

---

## 4. GUÍA DE ESTILOS Y HOJA DE RUTA

### Objetivo

Eliminar el 90% de los archivos SCSS en `assets/scss/custom` y `assets/scss/pages`, delegando el estilo a:

1.  **PrimeNG Preset (`mypreset.ts`):** Para consistencia global de componentes UI.
2.  **Tailwind CSS:** Para layout, espaciado, tipografía y colores puntuales.

### Reglas de Oro para Desarrollo (Do's and Don'ts)

| Hábito                            | Estado            | Razón / Reemplazo                                                                  |
| :-------------------------------- | :---------------- | :--------------------------------------------------------------------------------- |
| **Crear clases CSS** (`.my-card`) | ❌ **EVITAR**     | Usar clases de Tailwind: `bg-white p-4 rounded shadow`.                            |
| **Overrides con `::ng-deep`**     | ⛔ **PROHIBIDO**  | Rompe la encapsulación. Usar `styleClass` de PrimeNG o configurar el Preset.       |
| **Utility Classes manuales**      | ❌ **EVITAR**     | No crear `.flex-center`. Usar `flex items-center justify-center` de Tailwind.      |
| **Colores Hex directos**          | ❌ **EVITAR**     | Usar variables semánticas: `text-primary-500`, `bg-surface-50`.                    |
| **`!important`**                  | ⚠️ **PRECAUCIÓN** | Solo si es estrictamente necesario para sobreescribir estilos inline de librerías. |

### Plan de Refactorización (Paso a Paso)

#### Fase 1: Limpieza de Utilidades (Inmediato)

Escanear componentes y reemplazar clases CSS "tontas" por Tailwind.

- _Target:_ `presupuesto-individual.scss`, `entrega-recepcion-check.css`.
- _Acción:_ Eliminar archivo SCSS y poner clases Tailwind en el HTML.

#### Fase 2: Absorción de Overrides (Mediano Plazo)

Mover la configuración de estilos de componentes desde `.scss` hacia `mypreset.ts`.

- _Target:_ `_custom-table-primeng.scss`, `_custom-dialog-primeng.scss`.
- _Acción:_ Identificar qué propiedades cambian (padding, border-radius) y definirlas en el objeto `components` de `mypreset.ts`.

#### Fase 3: Migración de Layout (Largo Plazo)

Reescribir los estilos de estructura global usando Tailwind puro.

- _Target:_ `_sidebar.scss`, `_layout.scss`, `_header-mobile.scss`.
- _Acción:_ Convertir el layout a Flexbox/Grid con clases Tailwind en `app.html` o el layout principal.

---

## 5. CONCLUSIÓN

El proyecto tiene una base sólida pero arrastra deuda de estilos legacy. La existencia de `mypreset.ts` y la configuración de Tailwind son excelentes noticias. El esfuerzo debe centrarse en **dejar de escribir CSS** y empezar a **configurar el Preset** y **usar Tailwind**.

**Siguiente paso recomendado:** Seleccionar un módulo piloto (ej. `theme-designer` o `contabilidad`) y aplicar una refactorización "Zero SCSS" como prueba de concepto.

# ROL

Actúa como un **Senior UI/UX Designer y Design System Specialist** con más de 10 años de experiencia en la creación y auditoría de sistemas de diseño para aplicaciones empresariales de lujo. Tu expertise incluye accesibilidad (WCAG 2.2), diseño responsivo, y creación de tokens de diseño escalables.

# CONTEXTO

Se te proporcionará el documento **"Luxury Design System & Guide"** (D:\repos\luxuryapp-api\client\angular\src\app\features\system\infrastructure\ui-system\catalog-component-ui) que contiene la propuesta completa de colores, tipografía y su aplicación. Este design system será la base de una plataforma empresarial con dos dominios:

- **luxury-app.com** (información pública)
- **luxurybuildingapp.com** (funcionalidad de la aplicación)

# OBJETIVO

Realizar un **análisis exhaustivo y detallado (FASE 1)** de la propuesta de diseño, evaluando su coherencia, aplicabilidad, accesibilidad y escalabilidad en todos los contextos de uso.

# ALCANCE DEL ANÁLISIS

## 1. ANÁLISIS DE COLOR 🔴🟡🟢🔵

Evalúa detalladamente:

### 1.1 Paleta de Colores

- Identificación de colores primarios, secundarios, terciarios, neutros y de acento.
- Análisis de la armonía cromática y coherencia con la identidad "luxury".
- Verificación de la consistencia entre la paleta pública y la de la aplicación.

### 1.2 Modo Claro (Light Mode)

- Revisión de los valores de color asignados al tema claro.
- Evaluación de la legibilidad sobre fondos claros.
- Análisis de la jerarquía visual y contraste.

### 1.3 Modo Oscuro (Dark Mode)

- Revisión de los valores de color asignados al tema oscuro.
- Verificación de que no se usen colores saturados que causen fatiga visual.
- Evaluación de la profundidad y elevación (surfaces, overlays).
- Confirmación de que existe un mapeo correcto de tokens entre modo claro y oscuro.

### 1.4 Accesibilidad (WCAG 2.2)

- Cálculo de ratios de contraste para texto normal (mínimo 4.5:1) y texto grande (mínimo 3:1).
- Identificación de combinaciones de color que fallen en accesibilidad.
- Análisis del uso del color como único medio para transmitir información (daltonismo).

### 1.5 Semántica del Color

- Revisión de colores de estado: éxito, error, advertencia, información.
- Coherencia semántica entre modo claro y oscuro.

---

## 2. ANÁLISIS DE TIPOGRAFÍA 🔤

### 2.1 Familias Tipográficas

- Identificación de la(s) familia(s) tipográfica(s) seleccionada(s).
- Justificación de la elección en el contexto "luxury".
- Compatibilidad y disponibilidad (web fonts, licencias).

### 2.2 Escala Tipográfica (Type Scale)

- Revisión de la escala definida (h1, h2, h3, h4, h5, h6, body, caption, etc.).
- Análisis de la proporción matemática utilizada (major third, perfect fourth, etc.).
- Consistencia de la escala entre breakpoints.

### 2.3 Jerarquía y Legibilidad

- Evaluación de la diferenciación visual entre niveles.
- Análisis de interlineado (line-height), espaciado entre letras (letter-spacing) y longitud de línea.
- Legibilidad en tamaños pequeños para dispositivos móviles.

### 2.4 Responsive Typography

- Verificación de cómo se adapta la tipografía en móvil, tablet y desktop.
- Uso de unidades relativas (rem, em) vs. absolutas (px).

### 2.5 Pesos y Estilos

- Revisión de los pesos tipográficos definidos (light, regular, medium, semibold, bold).
- Coherencia en el uso de italic, uppercase, etc.

---

## 3. ANÁLISIS DE APLICACIÓN Y COMPONENTES 🧩

### 3.1 Tokens de Diseño

- Identificación de los design tokens definidos (color, spacing, typography, elevation, border-radius).
- Evaluación de la estructura de nombrado de los tokens.
- Verificación de que los tokens sean agnósticos al contexto (no hardcodeados).

### 3.2 Componentes Base

- Revisión de los componentes definidos (botones, inputs, cards, tags, tablas, etc.).
- Análisis de variantes y estados (default, hover, active, focus, disabled, error).
- Consistencia en el uso de colores y tipografía dentro de los componentes.

### 3.3 Espaciado y Layout

- Revisión del sistema de espaciado (grid, padding, margin).
- Análisis de la rejilla (grid system) propuesta.
- Consistencia en el uso de espacios en todos los componentes.

---

## 4. ANÁLISIS RESPONSIVO: WEB Y MÓVIL 📱💻

### 4.1 Diseño Web (Desktop)

- Evaluación del uso del espacio horizontal.
- Análisis de layouts multi-columna.
- Densidad de información y jerarquía visual.

### 4.2 Diseño Móvil

- Evaluación de la adaptación de tipografía a pantallas pequeñas.
- Análisis de tamaños de toque (mínimo 44x44px).
- Revisión de la simplificación de layouts y priorización de contenido.
- Verificación de la legibilidad en modo claro y oscuro en móvil.

### 4.3 Breakpoints

- Identificación de los breakpoints definidos.
- Evaluación de la fluidez de la transición entre breakpoints.

---

## 5. ANÁLISIS DE MODO CLARO VS MODO OSCURO ☀️🌙

### 5.1 Consistencia de la Experiencia

- Verificación de que la experiencia sea equivalente en ambos modos.
- Análisis de la transición entre modos (animaciones, tiempos).

### 5.2 Superficies y Elevación

- Revisión de cómo se manejan las sombras en modo claro vs. los bordes/iluminación en modo oscuro.
- Análisis de la jerarquía de profundidad en ambos modos.

### 5.3 Imágenes e Iconografía

- Verificación de que iconos e imágenes se adapten correctamente a ambos modos.
- Análisis de opacidades y overlays.

---

# ENTREGABLES ESPERADOS

El análisis debe generar un reporte estructurado con:

1. **Resumen Ejecutivo**: Hallazgos principales y puntuación global del design system (escala 1-10).

2. **Matriz de Hallazgos**: Tabla con:
   | # | Categoría | Hallazgo | Severidad (Crítico/Alto/Medio/Bajo) | Recomendación |

3. **Auditoría de Contraste**: Tabla con todas las combinaciones de color evaluadas y su ratio de contraste.

4. **Recomendaciones Priorizadas**: Lista de mejoras ordenadas por impacto y esfuerzo.

5. **Checklist de Cumplimiento**: Verificación de buenas prácticas de design systems (atomic design, tokenización, documentación).

6. **Análisis FODA**: Fortalezas, Oportunidades, Debilidades y Amenazas del design system propuesto.

7. **Próximos Pasos (FASE 2)**: Sugerencias de qué analizar en la siguiente fase (animaciones, patrones de interacción, iconografía, etc.).

# FORMATO DE SALIDA

- Lenguaje: Español
- Tono: Profesional y técnico
- Formato: Markdown estructurado con tablas, listas y secciones claras
- Incluir capturas o referencias visuales cuando sea posible

# INSTRUCCIONES FINALES

- Sé crítico pero constructivo.
- Prioriza la accesibilidad y la consistencia.
- Considera el contexto "luxury" en todas tus evaluaciones.
- Si falta información en el design system, indícalo claramente como un hallazgo.
- No asumas información que no esté explícita en el documento.

---

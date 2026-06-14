Actúa como un arquitecto senior Frontend UX/UI especializado en Angular 21, PrimeNG 21, PrimeFlex, Ionic y aplicaciones ERP corporativas de clase mundial.

Tu tarea es crear una base DEMO real dentro de mi proyecto, reutilizando y respetando mi sistema de estilos actual, sin romper la arquitectura existente y sin introducir estilos improvisados o inconsistentes.

## CONTEXTO DEL PROYECTO

Mi sistema es híbrido:

- Web: Angular 21
- UI Library principal: PrimeNG 21
- Layout/utilidades: PrimeFlex
- Mobile rendering: Ionic
- Objetivo: definir una guía visual, funcional y estructural institucional para una app ERP de nivel empresarial

## OBJETIVO PRINCIPAL

Crear un módulo demo institucional que sirva como guía viva y visual de estándares de interfaz para toda la aplicación.

Este demo debe mostrar claramente cómo deben construirse, verse y ordenarse todos los elementos de la app:

- Botones
- Cards
- Inputs
- Selects
- MultiSelect
- Tables
- Formularios
- Headers
- Toolbars
- Modales
- Alerts
- Tags
- Badges
- Tabs
- Grids
- Listados
- Estados vacíos
- Loaders
- Mensajes de validación
- Layouts responsivos
- Reglas de espaciado
- Tipografía
- Pesos tipográficos
- Íconos
- Colores institucionales
- Accesibilidad visual
- Adaptación móvil

## RUTAS Y UBICACIONES OBLIGATORIAS

Debes crear el componente demo en esta ruta:

D:\repos\luxuryapp-api\client\angular\src\app\features\configuration\demo-app

Y debes registrar su card de acceso dentro de:

D:\repos\luxuryapp-api\client\angular\src\app\features\configuration\configuration-menu

## REGLAS IMPORTANTES

1. Debes basarte en PrimeNG 21 + PrimeFlex como sistema principal.
2. Debes considerar que la app también se renderiza en pantallas móviles con Ionic.
3. No debes proponer un sistema teórico únicamente; debes aterrizarlo en componentes reales y reutilizables.
4. No debes depender de clases internas frágiles de PrimeNG si se puede evitar.
5. Prioriza una arquitectura mantenible, limpia y escalable.
6. El resultado debe verse institucional, elegante, moderno, ERP, ejecutivo y consistente.
7. Todo debe quedar preparado para servir como guía oficial del sistema.
8. Debes proponer reglas claras, no ambiguas.
9. Debes respetar la coherencia visual entre desktop y mobile.
10. No uses Tailwind.
11. No generes estilos desordenados por componente si conviene centralizarlos.
12. Debes pensar como si estuvieras definiendo el Design System oficial de la plataforma.

## LO QUE NECESITO QUE GENERES

Quiero que construyas una DEMO completa y bien organizada que incluya al menos estas secciones:

### 1. Introducción institucional

Una vista inicial que explique que este módulo sirve como guía visual y funcional del sistema ERP.

### 2. Tipografía

Definir y mostrar:

- Fuente principal recomendada
- Fuente secundaria si aplica
- Tamaños base
- Escala tipográfica
- Uso de negritas
- Qué sí usar y qué no usar
- Jerarquías visuales
- Reglas para títulos, subtítulos, labels, texto auxiliar y texto de tabla

### 3. Paleta de colores

Definir visualmente:

- Color primario
- Secundario
- Success
- Warning
- Danger
- Info
- Neutrales
- Bordes
- Fondos
- Hover
- Disabled
- Estados activos
- Contraste mínimo recomendado

Explicar para qué se usa cada color dentro de un ERP institucional.

### 4. Botones

Mostrar ejemplos reales y reglas de uso para:

- Primary
- Secondary
- Success
- Danger
- Warning
- Outline
- Text
- Icon button
- Small / Medium / Large
- Disabled
- Full width en mobile cuando aplique

Definir:

- Cuándo usar cada tipo
- Jerarquía entre acciones primarias y secundarias
- Cuántos botones máximo por bloque
- Orden recomendado de acciones (guardar, cancelar, eliminar, regresar, etc.)

### 5. Cards institucionales

Mostrar cards como patrón ERP para accesos, resumen, métricas o navegación.
Definir:

- Alturas consistentes
- Espaciados
- Títulos
- Subtítulos
- Íconos
- Hover
- Clickable cards
- Cards de menú
- Cards informativas
- Cards de estado

### 6. Inputs y formularios

Mostrar reglas claras para:

- Input text
- Input number
- Textarea
- Select
- MultiSelect
- DatePicker
- Toggle
- Checkbox
- RadioButton
- Search field

Definir:

- Orden recomendado de inputs
- Agrupación lógica
- Separación entre bloques
- Labels arriba o al lado
- Campos obligatorios
- Mensajes de error
- Ayuda contextual
- Placeholders
- Anchos recomendados
- Formularios de 1, 2 y 3 columnas
- Adaptación a móvil

### 7. Tablas ERP

Mostrar una tabla estándar institucional con:

- Encabezado
- Acciones
- Estado vacío
- Filtros
- Paginación
- Chips/Tags de estado
- Acciones por fila
- Responsive behavior

Definir reglas para:

- Cuántas acciones visibles poner
- Uso de menú contextual
- Alineación de columnas
- Uso de números, fechas, importes y estados

### 8. Layout y espaciado

Definir visualmente:

- Márgenes
- Paddings
- Separaciones entre secciones
- Grid base
- Reglas de alineación
- Anchos máximos
- Densidad visual
- Cómo deben comportarse formularios y cards en desktop, tablet y móvil

### 9. Estados del sistema

Mostrar componentes o ejemplos para:

- Loading
- Empty state
- Error state
- Success message
- Warning message
- Confirmación
- Toasts
- Sin resultados
- Sin permisos

### 10. Mobile / Ionic

Debes incluir criterios claros para render móvil:

- Qué cambia en pantallas pequeñas
- Cuándo apilar elementos
- Botones full width
- Tablas simplificadas
- Cards como reemplazo de tablas cuando convenga
- Tamaños táctiles
- Espaciado para uso con dedo
- Compatibilidad visual con Ionic

### 11. Reglas globales del ERP

Quiero que definas reglas concretas como:

- Qué tan redondeados deben ser los bordes
- Cuándo usar sombra y cuándo no
- Cuándo usar cards vs paneles
- Cuándo usar dialogs vs navegación
- Cuándo usar botones con ícono
- Cómo priorizar acciones
- Cómo mantener consistencia en toda la app
- Qué prácticas evitar

## ENTREGABLES ESPERADOS

Necesito que me devuelvas una solución completa con enfoque práctico, incluyendo:

1. Estructura de carpetas propuesta para el demo-app
2. Archivos a crear
3. Código Angular necesario
4. HTML de la demo
5. SCSS necesario
6. Registro dentro de configuration-menu
7. Datos mock si hacen falta
8. Explicación de por qué se decidió cada regla visual
9. Recomendaciones para convertir esta demo en estándar oficial del proyecto

## FORMA DE TRABAJO

Quiero que actúes como experto y tomes decisiones razonadas.
No te limites.
Si detectas que faltan definiciones críticas para una app ERP de clase mundial, agrégalas aunque yo no las haya pedido explícitamente.

## MUY IMPORTANTE

- Debes asumir que esto será la base oficial de lineamientos UI del sistema.
- Debes priorizar consistencia, escalabilidad y claridad.
- Debes proponer estándares aterrizados a mi stack real.
- Debes pensar tanto en desktop como en mobile.
- Debes entregar algo elegante, corporativo, usable y mantenible.
- Todo debe sentirse como una app institucional seria y moderna.

Genera la solución completa.

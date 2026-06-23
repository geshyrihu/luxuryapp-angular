### 📌 Objetivo

Analizar y reestructurar el contenido del directorio
`D:\repos\luxuryapp-api\client\angular\src\app\features\system\catalogs\catalog-component-ui`
para consolidarlo como el **catálogo central de diseño y componentes** de la aplicación.

### 🎯 Contexto y Propósito

Este módulo debe funcionar como un _admin template_ de referencia para todo el equipo de desarrollo. Su finalidad es documentar y exhibir de forma ordenada:

- Reglas de tipografía y paleta de colores de marca.
- Todos los componentes reutilizables empleados en la aplicación (de gran escala).
- Guías claras de implementación, estados y ejemplos prácticos de uso.

### ⚙️ Especificaciones Técnicas

- **Framework:** Angular 21 (arquitectura híbrida).
- **Móvil:** Ionic.
- **Web:** PrimeNG 21.
- **Estilos:** Actualmente los estilos de Ionic no están aplicados. Deben refactorizarse para alinearse con una línea visual **Material Design**, garantizando coherencia cross-platform.

### 📐 Requisitos de Organización y Alcance

1. **Estructura tipo Admin Template:** El catálogo debe mostrar cada componente junto a su documentación de uso, props/interfaces, variantes y reglas de implementación.
2. **Ejemplos Funcionales:** Incluir vistas de referencia (login, formularios, tablas, modales, navegación, cards, etc.), aunque no todos se activen en producción de inmediato.
3. **Sistema de Diseño Centralizado:** Este directorio será la base visual y estructural para toda la aplicación, facilitando escalabilidad, mantenimiento y consistencia.
4. **Independencia y Reutilización:** Los componentes deben ser desacoplados, fácilmente importables y compatibles con los flujos de Ionic (móvil) y PrimeNG (web).

### 📦 Entregables Esperados

- ✅ Código refactorizado, modular y debidamente comentado.
- ✅ Catálogo visual interactivo con ejemplos de cada componente.
- ✅ Guías de estilo integradas (design tokens: colores, tipografía, espaciado, elevación, estados).
- ✅ Adaptación de estilos Ionic a la línea visual Material Design.
- ✅ Estructura lista para ser consumida por el resto de la aplicación y escalable a futuro.

---

### 💡 Recomendaciones Técnicas Adicionales

1. **Herramienta de Catálogo:** Considera integrar **Storybook for Angular** o un routing interno tipo `/catalog` para visualizar componentes en aislamiento sin afectar la app productiva.
2. **Design Tokens:** Centraliza colores, tipografía y espaciado en un archivo `tokens.scss` o `theme.ts` para que PrimeNG e Ionic los consuman automáticamente.
3. **Compatibilidad Móvil/Web:** Usa `@ionic/angular` para contenedores responsivos y `primeng` para componentes web, aplicando `cdk-overlay` o directivas de adaptación de tema según la plataforma.
4. **Documentación Inline:** Agrega `@ng-doc` o comentarios JSDoc en los componentes para generar documentación automática de props, eventos y slots.

Si necesitas que traduzca esto a un template de ticket (Jira/Azure DevOps), a un `README.md` técnico o que estructure el árbol de carpetas recomendado para este módulo, avísame y lo genero en el formato que prefieras.

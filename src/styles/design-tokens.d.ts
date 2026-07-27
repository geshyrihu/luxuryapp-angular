/**
 * design-tokens.d.ts
 * Declaraciones de tipos estáticos para los Design Tokens de la aplicación.
 * 
 * Este archivo actúa como contrato entre los estilos SCSS/CSS y los 
 * componentes UI en TypeScript, garantizando tipado fuerte para colores,
 * tamaños y utilidades del Design System.
 */

export namespace DSTokens {
  /** Colores Semánticos Principales */
  export type SemanticColor = 
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'help'
    | 'neutral'
    | 'contrast';

  /** Tamaños Estándar de Componentes (Alturas / Botones) */
  export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /** Escala de Espaciado (Basado en múltiplos de 4px) */
  export type Spacing = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48;

  /** Puntos de Quiebre (Breakpoints) Responsive */
  export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /** Grosores de Borde */
  export type BorderWidth = 'thin' | 'default' | 'medium' | 'thick';

  /** Tamaños de Radio (Border-Radius) */
  export type BorderRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

  /** Escala de Sombras (Elevación) */
  export type Shadow = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'focus';

  /** Capas de Z-Index */
  export type ZIndex = 'base' | 'raised' | 'dropdown' | 'sticky' | 'fixed' | 'overlay' | 'modal' | 'popover' | 'toast' | 'tooltip';
}

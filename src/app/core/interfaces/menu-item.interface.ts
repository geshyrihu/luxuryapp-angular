export interface MenuItem {
  label?: string;
  icon?: string;
  command?: (event: { originalEvent: Event; item: MenuItem }) => void;
  url?: string;
  // Algunos menús adaptativos aceptan también componentes como plantillas.
  items?: unknown[];
  expanded?: boolean;
  active?: boolean;
  disabled?: boolean;
  visible?: boolean;
  routerLink?: unknown;
  separator?: boolean;
  badge?: string;
  styleClass?: string;
  id?: string;
  [key: string]: unknown;
}

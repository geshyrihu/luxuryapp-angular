import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
/**
 * Modelo de item de menú neutral (sin dependencia de PrimeNG ni Ionic), usado por
 * la familia de menús/navegación multiplataforma: Menubar, MegaMenu, ContextMenu,
 * Dock, Sidebar. Es estructuralmente compatible con `MenuItem` de PrimeNG para los
 * campos comunes, de modo que puede pasarse a `p-*` sin conversión.
 */
export interface LxMenuItem {
  /** Identificador opcional para tracking / activeId. */
  id?: string;
  label?: string;
  /** Nombre de icono `app-icon` (Iconify). */
  icon?: AppIconName;
  /** Ruta de navegación (Angular Router). */
  routerLink?: string | unknown[];
  url?: string;
  disabled?: boolean;
  separator?: boolean;
  /** Badge/contador opcional. */
  badge?: string | number;
  /** Submenú (mega/menubar/sidebar anidado). */
  items?: LxMenuItem[];
  /** Callback al activar el item. */
  command?: (event?: unknown) => void;
  /** Datos libres del consumidor. */
  data?: unknown;
}

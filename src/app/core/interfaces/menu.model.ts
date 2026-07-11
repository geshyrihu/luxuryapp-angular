// En: src/app/core/interfaces/menu.model.ts

// ===================================================================
// 1. MODELOS DE API (Reflejan la respuesta del backend)
// ===================================================================

export interface MenuItemDto {
  id: string;
  label: string;
  icon: string;
  nameModule: string;
  routerLink: string | null;
  active: boolean;
  items: SubMenuItem[];
}
export interface SubMenuItem {
  id: string;
  label: string;
  routerLink: string;
  nameModule: string;
  active?: boolean;
}

// // ===================================================================
// // 2. MODELO DE VISTA (Lo que el Sidebar usa para pintar)
// // ===================================================================
// // Lo definimos como una CLASE porque tu Sidebar lo importa así.
// export class Menu {
//   id: string;
//   level?: number;
//   path?: string;
//   label?: string;
//   type?: string;
//   icon?: string;
//   active?: boolean;
//   bookmark?: boolean;
//   children?: Menu[]; // Los hijos también son de tipo Menu
//   headTitle1?: string; // Para los títulos de sección
// }

// ===================================================================
// 3. MODELO DE VISTA ARA MENU DE SETTINGS
// ===================================================================

export interface SettingsMenuItem {
  group: string;
  visible: boolean;
  label: string;
  icon: string;
  routerLink: string;
}

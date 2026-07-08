import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ISettingsMenuItem } from "src/app/core/interfaces/menu.model";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import {
  normalizePrimeIconClass,
  resolvePrimeIcon,
} from "src/app/core/utils/icon-mapping";
import * as MenuItems from "./index-menu-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
;
;

interface IMenuTone {
  card: string;
  accent: string;      // hex é border-top y color de icono (alineado con master-dashboard)
  bgColor: string;     // hex é fondo del contenedor de icono
  desktopShell: string;
  mobileShell: string;
  glyph: string;
  heading: string;
}

@Component({
  selector: "app-settings-home",
  imports: [
    CommonModule,
    RouterModule,
    DataViewMobile,
    MobileListItem,
    AppIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./settings-home.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./settings-home.scss"],
})
export class SettingsHome {
  public aspRoleS = inject(AspRoleService);
  menuItemsGrouped: any;
  private readonly defaultTone: IMenuTone = {
    card: "border-primary",
    accent: "#003d9b",   bgColor: "#edf1ff",
    desktopShell: "surface-100 border-1 border-primary border-round-xl",
    mobileShell:  "surface-100 border-1 border-primary border-round-md",
    glyph: "text-primary",
    heading: "text-900",
  };

  private readonly toneByGroup: Record<string, IMenuTone> = {
    "Seguridad y Permisos": {
      card: "border-blue-200",
      accent: "#1d4ed8", bgColor: "#dbeafe",
      desktopShell: "bg-blue-50 border-1 border-blue-200 border-round-xl",
      mobileShell:  "bg-blue-50 border-1 border-blue-200 border-round-md",
      glyph: "text-blue-700", heading: "text-blue-900",
    },
    "Catalogos Generales": {
      card: "border-cyan-200",
      accent: "#0e7490", bgColor: "#cffafe",
      desktopShell: "bg-cyan-50 border-1 border-cyan-200 border-round-lg",
      mobileShell:  "bg-cyan-50 border-1 border-cyan-200 border-round-md",
      glyph: "text-cyan-700", heading: "text-cyan-900",
    },
    "Catalogos de Tickets y Mantenimiento": {
      card: "border-orange-200",
      accent: "#c2410c", bgColor: "#ffedd5",
      desktopShell: "bg-orange-50 border-1 border-orange-200 border-round-xl",
      mobileShell:  "bg-orange-50 border-1 border-orange-200 border-round-lg",
      glyph: "text-orange-700", heading: "text-orange-900",
    },
    "Configuracion de Sistema": {
      card: "border-indigo-200",
      accent: "#4338ca", bgColor: "#e0e7ff",
      desktopShell: "bg-indigo-50 border-1 border-indigo-200 border-round-xl",
      mobileShell:  "bg-indigo-50 border-1 border-indigo-200 border-round-md",
      glyph: "text-indigo-700", heading: "text-indigo-900",
    },
    "Configuracion de Correo Electronico": {
      card: "border-pink-200",
      accent: "#be185d", bgColor: "#fce7f3",
      desktopShell: "bg-pink-50 border-1 border-pink-200 border-round-lg",
      mobileShell:  "bg-pink-50 border-1 border-pink-200 border-round-md",
      glyph: "text-pink-700", heading: "text-pink-900",
    },
    "Recursos Humanos": {
      card: "border-teal-200",
      accent: "#0f766e", bgColor: "#ccfbf1",
      desktopShell: "bg-teal-50 border-1 border-teal-200 border-round-xl",
      mobileShell:  "bg-teal-50 border-1 border-teal-200 border-round-md",
      glyph: "text-teal-700", heading: "text-teal-900",
    },
    "Analisis y Registros": {
      card: "border-yellow-200",
      accent: "#a16207", bgColor: "#fef9c3",
      desktopShell: "bg-yellow-50 border-1 border-yellow-200 border-round-lg",
      mobileShell:  "bg-yellow-50 border-1 border-yellow-200 border-round-md",
      glyph: "text-yellow-700", heading: "text-yellow-900",
    },
    "Herramientas de Desarrollo/Prueba": {
      card: "border-green-200",
      accent: "#15803d", bgColor: "#dcfce7",
      desktopShell: "bg-green-50 border-1 border-green-200 border-round-xl",
      mobileShell:  "bg-green-50 border-1 border-green-200 border-round-md",
      glyph: "text-green-700", heading: "text-green-900",
    },
  };

  ngOnInit() {
    this.menuItemsGrouped = this.groupMenuItemsByGroup(
      MenuItems.settingMenu(this.aspRoleS),
    );
  }

  groupMenuItemsByGroup(items: ISettingsMenuItem[]) {
    return items.reduce((groups, item) => {
      const group = item.group || "Otros"; // Si no tiene un group, se asigna 'Otros'
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  }
  objectKeys(obj: object) {
    return Object.keys(obj);
  }

  menuIconClass(icon: string | null | undefined): string {
    const normalizedIcon = normalizePrimeIconClass(icon);
    if (normalizedIcon.startsWith("pi ") || normalizedIcon.startsWith("icon "))
      return normalizedIcon;

    return resolvePrimeIcon(icon, "mdi:cog");
  }

  hasPrimeIcon(icon: string | null | undefined): boolean {
    return !!icon && icon.trim().length > 0;
  }

  public menuTone(group: string | null | undefined): IMenuTone {
    if (!group) return this.defaultTone;

    return this.toneByGroup[group] ?? this.defaultTone;
  }

  menuCardClass(group: string | null | undefined): string {
    return [
      "h-full border-1 shadow-1 overflow-hidden transition-all transition-duration-300 relative",
      "hover:shadow-3 hover:border-primary cursor-pointer",
      this.menuTone(group).card
    ].join(" ");
  }

  menuShellClass(group: string | null | undefined, isMobile = false): string {
    const tone = this.menuTone(group);
    const sizeClasses = isMobile
      ? "w-2rem h-2rem mr-2"
      : "w-2.5rem h-2.5rem shadow-1 mb-2";

    return [
      "flex align-items-center justify-content-center flex-shrink-0",
      sizeClasses,
      isMobile ? tone.mobileShell : tone.desktopShell
    ].join(" ");
  }

  menuGlyphClass(
    icon: string | null | undefined,
    group: string | null | undefined,
    isMobile = false,
  ): string {
    const sizeClass = isMobile ? "text-base" : "text-lg";
    return [
      this.menuIconClass(icon),
      sizeClass,
      this.menuTone(group).glyph
    ].join(" ");
  }

  menuHeadingClass(group: string | null | undefined): string {
    return `col-12 text-xl font-bold mt-4 mb-2 ${this.menuTone(group).heading}`;
  }
}

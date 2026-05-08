import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DialogModule } from "primeng/dialog";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { ISettingsMenuItem } from "src/app/core/interfaces/menu.model";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import {
  normalizePrimeIconClass,
  resolvePrimeIcon,
} from "src/app/core/utils/prime-icon-resolver";
import * as MenuItems from "./index-menu-item";

interface IMenuTone {
  card: string;
  desktopShell: string;
  mobileShell: string;
  glyph: string;
  heading: string;
}

@Component({
  selector: "app-settings-home",
  imports: [RouterModule, DialogModule, DataViewMobile, IonItem, IonLabel],
  templateUrl: "./settings-home.html",
})
export class SettingsHome {
  public aspRoleS = inject(AspRoleService);
  menuItemsGrouped: any;
  private readonly defaultTone: IMenuTone = {
    card: "border-primary",
    desktopShell: "surface-100 border-1 border-primary border-round-xl",
    mobileShell: "surface-100 border-1 border-primary border-round-md",
    glyph: "text-primary",
    heading: "text-900",
  };

  private readonly toneByGroup: Record<string, IMenuTone> = {
    "Seguridad y Permisos": {
      card: "border-blue-200",
      desktopShell: "bg-blue-50 border-1 border-blue-200 border-round-xl",
      mobileShell: "bg-blue-50 border-1 border-blue-200 border-round-md",
      glyph: "text-blue-700",
      heading: "text-blue-900",
    },
    "Catalogos Generales": {
      card: "border-cyan-200",
      desktopShell: "bg-cyan-50 border-1 border-cyan-200 border-round-lg",
      mobileShell: "bg-cyan-50 border-1 border-cyan-200 border-round-md",
      glyph: "text-cyan-700",
      heading: "text-cyan-900",
    },
    "Catalogos de Tickets y Mantenimiento": {
      card: "border-orange-200",
      desktopShell: "bg-orange-50 border-1 border-orange-200 border-round-xl",
      mobileShell: "bg-orange-50 border-1 border-orange-200 border-round-lg",
      glyph: "text-orange-700",
      heading: "text-orange-900",
    },
    "Configuracion de Sistema": {
      card: "border-indigo-200",
      desktopShell: "bg-indigo-50 border-1 border-indigo-200 border-round-xl",
      mobileShell: "bg-indigo-50 border-1 border-indigo-200 border-round-md",
      glyph: "text-indigo-700",
      heading: "text-indigo-900",
    },
    "Configuracion de Correo Electronico": {
      card: "border-pink-200",
      desktopShell: "bg-pink-50 border-1 border-pink-200 border-round-lg",
      mobileShell: "bg-pink-50 border-1 border-pink-200 border-round-md",
      glyph: "text-pink-700",
      heading: "text-pink-900",
    },
    "Recursos Humanos": {
      card: "border-teal-200",
      desktopShell: "bg-teal-50 border-1 border-teal-200 border-round-xl",
      mobileShell: "bg-teal-50 border-1 border-teal-200 border-round-md",
      glyph: "text-teal-700",
      heading: "text-teal-900",
    },
    "Analisis y Registros": {
      card: "border-yellow-200",
      desktopShell: "bg-yellow-50 border-1 border-yellow-200 border-round-lg",
      mobileShell: "bg-yellow-50 border-1 border-yellow-200 border-round-md",
      glyph: "text-yellow-700",
      heading: "text-yellow-900",
    },
    "Herramientas de Desarrollo/Prueba": {
      card: "border-green-200",
      desktopShell: "bg-green-50 border-1 border-green-200 border-round-xl",
      mobileShell: "bg-green-50 border-1 border-green-200 border-round-md",
      glyph: "text-green-700",
      heading: "text-green-900",
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
    if (normalizedIcon.startsWith("pi ")) return normalizedIcon;

    return resolvePrimeIcon(icon, "pi pi-cog");
  }

  hasPrimeIcon(icon: string | null | undefined): boolean {
    return this.menuIconClass(icon).startsWith("pi ");
  }

  private menuTone(group: string | null | undefined): IMenuTone {
    if (!group) return this.defaultTone;

    return this.toneByGroup[group] ?? this.defaultTone;
  }

  menuCardClass(group: string | null | undefined): string {
    return [
      "surface-card text-color text-center h-full border-1 p-3 shadow-2",
      "hover:shadow-4 transition-all transition-duration-300 relative overflow-hidden",
      this.menuTone(group).card,
    ].join(" ");
  }

  menuShellClass(group: string | null | undefined, isMobile = false): string {
    const tone = this.menuTone(group);
    const sizeClasses = isMobile
      ? "w-2rem h-2rem mr-2"
      : "w-4rem h-4rem shadow-1 mb-2";

    return [
      "flex align-items-center justify-content-center flex-shrink-0",
      sizeClasses,
      isMobile ? tone.mobileShell : tone.desktopShell,
    ].join(" ");
  }

  menuGlyphClass(
    icon: string | null | undefined,
    group: string | null | undefined,
    isMobile = false,
  ): string {
    const sizeClass = isMobile ? "text-base" : "text-2xl";
    return [this.menuIconClass(icon), sizeClass, this.menuTone(group).glyph].join(
      " ",
    );
  }

  menuHeadingClass(group: string | null | undefined): string {
    return `col-12 text-2xl font-bold mt-4 mb-2 ${this.menuTone(group).heading}`;
  }
}

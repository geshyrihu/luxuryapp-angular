import { Directive, input, model, output } from "@angular/core";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export interface BottomNavItem {
  id: string;
  icon: AppIconName;
  activeIcon?: AppIconName;
  label: string;
  badge?: number;
}

@Directive()
export abstract class BottomNavBase {
  items     = input<BottomNavItem[]>([]);
  activeId  = model<string>("");
  ariaLabel = input<string>("Navegación principal");

  navChange = output<string>();

  select(id: string): void {
    this.activeId.set(id);
    this.navChange.emit(id);
  }
}

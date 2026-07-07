import { Directive, input, model, output } from "@angular/core";

export interface BottomNavItem {
  id: string;
  icon: string;
  activeIcon?: string;
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

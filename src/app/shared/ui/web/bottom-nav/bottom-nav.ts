import { Component, ViewEncapsulation, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabMenuModule } from "primeng/tabmenu";
import type { MenuItem } from "primeng/api";
import { BottomNavBase } from "@ui/base/bottom-nav.base";

@Component({
  selector: "app-bottom-nav",
  standalone: true,
  imports: [CommonModule, TabMenuModule],
  template: `
    <div class="bottom-nav-web" [attr.aria-label]="ariaLabel()">
      <p-tabMenu
        [model]="menuItems()"
        [activeItem]="activeMenuItem()"
        (activeItemChange)="onTabChange($event)"
      />
    </div>
  `,
  styles: [`
    .bottom-nav-web {
      width: 100%;
    }
    .bottom-nav-web .p-tabmenu-nav {
      justify-content: space-around;
    }
    .bottom-nav-web .p-tabmenu .p-tabmenu-nav .p-tabmenuitem {
      flex: 1;
    }
    .bottom-nav-web .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link {
      justify-content: center;
      padding: 0.75rem 0.5rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class BottomNav extends BottomNavBase {
  menuItems = computed<MenuItem[]>(() =>
    this.items().map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
    }))
  );

  activeMenuItem = computed<MenuItem | undefined>(() =>
    this.menuItems().find((m) => m.id === this.activeId())
  );

  onTabChange(event: MenuItem): void {
    if (event.id) {
      this.select(event.id);
    }
  }
}

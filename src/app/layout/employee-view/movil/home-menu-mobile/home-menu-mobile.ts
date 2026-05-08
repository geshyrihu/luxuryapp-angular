import {
  Component,
  computed,
  EventEmitter,
  Output,
  inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  IonAccordion,
  IonAccordionGroup,
  IonList,
} from "@ionic/angular/standalone";
import { MenuItem } from "primeng/api";
import { IMenuItem, ISubMenuItem } from "src/app/core/interfaces/menu.model";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { MenuService } from "src/app/core/services/menu.service";
@Component({
  selector: "app-home-menu-mobile",
  templateUrl: "./home-menu-mobile.html",
  imports: [RouterModule, IonAccordion, IonAccordionGroup, IonList],
})
export class HomeMenu {
  @Output() onCloseMenu = new EventEmitter<void>();

  menuService = inject(MenuService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);

  menuItems = computed(() => {
    const customerId: string = this.customerIdS.customerId();
    const rawItems = this.menuService.sidebarMenuItems();

    if (!customerId) {
      return [];
    }

    const transformedItems = this.applyCustomTransformations(rawItems);
    return this.mapToMenuItems(transformedItems);
  });

  constructor() {}
  onItemClick() {
    this.onCloseMenu.emit();
  }
  private applyCustomTransformations(items: IMenuItem[]): IMenuItem[] {
    const clonedItems = structuredClone(items);
    return clonedItems;
  }

  mapToMenuItems(items: IMenuItem[]): MenuItem[] {
    return items.map((item) => {
      const tempItem: MenuItem = {
        label: item.label,
        icon: item.icon,
        routerLink: item.routerLink,
        items: item.items ? this.mapSubItemsToMenuItems(item.items) : undefined,
      };
      return tempItem;
    });
  }

  mapSubItemsToMenuItems(subItems: ISubMenuItem[]): MenuItem[] {
    return subItems.map((subItem) => {
      const tempSubItem: MenuItem = {
        label: subItem.label,
        routerLink: subItem.routerLink,
      };
      return tempSubItem;
    });
  }
  logOut() {
    this.authS.logout().subscribe();
  }
}

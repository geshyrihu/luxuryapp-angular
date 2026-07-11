// @ts-nocheck
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MenuItem } from "primeng/api";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { MenuItemDto, SubMenuItem } from "src/app/core/interfaces/menu.model";
import { MenuService } from "src/app/core/services/menu.service";
@Component({
  selector: "app-home-menu-mobile",
  templateUrl: "./home-menu-mobile.html",
  imports: [
    RouterModule,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonList,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeMenu {
  onCloseMenu = output<void>();

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
  private applyCustomTransformations(items: MenuItem[]): MenuItem[] {
    const clonedItems = structuredClone(items);
    return clonedItems;
  }

  mapToMenuItems(items: MenuItem[]): MenuItem[] {
    return items.map((item) => {
      const tempItem: MenuItem = {
        label: item.label,
        icon: item.icon,
        routerLink: item.routerLink,
        items: item.items ? ((this.mapSubItemsToMenuItems(item.items) as any[]) as any[]) as any[] : undefined,
      };
      return tempItem;
    });
  }

  mapSubItemsToMenuItems(subItems: SubMenuItem[]): MenuItem[] {
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

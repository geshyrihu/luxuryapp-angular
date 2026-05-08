import { CommonModule } from "@angular/common";
import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MenuItem } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { filter, map } from "rxjs/operators";
import { IMenuItem, ISubMenuItem } from "src/app/core/interfaces/menu.model";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { LayoutService } from "src/app/core/services/layout.service";
import { MenuService } from "src/app/core/services/menu.service";

@Component({
  selector: "app-sidebar",
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    InputTextModule,
    AvatarModule,
    DividerModule,
  ],
  templateUrl: "./sidebar.html",
})
export class Sidebar implements OnInit, OnDestroy {
  menuService = inject(MenuService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  router = inject(Router);
  public layoutService = inject(LayoutService);

  // Datos visibles del usuario y customer actual.
  public infoAccountAuthDTO = this.authS.infoUserAuth;
  public customerName = this.customerIdS.nombreCorto;
  public customerPhotoPath = this.customerIdS.customerPhotoPath;
  public profileImageUrl: string = this.infoAccountAuthDTO.photoPath;

  public menuItemsList: IMenuItem[] = [];
  public primengMenuItems: MenuItem[] = []; // New property for PrimeNG menu items
  public allMenuItems: IMenuItem[] = [];
  public searchText: string = "";
  public searchResults: ISubMenuItem[] = []; // Changed to ISubMenuItem[]
  public isSearching: boolean = false;
  public loading = this.menuService.menuLoading;

  private routerEventSignal = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: null },
  );

  public isShow: boolean = false;
  public pinnedData: boolean = false;
  public pinnedDataList: string[] = [];

  constructor() {
    // Sincroniza el árbol visual cada vez que cambia el menú del servicio.
    effect(() => {
      const items = this.menuService.sidebarMenuItems();
      this.menuItemsList = items;
      this.primengMenuItems = this.transformMenuItems(items);
      this.allMenuItems = JSON.parse(JSON.stringify(items));
      this.setActiveOnNavigation(this.router.url);
    });

    // Mantiene expandido el grupo correspondiente a la ruta actual.
    effect(() => {
      const url = this.routerEventSignal();
      if (url) {
        this.setActiveOnNavigation(url);
      }
    });
  }

  private transformMenuItems(items: (IMenuItem | ISubMenuItem)[]): MenuItem[] {
    return items.map((item) => {
      const primeNGItem: MenuItem = {
        label: item.label,
        routerLink: item.routerLink,
        expanded: (item as IMenuItem).active,
      };

      if ((item as IMenuItem).icon) {
        primeNGItem.icon = `pi ${(item as IMenuItem).icon}`;
      }

      if ((item as IMenuItem).items && (item as IMenuItem).items!.length > 0) {
        primeNGItem.items = this.transformMenuItems((item as IMenuItem).items!);
      }
      return primeNGItem;
    });
  }

  ngOnInit(): void {
    // Los effects del constructor reemplazan la suscripción manual clásica.
  }

  private setActiveOnNavigation(url: string): void {
    // Reinicia el estado expandido antes de marcar la rama activa.
    this.primengMenuItems.forEach((item) => this.resetExpandedState(item));

    for (const menuItem of this.primengMenuItems) {
      if (this.findAndExpandActiveItem(menuItem, url)) {
        break;
      }
    }
  }

  private resetExpandedState(item: MenuItem): void {
    if (item) {
      item.expanded = false;
      if (item.items) {
        item.items.forEach((subItem) => this.resetExpandedState(subItem));
      }
    }
  }

  private findAndExpandActiveItem(item: MenuItem, url: string): boolean {
    if (item.routerLink === url) {
      item.expanded = true;
      return true;
    }
    if (item.items) {
      for (const subItem of item.items) {
        if (this.findAndExpandActiveItem(subItem, url)) {
          item.expanded = true;
          return true;
        }
      }
    }
    return false;
  }

  isPined(itemName: string | undefined): boolean {
    return itemName !== undefined && this.pinnedDataList?.includes(itemName);
  }

  pinned(title: string) {
    const index = this.pinnedDataList.indexOf(title);
    if (index !== -1) {
      this.pinnedDataList.splice(index, 1);
    } else {
      this.pinnedDataList.push(title);
    }
    if (this.pinnedDataList.length <= 0) {
      this.pinnedData = false;
    } else {
      this.pinnedData = true;
    }
  }

  sidebarToggle() {
    this.menuService.collapseSidebar = !this.menuService.collapseSidebar;
  }

  searchTerm(): void {
    this.isSearching = this.searchText.length > 0;
    this.searchResults = [];

    if (this.searchText) {
      const lowerCaseSearchText = this.searchText.toLowerCase();

      this.allMenuItems.forEach((menuItem) => {
        if (menuItem.items && menuItem.items.length > 0) {
          menuItem.items.forEach((subItem) => {
            if (subItem.label?.toLowerCase().includes(lowerCaseSearchText)) {
              this.searchResults.push(subItem);
            }
          });
        }
      });
    }
  }

  clearSearch(): void {
    this.searchText = "";
    this.searchResults = [];
    this.isSearching = false;
  }

  toggle(item: MenuItem): void {
    if (item.items && item.items.length > 0) {
      item.expanded = !item.expanded;
    }
  }

  ngOnDestroy(): void {
    // Limpieza automática gracias a Signals
  }
}










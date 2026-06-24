import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
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
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
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
    AppIcon,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./sidebar.html",
})
export class Sidebar {
  menuService = inject(MenuService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  router = inject(Router);
  public layoutService = inject(LayoutService);

  public infoAccountAuthDTO = this.authS.infoUserAuth;
  public customerName = this.customerIdS.nombreCorto;
  public customerPhotoPath = this.customerIdS.customerPhotoPath;

  public get profileImageUrl(): string {
    return this.authS.infoUserAuth?.photoPath ?? "assets/images/default-avatar.png";
  }

  public primengMenuItems: MenuItem[] = [];
  public searchText: string = "";
  public searchResults: ISubMenuItem[] = [];
  public isSearching: boolean = false;
  public loading = this.menuService.menuLoading;

  readonly dsMenuItems: MenuItem[] = [
    {
      label: "Luxury Design System",
      icon: "mdi:palette-outline",
      expanded: true,
      items: [
        {
          label: "Tokens & Identidad",
          icon: "mdi:palette",
          items: [
            { label: "Colors", icon: "mdi:format-color-fill" },
            { label: "Typography", icon: "mdi:format-letter-case" },
          ],
        },
        {
          label: "Web (PrimeNG)",
          icon: "mdi:desktop-mac",
          items: [
            { label: "Accordion" },
            { label: "Badge" },
            { label: "Breadcrumb" },
            { label: "Button" },
            { label: "Card" },
            { label: "Checkbox" },
            { label: "DatePicker" },
            { label: "Dialog" },
            { label: "Divider" },
            { label: "InputNumber" },
            { label: "InputText" },
            { label: "Message" },
            { label: "MultiSelect" },
            { label: "Popover" },
            { label: "ProgressBar" },
            { label: "ProgressSpinner" },
            { label: "RadioButton" },
            { label: "Select" },
            { label: "SelectButton" },
            { label: "Skeleton" },
            { label: "Table" },
            { label: "Tabs" },
            { label: "Tag" },
            { label: "Textarea" },
            { label: "Toast" },
            { label: "ToggleSwitch" },
            { label: "Toolbar" },
            { label: "Tooltip" },
          ],
        },
        {
          label: "Mobile (Ionic)",
          icon: "mdi:cellphone",
          items: [
            { label: "Buttons", icon: "mdi:gesture-tap" },
            { label: "Inputs", icon: "mdi:keyboard" },
            { label: "Feedback", icon: "mdi:bell-outline" },
            { label: "Navigation", icon: "mdi:menu" },
            { label: "Lists", icon: "mdi:format-list-bulleted" },
            { label: "Data", icon: "mdi:database-outline" },
            { label: "Forms", icon: "mdi:form-dropdown" },
          ],
        },
        {
          label: "Gráficos",
          icon: "mdi:chart-bar",
          items: [
            { label: "Bar Chart", icon: "mdi:chart-bar" },
            { label: "Pie Chart", icon: "mdi:chart-pie" },
            { label: "Line Chart", icon: "mdi:chart-line" },
            { label: "Doughnut Chart", icon: "mdi:chart-donut" },
            { label: "Radar Chart", icon: "mdi:chart-radar" },
          ],
        },
        {
          label: "Core Components",
          icon: "mdi:cube",
          items: [
            { label: "Action Menu", icon: "mdi:dots-vertical" },
            { label: "App Icon", icon: "mdi:star" },
            { label: "Data View Mobile", icon: "mdi:view-list" },
            { label: "Loader", icon: "mdi:loading" },
            { label: "Notification Center", icon: "mdi:bell-outline" },
            { label: "PrimeNg Custom Caption", icon: "mdi:table-headers-eye" },
            { label: "Status Badge", icon: "mdi:check-circle" },
            { label: "Wizard", icon: "mdi:steps" },
            { label: "Empty State", icon: "mdi:inbox-outline" },
            { label: "Confirm Dialog", icon: "mdi:alert-circle" },
            { label: "Date Range", icon: "mdi:calendar-range" },
            { label: "File Upload", icon: "mdi:upload" },
          ],
        },
        {
          label: "Patrones UX",
          icon: "mdi:content-copy",
          items: [
            { label: "Complex Card" },
            { label: "Data Table Hybrid" },
            { label: "Login Reference" },
            { label: "Navigation Reference" },
          ],
        },
        {
          label: "Estándar Documental",
          icon: "mdi:file-pdf-box",
          items: [
            { label: "Document Types" },
            { label: "Nomenclature" },
            { label: "Access Matrix" },
          ],
        },
        {
          label: "Auditoría",
          icon: "mdi:checkbox-marked",
          items: [
            { label: "Content Blocks" },
            { label: "Quick Checklist" },
          ],
        },
        {
          label: "Layouts",
          icon: "mdi:page-layout-body",
          items: [
            { label: "Full Width" },
            { label: "Sidebar + Content" },
            { label: "Master–Detail" },
            { label: "Wizard (Stepper)" },
            { label: "Split Panels" },
          ],
        },
        {
          label: "Guía ERP",
          icon: "mdi:book-open-page-variant",
          items: [
            { label: "Identity Pillars" },
            { label: "Color Validation" },
            { label: "Component Catalog" },
            { label: "Button Rules" },
            { label: "Reference Form" },
          ],
        },
      ],
    },
  ];

  public isShow: boolean = false;
  public pinnedData: boolean = false;
  public pinnedDataList: string[] = [];

  private allMenuItems = signal<IMenuItem[]>([]);

  private routerEventSignal = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const items = this.menuService.sidebarMenuItems();
      this.primengMenuItems = this.transformMenuItems(items);
      this.allMenuItems.set(JSON.parse(JSON.stringify(items)) as IMenuItem[]);
      this.setActiveOnNavigation(this.router.url);
    });

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
        primeNGItem.icon = (item as IMenuItem).icon;
      }

      if ((item as IMenuItem).items && (item as IMenuItem).items!.length > 0) {
        primeNGItem.items = this.transformMenuItems((item as IMenuItem).items!);
      }
      return primeNGItem;
    });
  }

  private setActiveOnNavigation(url: string): void {
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
    this.pinnedData = this.pinnedDataList.length > 0;
  }

  sidebarToggle() {
    this.menuService.collapseSidebar = !this.menuService.collapseSidebar;
  }

  searchTerm(): void {
    this.isSearching = this.searchText.length > 0;
    this.searchResults = [];

    if (this.searchText) {
      const lowerCaseSearchText = this.searchText.toLowerCase();
      this.allMenuItems().forEach((menuItem) => {
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
}

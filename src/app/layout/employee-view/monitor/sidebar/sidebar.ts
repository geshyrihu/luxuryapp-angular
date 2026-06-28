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
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { IMenuItem, ISubMenuItem } from "src/app/core/interfaces/menu.model";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AspRoleService } from "src/app/core/services/asp-role.service";
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
  public aspRoleS = inject(AspRoleService);
  readonly AspRole = EApplicationRole;

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

  private readonly catalogBase = ['/', 'settings', 'ui-catalog'];

  readonly dsMenuItems: MenuItem[] = [
    {
      label: "Luxury Design System",
      icon: "mdi:palette-outline",
      expanded: false,
      items: [
        {
          label: "Tokens & Identidad",
          icon: "mdi:palette",
          routerLink: [...this.catalogBase, 'tokens'],
            items: [
              { label: "Colors", icon: "mdi:format-color-fill", routerLink: [...this.catalogBase, 'tokens', 'colors'] },
              { label: "Typography", icon: "mdi:format-letter-case", routerLink: [...this.catalogBase, 'tokens', 'typography'] },
            ],
        },
        {
          label: "Componentes",
          icon: "mdi:view-grid-outline",
          expanded: false,
          items: [
            {
              label: "Web (PrimeNG)",
              icon: "mdi:desktop-mac",
              routerLink: [...this.catalogBase, 'web'],
              items: [
                { label: "Accordion", routerLink: [...this.catalogBase, 'web', 'accordion'] },
                { label: "Calendar", icon: "mdi:calendar-outline", routerLink: [...this.catalogBase, 'web', 'calendar'] },
                { label: "Badge", routerLink: [...this.catalogBase, 'web', 'badge'] },
                { label: "Breadcrumb", routerLink: [...this.catalogBase, 'web', 'breadcrumb'] },
                { label: "Button", routerLink: [...this.catalogBase, 'web', 'button'] },
                { label: "Card", routerLink: [...this.catalogBase, 'web', 'card'] },
                { label: "Checkbox", routerLink: [...this.catalogBase, 'web', 'checkbox'] },
                { label: "DatePicker", routerLink: [...this.catalogBase, 'web', 'datepicker'] },
                { label: "Dialog", routerLink: [...this.catalogBase, 'web', 'dialog'] },
                { label: "Divider", routerLink: [...this.catalogBase, 'web', 'divider'] },
                { label: "InputNumber", routerLink: [...this.catalogBase, 'web', 'inputnumber'] },
                { label: "InputText", routerLink: [...this.catalogBase, 'web', 'inputtext'] },
                { label: "Message", routerLink: [...this.catalogBase, 'web', 'message'] },
                { label: "MultiSelect", routerLink: [...this.catalogBase, 'web', 'multiselect'] },
                { label: "Popover", routerLink: [...this.catalogBase, 'web', 'popover'] },
                { label: "ProgressBar", routerLink: [...this.catalogBase, 'web', 'progressbar'] },
                { label: "ProgressSpinner", routerLink: [...this.catalogBase, 'web', 'progressspinner'] },
                { label: "RadioButton", routerLink: [...this.catalogBase, 'web', 'radiobutton'] },
                { label: "Select", routerLink: [...this.catalogBase, 'web', 'select'] },
                { label: "SelectButton", routerLink: [...this.catalogBase, 'web', 'selectbutton'] },
                { label: "Skeleton", routerLink: [...this.catalogBase, 'web', 'skeleton'] },
                { label: "Table", routerLink: [...this.catalogBase, 'web', 'table'] },
                { label: "Tabs", routerLink: [...this.catalogBase, 'web', 'tabs'] },
                { label: "Tag", routerLink: [...this.catalogBase, 'web', 'tag'] },
                { label: "Textarea", routerLink: [...this.catalogBase, 'web', 'textarea'] },
                { label: "Toast", routerLink: [...this.catalogBase, 'web', 'toast'] },
                { label: "ToggleSwitch", routerLink: [...this.catalogBase, 'web', 'toggleswitch'] },
                { label: "Toolbar", routerLink: [...this.catalogBase, 'web', 'toolbar'] },
                { label: "Tooltip", routerLink: [...this.catalogBase, 'web', 'tooltip'] },
                { label: "Custom Inputs", icon: "mdi:form-textbox", routerLink: [...this.catalogBase, 'web', 'custominputs'] },
              ],
            },
            {
              label: "Mobile (Ionic)",
              icon: "mdi:cellphone",
              routerLink: [...this.catalogBase, 'mobile'],
              items: [
                { label: "Buttons", icon: "mdi:gesture-tap", routerLink: [...this.catalogBase, 'mobile', 'buttons'] },
                { label: "Inputs", icon: "mdi:keyboard", routerLink: [...this.catalogBase, 'mobile', 'inputs'] },
                { label: "Feedback & Skeleton", icon: "mdi:progress-clock", routerLink: [...this.catalogBase, 'mobile', 'feedback'] },
                { label: "Navigation & Segment", icon: "mdi:menu", routerLink: [...this.catalogBase, 'mobile', 'navigation'] },
                { label: "Lists & Reorder", icon: "mdi:format-list-bulleted", routerLink: [...this.catalogBase, 'mobile', 'lists'] },
                { label: "Data, Accordion & Grid", icon: "mdi:database-outline", routerLink: [...this.catalogBase, 'mobile', 'data'] },
                { label: "Forms", icon: "mdi:form-dropdown", routerLink: [...this.catalogBase, 'mobile', 'forms'] },
                { label: "Overlays", icon: "mdi:layers-outline", routerLink: [...this.catalogBase, 'mobile', 'overlays'] },
                { label: "Layout", icon: "mdi:page-layout-sidebar-left", routerLink: [...this.catalogBase, 'mobile', 'layout'] },
                { label: "Page Structure", icon: "mdi:page-layout-body", routerLink: [...this.catalogBase, 'mobile', 'page-structure'] },
              ],
            },
            {
              label: "Gráficos",
              icon: "mdi:chart-bar",
              routerLink: [...this.catalogBase, 'charts'],
              items: [
                { label: "Bar Chart", icon: "mdi:chart-bar", routerLink: [...this.catalogBase, 'charts', 'bar'] },
                { label: "Pie Chart", icon: "mdi:chart-pie", routerLink: [...this.catalogBase, 'charts', 'pie'] },
                { label: "Line Chart", icon: "mdi:chart-line", routerLink: [...this.catalogBase, 'charts', 'line'] },
                { label: "Doughnut Chart", icon: "mdi:chart-donut", routerLink: [...this.catalogBase, 'charts', 'doughnut'] },
                { label: "Radar Chart", icon: "mdi:chart-radar", routerLink: [...this.catalogBase, 'charts', 'radar'] },
              ],
            },
          ],
        },
        {
          label: "Core Components",
          icon: "mdi:cube",
          routerLink: [...this.catalogBase, 'core'],
          items: [
            { label: "Action Menu", icon: "mdi:dots-vertical", routerLink: [...this.catalogBase, 'core', 'actionmenu'] },
            { label: "App Icon", icon: "mdi:star", routerLink: [...this.catalogBase, 'core', 'appicon'] },
            { label: "Data View Mobile", icon: "mdi:view-list", routerLink: [...this.catalogBase, 'core', 'dataviewmobile'] },
            { label: "Loader", icon: "mdi:loading", routerLink: [...this.catalogBase, 'core', 'loader'] },
            { label: "Notification Center", icon: "mdi:bell-outline", routerLink: [...this.catalogBase, 'core', 'notificationcenter'] },
            { label: "PrimeNg Custom Caption", icon: "mdi:table-headers-eye", routerLink: [...this.catalogBase, 'core', 'primengcustomcaption'] },
            { label: "Status Badge", icon: "mdi:check-circle", routerLink: [...this.catalogBase, 'core', 'statusbadge'] },
            { label: "Wizard", icon: "mdi:steps", routerLink: [...this.catalogBase, 'core', 'wizard'] },
            { label: "Empty State", icon: "mdi:inbox-outline", routerLink: [...this.catalogBase, 'core', 'emptystate'] },
            { label: "Confirm Dialog", icon: "mdi:alert-circle", routerLink: [...this.catalogBase, 'core', 'confirmdialog'] },
            { label: "Date Range", icon: "mdi:calendar-range", routerLink: [...this.catalogBase, 'core', 'daterange'] },
            { label: "File Upload", icon: "mdi:upload", routerLink: [...this.catalogBase, 'core', 'fileupload'] },
            // Fase 6-10
            { label: "Data Grid", icon: "mdi:table-edit", routerLink: [...this.catalogBase, 'core', 'datagrid'] },
            { label: "KPI Card", icon: "mdi:chart-box", routerLink: [...this.catalogBase, 'core', 'kpicard'] },
            { label: "Avatar Group", icon: "mdi:account-multiple", routerLink: [...this.catalogBase, 'core', 'avatargroup'] },
            { label: "Timeline", icon: "mdi:timeline", routerLink: [...this.catalogBase, 'core', 'timeline'] },
            { label: "Slider", icon: "mdi:tune-vertical", routerLink: [...this.catalogBase, 'core', 'slider'] },
            { label: "Rating", icon: "mdi:star-outline", routerLink: [...this.catalogBase, 'core', 'rating'] },
            { label: "Pipeline CRM", icon: "mdi:pipe", routerLink: [...this.catalogBase, 'core', 'pipelinecrm'] },
            { label: "Tag Input", icon: "mdi:tag-multiple", routerLink: [...this.catalogBase, 'core', 'taginput'] },
            { label: "Stat Card", icon: "mdi:chart-line", routerLink: [...this.catalogBase, 'core', 'statcard'] },
            { label: "Skeleton Presets", icon: "mdi:card-bulleted-outline", routerLink: [...this.catalogBase, 'core', 'skeletonpresets'] },
            // 13.3.2
            { label: "Comparison Table", icon: "mdi:table-compare", routerLink: [...this.catalogBase, 'core', 'comparisontable'] },
            { label: "Activity Log", icon: "mdi:history", routerLink: [...this.catalogBase, 'core', 'activitylog'] },
            { label: "Kanban Board", icon: "mdi:view-column", routerLink: [...this.catalogBase, 'core', 'kanbanboard'] },
            { label: "Tree Table", icon: "mdi:file-tree", routerLink: [...this.catalogBase, 'core', 'treetable'] },
            { label: "Context Menu", icon: "mdi:cursor-pointer", routerLink: [...this.catalogBase, 'core', 'contextmenu'] },
            { label: "Split Pane", icon: "mdi:view-split-vertical", routerLink: [...this.catalogBase, 'core', 'splitpane'] },
            { label: "Command Palette", icon: "mdi:magnify", routerLink: [...this.catalogBase, 'core', 'commandpalette'] },
            { label: "Tour / Onboarding", icon: "mdi:map-marker-path", routerLink: [...this.catalogBase, 'core', 'tour'] },
            { label: "Gauge", icon: "mdi:speedometer", routerLink: [...this.catalogBase, 'core', 'gauge'] },
            { label: "Funnel Chart", icon: "mdi:filter-variant", routerLink: [...this.catalogBase, 'core', 'funnelchart'] },
            // 13.3.3
            { label: "OTP Input", icon: "mdi:numeric", routerLink: [...this.catalogBase, 'core', 'otpinput'] },
            { label: "Profile Card", icon: "mdi:card-account-details", routerLink: [...this.catalogBase, 'core', 'profilecard'] },
            { label: "Theme Switcher", icon: "mdi:theme-light-dark", routerLink: [...this.catalogBase, 'core', 'themeswitcher'] },
            { label: "Lang Selector", icon: "mdi:translate", routerLink: [...this.catalogBase, 'core', 'langselector'] },
            { label: "Color Picker", icon: "mdi:palette", routerLink: [...this.catalogBase, 'core', 'colorpicker'] },
            { label: "Tristate Switch", icon: "mdi:toggle-switch-outline", routerLink: [...this.catalogBase, 'core', 'tristateswitch'] },
            { label: "Signature Pad", icon: "mdi:draw", routerLink: [...this.catalogBase, 'core', 'signaturepad'] },
            { label: "QR Code", icon: "mdi:qrcode", routerLink: [...this.catalogBase, 'core', 'qrcode'] },
            { label: "Barcode Input", icon: "mdi:barcode-scan", routerLink: [...this.catalogBase, 'core', 'barcodeinput'] },
            { label: "Realtime Indicator", icon: "mdi:wifi", routerLink: [...this.catalogBase, 'core', 'realtimeindicator'] },
            { label: "Inventory Level", icon: "mdi:package-variant", routerLink: [...this.catalogBase, 'core', 'inventorylevel'] },
            { label: "Lead Scoring", icon: "mdi:star-circle", routerLink: [...this.catalogBase, 'core', 'leadscoring'] },
            { label: "Approval Workflow", icon: "mdi:source-branch-check", routerLink: [...this.catalogBase, 'core', 'approvalworkflow'] },
            { label: "Order Status", icon: "mdi:package-check", routerLink: [...this.catalogBase, 'core', 'orderstatus'] },
            { label: "Document Previewer", icon: "mdi:file-pdf-box", routerLink: [...this.catalogBase, 'core', 'documentpreviewer'] },
            { label: "Dashboard Layout", icon: "mdi:view-dashboard-edit", routerLink: [...this.catalogBase, 'core', 'dashboardlayout'] },
            { label: "Comment Thread", icon: "mdi:comment-multiple", routerLink: [...this.catalogBase, 'core', 'commentthread'] },
            { label: "Email Preview", icon: "mdi:email-edit", routerLink: [...this.catalogBase, 'core', 'emailpreview'] },
            { label: "Form Builder", icon: "mdi:form-select", routerLink: [...this.catalogBase, 'core', 'formbuilder'] },
            { label: "Print View", icon: "mdi:printer", routerLink: [...this.catalogBase, 'core', 'printview'] },
            { label: "Customer 360", icon: "mdi:account-details", routerLink: [...this.catalogBase, 'core', 'customer360'] },
            { label: "Dock", icon: "mdi:dock-window", routerLink: [...this.catalogBase, 'core', 'dock'] },
            { label: "Heatmap", icon: "mdi:grid", routerLink: [...this.catalogBase, 'core', 'heatmap'] },
            { label: "Gantt", icon: "mdi:chart-gantt", routerLink: [...this.catalogBase, 'core', 'gantt'] },
            { label: "Pivot Table", icon: "mdi:table-pivot", routerLink: [...this.catalogBase, 'core', 'pivottable'] },
          ],
        },
        {
          label: "Patrones y Layouts",
          icon: "mdi:page-layout-body",
          expanded: false,
          items: [
            {
              label: "Patrones UX",
              icon: "mdi:content-copy",
              routerLink: [...this.catalogBase, 'patterns'],
              items: [
                { label: "Complex Card", routerLink: [...this.catalogBase, 'patterns', 'complexcard'] },
                { label: "Data Table Hybrid", routerLink: [...this.catalogBase, 'patterns', 'datatablehybrid'] },
                { label: "Login Reference", routerLink: [...this.catalogBase, 'patterns', 'loginreference'] },
                { label: "Navigation Reference", routerLink: [...this.catalogBase, 'patterns', 'navigationreference'] },
                { label: "Navigation Hub Page", icon: "mdi:view-dashboard-outline", routerLink: [...this.catalogBase, 'patterns', 'navhub'] },
              ],
            },
            {
              label: "Layouts",
              icon: "mdi:page-layout-body",
              routerLink: [...this.catalogBase, 'layouts'],
              items: [
                { label: "Full Width", routerLink: [...this.catalogBase, 'layouts', 'fullwidth'] },
                { label: "Sidebar + Content", routerLink: [...this.catalogBase, 'layouts', 'sidebarcontent'] },
                { label: "Master–Detail", routerLink: [...this.catalogBase, 'layouts', 'masterdetail'] },
                { label: "Wizard (Stepper)", routerLink: [...this.catalogBase, 'layouts', 'wizard'] },
                { label: "Split Panels", routerLink: [...this.catalogBase, 'layouts', 'splitpanels'] },
              ],
            },
          ],
        },
        {
          label: "Guía y Estándares",
          icon: "mdi:book-open-page-variant",
          expanded: false,
          items: [
            {
              label: "Guía ERP",
              icon: "mdi:book-open-page-variant",
              routerLink: [...this.catalogBase, 'guia'],
              items: [
                { label: "Identity Pillars", routerLink: [...this.catalogBase, 'guia', 'identitypillars'] },
                { label: "Color Validation", routerLink: [...this.catalogBase, 'guia', 'colorvalidation'] },
                { label: "Component Catalog", routerLink: [...this.catalogBase, 'guia', 'componentcatalog'] },
                { label: "Button Rules", routerLink: [...this.catalogBase, 'guia', 'buttonrules'] },
                { label: "Reference Form", routerLink: [...this.catalogBase, 'guia', 'referenceform'] },
              ],
            },
            {
              label: "Estándar Documental",
              icon: "mdi:file-pdf-box",
              routerLink: [...this.catalogBase, 'docs'],
              items: [
                { label: "Document Types", routerLink: [...this.catalogBase, 'docs', 'documenttypes'] },
                { label: "Nomenclature", routerLink: [...this.catalogBase, 'docs', 'nomenclature'] },
                { label: "Access Matrix", routerLink: [...this.catalogBase, 'docs', 'accessmatrix'] },
              ],
            },
            {
              label: "Auditoría",
              icon: "mdi:checkbox-marked",
              routerLink: [...this.catalogBase, 'audit'],
              items: [
                { label: "Content Blocks", routerLink: [...this.catalogBase, 'audit', 'contentblocks'] },
                { label: "Quick Checklist", routerLink: [...this.catalogBase, 'audit', 'quickchecklist'] },
              ],
            },
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

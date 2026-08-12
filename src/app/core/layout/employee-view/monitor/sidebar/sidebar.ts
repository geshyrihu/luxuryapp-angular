import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { filter, map } from "rxjs/operators";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { SubMenuItem } from "src/app/core/interfaces/menu.interface";
import { LayoutService } from "src/app/core/services/layout.service";
import { MenuService } from "src/app/core/services/menu.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-sidebar",
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InputTextModule,
    AvatarModule,
    DividerModule,
    AppIcon,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./sidebar.html",
})
export class Sidebar {
  menuService = inject(MenuService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  router = inject(Router);
  public layoutService = inject(LayoutService);
  public aspRoleS = inject(AspRoleService);
  readonly AspRole = ApplicationRole;

  public infoAccountAuthDTO = this.authS.infoUserAuth;
  public customerName = this.customerIdS.nombreCorto;
  public customerPhotoPath = this.customerIdS.customerPhotoPath;

  public get profileImageUrl(): string {
    return (
      this.authS.infoUserAuth?.photoPath ?? "assets/images/default-avatar.png"
    );
  }

  public primengMenuItems: MenuItem[] = [];
  public searchText: string = "";
  public searchResults: SubMenuItem[] = [];
  public isSearching: boolean = false;
  public loading = this.menuService.menuLoading;

  private readonly catalogBase = ["/admin", "ui-catalog"];

  readonly dsMenuItems: MenuItem[] = [
    {
      label: "Luxury Design System",
      icon: "material-symbols-light:palette-outline",
      expanded: false,
      items: [
        {
          label: "Tokens & Identidad",
          icon: "material-symbols-light:palette",
          routerLink: [...this.catalogBase, "tokens"],
          items: [
            {
              label: "Colors",
              icon: "material-symbols-light:format-color-fill",
              routerLink: [...this.catalogBase, "tokens", "colors"],
            },
            {
              label: "Typography",
              icon: "material-symbols-light:text-fields",
              routerLink: [...this.catalogBase, "tokens", "typography"],
            },
          ],
        },
        {
          label: "Componentes",
          icon: "material-symbols-light:grid-view-outline",
          expanded: false,
          items: [
            {
              label: "Components (Web + Mobile)",
              icon: "material-symbols-light:devices",
              routerLink: [...this.catalogBase, "web"],
              items: [
                {
                  label: "Accordion",
                  routerLink: [...this.catalogBase, "web", "accordion"],
                },
                {
                  label: "Calendar",
                  icon: "material-symbols-light:event-outline",
                  routerLink: [...this.catalogBase, "web", "calendar"],
                },
                {
                  label: "Badge",
                  routerLink: [...this.catalogBase, "web", "badge"],
                },
                {
                  label: "Breadcrumb",
                  routerLink: [...this.catalogBase, "web", "breadcrumb"],
                },
                {
                  label: "Button",
                  routerLink: [...this.catalogBase, "web", "button"],
                },
                {
                  label: "Card",
                  routerLink: [...this.catalogBase, "web", "card"],
                },
                {
                  label: "Checkbox",
                  routerLink: [...this.catalogBase, "web", "checkbox"],
                },
                {
                  label: "DatePicker",
                  routerLink: [...this.catalogBase, "web", "datepicker"],
                },
                {
                  label: "Dialog",
                  routerLink: [...this.catalogBase, "web", "dialog"],
                },
                {
                  label: "Divider",
                  routerLink: [...this.catalogBase, "web", "divider"],
                },
                {
                  label: "InputNumber",
                  routerLink: [...this.catalogBase, "web", "inputnumber"],
                },
                {
                  label: "InputText",
                  routerLink: [...this.catalogBase, "web", "inputtext"],
                },
                {
                  label: "Message",
                  routerLink: [...this.catalogBase, "web", "message"],
                },
                {
                  label: "MultiSelect",
                  routerLink: [...this.catalogBase, "web", "multiselect"],
                },
                {
                  label: "Popover",
                  routerLink: [...this.catalogBase, "web", "popover"],
                },
                {
                  label: "ProgressBar",
                  routerLink: [...this.catalogBase, "web", "progressbar"],
                },
                {
                  label: "ProgressSpinner",
                  routerLink: [...this.catalogBase, "web", "progressspinner"],
                },
                {
                  label: "RadioButton",
                  routerLink: [...this.catalogBase, "web", "radiobutton"],
                },
                {
                  label: "Select",
                  routerLink: [...this.catalogBase, "web", "select"],
                },
                {
                  label: "SelectButton",
                  routerLink: [...this.catalogBase, "web", "selectbutton"],
                },
                {
                  label: "Skeleton",
                  routerLink: [...this.catalogBase, "web", "skeleton"],
                },
                {
                  label: "Table",
                  routerLink: [...this.catalogBase, "web", "table"],
                },
                {
                  label: "Tabs",
                  routerLink: [...this.catalogBase, "web", "tabs"],
                },
                {
                  label: "Tag",
                  routerLink: [...this.catalogBase, "web", "tag"],
                },
                {
                  label: "Textarea",
                  routerLink: [...this.catalogBase, "web", "textarea"],
                },
                {
                  label: "Toast",
                  routerLink: [...this.catalogBase, "web", "toast"],
                },
                {
                  label: "ToggleSwitch",
                  routerLink: [...this.catalogBase, "web", "toggleswitch"],
                },
                {
                  label: "Toolbar",
                  routerLink: [...this.catalogBase, "web", "toolbar"],
                },
                {
                  label: "Tooltip",
                  routerLink: [...this.catalogBase, "web", "tooltip"],
                },
                {
                  label: "Custom Inputs",
                  icon: "material-symbols-light:text-fields",
                  routerLink: [...this.catalogBase, "web", "custominputs"],
                },
                {
                  label: "QR Code Generator",
                  icon: "material-symbols-light:qr-code",
                  routerLink: [...this.catalogBase, "core", "qrcode"],
                },
                {
                  label: "Barcode / QR Input",
                  icon: "material-symbols-light:barcode",
                  routerLink: [...this.catalogBase, "core", "barcodeinput"],
                },
                {
                  label: "Barcode Scanner",
                  icon: "material-symbols-light:photo-camera",
                  routerLink: [...this.catalogBase, "extras", "business"],
                },
                {
                  label: "┤ Mobile only ├",
                  icon: "material-symbols-light:devices-other",
                  routerLink: [...this.catalogBase, "mobile"],
                },
                {
                  label: "Mobile: Buttons",
                  icon: "material-symbols-light:touch-app",
                  routerLink: [...this.catalogBase, "mobile", "buttons"],
                },
                {
                  label: "Mobile: Inputs",
                  icon: "material-symbols-light:keyboard",
                  routerLink: [...this.catalogBase, "mobile", "inputs"],
                },
                {
                  label: "Mobile: Feedback",
                  icon: "material-symbols-light:pending",
                  routerLink: [...this.catalogBase, "mobile", "feedback"],
                },
                {
                  label: "Mobile: Navigation",
                  icon: "material-symbols-light:menu",
                  routerLink: [...this.catalogBase, "mobile", "navigation"],
                },
                {
                  label: "Mobile: Lists",
                  icon: "material-symbols-light:format-list-bulleted",
                  routerLink: [...this.catalogBase, "mobile", "lists"],
                },
                {
                  label: "Mobile: Data & Grid",
                  icon: "material-symbols-light:database-outline",
                  routerLink: [...this.catalogBase, "mobile", "data"],
                },
                {
                  label: "Mobile: Forms",
                  icon: "material-symbols-light:arrow-drop-down",
                  routerLink: [...this.catalogBase, "mobile", "forms"],
                },
                {
                  label: "Mobile: Overlays",
                  icon: "material-symbols-light:layers",
                  routerLink: [...this.catalogBase, "mobile", "overlays"],
                },
                {
                  label: "Mobile: Layout",
                  icon: "material-symbols-light:view-sidebar",
                  routerLink: [...this.catalogBase, "mobile", "layout"],
                },
                {
                  label: "Mobile: Page Structure",
                  icon: "material-symbols-light:web",
                  routerLink: [...this.catalogBase, "mobile", "page-structure"],
                },
              ],
            },
            {
              label: "Gráficos",
              icon: "material-symbols-light:bar-chart",
              routerLink: [...this.catalogBase, "charts"],
              items: [
                {
                  label: "Bar Chart",
                  icon: "material-symbols-light:bar-chart",
                  routerLink: [...this.catalogBase, "charts", "bar"],
                },
                {
                  label: "Pie Chart",
                  icon: "material-symbols-light:pie-chart",
                  routerLink: [...this.catalogBase, "charts", "pie"],
                },
                {
                  label: "Line Chart",
                  icon: "material-symbols-light:monitoring",
                  routerLink: [...this.catalogBase, "charts", "line"],
                },
                {
                  label: "Doughnut Chart",
                  icon: "material-symbols-light:donut-large",
                  routerLink: [...this.catalogBase, "charts", "doughnut"],
                },
                {
                  label: "Radar Chart",
                  icon: "material-symbols-light:radar",
                  routerLink: [...this.catalogBase, "charts", "radar"],
                },
              ],
            },
          ],
        },
        {
          label: "Core Components",
          icon: "material-symbols-light:crop-rotate",
          routerLink: [...this.catalogBase, "core"],
          items: [
            {
              label: "Action Menu",
              icon: "material-symbols-light:more-vert",
              routerLink: [...this.catalogBase, "core", "actionmenu"],
            },
            {
              label: "App Icon",
              icon: "material-symbols-light:star",
              routerLink: [...this.catalogBase, "core", "appicon"],
            },
            {
              label: "Data View Mobile",
              icon: "material-symbols-light:view-list",
              routerLink: [...this.catalogBase, "core", "dataviewmobile"],
            },
            {
              label: "Loader",
              icon: "material-symbols-light:progress-activity",
              routerLink: [...this.catalogBase, "core", "loader"],
            },
            {
              label: "Notification Center",
              icon: "material-symbols-light:notifications-outline",
              routerLink: [...this.catalogBase, "core", "notificationcenter"],
            },
            {
              label: "PrimeNg Custom Caption",
              icon: "material-symbols-light:table",
              routerLink: [...this.catalogBase, "core", "primengcustomcaption"],
            },
            {
              label: "Status Badge",
              icon: "material-symbols-light:check-circle",
              routerLink: [...this.catalogBase, "core", "statusbadge"],
            },
            {
              label: "Wizard",
              icon: "material-symbols-light:stairs",
              routerLink: [...this.catalogBase, "core", "wizard"],
            },
            {
              label: "Empty State",
              icon: "material-symbols-light:move-to-inbox-outline",
              routerLink: [...this.catalogBase, "core", "emptystate"],
            },
            {
              label: "Confirm Dialog",
              icon: "material-symbols-light:error",
              routerLink: [...this.catalogBase, "core", "confirmdialog"],
            },
            {
              label: "Date Range",
              icon: "material-symbols-light:event",
              routerLink: [...this.catalogBase, "core", "daterange"],
            },
            {
              label: "File Upload",
              icon: "material-symbols-light:upload",
              routerLink: [...this.catalogBase, "core", "fileupload"],
            },
            // Fase 6-10
            {
              label: "Data Grid",
              icon: "material-symbols-light:edit-note",
              routerLink: [...this.catalogBase, "core", "datagrid"],
            },
            {
              label: "KPI Card",
              icon: "material-symbols-light:bar-chart",
              routerLink: [...this.catalogBase, "core", "kpicard"],
            },
            {
              label: "Avatar Group",
              icon: "material-symbols-light:person",
              routerLink: [...this.catalogBase, "core", "avatargroup"],
            },
            {
              label: "Timeline",
              icon: "material-symbols-light:timeline",
              routerLink: [...this.catalogBase, "core", "timeline"],
            },
            {
              label: "Slider",
              icon: "material-symbols-light:tune",
              routerLink: [...this.catalogBase, "core", "slider"],
            },
            {
              label: "Rating",
              icon: "material-symbols-light:star-outline",
              routerLink: [...this.catalogBase, "core", "rating"],
            },
            {
              label: "Pipeline CRM",
              icon: "material-symbols-light:precision-manufacturing",
              routerLink: [...this.catalogBase, "core", "pipelinecrm"],
            },
            {
              label: "Tag Input",
              icon: "material-symbols-light:label",
              routerLink: [...this.catalogBase, "core", "taginput"],
            },
            {
              label: "Stat Card",
              icon: "material-symbols-light:monitoring",
              routerLink: [...this.catalogBase, "core", "statcard"],
            },
            {
              label: "Skeleton Presets",
              icon: "material-symbols-light:description",
              routerLink: [...this.catalogBase, "core", "skeletonpresets"],
            },
            // 13.3.2
            {
              label: "Comparison Table",
              icon: "material-symbols-light:table",
              routerLink: [...this.catalogBase, "core", "comparisontable"],
            },
            {
              label: "Activity Log",
              icon: "material-symbols-light:history",
              routerLink: [...this.catalogBase, "core", "activitylog"],
            },
            {
              label: "Kanban Board",
              icon: "material-symbols-light:view-column",
              routerLink: [...this.catalogBase, "core", "kanbanboard"],
            },
            {
              label: "Tree Table",
              icon: "material-symbols-light:account-tree",
              routerLink: [...this.catalogBase, "core", "treetable"],
            },
            {
              label: "Context Menu",
              icon: "material-symbols-light:ads-click",
              routerLink: [...this.catalogBase, "core", "contextmenu"],
            },
            {
              label: "Split Pane",
              icon: "material-symbols-light:vertical-split",
              routerLink: [...this.catalogBase, "core", "splitpane"],
            },
            {
              label: "Command Palette",
              icon: "material-symbols-light:search",
              routerLink: [...this.catalogBase, "core", "commandpalette"],
            },
            {
              label: "Tour / Onboarding",
              icon: "material-symbols-light:route",
              routerLink: [...this.catalogBase, "core", "tour"],
            },
            {
              label: "Gauge",
              icon: "material-symbols-light:speed",
              routerLink: [...this.catalogBase, "core", "gauge"],
            },
            {
              label: "Funnel Chart",
              icon: "material-symbols-light:filter",
              routerLink: [...this.catalogBase, "core", "funnelchart"],
            },
            // 13.3.3
            {
              label: "OTP Input",
              icon: "material-symbols-light:pin",
              routerLink: [...this.catalogBase, "core", "otpinput"],
            },
            {
              label: "Profile Card",
              icon: "material-symbols-light:badge",
              routerLink: [...this.catalogBase, "core", "profilecard"],
            },
            {
              label: "Theme Switcher",
              icon: "material-symbols-light:brightness-4",
              routerLink: [...this.catalogBase, "core", "themeswitcher"],
            },
            {
              label: "Lang Selector",
              icon: "material-symbols-light:translate",
              routerLink: [...this.catalogBase, "core", "langselector"],
            },
            {
              label: "Color Picker",
              icon: "material-symbols-light:palette",
              routerLink: [...this.catalogBase, "core", "colorpicker"],
            },
            {
              label: "Tristate Switch",
              icon: "material-symbols-light:toggle-on",
              routerLink: [...this.catalogBase, "core", "tristateswitch"],
            },
            {
              label: "Signature Pad",
              icon: "material-symbols-light:draw",
              routerLink: [...this.catalogBase, "core", "signaturepad"],
            },
            {
              label: "QR Code",
              icon: "material-symbols-light:qr-code",
              routerLink: [...this.catalogBase, "core", "qrcode"],
            },
            {
              label: "Barcode Input",
              icon: "material-symbols-light:barcode-scanner",
              routerLink: [...this.catalogBase, "core", "barcodeinput"],
            },
            {
              label: "Realtime Indicator",
              icon: "material-symbols-light:wifi",
              routerLink: [...this.catalogBase, "core", "realtimeindicator"],
            },
            {
              label: "Inventory Level",
              icon: "material-symbols-light:package",
              routerLink: [...this.catalogBase, "core", "inventorylevel"],
            },
            {
              label: "Lead Scoring",
              icon: "material-symbols-light:star",
              routerLink: [...this.catalogBase, "core", "leadscoring"],
            },
            {
              label: "Approval Workflow",
              icon: "material-symbols-light:call-split",
              routerLink: [...this.catalogBase, "core", "approvalworkflow"],
            },
            {
              label: "Order Status",
              icon: "material-symbols-light:check-circle",
              routerLink: [...this.catalogBase, "core", "orderstatus"],
            },
            {
              label: "Document Previewer",
              icon: "material-symbols-light:picture-as-pdf",
              routerLink: [...this.catalogBase, "core", "documentpreviewer"],
            },
            {
              label: "Dashboard Layout",
              icon: "material-symbols-light:dashboard-customize",
              routerLink: [...this.catalogBase, "core", "dashboardlayout"],
            },
            {
              label: "Comment Thread",
              icon: "material-symbols-light:forum",
              routerLink: [...this.catalogBase, "core", "commentthread"],
            },
            {
              label: "Email Preview",
              icon: "material-symbols-light:edit-note",
              routerLink: [...this.catalogBase, "core", "emailpreview"],
            },
            {
              label: "Form Builder",
              icon: "material-symbols-light:list",
              routerLink: [...this.catalogBase, "core", "formbuilder"],
            },
            {
              label: "Print View",
              icon: "material-symbols-light:print",
              routerLink: [...this.catalogBase, "core", "printview"],
            },
            {
              label: "Customer 360",
              icon: "material-symbols-light:badge",
              routerLink: [...this.catalogBase, "core", "customer360"],
            },
            {
              label: "Dock",
              icon: "material-symbols-light:view-sidebar",
              routerLink: [...this.catalogBase, "core", "dock"],
            },
            {
              label: "Heatmap",
              icon: "material-symbols-light:grid-view",
              routerLink: [...this.catalogBase, "core", "heatmap"],
            },
            {
              label: "Gantt",
              icon: "material-symbols-light:pattern",
              routerLink: [...this.catalogBase, "core", "gantt"],
            },
            {
              label: "Pivot Table",
              icon: "material-symbols-light:table",
              routerLink: [...this.catalogBase, "core", "pivottable"],
            },
          ],
        },
        {
          label: "Patrones y Layouts",
          icon: "material-symbols-light:web",
          expanded: false,
          items: [
            {
              label: "Patrones UX",
              icon: "material-symbols-light:content-copy",
              routerLink: [...this.catalogBase, "patterns"],
              items: [
                {
                  label: "Complex Card",
                  routerLink: [...this.catalogBase, "patterns", "complexcard"],
                },
                {
                  label: "Data Table Hybrid",
                  routerLink: [
                    ...this.catalogBase,
                    "patterns",
                    "datatablehybrid",
                  ],
                },
                {
                  label: "Login Reference",
                  routerLink: [
                    ...this.catalogBase,
                    "patterns",
                    "loginreference",
                  ],
                },
                {
                  label: "Navigation Reference",
                  routerLink: [
                    ...this.catalogBase,
                    "patterns",
                    "navigationreference",
                  ],
                },
                {
                  label: "Navigation Hub Page",
                  icon: "material-symbols-light:dashboard-outline",
                  routerLink: [...this.catalogBase, "patterns", "navhub"],
                },
              ],
            },
            {
              label: "Layouts",
              icon: "material-symbols-light:web",
              routerLink: [...this.catalogBase, "layouts"],
              items: [
                {
                  label: "Full Width",
                  routerLink: [...this.catalogBase, "layouts", "fullwidth"],
                },
                {
                  label: "Sidebar + Content",
                  routerLink: [
                    ...this.catalogBase,
                    "layouts",
                    "sidebarcontent",
                  ],
                },
                {
                  label: "Master–Detail",
                  routerLink: [...this.catalogBase, "layouts", "masterdetail"],
                },
                {
                  label: "Wizard (Stepper)",
                  routerLink: [...this.catalogBase, "layouts", "wizard"],
                },
                {
                  label: "Split Panels",
                  routerLink: [...this.catalogBase, "layouts", "splitpanels"],
                },
              ],
            },
          ],
        },
        {
          label: "Guía y Estándares",
          icon: "material-symbols-light:menu-book",
          expanded: false,
          items: [
            {
              label: "Guía ERP",
              icon: "material-symbols-light:menu-book",
              routerLink: [...this.catalogBase, "guide"],
              items: [
                {
                  label: "Identity Pillars",
                  routerLink: [...this.catalogBase, "guide", "identitypillars"],
                },
                {
                  label: "Color Validation",
                  routerLink: [...this.catalogBase, "guide", "colorvalidation"],
                },
                {
                  label: "Component Catalog",
                  routerLink: [
                    ...this.catalogBase,
                    "guide",
                    "componentcatalog",
                  ],
                },
                {
                  label: "Button Rules",
                  routerLink: [...this.catalogBase, "guide", "buttonrules"],
                },
                {
                  label: "Button Catalog",
                  icon: "material-symbols-light:touch-app",
                  routerLink: [...this.catalogBase, "guide", "buttoncatalog"],
                },
                {
                  label: "Reference Form",
                  routerLink: [...this.catalogBase, "guide", "referenceform"],
                },
              ],
            },
            {
              label: "Estándar Documental",
              icon: "material-symbols-light:picture-as-pdf",
              routerLink: [...this.catalogBase, "docs"],
              items: [
                {
                  label: "Document Types",
                  routerLink: [...this.catalogBase, "docs", "documenttypes"],
                },
                {
                  label: "Nomenclature",
                  routerLink: [...this.catalogBase, "docs", "nomenclature"],
                },
                {
                  label: "Access Matrix",
                  routerLink: [...this.catalogBase, "docs", "accessmatrix"],
                },
              ],
            },
            {
              label: "Auditoría",
              icon: "material-symbols-light:check-box",
              routerLink: [...this.catalogBase, "audit"],
              items: [
                {
                  label: "Content Blocks",
                  routerLink: [...this.catalogBase, "audit", "contentblocks"],
                },
                {
                  label: "Quick Checklist",
                  routerLink: [...this.catalogBase, "audit", "quickchecklist"],
                },
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

  private allMenuItems = signal<MenuItem[]>([]);

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
      this.allMenuItems.set(JSON.parse(JSON.stringify(items)) as MenuItem[]);
      this.setActiveOnNavigation(this.router.url);
    });

    effect(() => {
      const url = this.routerEventSignal();
      if (url) {
        this.setActiveOnNavigation(url);
      }
    });
  }

  private transformMenuItems(items: (MenuItem | SubMenuItem)[]): MenuItem[] {
    return items.map((item) => {
      const primeNGItem: MenuItem = {
        label: item.label,
        routerLink: item.routerLink,
        expanded: (item as MenuItem).active,
      };

      if ((item as MenuItem).icon) {
        primeNGItem.icon = (item as MenuItem).icon;
      }

      if ((item as MenuItem).items && (item as MenuItem).items!.length > 0) {
        primeNGItem.items = this.transformMenuItems((item as MenuItem).items!);
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
              this.searchResults.push(subItem as any);
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

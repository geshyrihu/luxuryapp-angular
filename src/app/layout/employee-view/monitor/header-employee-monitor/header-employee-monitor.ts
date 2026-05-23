import { CommonModule, Location } from "@angular/common";
import { Component, effect, inject, input, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterModule,
} from "@angular/router";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { filter, map, startWith } from "rxjs";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { FeatureAnnouncementService } from "src/app/core/services/feature-announcement.service";
import { HidescrollnavService } from "src/app/core/services/hidescrollnav.service";
import { MenuService } from "src/app/core/services/menu.service";
import { SearchService } from "src/app/core/services/search.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { UpdateService } from "src/app/core/services/update-pwa.service";
import { NotificationsGadget } from "../notifications-gadget/notifications-gadget";
import { ProfileMonitor } from "../profile-monitor/profile-monitor";

@Component({
  selector: "app-header-employee-monitor",
  imports: [
    // ActionIconsGroupComponent,
    ButtonModule,
    CommonModule,
    FormsModule,
    NotificationsGadget,
    ProfileMonitor,
    RouterModule,
    // Search,
    BreadcrumbModule,
    SelectModule,
    ToolbarModule,
    TooltipModule,
  ],
  templateUrl: "./header-employee-monitor.html",
  styleUrl: "./header-employee-monitor.scss",
})
export class HeaderEmployeeMonitor implements OnInit {
  isCommitteeView = input<boolean>(false);
  // Injected services
  public aspRoleS = inject(AspRoleService);
  public authS = inject(AuthService);
  public customerIdS = inject(CustomerIdService);
  public hideScroolNavService = inject(HidescrollnavService);
  public location = inject(Location);
  public navService = inject(MenuService);
  public router = inject(Router);
  public searchService = inject(SearchService);
  public themeService = inject(ThemeService);
  public updateService = inject(UpdateService);
  public featureAnnouncementS = inject(FeatureAnnouncementService);
  activatedRoute = inject(ActivatedRoute);
  public breadcrumbs: {
    parentBreadcrumb?: string;
    childBreadcrumb?: string;
    enable?: boolean;
  } = {};
  public title: string = "";
  public breadcrumbItems: MenuItem[] = [];

  // Class properties
  public AspRole = EApplicationRole;
  public displayNavIcons: any[] = [];
  public isFlip: boolean = false;
  public isSearchOpen: boolean = false;
  public open: boolean = false;
  public isShow: boolean = false;
  public customerId = this.customerIdS.customerId;
  public customerName = this.customerIdS.nombreCorto;
  public customerPhotoPath = this.customerIdS.customerPhotoPath;
  public cb_customer: ISelectItem[] = this.authS.customerAccess;

  // SIGNALS
  private routeEventSignal = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === PRIMARY_OUTLET),
    ),
    { initialValue: null },
  );

  private currentRouteDataSignal = toSignal(this.activatedRoute.data, {
    initialValue: null,
  });

  constructor() {
    this.updateService.forceCheckUpdate;

    effect(() => {
      const route = this.routeEventSignal();
      if (route) {
        let snapshot = this.router.routerState.snapshot;
        let title = route.snapshot.data["title"];
        let parent = route.parent?.snapshot.data["breadcrumb"];
        let isEnable = route.parent?.snapshot.data["isEnable"];
        let child = route.snapshot.data["breadcrumb"];
        this.breadcrumbs = {}; // Keep this for now, as the HTML still uses it
        this.title = title;

        this.breadcrumbItems = []; // Clear previous items

        // Home item
        this.breadcrumbItems.push({
          icon: "pi pi-home", // PrimeNG icon class
          routerLink: "/dashboard/default",
        });

        if (parent) {
          this.breadcrumbItems.push({
            label: parent,
            routerLink: "/some/parent/route", // If parent has a specific route, add it here
          });
        }

        if (child) {
          this.breadcrumbItems.push({
            label: child,
            routerLink: "/some/child/route", // If child has a specific route, add it here
          });
        }
      }
    });

    // Effect para el título inicial si no viene del router event principal
    effect(() => {
      const data = this.currentRouteDataSignal();
      if (!this.title && data) {
        this.title = data["title"] || "";
      }
    });
  }

  ngOnInit(): void {
    // La lógica de suscripción del título se movió al constructor con effect.
    this.displayNavIcons = [
      {
        id: "home",
        ngbTooltip: "Inicio",
        iconClass: "icon icon-pi-home",
        action: () => this.onHome(),
      },
      {
        id: "back",
        ngbTooltip: "Pagina anterior",
        iconClass: "icon icon-pi-angle-left",
        action: () => this.onBack(),
      },
      {
        id: "next",
        ngbTooltip: "Pagina siguiente",
        iconClass: "icon icon-pi-angle-right",
        action: () => this.onNext(),
      },
      {
        id: "refresh",
        ngbTooltip: "Actualizar",
        iconClass: "icon icon-pi-sync",
        action: () => this.onRefresh(),
      },
      {
        id: "building",
        ngbTooltip: "Mi edifio",
        iconClass: "icon icon-pi-building-columns",
        action: () => this.onBuilding(),
      },
      {
        id: "announcement",
        ngbTooltip: "Anuncios",
        iconClass: "icon icon-pi-megaphone",
        action: () => this.onannouncement(),
      },
      {
        id: "settings",
        ngbTooltip: "Configuración",
        iconClass: "icon icon-pi-cog",
        action: () => this.onSetting(),
        requiresRole: [EApplicationRole.SuperUsuario],
      },
      {
        id: "whats-new",
        ngbTooltip: "Novedades",
        // Usamos 'text-yellow-500' y un ícono llamativo para que se vea 'chulo'
        iconClass: "pi pi-sparkles text-yellow-500",
        action: () => this.onWhatsNew(),
      },
    ];
  }

  // UI methods
  sidebarToggle() {
    this.navService.toggleSidebar();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getThemeIcon(): string {
    const theme = this.themeService.getCurrentTheme();
    if (theme === "light") return "icon icon-pi-moon"; // Ir a Dark
    return "icon icon-pi-sun"; // Ir a Light
  }

  // Navigation methods
  onBack = () => {
    this.location.back();
  };

  onNext = () => {
    this.location.forward();
  };

  // onRefresh = () => {
  //   window.location.reload();
  // };
  onRefresh = () => {
    this.navService.reloadMenu();
  };

  onHome = () => {
    this.router.navigateByUrl("/dashboard");
  };

  onSetting = () => {
    this.router.navigateByUrl("/settings/home");
  };

  onannouncement = () => {
    this.router.navigateByUrl("/announcements/list");
  };

  onBuilding = () => {
    this.router.navigateByUrl("/operaciones/mi-edificio");
  };

  onUpdatePWA(): void {
    this.updateService.activateUpdate();
  }

  onWhatsNew(): void {
    this.featureAnnouncementS.showDialog.set(true);
  }

  selectCustomer(newCustomerId: any) {
    this.customerIdS.setCustomerId(newCustomerId).subscribe();
  }
}

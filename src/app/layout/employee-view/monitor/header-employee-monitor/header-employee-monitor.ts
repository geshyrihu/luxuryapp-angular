import { CommonModule, Location } from "@angular/common";
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
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
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
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
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { DialogModule } from "primeng/dialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { AiService } from "src/app/core/services/ai.service";
import { CustomInputTextAreaSignal } from "../../../../core/components/inputs/web";

@Component({
  selector: "app-header-employee-monitor",
  imports: [
    // ActionIconsGroupComponent,
    AppIcon,
    BreadcrumbModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    FormsModule,
    CustomInputTextAreaSignal,
    NotificationsGadget,
    ProfileMonitor,
    ProgressSpinnerModule,
    RouterModule,
    // Search,
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
  public aiService = inject(AiService);
  public sanitizer = inject(DomSanitizer);
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
  public readonly cb_customer = toSignal(this.authS.customerAccess$, {
    initialValue: [],
  });

  // AI Modal Signals
  public displayAiModal = signal<boolean>(false);
  public isGeneratingAnnouncement = signal<boolean>(false);
  public isGeneratingImage = signal<boolean>(false);
  public userIdea = signal<string>("");
  public aiAnnouncementResult = signal<{
    title: string;
    greeting: string;
    body: string;
    callToAction: string;
  } | null>(null);
  public aiAnnouncementImageResult = signal<SafeUrl | null>(null);
  public currentMode = signal<'text' | 'poster'>('text');

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
        iconClass: "mdi:home",
        action: () => this.onHome(),
      },
      {
        id: "back",
        ngbTooltip: "Pagina anterior",
        iconClass: "mdi:chevron-left",
        action: () => this.onBack(),
      },
      {
        id: "next",
        ngbTooltip: "Pagina siguiente",
        iconClass: "mdi:chevron-right",
        action: () => this.onNext(),
      },
      {
        id: "refresh",
        ngbTooltip: "Actualizar",
        iconClass: "mdi:refresh",
        action: () => this.onRefresh(),
      },
      {
        id: "building",
        ngbTooltip: "Mi edificio",
        iconClass: "mdi:office-building",
        action: () => this.onBuilding(),
      },
      {
        id: "announcement",
        ngbTooltip: "Anuncios",
        iconClass: "mdi:bullhorn",
        action: () => this.onannouncement(),
      },
      {
        id: "ai-announcement",
        ngbTooltip: "Comunicado IA",
        iconClass: "mdi:robot-outline",
        iconExtraClass: "text-purple-500",
        action: () => this.onAiAnnouncement(),
      },
      {
        id: "emergency-phones",
        ngbTooltip: "Telefonos de Emergencia",
        iconClass: "mdi:phone-alert",
        action: () => this.onEmergencyPhones(),
      },
      {
        id: "settings",
        ngbTooltip: "Configuración",
        iconClass: "mdi:cog",
        action: () => this.onSetting(),
        requiresRole: [EApplicationRole.SuperUsuario],
      },
      {
        id: "whats-new",
        ngbTooltip: "Novedades",
        iconClass: "mdi:star-four-points",
        iconExtraClass: "text-yellow-500",
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
    if (theme === "light") return "mdi:weather-night";
    return "mdi:weather-sunny";
  }

  // Navigation methods
  onBack = () => {
    this.location.back();
  };

  onNext = () => {
    this.location.forward();
  };

  onRefresh = () => {
    const currentUrl = this.router.url;
    const originalShouldReuseRoute =
      this.router.routeReuseStrategy.shouldReuseRoute.bind(
        this.router.routeReuseStrategy,
      );

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    void this.router.navigateByUrl(currentUrl).finally(() => {
      this.router.routeReuseStrategy.shouldReuseRoute =
        originalShouldReuseRoute;
    });
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

  onEmergencyPhones = () => {
    this.router.navigateByUrl("/directory/emergency-phones");
  };

  onUpdatePWA(): void {
    this.updateService.activateUpdate();
  }

  onWhatsNew(): void {
    this.featureAnnouncementS.showDialog.set(true);
  }

  selectCustomer(newCustomerId: string) {
    this.customerIdS.setCustomerId(newCustomerId).subscribe();
  }

  onAiAnnouncement() {
    this.displayAiModal.set(true);
    this.userIdea.set("");
    this.aiAnnouncementResult.set(null);
    this.aiAnnouncementImageResult.set(null);
  }

  async generateOfficialAnnouncement(mode: 'text' | 'poster') {
    if (!this.userIdea() || !this.userIdea().trim()) return;

    this.currentMode.set(mode);

    try {
      this.isGeneratingAnnouncement.set(true);

      if (mode === 'text') {
        const enrichedIdea = this.userIdea() + "\n\nINSTRUCCIONES ESTRICTAS: El texto debe ser lo más corto y claro posible, estar fuertemente apoyado con emojis. Adopta un tono sumamente empático, asegurando que el condómino se sienta entendido, y enfocado siempre en el bien común y la convivencia.";
        const textResult = await this.aiService.generateOfficialAnnouncementDraft(enrichedIdea, this.customerName());
        this.aiAnnouncementResult.set(textResult);
        this.aiAnnouncementImageResult.set(null);
      } else if (mode === 'poster') {
        this.isGeneratingImage.set(true);
        // Obtener solo un título corto para el póster
        const shortTitleIdea = this.userIdea() + "\n\nSolo genera un título principal muy corto y directo (máximo 4-5 palabras) basado en esta idea.";
        const textResult = await this.aiService.generateOfficialAnnouncementDraft(shortTitleIdea, this.customerName());
        
        const imagePrompt = `Design a professional, modern, and highly elegant vertical poster/flyer for a luxury residential building called ${this.customerName()}.
Main highly legible VERY LARGE title: "${textResult.title}".
IMPORTANT: DO NOT include any paragraphs or long text. The design must be purely visual using flat, modern iconography related to: ${this.userIdea()}.
Use premium corporate style (e.g. navy blue tones, white, golden or silver details), a clean layout without visual saturation, and high-contrast typography.`;
        
        try {
          const imageBlob = await this.aiService.generateImage(imagePrompt);
          if (imageBlob) {
            const imageUrl = URL.createObjectURL(imageBlob);
            this.aiAnnouncementImageResult.set(this.sanitizer.bypassSecurityTrustUrl(imageUrl));
          }
          // Configurar resultado sin cuerpo para que solo se vea la imagen en la UI
          this.aiAnnouncementResult.set({
            title: textResult.title,
            greeting: "",
            body: "",
            callToAction: ""
          });
        } catch (imgErr) {
          console.error("Error al generar la imagen", imgErr);
          this.aiAnnouncementResult.set(null);
        }
      }

    } catch (e) {
      console.error(e);
    } finally {
      this.isGeneratingAnnouncement.set(false);
      this.isGeneratingImage.set(false);
    }
  }
}

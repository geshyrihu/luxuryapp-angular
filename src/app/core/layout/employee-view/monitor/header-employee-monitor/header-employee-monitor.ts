import { CommonModule, Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterModule,
} from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { MenuModule } from "primeng/menu";
import { ToolbarModule } from "primeng/toolbar";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { filter, map, startWith } from "rxjs";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
import { FeatureAnnouncementService } from "src/app/core/services/feature-announcement.service";
import { HidescrollnavService } from "src/app/core/services/hidescrollnav.service";
import { MenuService } from "src/app/core/services/menu.service";
import { SearchService } from "src/app/core/services/search.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { UpdateService } from "src/app/core/services/update-pwa.service";
import { NotificationsGadget } from "../notifications-gadget/notifications-gadget";
import { ProfileMonitor } from "../profile-monitor/profile-monitor";
import { PanicButton } from "src/app/apps/operations.luxuryapp/panic-alert/components/panic-button/panic-button";

import { FormControl, ReactiveFormsModule } from "@angular/forms";
import * as htmlToImage from "html-to-image";
import { DialogModule } from "primeng/dialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectButtonModule } from "primeng/selectbutton";
import { TextareaModule } from "primeng/textarea";
import { AiService } from "src/app/core/services/ai.service";
import { ROUTES } from "src/app/routing/route-paths";

@Component({
  selector: "app-header-employee-monitor",
  imports: [
    // ActionIconsGroupComponent,
    AppIcon,
    BreadcrumbModule,
    CommonModule,
    WebButtonLabel,
    DialogModule,
    TextareaModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    NotificationsGadget,
    PanicButton,
    ProfileMonitor,
    ProgressSpinnerModule,
    RouterModule,
    SelectButtonModule,
    ToolbarModule,
    LxTooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header-employee-monitor.html",
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
  public AspRole = ApplicationRole;
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

  public customerMenuItems = computed<MenuItem[]>(() =>
    this.cb_customer().map((c: any) => ({
      label: c.label,
      data: { image: c.image, value: c.value },
      styleClass: c.value === this.customerId() ? "font-bold" : "",
      command: () => this.selectCustomer(c.value),
    })),
  );

  // AI Modal Signals
  public displayAiModal = signal<boolean>(false);
  public isGeneratingAnnouncement = signal<boolean>(false);
  public aiAnnouncementImageResult = signal<SafeUrl | null>(null);
  public aiAnnouncementPosterPoints = signal<string[]>([]);
  public isGeneratingImage = signal<boolean>(false);
  public userIdeaControl = new FormControl<string>("");
  public aiAnnouncementResult = signal<{
    title: string;
    greeting: string;
    body: string;
    callToAction: string;
  } | null>(null);
  public currentMode = signal<"text" | "poster">("text");

  public documentColor = signal<"--ds-luxury-gold" | "--ds-document-neutral">(
    "--ds-luxury-gold",
  );
  public colorOptions = [
    { label: "Gold", value: "--ds-luxury-gold" },
    { label: "Neutral", value: "--ds-document-neutral" },
  ];

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
        let title = route.snapshot.data["title"];
        this.breadcrumbs = {}; // Keep this for now, as the HTML still uses it
        this.title = title;

        this.breadcrumbItems = []; // Clear previous items

        // Home item
        this.breadcrumbItems.push({
          icon: "pi pi-home", // PrimeNG icon class
          routerLink: "/dashboard",
        });

        // Dynamic breadcrumb generation
        let currentRoute = this.activatedRoute.root;
        let url = "";

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;

          const routeURL = currentRoute.snapshot.url
            .map((segment) => segment.path)
            .join("/");

          if (routeURL) {
            url += `/${routeURL}`;
          }

          const breadcrumb = currentRoute.snapshot.data["breadcrumb"];
          if (breadcrumb) {
            // Only add if it's not a duplicate of Dashboard or Inicio
            if (breadcrumb !== "Dashboard" && breadcrumb !== "Inicio") {
              this.breadcrumbItems.push({
                label: breadcrumb,
                routerLink: url,
              });
            }
          }
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
    // NOTA: iconos del header usan el set "Fluent UI System Color" cuando existe
    // el equivalente (fluent-color:*). Los que no existen en color se dejan con
    // el nombre genérico icon.* (Material Symbols). Esto aplica SOLO al header.
    this.displayNavIcons = [
      {
        id: "home",
        ngbTooltip: "Inicio",
        iconClass: "fluent-color:home-24",
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
        iconClass: "fluent-color:arrow-sync-24",
        action: () => this.onRefresh(),
      },
      {
        id: "building",
        ngbTooltip: "Mi edificio",
        iconClass: "fluent-color:building-24",
        action: () => this.onBuilding(),
      },
      {
        id: "announcement",
        ngbTooltip: "Anuncios",
        iconClass: "fluent-color:megaphone-loud-24",
        action: () => this.onannouncement(),
      },
      {
        id: "ai-announcement",
        ngbTooltip: "Comunicado IA",
        iconClass: "fluent-color:bot-24",
        iconExtraClass: "text-purple-500",
        action: () => this.onAiAnnouncement(),
      },
      {
        id: "emergency-phones",
        ngbTooltip: "Telefonos de Emergencia",
        iconClass: "fluent-color:phone-24",
        action: () => this.onEmergencyPhones(),
      },
      {
        id: "admin",
        ngbTooltip: "Configuración",
        iconClass: "fluent-color:settings-24",
        action: () => this.onSetting(),
        requiresRole: [ApplicationRole.SuperUsuario],
      },
      {
        id: "whats-new",
        ngbTooltip: "Novedades",
        iconClass: "fluent-color:star-24",
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
    this.router.navigate(ROUTES.DASHBOARD);
  };

  onSetting = () => {
    this.router.navigate(ROUTES.CONFIGURACION.HOME);
  };

  onannouncement = () => {
    this.router.navigate(ROUTES.ANUNCIOS.LISTA);
  };

  onBuilding = () => {
    this.router.navigate(ROUTES.OPERACIONES.MI_EDIFICIO);
  };

  onEmergencyPhones = () => {
    this.router.navigate(ROUTES.DIRECTORIO.TELEFONOS_EMERGENCIA);
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
    setTimeout(() => this.displayAiModal.set(true));
    this.userIdeaControl.reset("");
    this.aiAnnouncementResult.set(null);
    this.aiAnnouncementImageResult.set(null);
    this.aiAnnouncementPosterPoints.set([]);
  }

  async generateOfficialAnnouncement(mode: "text" | "poster") {
    if (!this.userIdeaControl.value || !this.userIdeaControl.value.trim())
      return;

    this.currentMode.set(mode);

    try {
      this.isGeneratingAnnouncement.set(true);

      if (mode === "text") {
        const enrichedIdea =
          (this.userIdeaControl.value || "") +
          "\n\nINSTRUCCIONES ESTRICTAS: El texto debe ser lo más corto y claro posible, estar fuertemente apoyado con emojis. Adopta un tono sumamente empático, asegurando que el condómino se sienta entendido, y enfocado siempre en el bien común y la convivencia.";
        const textResult =
          await this.aiService.generateOfficialAnnouncementDraft(
            enrichedIdea,
            this.customerName(),
          );
        this.aiAnnouncementResult.set(textResult);
        this.aiAnnouncementImageResult.set(null);
      } else if (mode === "poster") {
        this.isGeneratingImage.set(true);
        const shortTitleIdea =
          (this.userIdeaControl.value || "") +
          "\n\nINSTRUCCIONES PARA INFOGRAFÍA (IGNORA REGLAS HTML ANTERIORES):\n" +
          "1. 'Title': Un título destacado y muy corto (máx 5 palabras).\n" +
          "2. 'Body': PROHIBIDO USAR TAGS HTML (<p>, <strong>, etc). Escribe SOLO 3 o 4 recomendaciones MUY CORTAS (máx 10 palabras cada una), separadas EXCLUSIVAMENTE por '|||'. Ejemplo estricto: 'Primera recomendación corta|||Segunda recomendación corta|||Tercera recomendación corta'.\n" +
          "3. 'CallToAction': Una instrucción final destacada sin HTML.\n" +
          "4. 'Greeting': Vacío.";

        const textResult =
          await this.aiService.generateOfficialAnnouncementDraft(
            shortTitleIdea,
            this.customerName(),
          );

        // Limpiar HTML residual por si la IA ignora la instrucción
        const cleanBody = textResult.body.replace(/<[^>]*>?/gm, "");
        const points = cleanBody
          .split("|||")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);
        this.aiAnnouncementPosterPoints.set(points);

        const imagePrompt = `Purely visual background illustration or photography representing the concept of "${textResult.title}".
Premium corporate luxury style, navy blue and gold tones, elegant layout.
CRITICAL RULE: DO NOT INCLUDE ANY TEXT, LETTERS, TYPOGRAPHY, WORDS, OR NUMBERS IN THIS IMAGE. IT MUST BE 100% TEXT-FREE.`;

        try {
          const imageBlob = await this.aiService.generateImage(imagePrompt);
          if (imageBlob) {
            const imageUrl = URL.createObjectURL(imageBlob);
            this.aiAnnouncementImageResult.set(
              this.sanitizer.bypassSecurityTrustUrl(imageUrl),
            );
          }
          // Configurar resultado para que se renderice la infografía
          this.aiAnnouncementResult.set(textResult);
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

  async copyAsImage() {
    const element = document.getElementById("print-section");
    if (!element) return;

    try {
      // Configuramos html-to-image para asegurar fondos blancos y que cargue bien los logos
      const blobPromise = htmlToImage.toBlob(element, {
        backgroundColor:
          getComputedStyle(document.body)
            .getPropertyValue("--ds-bg-surface")
            .trim() || "#ffffff",
        pixelRatio: 2,
      });

      // Pasar la promesa directamente a ClipboardItem evita que el navegador bloquee el copiado por falta de interacción inmediata
      const item = new ClipboardItem({ "image/png": blobPromise });
      await navigator.clipboard.write([item]);

      // Alerta simple de confirmación
      // alert("¡Copiado con éxito! Puedes pegarlo en WhatsApp u otros chats.");
    } catch (e) {
      console.error("Error capturando imagen", e);
    }
  }

  printAnnouncement() {
    window.print();
  }
}

import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
  untracked,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { MenuItemDto } from "src/app/core/interfaces/menu.interface";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
@Injectable({
  providedIn: "root",
})
export class MenuService implements OnDestroy {
  // --- INYECCIONES Y PROPIEDADES DE UI ---
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private consoleLogger = inject(ConsoleLoggerService);
  private customerIdS = inject(CustomerIdService);
  private destroyRef = inject(DestroyRef);

  public collapseSidebar: boolean = window.innerWidth < 1200;
  public manuallyToggled: boolean = false;
  public language: boolean = false;

  // --- GESTIÓN DEL CACHÉ ---
  private lastCustomerId: string | null = null;
  private allowedRoutes = new Set<string>();
  private menuLoadPromise: Promise<void> | null = null;
  // Señal reactiva al token de usuario
  private userTokenSignal = toSignal(this.authS.userToken$);
  // Señales base del estado del menú.
  private menuItemsSignal = signal<MenuItemDto[]>([]);
  private menuLoadedSignal = signal(false);
  private menuLoadingSignal = signal(false);

  // --- FUENTE DE DATOS REACTIVA ---
  public readonly sidebarMenuItems = computed(() => this.menuItemsSignal());
  public readonly menuLoaded = computed(() => this.menuLoadedSignal());
  public readonly menuLoading = computed(() => this.menuLoadingSignal());

  constructor() {
    // 1. Intentar recuperar estado previo del usuario
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState !== null) {
      this.collapseSidebar = JSON.parse(storedState);
      this.manuallyToggled = true;
    } else {
      this.collapseSidebar = window.innerWidth < 1200;
    }

    // Suscripción al resize con limpieza automática
    fromEvent(window, "resize")
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.manuallyToggled) {
          this.collapseSidebar = window.innerWidth < 1200;
        }
      });

    // El menú depende del customer activo y del usuario autenticado. Cuando cambian, se invalida
    // el estado anterior y se dispara una nueva carga sin intervención del componente.
    effect(() => {
      const isCustomerReady = this.customerIdS.customerDataReady();
      const customerId = this.customerIdS.customerId();
      const userToken = this.userTokenSignal();
      const applicationUserId = userToken?.infoUserAuthDTO?.applicationUserId;

      if (isCustomerReady && customerId && applicationUserId) {
        this.consoleLogger.custom(
          "",
          "green",
          `[MenuService] Customer data and session are ready. Loading menu...`,
        );
        untracked(() => {
          void this.triggerMenuLoad();
        });
      } else if (!isCustomerReady || !applicationUserId) {
        this.consoleLogger.custom(
          "",
          "gray",
          `[MenuService] Data or session not ready. Clearing menu...`,
        );
        untracked(() => {
          this.clearCache();
        });
      }
    });
  }

  async triggerMenuLoad(): Promise<void> {
    const customerId: string = this.customerIdS.customerId();
    const applicationUserId = this.authS.applicationUserId;

    if (!customerId || !applicationUserId) {
      this.menuLoadingSignal.set(false);
      this.menuLoadedSignal.set(false);
      return;
    }

    if (this.menuLoadedSignal() && this.lastCustomerId === customerId) {
      this.menuLoadedSignal.set(true);
      this.menuLoadingSignal.set(false);
      return;
    }

    if (this.menuLoadPromise) {
      return this.menuLoadPromise;
    }

    // Marcamos carga antes de consultar API para que sidebar y vistas asociadas
    // reflejen inmediatamente el cambio de customer.
    this.menuLoadingSignal.set(true);
    this.menuLoadedSignal.set(false);

    this.menuLoadPromise = (async () => {
      try {
        this.lastCustomerId = customerId;
        const rawItems = await this.fetchMenuItemsFromApi(customerId);
        this.menuItemsSignal.set(rawItems);
        this.menuLoadedSignal.set(true);
      } catch (error) {
        this.lastCustomerId = null;
        this.consoleLogger.error(
          "Fallo en el proceso de carga del menu:",
          error,
        );
        this.menuItemsSignal.set([]);
        this.menuLoadedSignal.set(false);
      } finally {
        this.menuLoadingSignal.set(false);
        this.menuLoadPromise = null;
      }
    })();

    return this.menuLoadPromise;
  }

  private async fetchMenuItemsFromApi(
    customerId: string,
  ): Promise<MenuItemDto[]> {
    const applicationUserId = this.authS.applicationUserId;

    if (!applicationUserId) {
      this.consoleLogger.error(
        "MenuService: No applicationUserId, cannot fetch menu.",
      );
      return [];
    }

    const urlApi = Endpoints.MenuItems.byCustomer(customerId);
    const result = await this.apiResponseS.onGetList<MenuItemDto[]>(urlApi);

    if (result === null) {
      this.consoleLogger.error("MenuService: onGetList returned null.");
      return [];
    }

    // Recalculamos las rutas permitidas a partir del menú recién cargado para no
    // arrastrar permisos del customer anterior.
    this.allowedRoutes.clear();
    result.forEach((item) => {
      if (item.routerLink) {
        this.allowedRoutes.add(item.routerLink);
      }
      item.items?.forEach((sub) => {
        if (sub.routerLink) {
          this.allowedRoutes.add(sub.routerLink);
        }
      });
    });

    return result;
  }

  public hasAccessToRoute(routerLink: string): boolean {
    const cleanRouterLink = routerLink.split("?")[0];
    return this.allowedRoutes.has(cleanRouterLink);
  }

  clearCache(): void {
    this.lastCustomerId = null;
    this.allowedRoutes.clear();
    this.menuLoadPromise = null;
    // Limpiamos el estado completo para que el siguiente customer recargue desde cero.
    this.menuItemsSignal.set([]);
    this.menuLoadedSignal.set(false);
    this.menuLoadingSignal.set(false);
  }

  ngOnDestroy(): void {
    // La suscripción a resize se limpia automáticamente con takeUntilDestroyed.
  }

  toggleSidebar(): void {
    this.manuallyToggled = true;
    this.collapseSidebar = !this.collapseSidebar;
    localStorage.setItem(
      "sidebarCollapsed",
      JSON.stringify(this.collapseSidebar),
    );
  }

  public reloadMenu(): Promise<void> | void {
    // Recarga explícita para acciones manuales como el botón de actualizar del header.
    this.clearCache();
    return this.triggerMenuLoad();
  }
}

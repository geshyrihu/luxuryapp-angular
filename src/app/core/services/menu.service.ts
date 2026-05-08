import {
  DestroyRef,
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IMenuItem } from "../interfaces/menu.model";
import { ConsoleLoggerService } from "./console-logger.service";

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
  private menuItemsCache: IMenuItem[] | null = null;
  private lastCustomerId: string | null = null;
  private allowedRoutes = new Set<string>();
  private menuLoadPromise: Promise<void> | null = null;
  // Señales base del estado del menú.
  private menuItemsSignal = signal<IMenuItem[]>([]);
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

    // El menú depende del customer activo. Cuando cambia el customer, se invalida
    // el estado anterior y se dispara una nueva carga sin intervención del componente.
    effect(() => {
      const isCustomerReady = this.customerIdS.customerDataReady();
      const customerId = this.customerIdS.customerId();

      if (isCustomerReady && customerId) {
        this.consoleLogger.custom(
          "✅",
          "green",
          `[MenuService] Customer data is ready for ${customerId}. Loading menu...`,
        );
        this.triggerMenuLoad();
      } else if (!isCustomerReady) {
        this.consoleLogger.custom(
          "🧹",
          "gray",
          "[MenuService] Customer data not ready. Clearing menu...",
        );
        this.clearCache();
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

    if (
      this.menuItemsSignal().length > 0 &&
      this.lastCustomerId === customerId
    ) {
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
        const rawItems = await this.fetchMenuItemsFromApi(customerId);
        this.menuItemsSignal.set(rawItems);
        this.menuLoadedSignal.set(true);
      } catch (error) {
        this.consoleLogger.error("Fallo en el proceso de carga del menú:", error);
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
  ): Promise<IMenuItem[]> {
    const applicationUserId = this.authS.applicationUserId;

    if (!applicationUserId) {
      this.consoleLogger.error(
        "MenuService: No applicationUserId, cannot fetch menu.",
      );
      return [];
    }

    const urlApi = Endpoints.MenuItems.byCustomer(customerId);
    const result = await this.apiResponseS.onGetList<IMenuItem[]>(urlApi);

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

    this.menuItemsCache = result;
    this.lastCustomerId = customerId;
    return result;
  }

  public hasAccessToRoute(routerLink: string): boolean {
    const cleanRouterLink = routerLink.split("?")[0];
    return this.allowedRoutes.has(cleanRouterLink);
  }

  clearCache(): void {
    this.menuItemsCache = null;
    this.lastCustomerId = null;
    this.allowedRoutes.clear();
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

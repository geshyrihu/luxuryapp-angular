import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
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
import {
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonSearchbar,
} from "@ionic/angular/standalone";
import { filter, map, startWith } from "rxjs";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { MobileEmptyState } from "../empty-state/empty-state";

export interface IMobileBreadcrumbItem {
  icon?: string;
  routerLink?: string | any[];
  label?: string;
}

/**
 * 📱 DATA VIEW MOBILE
 * -------------------------------------------------------------------------
 * Vista maestra para dispositivos móviles.
 * Maneja listas, scroll infinito, filtrado y breadcrumbs automáticamente.
 * "Magic" 🪄
 */
@Component({
  selector: "app-data-view-mobile",
  templateUrl: "./data-view-mobile.html",
  styleUrls: ["./data-view-mobile.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonProgressBar,
    IonLabel,
    IonSearchbar,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    AppIcon,
    MobileEmptyState,
  ],
})
export class DataViewMobile implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // <--- Inputs --->
  data = input<any[]>([]);
  loading = input<boolean>(false);
  showAdd = input<boolean>(true);
  globalFilterFields = input<string[]>([]);
  dt = input<any | undefined>(undefined); // Duck typing a PrimeNG Table
  viewchildBreadcrumb = input<boolean>(true);

  // Tracking & Grouping
  trackByProperty = input<string | undefined>(undefined);
  isGrouped = input<boolean>(false);
  groupedData = input<any>(undefined);
  enablePagination = input<boolean>(false);

  // <--- Children --->
  listItemTemplate = contentChild<TemplateRef<any>>("listItemTemplate");
  defaultListItemTemplate = viewChild<TemplateRef<any>>(
    "defaultListItemTemplate",
  );

  // <--- Outputs --->
  add = output<any>();
  nextPage = output<any>();

  // <--- State --->
  filterValue = signal<string>("");
  title = signal<string>("");
  breadcrumbItems = signal<IMobileBreadcrumbItem[]>([]);

  // Reactivo a la ruta para breadcrumbs y títulos
  private routeData = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null), // Dispara al inicio
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === PRIMARY_OUTLET),
      map((route) => ({
        snapshot: route.snapshot,
        data: route.snapshot.data,
      })),
    ),
  );

  constructor() {}

  ngOnInit(): void {
    // Procesar cambios de ruta y actualizar señales
    // Nota: toSignal maneja la suscripción, pero aquí procesamos los efectos
    const currentRoute = this.routeData();
    if (currentRoute) {
      this.updateBreadcrumbs(currentRoute);
    }

    // Si routeData cambia (navegación), actualizamos.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
      )
      .subscribe(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        if (route.outlet === PRIMARY_OUTLET) {
          this.updateBreadcrumbs({
            snapshot: route.snapshot,
            data: route.snapshot.data,
          });
        }
      });
  }

  private updateBreadcrumbs(routeInfo: any) {
    this.title.set(routeInfo.data["title"] || "");
    const childBreadcrumb = routeInfo.data["breadcrumb"];

    const items: IMobileBreadcrumbItem[] = [
      {
        icon: "mdi:home",
        routerLink: "/dashboard/default",
      },
    ];

    if (childBreadcrumb) {
      items.push({ label: childBreadcrumb });
    }
    this.breadcrumbItems.set(items);
  }

  onAdd(data: any) {
    this.add.emit(data);
  }

  applyFilter(val: string) {
    this.filterValue.set(val);
    const table = this.dt();
    if (table) {
      try {
        table.filterGlobal(val, "contains");
      } catch (error) {
        console.error("Error al filtrar con PrimeNG:", error);
      }
    }
  }

  filteredData = computed(() => {
    const data = this.data() || [];
    const filterFields = this.globalFilterFields();
    const filterVal = this.filterValue();

    if (!filterVal || filterVal.trim() === "" || !filterFields?.length) {
      return data;
    }

    const lowerCaseFilter = filterVal.toLowerCase();
    return data.filter((item) => {
      return filterFields.some((field) => {
        const value = String(item[field] ?? "").toLowerCase();
        return value.includes(lowerCaseFilter);
      });
    });
  });

  // 👇 Función flexible de tracking
  trackByFn(index: number, item: any): any {
    if (!item) return index;
    const prop = this.trackByProperty();

    // 1. Si se especificó trackByProperty, usarla
    if (prop && item.hasOwnProperty(prop)) {
      const key = item[prop];
      if (key != null && key !== "00000000-0000-0000-0000-000000000000")
        return key;
    }

    // 2. Intentar propiedades comunes de ID
    const commonIdProps = [
      "id",
      "employeeId",
      "applicationUserId",
      "userId",
      "uuid",
      "_id",
    ];
    for (const p of commonIdProps) {
      if (
        item &&
        item.hasOwnProperty(p) &&
        item[p] != null &&
        item[p] !== "00000000-0000-0000-0000-000000000000"
      ) {
        return item[p];
      }
    }

    // 3. Fallback: usar índice
    return index;
  }

  onIonInfinite(event: any) {
    this.nextPage.emit(event);
  }

  objectKeys(obj: any) {
    return obj ? Object.keys(obj) : [];
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from "@angular/router";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { filter } from "rxjs/operators";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  DialogHandlerService,
  DialogSize,
} from "src/app/core/services/dialog-handler.service";
import { AccordionItem } from "src/app/shared/ui/base/accordion.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CobranzaDatePickerModalComponent } from "./cobranza-date-picker-modal";
import { cobranzaOnlineFilterState } from "./state/cobranza-online-filter.state";
import { CobranzaOnlineStoreService } from "./state/cobranza-online-store.service";

@Component({
  selector: "app-cobranza-online-wrapper",
  imports: [RouterModule, AppIcon, LxDivider],
  templateUrl: "./cobranza-online-wrapper.html",
  styleUrls: ["./cobranza-online.styles.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineWrapper {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private customerIdS = inject(CustomerIdService);
  private store = inject(CobranzaOnlineStoreService);
  private dialogS = inject(DialogHandlerService);

  readonly pageTitle = signal("Cobranza Online");
  readonly pageDescription = signal("");

  readonly contextAccordionItems = computed<AccordionItem[]>(() => {
    const customer = this.customerName() || "Sin Cliente";
    const period = this.currentCutLabel();
    return [
      {
        id: "context",
        title: `Cliente: ${customer} · ${period}`,
        icon: "mdi:office-building-outline",
      },
    ];
  });

  readonly currentYear = cobranzaOnlineFilterState.year;
  readonly currentMonth = cobranzaOnlineFilterState.month;
  readonly currentDay = cobranzaOnlineFilterState.day;

  readonly currentDate = computed(() => {
    const y = this.currentYear();
    const m = this.currentMonth().toString().padStart(2, "0");
    const d = this.currentDay().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  readonly currentMonthName = computed(() => {
    const date = new Date(this.currentYear(), this.currentMonth() - 1, 1);
    return date.toLocaleDateString("es-MX", { month: "long" });
  });

  onDateChange(val: string | Date) {
    if (!val) return;

    if (val instanceof Date) {
      this.currentYear.set(val.getFullYear());
      this.currentMonth.set(val.getMonth() + 1);
      this.currentDay.set(val.getDate());
      return;
    }

    if (typeof val === "string") {
      const parts = val.split("-");
      if (parts.length >= 3) {
        this.currentYear.set(parseInt(parts[0], 10));
        this.currentMonth.set(parseInt(parts[1], 10));
        this.currentDay.set(parseInt(parts[2], 10));
      }
    }
  }

  readonly loading = this.store.isLoading;
  readonly syncRunning = this.store.isSyncing;

  readonly dateControl = new FormControl(this.currentDate());

  readonly syncStatus = this.store.syncStatus;
  readonly lastSyncDiagnostics = this.store.lastSyncDiagnostics;

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly currentCutLabel = computed(
    () =>
      `${this.currentMonth().toString().padStart(2, "0")}/${this.currentYear()}`,
  );

  // Condóminos del mes = KPI del backend (cuentas con cargo de mantenimiento -001
  // en el corte). No usar departments.length: esa lista solo trae deudores (saldo > 0).
  readonly totalCondominos = computed(
    () => this.store.dashboardData()?.kpis?.totalDepartments ?? 0,
  );

  readonly formattedLastSync = computed(() => {
    const lastSyncAt = this.syncStatus()?.lastSyncAt;
    if (!lastSyncAt) {
      return "Sin datos";
    }

    const parsedDate = new Date(lastSyncAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return lastSyncAt;
    }

    return `${this.formatDateShort(parsedDate)} ${parsedDate.toLocaleTimeString("es-MX", { timeStyle: "short" })}`;
  });

  constructor() {
    this.dateControl.valueChanges.subscribe((val) => {
      if (val) this.onDateChange(val);
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const data = route.snapshot.data;
        this.pageTitle.set(data["title"] || "Cobranza Online");
        this.pageDescription.set(data["description"] || "");
      });

    // Iniciar el polling silencioso de Aspel cada 20 minutos
    this.store.startSilentPolling();
  }

  ngOnDestroy() {
    this.store.stopSilentPolling();
  }

  async onSyncNow() {
    await this.store.forceSyncWithAspel();
  }

  async onOpenDatePickerDialog() {
    try {
      await this.dialogS.openDialog(
        CobranzaDatePickerModalComponent,
        { dateControl: this.dateControl },
        "Seleccionar Fecha",
        DialogSize.md,
      );
    } catch (error) {
      console.error("Error opening date picker", error);
    }
  }

  formatDateShort(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("es-MX", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }
}

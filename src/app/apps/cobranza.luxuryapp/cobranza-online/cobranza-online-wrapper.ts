import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type {
  CobranzaOnlineSyncDiagnostics,
  CobranzaOnlineSyncMetadata,
  CobranzaOnlineSyncResponse,
} from "./interfaces/cobranza-online-sync.model";
import { cobranzaOnlineFilterState } from "./state/cobranza-online-filter.state";

@Component({
  selector: "app-cobranza-online-wrapper",
  imports: [RouterModule, CustomInputDateSignal, AppIcon, WebButtonLabel],
  templateUrl: "./cobranza-online-wrapper.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineWrapper {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

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

  readonly loading = signal(false);
  readonly syncRunning = signal(false);

  readonly dateControl = new FormControl(this.currentDate());

  readonly syncStatus = signal<CobranzaOnlineSyncMetadata | null>(null);
  readonly lastSyncDiagnostics = signal<CobranzaOnlineSyncDiagnostics | null>(
    null,
  );

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly currentCutLabel = computed(
    () =>
      `${this.currentMonth().toString().padStart(2, "0")}/${this.currentYear()}`,
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

    effect(() => {
      const customerId = this.customerIdS.customerId();
      const year = this.currentYear();
      if (!customerId) {
        this.lastSyncDiagnostics.set(null);
        this.syncStatus.set(null);
        return;
      }

      void this.loadSyncStatus(customerId, year);
    });
  }

  private async loadSyncStatus(customerId: string, year: number) {
    this.loading.set(true);

    const syncStatus =
      await this.apiResponseS.onGetItem<CobranzaOnlineSyncMetadata>(
        Endpoints.CobranzaOnline.Dashboard.syncStatus(customerId, year),
      );

    this.syncStatus.set(syncStatus ?? null);
    this.loading.set(false);
  }

  async onSyncNow() {
    const customerId = this.customerIdS.customerId();
    if (!customerId || this.syncRunning()) {
      return;
    }

    this.syncRunning.set(true);
    try {
      const response =
        await this.apiResponseS.onPost<CobranzaOnlineSyncResponse>(
          Endpoints.CobranzaOnline.Sync.cobranza(customerId, this.currentYear()),
        );

      if (response) {
        this.lastSyncDiagnostics.set(
          (response as CobranzaOnlineSyncResponse)?.diagnostics ?? null,
        );
        await this.loadSyncStatus(customerId, this.currentYear());
      }
    } finally {
      this.syncRunning.set(false);
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

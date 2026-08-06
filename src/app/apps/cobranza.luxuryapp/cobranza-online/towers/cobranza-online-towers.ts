import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { CobranzaOnlineDashboardResponse } from "../interfaces/cobranza-online-dashboard.model";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";

@Component({
  selector: "app-cobranza-online-towers",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    WebButtonLabel,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
  templateUrl: "./cobranza-online-towers.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineTowers {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

  readonly currentYear = cobranzaOnlineFilterState.year;
  readonly currentMonth = cobranzaOnlineFilterState.month;
  readonly currentDay = cobranzaOnlineFilterState.day;

  readonly loading = signal(false);
  readonly dashboard = signal<CobranzaOnlineDashboardResponse | null>(null);

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  readonly towers = computed(() => this.dashboard()?.towers ?? []);

  readonly totalTowers = computed(() => {
    return this.towers().reduce(
      (acc, curr) => {
        acc.departmentCount += curr.departmentCount;
        acc.maintenanceBalance += curr.maintenanceBalance;
        acc.extraordinaryBalance += curr.extraordinaryBalance;
        acc.finesBalance += curr.finesBalance;
        acc.totalBalance += curr.totalBalance;
        return acc;
      },
      {
        departmentCount: 0,
        maintenanceBalance: 0,
        extraordinaryBalance: 0,
        finesBalance: 0,
        totalBalance: 0,
      },
    );
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (!customerId) {
        this.dashboard.set(null);
        return;
      }

      void this.loadData(customerId);
    });
  }

  private async loadData(customerId: string) {
    this.loading.set(true);
    const dashboard =
      await this.apiResponseS.onGetItem<CobranzaOnlineDashboardResponse>(
        Endpoints.CobranzaOnline.Dashboard.get(
          customerId,
          this.currentYear(),
          this.currentMonth(),
          this.currentDay(),
        ),
      );
    this.dashboard.set(dashboard ?? null);
    this.loading.set(false);
  }

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }
}

import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";

@Component({
  selector: "app-cobranza-online-towers",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
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
  private store = inject(CobranzaOnlineStoreService);

  readonly currentYear = cobranzaOnlineFilterState.year;
  readonly currentMonth = cobranzaOnlineFilterState.month;
  readonly currentDay = cobranzaOnlineFilterState.day;

  readonly loading = this.store.isLoading;
  readonly dashboard = this.store.dashboardData;

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
}

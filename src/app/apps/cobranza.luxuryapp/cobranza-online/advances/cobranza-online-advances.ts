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
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { CobranzaOnlineDashboardResponse } from "../interfaces/cobranza-online-dashboard.model";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";

@Component({
  selector: "app-cobranza-online-advances",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    SharedModule,
    WebButtonLabel,
    AppIcon,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileListItem,
  ],
  templateUrl: "./cobranza-online-advances.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineAdvances {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  readonly currentYear = cobranzaOnlineFilterState.year;
  readonly currentMonth = cobranzaOnlineFilterState.month;
  readonly currentDay = cobranzaOnlineFilterState.day;

  readonly loading = signal(false);
  readonly dashboard = signal<CobranzaOnlineDashboardResponse | null>(null);

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly advances = computed(() => this.dashboard()?.advances ?? []);

  readonly totalAdvances = computed(() =>
    this.advances().reduce((acc, curr) => acc + curr.balance * -1, 0),
  );

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

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
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { TagModule } from "@ui/web/primeng-tag/primeng-tag";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { CobranzaOnlineDashboardResponse } from "../interfaces/cobranza-online-dashboard.model";
import { clasificarCuenta } from "../helpers/cobranza-clasificacion";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";

@Component({
  selector: "app-cobranza-online-debtors",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    SharedModule,
    WebButtonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    TagModule,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
  templateUrl: "./cobranza-online-debtors.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineDebtors {
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

  readonly allDebtors = computed(() => {
    const deps = this.dashboard()?.departments ?? [];

    return deps
      .map((d) => {
        const { clasificacion, isJudicial } = clasificarCuenta(d);
        return { ...d, clasificacion, isJudicial };
      })
      .sort((a, b) => b.balance - a.balance);
  });

  readonly totalDebtorsMaintenance = computed(() =>
    this.allDebtors().reduce((sum, d) => sum + (d.maintenanceBalance || 0), 0),
  );

  readonly totalDebtorsExtraordinary = computed(() =>
    this.allDebtors().reduce((sum, d) => sum + (d.extraordinaryBalance || 0), 0),
  );

  readonly totalDebtorsBalance = computed(() =>
    this.allDebtors().reduce((sum, d) => sum + (d.balance || 0), 0),
  );

  readonly totalDebtorsFines = computed(() =>
    this.allDebtors().reduce((sum, d) => sum + (d.finesBalance || 0), 0),
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

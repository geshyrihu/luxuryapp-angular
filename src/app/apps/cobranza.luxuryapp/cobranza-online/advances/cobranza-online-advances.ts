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
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";

@Component({
  selector: "app-cobranza-online-advances",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    SharedModule,
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
  private tableScrollHeightS = inject(TableScrollHeightService);
  private store = inject(CobranzaOnlineStoreService);

  readonly currentYear = cobranzaOnlineFilterState.year;
  readonly currentMonth = cobranzaOnlineFilterState.month;
  readonly currentDay = cobranzaOnlineFilterState.day;

  readonly loading = this.store.isLoading;
  readonly dashboard = this.store.dashboardData;

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly advances = computed(() => this.dashboard()?.advances ?? []);

  readonly totalAdvances = computed(() =>
    this.advances().reduce((acc, curr) => acc + curr.balance * -1, 0),
  );

  /** Total de adelantos exclusivamente de cuota Mtto (001) */
  readonly totalAdvancesMtto = computed(() =>
    this.advances().reduce(
      (acc, curr) => acc + Math.abs(curr.maintenanceBalance || 0),
      0,
    ),
  );

  /** Total de adelantos de cuota Extraordinaria (003) */
  readonly totalAdvancesExtra = computed(() =>
    this.advances().reduce(
      (acc, curr) => acc + Math.abs(curr.extraordinaryBalance || 0),
      0,
    ),
  );

  /** Hay adelantos extraordinarios (para mostrar/ocultar la columna) */
  readonly hasExtraAdvances = computed(() =>
    this.advances().some((a) => (a.extraordinaryBalance || 0) < 0),
  );

  constructor() {}

  // navigateTo(route: string) {
  //   if (route) this.router.navigateByUrl(route);
  // }
}

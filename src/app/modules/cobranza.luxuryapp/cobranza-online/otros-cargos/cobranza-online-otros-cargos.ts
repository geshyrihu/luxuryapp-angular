import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import type {
  CobranzaOnlineDashboardResponse,
  CobranzaOtroCargo,
} from "../interfaces/cobranza-online-dashboard.model";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";

@Component({
  selector: "app-cobranza-online-otros-cargos",
  imports: [
    CommonModule,
    TableModule,
    SharedModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    DataViewMobile,
    MobileListItem,
  ],
  templateUrl: "./cobranza-online-otros-cargos.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineOtrosCargos {
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

  /** Lista de otros cargos (cuentas != 001, 002, 003) del mes consultado. */
  readonly otrosCargos = computed<CobranzaOtroCargo[]>(() => {
    return this.dashboard()?.currentCharges?.otrosCargos ?? [];
  });

  /** Totales consolidados para el footer. */
  readonly totales = computed(() => {
    const cargos = this.otrosCargos();
    return {
      conceptName: "TOTAL",
      total: cargos.reduce((s, c) => s + c.total, 0),
      collected: cargos.reduce((s, c) => s + c.collected, 0),
      pending: cargos.reduce((s, c) => s + c.pending, 0),
    };
  });

  constructor() {}
}

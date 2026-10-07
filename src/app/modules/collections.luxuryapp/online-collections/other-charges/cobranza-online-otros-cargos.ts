import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import type { CobranzaOtroCargo } from "../interfaces/cobranza-online-dashboard.model";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";

import { AccountingNumberPipe } from "@shared/pipes/accounting-number.pipe";
@Component({
  selector: "app-cobranza-online-otros-cargos",
  imports: [
    AccountingNumberPipe,
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableEmptyMessage,
    LuxDataViewMobile,
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

  readonly tableRows: number = tableRows();
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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { CobranzaOnlineService } from "../cobranza-online.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import type {
  CobranzaOnlineExcludedAccountListResponse,
  CobranzaOnlineExcludedAccountRow,
  CobranzaOnlineExcludedAccountUpsert,
} from "../interfaces/cobranza-online-exclusions.model";

@Component({
  selector: "app-cobranza-online-exclusions",
  templateUrl: "./cobranza-online-exclusions.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    CustomInputCheckSignal,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    PrimeNgCustomTableEmptyMessage,
    MobileListItem,
  ],
})
export class CobranzaOnlineExclusions {
  private customerIdS = inject(CustomerIdService);
  private cobranzaOnlineS = inject(CobranzaOnlineService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  readonly currentYear = signal(new Date().getFullYear());
  readonly loading = signal(true);
  readonly savingAccountNumber = signal<string | null>(null);
  readonly onlyWithoutPropertyMatch = signal(false);
  readonly data = signal<CobranzaOnlineExcludedAccountListResponse | null>(
    null,
  );

  readonly tablePrimeNgRows = tablePrimeNgRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly rows = computed(() => {
    const rows = [...(this.data()?.rows ?? [])];

    rows.sort((left, right) => {
      if (left.hasPropertyMatch !== right.hasPropertyMatch) {
        return left.hasPropertyMatch ? 1 : -1;
      }

      return left.accountNumber.localeCompare(right.accountNumber);
    });

    return rows;
  });
  readonly visibleRows = computed(() =>
    this.onlyWithoutPropertyMatch()
      ? this.rows().filter((row) => !row.hasPropertyMatch)
      : this.rows(),
  );
  readonly excludedCount = computed(() => this.data()?.totalExcluded ?? 0);
  readonly rowsWithoutPropertyMatch = computed(
    () => this.rows().filter((row) => !row.hasPropertyMatch).length,
  );
  readonly globalFilterFields = computed(() => [
    "accountNumber",
    "accountName",
    "reason",
    "propertyFullName",
    "propertyTower",
    "propertyDepartment",
  ]);
  readonly visibleReason = (row: CobranzaOnlineExcludedAccountRow) => {
    if (row.reason) return row.reason;
    if (!row.hasPropertyMatch) {
      return "Revisar: no existe match contra Property para este customer.";
    }

    return "Incluida en el universo del módulo";
  };

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (!customerId) {
        this.data.set(null);
        this.loading.set(false);
        return;
      }

      void this.onLoadData(customerId);
    });
  }

  async onLoadData(customerId = this.customerIdS.customerId()) {
    if (!customerId) return;

    this.loading.set(true);
    const response =
      await this.cobranzaOnlineS.getExcludedAccounts(
        customerId,
        this.currentYear(),
      );

    this.data.set(
      (response as CobranzaOnlineExcludedAccountListResponse | null) ?? null,
    );
    this.loading.set(false);
  }

  // Readonly view
}

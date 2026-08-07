import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface UnallocatedPayment {
  id: string;
  propertyId: string;
  amount: number;
  paymentDate: string;
  reference: string | null;
  status: string;
}

@Component({
  selector: "app-reconciliation-dashboard",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    LxTag,
    LxCard,
    DataViewMobile,
    MobileListItem,
    AppIcon,
    DatePipe,
    CurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./reconciliation-dashboard.html",
})
export default class ReconciliationDashboard {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<UnallocatedPayment[]>([]);
  reconciling = signal(false);
  lastResult = signal<number | null>(null);

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  async onLoadData() {
    const res = await this.apiResponseS.onGetItem<UnallocatedPayment[]>(
      Endpoints.CobranzaCore.Reconciliation.unallocated,
    );
    this.dataSignal.set(res ?? []);
  }

  async onAutoReconcile() {
    this.reconciling.set(true);
    try {
      const count = await this.apiResponseS.onPost<number>(
        Endpoints.CobranzaCore.Reconciliation.autoApplyAll,
        {},
      );
      this.lastResult.set(typeof count === "number" ? count : 0);
      await this.onLoadData();
    } finally {
      this.reconciling.set(false);
    }
  }
}

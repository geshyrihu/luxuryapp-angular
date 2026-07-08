import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

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
      Endpoints.AccountingCoi.NativeCollection.Reconciliation.unallocated,
    );
    this.dataSignal.set(res ?? []);
  }

  async onAutoReconcile() {
    this.reconciling.set(true);
    try {
      const count = await this.apiResponseS.onPost<number>(
        Endpoints.AccountingCoi.NativeCollection.Reconciliation.autoApplyAll,
        {},
      );
      this.lastResult.set(typeof count === "number" ? count : 0);
      await this.onLoadData();
    } finally {
      this.reconciling.set(false);
    }
  }
}

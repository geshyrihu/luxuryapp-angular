import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { gitMergeOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
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
    IonItem,
    IonLabel,
    DatePipe,
    CurrencyPipe,
  ],
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
    addIcons({ gitMergeOutline });
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

import { Component, computed, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { walletOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  BulkSetInitialBalanceDTO,
  PropertyInitialBalanceDTO,
} from "../../models/charge.dto";

interface BalanceRow extends PropertyInitialBalanceDTO {
  amount: number | null;
  dirty: boolean;
}

@Component({
  selector: "app-initial-balance",
  imports: [
    FormsModule,
    TableModule,
    CustomInputCurrencySignal,
    WebButtonLabel,
    DataViewMobile,
    PrimeNgCustomCaption,
    IonItem,
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./initial-balance.html",
})
export default class InitialBalance {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  loading = signal(true);
  saving = signal(false);
  rows = signal<BalanceRow[]>([]);

  hasPendingChanges = computed(() =>
    this.rows().some((r) => r.dirty && (r.amount ?? 0) > 0),
  );
  contarConSaldo = computed(
    () => this.rows().filter((r) => r.hasSaldoInicial).length,
  );
  contarPendientes = computed(
    () => this.rows().filter((r) => r.dirty && (r.amount ?? 0) > 0).length,
  );

  constructor() {
    addIcons({ walletOutline });
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    const customerId = this.customerIdS.customerId();
    const res = await this.apiS.onGetItem<PropertyInitialBalanceDTO[]>(
      Endpoints.AccountingCoi.NativeCollection.Charges.initialBalanceStatus(
        customerId,
      ),
    );
    if (res) {
      this.rows.set(
        res.map((p) => ({
          ...p,
          amount: p.existingAmount ?? null,
          dirty: false,
        })),
      );
    }
    this.loading.set(false);
  }

  onAmountChange(row: BalanceRow) {
    row.dirty = true;
    this.rows.update((list) => [...list]);
  }

  async onSave() {
    const customerId = this.customerIdS.customerId();
    const items = this.rows()
      .filter((r) => r.dirty && (r.amount ?? 0) > 0)
      .map((r) => ({ propertyId: r.propertyId, amount: r.amount! }));

    if (!items.length) return;

    this.saving.set(true);
    const payload: BulkSetInitialBalanceDTO = { customerId, items };
    const res = await this.apiS.onPost(
      Endpoints.AccountingCoi.NativeCollection.Charges.bulkSetInitialBalance,
      payload,
    );
    this.saving.set(false);

    if (res) {
      await this.loadData();
    }
  }
}

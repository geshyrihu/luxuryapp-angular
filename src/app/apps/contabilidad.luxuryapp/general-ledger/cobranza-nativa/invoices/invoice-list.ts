import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { addIcons } from "ionicons";
import { receiptOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { InvoiceResponseDTO } from "../interfaces/invoice.dto";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

@Component({
  selector: "app-invoice-list",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    DatePipe,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    AppIcon,
    MobileListItem,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./invoice-list.html",
})
export default class InvoiceList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  charges = signal<{ label: string; value: string }[]>([]);
  chargeIdCtrl = new FormControl<string>("", { nonNullable: true });
  dataSignal = signal<InvoiceResponseDTO[]>([]);

  constructor() {
    addIcons({ receiptOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadCharges(customerId);
    });
  }

  async loadCharges(customerId: string) {
    const res = await this.apiResponseS.onGetItem<any[]>(
      Endpoints.AccountingCoi.NativeCollection.Charges.customer(customerId),
    );
    if (res) {
      this.charges.set(
        res.map((c) => ({
          label: `${c.description ?? "Cargo"} é ${c.amount}`,
          value: c.id,
        })),
      );
    }
  }

  async onSearch() {
    const chargeId = this.chargeIdCtrl.value;
    if (!chargeId) return;
    const res = await this.apiResponseS.onGetItem<InvoiceResponseDTO[]>(
      Endpoints.AccountingCoi.NativeCollection.Invoices.byCharge(chargeId),
    );
    this.dataSignal.set(res ?? []);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Vigente: "bg-green-100 text-green-800",
      Cancelado: "bg-red-100 text-red-800",
    };
    return map[status] ?? "bg-gray-100 text-gray-600";
  }
}

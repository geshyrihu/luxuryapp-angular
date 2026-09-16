import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { addIcons } from "ionicons";
import { receiptOutline } from "ionicons/icons";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { InvoiceResponseDTO } from "../../interfaces/invoice.dto";

@Component({
  selector: "app-invoice-list",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    LxCard,
    LxTag,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    ApiDatePipe,
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
      Endpoints.CobranzaCore.Charges.customer(customerId),
    );
    if (res) {
      this.charges.set(
        res.map((c) => ({
          label: `${c.description ?? "Cargo"} · ${c.amount}`,
          value: c.id,
        })),
      );
    }
  }

  async onSearch() {
    const chargeId = this.chargeIdCtrl.value;
    if (!chargeId) return;
    const res = await this.apiResponseS.onGetItem<InvoiceResponseDTO[]>(
      Endpoints.CobranzaCore.Invoices.byCharge(chargeId),
    );
    this.dataSignal.set(res ?? []);
  }

  statusMeta(status: string) {
    const map: Record<
      string,
      { label: string; severity: "success" | "danger" | "contrast" }
    > = {
      Vigente: { label: "Vigente", severity: "success" },
      Cancelado: { label: "Cancelado", severity: "danger" },
    };
    return map[status] ?? { label: status, severity: "contrast" };
  }
}


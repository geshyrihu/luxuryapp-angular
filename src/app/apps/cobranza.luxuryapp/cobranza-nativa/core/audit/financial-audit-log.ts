import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
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
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { FinancialAuditLogDTO } from "../../interfaces/financial-audit.dto";

@Component({
  selector: "app-financial-audit-log",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    LxCard,
    LxTag,
    DataViewMobile,
    MobileListItem,
    DatePipe,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./financial-audit-log.html",
})
export default class FinancialAuditLog {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  properties = signal<{ label: string; value: string }[]>([]);
  propertyIdCtrl = new FormControl<string | null>(null);
  fromCtrl = new FormControl<Date | string | null>(null);
  toCtrl = new FormControl<Date | string | null>(null);

  dataSignal = signal<FinancialAuditLogDTO[]>([]);
  loading = signal(false);

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadProperties(customerId);
    });
  }

  async loadProperties(customerId: string) {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      Endpoints.SelectItems.properties(customerId),
    );
    if (res) {
      this.properties.set([{ label: "Todo el condominio", value: "" }, ...res]);
    }
  }

  async onSearch() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.loading.set(true);
    try {
      let params = new HttpParams();
      const from = this.getQueryDate(this.fromCtrl.value);
      const to = this.getQueryDate(this.toCtrl.value);

      if (from) params = params.set("from", from);
      if (to) params = params.set("to", to);
      const qs = params.toString() ? "?" + params.toString() : "";

      const propertyId = this.propertyIdCtrl.value;
      const url = propertyId
        ? Endpoints.CobranzaCore.FinancialAudit.byProperty(
            propertyId,
            customerId,
          ) + qs
        : Endpoints.CobranzaCore.FinancialAudit.byCustomer(
            customerId,
          ) + qs;

      const res = await this.apiResponseS.onGetItem<FinancialAuditLogDTO[]>(url);
      this.dataSignal.set(res ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  successMeta(isSuccess: boolean) {
    return isSuccess
      ? ({ label: "Exitoso", severity: "success" as const })
      : ({ label: "Fallido", severity: "danger" as const });
  }

  private getQueryDate(value: Date | string | null): string | null {
    return this.dateS.getDateFormat(value);
  }
}

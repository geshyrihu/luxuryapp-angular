import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, effect, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { documentTextOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButton } from "src/app/core/components/web/buttons";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { CustomInputDateSignal } from "src/app/core/components/web/inputs/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { FinancialAuditLogDTO } from "../../models/financial-audit.dto";

@Component({
  selector: "app-financial-audit-log",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    CustomButton,
    DataViewMobile,
    IonItem,
    IonLabel,
    DatePipe,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    AppIcon,
  ],
  templateUrl: "./financial-audit-log.html",
})
export default class FinancialAuditLog {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  properties = signal<{ label: string; value: string }[]>([]);
  propertyIdCtrl = new FormControl<string | null>(null);
  fromCtrl = new FormControl<string>("", { nonNullable: true });
  toCtrl = new FormControl<string>("", { nonNullable: true });

  dataSignal = signal<FinancialAuditLogDTO[]>([]);
  loading = signal(false);

  constructor() {
    addIcons({ documentTextOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadProperties(customerId);
    });
  }

  async loadProperties(customerId: string) {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      `properties/${customerId}`,
    );
    if (res)
      this.properties.set([{ label: "Todo el condominio", value: "" }, ...res]);
  }

  async onSearch() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.loading.set(true);
    try {
      let params = new HttpParams();
      if (this.fromCtrl.value) params = params.set("from", this.fromCtrl.value);
      if (this.toCtrl.value) params = params.set("to", this.toCtrl.value);
      const qs = params.toString() ? "?" + params.toString() : "";

      const propertyId = this.propertyIdCtrl.value;
      const url = propertyId
        ? Endpoints.AccountingCoi.NativeCollection.FinancialAudit.byProperty(
            propertyId,
            customerId,
          ) + qs
        : Endpoints.AccountingCoi.NativeCollection.FinancialAudit.byCustomer(
            customerId,
          ) + qs;

      const res =
        await this.apiResponseS.onGetItem<FinancialAuditLogDTO[]>(url);
      this.dataSignal.set(res ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  successClass(isSuccess: boolean): string {
    return isSuccess
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  }
}


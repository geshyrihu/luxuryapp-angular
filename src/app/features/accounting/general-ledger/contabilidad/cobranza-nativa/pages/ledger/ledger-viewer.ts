import { CurrencyPipe, DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { addIcons } from "ionicons";
import { listOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { EFinancialEventType } from "../../models/enums";
import { FinancialLedgerEntryDTO } from "../../models/ledger.dto";
import { InputSelect } from "@ui/inputs/adaptive/input-select/input-select";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-ledger-viewer",
  imports: [TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal, MobileListItem, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./ledger-viewer.html",
})
export default class LedgerViewer {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  EFinancialEventType = EFinancialEventType;

  properties = signal<{ label: string; value: string }[]>([]);
  propertyIdCtrl = new FormControl<string>("", { nonNullable: true });
  fromCtrl = new FormControl<string>("", { nonNullable: true });
  toCtrl = new FormControl<string>("", { nonNullable: true });
  eventTypeCtrl = new FormControl<number | null>(null);

  dataSignal = signal<FinancialLedgerEntryDTO[]>([]);
  loading = signal(false);

  eventTypeOptions = [
    { label: "Todos", value: null },
    { label: "Emision Cargo", value: EFinancialEventType.EmisionCargo },
    { label: "Cancelacion Cargo", value: EFinancialEventType.CancelacionCargo },
    { label: "Ajuste Cargo", value: EFinancialEventType.AjusteCargo },
    { label: "Condonacion Cargo", value: EFinancialEventType.CondonacionCargo },
    { label: "Recepcion Pago", value: EFinancialEventType.RecepcionPago },
    { label: "Aplicacion Pago", value: EFinancialEventType.AplicacionPago },
    { label: "Cancelacion Pago", value: EFinancialEventType.CancelacionPago },
    { label: "Reverso Pago", value: EFinancialEventType.ReversoPago },
    { label: "Nota Credito", value: EFinancialEventType.EmisionNotaCredito },
    { label: "Cierre Periodo", value: EFinancialEventType.CierrePeriodo }
  ];

  constructor() {
    addIcons({ listOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadProperties(customerId);
    });
  }

  async loadProperties(customerId: string) {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      `properties/${customerId}`,
    );
    if (res) this.properties.set(res);
  }

  async onSearch() {
    const propertyId = this.propertyIdCtrl.value;
    const customerId = this.customerIdS.customerId();
    if (!propertyId || !customerId) return;

    this.loading.set(true);
    try {
      let params = new HttpParams();
      if (this.fromCtrl.value) params = params.set("from", this.fromCtrl.value);
      if (this.toCtrl.value) params = params.set("to", this.toCtrl.value);

      const url =
        Endpoints.AccountingCoi.NativeCollection.Ledger.propertyEntries(
          propertyId,
          customerId,
        ) + (params.toString() ? "?" + params.toString() : "");

      const res =
        await this.apiResponseS.onGetItem<FinancialLedgerEntryDTO[]>(url);
      let entries = res ?? [];

      if (this.eventTypeCtrl.value !== null) {
        entries = entries.filter(
          (e) => e.eventType === this.eventTypeCtrl.value,
        );
      }

      this.dataSignal.set(entries);
    } finally {
      this.loading.set(false);
    }
  }

  onClear() {
    this.propertyIdCtrl.reset("");
    this.fromCtrl.reset("");
    this.toCtrl.reset("");
    this.eventTypeCtrl.reset(null);
    this.dataSignal.set([]);
  }

  eventTypeLabel(type: EFinancialEventType): string {
    const labels: Record<EFinancialEventType, string> = {
      [EFinancialEventType.EmisionCargo]: "Emision Cargo",
      [EFinancialEventType.CancelacionCargo]: "Cancelacion Cargo",
      [EFinancialEventType.AjusteCargo]: "Ajuste Cargo",
      [EFinancialEventType.CondonacionCargo]: "Condonacion Cargo",
      [EFinancialEventType.RecepcionPago]: "Recepcion Pago",
      [EFinancialEventType.AplicacionPago]: "Aplicacion Pago",
      [EFinancialEventType.CancelacionPago]: "Cancelacion Pago",
      [EFinancialEventType.ReversoPago]: "Reverso Pago",
      [EFinancialEventType.RechazoPago]: "Rechazo Pago",
      [EFinancialEventType.EmisionNotaCredito]: "Nota Credito",
      [EFinancialEventType.AplicacionNotaCredito]: "Aplicacion NC",
      [EFinancialEventType.CancelacionNotaCredito]: "Cancelacion NC",
      [EFinancialEventType.GeneracionRecargo]: "Recargo Mora",
      [EFinancialEventType.CierrePeriodo]: "Cierre Periodo",
    };
    return labels[type] ?? String(type);
  }

  eventTypeClass(type: EFinancialEventType): string {
    if (
      [
        EFinancialEventType.RecepcionPago,
        EFinancialEventType.AplicacionPago,
        EFinancialEventType.EmisionNotaCredito
      ].includes(type)
    ) {
      return "bg-green-100 text-green-800";
    }
    if (
      [
        EFinancialEventType.ReversoPago,
        EFinancialEventType.RechazoPago,
        EFinancialEventType.CancelacionPago
      ].includes(type)
    ) {
      return "bg-red-100 text-red-800";
    }
    if ([EFinancialEventType.CierrePeriodo].includes(type)) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-yellow-100 text-yellow-800";
  }
}

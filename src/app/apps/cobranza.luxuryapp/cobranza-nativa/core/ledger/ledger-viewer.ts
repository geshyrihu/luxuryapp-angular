import { CurrencyPipe, DatePipe } from "@angular/common";
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
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { listOutline } from "ionicons/icons";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { EFinancialEventType } from "../../interfaces/enums";
import { FinancialLedgerEntryDTO } from "../../interfaces/ledger.dto";

@Component({
  selector: "app-ledger-viewer",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    LxCard,
    LxTag,
    DataViewMobile,
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./ledger-viewer.html",
})
export default class LedgerViewer {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  EFinancialEventType = EFinancialEventType;

  properties = signal<{ label: string; value: string }[]>([]);
  propertyIdCtrl = new FormControl<string>("", { nonNullable: true });
  fromCtrl = new FormControl<Date | string | null>(null);
  toCtrl = new FormControl<Date | string | null>(null);
  eventTypeCtrl = new FormControl<number | null>(null);

  dataSignal = signal<FinancialLedgerEntryDTO[]>([]);
  loading = signal(false);

  eventTypeOptions = [
    { label: "Todos", value: null },
    { label: "Emisión Cargo", value: EFinancialEventType.EmisionCargo },
    { label: "Cancelación Cargo", value: EFinancialEventType.CancelacionCargo },
    { label: "Ajuste Cargo", value: EFinancialEventType.AjusteCargo },
    { label: "Condonación Cargo", value: EFinancialEventType.CondonacionCargo },
    { label: "Recepción Pago", value: EFinancialEventType.RecepcionPago },
    { label: "Aplicación Pago", value: EFinancialEventType.AplicacionPago },
    { label: "Cancelación Pago", value: EFinancialEventType.CancelacionPago },
    { label: "Reverso Pago", value: EFinancialEventType.ReversoPago },
    { label: "Nota Crédito", value: EFinancialEventType.EmisionNotaCredito },
    { label: "Cierre Período", value: EFinancialEventType.CierrePeriodo },
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
      Endpoints.SelectItems.properties(customerId),
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
      const from = this.getQueryDate(this.fromCtrl.value);
      const to = this.getQueryDate(this.toCtrl.value);

      if (from) params = params.set("from", from);
      if (to) params = params.set("to", to);

      const url =
        Endpoints.CobranzaCore.Ledger.propertyEntries(propertyId, customerId) +
        (params.toString() ? "?" + params.toString() : "");

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
    this.fromCtrl.reset(null);
    this.toCtrl.reset(null);
    this.eventTypeCtrl.reset(null);
    this.dataSignal.set([]);
  }

  eventTypeLabel(type: EFinancialEventType): string {
    const labels: Record<EFinancialEventType, string> = {
      [EFinancialEventType.EmisionCargo]: "Emisión Cargo",
      [EFinancialEventType.CancelacionCargo]: "Cancelación Cargo",
      [EFinancialEventType.AjusteCargo]: "Ajuste Cargo",
      [EFinancialEventType.CondonacionCargo]: "Condonación Cargo",
      [EFinancialEventType.RecepcionPago]: "Recepción Pago",
      [EFinancialEventType.AplicacionPago]: "Aplicación Pago",
      [EFinancialEventType.CancelacionPago]: "Cancelación Pago",
      [EFinancialEventType.ReversoPago]: "Reverso Pago",
      [EFinancialEventType.RechazoPago]: "Rechazo Pago",
      [EFinancialEventType.EmisionNotaCredito]: "Nota Crédito",
      [EFinancialEventType.AplicacionNotaCredito]: "Aplicación NC",
      [EFinancialEventType.CancelacionNotaCredito]: "Cancelación NC",
      [EFinancialEventType.GeneracionRecargo]: "Recargo Mora",
      [EFinancialEventType.CierrePeriodo]: "Cierre Período",
    };
    return labels[type] ?? String(type);
  }

  eventTypeMeta(type: EFinancialEventType) {
    if (
      [
        EFinancialEventType.RecepcionPago,
        EFinancialEventType.AplicacionPago,
        EFinancialEventType.EmisionNotaCredito,
      ].includes(type)
    ) {
      return { label: this.eventTypeLabel(type), severity: "success" as const };
    }
    if (
      [
        EFinancialEventType.ReversoPago,
        EFinancialEventType.RechazoPago,
        EFinancialEventType.CancelacionPago,
      ].includes(type)
    ) {
      return { label: this.eventTypeLabel(type), severity: "danger" as const };
    }
    if ([EFinancialEventType.CierrePeriodo].includes(type)) {
      return { label: this.eventTypeLabel(type), severity: "info" as const };
    }
    return { label: this.eventTypeLabel(type), severity: "warning" as const };
  }

  private getQueryDate(value: Date | string | null): string | null {
    return this.dateS.getDateFormat(value);
  }
}

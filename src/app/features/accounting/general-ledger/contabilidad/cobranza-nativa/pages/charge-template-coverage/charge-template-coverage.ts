import { CurrencyPipe, NgClass } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  TemplateCoverageDTO,
} from "../../models/template-coverage.dto";
import { ECalculationMethod } from "../../models/enums";

@Component({
  selector: "app-charge-template-coverage",
  imports: [TableModule, PrimeNgCustomCaption, CurrencyPipe, NgClass],
  templateUrl: "./charge-template-coverage.html",
})
export default class ChargeTemplateCoverage {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  scrollHeight = inject(TableScrollHeightService).scrollHeight;
  ECalculationMethod = ECalculationMethod;

  dataSignal = signal<TemplateCoverageDTO[]>([]);

  /** Columnas de periodo únicas ordenadas, extraídas de todos los registros */
  periodColumns = computed(() => {
    const keys = new Map<string, { label: string; year: number; month: number }>();
    for (const row of this.dataSignal()) {
      for (const p of row.periods) {
        const key = `${p.year}-${String(p.month).padStart(2, "0")}`;
        if (!keys.has(key)) keys.set(key, { label: p.label, year: p.year, month: p.month });
      }
    }
    return [...keys.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => ({ key, ...v }));
  });

  /** Mapa precalculado: rowIndex → { periodKey → amount } */
  periodsMap = computed(() => {
    return this.dataSignal().map((row) => {
      const map: Record<string, number> = {};
      for (const p of row.periods) {
        const key = `${p.year}-${String(p.month).padStart(2, "0")}`;
        map[key] = p.amount;
      }
      return map;
    });
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.apiResponseS
      .onGetItem<TemplateCoverageDTO[]>(
        Endpoints.AccountingCoi.NativeCollection.Templates.coverage(customerId),
      )
      .then((res) => this.dataSignal.set(res ?? []));
  }

  methodLabel(method: ECalculationMethod): string {
    return method === ECalculationMethod.Indiviso ? "Indiviso" : "Fijo";
  }

  methodSeverity(method: ECalculationMethod): string {
    return method === ECalculationMethod.Indiviso
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  }
}

import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { ECalculationMethod } from "../../interfaces/enums";
import { TemplateCoverageDTO } from "../../interfaces/template-coverage.dto";

@Component({
  selector: "app-charge-template-coverage",
  imports: [AppIcon, LxTag, TableModule, PrimeNgCustomCaption, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-template-coverage.html",
})
export default class ChargeTemplateCoverage {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  scrollHeight = inject(TableScrollHeightService).scrollHeight;
  ECalculationMethod = ECalculationMethod;

  dataSignal = signal<TemplateCoverageDTO[]>([]);

  periodColumns = computed(() => {
    const keys = new Map<
      string,
      { label: string; year: number; month: number }
    >();
    for (const row of this.dataSignal()) {
      for (const p of row.periods) {
        const key = `${p.year}-${String(p.month).padStart(2, "0")}`;
        if (!keys.has(key)) {
          keys.set(key, { label: p.label, year: p.year, month: p.month });
        }
      }
    }
    return [...keys.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => ({ key, ...v }));
  });

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
        Endpoints.CobranzaCore.Templates.coverage(customerId),
      )
      .then((res) => this.dataSignal.set(res ?? []));
  }

  methodLabel(method: ECalculationMethod): string {
    return method === ECalculationMethod.Indiviso ? "Indiviso" : "Fijo";
  }

  methodSeverity(method: ECalculationMethod): "secondary" | "info" {
    return method === ECalculationMethod.Indiviso ? "secondary" : "info";
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  IReporteFinancieroDto,
  IReporteFinancieroFilaDto,
} from "../interfaces/aspel-budget.interface";
import { reportFilterState } from "../state/financial-report-filter.state";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-reporte-financiero",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./reporte-financiero.html",
})
export class ReporteFinanciero {
  private readonly apiS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  public readonly filterS = reportFilterState;

  readonly loading = signal(false);
  readonly data = signal<IReporteFinancieroDto | null>(null);

  readonly hasData = computed(() => !!this.data());

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      const year = this.filterS.year();
      const mes = this.filterS.mesIdx();
      this.filterS.refreshTick();

      if (customerId && year) {
        void this.loadData(customerId, year, mes + 1);
      }
    });
  }

  async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null);

    const result = await this.apiS.onGetItem<IReporteFinancieroDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.financialReport(
        customerId,
        year,
        mes,
      ),
    );

    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set("Reporte Financiero");
      this.filterS.currentReportContext.set(JSON.stringify(result));
    } else {
      this.data.set(null);
    }

    this.loading.set(false);
  }

  formatNum(value: number): string {
    if (value === 0 || value === null || value === undefined) return "-";
    const formatted = new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
    return value < 0 ? `(${formatted})` : formatted;
  }

  isNeg(value: number): boolean {
    return value < 0;
  }

  isLastCol(index: number, total: number): boolean {
    return index === total - 1;
  }

  isFilaVacia(fila: IReporteFinancieroFilaDto): boolean {
    return fila.valores.every((value) => value === 0);
  }

  trackByIndex(index: number): number {
    return index;
  }
}

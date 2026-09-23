import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import type {
  IReporteFinancieroDto,
  IReporteFinancieroFilaDto,
} from "../../interfaces/aspel-budget.interface";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccountingNumberPipe } from "@shared/pipes/accounting-number.pipe";

@Component({
  selector: "app-reporte-financiero-cliente",
  imports: [AppIcon, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./reporte-financiero-cliente.html",
})
export class ReporteFinancieroClienteComponent {
  private readonly apiS = inject(ApiResponseService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<IReporteFinancieroDto | null>(null);
  readonly hasData = computed(() => !!this.data());

  constructor() {
    effect(() => {
      const cid = this.customerId();
      const yr = this.year();
      const m = this.mes();
      if (cid && yr && m) void this.loadData(cid, yr, m);
    });
  }

  private async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    const result = await this.apiS.onGetItem<IReporteFinancieroDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.financialReport(
        customerId,
        year,
        mes,
      ),
    );
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  isLastCol(index: number, total: number): boolean {
    return index === total - 1;
  }
  isFilaVacia(fila: IReporteFinancieroFilaDto): boolean {
    return fila.valores.every((v) => v === 0);
  }
  trackByIndex(index: number): number {
    return index;
  }
}

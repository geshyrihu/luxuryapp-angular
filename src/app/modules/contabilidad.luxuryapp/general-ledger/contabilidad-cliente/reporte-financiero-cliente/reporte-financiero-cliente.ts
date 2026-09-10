import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type {
  IReporteFinancieroDto,
  IReporteFinancieroFilaDto,
} from "../../contabilidad-online/interfaces/aspel-budget.interface";
import { ContabilidadClienteService } from "../contabilidad-cliente.service";

@Component({
  selector: "app-reporte-financiero-cliente",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./reporte-financiero-cliente.html",
})
export class ReporteFinancieroClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

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
    const result = await this.svc.getReporteFinanciero(customerId, year, mes);
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  formatNum(value: number): string {
    if (value === 0 || value === null || value === undefined) return "-";
    const f = new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
    return value < 0 ? `(${f})` : f;
  }

  isNeg(value: number): boolean {
    return value < 0;
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

import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import type { IFlujoCajaDto } from "../../contabilidad-online/interfaces/aspel-budget.interface";
import { AccountingNumberPipe } from "../../contabilidad-online/pipes/accounting-number.pipe";
import { ContabilidadClienteService } from "../contabilidad-cliente.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-flujo-efectivo-cliente",
  imports: [AppIcon, TableModule, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./flujo-efectivo-cliente.html",
})
export class FlujoEfectivoClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly month = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<IFlujoCajaDto | null>(null);

  readonly columnas = computed(() => {
    const cols = this.data()?.columnas ?? [];
    if (cols.length === 0) return [];
    const maxIdx = Math.min(cols.length - 2, this.month() - 1);
    return [...cols.slice(0, maxIdx + 1), cols[cols.length - 1]];
  });

  readonly grupos = computed(() => {
    const grps = this.data()?.grupos ?? [];
    if (grps.length === 0) return [];
    const maxIdx = Math.min(11, this.month() - 1);
    return grps.map((g) => ({
      ...g,
      filas: g.filas.map((f) => ({
        ...f,
        montos: [
          ...f.montos.slice(0, maxIdx + 1),
          f.montos[f.montos.length - 1],
        ],
      })),
    }));
  });

  constructor() {
    effect(() => {
      const cid = this.customerId();
      const yr = this.year();
      if (cid && yr) void this.loadData(cid, yr);
    });
  }

  private async loadData(customerId: string, year: number) {
    this.loading.set(true);
    const result = await this.svc.getFlujoCaja(customerId, year);
    this.data.set(result ?? null);
    this.loading.set(false);
  }
}

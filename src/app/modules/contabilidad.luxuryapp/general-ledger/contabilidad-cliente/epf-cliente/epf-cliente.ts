import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { IEpfDTO } from "../../contabilidad-online/interfaces/aspel-budget.interface";
import { AccountingNumberPipe } from "../../contabilidad-online/pipes/accounting-number.pipe";
import { ContabilidadClienteService } from "../contabilidad-cliente.service";

@Component({
  selector: "app-epf-cliente",
  imports: [AppIcon, LxSkeleton, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./epf-cliente.html",
})
export class EpfClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<IEpfDTO | null>(null);

  readonly epfActivo = computed(() => this.data()?.activo ?? []);
  readonly epfPasivo = computed(() => this.data()?.pasivo ?? []);
  readonly epfCapital = computed(() => this.data()?.capital ?? []);
  readonly totalActivo = computed(() => this.data()?.totalActivo ?? 0);
  readonly totalPasivo = computed(() => this.data()?.totalPasivo ?? 0);
  readonly totalCapital = computed(() => this.data()?.totalCapital ?? 0);
  readonly totalPasivoCapital = computed(
    () => this.data()?.totalPasivoCapital ?? 0,
  );

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
    this.data.set(null);
    const result = await this.svc.getEpf(customerId, year, mes);
    if (result) this.data.set(result);
    this.loading.set(false);
  }
}

import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import type { IFlujoCajaDto } from '../../../contabilidad-online/models/aspel-budget.interface';
import { AccountingNumberPipe } from '../../../contabilidad-online/pipes/accounting-number.pipe';
import { ContabilidadClienteService } from '../../services/contabilidad-cliente.service';

@Component({
  selector: 'app-flujo-efectivo-cliente',
  imports: [CommonModule, TableModule, AccountingNumberPipe],
  templateUrl: './flujo-efectivo-cliente.html',
})
export class FlujoEfectivoClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<IFlujoCajaDto | null>(null);

  readonly meses = computed(() => this.data()?.meses ?? []);
  readonly totalIngresos = computed(() => this.meses().reduce((s, m) => s + m.ingresos, 0));
  readonly totalGastos = computed(() => this.meses().reduce((s, m) => s + m.gastos, 0));
  readonly totalFlujoNeto = computed(() => this.meses().reduce((s, m) => s + m.flujoNeto, 0));

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

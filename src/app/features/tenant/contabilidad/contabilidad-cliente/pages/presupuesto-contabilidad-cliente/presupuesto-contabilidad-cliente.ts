import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import type {
  PresupuestoContabilidadFila,
  PresupuestoContabilidadResponse,
} from 'src/app/features/tenant/contabilidad/cobranza-online/models/presupuesto-contabilidad.model';
import { ContabilidadClienteService } from '../../services/contabilidad-cliente.service';

@Component({
  selector: 'app-presupuesto-contabilidad-cliente',
  imports: [CommonModule],
  templateUrl: './presupuesto-contabilidad-cliente.html',
})
export class PresupuestoContabilidadClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<PresupuestoContabilidadResponse | null>(null);

  readonly acumLabel = computed(() => {
    const names = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return `ACUMULADO ENE-${names[this.mes() - 1]}`;
  });

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
    const result = await this.svc.getPresupuestoContabilidad(customerId, year, mes);
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  isFilaVacia(fila: PresupuestoContabilidadFila): boolean {
    if (fila.nivel === 4) return false;
    return fila.pstoMensual === 0 && fila.acumuladoAnual === 0 && fila.presupAnual === 0 && fila.montosEjercidos.every(v => v === 0);
  }

  rowClass(fila: PresupuestoContabilidadFila): string {
    switch (fila.nivel) {
      case 1: return 'rf-row-section';
      case 2: return 'rf-row-group';
      case 4: return 'rf-row-total';
      default: return '';
    }
  }

  descClass(fila: PresupuestoContabilidadFila): string {
    if (fila.nivel === 3) return 'rf-td-descripcion--item';
    return 'rf-td-descripcion';
  }

  numClass(fila: PresupuestoContabilidadFila): string {
    return fila.nivel === 4 ? 'rf-td-number--total' : 'rf-td-number';
  }

  fmt(v: number): string {
    if (v === 0) return '-';
    const f = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(Math.abs(v));
    return v < 0 ? `(${f})` : f;
  }

  isNeg(v: number): boolean { return v < 0; }
  trackByIndex(i: number): number { return i; }
  trackByFila(_i: number, fila: PresupuestoContabilidadFila): string { return fila.numeroCuenta + fila.descripcion; }
}


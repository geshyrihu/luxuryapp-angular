import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import type {
  IBaseAccountDto,
  ICedulaExtraordinariaDto,
  ICuentaMayorDto,
} from '../../../contabilidad-online/models/aspel-budget.interface';
import { AccountingNumberPipe } from '../../../contabilidad-online/pipes/accounting-number.pipe';
import { ContabilidadClienteService } from '../../services/contabilidad-cliente.service';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTH_KEYS: (keyof IBaseAccountDto)[] = [
  'montoEnero', 'montoFebrero', 'montoMarzo', 'montoAbril',
  'montoMayo', 'montoJunio', 'montoJulio', 'montoAgosto',
  'montoSeptiembre', 'montoOctubre', 'montoNoviembre', 'montoDiciembre',
];

type ClientRow = { tipo: 'header' | 'item' | 'total'; descripcion: string; mes1?: number; mes2?: number; mes3?: number; acum?: number };

@Component({
  selector: 'app-cedula-extraordinaria-cliente',
  imports: [CommonModule, TableModule, SkeletonModule, AccountingNumberPipe],
  templateUrl: './cedula-extraordinaria-cliente.html',
})
export class CedulaExtraordinariaClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<ICedulaExtraordinariaDto | null>(null);

  readonly mesIdx = computed(() => this.mes() - 1);

  readonly monthHeaders = computed(() => {
    const idx = this.mesIdx();
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return [MONTH_NAMES[wr(idx - 2)], MONTH_NAMES[wr(idx - 1)], MONTH_NAMES[idx]];
  });

  readonly mainRows = computed<ClientRow[]>(() => {
    const d = this.data();
    const mes = this.mesIdx();
    if (!d) return [];

    const rows: ClientRow[] = [];
    const ingresos = (d.recaudadoMejoras ?? []).filter(r => this.hasVisibleValues(r));
    const gastos = (d.gastosMejoras ?? []).filter(r => this.hasVisibleValues(r));

    if (ingresos.length > 0) {
      rows.push({ tipo: 'header', descripcion: 'RECAUDADO MEJORAS' });
      rows.push(...ingresos.map(r => this.toRow(r, mes)));
      rows.push(this.toTotalRow(d.totalRecaudadoMejoras, mes));
    }
    if (gastos.length > 0) {
      rows.push({ tipo: 'header', descripcion: 'GASTOS MEJORAS Y EVENTOS' });
      rows.push(...gastos.map(r => this.toRow(r, mes)));
      rows.push(this.toTotalRow(d.totalGastosMejoras, mes));
    }
    return rows;
  });

  readonly extraRows = computed<ClientRow[]>(() => {
    const d = this.data();
    const mes = this.mesIdx();
    if (!d) return [];

    const gastos = (d.gastosExtraordinarios ?? []).filter(r => this.hasVisibleValues(r));
    if (!gastos.length) return [];

    return [
      { tipo: 'header', descripcion: 'GASTOS EXTRAORDINARIOS' },
      ...gastos.map(r => this.toRow(r, mes)),
      this.toTotalRow(d.totalGastosExtraordinarios, mes),
    ];
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
    const result = await this.svc.getCedulaExtraordinaria(customerId, year, mes);
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  private toRow(account: ICuentaMayorDto, mes: number): ClientRow {
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return { tipo: 'item', descripcion: account.descripcion, mes1: this.monto(account, wr(mes - 2)), mes2: this.monto(account, wr(mes - 1)), mes3: this.monto(account, mes), acum: account.acumuladoAnual };
  }

  private toTotalRow(account: ICuentaMayorDto, mes: number): ClientRow {
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return { tipo: 'total', descripcion: account.descripcion, mes1: this.monto(account, wr(mes - 2)), mes2: this.monto(account, wr(mes - 1)), mes3: this.monto(account, mes), acum: account.acumuladoAnual };
  }

  private monto(account: IBaseAccountDto, idx: number): number {
    return (account[MONTH_KEYS[idx % 12]] as number) ?? 0;
  }

  private hasVisibleValues(account: IBaseAccountDto): boolean {
    return MONTH_KEYS.some(k => (account[k] as number) !== 0) || account.acumuladoAnual !== 0;
  }
}

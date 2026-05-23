import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import type {
  IAnalisisCobranzaOnlineDto,
  ICobranzaOnlineAnalysisCondominoDto,
} from '../../../contabilidad-online/models/aspel-budget.interface';
import { AccountingNumberPipe } from '../../../contabilidad-online/pipes/accounting-number.pipe';
import { ContabilidadClienteService } from '../../services/contabilidad-cliente.service';

@Component({
  selector: 'app-analisis-cobranza-cliente',
  imports: [CommonModule, ChartModule, SelectModule, TableModule, TagModule, AccountingNumberPipe],
  templateUrl: './analisis-cobranza-cliente.html',
})
export class AnalisisCobranzaClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly selectedClassification = signal('TODAS');
  readonly data = signal<IAnalisisCobranzaOnlineDto | null>(null);

  readonly classificationOptions = ['TODAS', 'COBRANZA JUDICIAL', 'MOROSOS', 'DEUDA CORRIENTE', 'SIN ADEUDO', 'ANTICIPOS'];

  readonly chartData = computed(() => {
    const d = this.data();
    if (!d) return null;

    if (d.cobranzaPerfecta > 0) {
      return {
        labels: ['Morosos', 'Deuda Corriente', 'Cobrado'],
        datasets: [{ data: [d.totalMorosos, d.totalDeudaCorriente, d.totalCobrado], backgroundColor: ['#b91c1c', '#2563eb', '#166534'], borderWidth: 0 }],
      };
    }

    return {
      labels: ['Cobranza Judicial', 'Morosos', 'Deuda Corriente'],
      datasets: [{ data: [d.totalJudicial, d.totalMorosos, d.totalDeudaCorriente], backgroundColor: ['#b91c1c', '#d97706', '#2563eb'], borderWidth: 0 }],
    };
  });

  readonly chartOptions = { plugins: { legend: { position: 'bottom' } }, responsive: true, maintainAspectRatio: false };

  readonly filteredRows = computed<ICobranzaOnlineAnalysisCondominoDto[]>(() => {
    const d = this.data();
    if (!d) return [];

    switch (this.selectedClassification()) {
      case 'COBRANZA JUDICIAL': return d.cobranzaJudicial;
      case 'MOROSOS': return d.morosos;
      case 'DEUDA CORRIENTE': return d.deudaCorriente;
      case 'SIN ADEUDO': return d.sinAdeudo;
      case 'ANTICIPOS': return d.anticipos;
      default: return [...d.cobranzaJudicial, ...d.morosos, ...d.deudaCorriente, ...d.sinAdeudo, ...d.anticipos];
    }
  });

  constructor() {
    effect(() => {
      const cid = this.customerId();
      const yr = this.year();
      const m = this.mes();
      if (cid && yr && m) void this.loadData(cid, yr, m);
    });
  }

  pct(value: number, total: number): string {
    if (!total) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  }

  getSeverity(clasificacion: string) {
    switch (clasificacion) {
      case 'COBRANZA JUDICIAL': return 'danger';
      case 'MOROSOS': return 'warn';
      case 'DEUDA CORRIENTE': return 'info';
      case 'SIN ADEUDO': return 'success';
      case 'ANTICIPOS': return 'secondary';
      default: return 'secondary';
    }
  }

  private async loadData(customerId: string, year: number, month: number) {
    const day = new Date(year, month, 0).getDate();
    this.loading.set(true);
    const result = await this.svc.getAnalisisCobranza(customerId, year, month, day);
    this.data.set(result ?? null);
    this.loading.set(false);
  }
}

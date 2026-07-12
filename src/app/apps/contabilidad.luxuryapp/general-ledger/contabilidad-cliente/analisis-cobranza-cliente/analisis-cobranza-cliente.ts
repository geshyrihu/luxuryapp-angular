import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChartWrapper } from '@ui/web/charts/chart-wrapper';
import { CustomInputSelectSignal } from '@ui/inputs/web/custom-input-select-signal';
import type {
  IAnalisisCobranzaOnlineDto,
  ICobranzaOnlineAnalysisCondominoDto,
} from '../../contabilidad-online/interfaces/aspel-budget.interface';
import { AccountingNumberPipe } from '../../contabilidad-online/pipes/accounting-number.pipe';
import { ContabilidadClienteService } from '../contabilidad-cliente.service';

@Component({
  selector: 'app-analisis-cobranza-cliente',
  imports: [CommonModule, FormsModule, ChartWrapper, CustomInputSelectSignal, TableModule, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
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

  readonly classificationOptions = [
    { label: 'TODAS', value: 'TODAS' },
    { label: 'COBRANZA JUDICIAL', value: 'COBRANZA JUDICIAL' },
    { label: 'MOROSOS', value: 'MOROSOS' },
    { label: 'DEUDA CORRIENTE', value: 'DEUDA CORRIENTE' },
    { label: 'SIN ADEUDO', value: 'SIN ADEUDO' },
  ];

  readonly chartData = computed(() => {
    const analysis = this.data();
    if (!analysis) return null;

    return {
      labels: ['Morosos', 'Deuda Corriente', 'Cobrado'],
      datasets: [
        {
          data: [
            analysis.totalMorosos,
            analysis.totalDeudaCorriente,
            analysis.totalCobrado,
          ],
          backgroundColor: ['#dc2626', '#f59e0b', '#22c55e'],
          hoverBackgroundColor: ['#dc2626', '#f59e0b', '#22c55e'],
          borderWidth: 0,
        },
      ],
    };
  });

  readonly chartOptions = { plugins: { legend: { position: 'bottom' } }, responsive: true, maintainAspectRatio: false };

  readonly filteredRows = computed<ICobranzaOnlineAnalysisCondominoDto[]>(() => {
    const analysis = this.data();
    if (!analysis) return [];

    switch (this.selectedClassification()) {
      case 'COBRANZA JUDICIAL': return analysis.cobranzaJudicial;
      case 'MOROSOS': return analysis.morosos;
      case 'DEUDA CORRIENTE': return analysis.deudaCorriente;
      case 'SIN ADEUDO': return analysis.sinAdeudo;
      default: return [...analysis.cobranzaJudicial, ...analysis.morosos, ...analysis.deudaCorriente];
    }
  });

  readonly uniqueConcepts = computed(() => {
    const rows = this.filteredRows();
    const concepts = new Set<string>();
    for (const row of rows) {
      if (row.desglose) {
        for (const item of row.desglose) {
          concepts.add(item.concepto);
        }
      }
    }
    return Array.from(concepts).sort();
  });

  get summaryRows() {
    return [...this.filteredRows()].sort((a, b) => b.saldo - a.saldo);
  }

  getConceptBalance(row: ICobranzaOnlineAnalysisCondominoDto, concepto: string) {
    if (!row.desglose) return 0;
    const item = row.desglose.find(d => d.concepto === concepto);
    return item ? item.saldoFinal : 0;
  }

  getTotalConceptBalance(concepto: string) {
    let total = 0;
    const rows = this.filteredRows();
    for (const row of rows) {
      total += this.getConceptBalance(row, concepto);
    }
    return total;
  }

  get totalFilteredSaldo() {
    return this.filteredRows().reduce((acc, curr) => acc + curr.saldo, 0);
  }

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
      case 'MOROSOS': return 'danger';
      case 'DEUDA CORRIENTE': return 'warning';
      case 'SIN ADEUDO': return 'success';
      case 'ANTICIPOS': return 'info';
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

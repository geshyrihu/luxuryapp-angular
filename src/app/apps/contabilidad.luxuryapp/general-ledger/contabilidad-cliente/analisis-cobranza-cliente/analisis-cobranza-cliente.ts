import { CommonModule, formatCurrency } from '@angular/common';
import { Component, computed, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { ChartWrapper } from '@ui/web/charts/chart-wrapper';
import { CustomInputSelectSignal } from '@ui/inputs/web/custom-input-select-signal';
import { AccountingNumberPipe } from '../../contabilidad-online/pipes/accounting-number.pipe';
import { ContabilidadClienteService } from '../contabilidad-cliente.service';
import type { CobranzaOnlineDashboardResponse } from "src/app/apps/cobranza.luxuryapp/cobranza-online/interfaces/cobranza-online-dashboard.model";
import type { CobranzaOnlineAnalysisResponse } from "src/app/apps/cobranza.luxuryapp/cobranza-online/interfaces/cobranza-online-analysis.model";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import { AppBreakdownList, type BreakdownItem } from "@ui/shared/breakdown-list/breakdown-list";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { DialogHandlerService, DialogSize } from "src/app/core/services/dialog-handler.service";
import { CobranzaOnlineComposicionReportesModal } from "src/app/apps/cobranza.luxuryapp/cobranza-online/analysis/cobranza-online-composicion-reportes-modal";
import { AppRankedList } from "@ui/shared/ranked-list/ranked-list";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: 'app-analisis-cobranza-cliente',
  imports: [
    CommonModule, 
    FormsModule, 
    ChartWrapper, 
    CustomInputSelectSignal, 
    TableModule, 
    AccountingNumberPipe,
    AppStatCard,
    AppBreakdownList,
    ButtonModule,
    AppRankedList,
    AppIcon,
    MobileListItem,
    DataViewMobile
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analisis-cobranza-cliente.html',
})
export class AnalisisCobranzaClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);
  private readonly dialogS = inject(DialogHandlerService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly dashboardData = signal<CobranzaOnlineDashboardResponse | null>(null);
  readonly analysisData = signal<CobranzaOnlineAnalysisResponse | null>(null);

  readonly selectedClassification = signal('TODAS');

  readonly classificationOptions = [
    "TODAS",
    "COBRANZA EXTRAJUDICIAL",
    "MOROSOS",
    "DEUDA CORRIENTE",
    "SIN ADEUDO",
    "ANTICIPOS",
  ];

  constructor() {
    effect(() => {
      const cid = this.customerId();
      const yr = this.year();
      const m = this.mes();
      if (cid && yr && m) void this.loadData(cid, yr, m);
    }, { allowSignalWrites: true });
  }

  async onOpenComposicionReportes() {
    try {
      await this.dialogS.openDialog(
        CobranzaOnlineComposicionReportesModal,
        {},
        "Cómo se compone cada reporte",
        DialogSize.lg,
      );
    } catch (error) {
      console.error("Error opening composition dialog", error);
    }
  }

  private async loadData(customerId: string, year: number, month: number) {
    const day = new Date(year, month, 0).getDate();
    this.loading.set(true);
    try {
      const [dashboard, analysis] = await Promise.all([
        this.svc.getDashboardCobranza(customerId, year, month, day),
        this.svc.getDashboardAnalysis(customerId, year, month, day)
      ]);
      this.dashboardData.set(dashboard ?? null);
      this.analysisData.set(analysis ?? null);
    } catch (error) {
      console.error(error);
      this.dashboardData.set(null);
      this.analysisData.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  readonly formatMoneda = (val: number) => {
    return formatCurrency(val, "en-US", "$", "USD", "1.0-0");
  };

  private token(key: string, fallback: string): string {
    if (typeof document === "undefined") {
      return fallback;
    }
    return (
      getComputedStyle(document.documentElement).getPropertyValue(key).trim() ||
      fallback
    );
  }

  // --- KPIs ---
  readonly kpis = computed(() => {
    const dash = this.dashboardData();
    if (!dash) return [];

    const m = dash.currentCharges?.maintenance;
    const e = dash.currentCharges?.extraordinary;
    const r = dash.currentCharges?.restaurant;

    const cards = [];

    if (m && m.total > 0) {
      cards.push({
        label: "Mantenimiento Neto",
        value: m.total,
        subtitle: 'Abonado: ' + this.formatMoneda(m.collected) + ' · Faltante: ' + this.formatMoneda(m.pending),
        icon: "material-symbols-light:location-city",
        iconColor: "var(--ds-info)",
        iconBg: "var(--ds-info-light)"
      });
    }

    if (e && e.total > 0) {
      cards.push({
        label: "Cuotas Extraordinarias",
        value: e.total,
        subtitle: 'Abonado: ' + this.formatMoneda(e.collected) + ' · Faltante: ' + this.formatMoneda(e.pending),
        icon: "material-symbols-light:add-card",
        iconColor: "var(--ds-warning)",
        iconBg: "var(--ds-warning-light)"
      });
    }

    if (r && r.total > 0) {
      cards.push({
        label: "Cuotas de Restaurante",
        value: r.total,
        subtitle: 'Abonado: ' + this.formatMoneda(r.collected) + ' · Faltante: ' + this.formatMoneda(r.pending),
        icon: "material-symbols-light:restaurant",
        iconColor: "var(--ds-success)",
        iconBg: "var(--ds-success-light)"
      });
    }

    return cards;
  });

  // --- Breakdown Lists ---
  readonly cuotaPromedioSubtitulo = computed(() => {
    const d = this.analysisData();
    if (!d?.totalCondominios) return "";
    const promedio = d.cuotaMttoVigente / d.totalCondominios;
    return `Promedio ${this.formatMoneda(promedio)} por condómino`;
  });

  readonly filasAnalisisMensual = computed<BreakdownItem[]>(() => {
    const d = this.analysisData();
    if (!d) return [];

    return [
      {
        label: "Morosos",
        value: d.totalMorosos,
        color: "var(--ds-danger)",
        description: "2+ cuotas vencidas de mtto o 1+ de extraordinaria",
      },
      {
        label: "Deuda corriente",
        value: d.totalDeudaCorriente,
        color: "var(--ds-info)",
        description: "Debe sin alcanzar los umbrales de moroso",
      },
      {
        label: "Cobrado",
        value: d.totalCobrado,
        color: "var(--ds-success)",
        description: "Residual: perfecta - morosos - corriente",
      },
      { label: "Cobranza perfecta", value: d.cobranzaPerfecta, isTotal: true },
    ];
  });

  readonly filasCobranzaMes = computed<BreakdownItem[]>(() => {
    const d = this.analysisData();
    if (!d) return [];

    const filas: BreakdownItem[] = [
      {
        label: "Cobrado",
        value: d.cobradoMes,
        color: "var(--ds-success)",
        description: (() => {
          const parts = [`Mtto ${this.formatMoneda(d.cobradoMttoMes)}`];
          if (d.cobradoExtraordinariaMes) parts.push(`extraordinaria ${this.formatMoneda(d.cobradoExtraordinariaMes)}`);
          if (d.cobradoRestaurantMes) parts.push(`restaurante ${this.formatMoneda(d.cobradoRestaurantMes)}`);
          return parts.length > 1 ? parts.join(' - ') : "Abonos aplicados en el mes";
        })(),
      },
      {
        label: "Faltante por cobrar",
        value: d.faltanteMes,
        color: "var(--ds-warning)",
        description: "Cobranza perfecta - cobrado",
      },
      { label: "Cobranza perfecta", value: d.cobranzaPerfecta, isTotal: true },
    ];

    return filas;
  });

  readonly filasDeudaCondominos = computed<BreakdownItem[]>(() => {
    const d = this.analysisData();
    if (!d) return [];

    return [
      {
        label: "Cobranza judicial",
        value: d.totalJudicial,
        color: "var(--ds-danger)",
        description: "Más de 5 cuotas vencidas de mtto o 5+ de extraordinaria o restaurante",
      },
      {
        label: "Morosos",
        value: d.totalMorosos,
        color: "var(--ds-warning)",
        description: "2+ cuotas vencidas de mtto o 1+ de ext. o restaurante",
      },
      {
        label: "Deuda corriente",
        value: d.totalDeudaCorriente,
        color: "var(--ds-info)",
        description: "Debe sin alcanzar los umbrales de moroso",
      },
      { label: "Total deuda", value: d.totalDeuda, isTotal: true },
    ];
  });

  readonly chartData = computed(() => {
    const analysis = this.analysisData();
    if (!analysis) return null;

    const danger = this.token("--ds-danger", "#c0392b");
    const info = this.token("--ds-info", "#2980b9");
    const success = this.token("--ds-success", "#27ae60");
    const warning = this.token("--ds-warning", "#f39c12");

    const morosos = analysis.totalMorosos ?? 0;
    const corriente = analysis.totalDeudaCorriente ?? 0;
    const cobrado = analysis.totalCobrado ?? 0;
    const judicial = analysis.totalJudicial ?? 0;

    const hayDeudaActiva = morosos > 0 || corriente > 0 || cobrado > 0 || judicial > 0;
    if (!hayDeudaActiva) return null;

    if ((analysis.cobranzaPerfecta ?? 0) > 0) {
      const datos = [
        { label: "MOROSOS", value: morosos, color: danger },
        { label: "DEUDA CORRIENTE", value: corriente, color: info },
        { label: "COBRADO", value: cobrado, color: success },
      ].filter((d) => d.value > 0);

      return {
        labels: datos.map((d) => d.label),
        datasets: [{
          data: datos.map((d) => d.value),
          backgroundColor: datos.map((d) => d.color),
          hoverBackgroundColor: datos.map((d) => d.color),
          borderWidth: 2,
          borderColor: "transparent",
        }],
      };
    }

    const datos = [
      { label: "COBRANZA JUDICIAL", value: judicial, color: danger },
      { label: "MOROSOS", value: morosos, color: warning },
      { label: "DEUDA CORRIENTE", value: corriente, color: info },
    ].filter((d) => d.value > 0);

    return {
      labels: datos.map((d) => d.label),
      datasets: [{
        data: datos.map((d) => d.value),
        backgroundColor: datos.map((d) => d.color),
        hoverBackgroundColor: datos.map((d) => d.color),
        borderWidth: 2,
        borderColor: "transparent",
      }],
    };
  });

  readonly filteredRows = computed(() => {
    const analysis = this.analysisData();
    if (!analysis) return [];

    switch (this.selectedClassification()) {
      case "COBRANZA EXTRAJUDICIAL":
        return analysis.cobranzaJudicial;
      case "MOROSOS":
        return analysis.morosos;
      case "DEUDA CORRIENTE":
        return analysis.deudaCorriente;
      case "SIN ADEUDO":
        return analysis.sinAdeudo;
      case "ANTICIPOS":
        return analysis.anticipos;
      default:
        return [
          ...analysis.cobranzaJudicial,
          ...analysis.morosos,
          ...analysis.deudaCorriente,
          ...analysis.sinAdeudo,
          ...analysis.anticipos,
        ];
    }
  });

  getSeverity(clasificacion: string) {
    switch (clasificacion) {
      case "COBRANZA EXTRAJUDICIAL": return "danger";
      case "MOROSOS": return "warn";
      case "DEUDA CORRIENTE": return "info";
      case "SIN ADEUDO": return "success";
      case "ANTICIPOS": return "secondary";
      default: return "secondary";
    }
  }

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

  getConceptBalance(row: any, concepto: string) {
    if (!row.desglose) return 0;
    const item = row.desglose.find((d: any) => d.concepto === concepto);
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
    return this.filteredRows().reduce((acc: number, curr: any) => acc + curr.saldo, 0);
  }

  // --- Towers ---
  readonly towers = computed(() => this.dashboardData()?.towers ?? []);
  readonly totalTowers = computed(() => {
    const data = this.towers();
    if (!data.length) return null;

    return data.reduce(
      (acc, curr) => ({
        departmentCount: acc.departmentCount + curr.departmentCount,
        totalBalance: acc.totalBalance + curr.totalBalance,
        maintenanceBalance: acc.maintenanceBalance + curr.maintenanceBalance,
        extraordinaryBalance: acc.extraordinaryBalance + curr.extraordinaryBalance,
        finesBalance: (acc as any).finesBalance + (curr as any).finesBalance,
      }),
      {
        departmentCount: 0,
        totalBalance: 0,
        maintenanceBalance: 0,
        extraordinaryBalance: 0,
        finesBalance: 0,
      }
    );
  });

  // --- Morosidad ---
  readonly morosos = computed(() => {
    return this.analysisData()?.morosos
      .map((a: any) => ({ id: a.numeroCuenta, title: this.cleanName(a.condomino), amount: a.saldo })) ?? [];
  });
  readonly totalMorosos = computed(() => {
    return this.analysisData()?.totalMorosos ?? 0;
  });

  readonly judicial = computed(() => {
    return this.analysisData()?.cobranzaJudicial
      .map((a: any) => ({ id: a.numeroCuenta, title: this.cleanName(a.condomino), amount: a.saldo })) ?? [];
  });
  readonly totalJudicial = computed(() => {
    return this.analysisData()?.totalJudicial ?? 0;
  });

  readonly totalDeudaCorriente = computed(() => {
    return this.analysisData()?.totalDeudaCorriente ?? 0;
  });

  readonly cuentasEnCartera = computed(() => {
    return (
      (this.analysisData()?.cobranzaJudicial?.length ?? 0) +
      (this.analysisData()?.morosos?.length ?? 0) +
      (this.analysisData()?.deudaCorriente?.length ?? 0)
    );
  });

  readonly totalCartera = computed(() => {
    return this.totalJudicial() + this.totalMorosos() + this.totalDeudaCorriente();
  });

  // --- Anticipos ---
  private readonly anticipos = computed(() => this.analysisData()?.anticipos ?? []);

  readonly anticiposItems = computed(() => {
    return [...this.anticipos()]
      .sort((a, b) => a.saldo - b.saldo)
      .map((item) => ({
        id: item.numeroCuenta,
        title: this.cleanName(item.condomino),
        amount: Math.abs(item.saldo),
      }));
  });

  readonly totalAFavor = computed(() => Math.abs(this.analysisData()?.totalAnticipos ?? 0));
  readonly condominosConSaldo = computed(() => this.anticipos().length);
  readonly promedioAFavor = computed(() => {
    const count = this.condominosConSaldo();
    return count === 0 ? 0 : this.totalAFavor() / count;
  });

  private sumaPorSubcuenta(sufijo: string): number {
    let total = 0;
    for (const condomino of this.anticipos()) {
      for (const fila of condomino.desglose ?? []) {
        if (fila.cuenta?.endsWith(sufijo) && fila.saldoFinal < 0) {
          total += Math.abs(fila.saldoFinal);
        }
      }
    }
    return total;
  }

  readonly totalMtto = computed(() => this.sumaPorSubcuenta("-001"));
  readonly totalExtraordinaria = computed(() => this.sumaPorSubcuenta("-003"));
  readonly subtituloMtto = computed(() => {
    const extraordinaria = this.totalExtraordinaria();
    return extraordinaria > 0
      ? `Extraordinaria: ${this.formatMoneda(extraordinaria)}`
      : "Sin saldos a favor en extraordinaria";
  });

  readonly hasCustomer = computed(() => !!this.customerId());

  cleanName(name: string): string {
    if (!name) return '';
    return name.replace(/^\d+-\d+-\d+(-\d+)?\s*-?\s*/, '');
  }

}

import { CommonModule, formatCurrency } from "@angular/common";
import { Component, computed, effect, inject } from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { reportFilterState } from "../state/financial-report-filter.state";
import { CobranzaOnlineStoreService } from "src/app/apps/cobranza.luxuryapp/cobranza-online/state/cobranza-online-store.service";
import { cobranzaOnlineFilterState } from "src/app/apps/cobranza.luxuryapp/cobranza-online/state/cobranza-online-filter.state";
import { CobranzaOnlineMorosidad } from "src/app/apps/cobranza.luxuryapp/cobranza-online/morosidad/cobranza-online-morosidad";
import { CobranzaOnlineTowers } from "src/app/apps/cobranza.luxuryapp/cobranza-online/towers/cobranza-online-towers";
import { CobranzaOnlineAdvances } from "src/app/apps/cobranza.luxuryapp/cobranza-online/advances/cobranza-online-advances";
import { CobranzaOnlineAnalysis } from "src/app/apps/cobranza.luxuryapp/cobranza-online/analysis/cobranza-online-analysis";
import { SkeletonModule } from "primeng/skeleton";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";

@Component({
  selector: "app-analisis-cobranza",
  imports: [
    CommonModule,
    CobranzaOnlineMorosidad,
    CobranzaOnlineTowers,
    CobranzaOnlineAdvances,
    CobranzaOnlineAnalysis,
    SkeletonModule,
    AppStatCard
  ],
  providers: [CobranzaOnlineStoreService],
  templateUrl: "./analisis-cobranza.html",
})
export class AnalisisCobranza {
  private readonly customerIdS = inject(CustomerIdService);
  public readonly store = inject(CobranzaOnlineStoreService);
  public readonly filterS = reportFilterState;

  constructor() {
    effect(
      () => {
        const customerId = this.customerIdS.customerId();
        const year = this.filterS.year();
        const month = this.filterS.mesIdx() + 1;
        this.filterS.refreshTick();

        if (!customerId) {
          return;
        }

        const day = new Date(year, month, 0).getDate();

        cobranzaOnlineFilterState.year.set(year);
        cobranzaOnlineFilterState.month.set(month);
        cobranzaOnlineFilterState.day.set(day);
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      const data = this.store.dashboardData();
      if (data) {
        this.filterS.currentReportName.set("Dashboard Unificado de Cobranza");
        this.filterS.currentReportContext.set(JSON.stringify(data));
      }
    });
  }

  readonly formatMoneda = (val: number) => {
    return formatCurrency(val, "en-US", "$", "USD", "1.0-0");
  };

  readonly kpis = computed(() => {
    const dash = this.store.dashboardData();
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
        icon: "mdi:home-city-outline",
        iconColor: "var(--ds-info)",
        iconBg: "var(--ds-info-light)"
      });
    }

    if (e && e.total > 0) {
      cards.push({
        label: "Cuotas Extraordinarias",
        value: e.total,
        subtitle: 'Abonado: ' + this.formatMoneda(e.collected) + ' · Faltante: ' + this.formatMoneda(e.pending),
        icon: "mdi:cash-plus",
        iconColor: "var(--ds-warning)",
        iconBg: "var(--ds-warning-light)"
      });
    }

    if (r && r.total > 0) {
      cards.push({
        label: "Cuotas de Restaurante",
        value: r.total,
        subtitle: 'Abonado: ' + this.formatMoneda(r.collected) + ' · Faltante: ' + this.formatMoneda(r.pending),
        icon: "mdi:silverware-fork-knife",
        iconColor: "var(--ds-success)",
        iconBg: "var(--ds-success-light)"
      });
    }

    return cards;
  });
}

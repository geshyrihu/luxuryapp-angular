import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import type { TabItem } from "@ui/base/tabs.base";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CobranzaOnlineStoreService } from "@collections.luxuryapp/online-collections/state/cobranza-online-store.service";
import { AiAgentContabilidadComponent } from "./ai-agent-contabilidad/ai-agent-contabilidad";
import { AiAgentExplicadorComponent } from "./ai-agent-explicador/ai-agent-explicador";
import { AiAgentComponent } from "./ai-agent/ai-agent";
import { AnalisisCobranza } from "./collection-analysis/analisis-cobranza";
import { BancosInversionesComponent } from "./banks-investments/bancos-inversiones";
import { CedulaExtraordinaria } from "./extraordinary-statement/cedula-extraordinaria";
import { CedulaPresupuestal } from "./budget-statement/cedula-presupuestal";
import { EstadoPosicionFinanciera } from "./financial-position-statement/estado-posicion-financiera";
import { EstadoResultadosV2 } from "./income-statement-v2/estado-resultados-v2";
import { EstadoResultados } from "./income-statement/estado-resultados";
import { FlujoEfectivo } from "./cash-flow/flujo-efectivo";
import { FondoReservaComponent } from "./reserve-fund/fondo-reserva";
import { PresupuestoContabilidad } from "./accounting-budget/presupuesto-contabilidad";
import { ProyectosAprobadosComponent } from "./approved-projects/proyectos-aprobados";
import { ReporteFinanciero } from "./financial-report/reporte-financiero";
import { FinancialReportFilterStore } from "./state/financial-report-filter.store.service";

const REPORT_META = [
  {
    title: "Estado de Posición Financiera",
    description:
      "Lectura de activo, pasivo y capital al corte del periodo seleccionado.",
  },
  {
    title: "Estado de Resultados",
    description:
      "Resumen de ingresos, gastos y resultado del periodo con enfoque operativo.",
  },
  {
    title: "Estado de Resultados V2",
    description:
      "Variante ajustada para clasificaciones irregulares y lectura reforzada de ingresos y gastos.",
  },
  {
    title: "Códula Extraordinaria",
    description:
      "Seguimiento de recaudado, mejoras, eventos y gastos extraordinarios del periodo.",
  },
  {
    title: "Presupuesto vs Resultado",
    description:
      "Comparativo entre presupuesto aprobado, ejercido acumulado y saldo restante.",
  },
  {
    title: "Reporte Financiero",
    description:
      "Vista resumida mensual de ingresos, gastos generales, otros resultados y fondo para mejoras.",
  },
  {
    title: "Flujo de Efectivo",
    description:
      "Comportamiento mensual de ingresos, gastos, flujo neto y saldo acumulado.",
  },
  {
    title: "Dashboard de Cobranza",
    description:
      "Vista ejecutiva de cobranza con corte, KPIs, top deudores y detalle operativo por condómino.",
  },
  {
    title: "Presupuesto Contabilidad",
    description:
      "Ejercido mensual vs presupuesto aprobado por cuenta de gastos generales (excluye 605/606/607).",
  },
  {
    title: "Bancos e Inversiones",
    description: "Saldo acumulado al mes de corte de bancos e inversiones.",
  },
  {
    title: "Proyectos Aprobados",
    description:
      "Seguimiento de presupuesto y ejecución de proyectos aprobados.",
  },
] as const;

@Component({
  selector: "app-financial-reports-wrapper",
  imports: [
    FormsModule,
    LxTabs,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    EstadoPosicionFinanciera,
    EstadoResultados,
    EstadoResultadosV2,
    CedulaExtraordinaria,
    CedulaPresupuestal,
    ReporteFinanciero,
    FlujoEfectivo,
    WebButtonLabel,
    AnalisisCobranza,
    PresupuestoContabilidad,
    BancosInversionesComponent,
    FondoReservaComponent,
    ProyectosAprobadosComponent,
    AiAgentComponent,
    AiAgentContabilidadComponent,
    AiAgentExplicadorComponent,
  ],
  providers: [CobranzaOnlineStoreService, FinancialReportFilterStore],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./financial-reports-wrapper.html",
})
export default class FinancialReportsWrapper {
  public filterS = inject(FinancialReportFilterStore);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly apiS = inject(ApiResponseService);

  reportIndex = signal<number>(0);
  isPreparing = signal(false);

  reportTabs = signal<TabItem[]>([
    { id: "0", label: "EPF" },
    { id: "1", label: "E. Resultados" },
    { id: "2", label: "E. Resultados V2" },
    { id: "3", label: "C. Extraordinaria" },
    { id: "4", label: "P vs R" },
    { id: "5", label: "R. Financiero" },
    { id: "6", label: "Flujo Efectivo" },
    { id: "7", label: "Dashboard Cobranza" },
    { id: "8", label: "Presupuesto" },
    { id: "9", label: "Bancos e Inv." },
    { id: "10", label: "Fondo Reserva" },
    { id: "11", label: "Proyectos" },
  ]);

  readonly activeReportTitle = computed(
    () => REPORT_META[this.reportIndex()]?.title ?? "Estados Financieros",
  );
  readonly activeReportDescription = computed(
    () =>
      REPORT_META[this.reportIndex()]?.description ??
      "Consulta operativa del módulo de contabilidad online.",
  );

  readonly clienteUrl = computed(() => {
    const cid = this.customerIdS.customerId();
    const yr = this.filterS.year();
    const mes = this.filterS.mesIdx() + 1;
    if (!cid || !yr) return null;
    return `/publico/contabilidad-cliente/${cid}/${yr}/${mes}`;
  });

  refreshReports() {
    this.filterS.refreshTick.update((value) => value + 1);
  }

  openPdf() {
    const cid = this.customerIdS.customerId();
    if (!cid || this.isPreparing()) return;

    this.isPreparing.set(true);

    void this.apiS
      .onPreviewPdf(
        Endpoints.ContabilidadOnline.FinancialStatements.estadosFinancierosPdf(
          cid,
          this.filterS.year(),
          this.filterS.mesIdx() + 1,
        ),
      )
      .finally(() => this.isPreparing.set(false));
  }

  openClienteView() {
    const url = this.clienteUrl();
    if (url) window.open(url, "_blank");
  }

  onTabChange(tab: TabItem) {
    this.reportIndex.set(Number(tab.id));
  }
}



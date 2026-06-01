import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TabsModule } from "primeng/tabs";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { AiAgentContabilidadOnlineComponent } from "../components/ai-agent-contabilidad-online/ai-agent-contabilidad-online";
import { AiAgentExplicadorContabilidadOnlineComponent } from "../components/ai-agent-explicador-contabilidad-online/ai-agent-explicador-contabilidad-online";
import { AiAgentComponent } from "../components/ai-agent/ai-agent";
import { reportFilterState } from "../state/financial-report-filter.state";
import { AnalisisCobranza } from "./analisis-cobranza/analisis-cobranza";
import { CedulaExtraordinaria } from "./cedula-extraordinaria/cedula-extraordinaria";
import { CedulaPresupuestal } from "./cedula-presupuestal/cedula-presupuestal";
import { EstadoPosicionFinanciera } from "./estado-posicion-financiera/estado-posicion-financiera";
import { EstadoResultadosV2 } from "./estado-resultados-v2/estado-resultados-v2";
import { EstadoResultados } from "./estado-resultados/estado-resultados";
import { FlujoEfectivo } from "./flujo-efectivo/flujo-efectivo";
import { ReporteFinanciero } from "./reporte-financiero/reporte-financiero";
import { PresupuestoContabilidad } from "./presupuesto-contabilidad/presupuesto-contabilidad";
import { BancosInversionesComponent } from "./bancos-inversiones/bancos-inversiones";

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
    title: "Cédula Extraordinaria",
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
    title: "Análisis de Cobranza",
    description:
      "Corte de cobranza, clasificación de saldos y lectura operativa por condómino.",
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
] as const;

@Component({
  selector: "app-financial-reports-wrapper",
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    EstadoPosicionFinanciera,
    EstadoResultados,
    EstadoResultadosV2,
    CedulaExtraordinaria,
    CedulaPresupuestal,
    ReporteFinanciero,
    FlujoEfectivo,
    CustomButton,
    AnalisisCobranza,
    PresupuestoContabilidad,
    BancosInversionesComponent,
    AiAgentComponent,
    AiAgentContabilidadOnlineComponent,
    AiAgentExplicadorContabilidadOnlineComponent,
  ],
  templateUrl: "./financial-reports-wrapper.html",
})
export default class FinancialReportsWrapper {
  public filterS = reportFilterState;
  private readonly customerIdS = inject(CustomerIdService);

  reportIndex = signal<number>(0);

  readonly customerName = computed(
    () => this.customerIdS.customerName() || "Cliente activo",
  );
  readonly customerLogo = computed(
    () =>
      this.customerIdS.customerPhotoPath() ||
      "assets/images/default-avatar.png",
  );
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

  openClienteView() {
    const url = this.clienteUrl();
    if (url) window.open(url, '_blank');
  }

  onTabChange(value: number) {
    this.reportIndex.set(value);
  }
}

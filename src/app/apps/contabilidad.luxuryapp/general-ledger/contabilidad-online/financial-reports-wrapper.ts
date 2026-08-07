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
import { CobranzaOnlineResumen } from "src/app/apps/cobranza.luxuryapp/cobranza-online/resumen/cobranza-online-resumen";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { AiAgentContabilidadOnlineComponent } from "./ai-agent-contabilidad-online/ai-agent-contabilidad-online";
import { AiAgentExplicadorContabilidadOnlineComponent } from "./ai-agent-explicador-contabilidad-online/ai-agent-explicador-contabilidad-online";
import { AiAgentComponent } from "./ai-agent/ai-agent";
import { BancosInversionesComponent } from "./bancos-inversiones/bancos-inversiones";
import { CedulaExtraordinaria } from "./cedula-extraordinaria/cedula-extraordinaria";
import { CedulaPresupuestal } from "./cedula-presupuestal/cedula-presupuestal";
import { EstadoPosicionFinanciera } from "./estado-posicion-financiera/estado-posicion-financiera";
import { EstadoResultadosV2 } from "./estado-resultados-v2/estado-resultados-v2";
import { EstadoResultados } from "./estado-resultados/estado-resultados";
import { FlujoEfectivo } from "./flujo-efectivo/flujo-efectivo";
import { FondoReservaComponent } from "./fondo-reserva/fondo-reserva";
import { PresupuestoContabilidad } from "./presupuesto-contabilidad/presupuesto-contabilidad";
import { ProyectosAprobadosComponent } from "./proyectos-aprobados/proyectos-aprobados";
import { ReporteFinanciero } from "./reporte-financiero/reporte-financiero";
import { reportFilterState } from "./state/financial-report-filter.state";

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
    CobranzaOnlineResumen,
    PresupuestoContabilidad,
    BancosInversionesComponent,
    FondoReservaComponent,
    ProyectosAprobadosComponent,
    AiAgentComponent,
    AiAgentContabilidadOnlineComponent,
    AiAgentExplicadorContabilidadOnlineComponent,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./financial-reports-wrapper.html",
})
export default class FinancialReportsWrapper {
  public filterS = reportFilterState;
  private readonly customerIdS = inject(CustomerIdService);

  reportIndex = signal<number>(0);
  printMode = signal(false);
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

  readonly periodLabel = computed(() => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const m = months[this.filterS.mesIdx()] ?? "";
    const y = this.filterS.year() ?? "";
    return `${m} ${y}`.trim().toUpperCase();
  });

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

  printReport() {
    if (this.isPreparing()) return;
    this.isPreparing.set(true);
    this.printMode.set(true);
    // Esperar a que Angular renderice el bloque @if antes de empezar polling
    setTimeout(() => this.waitAndPrint(), 800);
  }

  private waitAndPrint(): void {
    const MAX_MS = 18_000;
    const POLL_MS = 600;
    const start = Date.now();

    const check = () => {
      const section = document.querySelector(".print-all-reports");
      // Si el section aun no existe, reintentar
      if (!section) {
        setTimeout(check, POLL_MS);
        return;
      }

      // Detectar cualquier indicador de carga activo
      const stillLoading = !!(
        section.querySelector(".pi-spin") ||
        section.querySelector("p-skeleton") ||
        section.querySelector(".p-skeleton")
      );

      if (!stillLoading || Date.now() - start >= MAX_MS) {
        // Todos los datos cargaron (o se agoto el tiempo maximo)
        this.isPreparing.set(false);
        setTimeout(() => {
          window.print();
          window.addEventListener(
            "afterprint",
            () => {
              this.printMode.set(false);
            },
            { once: true },
          );
        }, 150);
      } else {
        setTimeout(check, POLL_MS);
      }
    };

    setTimeout(check, POLL_MS);
  }

  openClienteView() {
    const url = this.clienteUrl();
    if (url) window.open(url, "_blank");
  }

  onTabChange(tab: TabItem) {
    this.reportIndex.set(Number(tab.id));
  }
}

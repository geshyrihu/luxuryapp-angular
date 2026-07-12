import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import type { TabItem } from "@ui/base/tabs.base";
import { map } from "rxjs/operators";
import { AnalisisCobranzaClienteComponent } from "./analisis-cobranza-cliente/analisis-cobranza-cliente";
import { BancosInversionesClienteComponent } from "./bancos-inversiones-cliente/bancos-inversiones-cliente";
import { CedulaExtraordinariaClienteComponent } from "./cedula-extraordinaria-cliente/cedula-extraordinaria-cliente";
import { CedulaPresupuestalClienteComponent } from "./cedula-presupuestal-cliente/cedula-presupuestal-cliente";
import { EpfClienteComponent } from "./epf-cliente/epf-cliente";
import { EstadoResultadosClienteComponent } from "./estado-resultados-cliente/estado-resultados-cliente";
import { EstadoResultadosV2ClienteComponent } from "./estado-resultados-v2-cliente/estado-resultados-v2-cliente";
import { FlujoEfectivoClienteComponent } from "./flujo-efectivo-cliente/flujo-efectivo-cliente";
import { FondoReservaClienteComponent } from "./fondo-reserva-cliente/fondo-reserva-cliente";
import { PresupuestoContabilidadClienteComponent } from "./presupuesto-contabilidad-cliente/presupuesto-contabilidad-cliente";
import { ProyectosAprobadosClienteComponent } from "./proyectos-aprobados-cliente/proyectos-aprobados-cliente";
import { ReporteFinancieroClienteComponent } from "./reporte-financiero-cliente/reporte-financiero-cliente";

const MONTH_NAMES = [
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

@Component({
  selector: "app-contabilidad-cliente-wrapper",
  imports: [
    LxTabs,
    EpfClienteComponent,
    EstadoResultadosClienteComponent,
    EstadoResultadosV2ClienteComponent,
    CedulaExtraordinariaClienteComponent,
    CedulaPresupuestalClienteComponent,
    ReporteFinancieroClienteComponent,
    FlujoEfectivoClienteComponent,
    AnalisisCobranzaClienteComponent,
    PresupuestoContabilidadClienteComponent,
    BancosInversionesClienteComponent,
    FondoReservaClienteComponent,
    ProyectosAprobadosClienteComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./contabilidad-cliente-wrapper.html",
})
export default class ContabilidadClienteWrapper {
  private readonly route = inject(ActivatedRoute);

  readonly customerId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get("customerId") ?? "")),
    { initialValue: "" },
  );

  readonly year = toSignal(
    this.route.paramMap.pipe(map((p) => +(p.get("anio") ?? 0))),
    { initialValue: 0 },
  );

  readonly mes = toSignal(
    this.route.paramMap.pipe(map((p) => +(p.get("mes") ?? 0))),
    { initialValue: 0 },
  );

  readonly periodo = computed(() => {
    const yr = this.year();
    const m = this.mes();
    if (!yr || !m) return "";
    return `${MONTH_NAMES[m - 1]} ${yr}`;
  });

  readonly tabIndex = signal(0);

  reportTabs = signal<TabItem[]>([
    { id: "0", label: "EPF" },
    { id: "1", label: "E. Resultados" },
    { id: "2", label: "E. Resultados V2" },
    { id: "3", label: "C. Extraordinaria" },
    { id: "4", label: "P vs R" },
    { id: "5", label: "R. Financiero" },
    { id: "6", label: "Flujo Efectivo" },
    { id: "7", label: "Cobranza" },
    { id: "8", label: "Presupuesto" },
    { id: "9", label: "Bancos Inversiones" },
    { id: "10", label: "Fondo Reserva" },
    { id: "11", label: "Proyectos" },
  ]);

  onTabChange(tab: TabItem) {
    this.tabIndex.set(Number(tab.id));
  }
}

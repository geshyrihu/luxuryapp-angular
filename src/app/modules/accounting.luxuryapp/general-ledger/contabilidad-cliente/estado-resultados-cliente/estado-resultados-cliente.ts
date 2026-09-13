import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type {
  IBaseAccountDto,
  IFinancialStatementDto,
} from "../../contabilidad-online/interfaces/aspel-budget.interface";
import { AccountingNumberPipe } from "../../contabilidad-online/pipes/accounting-number.pipe";
import { ContabilidadClienteService } from "../contabilidad-cliente.service";

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

const MONTH_KEYS: (keyof IBaseAccountDto)[] = [
  "montoEnero",
  "montoFebrero",
  "montoMarzo",
  "montoAbril",
  "montoMayo",
  "montoJunio",
  "montoJulio",
  "montoAgosto",
  "montoSeptiembre",
  "montoOctubre",
  "montoNoviembre",
  "montoDiciembre",
];

type ClientRow =
  | { tipo: "header"; descripcion: string }
  | {
      tipo: "item" | "total-ingresos" | "total-gastos" | "diferencia";
      descripcion: string;
      mes1: number;
      mes2: number;
      mes3: number;
      acum: number;
    };

@Component({
  selector: "app-estado-resultados-cliente",
  imports: [AppIcon, TableModule, LxSkeleton, AccountingNumberPipe, DataViewMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./estado-resultados-cliente.html",
})
export class EstadoResultadosClienteComponent {
  private readonly svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  readonly loading = signal(false);
  readonly data = signal<IFinancialStatementDto | null>(null);

  readonly mesIdx = computed(() => this.mes() - 1);

  readonly monthHeaders = computed(() => {
    const idx = this.mesIdx();
    const wr = (i: number) => ((i % 12) + 12) % 12;
    return [
      MONTH_NAMES[wr(idx - 2)],
      MONTH_NAMES[wr(idx - 1)],
      MONTH_NAMES[wr(idx)],
    ];
  });

  readonly rows = computed<ClientRow[]>(() => {
    const d = this.data();
    const mes = this.mesIdx();
    if (!d) return [];

    const result: ClientRow[] = [];
    let totIng = [0, 0, 0, 0];
    let totGas = [0, 0, 0, 0];
    const ingRows: ClientRow[] = [];
    const gasRows: ClientRow[] = [];

    for (const clas of d.clasificaciones) {
      const esIngreso = clas.naturaleza?.toUpperCase() === "ACREEDORA";
      const destino = esIngreso ? ingRows : gasRows;

      for (const mayor of clas.cuentasMayor ?? []) {
        const wr = (i: number) => ((i % 12) + 12) % 12;
        const m1 = this.monto(mayor, wr(mes - 2));
        const m2 = this.monto(mayor, wr(mes - 1));
        const m3 = this.monto(mayor, mes);
        const acum = mayor.acumuladoAnual;

        if (!this.hasVisibleValues(m1, m2, m3, acum)) continue;

        destino.push({
          tipo: "item",
          descripcion: mayor.descripcion,
          mes1: m1,
          mes2: m2,
          mes3: m3,
          acum,
        });
        if (esIngreso) {
          totIng[0] += m1;
          totIng[1] += m2;
          totIng[2] += m3;
          totIng[3] += acum;
        } else {
          totGas[0] += m1;
          totGas[1] += m2;
          totGas[2] += m3;
          totGas[3] += acum;
        }
      }
    }

    result.push({ tipo: "header", descripcion: "INGRESOS" });
    result.push(...ingRows);
    result.push({
      tipo: "total-ingresos",
      descripcion: "TOTAL DE INGRESOS",
      mes1: totIng[0],
      mes2: totIng[1],
      mes3: totIng[2],
      acum: totIng[3],
    });
    result.push({ tipo: "header", descripcion: "GASTOS GENERALES" });
    result.push(...gasRows);
    result.push({
      tipo: "total-gastos",
      descripcion: "TOTAL DE GASTOS GENERALES",
      mes1: totGas[0],
      mes2: totGas[1],
      mes3: totGas[2],
      acum: totGas[3],
    });
    result.push({
      tipo: "diferencia",
      descripcion: "RESULTADO DEL PERIODO",
      mes1: totIng[0] - totGas[0],
      mes2: totIng[1] - totGas[1],
      mes3: totIng[2] - totGas[2],
      acum: totIng[3] - totGas[3],
    });

    return result;
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
    const result = await this.svc.getEstadoResultados(customerId, year, mes);
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  private monto(a: IBaseAccountDto, idx: number): number {
    return (a[MONTH_KEYS[idx % 12]] as number) ?? 0;
  }

  private hasVisibleValues(
    m1: number,
    m2: number,
    m3: number,
    acum: number,
  ): boolean {
    return m1 !== 0 || m2 !== 0 || m3 !== 0 || acum !== 0;
  }
}

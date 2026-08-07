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
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type {
  IBaseAccountDto,
  ICuentaMayorDto,
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
      tipo: "group" | "item" | "total-ingresos" | "total-gastos" | "diferencia";
      descripcion: string;
      mes1: number;
      mes2: number;
      mes3: number;
      acum: number;
    };

@Component({
  selector: "app-estado-resultados-v2-cliente",
  imports: [AppIcon, TableModule, LxSkeleton, AccountingNumberPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./estado-resultados-v2-cliente.html",
})
export class EstadoResultadosV2ClienteComponent {
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
    const ingRows: ClientRow[] = [];
    const gasRows: ClientRow[] = [];
    let totIng = [0, 0, 0, 0];
    let totGas = [0, 0, 0, 0];
    const wr = (i: number) => ((i % 12) + 12) % 12;

    for (const clas of d.clasificaciones) {
      const esIngreso = clas.naturaleza?.toUpperCase() === "ACREEDORA";
      const destino = esIngreso ? ingRows : gasRows;

      for (const mayor of clas.cuentasMayor ?? []) {
        if (
          mayor.numeroCuenta === "400-000-000" ||
          mayor.numeroCuenta === "600-000-000"
        )
          continue;

        if (esIngreso && mayor.numeroCuenta === "401-000-000") {
          const groupRow = this.createRow("group", mayor, wr, mes);
          destino.push(groupRow);
          for (const child of this.flatten401Children(mayor, wr, mes)) {
            destino.push(child);
            totIng = this.addTotals(totIng, child);
          }
          continue;
        }

        const row = this.createRow("item", mayor, wr, mes);
        if (!this.hasVisibleValues(row)) continue;

        destino.push(row);
        if (esIngreso) totIng = this.addTotals(totIng, row);
        else totGas = this.addTotals(totGas, row);
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
    const result = await this.svc.getEstadoResultadosV2(customerId, year, mes);
    this.data.set(result ?? null);
    this.loading.set(false);
  }

  private flatten401Children(
    mayor: ICuentaMayorDto,
    wr: (i: number) => number,
    mes: number,
  ): ClientRow[] {
    const rows: ClientRow[] = [];
    for (const sub of mayor.subcuentas ?? []) {
      if (sub.cuentasDetalle?.length) {
        for (const det of sub.cuentasDetalle) {
          const row = this.createRow("item", det, wr, mes);
          if (this.hasVisibleValues(row)) rows.push(row);
        }
      } else {
        const row = this.createRow("item", sub, wr, mes);
        if (this.hasVisibleValues(row)) rows.push(row);
      }
    }
    return rows;
  }

  private createRow(
    tipo: ClientRow["tipo"],
    account: IBaseAccountDto,
    wr: (i: number) => number,
    mes: number,
  ): ClientRow {
    return {
      tipo,
      descripcion: account.descripcion,
      mes1: this.monto(account, wr(mes - 2)),
      mes2: this.monto(account, wr(mes - 1)),
      mes3: this.monto(account, mes),
      acum: account.acumuladoAnual,
    } as ClientRow;
  }

  private addTotals(totals: number[], row: ClientRow): number[] {
    if (row.tipo === "header") return totals;
    return [
      totals[0] + row.mes1,
      totals[1] + row.mes2,
      totals[2] + row.mes3,
      totals[3] + row.acum,
    ];
  }

  private hasVisibleValues(row: ClientRow): boolean {
    if (row.tipo === "header") return true;
    return row.mes1 !== 0 || row.mes2 !== 0 || row.mes3 !== 0 || row.acum !== 0;
  }

  private monto(a: IBaseAccountDto, idx: number): number {
    return (a[MONTH_KEYS[idx % 12]] as number) ?? 0;
  }
}

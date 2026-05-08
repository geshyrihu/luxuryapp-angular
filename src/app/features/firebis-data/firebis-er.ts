import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { ReporteFinancieroDto } from "./firebis-dtos";
import { FirebisFiltersService } from "./firebis-filters.service";

// === Tipos internos ===
interface ErRow {
  num_Cta: string;
  nombre: string;
  meses: number[]; // valor[0..11] = importe del mes 1..12
  acumulado: number; // suma de meses 1..mesCierre
}

const MESES_LABELS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const CARGO_KEYS = [
  "cargo01",
  "cargo02",
  "cargo03",
  "cargo04",
  "cargo05",
  "cargo06",
  "cargo07",
  "cargo08",
  "cargo09",
  "cargo10",
  "cargo11",
  "cargo12",
] as const;

const ABONO_KEYS = [
  "abono01",
  "abono02",
  "abono03",
  "abono04",
  "abono05",
  "abono06",
  "abono07",
  "abono08",
  "abono09",
  "abono10",
  "abono11",
  "abono12",
] as const;

/** Importe mensual de una cuenta de INGRESO (naturaleza crédito): Abono - Cargo del mes */
function mesIngreso(row: ReporteFinancieroDto, mesIdx: number): number {
  return (
    ((row as any)[ABONO_KEYS[mesIdx]] ?? 0) -
    ((row as any)[CARGO_KEYS[mesIdx]] ?? 0)
  );
}

/** Importe mensual de una cuenta de GASTO (naturaleza débito): Cargo - Abono del mes */
function mesGasto(row: ReporteFinancieroDto, mesIdx: number): number {
  return (
    ((row as any)[CARGO_KEYS[mesIdx]] ?? 0) -
    ((row as any)[ABONO_KEYS[mesIdx]] ?? 0)
  );
}

@Component({
  selector: "app-firebis-er",
  imports: [CommonModule],
  template: `
    <div
      class="card p-0 border-none shadow-sm bg-white rounded-xl overflow-hidden"
    >
      <!-- Header de Info Acumulada -->
      <div
        class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between"
      >
        <div class="flex items-center ">
          <i class="pi pi-info-circle text-blue-500"></i>
          <span
            class="text-xs font-bold text-gray-400 uppercase tracking-widest"
          >
            Estado de Resultados Acumulado a {{ mesLabel() }}
            {{ filters.ejercicio() }}
          </span>
        </div>
        <div
          class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-tighter"
        >
          Naturaleza Contable: Devengado
        </div>
      </div>

      @if (rawData().length > 0) {
        <div class="overflow-x-auto">
          <table class="w-full border-collapse" style="min-width: 1100px">
            <!-- ═══ ENCABEZADO ═══ -->
            <thead class="bg-white sticky top-0 z-10">
              <tr>
                <th
                  class="py-4 px-6 text-left font-bold uppercase tracking-wider text-[11px] text-gray-500 sticky left-0 bg-white z-20 border-b-2 border-gray-100"
                >
                  Concepto / Rubro
                </th>
                @for (m of mesesCierre(); track m) {
                  <th
                    class="py-4 px-3 text-right font-bold uppercase tracking-wider text-[11px] text-gray-500 min-w-[75px] border-b-2 border-gray-100"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ MESES_LABELS[m - 1] }}
                  </th>
                }
                <th
                  class="py-4 px-6 text-right font-bold uppercase tracking-wider text-[11px] text-white min-w-[110px] bg-slate-800 border-b-2 border-slate-900"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  ACUMULADO
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-50">
              <!-- ═══ SECCIÓN INGRESOS ═══ -->
              <tr>
                <td colspan="100" class="px-6 py-3 bg-emerald-50/40">
                  <div class="flex items-center ">
                    <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    <span
                      class="font-bold text-xs text-emerald-700 uppercase tracking-widest"
                      >Ingresos Operativos</span
                    >
                  </div>
                </td>
              </tr>
              @for (fila of ingresosRows(); track fila.num_Cta) {
                <tr class="hover:bg-blue-50/30 transition-colors group">
                  <td
                    class="px-6 py-3 text-gray-700 sticky left-0 z-10 bg-white text-sm font-medium border-l-4 border-transparent group-hover:border-primary"
                  >
                    <span
                      class="text-gray-400 mr-2 font-mono text-[10px] bg-gray-50 px-1 py-0.5 rounded"
                      >{{ fila.num_Cta }}</span
                    >
                    {{ fila.nombre }}
                  </td>
                  @for (m of mesesCierre(); track m) {
                    <td
                      class="text-right px-3 py-3 font-medium text-sm tabular-nums"
                      [class]="
                        fila.meses[m - 1] < 0
                          ? 'text-rose-600'
                          : 'text-gray-600'
                      "
                      style="font-family: 'Segoe UI', sans-serif;"
                    >
                      {{ fila.meses[m - 1] | number: "1.0-0" }}
                    </td>
                  }
                  <td
                    class="text-right px-6 py-3 font-bold text-sm text-gray-900 bg-gray-50/50"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ fila.acumulado | number: "1.0-0" }}
                  </td>
                </tr>
              }
              <!-- TOTAL INGRESOS -->
              <tr class="bg-emerald-50/20 border-t-2 border-emerald-100">
                <td class="px-6 py-4 font-bold text-gray-800 text-sm uppercase">
                  Total Ingresos
                </td>
                @for (m of mesesCierre(); track m) {
                  <td
                    class="text-right px-3 py-4 font-bold text-sm text-emerald-700"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ totalIngresosMes()[m - 1] | number: "1.0-0" }}
                  </td>
                }
                <td
                  class="text-right px-6 py-4 font-black text-sm text-emerald-800 bg-emerald-100/40"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ totalIngresosAcumulado() | number: "1.0-0" }}
                </td>
              </tr>

              <!-- ═══ SECCIÓN GASTOS ═══ -->
              <tr>
                <td colspan="100" class="px-6 py-3 bg-amber-50/40 mt-4">
                  <div class="flex items-center ">
                    <div class="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                    <span
                      class="font-bold text-xs text-amber-700 uppercase tracking-widest"
                      >Gastos de Operación / Mantenimiento</span
                    >
                  </div>
                </td>
              </tr>
              @for (fila of gastosRows(); track fila.num_Cta) {
                <tr class="hover:bg-blue-50/30 transition-colors group">
                  <td
                    class="px-6 py-3 text-gray-700 sticky left-0 z-10 bg-white text-sm font-medium border-l-4 border-transparent group-hover:border-primary"
                  >
                    <span
                      class="text-gray-400 mr-2 font-mono text-[10px] bg-gray-50 px-1 py-0.5 rounded"
                      >{{ fila.num_Cta }}</span
                    >
                    {{ fila.nombre }}
                  </td>
                  @for (m of mesesCierre(); track m) {
                    <td
                      class="text-right px-3 py-3 font-medium text-sm tabular-nums text-gray-600"
                      style="font-family: 'Segoe UI', sans-serif;"
                    >
                      {{ fila.meses[m - 1] | number: "1.0-0" }}
                    </td>
                  }
                  <td
                    class="text-right px-6 py-3 font-bold text-sm text-gray-900 bg-gray-50/50"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ fila.acumulado | number: "1.0-0" }}
                  </td>
                </tr>
              }
              <!-- TOTAL GASTOS -->
              <tr class="bg-amber-50/20 border-t-2 border-amber-100">
                <td
                  class="px-6 py-4 font-bold text-gray-800 text-sm uppercase tracking-tight"
                >
                  Total Egresos / Gastos
                </td>
                @for (m of mesesCierre(); track m) {
                  <td
                    class="text-right px-3 py-4 font-bold text-sm text-amber-700"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ totalGastosMes()[m - 1] | number: "1.0-0" }}
                  </td>
                }
                <td
                  class="text-right px-6 py-4 font-black text-sm text-amber-800 bg-amber-100/40"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ totalGastosAcumulado() | number: "1.0-0" }}
                </td>
              </tr>

              <!-- ═══ UTILIDAD ═══ -->
              <tr class="bg-blue-600 shadow-lg relative z-20 overflow-hidden">
                <td
                  class="px-6 py-5 font-black text-white text-base uppercase tracking-widest relative z-10"
                >
                  Excedente / Defecto (Utilidad)
                </td>
                @for (m of mesesCierre(); track m) {
                  <td
                    class="text-right px-3 py-5 font-black text-white text-base"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ utilidadMes()[m - 1] | number: "1.0-0" }}
                  </td>
                }
                <td
                  class="text-right px-6 py-5 font-black text-white text-lg bg-blue-800/80"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ utilidadAcumulado() | number: "1.0-0" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      } @else {
        <div class="p-12 text-center">
          <i class="pi pi-file-excel text-5xl text-gray-200 mb-4 block"></i>
          <span class="text-gray-400 font-medium"
            >No hay datos procesados para el Estado de Resultados.</span
          >
        </div>
      }
    </div>

    <style>
      :host {
        display: block;
      }
      .tabular-nums {
        font-variant-numeric: tabular-nums;
      }
    </style>
  `,
})
export class FirebisEr {
  private dataService = inject(FirebisDataService);
  public filters = inject(FirebisFiltersService);

  public MESES_LABELS = MESES_LABELS;

  // Signal con la data bruta
  public rawData = signal<ReporteFinancieroDto[]>([]);

  // computed: meses que se muestran (1..mesCierre)
  public mesesCierre = computed(() => {
    const arr = [];
    for (let i = 1; i <= this.filters.mes(); i++) arr.push(i);
    return arr;
  });

  public mesLabel = computed(() => MESES_LABELS[this.filters.mes() - 1]);

  // computed: IngresosRows
  public ingresosRows = computed(() => {
    const data = this.rawData().filter(
      (r) => r.cta_Papa === "INGRESOS" || r.num_Cta.startsWith("4"),
    );
    return data.map((r) => this.mapToRow(r, mesIngreso));
  });

  // computed: GastosRows
  public gastosRows = computed(() => {
    const data = this.rawData().filter(
      (r) =>
        r.cta_Papa === "EGRESOS" ||
        r.cta_Papa === "GASTOS" ||
        r.num_Cta.startsWith("5") ||
        r.num_Cta.startsWith("6"),
    );
    return data.map((r) => this.mapToRow(r, mesGasto));
  });

  // Aux mapping
  private mapToRow(
    r: ReporteFinancieroDto,
    calcFn: (row: ReporteFinancieroDto, idx: number) => number,
  ): ErRow {
    const mesesVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) =>
      calcFn(r, idx),
    );
    // suma solo hasta mes de corte
    let suma = 0;
    for (let i = 0; i < this.filters.mes(); i++) suma += mesesVal[i];

    return {
      num_Cta: r.num_Cta,
      nombre: r.nombre,
      meses: mesesVal,
      acumulado: suma,
    };
  }

  // TOTALES
  public totalIngresosMes = computed(() => {
    const totals = new Array(12).fill(0);
    this.ingresosRows().forEach((row) => {
      row.meses.forEach((val, i) => (totals[i] += val));
    });
    return totals;
  });

  public totalIngresosAcumulado = computed(() =>
    this.ingresosRows().reduce((acc, row) => acc + row.acumulado, 0),
  );

  public totalGastosMes = computed(() => {
    const totals = new Array(12).fill(0);
    this.gastosRows().forEach((row) => {
      row.meses.forEach((val, i) => (totals[i] += val));
    });
    return totals;
  });

  public totalGastosAcumulado = computed(() =>
    this.gastosRows().reduce((acc, row) => acc + row.acumulado, 0),
  );

  public utilidadMes = computed(() => {
    const res = new Array(12).fill(0);
    const ing = this.totalIngresosMes();
    const gas = this.totalGastosMes();
    for (let i = 0; i < 12; i++) res[i] = ing[i] - gas[i];
    return res;
  });

  public utilidadAcumulado = computed(
    () => this.totalIngresosAcumulado() - this.totalGastosAcumulado(),
  );

  constructor() {
    // Reaccionar a cambios en filtros
    effect(
      () => {
        // En este reporte usamos Contabilidad por defecto
        const db = DatabaseType.Contabilidad;
        const ej = this.filters.ejercicio();
        this.loadData(db, ej);
      },
      { allowSignalWrites: true },
    );
  }

  private async loadData(db: DatabaseType, ej: number) {
    this.rawData.set([]);
    try {
      const result = await this.dataService.getReporteFinanciero(db, ej);
      this.rawData.set(result || []);
    } catch (e) {
      console.error("Error ER:", e);
    }
  }
}

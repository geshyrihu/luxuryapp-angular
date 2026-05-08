import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { ReporteFinancieroDto } from "./firebis-dtos";
import { FirebisFiltersService } from "./firebis-filters.service";

interface ErRow {
  num_Cta: string;
  nombre: string;
  meses: number[];
  acumulado: number;
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
const MESES_OPTIONS = MESES_LABELS.map((l, i) => ({ label: l, value: i + 1 }));

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

function mesIngreso(row: ReporteFinancieroDto, i: number): number {
  return (
    ((row as any)[ABONO_KEYS[i]] ?? 0) - ((row as any)[CARGO_KEYS[i]] ?? 0)
  );
}
function mesGasto(row: ReporteFinancieroDto, i: number): number {
  return (
    ((row as any)[CARGO_KEYS[i]] ?? 0) - ((row as any)[ABONO_KEYS[i]] ?? 0)
  );
}

const GASTOS_EXTRA = ["605-000-000", "606-000-000", "607-000-000"];

@Component({
  selector: "app-firebis-er-extraordinarios",
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <p class="text-xs text-gray-400 mb-3">
        Ejercicio {{ filters.ejercicio() }} · Acumulado a {{ mesLabel() }}
      </p>

      @if (rawData().length > 0) {
        <div class="overflow-x-auto">
          <table class="w-full text-xs border-collapse" style="min-width:700px">
            <!-- Header -->
            <thead>
              <tr class="bg-slate-800 text-white">
                <th
                  class="text-left px-3 py-2 font-bold"
                  style="min-width:260px"
                >
                  CONCEPTOS
                </th>
                @for (m of mesesCierre(); track m) {
                  <th class="text-right px-2 py-2 font-bold whitespace-nowrap">
                    {{ MESES_LABELS[m - 1] }}
                  </th>
                }
                <th
                  class="text-right px-3 py-2 font-bold bg-slate-700 whitespace-nowrap"
                >
                  ACUMULADO
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- ══ INGRESOS ══ -->
              <tr class="bg-slate-100/80">
                <td
                  colspan="100"
                  class="px-4 py-2 font-bold text-slate-700 uppercase tracking-widest text-xs border-y border-slate-200"
                >
                  INGRESOS
                </td>
              </tr>
              @for (fila of ingresosRows(); track fila.num_Cta) {
                <tr
                  class="border-b border-slate-200 hover:bg-emerald-50 transition-colors"
                  [class.bg-slate-50]="$index % 2 !== 0"
                >
                  <td
                    class="px-4 py-2 font-medium text-slate-700 sticky left-0 z-10"
                    [class.bg-white]="$index % 2 === 0"
                    [class.bg-slate-50]="$index % 2 !== 0"
                  >
                    {{ fila.nombre }}
                  </td>
                  @for (m of mesesCierre(); track m) {
                    <td
                      class="text-right px-2 py-2 font-mono tabular-nums text-slate-600"
                    >
                      {{ fila.meses[m - 1] | number: "1.0-0" }}
                    </td>
                  }
                  <td
                    class="text-right px-4 py-2 font-mono font-semibold bg-emerald-50/50 text-emerald-700"
                  >
                    {{ fila.acumulado | number: "1.0-0" }}
                  </td>
                </tr>
              }
              <!-- Total Ingresos -->
              <tr
                class="bg-slate-900 text-white font-bold border-b-4 border-white"
              >
                <td
                  class="px-4 py-3 uppercase text-sm tracking-wide sticky left-0 bg-slate-900 z-10"
                >
                  TOTAL CUOTA EXTRAORDINARIA
                </td>
                @for (m of mesesCierre(); track m) {
                  <td
                    class="text-right px-2 py-3 font-mono text-sm text-emerald-400"
                  >
                    {{ totalIngresosMes()[m - 1] | number: "1.0-0" }}
                  </td>
                }
                <td
                  class="text-right px-4 py-3 font-mono text-sm bg-slate-800 text-emerald-400"
                >
                  {{ totalIngresosAcum() | number: "1.0-0" }}
                </td>
              </tr>

              <!-- Spacer -->
              <tr>
                <td colspan="100" class="py-2 bg-white"></td>
              </tr>

              <!-- ══ GASTOS EXTRA Y MEJORAS ══ -->
              <tr class="bg-slate-100/80">
                <td
                  colspan="100"
                  class="px-4 py-2 font-bold text-slate-700 uppercase tracking-widest text-xs border-y border-slate-200"
                >
                  GASTOS EXTRA Y MEJORAS
                </td>
              </tr>
              @for (fila of gastosRows(); track fila.num_Cta) {
                <tr
                  class="border-b border-slate-200 hover:bg-amber-50 transition-colors"
                  [class.bg-slate-50]="$index % 2 !== 0"
                >
                  <td
                    class="px-4 py-2 font-medium text-slate-700 sticky left-0 z-10"
                    [class.bg-white]="$index % 2 === 0"
                    [class.bg-slate-50]="$index % 2 !== 0"
                  >
                    {{ fila.nombre }}
                  </td>
                  @for (m of mesesCierre(); track m) {
                    <td
                      class="text-right px-2 py-2 font-mono tabular-nums"
                      [class]="
                        fila.meses[m - 1] > 0
                          ? 'text-amber-700 font-medium'
                          : 'text-slate-600'
                      "
                    >
                      {{ fila.meses[m - 1] | number: "1.0-0" }}
                    </td>
                  }
                  <td
                    class="text-right px-4 py-2 font-mono font-semibold bg-amber-50/50 text-amber-700"
                  >
                    {{ fila.acumulado | number: "1.0-0" }}
                  </td>
                </tr>
              }
              <!-- Total Gastos -->
              <tr class="bg-slate-900 text-white font-bold">
                <td
                  class="px-4 py-3 uppercase text-sm tracking-wide sticky left-0 bg-slate-900 z-10"
                >
                  TOTAL GASTOS EXTR Y MEJORAS
                </td>
                @for (m of mesesCierre(); track m) {
                  <td
                    class="text-right px-2 py-3 font-mono text-sm text-amber-300"
                  >
                    {{ totalGastosMes()[m - 1] | number: "1.0-0" }}
                  </td>
                }
                <td
                  class="text-right px-4 py-3 font-mono text-sm bg-slate-800 text-amber-300"
                >
                  {{ totalGastosAcum() | number: "1.0-0" }}
                </td>
              </tr>

              <!-- ══ RESULTADO ══ -->
              <tr
                [class]="
                  resultadoAcum() >= 0
                    ? 'bg-emerald-600 text-white font-bold text-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'
                    : 'bg-rose-600 text-white font-bold text-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'
                "
              >
                <td
                  class="px-4 py-4 uppercase tracking-wider sticky left-0 z-10"
                  [class]="
                    resultadoAcum() >= 0 ? 'bg-emerald-600' : 'bg-rose-600'
                  "
                >
                  RESULTADO EXTRAORDINARIO
                </td>
                @for (m of mesesCierre(); track m) {
                  <td
                    class="text-right px-2 py-4 font-mono text-[13px] opacity-90"
                  >
                    {{ resultadoMes()[m - 1] | number: "1.0-0" }}
                  </td>
                }
                <td
                  class="text-right px-4 py-4 font-mono text-base font-bold"
                  [class]="
                    resultadoAcum() >= 0 ? 'bg-emerald-700' : 'bg-rose-700'
                  "
                >
                  {{ resultadoAcum() | number: "1.0-0" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      }

      @if (rawData().length === 0 && !loading()) {
        <div
          class="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <i
            class="pi pi-bolt text-5xl mb-4"
            style="color: #0b3164; opacity: 0.4"
          ></i>
          <p class="text-sm">
            Selecciona ejercicio y mes, luego haz clic en
            <strong>Generar</strong>
          </p>
        </div>
      }
    </div>
  `,
})
export class FirebisErExtraordinarios {
  protected filters = inject(FirebisFiltersService);
  private dataService = inject(FirebisDataService);

  public readonly MESES_LABELS = MESES_LABELS;
  loading = signal(false);
  public rawData = signal<ReporteFinancieroDto[]>([]);

  get selectedMes(): number {
    return this.filters.mes();
  }

  constructor() {
    effect(() => {
      const _ = this.filters.loadTrigger();
      if (_ > 0) this.loadData();
    });
  }

  clearData() {
    this.rawData.set([]);
  }
  mesLabel = computed(() => MESES_LABELS[this.filters.mes() - 1]);
  mesesCierre = computed(() =>
    Array.from({ length: this.filters.mes() }, (_, i) => i + 1),
  );

  async loadData() {
    this.loading.set(true);
    this.rawData.set([]);
    try {
      const result = await this.dataService.getReporteFinanciero(
        DatabaseType.Contabilidad,
        this.filters.ejercicio(),
      );
      this.rawData.set(result || []);
    } catch (e: any) {
      console.error("Error cargando reporte extraordinarios:", e.message);
    } finally {
      this.loading.set(false);
    }
  }

  private toRow(row: ReporteFinancieroDto, esIngreso: boolean): ErRow {
    const mes = this.filters.mes();
    const meses = Array.from({ length: 12 }, (_, i) =>
      esIngreso ? mesIngreso(row, i) : mesGasto(row, i),
    );
    return {
      num_Cta: row.num_Cta,
      nombre: row.nombre,
      meses,
      acumulado: meses.slice(0, mes).reduce((s, v) => s + v, 0),
    };
  }

  ingresosRows = computed<ErRow[]>(() =>
    this.rawData()
      .filter((r) => r.num_Cta === "401-001-002")
      .map((r) => this.toRow(r, true)),
  );

  gastosRows = computed<ErRow[]>(() =>
    this.rawData()
      .filter((r) => GASTOS_EXTRA.includes(r.num_Cta))
      .map((r) => this.toRow(r, false))
      .filter((r) => r.meses.some((v) => v !== 0))
      .sort((a, b) => a.num_Cta.localeCompare(b.num_Cta)),
  );

  totalIngresosMes = computed<number[]>(() => {
    const rows = this.ingresosRows();
    return Array.from({ length: 12 }, (_, i) =>
      rows.reduce((s, r) => s + r.meses[i], 0),
    );
  });
  totalGastosMes = computed<number[]>(() => {
    const rows = this.gastosRows();
    return Array.from({ length: 12 }, (_, i) =>
      rows.reduce((s, r) => s + r.meses[i], 0),
    );
  });
  resultadoMes = computed<number[]>(() => {
    const ing = this.totalIngresosMes();
    const gas = this.totalGastosMes();
    return Array.from({ length: 12 }, (_, i) => ing[i] - gas[i]);
  });
  totalIngresosAcum = computed(() =>
    this.totalIngresosMes()
      .slice(0, this.filters.mes())
      .reduce((s, v) => s + v, 0),
  );
  totalGastosAcum = computed(() =>
    this.totalGastosMes()
      .slice(0, this.filters.mes())
      .reduce((s, v) => s + v, 0),
  );
  resultadoAcum = computed(
    () => this.totalIngresosAcum() - this.totalGastosAcum(),
  );
}

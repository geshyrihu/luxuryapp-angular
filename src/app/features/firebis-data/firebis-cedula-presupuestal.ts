import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { PresupuestoGastosDto } from "./firebis-dtos";
import { FirebisFiltersService } from "./firebis-filters.service";

// =====================================================
// CONSTANTES
// =====================================================
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

const CUENTAS_CEDULA = [
  "601-000-000", // GASTOS DE PERSONAL
  "602-000-000", // GASTOS ADMINISTRATIVOS
  "603-000-000", // GASTOS DE OPERACIÓN
  "604-000-000", // MANTENIMIENTOS
  "607-000-000", // GASTOS EN EVENTOS
  "608-000-000", // OTROS IMPUESTOS Y DERECHOS
  "609-000-000", // GASTOS FINANCIEROS
];

const NOMBRES_CEDULA: Record<string, string> = {
  "601-000-000": "GASTOS DE PERSONAL",
  "602-000-000": "GASTOS ADMINISTRATIVOS",
  "603-000-000": "GASTOS DE OPERACIÓN",
  "604-000-000": "MANTENIMIENTOS",
  "607-000-000": "GASTOS EN EVENTOS",
  "608-000-000": "OTROS IMPUESTOS Y DERECHOS",
  "609-000-000": "GASTOS FINANCIEROS",
};

interface CedulaRow {
  cta_Raiz: string;
  nombre: string;
  presupMensual: number;
  cargos: number[];
  presup: number[];
  acumulado: number;
  presupAnual: number;
  restante: number;
}

@Component({
  selector: "app-firebis-cedula-presupuestal",
  imports: [CommonModule],
  template: `
    <div
      class="card p-0 border-none shadow-sm bg-white rounded-xl overflow-hidden"
    >
      <!-- Header de Corte -->
      <div
        class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between"
      >
        <div class="flex flex-col">
          <h3
            class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center "
          >
            <i class="pi pi-table text-blue-500"></i>
            Cédula Presupuestal de Egresos
          </h3>
          <p class="text-gray-500 font-semibold text-sm mt-0.5">
            Ejercicio {{ filters.ejercicio() }} · Corte Mes {{ filters.mes() }}
          </p>
        </div>
        <div
          class="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-amber-100"
        >
          Análisis de Desviación Presupuestaria
        </div>
      </div>

      @if (rows().length > 0) {
        <div class="overflow-x-auto overflow-y-hidden">
          <table class="w-full border-collapse" style="min-width:1400px">
            <thead>
              <tr class="bg-white">
                <th
                  class="text-left px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-gray-500 sticky left-0 bg-white z-20 border-b-2 border-gray-100 min-w-[250px]"
                >
                  GASTOS GENERALES
                </th>
                <th
                  class="px-3 py-4 font-bold uppercase tracking-wider text-[11px] text-amber-600 bg-amber-50/50 border-b-2 border-amber-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  PRES. MENSUAL
                </th>
                @for (m of MESES_LABELS; track m) {
                  <th
                    class="px-3 py-4 font-bold uppercase tracking-wider text-[11px] text-gray-400 border-b-2 border-gray-100"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ m }}
                  </th>
                }
                <th
                  class="px-4 py-4 font-bold uppercase tracking-wider text-[11px] text-blue-600 bg-blue-50/50 border-b-2 border-blue-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  ACUMULADO
                </th>
                <th
                  class="px-4 py-4 font-bold uppercase tracking-wider text-[11px] text-white bg-slate-800 border-b-2 border-slate-900"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  PRES. ANUAL
                </th>
                <th
                  class="px-4 py-4 font-bold uppercase tracking-wider text-[11px] text-white bg-gray-600 border-b-2 border-gray-700"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  RESTANTE
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-50">
              @for (row of rows(); track row.cta_Raiz) {
                <tr class="hover:bg-blue-50/30 transition-colors group">
                  <td
                    class="px-6 py-4 font-bold text-gray-700 text-sm sticky left-0 z-10 bg-white border-l-4 border-transparent group-hover:border-primary"
                  >
                    <span
                      class="text-gray-300 mr-2 font-mono text-[10px] font-normal bg-gray-50 px-1 py-0.5 rounded border border-gray-100 group-hover:bg-white"
                      >{{ row.cta_Raiz }}</span
                    >
                    {{ row.nombre }}
                  </td>

                  <td
                    class="text-right px-3 py-4 font-bold text-sm text-amber-700 bg-amber-50/20"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{
                      row.presup[filters.mes() - 1] > 0
                        ? (row.presup[filters.mes() - 1] | number: "1.0-0")
                        : "-"
                    }}
                  </td>

                  @for (m of MESES_LABELS; track m; let i = $index) {
                    <td
                      class="text-right px-3 py-4 tabular-nums text-sm font-medium"
                      [class]="
                        row.cargos[i] > 0 ? 'text-gray-700' : 'text-gray-200'
                      "
                      style="font-family: 'Segoe UI', sans-serif;"
                    >
                      {{
                        row.cargos[i] > 0
                          ? (row.cargos[i] | number: "1.0-0")
                          : "-"
                      }}
                    </td>
                  }

                  <td
                    class="text-right px-4 py-4 font-bold text-sm text-blue-700 bg-blue-50/20"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ row.acumulado | number: "1.0-0" }}
                  </td>

                  <td
                    class="text-right px-4 py-4 font-bold text-sm text-gray-900 bg-gray-50/50"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{
                      row.presupAnual > 0
                        ? (row.presupAnual | number: "1.0-0")
                        : "-"
                    }}
                  </td>

                  <td
                    class="text-right px-4 py-4 font-black text-sm"
                    [class]="
                      row.restante < 0
                        ? 'text-rose-600 bg-rose-50/50'
                        : 'text-emerald-600 bg-emerald-50/50'
                    "
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{
                      row.presupAnual > 0
                        ? (row.restante | number: "1.0-0")
                        : "-"
                    }}
                  </td>
                </tr>
              }

              <!-- ═══ GRAN TOTAL ═══ -->
              <tr class="bg-slate-800 shadow-xl relative z-20">
                <td
                  class="px-6 py-5 font-black text-white text-sm uppercase tracking-widest sticky left-0 z-10 bg-slate-800"
                >
                  TOTAL GASTOS GENERALES
                </td>
                <td
                  class="text-right px-3 py-5 font-black text-amber-400 text-sm"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{
                    grandPresupMensual() > 0
                      ? (grandPresupMensual() | number: "1.0-0")
                      : "-"
                  }}
                </td>

                @for (m of MESES_LABELS; track m; let i = $index) {
                  <td
                    class="text-right px-3 py-5 font-bold text-white text-sm"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{
                      grandCargos()[i] > 0
                        ? (grandCargos()[i] | number: "1.0-0")
                        : "-"
                    }}
                  </td>
                }
                <td
                  class="text-right px-4 py-5 font-black text-blue-300 text-sm bg-slate-900/50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ grandAcumulado() | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-4 py-5 font-black text-white text-sm bg-slate-900/80"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ grandPresupAnual() | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-4 py-5 font-black text-base"
                  [class]="
                    grandRestante() < 0 ? 'text-rose-400' : 'text-emerald-400'
                  "
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ grandRestante() | number: "1.0-0" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      } @else {
        <div
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100"
          >
            <i class="pi pi-table text-4xl text-gray-200"></i>
          </div>
          <h4 class="text-gray-800 font-bold mb-1">Cédula no generada</h4>
          <p class="text-gray-400 text-sm max-w-[300px] mx-auto">
            Selecciona los parámetros y haz clic en generar para visualizar el
            desglose presupuestal.
          </p>
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
export class FirebisCedulaPresupuestal {
  protected filters = inject(FirebisFiltersService);
  private dataService = inject(FirebisDataService);

  public readonly MESES_LABELS = MESES_LABELS;
  loading = signal(false);
  public rawData = signal<PresupuestoGastosDto[]>([]);

  constructor() {
    effect(() => {
      const _ = this.filters.loadTrigger();
      if (_ > 0) this.loadData();
    });
  }

  clearData() {
    this.rawData.set([]);
  }

  async loadData() {
    this.loading.set(true);
    this.rawData.set([]);
    try {
      const [operacion, otros] = await Promise.all([
        this.dataService.getGastosOperacion(
          DatabaseType.Contabilidad,
          this.filters.ejercicio(),
          "operacion",
        ),
        this.dataService.getGastosOperacion(
          DatabaseType.Contabilidad,
          this.filters.ejercicio(),
          "otros",
        ),
      ]);
      this.rawData.set([...operacion, ...otros]);
    } catch (e: any) {
      console.error("Error cargando Cédula:", e.message);
    } finally {
      this.loading.set(false);
    }
  }

  rows = computed<CedulaRow[]>(() => {
    const data = this.rawData();
    const grouped = new Map<string, PresupuestoGastosDto[]>();
    for (const row of data) {
      if (!CUENTAS_CEDULA.includes(row.cta_Raiz)) continue;
      if (!grouped.has(row.cta_Raiz)) grouped.set(row.cta_Raiz, []);
      grouped.get(row.cta_Raiz)!.push(row);
    }
    return CUENTAS_CEDULA.filter((c) => grouped.has(c)).map((cta) => {
      const items = grouped.get(cta)!;
      const cargos = Array.from({ length: 12 }, (_, i) =>
        items.reduce(
          (sum, r) =>
            sum + ((r as any)[`cargo${String(i + 1).padStart(2, "0")}`] ?? 0),
          0,
        ),
      );
      const presup = Array.from({ length: 12 }, (_, i) =>
        items.reduce(
          (sum, r) =>
            sum + ((r as any)[`presup${String(i + 1).padStart(2, "0")}`] ?? 0),
          0,
        ),
      );
      const acumulado = cargos.reduce((s, v) => s + v, 0);
      const presupAnual = presup.reduce((s, v) => s + v, 0);
      const presupMensual = presupAnual > 0 ? presupAnual / 12 : 0;
      return {
        cta_Raiz: cta,
        nombre: NOMBRES_CEDULA[cta] ?? cta,
        presupMensual,
        cargos,
        presup,
        acumulado,
        presupAnual,
        restante: presupAnual - acumulado,
      };
    });
  });

  grandCargos = computed(() =>
    Array.from({ length: 12 }, (_, i) =>
      this.rows().reduce((s, r) => s + r.cargos[i], 0),
    ),
  );
  grandAcumulado = computed(() =>
    this.rows().reduce((s, r) => s + r.acumulado, 0),
  );
  grandPresupAnual = computed(() =>
    this.rows().reduce((s, r) => s + r.presupAnual, 0),
  );
  grandRestante = computed(
    () => this.grandPresupAnual() - this.grandAcumulado(),
  );
  grandPresupMensual = computed(() =>
    this.rows().reduce(
      (s, r) => s + (r.presup[this.filters.mes() - 1] || 0),
      0,
    ),
  );
}

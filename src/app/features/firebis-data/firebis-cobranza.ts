import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { AspelResumenDto } from "./firebis-dtos";
import { FirebisFiltersService } from "./firebis-filters.service";

type CobranzaCategoria =
  | "JUDICIAL"
  | "MOROSOS"
  | "CORRIENTE"
  | "SIN_ADEUDO"
  | "ANTICIPOS";

interface CobranzaRow {
  num_Cta: string;
  nombre: string;
  saldo: number;
  categoria: CobranzaCategoria;
}

@Component({
  selector: "app-firebis-cobranza",
  imports: [CommonModule, ChartModule],
  template: `
    <div
      class="card p-0 border-none shadow-sm bg-white rounded-xl overflow-hidden"
    >
      <!-- Header de Info -->
      <div
        class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between"
      >
        <div class="flex flex-col">
          <h3
            class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center "
          >
            <i class="pi pi-users text-blue-500"></i>
            Reporte de Cobranza firebis
          </h3>
          <p class="text-gray-500 font-semibold text-sm mt-0.5">
            Ejercicio {{ filters.ejercicio() }} · Corte a Mes
            {{ filters.mes() }}
          </p>
        </div>
        <div
          class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-blue-100"
        >
          Análisis de Cartera Vencida
        </div>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-24">
          <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
          <span class="text-gray-400 font-medium"
            >Calculando saldos de cobranza...</span
          >
        </div>
      } @else if (rawData().length > 0) {
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Lado Izquierdo: Tablas de Detalle -->
            <div class="lg:col-span-8 space-y-8">
              @for (seccion of secciones(); track seccion.id) {
                @if (seccion.filas.length > 0) {
                  <div
                    class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                  >
                    <div
                      class="py-4 px-6 flex justify-between items-center border-b border-gray-50"
                      [class]="seccion.bgClass"
                    >
                      <div class="flex items-center ">
                        <div
                          class="w-2 h-6 rounded-full"
                          [class]="seccion.colorClass"
                        ></div>
                        <span
                          class="font-black text-gray-800 text-sm uppercase tracking-wider"
                          >{{ seccion.titulo }}</span
                        >
                      </div>
                      <span
                        class="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-black text-gray-600 shadow-sm border border-gray-100"
                      >
                        {{ seccion.filas.length }} REGISTROS
                      </span>
                    </div>
                    <div class="overflow-x-auto">
                      <table class="w-full border-collapse">
                        <tbody class="divide-y divide-gray-50">
                          @for (fila of seccion.filas; track fila.num_Cta) {
                            <tr
                              class="hover:bg-gray-50/50 transition-colors group"
                            >
                              <td
                                class="px-6 py-3 text-gray-700 text-sm font-medium border-l-4 border-transparent group-hover:border-blue-500"
                              >
                                <span
                                  class="text-gray-300 mr-2 font-mono text-[10px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 group-hover:bg-white group-hover:text-gray-400"
                                  >{{ fila.num_Cta }}</span
                                >
                                {{ fila.nombre }}
                              </td>
                              <td
                                class="px-6 py-3 text-right tabular-nums text-sm font-bold"
                                [class]="
                                  fila.saldo < 0
                                    ? 'text-emerald-600'
                                    : 'text-gray-800'
                                "
                                style="font-family: 'Segoe UI', sans-serif;"
                              >
                                {{ fila.saldo | number: "1.2-2" }}
                              </td>
                            </tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr
                            class="bg-gray-50/50 font-black border-t border-gray-100"
                          >
                            <td
                              class="px-6 py-4 text-right text-[10px] text-gray-400 uppercase tracking-[0.2em]"
                            >
                              Subtotal {{ seccion.titulo }}
                            </td>
                            <td
                              class="px-6 py-4 text-right text-base"
                              [class]="
                                seccion.total < 0
                                  ? 'text-emerald-700'
                                  : 'text-gray-900'
                              "
                              style="font-family: 'Segoe UI', sans-serif;"
                            >
                              {{ seccion.total | number: "1.2-2" }}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Lado Derecho: Resumen y Gráfica -->
            <div class="lg:col-span-4 space-y-8">
              <!-- Tabla de Cierre / Resumen -->
              <div
                class="bg-slate-900 rounded-3xl shadow-xl overflow-hidden sticky top-6 border border-slate-800"
              >
                <div
                  class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex items-center justify-between"
                >
                  <span
                    class="text-white font-black uppercase tracking-[0.2em] text-xs"
                    >Cierre de Cartera</span
                  >
                  <i class="pi pi-shield text-blue-200 opacity-50"></i>
                </div>

                <div class="p-2">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr
                        class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
                      >
                        <th class="px-4 py-3 text-left">Clasificación</th>
                        <th class="px-4 py-3 text-right">Monto</th>
                        <th class="px-4 py-3 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                      @for (cat of resumenData(); track cat.id) {
                        <tr class="hover:bg-slate-800/50 transition-colors">
                          <td class="px-4 py-3">
                            <div class="flex items-center ">
                              <div
                                class="w-2.5 h-2.5 rounded-full shadow-sm"
                                [style.backgroundColor]="cat.color"
                              ></div>
                              <span
                                class="text-slate-300 font-bold text-xs uppercase"
                                >{{ cat.titulo }}</span
                              >
                            </div>
                          </td>
                          <td
                            class="px-4 py-3 text-right text-white font-bold text-sm tabular-nums"
                            style="font-family: 'Segoe UI', sans-serif;"
                          >
                            {{ cat.total | number: "1.2-2" }}
                          </td>
                          <td
                            class="px-4 py-3 text-right text-slate-500 font-medium text-[11px] tabular-nums"
                          >
                            {{ cat.porcentaje * 100 | number: "1.1-1" }}%
                          </td>
                        </tr>
                      }
                    </tbody>
                    <tfoot>
                      <tr class="bg-slate-800/80">
                        <td
                          class="px-4 py-5 text-white font-black text-xs uppercase tracking-wider"
                        >
                          Saldo Total
                        </td>
                        <td
                          class="px-4 py-5 text-right text-blue-400 font-black text-lg tabular-nums"
                          style="font-family: 'Segoe UI', sans-serif;"
                        >
                          {{ totalAbsoluto() | number: "1.2-2" }}
                        </td>
                        <td
                          class="px-4 py-5 text-right text-slate-500 font-bold text-[10px]"
                        >
                          100%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- Diagrama de Pastel -->
                <div
                  class="p-8 bg-white/5 backdrop-blur-md border-t border-slate-800 flex justify-center items-center"
                >
                  <p-chart
                    type="pie"
                    [data]="chartData()"
                    [options]="chartOptions"
                    class="w-full"
                  ></p-chart>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else if (!loading()) {
        <div
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100"
          >
            <i class="pi pi-users text-4xl text-gray-200"></i>
          </div>
          <h4 class="text-gray-800 font-bold mb-1">
            Cálculo de cobranza pendiente
          </h4>
          <p class="text-gray-400 text-sm max-w-[300px] mx-auto">
            Haz clic en el botón generar para procesar los saldos de condóminos
            del ejercicio actual.
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
export class FirebisCobranza {
  protected filters = inject(FirebisFiltersService);
  private dataService = inject(FirebisDataService);

  chartOptions = {
    cutout: "60%", // Lo hace tipo "Doughnut" que es más moderno
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { size: 12, family: "Segoe UI" },
        bodyFont: { size: 14, family: "Segoe UI", weight: "bold" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            let label = context.label || "";
            if (label) label += ": ";
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  readonly CATEGORIAS = [
    {
      id: "JUDICIAL",
      titulo: "Cobranza Judicial",
      color: "#ef4444", // red-500
      colorClass: "bg-red-500",
      bgClass: "bg-red-50/30",
    },
    {
      id: "MOROSOS",
      titulo: "Morosos",
      color: "#f97316", // orange-500
      colorClass: "bg-orange-500",
      bgClass: "bg-orange-50/30",
    },
    {
      id: "CORRIENTE",
      titulo: "Deuda Corriente",
      color: "#f59e0b", // amber-500
      colorClass: "bg-amber-500",
      bgClass: "bg-amber-50/30",
    },
    {
      id: "SIN_ADEUDO",
      titulo: "Sin Adeudo",
      color: "#10b981", // emerald-500
      colorClass: "bg-emerald-500",
      bgClass: "bg-emerald-50/30",
    },
    {
      id: "ANTICIPOS",
      titulo: "Anticipos",
      color: "#64748b", // slate-500
      colorClass: "bg-slate-500",
      bgClass: "bg-slate-50/30",
    },
  ];

  public Math = Math;
  public loading = signal<boolean>(false);
  public rawData = signal<AspelResumenDto[]>([]);

  constructor() {
    effect(() => {
      const _ = this.filters.loadTrigger();
      if (_ > 0) {
        setTimeout(() => this.loadData(), 0);
      }
    });
  }

  async loadData() {
    this.loading.set(true);
    this.rawData.set([]);
    try {
      const data = await this.dataService.getEstadisticas(
        DatabaseType.Cobranza,
        this.filters.ejercicio(),
      );
      const condominos = data.filter(
        (d) => d.num_Cta.startsWith("104") && d.num_Cta !== "104-000-000",
      );
      this.rawData.set(condominos);
    } catch (e: any) {
      console.error("Error cargando Cobranza:", e);
    } finally {
      this.loading.set(false);
    }
  }

  private calcularSaldoMes(row: AspelResumenDto, mesLimite: number): number {
    let saldo = row.saldoInicial || 0;
    for (let i = 1; i <= mesLimite; i++) {
      const idx = i.toString().padStart(2, "0");
      const cargo = (row as any)[`cargo${idx}`] || 0;
      const abono = (row as any)[`abono${idx}`] || 0;
      saldo += cargo - abono;
    }
    return Math.round(saldo * 100) / 100;
  }

  private clasificarSaldo(saldo: number): CobranzaCategoria {
    if (saldo < 0) return "ANTICIPOS";
    if (saldo === 0) return "SIN_ADEUDO";
    if (saldo < 20000) return "CORRIENTE";
    if (saldo < 60000) return "MOROSOS";
    return "JUDICIAL";
  }

  filasProcesadas = computed<CobranzaRow[]>(() => {
    const mes = this.filters.mes();
    return this.rawData()
      .map((row) => {
        const saldo = this.calcularSaldoMes(row, mes);
        return {
          num_Cta: row.num_Cta,
          nombre: row.nombre,
          saldo: saldo,
          categoria: this.clasificarSaldo(saldo),
        };
      })
      .sort((a, b) => b.saldo - a.saldo);
  });

  secciones = computed(() => {
    const filas = this.filasProcesadas();
    return this.CATEGORIAS.map((cat) => {
      const f = filas.filter((x) => x.categoria === cat.id);
      return {
        id: cat.id,
        titulo: cat.titulo,
        colorClass: cat.colorClass,
        bgClass: cat.bgClass,
        filas: f,
        total: f.reduce((sum, row) => sum + row.saldo, 0),
      };
    });
  });

  resumenData = computed(() => {
    const secs = this.secciones();
    const totalAdeudos = secs
      .filter((s) => s.id !== "SIN_ADEUDO" && s.id !== "ANTICIPOS")
      .reduce((sum, s) => sum + s.total, 0);
    const totalAnticipos = secs.find((s) => s.id === "ANTICIPOS")?.total || 0;
    const saldoVivo = totalAdeudos + totalAnticipos;
    return this.CATEGORIAS.map((cat) => {
      const seccion = secs.find((s) => s.id === cat.id)!;
      const porcentaje = saldoVivo !== 0 ? seccion.total / saldoVivo : 0;
      return {
        id: cat.id,
        titulo: cat.titulo,
        color: cat.color,
        total: seccion.total,
        porcentaje: porcentaje,
      };
    });
  });

  totalAbsoluto = computed(() =>
    this.resumenData().reduce((sum, item) => sum + item.total, 0),
  );

  chartData = computed(() => {
    const res = this.resumenData();
    return {
      labels: res.map((r) => r.titulo),
      datasets: [
        {
          data: res.map((r) => (r.total > 0 ? r.total : 0)),
          backgroundColor: res.map((r) => r.color),
          hoverBackgroundColor: res.map((r) => r.color),
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    };
  });
}

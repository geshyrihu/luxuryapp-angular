import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { ReporteFinancieroDto } from "./firebis-dtos";
import { FirebisFiltersService } from "./firebis-filters.service";

interface EpfRow {
  num_Cta: string;
  nombre: string;
  saldo: number;
}

interface EpfSection {
  titulo: string;
  filas: EpfRow[];
  total: number;
}

const MESES = [
  { label: "Enero", value: 1 },
  { label: "Febrero", value: 2 },
  { label: "Marzo", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Mayo", value: 5 },
  { label: "Junio", value: 6 },
  { label: "Julio", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Septiembre", value: 9 },
  { label: "Octubre", value: 10 },
  { label: "Noviembre", value: 11 },
  { label: "Diciembre", value: 12 },
];

@Component({
  selector: "app-firebis-epf",
  imports: [CommonModule, DecimalPipe],
  template: `
    <div
      class="card p-0 border-none shadow-sm bg-white rounded-xl overflow-hidden"
    >
      <!-- Header de Info de Corte -->
      <div
        class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between"
      >
        <div class="flex flex-col">
          <h3
            class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center "
          >
            <i class="pi pi-calendar-clock text-blue-500"></i>
            Estado de Posición Financiera
          </h3>
          <p class="text-gray-500 font-semibold text-sm mt-0.5">
            Ejercicio {{ filters.ejercicio() }} · Corte a {{ mesNombre() }}
          </p>
        </div>

        @if (rawData().length > 0) {
          <div
            [class]="
              cuadre()
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl shadow-sm'
                : 'bg-rose-50 text-rose-700 border border-rose-100 px-4 py-2 rounded-xl shadow-sm'
            "
            class="flex items-center  transition-all duration-300"
          >
            <div class="flex flex-col items-end">
              <span
                class="text-[10px] font-bold uppercase tracking-tighter opacity-70"
                >Balance de Partida Doble</span
              >
              <span
                class="text-sm font-black"
                style="font-family: 'Segoe UI', sans-serif;"
              >
                {{
                  cuadre()
                    ? "✓ BALANCE CUADRADO"
                    : "✗ DIFERENCIA: " +
                      (Math.abs(totalActivo() - totalPasivoYCapital())
                        | number: "1.0-0")
                }}
              </span>
            </div>
            <i
              [class]="
                cuadre()
                  ? 'pi pi-check-circle text-2xl'
                  : 'pi pi-exclamation-triangle text-2xl'
              "
            ></i>
          </div>
        }
      </div>

      <!-- Layout de 2 Columnas (Activo | Pasivo+Capital) -->
      @if (rawData().length > 0) {
        <div class="p-6">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- COLUMNA IZQUIERDA: ACTIVO -->
            <div
              class="flex-1 flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
            >
              <div
                class="bg-blue-600 px-6 py-4 flex items-center justify-between"
              >
                <span
                  class="text-white font-black uppercase tracking-[0.2em] text-xs"
                  >A C T I V O</span
                >
                <i class="pi pi-briefcase text-blue-200"></i>
              </div>
              <div class="flex-grow p-2">
                <table class="w-full border-collapse">
                  <tbody>
                    @for (fila of activoSection().filas; track fila.num_Cta) {
                      <tr class="hover:bg-blue-50/40 transition-colors group">
                        <td
                          class="px-4 py-3 text-gray-700 text-sm font-medium border-l-4 border-transparent group-hover:border-blue-500"
                        >
                          <span
                            class="text-gray-300 mr-2 text-[10px] font-mono bg-gray-50 px-1 py-0.5 rounded border border-gray-100 group-hover:bg-white group-hover:text-gray-400"
                            >{{ fila.num_Cta }}</span
                          >
                          {{ fila.nombre }}
                        </td>
                        <td
                          class="px-4 py-3 text-right tabular-nums text-sm font-bold"
                          [class]="
                            fila.saldo < 0 ? 'text-rose-600' : 'text-gray-800'
                          "
                          style="font-family: 'Segoe UI', sans-serif;"
                        >
                          {{ fila.saldo | number: "1.0-0" }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <!-- Total Activo -->
              <div
                class="bg-blue-50/50 px-6 py-4 border-t-2 border-blue-100 flex items-center justify-between mt-auto"
              >
                <span
                  class="font-black text-blue-900 text-sm uppercase tracking-wide"
                  >Total Activo</span
                >
                <span
                  class="text-blue-900 font-black text-lg"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ totalActivo() | number: "1.0-0" }}
                </span>
              </div>
            </div>

            <!-- COLUMNA DERECHA: PASIVO + CAPITAL -->
            <div class="flex-1 flex flex-col gap-8">
              <!-- Pasivo -->
              <div
                class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div
                  class="bg-amber-500 px-6 py-4 flex items-center justify-between text-white"
                >
                  <span class="font-black uppercase tracking-[0.2em] text-xs"
                    >P A S I V O</span
                  >
                  <i class="pi pi-wallet text-amber-200"></i>
                </div>
                <div class="p-2">
                  <table class="w-full border-collapse">
                    <tbody>
                      @for (fila of pasivoSection().filas; track fila.num_Cta) {
                        <tr
                          class="hover:bg-amber-50/30 transition-colors group"
                        >
                          <td
                            class="px-4 py-3 text-gray-700 text-sm font-medium border-l-4 border-transparent group-hover:border-amber-500"
                          >
                            <span
                              class="text-gray-300 mr-2 text-[10px] font-mono bg-gray-50 px-1 py-0.5 rounded border border-gray-100 group-hover:bg-white"
                              >{{ fila.num_Cta }}</span
                            >
                            {{ fila.nombre }}
                          </td>
                          <td
                            class="px-4 py-3 text-right tabular-nums text-sm font-bold text-gray-800"
                            style="font-family: 'Segoe UI', sans-serif;"
                          >
                            {{ fila.saldo | number: "1.0-0" }}
                          </td>
                        </tr>
                      }
                      <tr class="bg-amber-50/40 border-t border-amber-100">
                        <td
                          class="px-4 py-3 font-bold text-amber-900 uppercase text-xs tracking-wider"
                        >
                          Total Pasivo
                        </td>
                        <td
                          class="px-4 py-3 text-right font-black text-amber-900 text-base"
                          style="font-family: 'Segoe UI', sans-serif;"
                        >
                          {{ pasivoSection().total | number: "1.0-0" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Capital -->
              <div
                class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div
                  class="bg-emerald-600 px-6 py-4 flex items-center justify-between text-white"
                >
                  <span class="font-black uppercase tracking-[0.2em] text-xs"
                    >C A P I T A L</span
                  >
                  <i class="pi pi-building text-emerald-200"></i>
                </div>
                <div class="p-2">
                  <table class="w-full border-collapse">
                    <tbody>
                      @for (
                        fila of capitalSection().filas;
                        track fila.num_Cta
                      ) {
                        <tr
                          class="hover:bg-emerald-50/30 transition-colors group"
                        >
                          <td
                            class="px-4 py-3 text-gray-700 text-sm font-medium border-l-4 border-transparent group-hover:border-emerald-500"
                          >
                            <span
                              class="text-gray-300 mr-2 text-[10px] font-mono bg-gray-50 px-1 py-0.5 rounded border border-gray-100 group-hover:bg-white"
                              >{{ fila.num_Cta }}</span
                            >
                            {{ fila.nombre }}
                          </td>
                          <td
                            class="px-4 py-3 text-right tabular-nums text-sm font-bold text-gray-800"
                            style="font-family: 'Segoe UI', sans-serif;"
                          >
                            {{ fila.saldo | number: "1.0-0" }}
                          </td>
                        </tr>
                      }
                      <tr class="bg-emerald-50/40 border-t border-emerald-100">
                        <td
                          class="px-4 py-3 font-bold text-emerald-900 uppercase text-xs tracking-wider"
                        >
                          Total Capital
                        </td>
                        <td
                          class="px-4 py-3 text-right font-black text-emerald-900 text-base"
                          style="font-family: 'Segoe UI', sans-serif;"
                        >
                          {{ capitalSection().total | number: "1.0-0" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Gran Total Pasivo + Capital -->
              <div
                class="bg-slate-800 px-6 py-5 rounded-2xl shadow-lg flex items-center justify-between relative overflow-hidden group"
              >
                <div
                  class="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"
                ></div>
                <div class="flex flex-col">
                  <span
                    class="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
                    >Resumen Pasivo + Capital</span
                  >
                  <span
                    class="text-white font-black text-sm uppercase tracking-wide"
                    >SUMA TOTAL</span
                  >
                </div>
                <span
                  class="text-white font-black text-2xl"
                  [class.text-rose-400]="!cuadre()"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ totalPasivoYCapital() | number: "1.0-0" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      }

      @if (rawData().length === 0 && !loading()) {
        <div
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"
          >
            <i class="pi pi-chart-line text-4xl text-gray-200"></i>
          </div>
          <h4 class="text-gray-800 font-bold mb-1">Sin datos de balance</h4>
          <p class="text-gray-400 text-sm max-w-[300px] mx-auto">
            Selecciona un ejercicio y mes en los filtros superiores para generar
            el Estado de Posición Financiera.
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
export class FirebisEpf {
  protected filters = inject(FirebisFiltersService);
  private dataService = inject(FirebisDataService);

  public readonly MESES = MESES;
  public Math = Math;
  loading = signal(false);
  public rawData = signal<ReporteFinancieroDto[]>([]);

  get selectedMes(): number {
    return this.filters.mes();
  }
  mesNombre = computed(
    () => MESES.find((m) => m.value === this.filters.mes())?.label ?? "",
  );

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
      const result = await this.dataService.getReporteFinanciero(
        DatabaseType.Contabilidad,
        this.filters.ejercicio(),
      );
      this.rawData.set(result || []);
    } catch (e: any) {
      console.error("Error cargando EPF:", e.message);
    } finally {
      this.loading.set(false);
    }
  }

  private calcSaldo(
    row: ReporteFinancieroDto,
    mes: number,
    esActivo: boolean,
  ): number {
    const cargoKeys = [
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
    const abonoKeys = [
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

    let totalCargos = 0;
    let totalAbonos = 0;
    for (let i = 0; i < mes; i++) {
      totalCargos += (row as any)[cargoKeys[i]] ?? 0;
      totalAbonos += (row as any)[abonoKeys[i]] ?? 0;
    }

    return esActivo
      ? row.inicial + totalCargos - totalAbonos
      : row.inicial - totalCargos + totalAbonos;
  }

  private buildSection(startsWith: string, esActivo: boolean): EpfSection {
    const mes = this.filters.mes();
    const remanente = startsWith === "3" ? this.remanenteEjercicio() : null;
    const row302 =
      startsWith === "3"
        ? this.rawData().find((r) => r.num_Cta === "302-000-000")
        : undefined;
    const saldo302Raw = row302 ? this.calcSaldo(row302, mes, false) : 0;

    const filasAll: EpfRow[] = this.rawData()
      .filter((r) => r.nivel === 1 && r.num_Cta.startsWith(startsWith))
      .map((r) => {
        if (r.num_Cta === "302-000-000" && remanente !== null)
          return { num_Cta: r.num_Cta, nombre: r.nombre, saldo: remanente };
        if (r.num_Cta === "303-000-000")
          return {
            num_Cta: r.num_Cta,
            nombre: r.nombre,
            saldo: this.calcSaldo(r, mes, esActivo) + saldo302Raw,
          };
        return {
          num_Cta: r.num_Cta,
          nombre: r.nombre,
          saldo: this.calcSaldo(r, mes, esActivo),
        };
      });

    const filas = filasAll.filter((f) => f.saldo !== 0);
    const total = filasAll.reduce((sum, f) => sum + f.saldo, 0);
    return { titulo: startsWith, filas, total };
  }

  activoSection = computed<EpfSection>(() => this.buildSection("1", true));
  pasivoSection = computed<EpfSection>(() => this.buildSection("2", false));
  capitalSection = computed<EpfSection>(() => this.buildSection("3", false));

  remanenteEjercicio = computed<number>(() => {
    const mes = this.filters.mes();
    const data = this.rawData();
    const ingresos = data
      .filter((r) => r.nivel === 1 && r.num_Cta.startsWith("4"))
      .reduce((sum, r) => sum + this.calcSaldo(r, mes, false), 0);
    const gastos = data
      .filter(
        (r) =>
          r.nivel === 1 &&
          (r.num_Cta.startsWith("5") ||
            r.num_Cta.startsWith("6") ||
            r.num_Cta.startsWith("7") ||
            r.num_Cta.startsWith("8")),
      )
      .reduce((sum, r) => sum + this.calcSaldo(r, mes, true), 0);
    return ingresos - gastos;
  });

  totalActivo = computed(() => this.activoSection().total);
  totalPasivoYCapital = computed(
    () => this.pasivoSection().total + this.capitalSection().total,
  );
  cuadre = computed(
    () => Math.abs(this.totalActivo() - this.totalPasivoYCapital()) < 0.1,
  );
}

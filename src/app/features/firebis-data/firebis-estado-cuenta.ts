import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { EstadoCuentaDto } from "./firebis-dtos";
import { FirebisFiltersService } from "./firebis-filters.service";

interface CondominoOption {
  num_Cta: string;
  nombre: string;
  saldoInicial: number;
}

interface MovimientoCalculado extends EstadoCuentaDto {
  saldoAcumulado: number;
}

@Component({
  selector: "app-firebis-estado-cuenta",
  imports: [CommonModule, FormsModule, SelectModule],
  template: `
    <div class="px-6 pb-6 pt-2">
      <div class="flex items-center  mb-6">
        <div class="p-3 rounded-xl" style="background-color: #EBF3FB">
          <i class="pi pi-receipt text-2xl" style="color: #0b3164"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800 dark:text-white">
            Estado de Cuenta Detallado
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Consulta los movimientos y el saldo progresivo de cada condómino
          </p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center p-8">
          <i class="pi pi-spin pi-spinner text-4xl" style="color: #0b3164"></i>
        </div>
      }

      @if (!loading() && rawData().length > 0) {
        <div
          class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6"
        >
          <div class="flex flex-col md:flex-row  items-end">
            <div class="flex-grow">
              <label
                class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Selecciona un Condómino
              </label>
              <p-select
                [options]="condominos()"
                [ngModel]="selectedCondomino()"
                (ngModelChange)="onCondominoChanged($event)"
                optionLabel="nombre"
                [filter]="true"
                filterBy="nombre,num_Cta"
                [showClear]="true"
                scrollHeight="450px"
                placeholder="Busca por nombre o cuenta..."
                styleClass="w-full"
              >
                <ng-template pTemplate="selectedItem">
                  @if (selectedCondomino()) {
                    <div class="flex items-center ">
                      <i class="pi pi-user" style="color: #0b3164"></i>
                      <div>
                        {{ selectedCondomino()?.nombre }}
                        <span class="text-xs text-gray-400"
                          >({{ selectedCondomino()?.num_Cta }})</span
                        >
                      </div>
                    </div>
                  }
                </ng-template>
                <ng-template let-cond pTemplate="item">
                  <div class="flex flex-col">
                    <span class="font-bold">{{ cond.nombre }}</span>
                    <span class="text-xs text-gray-400">{{
                      cond.num_Cta
                    }}</span>
                  </div>
                </ng-template>
              </p-select>
            </div>

            @if (selectedCondomino()) {
              <div
                class="p-3 rounded-lg border min-w-[200px]"
                style="background-color: #EBF3FB; border-color: #BFDBFE"
              >
                <div class="text-xs font-semibold mb-1" style="color: #0b3164">
                  SALDO INICIAL {{ filters.ejercicio() }}
                </div>
                <div class="text-lg font-bold text-slate-800 dark:text-white">
                  {{
                    selectedCondomino()?.saldoInicial
                      | currency: "MXN" : "symbol-narrow" : "1.2-2"
                  }}
                </div>
              </div>
            }
          </div>
        </div>

        @if (selectedCondomino() && displayData().length > 0) {
          <div class="border rounded-lg overflow-hidden shadow-md">
            <div
              class="text-white font-bold py-3 px-4 shadow-inner flex justify-between items-center"
              style="background: linear-gradient(to right, #0b3164, #092953)"
            >
              <span>MOVIMIENTOS DEL EJERCICIO</span>
              <span class="text-sm bg-white/20 px-3 py-1 rounded-full">
                Saldo Actual:
                {{
                  balanceActual() | currency: "MXN" : "symbol-narrow" : "1.2-2"
                }}
              </span>
            </div>

            <table class="w-full text-sm bg-white">
              <thead class="bg-slate-900 text-white">
                <tr>
                  <th
                    class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs"
                  >
                    Fecha
                  </th>
                  <th
                    class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs"
                  >
                    Concepto
                  </th>
                  <th
                    class="py-3 px-4 text-right font-bold uppercase tracking-wider text-xs"
                  >
                    Cargo (Debe)
                  </th>
                  <th
                    class="py-3 px-4 text-right font-bold uppercase tracking-wider text-xs"
                  >
                    Abono (Haber)
                  </th>
                  <th
                    class="py-3 px-4 text-right font-bold uppercase tracking-wider text-xs bg-slate-800"
                  >
                    Saldo Acumulado
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                @for (
                  mov of displayData();
                  track mov.fecha_Pol + mov.concep_Po
                ) {
                  <tr
                    class="hover:bg-slate-50 transition-colors"
                    [class.bg-slate-50]="$index % 2 !== 0"
                  >
                    <td
                      class="py-3 px-4 whitespace-nowrap text-slate-500 text-sm"
                    >
                      {{ mov.fecha_Pol | date: "dd/MMM/yyyy" }}
                    </td>
                    <td class="py-3 px-4 text-slate-700">
                      {{ mov.concep_Po || "S/C" }}
                    </td>
                    <td class="py-3 px-4 text-right font-medium">
                      @if (mov.debe_Me > 0) {
                        <span
                          class="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-sm font-semibold"
                        >
                          {{
                            mov.debe_Me
                              | currency: "MXN" : "symbol-narrow" : "1.2-2"
                          }}
                        </span>
                      } @else {
                        <span class="text-slate-300">-</span>
                      }
                    </td>
                    <td class="py-3 px-4 text-right font-medium">
                      @if (mov.haber_Me > 0) {
                        <span
                          class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-sm font-semibold"
                        >
                          {{
                            mov.haber_Me
                              | currency: "MXN" : "symbol-narrow" : "1.2-2"
                          }}
                        </span>
                      } @else {
                        <span class="text-slate-300">-</span>
                      }
                    </td>
                    <td
                      class="py-3 px-4 text-right font-bold bg-slate-50/50"
                      [class]="
                        mov.saldoAcumulado > 0
                          ? 'text-rose-700'
                          : 'text-emerald-700'
                      "
                    >
                      {{
                        mov.saldoAcumulado
                          | currency: "MXN" : "symbol-narrow" : "1.2-2"
                      }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else if (selectedCondomino() && displayData().length === 0) {
          <div
            class="text-center py-12 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl mt-4"
          >
            <i class="pi pi-inbox text-4xl mb-3 text-slate-400"></i>
            <p>
              No hay movimientos registrados para este condómino en el ejercicio
              actual.
            </p>
          </div>
        }
      }

      @if (!loading() && rawData().length === 0) {
        <div
          class="flex flex-col items-center justify-center py-20 text-gray-400"
        >
          <i
            class="pi pi-receipt text-5xl mb-4"
            style="color: #0b3164; opacity: 0.4"
          ></i>
          <p class="text-sm">
            Haz clic en <strong>Generar</strong> para consultar los estados de
            cuenta
          </p>
        </div>
      }
    </div>
  `,
})
export class FirebisEstadoCuenta {
  protected filters = inject(FirebisFiltersService);
  private dataService = inject(FirebisDataService);

  loading = signal(false);
  rawData = signal<EstadoCuentaDto[]>([]);

  condominos = signal<CondominoOption[]>([]);
  selectedCondomino = signal<CondominoOption | null>(null);

  displayData = signal<MovimientoCalculado[]>([]);
  balanceActual = signal(0);

  constructor() {
    effect(() => {
      const trigger = this.filters.loadTrigger();
      if (trigger > 0) {
        setTimeout(() => this.loadData(), 0);
      }
    });
  }

  async loadData() {
    this.loading.set(true);
    this.selectedCondomino.set(null);
    this.displayData.set([]);

    try {
      const data = await this.dataService.getEstadoCuenta(
        DatabaseType.Cobranza,
        this.filters.ejercicio(),
      );
      this.rawData.set(data);
      this.extraerCondominos(data);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  private extraerCondominos(data: EstadoCuentaDto[]) {
    const mapa = new Map<string, CondominoOption>();

    for (const mov of data) {
      if (!mapa.has(mov.num_Cta)) {
        mapa.set(mov.num_Cta, {
          num_Cta: mov.num_Cta,
          nombre: mov.nombre || "Desconocido",
          saldoInicial: mov.saldoInicial || 0,
        });
      }
    }

    const lista = Array.from(mapa.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre),
    );
    this.condominos.set(lista);
  }

  onCondominoChanged(cond: CondominoOption | null) {
    this.selectedCondomino.set(cond);
    this.calcularMovimientos();
  }

  calcularMovimientos() {
    const seleccionado = this.selectedCondomino();
    if (!seleccionado) {
      this.displayData.set([]);
      this.balanceActual.set(0);
      return;
    }

    // Filtrar movimientos del condómino seleccionado y ordenar por fecha
    const movimientos = this.rawData()
      .filter((m) => m.num_Cta === seleccionado.num_Cta)
      .sort(
        (a, b) =>
          new Date(a.fecha_Pol).getTime() - new Date(b.fecha_Pol).getTime(),
      );

    let saldoCorriente = seleccionado.saldoInicial;
    const calculados: MovimientoCalculado[] = [];

    for (const mov of movimientos) {
      saldoCorriente += mov.debe_Me - mov.haber_Me; // Cargo suma a la deuda, Abono la resta
      calculados.push({
        ...mov,
        saldoAcumulado: saldoCorriente,
      });
    }

    this.displayData.set(calculados);
    this.balanceActual.set(saldoCorriente);
  }
}

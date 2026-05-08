import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { FirebisCedulaPresupuestal } from "./firebis-cedula-presupuestal";
import { FirebisCobranza } from "./firebis-cobranza";
import { FirebisEpf } from "./firebis-epf";
import { FirebisEr } from "./firebis-er";
import { FirebisErExtraordinarios } from "./firebis-er-extraordinarios";
import { FirebisEstadoCuenta } from "./firebis-estado-cuenta";
import { FirebisFiltersService } from "./firebis-filters.service";
import { FirebisReporteFinanciero } from "./firebis-reporte-financiero";

interface ReporteTab {
  id: string;
  titulo: string;
  subtitulo: string;
  icono: string;
  usaMes: boolean;
}

const REPORTES: ReporteTab[] = [
  {
    id: "balanza",
    titulo: "Balanza de Comprobación",
    subtitulo: "Todos los movimientos del ejercicio",
    icono: "pi-list",
    usaMes: false,
  },
  {
    id: "epf",
    titulo: "Estado de Posición Financiera",
    subtitulo: "Activos · Pasivos · Capital",
    icono: "pi-chart-pie",
    usaMes: true,
  },
  {
    id: "er",
    titulo: "Estado de Resultados",
    subtitulo: "Ingresos y gastos ordinarios",
    icono: "pi-chart-line",
    usaMes: true,
  },
  {
    id: "extraordinarios",
    titulo: "Extraordinarios y Mejoras",
    subtitulo: "Cuotas y gastos extraordinarios",
    icono: "pi-bolt",
    usaMes: true,
  },
  {
    id: "cedula",
    titulo: "Cédula Presupuestal vs Gastos",
    subtitulo: "Presupuesto aprobado vs real",
    icono: "pi-table",
    usaMes: true,
  },
  {
    id: "cobranza",
    titulo: "Reporte de Cobranza",
    subtitulo: "Cartera de deudores y morosidad",
    icono: "pi-users",
    usaMes: true,
  },
  {
    id: "estado-cuenta",
    titulo: "Estado de Cuenta",
    subtitulo: "Desglose por condómino",
    icono: "pi-id-card",
    usaMes: false,
  },
];

const MESES_OPTIONS = [
  { label: "ENE", value: 1 },
  { label: "FEB", value: 2 },
  { label: "MAR", value: 3 },
  { label: "ABR", value: 4 },
  { label: "MAY", value: 5 },
  { label: "JUN", value: 6 },
  { label: "JUL", value: 7 },
  { label: "AGO", value: 8 },
  { label: "SEP", value: 9 },
  { label: "OCT", value: 10 },
  { label: "NOV", value: 11 },
  { label: "DIC", value: 12 },
];

@Component({
  selector: "app-firebis-reportes-wrapper",
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SelectModule,
    SelectButtonModule,
    CustomButton,
    FirebisEpf,
    FirebisEr,
    FirebisErExtraordinarios,
    FirebisCedulaPresupuestal,
    FirebisReporteFinanciero,
    FirebisCobranza,
    FirebisEstadoCuenta,
  ],
  template: `
    <div class="bg-slate-50 min-h-screen">
      <!-- ════════════════════════════════════════════
           BARRA DE CONTROLES — sticky top
      ════════════════════════════════════════════ -->
      <div
        class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm"
      >
        <!-- Fila superior: módulo + filtros + generar -->
        <div
          class="flex items-center justify-between  px-6 py-3 border-b border-slate-100"
        >
          <!-- Branding del módulo -->
          <div class="flex items-center  shrink-0">
            <div
              class="w-1.5 h-8 rounded-full"
              style="background-color: #0b3164"
            ></div>
            <div>
              <h1
                class="text-slate-800 text-sm font-bold tracking-tight leading-none"
              >
                Reportes Financieros
              </h1>
              <p class="text-slate-400 text-xs mt-0.5">Aspel COI · Firebird</p>
            </div>
          </div>

          <!-- Filtros + botón generar -->
          <div class="flex flex-wrap items-center ">
            <span class="text-xs font-medium text-slate-400 hidden sm:block"
              >Ejercicio</span
            >
            <p-select
              [options]="ejercicioOptions"
              [(ngModel)]="ejercicio"
              optionLabel="label"
              optionValue="value"
              placeholder="Año"
              size="small"
            ></p-select>

            @if (reporte().usaMes) {
              <span class="text-xs font-medium text-slate-400 hidden sm:block"
                >Mes</span
              >
              <p-select
                [options]="MESES_OPTIONS"
                [(ngModel)]="mes"
                optionLabel="label"
                optionValue="value"
                placeholder="Mes"
                size="small"
              ></p-select>
            }

            <custom-button
              label="Generar"
              icon="pi pi-play"
              (clicked)="generar()"
            />
          </div>
        </div>

        <!-- Fila inferior: tabs de reportes -->
        <div class="flex gap-1 px-6 py-2 overflow-x-auto">
          @for (r of REPORTES; track r.id; let i = $index) {
            <button
              (click)="goTo(i)"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                     transition-colors duration-150 border whitespace-nowrap shrink-0"
              [class]="
                i === currentIndex()
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50'
              "
              [style.background-color]="i === currentIndex() ? '#0b3164' : ''"
            >
              <i [class]="'pi ' + r.icono" style="font-size: 10px"></i>
              {{ r.titulo }}
            </button>
          }
        </div>
      </div>

      <!-- ════════════════════════════════════════════
           PANEL DEL REPORTE ACTIVO
      ════════════════════════════════════════════ -->
      <div class="px-4 lg:px-6 py-4">
        <div
          class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <!-- Cabecera: título + icono + contador -->
          <div
            class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100"
            style="border-left: 4px solid #0b3164"
          >
            <div class="flex items-center ">
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style="background-color: #f0f4fa"
              >
                <i
                  [class]="'pi ' + reporte().icono"
                  style="color: #0b3164; font-size: 15px"
                ></i>
              </div>
              <div>
                <h2 class="text-slate-800 text-sm font-bold leading-tight">
                  {{ reporte().titulo }}
                </h2>
                <p class="text-slate-400 text-xs">{{ reporte().subtitulo }}</p>
              </div>
            </div>
            <span
              class="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full shrink-0"
            >
              {{ currentIndex() + 1 }} / {{ REPORTES.length }}
            </span>
          </div>

          <!-- Contenido del reporte -->
          <div>
            @switch (reporte().id) {
              @case ("balanza") {
                <app-firebis-reporte-financiero />
              }
              @case ("epf") {
                <app-firebis-epf />
              }
              @case ("er") {
                <app-firebis-er />
              }
              @case ("extraordinarios") {
                <app-firebis-er-extraordinarios />
              }
              @case ("cedula") {
                <app-firebis-cedula-presupuestal />
              }
              @case ("cobranza") {
                <app-firebis-cobranza />
              }
              @case ("estado-cuenta") {
                <app-firebis-estado-cuenta />
              }
            }
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════
           NAVEGACIÓN ANTERIOR / SIGUIENTE
      ════════════════════════════════════════════ -->
      <div
        class="flex items-center justify-between  px-4 lg:px-6 pb-6 max-w-2xl mx-auto"
      >
        <button
          (click)="prev()"
          [disabled]="currentIndex() === 0"
          class="flex items-center  px-5 py-2.5 rounded-lg text-sm font-semibold
                 border border-slate-300 bg-white text-slate-600 transition-colors duration-150
                 hover:bg-slate-50 hover:border-slate-400
                 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i class="pi pi-arrow-left text-xs"></i> Anterior
        </button>

        <div class="flex  items-center">
          @for (r of REPORTES; track r.id; let i = $index) {
            <button
              (click)="goTo(i)"
              class="rounded-full transition-all duration-200"
              [class]="
                i === currentIndex()
                  ? 'w-2.5 h-2.5'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              "
              [style.background-color]="i === currentIndex() ? '#0b3164' : ''"
            ></button>
          }
        </div>

        <button
          (click)="next()"
          [disabled]="currentIndex() === REPORTES.length - 1"
          class="flex items-center  px-5 py-2.5 rounded-lg text-sm font-semibold
                 border border-slate-300 bg-white text-slate-600 transition-colors duration-150
                 hover:bg-slate-50 hover:border-slate-400
                 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Siguiente <i class="pi pi-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  `,
})
export class FirebisReportesWrapper {
  public readonly REPORTES = REPORTES;
  public readonly MESES_OPTIONS = MESES_OPTIONS;

  /** Genera opciones de año: año actual ± 2 */
  public readonly ejercicioOptions = (() => {
    const base = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, i) => base - i).map((y) => ({
      label: String(y),
      value: y,
    }));
  })();

  private filters = inject(FirebisFiltersService);

  currentIndex = signal(0);
  reporte = computed(() => REPORTES[this.currentIndex()]);

  // Two-way binding con el servicio compartido
  get ejercicio(): number {
    return this.filters.ejercicio();
  }
  set ejercicio(v: number) {
    this.filters.ejercicio.set(v);
  }

  get mes(): number {
    return this.filters.mes();
  }
  set mes(v: number) {
    this.filters.mes.set(v);
  }

  generar() {
    this.filters.generar();
  }

  goTo(i: number) {
    this.currentIndex.set(i);
  }
  prev() {
    if (this.currentIndex() > 0) this.currentIndex.update((i) => i - 1);
  }
  next() {
    if (this.currentIndex() < REPORTES.length - 1)
      this.currentIndex.update((i) => i + 1);
  }
}

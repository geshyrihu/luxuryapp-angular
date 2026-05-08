import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FirebisCxpAntiguedad } from "./firebis-cxp-antiguedad";
import { FirebisCxpEstadoCuenta } from "./firebis-cxp-estado-cuenta";
import { FirebisCxpProveedores } from "./firebis-cxp-proveedores";

interface CxpTab {
  id: string;
  titulo: string;
  subtitulo: string;
  icono: string;
}

const TABS: CxpTab[] = [
  {
    id: "proveedores",
    titulo: "Catálogo de Proveedores",
    subtitulo: "Directorio de prestadores de servicios",
    icono: "pi-users",
  },
  {
    id: "antiguedad",
    titulo: "Cuentas por Pagar",
    subtitulo: "Facturas y antigüedad de saldos",
    icono: "pi-calendar-clock",
  },
  {
    id: "estado-cuenta",
    titulo: "Estado de Cuenta",
    subtitulo: "Historial de pagos por proveedor",
    icono: "pi-receipt",
  },
];

@Component({
  selector: "app-firebis-cxp-wrapper",
  imports: [
    CommonModule,
    RouterModule,
    FirebisCxpProveedores,
    FirebisCxpAntiguedad,
    FirebisCxpEstadoCuenta,
  ],
  template: `
    <div class="min-h-screen bg-slate-50 px-4 py-6">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between  mb-4"
      >
        <div class="flex flex-wrap ">
          @for (tab of TABS; track tab.id; let i = $index) {
            <button
              (click)="goTo(i)"
              [class]="
                [
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200 border',
                  i === currentIndex()
                    ? 'bg-white text-slate-800 border-slate-300 shadow-md font-semibold'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                ].join(' ')
              "
            >
              <i [class]="'pi ' + tab.icono + ' text-xs'"></i>{{ tab.titulo }}
            </button>
          }
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        style="animation: slideIn 0.35s ease-out;"
      >
        <!-- Header -->
        <div class="bg-white border-b border-slate-200 px-5 py-4">
          <div class="flex items-center ">
            <div class="bg-slate-100 rounded-xl p-2 shrink-0">
              <i
                [class]="'pi ' + currentTab().icono + ' text-slate-600 text-xl'"
              ></i>
            </div>
            <div>
              <h2 class="text-slate-800 text-lg font-bold leading-tight">
                {{ currentTab().titulo }}
              </h2>
              <p class="text-slate-500 text-xs">{{ currentTab().subtitulo }}</p>
            </div>
          </div>
        </div>

        <!-- Render area -->
        <div>
          @switch (currentTab().id) {
            @case ("proveedores") {
              <app-firebis-cxp-proveedores />
            }
            @case ("antiguedad") {
              <app-firebis-cxp-antiguedad />
            }
            @case ("estado-cuenta") {
              <app-firebis-cxp-estado-cuenta />
            }
          }
        </div>
      </div>
    </div>

    <style>
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `,
})
export class FirebisCxpWrapper {
  public readonly TABS = TABS;

  currentIndex = signal(0);
  currentTab = computed(() => TABS[this.currentIndex()]);

  goTo(i: number) {
    this.currentIndex.set(i);
  }
}

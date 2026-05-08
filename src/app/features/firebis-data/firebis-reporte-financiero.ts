import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { ReporteFinancieroDto } from "./firebis-dtos";

@Component({
  selector: "app-firebis-reporte-financiero",
  imports: [
    CommonModule,
    ToolbarModule,
    SelectButtonModule,
    TableModule,
    CustomButton,
    FormsModule,
  ],
  template: `
    <div
      class="card p-0 overflow-hidden border-none shadow-md bg-white rounded-xl"
    >
      <!-- Header Seccion -->
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center ">
          <i class="pi pi-chart-bar text-primary text-2xl"></i>
          Reporte Financiero / Balanza
        </h2>
        <p class="text-gray-500 mt-1 text-sm">
          Consulta de saldos y movimientos por ejercicio contable.
        </p>
      </div>

      <div class="p-4 bg-gray-50/50">
        <p-toolbar
          styleClass="mb-0 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm "
        >
          <ng-template pTemplate="left">
            <div
              class="flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <!-- Selector de Ejercicio -->
              <div class="flex items-center ">
                <span
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >Ejercicio</span
                >
                <p-selectButton
                  [options]="[
                    { label: '2025', value: 2025 },
                    { label: '2024', value: 2024 },
                  ]"
                  [(ngModel)]="selectedEjercicio"
                  optionLabel="label"
                  optionValue="value"
                  (onChange)="clearData()"
                  styleClass="custom-select-button"
                >
                </p-selectButton>
              </div>
              <!-- Boton Consultar -->
              <custom-button
                label="Cargar Balanza"
                icon="pi pi-search"
                [loading]="loadingData"
                (clicked)="loadData()"
                [showLabelOnDesktop]="true"
                [outlined]="true"
              >
              </custom-button>
            </div>
          </ng-template>
        </p-toolbar>
      </div>

      <!-- Tabla Reporte Financiero (Row Grouping) -->
      @if (dataSignal().length > 0) {
        <div class="px-4 pb-4 overflow-hidden">
          <p-table
            [value]="dataSignal()"
            [scrollable]="true"
            [scrollHeight]="scrollHeight()"
            rowGroupMode="subheader"
            groupRowsBy="cta_Papa"
            styleClass="p-datatable-sm custom-financial-table"
          >
            <ng-template #header>
              <tr>
                <th
                  pFrozenColumn
                  class="min-w-[350px] font-bold text-gray-700 uppercase text-xs tracking-wider bg-gray-50 py-4 px-4 border-b-2 border-gray-200"
                >
                  CUENTA / NOMBRE
                </th>
                <th
                  class="text-center font-bold text-gray-700 uppercase text-xs tracking-wider bg-gray-50 border-b-2 border-gray-200"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  SALDO INICIAL
                </th>
                <!-- CARGOS -->
                @for (mes of meses; track $index) {
                  <th
                    class="text-center font-bold text-rose-600 uppercase text-[10px] tracking-tighter bg-rose-50/30 border-b-2 border-rose-100"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ mes }} (C)
                  </th>
                }
                <!-- ABONOS -->
                @for (mes of meses; track $index) {
                  <th
                    class="text-center font-bold text-emerald-600 uppercase text-[10px] tracking-tighter bg-emerald-50/30 border-b-2 border-emerald-100"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ mes }} (A)
                  </th>
                }
              </tr>
            </ng-template>

            <ng-template pTemplate="groupheader" let-rowData>
              <tr class="p-rowgroup-header">
                <td
                  colspan="26"
                  class="bg-gray-50/90 backdrop-blur-sm py-3 px-4 border-y border-gray-100"
                >
                  <div class="flex items-center ">
                    <div class="w-1.5 h-5 bg-primary rounded-full"></div>
                    <span
                      class="font-bold text-sm text-gray-800 tracking-tight"
                    >
                      {{ rowData.cta_Papa || "SIN CUENTA PADRE" }}
                    </span>
                  </div>
                </td>
              </tr>
            </ng-template>

            <ng-template #body let-rowData>
              <tr
                class="hover:bg-blue-50/40 transition-colors border-b border-gray-50"
              >
                <!-- Detalle -->
                <td
                  pFrozenColumn
                  class="font-medium text-sm whitespace-nowrap px-4 py-3 bg-white"
                >
                  <span
                    class="text-gray-400 font-mono text-[11px] mr-2 px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100"
                    >{{ rowData.num_Cta }}</span
                  >
                  <span class="text-gray-700">{{ rowData.nombre }}</span>
                </td>
                <!-- Saldo Inicial -->
                <td
                  class="text-right px-3 py-3 font-bold text-sm text-gray-900 bg-gray-50/30"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.inicial | number: "1.0-0" }}
                </td>

                <!-- Cargos 1-12 -->
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo01 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo02 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo03 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo04 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo05 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo06 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo07 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo08 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo09 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo10 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo11 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-rose-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.cargo12 | number: "1.0-0" }}
                </td>

                <!-- Abonos 1-12 -->
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono01 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono02 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono03 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono04 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono05 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono06 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono07 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono08 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono09 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono10 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono11 | number: "1.0-0" }}
                </td>
                <td
                  class="text-right px-2 py-3 text-emerald-600 text-sm font-medium border-l border-gray-50"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ rowData.abono12 | number: "1.0-0" }}
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="26" class="text-center py-12 bg-white">
                  <div class="flex flex-col items-center ">
                    <i class="pi pi-inbox text-4xl text-gray-200"></i>
                    <span class="text-gray-400 font-medium"
                      >No se encontraron datos para mostrar.</span
                    >
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }

      <!-- Mobile View -->
      @if (dataSignal().length > 0) {
        <div
          class="block md:hidden p-8 text-center bg-gray-50 border-t border-gray-100"
        >
          <i class="pi pi-desktop text-3xl text-gray-300 mb-3"></i>
          <p class="text-gray-500 text-sm font-medium">
            La vista matricial requiere una pantalla más grande.<br />
            Por favor usa una tableta o navegador de escritorio.
          </p>
        </div>
      }
    </div>

    <style>
      :host ::ng-deep {
        .custom-financial-table {
          .p-datatable-wrapper {
            border-radius: 0.75rem;
            border: 1px solid #f3f4f6;
          }
        }
        .custom-select-button {
          .p-button {
            padding: 0.5rem 1.25rem;
            font-size: 0.8125rem;
            font-weight: 600;
            background: white;
            border-color: #e5e7eb;
            color: #6b7280;
            transition: all 0.2s ease;
            &:hover {
              background: #f9fafb;
            }
            &.p-highlight {
              background: var(--primary-color);
              border-color: var(--primary-color);
              color: white;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
    </style>
  `,
})
export class FirebisReporteFinanciero {
  private dataService = inject(FirebisDataService);

  public selectedDatabase: DatabaseType = DatabaseType.Contabilidad;
  public selectedEjercicio: number = 2025;
  public dataSignal = signal<ReporteFinancieroDto[]>([]);
  public loadingData = false;

  public meses = [
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

  public clearData() {
    this.dataSignal.set([]);
  }

  public async loadData() {
    this.loadingData = true;
    this.clearData();
    try {
      const result = await this.dataService.getReporteFinanciero(
        this.selectedDatabase,
        this.selectedEjercicio,
      );
      this.dataSignal.set(result || []);
    } catch (e: any) {
      console.error("Error cargando balanza:", e.message);
    } finally {
      this.loadingData = false;
    }
  }

  public scrollHeight() {
    return "calc(100vh - 280px)";
  }
}

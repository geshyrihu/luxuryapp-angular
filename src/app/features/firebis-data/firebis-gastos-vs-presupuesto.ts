import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { PresupuestoGastosDto } from "./firebis-dtos";

@Component({
  selector: "app-firebis-gastos-vs-presupuesto",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectButtonModule,
    ToolbarModule,
    ProgressSpinnerModule,
    CustomButton,
  ],
  template: `
    <div
      class="card p-0 border-none shadow-sm bg-white rounded-xl overflow-hidden"
    >
      <!-- Header Seccion -->
      <div
        class="p-6 border-b border-gray-100 flex items-center justify-between"
      >
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center ">
            <i class="pi pi-chart-line text-primary text-2xl"></i>
            Gastos vs Presupuesto
          </h2>
          <p class="text-gray-500 mt-1 text-sm">
            AnÃ¡lisis comparativo de ejecuciÃ³n presupuestaria mensual.
          </p>
        </div>
        <div
          class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-emerald-100"
        >
          Control Presupuestal
        </div>
      </div>

      <div class="p-4 bg-gray-50/50">
        <p-toolbar
          styleClass="mb-0 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm "
        >
          <ng-template pTemplate="left">
            <div
              class="flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div class="flex items-center ">
                <span
                  class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >Reporte</span
                >
                <p-selectButton
                  [options]="reportOptions"
                  [(ngModel)]="selectedReport"
                  optionLabel="label"
                  optionValue="value"
                  (onChange)="clearData()"
                  styleClass="custom-select-button"
                >
                </p-selectButton>
              </div>
              <custom-button
                label="Cargar Reporte"
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

      <!-- Tabla Matricial Gastos vs Presupuesto con Row Grouping -->
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
                @for (m of meses; track m) {
                  <th
                    class="text-center font-bold text-gray-500 uppercase text-xs tracking-wider bg-gray-50 border-b-2 border-gray-200"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ m }}
                  </th>
                }
              </tr>
            </ng-template>

            <ng-template pTemplate="groupheader" let-rowData>
              <tr class="p-rowgroup-header">
                <td
                  colspan="13"
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
                <!-- Detalle Nivel 3 -->
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

                <!-- Enero a Diciembre: Celdas Dobles (Presupuesto Arriba, Gasto Abajo) -->
                @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; track i) {
                  <td
                    class="text-right px-2 py-2 align-top border-l border-gray-50"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    <div class="flex flex-col">
                      <span
                        class="text-[10px] font-bold text-gray-300 uppercase tracking-tighter leading-tight"
                        >Pres.</span
                      >
                      <span
                        class="text-xs font-medium text-gray-400 leading-tight mb-1"
                        >{{
                          rowData["presup" + (i | number: "2.0-0")]
                            | number: "1.0-0"
                        }}</span
                      >
                      <span
                        class="text-[10px] font-black text-rose-300 uppercase tracking-tighter leading-tight"
                        >Real</span
                      >
                      <span
                        class="text-sm font-black text-rose-600 leading-tight"
                        >{{
                          rowData["cargo" + (i | number: "2.0-0")]
                            | number: "1.0-0"
                        }}</span
                      >
                    </div>
                  </td>
                }
              </tr>
            </ng-template>
          </p-table>
        </div>
      } @else if (!loadingData) {
        <div
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100"
          >
            <i class="pi pi-chart-line text-4xl text-gray-200"></i>
          </div>
          <h4 class="text-gray-800 font-bold mb-1">AnÃ¡lisis Comparativo</h4>
          <p class="text-gray-400 text-sm max-w-[300px] mx-auto">
            Selecciona el tipo de reporte y haz clic en generar para visualizar
            la comparativa de gastos.
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
export class FirebisGastosVsPresupuesto implements OnInit {
  private customDataService = inject(FirebisDataService);
  private cdr = inject(ChangeDetectorRef);
  private tableScrollHeightService = inject(TableScrollHeightService);

  scrollHeight = this.tableScrollHeightService.scrollHeight;
  loadingData = false;
  dataSignal = signal<PresupuestoGastosDto[]>([]);
  meses = [
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

  reportOptions = [
    { label: "Gastos OperaciÃ³n", value: "operacion" },
    { label: "Otros Gastos", value: "otros" },
  ];
  selectedReport = "operacion";

  ngOnInit() {}

  clearData() {
    this.dataSignal.set([]);
  }

  async loadData() {
    this.clearData();
    this.loadingData = true;
    try {
      const data = await this.customDataService.getGastosOperacion(
        DatabaseType.Contabilidad,
        2025,
        this.selectedReport,
      );
      setTimeout(() => {
        this.dataSignal.set(data);
        this.loadingData = false;
        this.cdr.detectChanges();
      }, 0);
    } catch (err) {
      console.error(err);
      this.loadingData = false;
      this.cdr.detectChanges();
    }
  }
}

import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { DatabaseType, FirebisDataService } from "./firebis-data.service";
import { AspelResumenDto } from "./firebis-dtos";

@Component({
  selector: "app-firebis-data-main",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectModule,
    ToolbarModule,
    ProgressSpinnerModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButton,
  ],
  template: `
    <div class="card p-4">
      <h2 class="text-2xl font-semibold mb-4 text-[var(--text-color)]">
        EstadÃ³sticas Aspel Firebird
      </h2>
      <p-toolbar styleClass="mb-4  border-none">
        <ng-template pTemplate="left">
          <div class="flex items-center ">
            <label class="font-medium text-[var(--text-color)]"
              >Base de Datos:</label
            >
            <p-select
              [options]="dbOptions"
              [(ngModel)]="selectedDb"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar BD"
              (onChange)="clearData()"
            >
            </p-select>
          </div>
        </ng-template>

        <ng-template pTemplate="right">
          <div class="flex ">
            <custom-button
              label="Cargar EstadÃ³sticas"
              icon="pi pi-chart-pie"
              [loading]="loadingData"
              (clicked)="loadData()"
              colorClass="p-button-outlined p-button-primary"
            >
            </custom-button>
          </div>
        </ng-template>
      </p-toolbar>

      <!-- Tabla Customizada -->
      @if (columns().length > 0 && dataSignal().length > 0) {
        <p-table
          [globalFilterFields]="globalFilterFieldsComputed()"
          [paginator]="true"
          [rows]="tablePrimeNgRows"
          [rowsPerPageOptions]="rowsPerPageOptions"
          [tableStyle]="{ 'min-width': '50rem' }"
          [value]="dataSignal()"
          #dt
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
          [scrollable]="true"
          [scrollHeight]="scrollHeight()"
          styleClass="custom-table hidden md:block"
        >
          <ng-template #caption>
            <primeng-custom-caption [dt]="dt" [hideAdd]="true" />
          </ng-template>

          <ng-template #header>
            <tr>
              @for (col of columns(); track col.field) {
                <th [pSortableColumn]="col.field">
                  {{ col.header }}
                  <p-sortIcon [field]="col.field" />
                </th>
              }
            </tr>
          </ng-template>

          <ng-template #body let-rowData>
            <tr>
              @for (col of columns(); track col.field) {
                <td>
                  {{ rowData[col.field] }}
                </td>
              }
            </tr>
          </ng-template>

          <ng-template #paginatorleft>
            <primeng-custom-table-footer [data]="dataSignal()" />
          </ng-template>
        </p-table>
      }
    </div>
  `,
})
export class FirebisDataMain {
  private dataService = inject(FirebisDataService);
  private tableScrollHeightService = inject(TableScrollHeightService);

  // States
  dataSignal = signal<AspelResumenDto[]>([]);
  columns = signal<any[]>([]);

  loadingData = false;

  selectedDb: DatabaseType = DatabaseType.Contabilidad;
  dbOptions = [
    { label: "Contabilidad", value: DatabaseType.Contabilidad },
    { label: "Cobranza", value: DatabaseType.Cobranza },
  ];

  /* PRIME NG TABLE OPTIONS */
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightService.scrollHeight;

  globalFilterFieldsComputed = computed(() => {
    return this.columns().map((c) => c.field);
  });

  clearData() {
    this.dataSignal.set([]);
    this.columns.set([]);
  }

  async loadData() {
    this.clearData();
    this.loadingData = true;

    try {
      const data = await this.dataService.getEstadisticas(this.selectedDb);
      this.columns.set(this.generateColumns(data));
      this.dataSignal.set(data);
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingData = false;
    }
  }

  // Generate dynamic columns appending suffix to identify the source
  private generateColumns(data: AspelResumenDto[]): any[] {
    if (!data || data.length === 0) return [];

    return Object.keys(data[0]).map((key) => {
      let headerText = key.charAt(0).toUpperCase() + key.slice(1);

      const lowerKey = key.toLowerCase();
      if (lowerKey.startsWith("presup")) {
        headerText = `${headerText} (PSTO)`;
      } else if (
        lowerKey.startsWith("saldo") ||
        lowerKey.startsWith("cargo") ||
        lowerKey.startsWith("abono") ||
        lowerKey.startsWith("inicial")
      ) {
        headerText = `${headerText} (SDOS)`;
      }

      return {
        field: key,
        header: headerText,
      };
    });
  }
}

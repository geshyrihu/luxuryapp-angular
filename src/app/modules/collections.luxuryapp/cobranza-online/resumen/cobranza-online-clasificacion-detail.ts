import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { DynamicDialogConfig } from "@ui/web/primeng-dynamicdialog/primeng-dynamicdialog";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import type { CobranzaOnlineDashboardDepartment } from "../interfaces/cobranza-online-dashboard.model";

export interface ClasificacionDetailData {
  clasificacion: string;
  description: string;
  departamentos: (CobranzaOnlineDashboardDepartment & {
    clasificacion: string;
    isJudicial: boolean;
  })[];
}

@Component({
  selector: "app-cobranza-online-clasificacion-detail",
  imports: [CommonModule, AppTable, AppSortableColumn, AppSorticon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-2">
      @if (data().description) {
        <div class="text-color-secondary text-sm mb-3">
          {{ data().description }}
        </div>
      }

      @if (rows().length === 0) {
        <div class="text-center text-color-secondary py-4">
          No hay departamentos en esta clasificación.
        </div>
      } @else {
        <app-table
          [value]="rows()"
          [paginator]="rows().length > 15"
          [rows]="15"
          [rowsPerPageOptions]="[15, 25, 50]"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
          class="p-datatable-sm"
          [initialSortField]="'balance'"
          [initialSortOrder]="-1"
        >
          <ng-template #header>
            <tr>
              <th
                appSortableColumn="accountNumber"
                class="bg-surface-50 border-bottom-1 surface-border"
              >
                Cuenta <app-sorticon field="accountNumber" />
              </th>
              <th
                appSortableColumn="propertyFullName"
                class="bg-surface-50 border-bottom-1 surface-border"
              >
                Condómino <app-sorticon field="propertyFullName" />
              </th>
              <th
                appSortableColumn="maintenanceBalance"
                class="bg-surface-50 border-bottom-1 surface-border text-right"
              >
                Adeudo Mtto. <app-sorticon field="maintenanceBalance" />
              </th>
              <th
                appSortableColumn="extraordinaryBalance"
                class="bg-surface-50 border-bottom-1 surface-border text-right"
              >
                Adeudo Ext. <app-sorticon field="extraordinaryBalance" />
              </th>
              <th
                appSortableColumn="finesBalance"
                class="bg-surface-50 border-bottom-1 surface-border text-right"
              >
                Multas <app-sorticon field="finesBalance" />
              </th>
              <th
                appSortableColumn="currentMonthCharge"
                class="bg-surface-50 border-bottom-1 surface-border text-right"
              >
                Cargo Mes <app-sorticon field="currentMonthCharge" />
              </th>
              <th
                appSortableColumn="balance"
                class="bg-surface-50 border-bottom-1 surface-border text-right"
              >
                Saldo Total <app-sorticon field="balance" />
              </th>
            </tr>
          </ng-template>
          <ng-template #body let-row>
            <tr class="border-bottom-1 surface-border">
              <td class="font-mono text-sm">{{ row.accountNumber }}</td>
              <td>{{ row.propertyFullName || row.accountName }}</td>
              <td class="text-right">
                {{
                  row.maintenanceBalance | currency: "MXN" : "symbol" : "1.0-0"
                }}
              </td>
              <td class="text-right">
                {{
                  row.extraordinaryBalance
                    | currency: "MXN" : "symbol" : "1.0-0"
                }}
              </td>
              <td class="text-right">
                {{ row.finesBalance | currency: "MXN" : "symbol" : "1.0-0" }}
              </td>
              <td class="text-right text-color-secondary text-sm">
                @if (row.currentMonthCharge > 0) {
                  {{
                    row.currentMonthCharge
                      | currency: "MXN" : "symbol" : "1.0-0"
                  }}
                } @else {
                  <span class="text-xs">Sin cargo</span>
                }
              </td>
              <td
                class="text-right font-semibold"
                [ngClass]="
                  row.isJudicial
                    ? 'text-danger'
                    : row.balance < 0
                      ? 'text-success'
                      : ''
                "
              >
                {{ row.balance | currency: "MXN" : "symbol" : "1.0-0" }}
              </td>
            </tr>
          </ng-template>
          <ng-template #footer>
            <tr class="font-bold border-top-2 surface-border bg-black-alpha-10">
              <td colspan="2" class="text-right">Totales:</td>
              <td class="text-right">
                {{ totalMaintenance() | currency: "MXN" : "symbol" : "1.0-0" }}
              </td>
              <td class="text-right">
                {{
                  totalExtraordinary() | currency: "MXN" : "symbol" : "1.0-0"
                }}
              </td>
              <td class="text-right">
                {{ totalFines() | currency: "MXN" : "symbol" : "1.0-0" }}
              </td>
              <td class="text-right text-color-secondary"></td>
              <td class="text-right text-primary">
                {{ totalBalance() | currency: "MXN" : "symbol" : "1.0-0" }}
              </td>
            </tr>
          </ng-template>
        </app-table>
      }
    </div>
  `,
})
export class CobranzaOnlineClasificacionDetail {
  private readonly config =
    inject<DynamicDialogConfig<ClasificacionDetailData>>(DynamicDialogConfig);

  readonly data = computed<ClasificacionDetailData>(() => this.config.data);
  readonly rows = computed(() => this.data().departamentos);

  readonly totalMaintenance = computed(() =>
    this.rows().reduce((s, d) => s + (d.maintenanceBalance || 0), 0),
  );
  readonly totalExtraordinary = computed(() =>
    this.rows().reduce((s, d) => s + (d.extraordinaryBalance || 0), 0),
  );
  readonly totalFines = computed(() =>
    this.rows().reduce((s, d) => s + (d.finesBalance || 0), 0),
  );
  readonly totalBalance = computed(() =>
    this.rows().reduce((s, d) => s + (d.balance || 0), 0),
  );
}

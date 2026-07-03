import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButtonDelete } from "src/app/core/components/buttons/legacy/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/legacy/buttons/custom-button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { ActionIconsGroupComponent } from "src/app/core/components/shared/action-icons-group/action-icons-group.component";
import {
  EStatus,
  StatusBadge,
} from "src/app/core/components/shared/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";

interface ErpRow {
  id: number;
  folio: string;
  nombre: string;
  depto: string;
  fecha: string;
  importe: number;
  status: EStatus;
  detail?: string;
}

@Component({
  selector: "app-web-tables",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    CheckboxModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    ActionIconsGroupComponent,
    ActionMenu,
    StatusBadge,
    DataViewMobile,
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card
          header="Tabla ERP - Caption, Filtro, Sort, Paginación y Responsiva"
        >
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Patrón esténdar ERP:
            <code>primeng-custom-caption</code> + <code>p-table</code> en
            desktop y <code>app-data-view-mobile</code> en mívil
            (<code>md:hidden</code>).
          </p>

          <primeng-custom-caption
            [dt]="dt"
            label="Nueva solicitud"
            [rolAuth]="true"
            [showSearch]="true"
          />

          <p-table
            #dt
            [value]="rows"
            [paginator]="true"
            [rows]="4"
            [rowsPerPageOptions]="[4, 8, 16]"
            [globalFilterFields]="['folio', 'nombre', 'depto']"
            sortField="folio"
            styleClass="custom-table card hidden md:block"
            [rowHover]="true"
          >
            <ng-template #colgroup>
              <colgroup>
                <col style="width: 130px" />
                <col />
                <col style="width: 140px" />
                <col style="width: 110px" />
                <col style="width: 120px" />
                <col style="width: 130px" />
                <col style="width: 110px" />
              </colgroup>
            </ng-template>

            <ng-template #header>
              <tr>
                <th pSortableColumn="folio">
                  Folio <p-sort-icon field="folio" />
                </th>
                <th pSortableColumn="nombre">
                  Nombre <p-sort-icon field="nombre" />
                </th>
                <th pSortableColumn="depto">
                  Departamento <p-sort-icon field="depto" />
                </th>
                <th pSortableColumn="fecha">
                  Fecha <p-sort-icon field="fecha" />
                </th>
                <th pSortableColumn="importe" class="text-right">
                  Importe <p-sort-icon field="importe" />
                </th>
                <th>Status</th>
                <th class="text-center">Acciones</th>
              </tr>
            </ng-template>

            <ng-template #body let-row>
              <tr>
                <td>
                  <strong>{{ row.folio }}</strong>
                </td>
                <td>
                  <span class="block font-semibold text-sm">{{
                    row.nombre
                  }}</span>
                  <span class="text-xs text-color-secondary">{{
                    row.depto
                  }}</span>
                </td>
                <td>{{ row.depto }}</td>
                <td>{{ row.fecha }}</td>
                <td class="text-right">
                  {{ row.importe | currency: "MXN" : "symbol" : "1.0-0" }}
                </td>
                <td><app-status-badge [status]="row.status" /></td>
                <td>
                  <div class="flex justify-content-center">
                    <app-action-icons-group>
                      <custom-button-edit label="" />
                      <custom-button-delete label="" />
                    </app-action-icons-group>
                  </div>
                </td>
              </tr>
            </ng-template>

            <ng-template #paginatorleft>
              <primeng-custom-table-footer [data]="rows" />
            </ng-template>
          </p-table>

          <app-data-view-mobile
            [data]="rows"
            [dt]="dt"
            [globalFilterFields]="['folio', 'nombre', 'depto']"
            [showAdd]="false"
            class="block md:hidden"
          >
            <ng-template #listItemTemplate let-row>
              <div
                class="flex align-items-start justify-content-between p-3 border-bottom-1 surface-border"
              >
                <div>
                  <strong class="text-sm block">{{ row.folio }}</strong>
                  <span class="text-xs text-color-secondary block mt-1">
                    {{ row.nombre }}
                  </span>
                  <div class="flex align-items-center gap-2 mt-2">
                    <app-status-badge [status]="row.status" />
                    <span class="text-xs font-bold">
                      {{ row.importe | currency: "MXN" : "symbol" : "1.0-0" }}
                    </span>
                  </div>
                </div>
                <app-action-menu>
                  <p-button label="Editar" icon="mdi:pencil" [text]="true" />
                  <p-button
                    label="Eliminar"
                    icon="mdi:trash-can"
                    [text]="true"
                    severity="danger"
                  />
                </app-action-menu>
              </div>
            </ng-template>
          </app-data-view-mobile>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Tabla con Selección (checkbox)">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Muestra el conteo de seleccionados y activa las acciones masivas en
            el toolbar.
          </p>
          <div class="flex align-items-center justify-content-between mb-3">
            <span class="text-sm text-color-secondary">
              {{ selectedRows().length }} de {{ rows.length }} seleccionados
            </span>
            @if (selectedRows().length > 0) {
              <div class="flex gap-2">
                <p-button
                  label="Exportar"
                  icon="mdi:download"
                  size="small"
                  severity="secondary"
                  [outlined]="true"
                />
                <p-button
                  label="Eliminar"
                  icon="mdi:trash-can"
                  size="small"
                  severity="danger"
                />
              </div>
            }
          </div>
          <p-table
            [value]="rows"
            [(selection)]="selectedRowsModel"
            (selectionChange)="selectedRows.set($event)"
            dataKey="id"
            styleClass="p-datatable-sm"
          >
            <ng-template #header>
              <tr>
                <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                <th>Folio</th>
                <th>Nombre</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template #body let-row>
              <tr>
                <td><p-tableCheckbox [value]="row" /></td>
                <td>
                  <strong>{{ row.folio }}</strong>
                </td>
                <td>{{ row.nombre }}</td>
                <td><app-status-badge [status]="row.status" /></td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Tabla con Row Expansion (detalle)">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Expande una fila para mostrar detalle sin navegar a otra vista.
            ósalo solo cuando el detalle es breve y consultivo.
          </p>
          <p-table [value]="rows" dataKey="id" styleClass="p-datatable-sm">
            <ng-template #header>
              <tr>
                <th style="width: 3rem"></th>
                <th>Folio</th>
                <th>Importe</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template #body let-row let-expanded="expanded">
              <tr>
                <td>
                  <p-button
                    [icon]="expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    [pRowToggler]="row"
                    [text]="true"
                    [rounded]="true"
                    size="small"
                  />
                </td>
                <td>
                  <strong>{{ row.folio }}</strong>
                </td>
                <td>
                  {{ row.importe | currency: "MXN" : "symbol" : "1.0-0" }}
                </td>
                <td><app-status-badge [status]="row.status" /></td>
              </tr>
            </ng-template>
            <ng-template #rowexpansion let-row>
              <tr>
                <td colspan="4">
                  <div class="p-3 surface-ground border-round m-2">
                    <strong class="block text-sm mb-2">
                      Detalle de {{ row.folio }}
                    </strong>
                    <div class="grid text-sm">
                      <div class="col-6">
                        <span class="text-color-secondary">Nombre:</span>
                        {{ row.nombre }}
                      </div>
                      <div class="col-6">
                        <span class="text-color-secondary">Depto:</span>
                        {{ row.depto }}
                      </div>
                      <div class="col-6">
                        <span class="text-color-secondary">Fecha:</span>
                        {{ row.fecha }}
                      </div>
                      <div class="col-6">
                        <span class="text-color-secondary">Importe:</span>
                        {{ row.importe | currency: "MXN" : "symbol" : "1.0-0" }}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebTables {
  readonly rows: ErpRow[] = [
    {
      id: 1,
      folio: "ERP-001",
      nombre: "Solicitud de compra equipo TI",
      depto: "Sistemas",
      fecha: "2026-06-01",
      importe: 45000,
      status: EStatus.Pendiente,
      detail: "Requiere aprobación de Dirección.",
    },
    {
      id: 2,
      folio: "ERP-002",
      nombre: "Mantenimiento preventivo elevadores",
      depto: "Operaciones",
      fecha: "2026-06-05",
      importe: 12800,
      status: EStatus.Proceso,
      detail: "Proveedor asignado: TechElevadores SA.",
    },
    {
      id: 3,
      folio: "ERP-003",
      nombre: "Adquisición mobiliario administrativo",
      depto: "Administración",
      fecha: "2026-06-10",
      importe: 89500,
      status: EStatus.Concluido,
      detail: "Entregado y firmado en almacón.",
    },
    {
      id: 4,
      folio: "ERP-004",
      nombre: "Servicio de limpieza óreas comunes",
      depto: "Servicios",
      fecha: "2026-06-12",
      importe: 8500,
      status: EStatus.noAutorizado,
      detail: "Solicitud rechazada por política de techo.",
    },
    {
      id: 5,
      folio: "ERP-005",
      nombre: "Capacitación personal túcnico",
      depto: "Recursos Humanos",
      fecha: "2026-06-15",
      importe: 15000,
      status: EStatus.Proceso,
      detail: "3 de 5 sesiones completadas.",
    },
    {
      id: 6,
      folio: "ERP-006",
      nombre: "Renovación de licencias de software",
      depto: "Sistemas",
      fecha: "2026-06-18",
      importe: 32000,
      status: EStatus.Pendiente,
      detail: "Pendiente de cotización comparativa.",
    },
  ];

  selectedRowsModel: ErpRow[] = [];
  selectedRows = signal<ErpRow[]>([]);
}

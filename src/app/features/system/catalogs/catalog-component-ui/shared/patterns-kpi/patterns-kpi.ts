import { CommonModule } from "@angular/common";
import { Component, input, signal, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonIcon } from "@ionic/angular/standalone";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DatePickerModule } from "primeng/datepicker";
import { DividerModule } from "primeng/divider";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import {
  CustomBtnActiveDesactive,
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/legacy/buttons";
import {
  CustomInputDateSignal,
  CustomInputSelectSignal,
} from "src/app/core/components/inputs/web";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { ActionIconsGroupComponent } from "src/app/core/components/shared/action-icons-group/action-icons-group.component";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import {
  EStatus,
  StatusBadge,
} from "src/app/core/components/shared/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";

@Component({
  selector: "app-patterns-kpi",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    DividerModule,
    TooltipModule,
    DatePickerModule,
    SelectModule,
    MultiSelectModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomBtnActiveDesactive,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    StatusBadge,
    ActionIconsGroupComponent,
    ActionMenu,
    PrimeNgCustomCaption,
    DataViewMobile,
    AppIcon,
    IonIcon,
    CustomButtonEdit,
    CustomButtonDelete,
  ],
  template: `
    <div class="grid">
      <!-- 1. Tarjetas KPI (M�tricas ERP) -->
      <div class="col-12">
        <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">
          Tarjetas de M�tricas (KPI Cards)
        </h3>
        <div class="grid mb-4">
          <div class="col-12 md:col-4">
            <div
              class="surface-card shadow-1 border-round-lg p-3 border-left-3 border-primary flex justify-content-between align-items-center"
            >
              <div>
                <span
                  class="block text-secondary text-xs font-bold uppercase mb-1"
                  >Presupuesto Mantenimiento</span
                >
                <span class="text-2xl font-bold text-900">$245,800.00 MXN</span>
                <div
                  class="text-xs text-green-600 mt-2 font-bold flex align-items-center gap-1"
                >
                  <app-icon [icon]="'mdi:arrow-up'" />
                  <span>12.5% vs mes anterior</span>
                </div>
              </div>
              <div
                class="w-3rem h-3rem border-round bg-blue-50 text-primary flex align-items-center justify-content-center"
              >
                <app-icon [icon]="'mdi:cash-multiple'" class="text-2xl" />
              </div>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div
              class="surface-card shadow-1 border-round-lg p-3 border-left-3 border-warning flex justify-content-between align-items-center"
            >
              <div>
                <span
                  class="block text-secondary text-xs font-bold uppercase mb-1"
                  >Conciliaciones Pendientes</span
                >
                <span class="text-2xl font-bold text-900"
                  >18 Transacciones</span
                >
                <div
                  class="text-xs text-yellow-600 mt-2 font-bold flex align-items-center gap-1"
                >
                  <app-icon [icon]="'mdi:alert'" />
                  <span>Requiere atenci�n inmediata</span>
                </div>
              </div>
              <div
                class="w-3rem h-3rem border-round bg-yellow-50 text-warning flex align-items-center justify-content-center"
              >
                <app-icon [icon]="'mdi:bank-transfer'" class="text-2xl" />
              </div>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div
              class="surface-card shadow-1 border-round-lg p-3 border-left-3 border-success flex justify-content-between align-items-center"
            >
              <div>
                <span
                  class="block text-secondary text-xs font-bold uppercase mb-1"
                  >Fondeo Disponible</span
                >
                <span
                  class="text-2xl font-bold"
                  style="color: var(--ds-luxury-gold-text, #b8953a); font-weight: 800;"
                  >$1,850,400.00</span
                >
                <div
                  class="text-xs text-green-600 mt-2 font-bold flex align-items-center gap-1"
                >
                  <app-icon [icon]="'mdi:check-circle'" />
                  <span>Fondo de reserva consolidado</span>
                </div>
              </div>
              <div
                class="w-3rem h-3rem border-round bg-green-50 text-success flex align-items-center justify-content-center"
              >
                <app-icon [icon]="'mdi:shield-check'" class="text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Barra de Filtros Avanzados -->
      <div class="col-12 mb-4">
        <h3 class="text-xl font-bold mb-3 border-bottom-1 border-300 pb-2">
          Estructura de B�squeda y Grillas
        </h3>
        <p-card header="Barra de Filtros Avanzados (Responsive)">
          <form
            [formGroup]="filterForm()"
            class="grid align-items-end gap-3 md:gap-0"
          >
            <div class="col-12 md:col-3">
              <label class="block text-xs font-bold text-secondary mb-1"
                >Fecha Registro</label
              >
              <custom-input-date-signal
                [control]="filterForm()?.controls?.['fechaRango']"
                label=""
              />
            </div>
            <div class="col-12 md:col-3">
              <label class="block text-xs font-bold text-secondary mb-1"
                >Departamento</label
              >
              <custom-input-select-signal
                [control]="filterForm()?.controls?.['depto']"
                [data]="deptoOptions()"
                label=""
              />
            </div>
            <div class="col-12 md:col-3">
              <label class="block text-xs font-bold text-secondary mb-1"
                >Estado Transacci�n</label
              >
              <custom-input-select-signal
                [control]="filterForm()?.controls?.['estado']"
                [data]="statusOptions()"
                label=""
              />
            </div>
            <div
              class="col-12 md:col-3 flex gap-2 justify-content-end"
              style="height: 38px;"
            >
              <button
                pButton
                label="Filtrar"
                icon="mdi:magnify"
                class="p-button-primary flex-grow-1 h-full"
              ></button>
              <button
                pButton
                label="Limpiar"
                icon="mdi:refresh"
                class="p-button-secondary p-button-outlined h-full"
              ></button>
            </div>
          </form>
        </p-card>
      </div>

      <!-- 3. Tabla H�brida + Maestro-Detalle -->
      <div class="col-12 lg:col-6 mb-4">
        <p-card header="Tabla H�brida con Toolbar Alineado y Columnas Fijas">
          <div
            class="flex flex-column md:flex-row md:align-items-center justify-content-between p-2 gap-2 surface-ground border-round mb-3"
          >
            <div class="flex-grow-1">
              <primeng-custom-caption
                [title]="'Insumos'"
                label="Agregar Insumo"
                [dt]="dt"
                [noPadding]="true"
                [noMargin]="true"
              />
            </div>
            <div class="flex flex-column sm:flex-row align-items-center gap-2">
              <div style="min-width: 140px">
                <custom-input-select-signal
                  [control]="filterForm()?.controls?.['estado']"
                  [data]="statusOptions()"
                  [noMargin]="true"
                  placeholder="Filtrar"
                />
              </div>
              <div class="flex-shrink-0" style="width: 130px">
                <custom-button-active-desactive [state]="true" />
              </div>
            </div>
          </div>

          <p-table
            #dt
            [value]="tableData()"
            styleClass="custom-table custom-table-fixed card hidden md:block"
            [globalFilterFields]="['name']"
          >
            <ng-template pTemplate="colgroup">
              <colgroup>
                <col class="table-col-20" />
                <col class="table-col-50" />
                <col class="table-col-30" />
              </colgroup>
            </ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th>Acciones</th>
                <th>Elemento (Ajuste autom�tico de texto)</th>
                <th>Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td>
                  <app-action-icons-group>
                    <custom-button-edit [label]="''" />
                    <custom-button-delete [label]="''" />
                  </app-action-icons-group>
                </td>
                <td>
                  <strong>{{ item.name }}</strong>
                  <span class="block text-xs text-secondary mt-1 line-height-2"
                    >Este texto largo simula una descripci�n del insumo que debe
                    hacer salto de l�nea autom�tico de forma fluida y sin
                    desbordar la tabla.</span
                  >
                </td>
                <td><app-status-badge [status]="item.status" /></td>
              </tr>
            </ng-template>
          </p-table>

          <app-data-view-mobile
            [data]="tableData()"
            [dt]="dt"
            [globalFilterFields]="['name']"
            [showAdd]="false"
            class="block md:hidden"
          >
            <ng-template #listItemTemplate let-item>
              <div
                class="flex align-items-center justify-content-between p-3 border-bottom-1 surface-border"
              >
                <div>
                  <span class="font-bold text-sm block">{{ item.name }}</span>
                  <app-status-badge [status]="item.status" />
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

      <!-- 4. Maestro-Detalle -->
      <div class="col-12 lg:col-6 mb-4">
        <p-card header="Patr�n Maestro-Detalle (Expansi�n de Fila)">
          <p-table
            #dtMaster
            [value]="masterDetailData()"
            dataKey="id"
            styleClass="custom-table custom-table-fixed card hidden md:block"
          >
            <ng-template pTemplate="colgroup">
              <colgroup>
                <col style="width: 3rem" />
                <col class="table-col-40" />
                <col class="table-col-30" />
                <col class="table-col-30" />
              </colgroup>
            </ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 3rem"></th>
                <th>Folio</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row let-expanded="expanded">
              <tr>
                <td>
                  <button
                    type="button"
                    pButton
                    [icon]="
                      expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'
                    "
                    [pRowToggler]="row"
                    class="p-button-text p-button-rounded p-button-plain p-button-sm"
                  ></button>
                </td>
                <td>
                  <strong>{{ row.folio }}</strong
                  ><br /><span class="text-xs text-secondary">{{
                    row.proveedor
                  }}</span>
                </td>
                <td>
                  <strong class="text-primary">{{ row.total }}</strong>
                </td>
                <td><app-status-badge [status]="row.status" /></td>
              </tr>
            </ng-template>
            <ng-template pTemplate="rowexpansion" let-row>
              <tr>
                <td colspan="4" class="bg-sunken p-2">
                  <div
                    class="p-3 surface-card border-round-lg shadow-1 border-1 border-200"
                  >
                    <h4
                      class="m-0 mb-3 text-xs font-bold text-secondary uppercase"
                    >
                      Detalle de Partidas
                    </h4>
                    <p-table
                      [value]="row.partidas"
                      styleClass="p-datatable-sm custom-table-fixed"
                    >
                      <ng-template pTemplate="colgroup">
                        <colgroup>
                          <col class="table-col-70" />
                          <col class="table-col-30" />
                        </colgroup>
                      </ng-template>
                      <ng-template pTemplate="header">
                        <tr>
                          <th>Concepto</th>
                          <th>Subtotal</th>
                        </tr>
                      </ng-template>
                      <ng-template pTemplate="body" let-partida>
                        <tr>
                          <td class="text-xs">{{ partida.concepto }}</td>
                          <td class="text-xs font-bold">
                            {{ partida.subtotal }}
                          </td>
                        </tr>
                      </ng-template>
                    </p-table>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>

          <app-data-view-mobile
            [data]="masterDetailData()"
            [dt]="dtMaster"
            [showAdd]="false"
            class="block md:hidden"
          >
            <ng-template #listItemTemplate let-row>
              <div class="flex flex-column p-3 border-bottom-1 surface-border">
                <div
                  class="flex justify-content-between align-items-center mb-2"
                >
                  <div>
                    <span class="font-bold text-sm block">{{ row.folio }}</span>
                    <span class="text-xs text-secondary">{{
                      row.proveedor
                    }}</span>
                  </div>
                  <app-status-badge [status]="row.status" />
                </div>
                <div class="flex justify-content-between align-items-center">
                  <strong class="text-primary">{{ row.total }}</strong>
                  <p-button
                    label="Ver Detalles"
                    icon="mdi:chevron-right"
                    iconPos="right"
                    [text]="true"
                    size="small"
                  />
                </div>
              </div>
            </ng-template>
          </app-data-view-mobile>
        </p-card>
      </div>

      <!-- 5. Tarjetas Complejas -->
      <div class="col-12">
        <p-card header="Tarjetas Complejas e Indicadores R�pidos">
          <div class="grid">
            @for (item of complexDataExample; track item.id) {
              <div class="col-12 md:col-6">
                <div
                  class="surface-card shadow-1 border-round-lg overflow-hidden border-left-3 p-3"
                  [class]="'border-' + item.color + '-500'"
                >
                  <div
                    class="flex justify-content-between align-items-start mb-2"
                  >
                    <div>
                      <h3 class="m-0 font-bold text-lg">{{ item.name }}</h3>
                      <span class="text-xs text-secondary">{{
                        item.folio
                      }}</span>
                    </div>
                    <app-action-menu
                      ><custom-button-edit /><custom-button-delete
                    /></app-action-menu>
                  </div>
                  <div class="flex align-items-center gap-2 mb-3">
                    <ion-icon
                      [name]="item.icon"
                      [color]="item.color"
                      class="text-xl"
                    ></ion-icon>
                    <span class="text-xl font-bold">{{
                      item.consumption
                    }}</span>
                  </div>
                  <div
                    class="flex justify-content-between align-items-center pt-2 border-top-1 surface-border"
                  >
                    <app-status-badge [status]="item.status" />
                    <p-button
                      label="Ver Historial"
                      size="small"
                      [text]="true"
                    />
                  </div>
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [
    `
      .bg-sunken {
        background-color: var(--ds-bg-sunken);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PatternsKpi {
  isDarkMode = input<boolean>(false);
  filterForm = input<FormGroup>();
  tableData = input<any[]>([]);
  deptoOptions = input<any[]>([]);
  statusOptions = input<any[]>([]);

  masterDetailData = signal<any[]>([
    {
      id: 101,
      folio: "FAC-2026-004",
      proveedor: "Construcciones y Acabados del Centro S.A. de C.V.",
      fecha: "12-Jun-26",
      total: "$150,000.00 MXN",
      status: EStatus.Concluido,
      partidas: [
        {
          concepto: "Cemento Tolteca Gris 50kg (Sacos)",
          cantidad: 100,
          precioUnitario: "$220.00",
          subtotal: "$22,000.00",
        },
        {
          concepto: "Varilla de Acero 3/8'' (Toneladas)",
          cantidad: 5,
          precioUnitario: "$25,600.00",
          subtotal: "$128,000.00",
        },
      ],
    },
  ]);

  readonly complexDataExample = [
    {
      id: 1,
      name: "Medidor El�ctrico A1",
      folio: "E-1002",
      consumption: "120 kWh",
      status: EStatus.Concluido,
      icon: "mdi:flash-outline",
      color: "success",
    },
    {
      id: 2,
      name: "Medidor Agua Central",
      folio: "W-2005",
      consumption: "45 m³",
      status: EStatus.Proceso,
      icon: "mdi:water-outline",
      color: "primary",
    },
  ];

  EStatus = EStatus;

  trackById(index: number, item: any): number {
    return item.id;
  }
}

import { CommonModule } from "@angular/common";
import { Component, input, ViewEncapsulation } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from "@angular/forms";
import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { DividerModule } from "primeng/divider";

import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web";
import { CustomBtnActiveDesactive } from "src/app/core/components/buttons/web";
import {
  CustomButtonEdit,
  CustomButtonDelete,
} from "src/app/core/components/buttons/web";
import { ActionIconsGroupComponent } from "src/app/core/components/action-icons-group/action-icons-group.component";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  EStatus as StatusEnum,
  StatusBadge,
} from "src/app/core/components/status-badge/status-badge";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-web-tables",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    PrimeNgCustomCaption,
    CustomInputSelectSignal,
    CustomBtnActiveDesactive,
    CustomButtonEdit,
    CustomButtonDelete,
    ActionIconsGroupComponent,
    ActionMenu,
    StatusBadge,
    DataViewMobile,
  ],
  template: `
    <p-card header="Tabla Híbrida con Toolbar Alineado y Columnas Fijas">
      <div class="flex flex-column md:flex-row md:align-items-center justify-content-between p-2 gap-2 surface-ground border-round mb-3">
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
            <custom-button-active-desactive
              [state]="true"
            />
          </div>
        </div>
      </div>

      <p-table #dt [value]="tableData()" styleClass="custom-table custom-table-fixed card hidden md:block" [globalFilterFields]="['name']">
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
            <th>Elemento (Ajuste automático de texto)</th>
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
              <span class="block text-xs text-secondary mt-1 line-height-2">Este texto largo simula una descripción del insumo que debe hacer salto de línea automático de forma fluida y sin desbordar la tabla.</span>
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
          <div class="flex align-items-center justify-content-between p-3 border-bottom-1 surface-border">
            <div>
              <span class="font-bold text-sm block">{{ item.name }}</span>
              <app-status-badge [status]="item.status" />
            </div>
            <app-action-menu>
              <p-button label="Editar" icon="mdi:pencil" [text]="true" />
              <p-button label="Eliminar" icon="mdi:trash-can" [text]="true" severity="danger" />
            </app-action-menu>
          </div>
        </ng-template>
      </app-data-view-mobile>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebTables {
  filterForm = input<FormGroup>();
  tableData = input<any[]>([]);
  statusOptions = input<any[]>([]);
  deptoOptions = input<any[]>([]);
  EStatus = input<typeof StatusEnum>();
}

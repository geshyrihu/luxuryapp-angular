import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CurrencyMexicoPipe } from "src/app/shared/pipes/currencyMexico.pipe";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";
import { MantenimientoPreventivoForm } from "src/app/apps/operations.luxuryapp/google-calendar/calendar/mantenimiento-preventivo/mantenimiento-preventivo-form";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

interface Equipo {
  id: any;
  nameMachinery: string;
  maintenanceCalendar: {
    id: any;
    machineryId: any;
    activity: string;
    month: string;
    anio: number;
    price: number;
    recurrence: string;
    nameProvider: string;
    hasServiceOrder?: boolean;
  }[];
}

@Component({
  selector: "app-mantenimientos-dialog",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CurrencyMexicoPipe,
    SanitizeHtmlPipe,
    WebButtonLabel,
    WebButtonIconDelete,
    WebButtonIconEdit,
    WebButtonIconItem,
  ],
  template: `
    @if (equipo) {
    <div class="flex justify-content-end mb-3">
      @if (aspRoleS.hasAny([AspRole.JefeMantenimiento, AspRole.Administrador,
      AspRole.SuperUsuario])) {
      <il-button
        label="Agregar"
        iconClass="mdi:plus"
        (clicked)="onAddMantenimiento()"
      />
      }
    </div>

    @if (equipo.maintenanceCalendar?.length > 0) {
    <p-table [value]="equipo.maintenanceCalendar" class="custom-table">
      <ng-template #header>
        <tr>
          <th class="table-col-5"></th>
          <th>ACTIVIDAD</th>
          <th>PROVEEDOR</th>
          <th>RECURRENCIA</th>
          <th>MES</th>
          <th>COSTO</th>
          @if (aspRoleS.hasAny([AspRole.JefeMantenimiento,
          AspRole.Administrador, AspRole.SuperUsuario])) {
          <th class="table-col-10"></th>
          }
        </tr>
      </ng-template>
      <ng-template #body let-order>
        <tr class="animate__fadeIn">
          <td>
            <span [innerHTML]="order.hasServiceOrder ? '🛠️' : '⚪'"></span>
          </td>
          <td>
            <p
              class="mr-2 text-justify"
              [innerHTML]="order.activity | sanitizeHtml"
            ></p>
          </td>
          <td>{{ order.nameProvider }}</td>
          <td>{{ order.recurrence }}</td>
          <td>{{ order.month }}</td>
          <td>{{ order.price | CurrencyMexicoPipe }}</td>
          @if (aspRoleS.hasAny([AspRole.JefeMantenimiento,
          AspRole.Administrador, AspRole.SuperUsuario])) {
          <td>
            <div class="flex">
              <iw-button-item
                iconClass="mdi:content-copy"
                lxTooltip="Duplicar"
                tooltipPosition="top"
                variant="text"
                (clicked)="onCopyMantenimiento(order)"
              />
              <iw-button-edit (clicked)="onEditMantenimiento(order)" />
              <iw-button-delete
                (confirmed)="onDeleteMantenimiento(order.id)"
                [isLinked]="order.hasServiceOrder"
              />
            </div>
          </td>
          }
        </tr>
      </ng-template>
      <ng-template #emptymessage>
        <primeng-custom-table-emptymessage [colspan]="13" />
      </ng-template>
    </p-table>
    } @else {
    <div class="text-center text-500 p-4 surface-100 rounded italic">
      Sin servicios de Mantenimiento registrados.
    </div>
    } }
  `,
})
export class MantenimientosDialog {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  aspRoleS = inject(AspRoleService);
  apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  public AspRole = ApplicationRole;
  equipo: Equipo;

  ngOnInit() {
    this.equipo = this.config.data;
  }

  onAddMantenimiento() {
    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        { id: 0, task: "create", idMachinery: this.equipo.id },
        "Nuevo Servicio",
        this.dialogHandlerS.sizeFull,
      )
      .then((result) => {
        if (result) {
          this.ref.close(true);
        }
      });
  }

  onCopyMantenimiento(order: any) {
    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        { id: order.id, task: "copy", idMachinery: order.machineryId },
        "Duplicar Actividad",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) {
          this.ref.close(true);
        }
      });
  }

  onEditMantenimiento(order: any) {
    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        { id: order.id, task: "edit", idMachinery: order.machineryId },
        "Editar Servicio",
        this.dialogHandlerS.sizeFull,
      )
      .then((result) => {
        if (result) {
          this.ref.close(true);
        }
      });
  }

  onDeleteMantenimiento(orderId: any) {
    this.apiResponseS
      .onDelete(Endpoints.MaintenanceCalendars.delete(orderId))
      .then(() => {
        this.ref.close(true);
      });
  }
}

import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ContMinutaSeguimientos } from "src/app/features/accounting/general-ledger/contabilidad/pendientes-minuta/cont-minuta-seguimientos";
import { MeetingSeguimientoEdit } from "./meeting-seguimiento-edit";
import { MinutaDetalleForm } from "./minuta-detalle-form";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
@Component({
  selector: "app-seguimiento-minutas",
  templateUrl: "./seguimiento-minutas.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelItem,
    CommonModule,
    TableModule,
    WebButtonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    SanitizeHtmlPipe,
    DataViewMobile,
    TagModule,
    AppIcon,
  ],
})
export class SeguimientoMinuta {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  statusFiltro: number = 0;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(this.statusFiltro);
      }
    });
  }

  onLoadData(filtro: number) {
    this.apiResponseS
      .onGetList(
        Endpoints.Meetings.seguimientoMinutas(
          this.customerIdS.customerId(),
          filtro,
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onModalFormSeguimiento(meetingDetailsId: any, idMeetingSeguimiento: any) {
    this.dialogHandlerS
      .openDialog(
        MeetingSeguimientoEdit,
        {
          meetingDetailsId,
          idMeetingSeguimiento,
        },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.statusFiltro);
      });
  }

  onModalFormMinutaDetalle(data: any) {
    this.dialogHandlerS
      .openDialog(
        MinutaDetalleForm,
        {
          id: data.id,
          areaResponsable: data.areaResponsable,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.statusFiltro);
      });
  }

  onDeleteSeguimiento(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.MeetingDetailsTracking.delete(id))
      .then(() => {
        this.onLoadData(this.statusFiltro);
      });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.dialogHandlerS
      .openDialog(
        ContMinutaSeguimientos,
        {
          idItem,
        },
        "Seguimientos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.statusFiltro);
      });
  }
  onFiltrarData(filtro: number) {
    this.statusFiltro = filtro;
    this.onLoadData(filtro);
  }
}

import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web/label";
import { WebButtonLabelTracking } from "src/app/core/components/buttons/web/label/button-tracking";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TicketLegalActualizarEstado } from "./ticket-legal-actualizar-estado";
import { TicketLegalFormCliente } from "./ticket-legal-form-cliente";
import { TicketLegalSeguimientoCliente } from "./ticket-legal-seguimiento-cliente";
import { TicketLegalSeguimientoSolicitudDetalle } from "./ticket-legal-seguimiento-solicitud-detalle";

@Component({
  selector: "app-ticket-legal-lista-cliente",
  templateUrl: "./ticket-legal-lista-cliente.html",
  imports: [
    EmptyState,
    TableModule,
    TagModule,
    TooltipModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonLabelTracking,
    ActionMenu,
    DataViewMobile,
    CardModule,
    WebButtonLabelItem,
  ],
})
export class TicketLegalListaCliente implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalByCustomer)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(TicketLegalFormCliente, data, "", this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalUpdateStatus(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketLegalActualizarEstado,
        data,
        "",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalSeguimientoCliente(data: any) {
    this.dialogHandlerS.openDialog(
      TicketLegalSeguimientoCliente,
      data,
      "",
      this.dialogHandlerS.sizeLg,
    );
  }

  onModalViewDetail(data: any) {
    this.dialogHandlerS.openDialog(
      TicketLegalSeguimientoSolicitudDetalle,
      data,
      "Detalle",
      this.dialogHandlerS.sizeLg,
    );
  }
}

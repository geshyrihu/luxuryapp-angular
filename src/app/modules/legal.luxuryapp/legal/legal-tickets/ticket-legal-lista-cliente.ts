import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxBadge } from "@ui/adaptive/badge/badge";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { TicketLegalActualizarEstado } from "./ticket-legal-actualizar-estado";
import { TicketLegalFormCliente } from "./ticket-legal-form-cliente";
import { TicketLegalSeguimientoCliente } from "./ticket-legal-seguimiento-cliente";
import { TicketLegalSeguimientoSolicitudDetalle } from "./ticket-legal-seguimiento-solicitud-detalle";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconTracking } from "@ui/buttons/web-icon/button-tracking";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-ticket-legal-lista-cliente",
  templateUrl: "./ticket-legal-lista-cliente.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconTracking,
    MobileActionMenu,
    MobileButtonLabelItem,
    TableEmptyMessage,
    AppTable,
    LxTooltipDirective,
    LxTag,
    LxBadge,
    LuxTableCaption,
    TableFooter,

    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class TicketLegalListaCliente implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
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
      .openDialog(TicketLegalFormCliente, data, "", this.dialogHandlerS.sizeXl)
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
        this.dialogHandlerS.sizeXl,
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
      this.dialogHandlerS.sizeXl,
    );
  }

  onModalViewDetail(data: any) {
    this.dialogHandlerS.openDialog(
      TicketLegalSeguimientoSolicitudDetalle,
      data,
      "Detalle",
      this.dialogHandlerS.sizeXl,
    );
  }
}

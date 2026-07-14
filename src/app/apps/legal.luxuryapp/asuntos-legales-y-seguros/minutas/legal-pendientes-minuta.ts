import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelAdd } from "@ui/buttons/mobile-label/button-add";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonLabelItem } from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { MeetingSeguimientoEdit } from "src/app/apps/direccion.luxuryapp/juntas-comite/junta-comite-minutas/meeting-seguimiento-edit";
import { MinutaDetalleForm } from "src/app/apps/direccion.luxuryapp/juntas-comite/junta-comite-minutas/minuta-detalle-form";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";
import { ContMinutaSeguimientos } from "../../../../apps/contabilidad.luxuryapp/general-ledger/pendientes-minuta/cont-minuta-seguimientos";
// import { ContMinutaSeguimientos } from "../../../accounting/general-ledger/pendientes-minuta/cont-minuta-seguimientos";

@Component({
  selector: "app-legal-pendientes-minuta",
  templateUrl: "./legal-pendientes-minuta.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelAdd,
    MobileButtonLabelEdit,
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelEdit,
    WebButtonLabelAdd,
    CommonModule,
    TableModule,
    WebButtonLabel,
    LxTag,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    DataViewMobile,
    SanitizeHtmlPipe,

    WebButtonLabelItem,
    MobileListItem,
    AppIcon,
  ],
})
export class LegalPendientesMinuta implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  statusFiltro: number = 4;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.LegalMinutes.pendingByUserAndStatus(
          this.authS.userToken.infoUserAuthDTO.applicationUserId,
          this.statusFiltro,
        ),
      )
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onModalFormSeguimiento(meetingDetailsId: any, idMeetingSeguimiento: any) {
    this.dialogHandlerS
      .openDialog(
        MeetingSeguimientoEdit,
        {
          meetingDetailsId,
          idMeetingSeguimiento,
        },
        "Agregar Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
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
        if (result) this.onLoadData();
      });
  }

  onDeleteSeguimiento(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.MeetingDetailsTracking.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((current) =>
            current.filter((item) => item.id !== id),
          );
      });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.dialogHandlerS.openDialog(
      ContMinutaSeguimientos,
      {
        idItem,
      },
      "Seguimientos",
      this.dialogHandlerS.sizeLg,
    );
  }
  onFiltrarData(valorFiltro: number) {
    this.statusFiltro = valorFiltro;
    this.onLoadData();
  }
}

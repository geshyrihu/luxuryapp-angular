import { ContMinutaSeguimientos } from "@accounting.luxuryapp/general-ledger/pending-minutes/cont-minuta-seguimientos";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { MeetingSeguimientoEdit } from "@management.luxuryapp/monthly-meetings/meeting-minutes/meeting-seguimiento-edit";
import { MinutaDetalleForm } from "@management.luxuryapp/monthly-meetings/meeting-minutes/minuta-detalle-form";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
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
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";

@Component({
  selector: "app-legal-pendientes-minuta",
  templateUrl: "./legal-pendientes-minuta.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelAdd,
    MobileButtonLabelEdit,
    TableEmptyMessage,
    WebButtonLabelEdit,
    WebButtonLabelAdd,
    CommonModule,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    WebButtonLabel,
    LxTag,
    TableCaption,
    TableFooter,
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
  tableRows: number = tableRows();
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

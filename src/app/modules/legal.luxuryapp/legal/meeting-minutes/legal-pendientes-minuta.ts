import { ContMinutaSeguimientos } from "@accounting.luxuryapp/general-ledger/pending-minutes/cont-minuta-seguimientos";
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
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { MeetingSeguimientoEdit } from "@management.luxuryapp/monthly-meetings/meeting-minutes/meeting-seguimiento-edit";
import { MinutaDetalleForm } from "@management.luxuryapp/monthly-meetings/meeting-minutes/minuta-detalle-form";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { LegalPendientesMinutaDesktop } from "./desktop/legal-pendientes-minuta-desktop";
import { LegalPendientesMinutaMobile } from "./mobile/legal-pendientes-minuta-mobile";

@Component({
  selector: "app-legal-pendientes-minuta",
  templateUrl: "./legal-pendientes-minuta.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonLabel,
    LegalPendientesMinutaDesktop,
    LegalPendientesMinutaMobile,
  ],
})
export class LegalPendientesMinuta implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;
  statusFiltro: number = 4;

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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
      this.dialogHandlerS.sizeXl,
    );
  }
  onFiltrarData(valorFiltro: number) {
    this.statusFiltro = valorFiltro;
    this.onLoadData();
  }
}

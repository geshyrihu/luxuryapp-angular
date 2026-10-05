import { ContMinutaSeguimientos } from "@accounting.luxuryapp/general-ledger/pending-minutes/cont-minuta-seguimientos";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
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
import { PlatformService } from "@core/services/platform.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { SeguimientoMinutasDesktop } from "./desktop/seguimiento-minutas-desktop";
import { MeetingSeguimientoEdit } from "./meeting-seguimiento-edit";
import { MinutaDetalleForm } from "./minuta-detalle-form";
import { SeguimientoMinutasMobile } from "./mobile/seguimiento-minutas-mobile";

@Component({
  selector: "app-seguimiento-minutas",
  templateUrl: "./seguimiento-minutas.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SeguimientoMinutasDesktop, SeguimientoMinutasMobile],
})
export class SeguimientoMinuta {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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

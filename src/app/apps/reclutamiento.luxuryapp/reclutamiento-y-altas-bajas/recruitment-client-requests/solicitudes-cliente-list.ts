import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { addIcons } from "ionicons";
import { peopleOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";

import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SolicitudAltaForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/recruitment-requests/components/solicitud-alta-form";
import { SolicitudBajaForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/request-dismissal/components/solicitud-baja-form";
import { SolicitudModificacionSalarioForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/salary-modification/components/solicitud-modificacion-salario-form";
import { VacanteForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/components/vacante-form";
import { ROUTES } from "src/app/routing/route-paths";

@Component({
  selector: "app-solicitudes-cliente-list",
  templateUrl: "./solicitudes-cliente-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconItem,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    LxTag,
    MobileListItem,
    AppIcon,
  ],
})
export class SolicitudesClienteList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  router = inject(Router);
  authS = inject(AuthService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef; // Referencia a un cuadro de diólogo modal
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ peopleOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  // Si es administrador vamos a evitar que traiga todas las solicitudes que sean de administrador y asisntente

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const applicationUserId = this.authS.infoUserAuth.applicationUserId;
    const urlApi = `SolicitudesReclutamiento/solicitudesporcliente/${customerId}/${applicationUserId}`;
    // const urlApi =
    //   "SolicitudesReclutamiento/solicitudesporcliente/" +
    //   customerId +
    //   "/" +
    //   applicationUserId;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onRouteEstatusSolicitud(id) {
    this.statusSolicitudVacanteService.setPositionRequestId(id);
    this.router.navigate(ROUTES.RECLUTAMIENTO.STATUS_SOLICITUD_VACANTE);
  }
  onModalEditVacante(data: any) {
    this.dialogHandlerS
      .openDialog(
        VacanteForm,
        {
          id: data.id,
        },
        "Editar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditSolicitudAlta(data: any) {
    this.dialogHandlerS
      .openDialog(
        SolicitudAltaForm,
        {
          id: data.id,
        },
        "Editar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditSolicitudBaja(data: any) {
    this.dialogHandlerS
      .openDialog(
        SolicitudBajaForm,
        {
          id: data.id,
        },
        "Editar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditModificacionSalario(data: any) {
    this.dialogHandlerS
      .openDialog(
        SolicitudModificacionSalarioForm,
        {
          id: data.id,
        },
        "Editar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  getTagSeverity(
    status: string,
  ): "success" | "warning" | "danger" | "secondary" {
    switch (status) {
      case "Concluido":
        return "success";
      case "Proceso":
      case "Pendiente":
        return "warning";
      case "Cancelado":
        return "danger";
      default:
        return "secondary";
    }
  }
}

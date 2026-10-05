import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SolicitudBajaForm } from "@operations.luxuryapp/recruitment-requests/dismissal-requests/solicitud-baja-form";
import { SolicitudModificacionSalarioForm } from "@operations.luxuryapp/recruitment-requests/salary-modification-requests/solicitud-modificacion-salario-form";
import { SolicitudAltaForm } from "@recruitment.luxuryapp/employee-registration-requests/solicitud-alta-form";
import { StatusSolicitudVacanteService } from "@recruitment.luxuryapp/vacancy-requests/services/status-solicitud-vacante.service";
import { VacanteForm } from "@recruitment.luxuryapp/vacancy-requests/vacante-form";
import { addIcons } from "ionicons";
import { peopleOutline } from "ionicons/icons";
import { ROUTES } from "src/app/routing/route-paths";
import { SolicitudesClienteListDesktop } from "./desktop/solicitudes-cliente-list-desktop";
import { SolicitudesClienteListMobile } from "./mobile/solicitudes-cliente-list-mobile";

@Component({
  selector: "app-solicitudes-cliente-list",
  templateUrl: "./solicitudes-cliente-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SolicitudesClienteListDesktop, SolicitudesClienteListMobile],
})
export class SolicitudesClienteList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  router = inject(Router);
  authS = inject(AuthService);
  platformS = inject(PlatformService);
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

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
    const urlApi =
      EndpointsReclutamiento.RecruitmentRequests.solicitudesPorCliente(
        customerId,
        applicationUserId,
      );
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

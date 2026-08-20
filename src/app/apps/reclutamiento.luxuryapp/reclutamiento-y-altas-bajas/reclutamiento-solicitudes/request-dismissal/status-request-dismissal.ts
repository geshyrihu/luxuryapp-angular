import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { SolicitudBajaForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/request-dismissal/solicitud-baja-form";
import { CardEmployee } from "src/app/shared/integration/recursos-humanos";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { ROUTES } from "src/app/routing/route-paths";
import { PhoneFormatPipe } from "src/app/shared/pipes/phone-format.pipe";
import { StatusRequestDismissalDiscountForm } from "../../request-dismissal-discount/status-request-dismissal-discount-form";

interface RequestDismissalStatusDetail {
  id: string;
  title?: string;
}

@Component({
  selector: "app-status-request-dismissal",
  templateUrl: "./status-request-dismissal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    NgbTooltipModule,
    WebButtonLabelConfirm,
    PhoneFormatPipe,
  ],
})
export class StatusRequestDismissal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);

  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  ref: DynamicDialogRef;

  dataSignal = signal<RequestDismissalStatusDetail | null>(null);
  noCandidates: boolean = true;
  applicationUserId: string = this.authS.infoUserAuth.applicationUserId;
  public AspRole = ApplicationRole;

  ngOnInit() {
    if (this.workPositionId === null) {
      this.router.navigate(ROUTES.RECLUTAMIENTO.PLANTILLA_INTERNA);
    }
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestDismissal.sendEmail(
      this.workPositionId,
    );
    this.apiResponseS
      .onGetItem<RequestDismissalStatusDetail>(urlApi)
      .then((result) => {
      this.dataSignal.set(result);
    });
  }

  //Ver tarjeta de Colaborador
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS
      .openDialog(
        CardEmployee,
        {
          applicationUserId,
        },
        "Tarjeta de Colaborador",
        this.dialogHandlerS.sizeSm,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  //Editar solicitud de baja
  onModalForm(data: RequestDismissalStatusDetail) {
    this.dialogHandlerS
      .openDialog(
        SolicitudBajaForm,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  onDelete(id: string) {
    this.apiResponseS
      .onDelete(EndpointsReclutamiento.RequestDismissal.delete(id))
      .then((result: boolean) => {
        if (result) {
          // Si es un objeto ónico y se borra, recargar o limpiar
          this.onLoadData();
        }
      });
  }

  //Autorizar baja
  onAuthorize(department: string) {
    const urlApi = EndpointsReclutamiento.RequestDismissal.authorize(
      this.dataSignal().id,
      department,
    );
    this.apiResponseS.onPatch(urlApi, {}).then((result: boolean) => {
      if (result) this.onLoadData();
    });
  }
  //Editar solicitud de Discounts
  onModalFormDiscounts(data: RequestDismissalStatusDetail) {
    this.dialogHandlerS
      .openDialog(
        StatusRequestDismissalDiscountForm,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  onDeleteDiscounts(id: string) {
    const urlApi = EndpointsReclutamiento.RequestDismissalDiscount.delete(id);
    this.apiResponseS.onDelete(urlApi).then(() => {
      this.onLoadData();
    });
  }
}

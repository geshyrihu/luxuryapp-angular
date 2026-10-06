import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SolicitudBajaForm } from "@operations.luxuryapp/recruitment-requests/dismissal-requests/solicitud-baja-form";
import { StatusSolicitudVacanteService } from "@recruitment.luxuryapp/vacancy-requests/services/status-solicitud-vacante.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ROUTES } from "src/app/routing/route-paths";
import { StatusRequestDismissalDiscountForm } from "../recruitment-requests/request-dismissal-discount/status-request-dismissal-discount-form";

interface RequestDismissalStatusDetail {
  id: string;
  title?: string;
}

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-status-request-dismissal",
  templateUrl: "./status-request-dismissal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ButtonWeb,
    LxTooltipDirective,
    NgbTooltipModule,
  ],
})
export class StatusRequestDismissal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  swalS = inject(SwalService);
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  async onDelete(id: string) {
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "¿Está seguro de eliminar esta solicitud de baja?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
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
  async onAuthorize(department: string) {
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "¿Está seguro de continuar?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
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
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Eliminar solicitud de baja
  async onDeleteDiscounts(id: string) {
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "¿Está seguro de eliminar este descuento?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
    const urlApi = EndpointsReclutamiento.RequestDismissalDiscount.delete(id);
    this.apiResponseS.onDelete(urlApi).then(() => {
      this.onLoadData();
    });
  }
}

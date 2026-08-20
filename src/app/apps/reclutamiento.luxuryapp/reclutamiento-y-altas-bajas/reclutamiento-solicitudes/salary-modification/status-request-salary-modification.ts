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
import { StatusRequestSalaryModificationForm } from "./status-request-salary-modification-form";

interface RequestSalaryModificationStatusDetail {
  id: string;
  title?: string;
}

@Component({
  selector: "app-status-request-salary-modification",
  templateUrl: "./status-request-salary-modification.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    NgbTooltipModule,
    WebButtonLabelConfirm,
  ],
})
export class StatusRequestSalaryModification implements OnInit {
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  employeeId = this.statusSolicitudVacanteService.getemployeeId();
  ref: DynamicDialogRef;

  dataSignal = signal<RequestSalaryModificationStatusDetail | null>(null);
  noCandidates: boolean = true;
  applicationUserId: string = this.authS.infoUserAuth.applicationUserId;
  public AspRole = ApplicationRole;

  ngOnInit() {
    if (this.workPositionId === null || this.employeeId === null) {
      this.router.navigate(ROUTES.RECLUTAMIENTO.PLANTILLA_INTERNA);
    }
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestSalaryModification.getStatus(
      this.workPositionId,
      this.employeeId,
    );
    this.apiResponseS
      .onGetList<RequestSalaryModificationStatusDetail>(urlApi)
      .then((result) => this.dataSignal.set(result));
  }

  //Ver tarjeta de Colaborador
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployee,
      {
        applicationUserId,
      },
      "Tarjeta de colaborador",
      this.dialogHandlerS.sizeSm,
    );
  }

  //Editar solicitud de baja
  onModalForm(data: RequestSalaryModificationStatusDetail) {
    this.dialogHandlerS
      .openDialog(
        StatusRequestSalaryModificationForm,
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
      .onDelete(EndpointsReclutamiento.RequestSalaryModification.delete(id))
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

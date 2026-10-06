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
import { StatusSolicitudVacanteService } from "@recruitment.luxuryapp/vacancy-requests/services/status-solicitud-vacante.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ROUTES } from "src/app/routing/route-paths";
import { StatusRequestSalaryModificationForm } from "./status-request-salary-modification-form";

interface RequestSalaryModificationStatusDetail {
  id: string;
  title?: string;
}

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-status-request-salary-modification",
  templateUrl: "./status-request-salary-modification.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ButtonWeb,
    LxTooltipDirective,
    NgbTooltipModule,
  ],
})
export class StatusRequestSalaryModification implements OnInit {
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  apiResponseS = inject(ApiResponseService);
  swalS = inject(SwalService);
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
      this.dialogHandlerS.sizeXl,
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
      text: "¿Está seguro de eliminar esta solicitud?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
    this.apiResponseS
      .onDelete(EndpointsReclutamiento.RequestSalaryModification.delete(id))
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

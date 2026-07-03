import { Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { WebButtonLabelConfirm } from "src/app/core/components/buttons/web/label/button-confirm";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { CardEmployee } from "src/app/features/hr/expediente-del-empleado/employees/employees/pages/card-employee";
import { StatusRequestSalaryModificationForm } from "./status-request-salary-modification-form";
@Component({
  selector: "app-status-request-salary-modification",
  templateUrl: "./status-request-salary-modification.html",
  imports: [CardModule, NgbTooltipModule, WebButtonLabel, WebButtonLabelConfirm],
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

  dataSignal = signal<any>(null);
  noCandidates: boolean = true;
  applicationUserId: string = this.authS.infoUserAuth.applicationUserId;
  public AspRole = EApplicationRole;

  ngOnInit() {
    if (this.workPositionId === null || this.employeeId === null) {
      this.router.navigate(ROUTES.RECLUTAMIENTO.PLANTILLA_INTERNA);
    }
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `RequestSalaryModification/${this.workPositionId}/${this.employeeId}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
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
  onModalForm(data: any) {
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
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`RequestSalaryModification/${id}`)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

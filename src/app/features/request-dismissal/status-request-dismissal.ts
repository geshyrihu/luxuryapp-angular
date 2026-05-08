import { Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonConfirm } from "src/app/core/components/buttons/web/custom-button-confirm";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { PhoneFormatPipe } from "src/app/core/pipes/phone-format.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { CardEmployee } from "src/app/features/employees/employees/pages/card-employee";
import { SolicitudBajaForm } from "src/app/features/request-dismissal/components/solicitud-baja-form";
import { StatusRequestDismissalDiscountForm } from "../request-dismissal-discount/status-request-dismissal-discount-form";
@Component({
  selector: "app-status-request-dismissal",
  templateUrl: "./status-request-dismissal.html",
  imports: [
    CardModule,
    NgbTooltipModule,
    CustomButton,
    CustomButtonConfirm,
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

  dataSignal = signal<any>(null);
  noCandidates: boolean = true;
  applicationUserId: string = this.authS.infoUserAuth.applicationUserId;
  public AspRole = EApplicationRole;

  ngOnInit() {
    if (this.workPositionId === null) {
      this.router.navigateByUrl("/reclutamiento/plantilla-interna");
    }
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = "RequestDismissal/" + this.workPositionId;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
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
  onModalForm(data: any) {
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
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`RequestDismissal/${id}`)
      .then((result: boolean) => {
        if (result) {
          // Si es un objeto ónico y se borra, recargar o limpiar
          this.onLoadData();
        }
      });
  }
  //Editar solicitud de Discounts
  onModalFormDiscounts(data: any) {
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
  onDeleteDiscounts(id: any) {
    const urlApi = `RequestDismissalDiscount/${id}`;
    this.apiResponseS.onDelete(urlApi).then(() => {
      this.onLoadData();
    });
  }
}










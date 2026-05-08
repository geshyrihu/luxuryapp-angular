import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CardModule } from "primeng/card";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { FieldsetModule } from "primeng/fieldset";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import {
  IonButtonConfirm,
  IonButtonViewPdf,
} from "src/app/core/components/buttons/mobile";
import { CustomButtonConfirm } from "src/app/core/components/buttons/web/custom-button-confirm";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PresentacionJuntaAdd } from "./presentacion-junta-add";
import { PresentacionJuntaComiteForm } from "./presentacion-junta-comite-form";
@Component({
  selector: "app-presentacion-junta-comite",
  templateUrl: "./presentacion-junta-comite.html",
  imports: [
    CommonModule,
    TableModule,
    CustomButton,
    NgbTooltipModule,
    TooltipModule,
    TagModule,
    FieldsetModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonConfirm,
    CustomButtonViewPdf,
    CardModule,
    IonButtonConfirm,

    IonButtonViewPdf,
  ],
})
export class PresentacionJuntaComite {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  confirmationService = inject(ConfirmationService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  public AspRole = EApplicationRole;

  ref: DynamicDialogRef;
  applicationUserId: string =
    this.authS.userToken.infoUserAuthDTO.applicationUserId;

  dataSignal = signal<PresentacionJuntaComiteDTO[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);

  supervisorContable: boolean = false;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  hasRole(roles: EApplicationRole[]): boolean {
    return this.aspRoleS.hasAny(roles);
  }

  onValidarId(userId: string): boolean {
    return userId === this.authS.applicationUserId;
  }

  onLoadData(): void {
    const urlApi = `PresentacionJuntaComite/list/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PresentacionJuntaComiteForm,
        {
          id: data.id,
          titulo: data.titulo,
        },
        data.titulo,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  showModalAdd(data: any) {
    this.dialogHandlerS
      .openDialog(
        PresentacionJuntaAdd,
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

  // Eliminar pdf
  onDeleteFile(id: any, area: string) {
    const urlApi = `PresentacionJuntaComite/${id}/${area}`;
    this.apiResponseS.onDelete(urlApi).then((result: boolean) => {
      if (result) this.onLoadData();
    });
  }
  // Eliminar registro completo
  onDeleteItem(id: any) {
    const urlApi = `PresentacionJuntaComite/${id}`;
    this.apiResponseS.onDelete(urlApi).then((result: boolean) => {
      if (result) this.onLoadData();
    });
  }

  onValidarPresentacion(id: any) {
    const urlApi = `PresentacionJuntaComite/AutorizarPresentacion/${id}/${this.authS.applicationUserId}`;
    this.apiResponseS.onPost(urlApi).then((result: boolean) => {
      if (result) {
        this.enviarMailPresentacionComite(id);
        this.onLoadData();
      }
    });
  }

  onOnlyValidate(id: any) {
    const urlApi = `PresentacionJuntaComite/AutorizarPresentacion/${id}/${this.authS.applicationUserId}`;
    this.apiResponseS.onPost(urlApi).then((result: boolean) => {
      if (result) {
        this.onLoadData();
      }
    });
  }

  onValidarCargasCompletasPorArea(
    portada: string,
    contabilidad: string,
    operaciones: string,
  ): boolean {
    return portada !== "" && contabilidad !== "" && operaciones !== "";
  }

  enviarMailPresentacionComite(idJunta: number) {
    const urlApi = `SendEmail/PresentacionFinalComite/${idJunta}`;
    this.apiResponseS.onPost(urlApi).then(() => {
      this.onLoadData();
    });
  }
}
export interface PresentacionJuntaComiteDTO {
  id: any;
  fechaCorrespondienteFiltro: string;
  fechaCorrespondiente: string;
  fechaJunta: string;
  fechaJuntaFiltro: string;
  archivoPortada: string;
  applicationUserPortada: string;
  fechaCargaPortada: string;
  archivoContable: string;
  applicationUserContable: string;
  fechaCargaContable: string;
  archivoJunta: string;
  applicationUser: string;
  fechaCarga: string;
  archivoFinal: string;
  applicationUserSupervisor: string;
  fechaCargaSupervisor: string;
  enviadoComite: boolean;
}










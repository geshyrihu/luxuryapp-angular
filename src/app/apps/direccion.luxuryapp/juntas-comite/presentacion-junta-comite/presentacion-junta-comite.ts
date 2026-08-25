import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { LxTag } from "@ui/adaptive/tag/tag";
import {
  WebButtonLabelConfirm,
  WebButtonLabelViewPdf,
} from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ConfirmationService } from "@ui/web/primeng-api/primeng-api";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { PresentacionJuntaAdd } from "./presentacion-junta-add";
import { PresentacionJuntaComiteForm } from "./presentacion-junta-comite-form";
@Component({
  selector: "app-presentacion-junta-comite",
  templateUrl: "./presentacion-junta-comite.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    WebButtonLabel,
    NgbTooltipModule,
    LxTag,
    LxFieldset,
    DataViewMobile,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelConfirm,
    WebButtonLabelViewPdf,
    WebButtonLabelConfirm,
    WebButtonLabelViewPdf,
    AppIcon,
  ],
})
export class PresentacionJuntaComite {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  confirmationService = inject(ConfirmationService);
  customerIdS = inject(CustomerIdService);
  customToastS = inject(CustomToastService);
  dateS = inject(DateService);
  public AspRole = ApplicationRole;

  ref: DynamicDialogRef;
  applicationUserId: string =
    this.authS.userToken.infoUserAuthDTO.applicationUserId;

  dataSignal = signal<PresentacionJuntaComiteDTO[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));

  supervisorContable: boolean = false;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      } else {
        this.dataSignal.set([]);
      }
    });
  }

  hasRole(roles: ApplicationRole[]): boolean {
    return this.aspRoleS.hasAny(roles);
  }

  onValidarId(userId: string): boolean {
    return userId === this.authS.applicationUserId;
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList(
        Endpoints.PresentacionJuntaComite.list(this.customerIdS.customerId()),
      )
      .then((result: any) => {
        this.dataSignal.set(result || []);
      });
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
    if (!data.id) {
      this.customToastS.showInfo(
        "Alta desde agenda",
        "La presentacion no puede crearse directamente aqui. Primero registra la agenda de la junta para que se genere la sesion y, desde ella, la presentacion vinculada.",
      );
      return;
    }

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
    this.apiResponseS
      .onDelete(Endpoints.PresentacionJuntaComite.deleteFile(id, area))
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  // Eliminar registro completo
  onDeleteItem(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.PresentacionJuntaComite.delete(id))
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onValidarPresentacion(id: any) {
    this.apiResponseS
      .onPost(
        Endpoints.PresentacionJuntaComite.authorize(
          id,
          this.authS.applicationUserId,
        ),
      )
      .then((result: boolean) => {
        if (result) {
          this.enviarMailPresentacionComite(id);
          this.onLoadData();
        }
      });
  }

  onOnlyValidate(id: any) {
    this.apiResponseS
      .onPost(
        Endpoints.PresentacionJuntaComite.authorize(
          id,
          this.authS.applicationUserId,
        ),
      )
      .then((result: boolean) => {
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
    this.apiResponseS
      .onPost(Endpoints.SendEmail.presentacionFinalComite(idJunta))
      .then(() => {
        this.onLoadData();
      });
  }
}
export interface PresentacionJuntaComiteDTO {
  id: string;
  fechaCorrespondienteFiltro: string;
  fechaCorrespondiente: string;
  fechaJunta: string;
  horaJunta: string;
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
  idAnterior: number;
}

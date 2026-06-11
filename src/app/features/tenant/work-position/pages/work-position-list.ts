import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import {
  IonAvatar,
  IonBadge,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  add,
  bookOutline,
  createOutline,
  documentTextOutline,
  ellipsisHorizontalOutline,
  personAddOutline,
  personOutline,
  timeOutline,
  trashOutline,
} from "ionicons/icons";
import { AvatarModule } from "primeng/avatar";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  IonButtonActiveDesactive,
  IonButtonDelete,
  IonButtonEdit,
  IonButtonItem,
} from "src/app/core/components/buttons/mobile";
import { CustomBtnActiveDesactive } from "src/app/core/components/buttons/web/custom-button-active-desactive";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { DialogSize } from "src/app/core/enums/dialog-size";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions as getRowsPerPageOptions,
  tablePrimeNgRows as getTablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SolicitudVacanteForm } from "src/app/features/tenant/reclutamiento-solicitudes/vacancy-requests/components/solicitud-vacante-form";
import { IWorkPosition } from "../models/work-position.model";
import { JobDescriptionForm } from "./job-description-form";
import { WorkPositionForm } from "./work-position-form";
import { WorkPositionHours } from "./work-position-hours";

@Component({
  selector: "app-work-position-list",
  templateUrl: "./work-position-list.html",
  imports: [
    TableModule,
    AvatarModule,
    TagModule,
    CustomBtnActiveDesactive,
    CustomButtonItem,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    ActionMenu,
    DataViewMobile,
    IonAvatar,
    IonBadge,
    IonItem,
    IonLabel,
    IonButtonActiveDesactive,
    IonButtonDelete,
    IonButtonEdit,
    IonButtonItem,
  ],
})
export class WorkPositionList {
  // --- INYECCIÃ“N DE DEPENDENCIAS ---
  public authS = inject(AuthService);
  readonly apiS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public aspRoleS = inject(AspRoleService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  // --- SIGNALS Y PROPIEDADES ---
  data = signal<IWorkPosition[]>([]);
  scrollHeight = signal<string>("0px");
  state = signal<boolean>(true);

  // --- CONSTANTES ---
  readonly AspRole = EApplicationRole;
  readonly rowsPerPageOptions = getRowsPerPageOptions();
  readonly tablePrimeNgRows = getTablePrimeNgRows();
  readonly globalFilterFields = computed(() =>
    getGlobalFilterFields(this.data()),
  );

  constructor() {
    addIcons({
      add,
      createOutline,
      documentTextOutline,
      personAddOutline,
      timeOutline,
      trashOutline,
      bookOutline,
      ellipsisHorizontalOutline,
      personOutline,
    });

    effect(() => {
      if (this.customerIdS.customerId()) {
        this.onLoadData();
      }
    });

    this.scrollHeight.set(this.tableScrollHeightS.scrollHeight());
  }

  onSelectActive(state: boolean): void {
    this.state.set(state);
    this.onLoadData();
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    const stateStr = this.state() ? "Activo" : "Inactivo";

    // Normalizado a kebab-case y sincronizado con el backend refactorizado
    const result = await this.apiS.onGetList<IWorkPosition[]>(
      `work-positions/list-by-customer/${customerId}/${stateStr}`,
    );
    this.data.set(result ?? []);
  }

  async onModalForm(data: { id: string; title: string }) {
    const component = WorkPositionForm;
    const res = await this.dialogHandlerS.openDialog<boolean>(
      component,
      { id: data.id },
      data.title,
      DialogSize.full,
    );

    if (res) this.onLoadData();
  }

  async onDelete(id: string) {
    // Normalizado a kebab-case
    const res = await this.apiS.onDelete(`work-positions/${id}`);
    if (res) this.onLoadData();
  }

  onCardEmployee(userId: string) {
    // Implementar si existe un componente de tarjeta de empleado
    // this.dialogHandlerS.openDialog(CardEmployee, { userId }, 'Colaborador', DialogSize.md);
  }

  async onModalSolicitudVacante(workPositionId: string) {
    await this.dialogHandlerS.openDialog(
      SolicitudVacanteForm,
      { workPositionId },
      "Solicitar vacante",
      DialogSize.md,
    );
    this.onLoadData();
  }

  async onModalJobDescription(
    id: string,
    jobDescriptionId: string,
    roleName: string,
  ) {
    await this.dialogHandlerS.openDialog(
      JobDescriptionForm,
      { id, jobDescriptionId },
      "DescripciÃ³n de puesto: " + roleName,
      DialogSize.md,
    );
  }

  async onModalHoursWorkPosition(id: string) {
    await this.dialogHandlerS.openDialog(
      WorkPositionHours,
      { id },
      "Horarios de trabajo",
      DialogSize.md,
    );
  }

  /** Retorna true cuando el puesto no tiene rol asignado (requiere actualizaciÃ³n). */
  necesitaActualizacion(item: IWorkPosition): boolean {
    return !item.applicationRoleName || item.applicationRoleName === "Asignar";
  }

  onValidateCustomerId(applicationRoleId: string): boolean {
    const roleId = this.authS.userToken?.roles[0];
    if (
      roleId === EApplicationRole.SuperUsuario ||
      roleId === EApplicationRole.Administrador
    ) {
      return true;
    }
    // LÃ³gica adicional de validaciÃ³n si es necesaria
    return true;
  }

  onValidateShowTIcket(applicationRoleId: string): boolean {
    // LÃ³gica para mostrar ticket vigente
    return true;
  }

  shouldShowVacancyRequest(item: IWorkPosition): boolean {
    const isBlockingStatus =
      item.positionRequest?.status === 0 || // Pendiente
      item.positionRequest?.status === 3;   // Proceso
    return !isBlockingStatus;
  }
}


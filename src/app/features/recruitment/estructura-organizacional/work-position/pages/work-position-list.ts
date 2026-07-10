import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
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
import { TableModule } from "primeng/table";

import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { DialogSize } from "src/app/core/enums/dialog-size";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions as getRowsPerPageOptions,
  tablePrimeNgRows as getTablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SolicitudVacanteForm } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/components/solicitud-vacante-form";
import { IWorkPosition } from "../models/work-position.model";
import { JobDescriptionForm } from "./job-description-form";
import { WorkPositionForm } from "./work-position-form";
import { WorkPositionHours } from "./work-position-hours";

import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-work-position-list",
  templateUrl: "./work-position-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconActiveDesactive,
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelItem,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    AppAvatar,
    PrimeNgCustomCaption,
    DataViewMobile,
    LxTag,
    MobileListItem,
    AppIcon,
  ],
})
export class WorkPositionList {
  // --- INYECCIóN DE DEPENDENCIAS ---
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
      "Descripción de puesto: " + roleName,
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

  /** Retorna true cuando el puesto no tiene rol asignado (requiere actualización). */
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
    // Lígica adicional de validación si es necesaria
    return true;
  }

  onValidateShowTIcket(applicationRoleId: string): boolean {
    // Lígica para mostrar ticket vigente
    return true;
  }

  shouldShowVacancyRequest(item: IWorkPosition): boolean {
    const isBlockingStatus =
      item.positionRequest?.status === 0 || // Pendiente
      item.positionRequest?.status === 3; // Proceso
    return !isBlockingStatus;
  }
}

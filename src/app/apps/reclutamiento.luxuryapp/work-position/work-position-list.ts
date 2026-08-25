import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { Table, TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import {
  add,
  bookOutline,
  documentTextOutline,
  ellipsisHorizontalOutline,
  personAddOutline,
  personOutline,
  timeOutline,
} from "ionicons/icons";

import { SolicitudVacanteForm } from "src/app/apps/reclutamiento.luxuryapp/solicitud-vacante/solicitud-vacante-form";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { Department } from "src/app/core/enums/department.enum";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions as getRowsPerPageOptions,
  tablePrimeNgRows as getTablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { FilterRequestsService } from "src/app/core/http/services/filter-requests.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { IWorkPosition } from "./interfaces/work-position.model";
import { JobDescriptionForm } from "./job-description-form";
import { WorkPositionHours } from "./work-position-hours";

import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-work-position-list",
  templateUrl: "./work-position-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconActiveDesactive,
    WebButtonIconItem,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelItem,
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
  private filterRequestsService = inject(FilterRequestsService);

  // --- SIGNALS Y PROPIEDADES ---
  data = signal<IWorkPosition[]>([]);
  scrollHeight = signal<string>("0px");
  state = signal<boolean>(true);
  @ViewChild("dt") dt?: Table;

  // --- CONSTANTES ---
  readonly AspRole = ApplicationRole;
  readonly rowsPerPageOptions = getRowsPerPageOptions();
  readonly tablePrimeNgRows = getTablePrimeNgRows();
  readonly globalFilterFields = computed(() =>
    getGlobalFilterFields(this.data()),
  );
  readonly departamentLabels: Record<number, string> = {
    [Department.Administracion]: "Administración",
    [Department.Legal]: "Legal",
    [Department.Contabilidad]: "Contabilidad",
    [Department.Mantenimiento]: "Mantenimiento",
    [Department.Limpieza]: "Limpieza",
    [Department.Operaciones]: "Operaciones",
    [Department.Jardineria]: "Jardinería",
    [Department.Sistemas]: "Sistemas",
    [Department.Seguridad]: "Seguridad",
    [Department.Constructora]: "Constructora",
    [Department.Supervision]: "Supervisión",
    [Department.Direcciones]: "Dirección",
    [Department.RecursosHumanos]: "Recursos Humanos",
    [Department.Reclutamiento]: "Reclutamiento",
    [Department.Recepcion]: "Recepción",
    [Department.Mensajeria]: "Mensajería",
    [Department.Ludoteca]: "Ludoteca",
    [Department.NA]: "Sin Departamento",
  };

  constructor() {
    addIcons({
      add,
      documentTextOutline,
      personAddOutline,
      timeOutline,
      bookOutline,
      ellipsisHorizontalOutline,
      personOutline,
    });

    effect(() => {
      if (this.customerIdS.customerId()) {
        this.onLoadData();
      }
    });

    effect(() => {
      const term = this.filterRequestsService.searchTerm();
      this.dt?.filterGlobal(term, "contains");
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

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels[value] ?? "Sin Departamento";
  }

  isVacant(item: IWorkPosition): boolean {
    return !item.applicationUserId;
  }

    onAdministerEmployee(employeeId: string, userId: string) {
    this.router.navigate(["/recruitment/empleado", employeeId || "0", userId]);
  }

  onCardEmployee(userId: string) {
    // Implementar si existe un componente de tarjeta de empleado
    this.router.navigate(["/directory/empleado", "0", userId]);
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
      {
        id: jobDescriptionId,
        workPositionId: id,
        applicationRoleName: roleName,
        readOnly: true,
      },
      "Descripción de puesto: " + roleName,
      DialogSize.md,
    );
  }

  async onModalHoursWorkPosition(id: string) {
    await this.dialogHandlerS.openDialog(
      WorkPositionHours,
      { id, readOnly: true },
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
      roleId === ApplicationRole.SuperUsuario ||
      roleId === ApplicationRole.Administrador
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




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

import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { Department } from "src/app/core/enums/department.enum";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { globalFilterFields as getGlobalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { FilterRequestsService } from "src/app/core/http/services/filter-requests.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ConfirmService } from "src/app/shared/ui/buttons/shared/confirm.service";
import { IWorkPosition } from "./interfaces/work-position.model";
import { WorkPositionDetails } from "./work-position-details";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import {
  SegmentedControl,
  SegmentItem,
} from "src/app/shared/ui/shared/segmented-control/segmented-control";

@Component({
  selector: "app-work-position-list",
  templateUrl: "./work-position-list.html",
  styleUrl: "./work-position-list.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    LxTooltipDirective,
    MobileActionMenu,
    WebButtonLabel,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    AppAvatar,
    PrimeNgCustomCaption,
    DataViewMobile,
    LxTag,
    MobileListItem,
    AppIcon,
    SegmentedControl,
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
  private confirmS = inject(ConfirmService);

  // --- SIGNALS Y PROPIEDADES ---
  data = signal<IWorkPosition[]>([]);
  scrollHeight = signal<string>("0px");
  statusFilter = signal<"Activo" | "Inactivo">("Activo");
  selectedDepartment = signal<number | null>(null);
  @ViewChild("dt") dt?: Table;

  readonly uniqueDepartments = computed<number[]>(() => {
    const depts = new Set<number>();
    this.data().forEach((p) => {
      if (p.departament !== null && p.departament !== undefined) {
        depts.add(p.departament);
      }
    });
    return Array.from(depts).sort((a, b) =>
      this.getDepartamentLabel(a).localeCompare(this.getDepartamentLabel(b)),
    );
  });

  readonly departmentFilterItems = computed<SegmentItem[]>(() => [
    { value: null, label: "Todos" },
    ...this.uniqueDepartments().map((dept) => ({
      value: dept,
      label: this.getDepartamentLabel(dept),
    })),
  ]);

  readonly filteredData = computed<IWorkPosition[]>(() => {
    const selected = this.selectedDepartment();
    const positions = this.data();
    const filtered =
      selected === null
        ? positions
        : positions.filter((p) => p.departament === selected);
    return [...filtered].sort((a, b) => {
      const depA = a.departament ?? -1;
      const depB = b.departament ?? -1;
      return depA - depB;
    });
  });

  // --- CONSTANTES ---
  readonly AspRole = ApplicationRole;
  readonly globalFilterFields = computed(() =>
    getGlobalFilterFields(this.data()),
  );
  /**
   * Backend-Driven UI (motor de políticas RRHH): la política es la misma para todo el listado
   * de un mismo usuario autenticado, por lo que basta con leer el booleano de cualquier fila cargada.
   */
  readonly showSalaryColumn = computed(() =>
    this.data().some((p) => p.canViewSensitiveData),
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
    [Department.Almacen]: "Almacén",
    [Department.Amenidades]: "Amenidades",
    [Department.Asistente]: "Asistente",
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

  onStatusFilterChange(status: "Activo" | "Inactivo"): void {
    if (this.statusFilter() === status) return;
    this.statusFilter.set(status);
    this.onLoadData();
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    const stateStr = this.statusFilter();

    // Normalizado a kebab-case y sincronizado con el backend refactorizado
    const result = await this.apiS.onGetList<IWorkPosition[]>(
      `work-positions/list-by-customer/${customerId}/${stateStr}`,
    );

    // Normalizar departamentos null a Department.NA para que se agrupen correctamente
    const normalized = (result ?? []).map((p) => ({
      ...p,
      departament: p.departament ?? Department.NA,
    }));

    this.data.set(normalized);
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

  async onModalDetails(item: IWorkPosition) {
    await this.dialogHandlerS.openDialog(
      WorkPositionDetails,
      {
        id: item.id,
        jobDescriptionId: item.jobDescriptionId,
        applicationRoleName: item.applicationRoleName,
        folio: item.folio,
        departamentLabel: this.getDepartamentLabel(item.departament),
      },
      "Detalles del puesto: " + item.applicationRoleName,
      DialogSize.full,
    );
  }

  async onRequestDelete(item: IWorkPosition): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este puesto?",
      "Confirmar eliminación",
    );
    if (ok) this.onDelete(item.id);
  }

  async onDelete(id: string): Promise<void> {
    const res = await this.apiS.onDelete(`work-positions/${id}`);
    if (res) this.onLoadData();
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
}

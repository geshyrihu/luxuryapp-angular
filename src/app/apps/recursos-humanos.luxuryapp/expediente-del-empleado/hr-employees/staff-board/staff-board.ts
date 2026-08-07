// @ts-nocheck
class WorkPositionForm {}
class JobDescriptionForm {}
class WorkPositionHours {}
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
} from "@angular/cdk/drag-drop";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SolicitudVacanteForm } from "src/app/apps/reclutamiento.luxuryapp/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/components/solicitud-vacante-form";
import { EmployeeProviderForm } from "src/app/apps/supplier.luxuryapp/providers/provider/pages/employee-provider-form";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { Department } from "src/app/core/enums/department.enum";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions as getRowsPerPageOptions,
  tablePrimeNgRows as getTablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
// missing work-position
// missing work-position
// missing work-position
// missing work-position
import { ROUTES } from "src/app/routing/route-paths";
import { IEmployee } from "../employees/models/employee.interface";
import { CardEmployee } from "../employees/pages/card-employee";
import { ExcelExportService, ExcelColumn } from "src/app/core/services/excel-export.service";

import { LxModal } from "@ui/adaptive/modal/modal";
import { LxSidebar } from "@ui/adaptive/sidebar/sidebar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

@Component({
  selector: "app-staff-board",
  templateUrl: "./staff-board.html",
  styleUrl: "./staff-board.scss",
  imports: [
    WebButtonIconEdit,
    WebButtonIconItem,
    LxTooltipDirective,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    LxAvatar,
    LxTag,
    LxSidebar,
    LxModal,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkDropList,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonLabel,
    WebButtonLabelItem,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    ActionMenu,
    AppIcon,
  ],
})
export class StaffBoard {
  readonly apiS = inject(ApiResponseService);
  readonly customerIdS = inject(CustomerIdService);
  readonly dialogHandlerS = inject(DialogHandlerService);
  readonly aspRoleS = inject(AspRoleService);
  readonly router = inject(Router);
  private excelService = inject(ExcelExportService);

  readonly AspRole = ApplicationRole;
  readonly rowsPerPageOptions = getRowsPerPageOptions();
  readonly tablePrimeNgRows = getTablePrimeNgRows();

  readonly departamentLabels: Record<number, string> = {
    [Department.Administracion]: "Administración",
    [Department.Legal]: "Legal",
    [Department.Contabilidad]: "Contabilidad",
    [Department.Mantenimiento]: "Mantenimiento",
    [Department.Limpieza]: "Limpieza",
    [Department.Operaciones]: "Operaciones",
    [Department.Jardineria]: "Jardineróa",
    [Department.Sistemas]: "Sistemas",
    [Department.Seguridad]: "Seguridad",
    [Department.Constructora]: "Constructora",
    [Department.Supervision]: "Supervisión",
    [Department.Direcciones]: "Dirección",
    [Department.RecursosHumanos]: "Recursos Humanos",
    [Department.Reclutamiento]: "Reclutamiento",
    [Department.Recepcion]: "Recepción",
    [Department.Mensajeria]: "Mensajeróa",
    [Department.Ludoteca]: "Ludoteca",
    [Department.NA]: "Sin Departamento",
  };

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels[value] ?? "Sin Departamento";
  }

  positions = signal<any[]>([]);
  allEmployees = signal<IEmployee[]>([]);
  poolExpanded = signal(true);
  drawerVisible = signal(false);
  selectedPosition = signal<any | null>(null);
  assignLoading = signal(false);

  // Inactivos modal
  inactivosVisible = signal(false);
  inactivePositions = signal<any[]>([]);
  inactiveEmployees = signal<IEmployee[]>([]);
  inactivosLoading = signal(false);
  inactivosTab = signal<"positions" | "employees">("positions");

  globalFilterFields = computed(() => getGlobalFilterFields(this.positions()));

  unassignedEmployees = computed(() =>
    this.allEmployees().filter((e) => !e.workPositionFolio),
  );

  vacantDropIds = computed(() =>
    this.positions()
      .filter((p) => !p.applicationUser)
      .map((p) => `drop-pos-${p.id}`),
  );

  constructor() {
    effect(() => {
      if (this.customerIdS.customerId()) this.onLoadData();
    });
  }

  showModalAddEmployee() {
    this.dialogHandlerS
      .openDialog(
        EmployeeProviderForm,
        { typePerson: 0 },
        "Registrar Empleado",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  showModalAddEmployeeFromPosition(position: any) {
    this.dialogHandlerS
      .openDialog(
        EmployeeProviderForm,
        {
          typePerson: 0,
          positionRequestId: position.positionRequest?.id ?? null,
          applicationRoleId: position.applicationRoleId ?? null,
        },
        `Registrar Empleado - ${position.folio}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  async onLoadData(): Promise<void> {
    const customerId = this.customerIdS.customerId();

    const [positions, employees] = await Promise.all([
      this.apiS.onGetList<any[]>(
        Endpoints.WorkPositions.listByCustomer(customerId, "Activo"),
      ),
      this.apiS.onGetList<IEmployee[]>(
        Endpoints.EmployeeInternal.list(customerId, true),
      ),
    ]);

    this.positions.set(positions ?? []);
    this.allEmployees.set(employees ?? []);
  }

  // --- Inactivos ---------------------------------------------------------

  async onOpenInactivos(): Promise<void> {
    this.inactivosVisible.set(true);
    this.inactivosLoading.set(true);
    const customerId = this.customerIdS.customerId();
    const [positions, employees] = await Promise.all([
      this.apiS.onGetList<any[]>(
        Endpoints.WorkPositions.listByCustomer(customerId, "Inactivo"),
      ),
      this.apiS.onGetList<IEmployee[]>(
        Endpoints.EmployeeInternal.list(customerId, false),
      ),
    ]);
    this.inactivePositions.set(positions ?? []);
    this.inactiveEmployees.set(employees ?? []);
    this.inactivosLoading.set(false);
  }

  onOrgChart(): void {
    this.router.navigate(ROUTES.DIRECTORIO.ORGANIGRAMA);
  }

  async onActivatePosition(id: string): Promise<void> {
    const res = await this.apiS.onPatch(
      Endpoints.WorkPositions.activate(id),
      {},
    );
    if (res) {
      this.inactivePositions.update((list) => list.filter((p) => p.id !== id));
      await this.onLoadData();
    }
  }

  async onActivateEmployee(applicationUserId: string): Promise<void> {
    const res = await this.apiS.onPatch(
      Endpoints.EmployeeInternal.activate(applicationUserId),
      {},
    );
    if (res) {
      this.inactiveEmployees.update((list) =>
        list.filter((e) => e.applicationUserId !== applicationUserId),
      );
      await this.onLoadData();
    }
  }

  async onActivateAndAssign(employee: IEmployee): Promise<void> {
    const res = await this.apiS.onPatch(
      Endpoints.EmployeeInternal.activate(employee.applicationUserId),
      {},
    );
    if (!res) return;
    this.inactiveEmployees.update((list) =>
      list.filter((e) => e.applicationUserId !== employee.applicationUserId),
    );
    await this.onLoadData();
    // Mueve al empleado al pool y abre el LxSidebar para asignarle un puesto
    this.inactivosVisible.set(false);
  }

  // --- DnD ---------------------------------------------------------------

  async onDropToPosition(
    event: CdkDragDrop<IEmployee[]>,
    position: any,
  ): Promise<void> {
    if (position.applicationUser) return;
    const employee: IEmployee = event.item.data;
    this.assignLoading.set(true);
    await this.apiS.onGetItem(
      Endpoints.WorkPositions.assignEmployee(
        employee.applicationUserId,
        position.id,
      ),
    );
    this.assignLoading.set(false);
    await this.onLoadData();
  }

  onDropBackToPool(_event: CdkDragDrop<IEmployee[]>): void {}

  // --- LxSidebar ------------------------------------------------------------

  onOpenDrawer(position: any): void {
    this.selectedPosition.set(position);
    this.drawerVisible.set(true);
  }

  async onAssignFromDrawer(employee: IEmployee): Promise<void> {
    const pos = this.selectedPosition();
    if (!pos) return;
    this.assignLoading.set(true);
    await this.apiS.onGetItem(
      Endpoints.WorkPositions.assignEmployee(
        employee.applicationUserId,
        pos.id,
      ),
    );
    this.assignLoading.set(false);
    this.drawerVisible.set(false);
    await this.onLoadData();
  }

  // --- Acciones de puesto ------------------------------------------------

  async onUnassignEmployee(positionId: string): Promise<void> {
    await this.apiS.onPatch(
      Endpoints.WorkPositions.unassignEmployee(positionId),
      {},
    );
    await this.onLoadData();
  }

  onCardEmployee(userId: string): void {
    if (!userId) return;
    this.dialogHandlerS.openDialog(
      CardEmployee,
      { applicationUserId: userId },
      "Colaborador",
      DialogSize.sm,
    );
  }

  onShowEditEmpleado(item: any): void {
    if (!item.employeeId || !item.applicationUserId) return;
    this.router.navigate(
      ROUTES.DIRECTORIO.EMPLEADO(item.employeeId, item.applicationUserId),
    );
  }

  onGoToProfile(emp: IEmployee): void {
    if (!emp.employeeId || !emp.applicationUserId) return;
    this.router.navigate(
      ROUTES.DIRECTORIO.EMPLEADO(emp.employeeId, emp.applicationUserId),
    );
  }

  onGoToEmployeeFile(item: any): void {
    if (!item.employeeId) return;
    this.router.navigate(ROUTES.RECURSOS_HUMANOS.EXPEDIENTE(item.employeeId));
  }

  async onModalForm(data: { id: string; title: string }): Promise<void> {
    const res = await this.dialogHandlerS.openDialog<boolean>(
      { id: data.id },
      data.title,
      DialogSize.full,
    );
    if (res) this.onLoadData();
  }

  async onDelete(id: string): Promise<void> {
    const res = await this.apiS.onDelete(Endpoints.WorkPositions.delete(id));
    if (res) this.onLoadData();
  }

  async onModalJobDescription(
    id: string,
    jobDescriptionId: string,
    applicationRoleName: string,
  ): Promise<void> {
    await this.dialogHandlerS.openDialog(
      {
        workPositionId: id,
        id: jobDescriptionId,
        applicationRoleName: applicationRoleName,
      },
      "DESCRIPCIóN de puesto: " + applicationRoleName,
      DialogSize.lg,
    );
  }

  async onModalHoursWorkPosition(id: string): Promise<void> {
    await this.dialogHandlerS.openDialog(
      { id },
      "Horarios de trabajo",
      DialogSize.md,
    );
  }

  async onModalSolicitudVacante(workPositionId: string): Promise<void> {
    await this.dialogHandlerS.openDialog(
      SolicitudVacanteForm,
      { workPositionId },
      "Solicitar vacante",
      DialogSize.lg,
    );
    await this.onLoadData();
  }

  // --- Helpers -----------------------------------------------------------

  isVacant(item: any): boolean {
    return !item.applicationUser;
  }

  necesitaActualizacion(item: any): boolean {
    return !item.applicationRoleName || item.applicationRoleName === "Asignar";
  }

  /** Muestra el botón si no hay solicitud activa (Pendiente/Proceso), independiente de si hay empleado. */
  shouldShowVacancyRequest(item: any): boolean {
    return !item.positionRequest;
  }

  onExportExcel(): void {
    const columns: ExcelColumn[] = [
      { header: 'Departamento', key: 'departamento', width: 25 },
      { header: 'Folio Vacante', key: 'workPositionFolio', width: 15 },
      { header: 'Nombre Vacante', key: 'workPositionName', width: 35 },
      { header: 'Colaborador', key: 'fullName', width: 45 },
      { header: 'Sueldo Base', key: 'sueldoBase', width: 15 }
    ];

    const data = [...this.positions()].sort((a, b) => {
      const depA = this.getDepartamentLabel(a.departament);
      const depB = this.getDepartamentLabel(b.departament);
      return depA.localeCompare(depB);
    }).map(item => ({
      departamento: this.getDepartamentLabel(item.departament),
      workPositionFolio: item.folio,
      workPositionName: item.applicationRoleName,
      fullName: item.applicationUser || 'VACANTE',
      sueldoBase: item.sueldoBase ?? ''
    }));

    this.excelService.exportToExcel(
      data,
      columns,
      'Plantilla',
      'Plantilla_y_Personal'
    );
  }
}

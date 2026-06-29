import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
} from "@angular/cdk/drag-drop";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { Dialog } from "primeng/dialog";
import { Drawer } from "primeng/drawer";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/web/buttons/custom-button-item";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { DialogSize } from "src/app/core/enums/dialog-size";
import { EDepartament } from "src/app/core/enums/EDepartament";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions as getRowsPerPageOptions,
  tablePrimeNgRows as getTablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SolicitudVacanteForm } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/components/solicitud-vacante-form";
import { IWorkPosition } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/work-position/models/work-position.model";
import { JobDescriptionForm } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/work-position/pages/job-description-form";
import { WorkPositionForm } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/work-position/pages/work-position-form";
import { WorkPositionHours } from "src/app/features/recruitment/reclutamiento-y-altas-bajas/work-position/pages/work-position-hours";
import { EmployeeProviderForm } from "src/app/features/purchasing/providers/provider/pages/employee-provider-form";
import { IEmployee } from "../employees/models/employee.interface";
import { CardEmployee } from "../employees/pages/card-employee";

@Component({
  selector: "app-staff-board",
  templateUrl: "./staff-board.html",
  styleUrl: "./staff-board.scss",
  imports: [
    EmptyState,
    TableModule,
    AvatarModule,
    TagModule,
    Drawer,
    Dialog,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkDropList,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButton,
    CustomButtonItem,
    CustomButtonEdit,
    CustomButtonDelete,
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

  readonly AspRole = EApplicationRole;
  readonly rowsPerPageOptions = getRowsPerPageOptions();
  readonly tablePrimeNgRows = getTablePrimeNgRows();

  readonly departamentLabels: Record<number, string> = {
    [EDepartament.Administracion]: "Administración",
    [EDepartament.Legal]: "Legal",
    [EDepartament.Contabilidad]: "Contabilidad",
    [EDepartament.Mantenimiento]: "Mantenimiento",
    [EDepartament.Limpieza]: "Limpieza",
    [EDepartament.Operaciones]: "Operaciones",
    [EDepartament.Jardineria]: "Jardinería",
    [EDepartament.Sistemas]: "Sistemas",
    [EDepartament.Seguridad]: "Seguridad",
    [EDepartament.Constructora]: "Constructora",
    [EDepartament.Supervision]: "Supervisión",
    [EDepartament.Direcciones]: "Dirección",
    [EDepartament.RecusrosHumanos]: "Recursos Humanos",
    [EDepartament.Reclutamiento]: "Reclutamiento",
    [EDepartament.Recepcion]: "Recepción",
    [EDepartament.Mensajeria]: "Mensajería",
    [EDepartament.Ludoteca]: "Ludoteca",
    [EDepartament.NA]: "Sin Departamento",
  };

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels[value] ?? "Sin Departamento";
  }

  positions = signal<IWorkPosition[]>([]);
  allEmployees = signal<IEmployee[]>([]);
  poolExpanded = signal(true);
  drawerVisible = signal(false);
  selectedPosition = signal<IWorkPosition | null>(null);
  assignLoading = signal(false);

  // Inactivos modal
  inactivosVisible = signal(false);
  inactivePositions = signal<IWorkPosition[]>([]);
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

  showModalAddEmployeeFromPosition(position: IWorkPosition) {
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
      this.apiS.onGetList<IWorkPosition[]>(
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
      this.apiS.onGetList<IWorkPosition[]>(
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
    this.router.navigateByUrl("/directory/work-position-org-chart");
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
    // Mueve al empleado al pool y abre el drawer para asignarle un puesto
    this.inactivosVisible.set(false);
  }

  // --- DnD ---------------------------------------------------------------

  async onDropToPosition(
    event: CdkDragDrop<IEmployee[]>,
    position: IWorkPosition,
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

  // --- Drawer ------------------------------------------------------------

  onOpenDrawer(position: IWorkPosition): void {
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

  onShowEditEmpleado(item: IWorkPosition): void {
    if (!item.employeeId || !item.applicationUserId) return;
    this.router.navigateByUrl(
      `directory/empleado/${item.employeeId}/${item.applicationUserId}`,
    );
  }

  onGoToProfile(emp: IEmployee): void {
    if (!emp.employeeId || !emp.applicationUserId) return;
    this.router.navigateByUrl(
      `directory/empleado/${emp.employeeId}/${emp.applicationUserId}`,
    );
  }

  onGoToEmployeeFile(item: IWorkPosition): void {
    if (!item.employeeId) return;
    this.router.navigateByUrl(
      `/recursos-humanos/employee-files/${item.employeeId}`,
    );
  }

  async onModalForm(data: { id: string; title: string }): Promise<void> {
    const res = await this.dialogHandlerS.openDialog<boolean>(
      WorkPositionForm,
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
      JobDescriptionForm,
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
      WorkPositionHours,
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

  isVacant(item: IWorkPosition): boolean {
    return !item.applicationUser;
  }

  necesitaActualizacion(item: IWorkPosition): boolean {
    return !item.applicationRoleName || item.applicationRoleName === "Asignar";
  }

  /** Muestra el botón si no hay solicitud activa (Pendiente/Proceso), independiente de si hay empleado. */
  shouldShowVacancyRequest(item: IWorkPosition): boolean {
    return !item.positionRequest;
  }
}


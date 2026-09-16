import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
} from "@angular/cdk/drag-drop";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { Department } from "@core/enums/department.enum";
import { DialogSize } from "@core/enums/dialog-size.enum";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions as getRowsPerPageOptions,
  tablePrimeNgRows as getTablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { CandidateProcessHiringModal } from "@shared/integration/reclutamiento/candidates/candidate-application/candidate-process-hiring-modal";
import { IWorkPosition } from "@operations.luxuryapp/work-position/interfaces/work-position.model";
import { JobDescriptionForm } from "@operations.luxuryapp/work-position/job-description-form";
import { WorkPositionForm } from "@operations.luxuryapp/work-position/work-position-form";
import { SolicitudVacanteForm } from "@operations.luxuryapp/reclutamiento-solicitudes/vacancy-requests/solicitud-vacante-form";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

import { LxModal } from "@ui/adaptive/modal/modal";
import { LxSidebar } from "@ui/adaptive/sidebar/sidebar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import {
  ExcelColumn,
  ExcelExportService,
} from "@core/services/excel-export.service";
import { CandidateInterviewerQueueService } from "@shared/integration/reclutamiento/candidates/candidate-interviewer-queue/candidate-interviewer-queue.service";
import { CandidateInterviewerQueueDto } from "@shared/integration/reclutamiento/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface";
import { CardEmployee, IEmployee } from "@shared/integration/recursos-humanos";
// import { WorkPositionHours } from "../../../../shared/integration/reclutamiento/estructura-organizacional/work-position/work-position-hours/work-position-hours";

@Component({
  selector: "app-recruitment-staff-board",
  templateUrl: "./recruitment-staff-board.html",
  styleUrl: "./recruitment-staff-board.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconItem,
    LxTooltipDirective,
    PrimeNgCustomTableEmptyMessage,
    AppTable,

    AppSortableColumn,

    AppSorticon,
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
    WebButtonLabelDelete,
    ActionMenu,
    AppIcon,
  ],
})
export class RecruitmentStaffBoard {
  readonly apiS = inject(ApiResponseService);
  readonly customerIdS = inject(CustomerIdService);
  readonly dialogHandlerS = inject(DialogHandlerService);
  readonly aspRoleS = inject(AspRoleService);
  readonly router = inject(Router);
  private excelService = inject(ExcelExportService);
  private interviewerQueueS = inject(CandidateInterviewerQueueService);

  readonly AspRole = ApplicationRole;
  readonly rowsPerPageOptions = getRowsPerPageOptions();
  readonly tablePrimeNgRows = getTablePrimeNgRows();

  readonly interviewerQueue = signal<CandidateInterviewerQueueDto[]>([]);
  readonly interviewerLoading = signal(false);
  readonly interviewerPendingCount = computed(() =>
    this.interviewerQueue().reduce(
      (sum, vacancy) => sum + vacancy.pendingCandidatesCount,
      0,
    ),
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

  showModalAddEmployeeFromPosition(position: IWorkPosition) {
    this.dialogHandlerS
      .openDialog(
        CandidateProcessHiringModal,
        {
          requestPositionId: position.positionRequest?.id ?? null,
        },
        `Registrar Empleado — ${position.folio}`,
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

    console.log("POSITIONS DEBUG:", positions);

    this.positions.set(positions ?? []);
    this.allEmployees.set(employees ?? []);

    await this.loadInterviewerQueue();
  }

  async loadInterviewerQueue(): Promise<void> {
    this.interviewerLoading.set(true);
    try {
      const queue = await this.interviewerQueueS.getInterviewerQueue();
      this.interviewerQueue.set(queue);
    } catch {
      // Error ya manejado por ApiResponseService
    } finally {
      this.interviewerLoading.set(false);
    }
  }

  //  Inactivos

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
    // Mueve al empleado al pool y abre el LxSidebar para asignarle un puesto
    this.inactivosVisible.set(false);
  }

  //  DnD

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

  //  LxSidebar

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

  //  Acciones de puesto

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
      `/recruitment/employee-files/${item.employeeId}`,
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

  // async onModalHoursWorkPosition(id: string): Promise<void> {
  //   await this.dialogHandlerS.openDialog(
  //     WorkPositionHours,
  //     { id },
  //     "Horarios de trabajo",
  //     DialogSize.md,
  //   );
  // }

  async onModalSolicitudVacante(workPositionId: string): Promise<void> {
    await this.dialogHandlerS.openDialog(
      SolicitudVacanteForm,
      { workPositionId },
      "Solicitar vacante",
      DialogSize.lg,
    );
    await this.onLoadData();
  }

  //  Helpers

  isVacant(item: IWorkPosition): boolean {
    return !item.applicationUser;
  }

  necesitaActualizacion(item: IWorkPosition): boolean {
    return !item.applicationRoleName || item.applicationRoleName === "Asignar";
  }

  /** Muestra el bot  n si no hay solicitud activa (Pendiente/Proceso), independiente de si hay empleado. */
  shouldShowVacancyRequest(item: any): boolean {
    return !item.positionRequest;
  }

  onExportExcel(): void {
    const columns: ExcelColumn[] = [
      { header: "Departamento", key: "departamento", width: 25 },
      { header: "Folio Vacante", key: "workPositionFolio", width: 15 },
      { header: "Nombre Vacante", key: "workPositionName", width: 35 },
      { header: "Colaborador", key: "fullName", width: 45 },
      { header: "Sueldo Base", key: "sueldoBase", width: 15 },
    ];

    const data = [...this.positions()]
      .sort((a, b) => {
        const depA = this.getDepartamentLabel(a.departament);
        const depB = this.getDepartamentLabel(b.departament);
        return depA.localeCompare(depB);
      })
      .map((item) => ({
        departamento: this.getDepartamentLabel(item.departament),
        workPositionFolio: item.folio,
        workPositionName: item.applicationRoleName,
        fullName: item.applicationUser || "VACANTE",
        sueldoBase: item.sueldoBase ?? "",
      }));

    this.excelService.exportToExcel(
      data,
      columns,
      "Plantilla",
      "Plantilla_y_Personal",
    );
  }

  //  Entrevistador - Helpers

  /** Obtiene la entrevista activa para el puesto actual usando workPositionId y solicitud de vacante. */ getQueueForPosition(
    item: IWorkPosition,
  ): CandidateInterviewerQueueDto | undefined {
    return this.interviewerQueue().find(
      (vacancy) =>
        vacancy.workPositionId === item.id ||
        (!!item.positionRequest?.id &&
          vacancy.requestPositionId === item.positionRequest.id),
    );
  }

  hasQueueForPosition(item: IWorkPosition): boolean {
    return this.getQueueForPosition(item) !== undefined;
  }

  getQueueCountForPosition(item: IWorkPosition): number {
    return this.getQueueForPosition(item)?.candidates.length ?? 0;
  }

  async onGoToMyPendingInterviews(): Promise<void> {
    this.router.navigate(["/directory/employee-interviewer-queue"]);
  }
}



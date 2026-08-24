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
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { Department } from "src/app/core/enums/department.enum";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import {
  globalFilterFields as getGlobalFilterFields,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CandidateProcessHiringModal } from "src/app/shared/integration/reclutamiento/candidates/candidate-application/candidate-process-hiring-modal";
import { IWorkPosition } from "src/app/shared/integration/reclutamiento/estructura-organizacional/work-position/interfaces/work-position.model";
import { JobDescriptionForm } from "src/app/shared/integration/reclutamiento/estructura-organizacional/work-position/job-description-form";
import { WorkPositionForm } from "src/app/shared/integration/reclutamiento/estructura-organizacional/work-position/work-position-form";
import { WorkPositionHours } from "src/app/shared/integration/reclutamiento/estructura-organizacional/work-position/work-position-hours";
import { SolicitudVacanteForm } from "src/app/shared/integration/reclutamiento/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/solicitud-vacante-form";
import { SolicitudBajaForm } from "src/app/apps/reclutamiento.luxuryapp/solicitud-baja/solicitud-baja-form";
import { SolicitudModificacionSalarioForm } from "src/app/apps/reclutamiento.luxuryapp/solicitud-modificacion-sueldo/solicitud-modificacion-salario-form";
import { IncidentFormComponent } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/incident-form";
import { MdEditAccount } from "src/app/apps/admin.luxuryapp/seguridad-permisos/user-accounts/md-edit-account";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { ConfirmPresentationModal } from "./confirm-presentation-modal/confirm-presentation-modal";


import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import {
  ExcelColumn,
  ExcelExportService,
} from "src/app/core/services/excel-export.service";
import { CandidateInterviewerQueueService } from "src/app/shared/integration/reclutamiento/candidates/candidate-interviewer-queue/candidate-interviewer-queue.service";
import { CandidateInterviewerQueueDto } from "src/app/shared/integration/reclutamiento/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface";
import { CardEmployee } from "../employees/card-employee";
import { IEmployee } from "../employees/interfaces/employee.interface";

@Component({
  selector: "app-staff-board-list",
  templateUrl: "./staff-board-list.html",
  styleUrl: "./staff-board-list.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconItem,
    LxTooltipDirective,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    LxAvatar,
    LxTag,
    PrimeNgCustomCaption,
    WebButtonLabel,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    ActionMenu,
    AppIcon,
  ],
})
export class StaffBoardList {
  readonly apiS = inject(ApiResponseService);
  readonly customerIdS = inject(CustomerIdService);
  readonly dialogHandlerS = inject(DialogHandlerService);
  readonly aspRoleS = inject(AspRoleService);
  readonly router = inject(Router);
  private excelService = inject(ExcelExportService);
  private interviewerQueueS = inject(CandidateInterviewerQueueService);

  readonly AspRole = ApplicationRole;

  readonly interviewerQueue = signal<CandidateInterviewerQueueDto[]>([]);
  readonly interviewerLoading = signal(false);
  readonly interviewerPendingCount = computed(() =>
    this.interviewerQueue().reduce(
      (sum, vacancy) => sum + vacancy.pendingCandidatesCount,
      0,
    ),
  );

  readonly departamentLabels: Record<number, string> = {
    [Department.Administracion]: "Administracin",
    [Department.Legal]: "Legal",
    [Department.Contabilidad]: "Contabilidad",
    [Department.Mantenimiento]: "Mantenimiento",
    [Department.Limpieza]: "Limpieza",
    [Department.Operaciones]: "Operaciones",
    [Department.Jardineria]: "Jardinera",
    [Department.Sistemas]: "Sistemas",
    [Department.Seguridad]: "Seguridad",
    [Department.Constructora]: "Constructora",
    [Department.Supervision]: "Supervisin",
    [Department.Direcciones]: "Direccin",
    [Department.RecursosHumanos]: "Recursos Humanos",
    [Department.Reclutamiento]: "Reclutamiento",
    [Department.Recepcion]: "Recepcin",
    [Department.Mensajeria]: "Mensajera",
    [Department.Ludoteca]: "Ludoteca",
    [Department.NA]: "Sin Departamento",
  };

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels[value] ?? "Sin Departamento";
  }

  positions = signal<IWorkPosition[]>([]);
  allEmployees = signal<IEmployee[]>([]);
  selectedDepartment = signal<number | null>(null);
  globalFilterFields = computed(() => getGlobalFilterFields(this.positions()));

  uniqueDepartments = computed(() => {
    const depts = new Set<number>();
    this.positions().forEach((p) => {
      if (p.departament !== null && p.departament !== undefined) {
        depts.add(p.departament);
      }
    });
    return Array.from(depts).sort((a, b) => {
      const labelA = this.getDepartamentLabel(a);
      const labelB = this.getDepartamentLabel(b);
      return labelA.localeCompare(labelB);
    });
  });

  filteredPositions = computed(() => {
    const selected = this.selectedDepartment();
    const positions = this.positions();
    let filtered = selected === null
      ? positions
      : positions.filter((p) => p.departament === selected);
    return [...filtered].sort((a, b) => {
      const depA = a.departament ?? -1;
      const depB = b.departament ?? -1;
      return depA - depB;
    });
  });

  constructor() {
    effect(() => {
      if (this.customerIdS.customerId()) this.onLoadData();
    });
  }

  openConfirmPresentationModal(position: IWorkPosition) {
    this.dialogHandlerS
      .openDialog(
        ConfirmPresentationModal,
        {
          processId: position.positionRequest?.id,
          candidateName: "Candidato (Alta en progreso)",
          vacancyFolio: position.folio,
        },
        "Confirmar Ingreso del Candidato",
        this.dialogHandlerS.sizeMd,
      )
      .then((res) => {
        if (res) this.onLoadData();
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

  onOrgChart(): void {
    this.router.navigateByUrl("/directory/work-position-org-chart");
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

  onManageIncidents(item: IWorkPosition): void {
    if (!item.employeeId) return;
    this.dialogHandlerS
      .openDialog(
        IncidentFormComponent,
        { employeeId: item.employeeId },
        "Incidencias Administrativas",
        DialogSize.full,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onManageUser(item: IWorkPosition): void {
    if (!item.applicationUserId) return;
    this.dialogHandlerS
      .openDialog(
        MdEditAccount,
        { applicationUserId: item.applicationUserId },
        "Administrar Usuario",
        DialogSize.md,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onRequestDismissal(item: IWorkPosition): void {
    if (!item.employeeId) return;
    this.dialogHandlerS
      .openDialog(
        SolicitudBajaForm,
        { employeeId: item.employeeId },
        "Solicitar Baja",
        DialogSize.full,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onRequestSalaryMod(item: IWorkPosition): void {
    if (!item.employeeId) return;
    this.dialogHandlerS
      .openDialog(
        SolicitudModificacionSalarioForm,
        { employeeId: item.employeeId },
        "Solicitar Modificación de Salario",
        DialogSize.full,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
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
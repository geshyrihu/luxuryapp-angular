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
import { ConfirmService } from "src/app/shared/ui/buttons/shared/confirm.service";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { RecoveryGuideModal } from "./recovery-guide-modal/recovery-guide-modal";
import { IncidentFormComponent } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/incident-form";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { Department } from "src/app/core/enums/department.enum";
import { PositionRequestStatus } from "src/app/core/enums/position-request-status.enum";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { globalFilterFields as getGlobalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { IWorkPosition } from "src/app/shared/integration/reclutamiento/estructura-organizacional/work-position/interfaces/work-position.model";
import { JobDescriptionForm } from "src/app/shared/integration/reclutamiento/estructura-organizacional/work-position/job-description-form";
import { WorkPositionForm } from "src/app/shared/integration/reclutamiento/estructura-organizacional/work-position/work-position-form";
import { SolicitudBajaForm } from "src/app/shared/integration/reclutamiento/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/dismissal-requests/solicitud-baja-form";
import { SolicitudModificacionSalarioForm } from "src/app/shared/integration/reclutamiento/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/salary-modification-requests/solicitud-modificacion-salario-form";
import { SolicitudVacanteForm } from "src/app/shared/integration/reclutamiento/reclutamiento-y-altas-bajas/reclutamiento-solicitudes/vacancy-requests/solicitud-vacante-form";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import {
  SegmentedControl,
  SegmentItem,
} from "src/app/shared/ui/shared/segmented-control/segmented-control";
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
import { StaffOnboardingChecklistModal } from "./staff-onboarding-checklist-modal/staff-onboarding-checklist-modal";

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
    AppIcon,
    SegmentedControl,
  ],
})
export class StaffBoardList {
  readonly apiS = inject(ApiResponseService);
  readonly customerIdS = inject(CustomerIdService);
  readonly dialogHandlerS = inject(DialogHandlerService);
  readonly aspRoleS = inject(AspRoleService);
  readonly router = inject(Router);
  private excelService = inject(ExcelExportService);
  private confirmS = inject(ConfirmService);
  private interviewerQueueS = inject(CandidateInterviewerQueueService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  readonly AspRole = ApplicationRole;

  readonly interviewerQueue = signal<CandidateInterviewerQueueDto[]>([]);
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
    [Department.Almacen]: "Almacén",
    [Department.Amenidades]: "Amenidades",
    [Department.Asistente]: "Asistente",
    [Department.NA]: "Sin Departamento",
  };

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels[value] ?? "Sin Departamento";
  }

  positions = signal<IWorkPosition[]>([]);
  selectedDepartment = signal<number | null>(null);
  statusFilter = signal<"Activo" | "Inactivo">("Activo");
  globalFilterFields = computed(() => getGlobalFilterFields(this.positions()));
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  /**
   * Backend-Driven UI (motor de políticas RRHH): la política es la misma para todo el listado
   * de un mismo usuario autenticado, por lo que basta con leer el booleano de cualquier fila cargada.
   */
  showSalaryColumn = computed(() =>
    this.positions().some((p) => p.canViewSensitiveData),
  );

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

  readonly departmentFilterItems = computed<SegmentItem[]>(() => [
    { value: null, label: "Todos" },
    ...this.uniqueDepartments().map((dept) => ({
      value: dept,
      label: this.getDepartamentLabel(dept),
    })),
  ]);

  filteredPositions = computed(() => {
    const selected = this.selectedDepartment();
    const positions = this.positions();
    let filtered =
      selected === null
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

  async onLoadData(): Promise<void> {
    const customerId = this.customerIdS.customerId();

    const positions = await this.apiS.onGetList<IWorkPosition[]>(
      Endpoints.WorkPositions.listByCustomer(customerId, this.statusFilter()),
    );

    // Normalizar departamentos null a Department.NA para que se agrupen correctamente
    const normalizedPositions = (positions ?? []).map((p) => ({
      ...p,
      departament: p.departament ?? Department.NA,
    }));

    this.positions.set(normalizedPositions);

    await this.loadInterviewerQueue();
  }

  async loadInterviewerQueue(): Promise<void> {
    try {
      const queue = await this.interviewerQueueS.getInterviewerQueue();
      this.interviewerQueue.set(queue);
    } catch {
      // Error ya manejado por ApiResponseService
    }
  }

  onOrgChart(): void {
    this.router.navigateByUrl("/directory/work-position-org-chart");
  }

  onStatusFilterChange(status: "Activo" | "Inactivo"): void {
    if (this.statusFilter() === status) return;
    this.statusFilter.set(status);
    this.onLoadData();
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

  async onRequestDelete(item: IWorkPosition): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este puesto?",
      "Confirmar eliminación",
    );
    if (ok) this.onDelete(item.id);
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
      DialogSize.full,
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

  onShowRecoveryGuide(item: IWorkPosition): void {
    this.dialogHandlerS.openDialog(
      RecoveryGuideModal,
      { employeeName: item.applicationUser || "" },
      "Recuperar Usuario y Contraseña",
      DialogSize.md,
    );
  }

  onOpenOnboardingChecklist(item: IWorkPosition): void {
    if (!item.employeeId) return;

    this.dialogHandlerS.openDialog(
      StaffOnboardingChecklistModal,
      {
        employeeId: item.employeeId,
        employeeName: item.applicationUser || item.applicationRoleName,
        workPositionName: item.applicationRoleName,
      },
      "Checklist de onboarding",
      DialogSize.lg,
    );
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

  /**
   * Puesto vacante = sin colaborador asignado (ni FK de usuario ni nombre).
   * Unifica el criterio: antes solo miraba `applicationUser`, pero los
   * handlers de empleado usan `applicationUserId`/`employeeId`.
   */
  isVacant(item: IWorkPosition): boolean {
    return !(item.applicationUserId || item.applicationUser);
  }

  necesitaActualizacion(item: IWorkPosition): boolean {
    return !item.applicationRoleName || item.applicationRoleName === "Asignar";
  }

  /**
   * Estado de la solicitud de vacante del puesto, derivado de `positionRequest`.
   * 'none' = sin solicitud, 'open' = vigente (Abierta), 'inProgress' = alta en proceso.
   */
  vacancyState(
    item: IWorkPosition,
  ): "none" | "inProgress" | "open" {
    const status = item.positionRequest?.status;
    if (status == null) return "none";
    return status === PositionRequestStatus.Abierta ? "open" : "inProgress";
  }

  /** Muestra "Solicitar Vacante" solo cuando no hay solicitud activa. */
  shouldShowVacancyRequest(item: IWorkPosition): boolean {
    return this.vacancyState(item) === "none";
  }

  /** Habilita "Confirmar Ingreso": vacante vigente (status Abierta). */
  canConfirmIngress(item: IWorkPosition): boolean {
    return this.vacancyState(item) === "open";
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

  /**
   * Obtiene la entrevista activa para el puesto actual usando workPositionId y solicitud de vacante.
   */
  getQueueForPosition(
    item: IWorkPosition,
  ): CandidateInterviewerQueueDto | undefined {
    return this.interviewerQueue().find(
      (vacancy) =>
        vacancy.workPositionId === item.id ||
        (!!item.positionRequest?.id &&
          vacancy.requestPositionId === item.positionRequest.id),
    );
  }

  async onGoToMyPendingInterviews(): Promise<void> {
    this.router.navigate(["/directory/employee-interviewer-queue"]);
  }
}

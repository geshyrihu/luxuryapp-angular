import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LxPopover } from "@ui/adaptive/popover/popover";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  chatbubblesOutline,
  checkmarkCircleOutline,
  clipboardOutline,
  createOutline,
  eyeOutline,
  folderOpenOutline,
  gridOutline,
  lockClosedOutline,
  lockOpenOutline,
  mailOutline,
  peopleOutline,
  refreshOutline,
  reloadOutline,
  sendOutline,
  settingsOutline,
  trashOutline,
} from "ionicons/icons";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

import { CardEmployee } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employees/card-employee";
import { PrintService } from "src/app/core/services/print.service";

import Swal from "sweetalert2";

import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  WebButtonLabelItem,
} from "@ui/buttons/web-label";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { InitialsAbbrPipe } from "src/app/shared/pipes/initials-abbr.pipe";
import { SendOperationReport } from "../send-operation-report/send-operation-report";
import { TaskClose } from "../task-close";
import { TaskFollowup } from "../task-follow-up/task-followup";
import { TaskProgram } from "../task-program";
import { TaskReadList } from "../task-read-list";
import { TaskReopen } from "../task-reopen";
import { TaskStatus } from "../task-status/task-status";
import { ITaskResultDTO } from "./interfaces/task-message.dto";
import { TaskForm } from "./task-form";

import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { IonInputText } from "@ui/inputs/mobile/ion-input-text";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.html",
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }
      :host ::ng-deep primeng-custom-caption > div {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep app-task-status > div {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep base-input-signal .field {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep tr.task-link-source > td {
        opacity: 0.55;
      }
      :host ::ng-deep tr.task-link-target > td {
        background-color: rgba(147, 51, 234, 0.1) !important;
        outline: 2px dashed rgba(147, 51, 234, 0.55);
        outline-offset: -2px;
      }
      :host ::ng-deep tr.task-chain-member > td:nth-child(2) {
        border-left: 3px solid rgba(147, 51, 234, 0.45);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxTag,
    IonInputSelect,
    IonInputText,
    MobileActionMenu,
    MobileListItem,
    MobileButtonLabelItem,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    ActionMenu,
    CustomInputTextSignal,
    TaskStatus,
    CustomInputSelectSignal,
    WebButtonLabel,
    AppAvatar,
    AppImage,
    CustomInputToggleSwitch,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    LxTooltipDirective,
    LxPopover,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    InitialsAbbrPipe,
    AppIcon,
  ],
})
export class TaskList implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiS = inject(ApiResponseService);
  private readonly authS = inject(AuthService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly customToastS = inject(CustomToastService);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  private readonly router = inject(Router);
  private readonly taskGroupS = inject(TaskGroupService);
  private readonly aspRoleS = inject(AspRoleService);
  private readonly printS = inject(PrintService);

  // User and Data Setup
  readonly applicationUser = this.authS.applicationUserId;
  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);
  readonly ticketGroupId: string =
    this.activatedRoute.snapshot.params.ticketGroupId;

  // Task-list tiene caption doble (tótulo + filtros + leyenda) que suma ~170px
  // adicionales al offset estóndar del servicio (240px). Total: ~410px.
  private readonly TASK_LIST_OFFSET = 320;
  scrollHeight = signal<string>(this.calcScrollHeight());

  private calcScrollHeight(): string {
    return `${window.innerHeight - this.TASK_LIST_OFFSET}px`;
  }
  readonly Math = Math;
  readonly today = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  readonly pendingItems = computed(() =>
    this.dataSignal().items.filter((i) => i.status !== "Completed"),
  );

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      NotStarted: "No iniciado",
      InProgress: "En proceso",
      Reopened: "Reabierto",
    };
    return map[status] ?? status;
  }

  statusPillStyle(status: string): string {
    const map: Record<string, string> = {
      NotStarted: "background:var(--ds-danger-light);color:var(--ds-danger)",
      InProgress: "background:var(--ds-warning-light);color:var(--ds-warning)",
      Reopened: "background:var(--ds-danger-light);color:var(--ds-danger)",
    };
    return (
      map[status] ?? "background:var(--ds-border);color:var(--ds-text-primary)"
    );
  }

  statusTdClass(status: string): string {
    const map: Record<string, string> = {
      NotStarted: "td-status-not-started",
      InProgress: "td-status-in-progress",
      Reopened: "td-status-reopened",
    };
    return map[status] ?? "";
  }

  printReport(): void {
    this.printS.printElement(undefined, "Reporte de Tareas Pendientes");
  }

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  // Signals para estado de la lista
  readonly page = signal(1);
  readonly pageSize = signal(30);
  readonly searchTerm = signal("");
  readonly sortField = signal("");
  readonly sortOrder = signal(1);
  readonly status = signal(this.taskGroupS.taskGroupMessageStatus);
  readonly loading = signal(true);
  readonly totalRecords = signal(0);

  readonly dataSignal = signal<ITaskResultDTO>({
    nameGroup: "",
    assignee: null,
    totalRecords: 0,
    items: [],
  });

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal().items),
  );

  readonly assigneeControl = new FormControl<string | null>(null);
  cb_assignee: SelectItemDto[] = [];

  // Week Info
  readonly year = signal(this.taskGroupS.year || 0);
  readonly numeroSemana = signal(this.taskGroupS.numeroSemana || 0);
  readonly wekklyIsNullOrEmpty = signal(true);
  readonly weekInputValueControl = new FormControl<string>("", {
    nonNullable: true,
  });
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    addIcons({
      chatbubblesOutline,
      calendarOutline,
      lockClosedOutline,
      lockOpenOutline,
      reloadOutline,
      createOutline,
      trashOutline,
      folderOpenOutline,
      settingsOutline,
      checkmarkCircleOutline,
      refreshOutline,
      mailOutline,
      peopleOutline,
      eyeOutline,
      clipboardOutline,
      sendOutline,
      gridOutline,
    });

    window.addEventListener("resize", () => {
      this.scrollHeight.set(this.calcScrollHeight());
    });
  }

  ngOnInit(): void {
    this.initializeWeekInfo();
    this.weekInputValueControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((weekValue) => this.updateWeekFromValue(weekValue));
    this.onLoadData();
  }

  initializeWeekInfo(): void {
    if (this.year() === 0 || this.numeroSemana() === 0) {
      this.wekklyIsNullOrEmpty.set(true);
    } else {
      this.wekklyIsNullOrEmpty.set(false);
      const startOfWeek = this.getStartOfWeek(this.year(), this.numeroSemana());
      this.weekInputValueControl.setValue(
        `${startOfWeek.getFullYear()}-W${
          this.numeroSemana() < 10 ? "0" : ""
        }${this.numeroSemana()}`,
        { emitEvent: false },
      );
    }
  }

  getStartOfWeek(year: number, weekNumber: number): Date {
    const januaryFirst = new Date(year, 0, 1);
    const daysToAdd = (weekNumber - 1) * 7 - (januaryFirst.getDay() || 7) + 1;
    return new Date(year, 0, 1 + daysToAdd);
  }

  onLoadData(resetPage = false) {
    if (resetPage) this.page.set(1);

    const currentPage = isNaN(this.page()) ? 1 : this.page();
    const currentSize = isNaN(this.pageSize()) ? 30 : this.pageSize();

    const httpParams = {
      page: currentPage,
      recordsNumber: currentSize,
      filter: this.searchTerm(),
      sortField: this.sortField(),
      sortOrder: this.sortOrder(),
    };

    this.loading.set(true);
    this.apiS
      .onGetList<ITaskResultDTO>(
        Endpoints.Tasks.list(this.ticketGroupId, this.status()),
        httpParams,
      )
      .then((responseData: ITaskResultDTO) => {
        if (responseData) {
          this.dataSignal.set(responseData);
          this.totalRecords.set(responseData.totalRecords);
          this.cb_assignee = responseData.assignee;
        }
        this.loading.set(false);
      });
  }

  onLoadDataOffLoading() {
    const currentPage = isNaN(this.page()) ? 1 : this.page();
    const currentSize = isNaN(this.pageSize()) ? 30 : this.pageSize();

    const httpParams = {
      page: currentPage,
      recordsNumber: currentSize,
      filter: this.searchTerm(),
      sortField: this.sortField(),
      sortOrder: this.sortOrder(),
    };

    this.apiS
      .onGetListNotLoading<ITaskResultDTO>(
        Endpoints.Tasks.list(this.ticketGroupId, this.status()),
        httpParams,
      )
      .then((responseData: ITaskResultDTO) => {
        if (responseData) {
          this.dataSignal.set(responseData);
          this.totalRecords.set(responseData.totalRecords);
        }
      });
  }

  applyFilter() {
    this.onLoadData(true);
  }

  onStatusChange(status: string) {
    this.status.set(status);
    this.onLoadData(true);
  }

  loadDataLazy(event: any) {
    const rows = event.rows || this.pageSize() || 30;
    const first = event.first || 0;

    this.page.set(Math.floor(first / rows) + 1);
    this.pageSize.set(rows);
    this.sortField.set(event.sortField || "");
    this.sortOrder.set(event.sortOrder || 1);
    this.searchTerm.set(event.globalFilter || this.searchTerm());
    this.onLoadData();
  }

  onResponsibleChange(item: any) {
    this.assigneeControl.setValue(item, { emitEvent: false });
    this.searchTerm.set(item);
    this.onLoadDataOffLoading();
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskForm,
        { id: data.id, ticketGroupId: this.ticketGroupId },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployee,
      { applicationUserId },
      "Colaborador",
      this.dialogHandlerS.sizeLg,
    );
  }

  onProgram(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskProgram,
        { id: id, ticketGroupId: this.ticketGroupId },
        "Programar actividad",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onReopen(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskReopen,
        { id: id },
        "Re abrir ticket",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onView(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskReadList,
        { id: id },
        "Vistas",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onProgress(id: string) {
    Swal.fire({
      title: "Confirmar",
      text: "Se colocaré el ticket en proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d3b66",
      cancelButtonColor: "#9B1B30",
      confirmButtonText: "Sé, en proceso!",
      cancelButtonText: "Cancelar",
    }).then((responseData) => {
      if (responseData.value) {
        this.apiS
          .onGetItem(
            Endpoints.Tasks.inProgressLower(id, this.authS.applicationUserId),
          )
          .then(() => {
            this.onLoadData();
          });
      }
    });
  }

  onNavigateEdit(ticketMessageId: string, ticketGroupId: string) {
    this.router.navigate(
      ROUTES.TICKETS.MENSAJE(ticketMessageId, ticketGroupId),
    );
  }

  onClosed(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskClose,
        { id: id },
        "Cerrar ticket",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onUpdateStateTicket(item: any) {
    this.apiS.onGetItem(Endpoints.Tasks.updateRelevance(item.id)).then(() => {
      this.customToastS.showSuccess(
        "Completado",
        "Relevancia actualizada correctamente.",
      );
    });
  }

  onFollowUp(id: string) {
    this.dialogHandlerS
      .openDialog<{
        count: number;
        lastFollowUp: string | null;
        lastFollowUpDate: string | null;
      }>(TaskFollowup, { id: id }, "Seguimiento", this.dialogHandlerS.sizeLg)
      .then((result) => {
        if (result && result.count >= 0) {
          this.dataSignal.update((currentData) => ({
            ...currentData,
            items: currentData.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    ticketMessageFollowUp: result.count,
                    lastFollowUp: result.lastFollowUp,
                    lastFollowUpDate: result.lastFollowUpDate,
                  }
                : item,
            ),
          }));
        }
      });
  }

  onUpdatePriority(id: string) {
    this.apiS
      .onGetItem(
        Endpoints.Tasks.updatePriorityLower(id, this.authS.applicationUserId),
      )
      .then((responseData: any) => {
        if (responseData) {
          this.dataSignal.update((currentData) => {
            const items = currentData.items.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  priority: item.priority === "High" ? "Low" : "High",
                };
              }
              return item;
            });
            return { ...currentData, items };
          });
        }
      });
  }

  onDelete(id: any) {
    this.apiS
      .onDelete(
        Endpoints.Tasks.deleteByCustomer(id, this.customerIdS.customerId()),
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.dataSignal.update((currentData) => {
            const items = currentData.items.filter((item) => item.id !== id);
            return { ...currentData, items };
          });
        }
      });
  }

  handleWeekChange(event: Event): void {
    const weekValue = (event.target as HTMLInputElement).value;
    this.updateWeekFromValue(weekValue);
  }

  private updateWeekFromValue(weekValue: string): void {
    if (!weekValue) {
      this.wekklyIsNullOrEmpty.set(true);
      return;
    }

    const parts = weekValue.split("-W");
    if (parts.length < 2) {
      this.wekklyIsNullOrEmpty.set(true);
      return;
    }

    const parsedYear = parseInt(parts[0], 10);
    const parsedWeek = parseInt(parts[1], 10);

    if (isNaN(parsedYear) || isNaN(parsedWeek)) {
      this.wekklyIsNullOrEmpty.set(true);
      return;
    }

    this.year.set(parsedYear);
    this.numeroSemana.set(parsedWeek);
    this.wekklyIsNullOrEmpty.set(false);

    this.taskGroupS.year = parsedYear;
    this.taskGroupS.numeroSemana = parsedWeek;
  }

  onPreviewWeeklyReport(): void {
    this.router.navigate(ROUTES.TICKETS.REPORTE_SEMANAL_VISTA);
  }

  onSendWeeklyReport(): void {
    this.dialogHandlerS
      .openDialog(
        SendOperationReport,
        {
          year: this.year(),
          numeroSemana: this.numeroSemana(),
        },
        "Envio de reporte semanal",
        this.dialogHandlerS.sizeFull,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  loadNextPage(event: any) {
    this.page.update((p) => (isNaN(p) ? 1 : p + 1));
    const currentPage = this.page();
    const currentSize = isNaN(this.pageSize()) ? 30 : this.pageSize();

    const httpParams = {
      page: currentPage,
      recordsNumber: currentSize,
      filter: this.searchTerm(),
      sortField: this.sortField(),
      sortOrder: this.sortOrder(),
    };

    this.apiS
      .onGetListNotLoading<ITaskResultDTO>(
        Endpoints.Tasks.list(this.ticketGroupId, this.status()),
        httpParams,
      )
      .then((responseData: ITaskResultDTO) => {
        if (responseData && responseData.items) {
          this.dataSignal.update((currentData) => ({
            ...currentData,
            items: [...currentData.items, ...responseData.items],
          }));
          this.totalRecords.set(responseData.totalRecords);
        }
        event.target.complete();
      });
  }

  onPreviewClickedWorkPlan(): void {
    this.router.navigate(ROUTES.TICKETS.PLAN_TRABAJO_VISTA);
  }

  onPendingBoard(): void {
    this.router.navigate(ROUTES.TICKETS.PENDIENTES(this.ticketGroupId));
  }

  onRowReorder(event: { dragIndex: number; dropIndex: number }): void {
    // PrimeNG mutates the value array before emitting é array already has new order.
    // items[dropIndex] is the item the user dragged.
    let items = [...this.dataSignal().items];

    const movedItem = items[event.dropIndex];
    if (!movedItem) {
      this.dataSignal.update((c) => ({ ...c, items }));
      this.apiS.onPut(
        Endpoints.Tasks.updateOrder,
        items.map((i) => i.id),
      );
      return;
    }

    // BFS: collect ALL transitive dependents é
    //   é parentTaskId === currentId  (true child tasks)
    //   é dependsOnTaskId === currentId  (successor in predecessor chain)
    const dependentIds = new Set<string>();
    const queue = [movedItem.id];
    const visited = new Set<string>([movedItem.id]);

    while (queue.length > 0) {
      const pid = queue.shift()!;
      for (const item of items) {
        if (visited.has(item.id)) continue;
        if (item.parentTaskId === pid || item.dependsOnTaskId === pid) {
          dependentIds.add(item.id);
          visited.add(item.id);
          queue.push(item.id);
        }
      }
    }

    if (dependentIds.size > 0) {
      // Preserve the relative order of dependents as they appeared before
      const dependents = items.filter((i) => dependentIds.has(i.id));
      const rest = items.filter((i) => !dependentIds.has(i.id));
      const parentIdx = rest.findIndex((i) => i.id === movedItem.id);
      rest.splice(parentIdx + 1, 0, ...dependents);
      items = rest;
    }

    this.dataSignal.update((current) => ({ ...current, items }));
    this.apiS.onPut(
      Endpoints.Tasks.updateOrder,
      items.map((i) => i.id),
    );
  }

  // --- Chain step computation (visual Gantt-style ordering) ---

  readonly chainStepMap = computed(() => {
    const items = this.dataSignal().items;
    const predMap = new Map<string, string | null>(
      items.map((i) => [i.id, i.dependsOnTaskId ?? null]),
    );
    const stepCache = new Map<string, number>();

    const getStep = (id: string, visited = new Set<string>()): number => {
      if (stepCache.has(id)) return stepCache.get(id)!;
      if (visited.has(id)) return 1;
      visited.add(id);
      const predId = predMap.get(id);
      if (!predId || !predMap.has(predId)) {
        stepCache.set(id, 1);
        return 1;
      }
      const step = getStep(predId, new Set(visited)) + 1;
      stepCache.set(id, step);
      return step;
    };

    for (const item of items) getStep(item.id);
    return stepCache;
  });

  readonly chainedTaskIds = computed(() => {
    const items = this.dataSignal().items;
    const predecessorIds = new Set(
      items.filter((i) => i.dependsOnTaskId).map((i) => i.dependsOnTaskId!),
    );
    return new Set(
      items
        .filter((i) => i.dependsOnTaskId || predecessorIds.has(i.id))
        .map((i) => i.id),
    );
  });

  // --- Drag-to-link (asignación de predecesora por arrastre) ---

  readonly linkDragSourceId = signal<string | null>(null);
  readonly linkDragTargetId = signal<string | null>(null);

  onLinkDragStart(event: DragEvent, taskId: string): void {
    event.stopPropagation();
    this.linkDragSourceId.set(taskId);
    event.dataTransfer?.setData("application/task-link", taskId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "link";
  }

  onLinkDragOver(event: DragEvent, taskId: string): void {
    if (!this.linkDragSourceId() || this.linkDragSourceId() === taskId) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "link";
    this.linkDragTargetId.set(taskId);
  }

  onLinkDragLeave(event: DragEvent, taskId: string): void {
    const related = event.relatedTarget as Element | null;
    const target = event.currentTarget as Element;
    if (!related || !target.contains(related)) {
      if (this.linkDragTargetId() === taskId) this.linkDragTargetId.set(null);
    }
  }

  onLinkDrop(event: DragEvent, targetTaskId: string): void {
    event.preventDefault();
    event.stopPropagation();
    const sourceId = this.linkDragSourceId();
    if (sourceId && sourceId !== targetTaskId) {
      this.onSetDependency(sourceId, targetTaskId);
    }
    this.linkDragSourceId.set(null);
    this.linkDragTargetId.set(null);
  }

  onLinkDragEnd(): void {
    this.linkDragSourceId.set(null);
    this.linkDragTargetId.set(null);
  }

  onSetDependency(taskId: string, predecessorId: string): void {
    this.apiS
      .onGetItem(Endpoints.Tasks.setDependency(taskId, predecessorId))
      .then(() => {
        this.dataSignal.update((current) => {
          const predecessor = current.items.find((i) => i.id === predecessorId);
          return {
            ...current,
            items: current.items.map((item) =>
              item.id === taskId
                ? {
                    ...item,
                    dependsOnTaskId: predecessorId,
                    dependsOnTaskFolio: predecessor?.folio ?? null,
                  }
                : item,
            ),
          };
        });
      });
  }

  onClearDependency(taskId: string): void {
    this.apiS.onGetItem(Endpoints.Tasks.clearDependency(taskId)).then(() => {
      this.dataSignal.update((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === taskId
            ? { ...item, dependsOnTaskId: null, dependsOnTaskFolio: null }
            : item,
        ),
      }));
    });
  }
}

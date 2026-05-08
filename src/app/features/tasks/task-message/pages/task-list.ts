import {
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
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonRow,
  IonSearchbar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  chatbubblesOutline,
  checkmarkCircleOutline,
  clipboardOutline,
  createOutline,
  eyeOutline,
  folderOpenOutline,
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
import { AvatarModule } from "primeng/avatar";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import {
  IonInputSelect,
  IonInputText,
} from "src/app/core/components/inputs/mobile";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CardEmployee } from "src/app/features/employees/employees/pages/card-employee";

import Swal from "sweetalert2";

import {
  IonButtonDelete,
  IonButtonEdit,
  IonButtonItem,
} from "src/app/core/components/buttons/mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { TaskGroupService } from "src/app/features/tasks/task.service";
import { TaskClose } from "../../components/task-close";
import { TaskProgram } from "../../components/task-program";
import { TaskReadList } from "../../components/task-read-list";
import { TaskReopen } from "../../components/task-reopen";
import { TaskStatus } from "../../components/task-status/task-status";
import { SendOperationReport } from "../../send-operation-report/pages/send-operation-report";
import { TaskFollowup } from "../../task-follow-up/pages/task-followup";
import { ITaskResultDTO } from "../models/task-message.dto";
import { TaskForm } from "./task-form";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.html",
  styles: [
    `
      :host ::ng-deep primeng-custom-caption > div {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep app-task-status > div {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep base-input-signal .field {
        margin-bottom: 0 !important;
      }
    `,
  ],
  imports: [
    TableModule,
    ActionMenu,
    CustomInputTextSignal,
    TaskStatus,
    CustomInputSelectSignal,
    CustomButton,
    AvatarModule,
    ImageModule,
    ToggleSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    TooltipModule,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonIcon,
    IonButtonDelete,
    IonButtonEdit,
    IonButtonItem,
    CommonModule,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonInputSelect,
    IonInputText,
  ],
})
export class TaskList implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiS = inject(ApiResponseService);
  private readonly authS = inject(AuthService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly customToastS = inject(CustomToastService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);
  private readonly router = inject(Router);
  private readonly taskGroupS = inject(TaskGroupService);
  private readonly aspRoleS = inject(AspRoleService);

  // User and Data Setup
  readonly applicationUser = this.authS.applicationUserId;
  readonly isSuperUser = this.aspRoleS.roleSignal(
    EApplicationRole.SuperUsuario,
  );
  readonly ticketGroupId: string =
    this.activatedRoute.snapshot.params.ticketGroupId;

  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
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
  cb_assignee: ISelectItem[] = [];

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
      pageSize: currentSize,
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
      pageSize: currentSize,
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
      text: "Se colocarÃ¡ el ticket en proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d3b66",
      cancelButtonColor: "#9B1B30",
      confirmButtonText: "SÃ­, en proceso!",
      cancelButtonText: "Cancelar",
    }).then((responseData) => {
      if (responseData.value) {
        this.apiS
          .onGetItem(Endpoints.Tasks.inProgressLower(id, this.authS.applicationUserId))
          .then(() => {
          this.onLoadData();
        });
      }
    });
  }

  onNavigateEdit(ticketMessageId: string, ticketGroupId: string) {
    this.router.navigate(["/tickets/message/", ticketMessageId, ticketGroupId]);
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
      .openDialog(
        TaskFollowup,
        { id: id },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
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
      .onDelete(Endpoints.Tasks.deleteByCustomer(id, this.customerIdS.customerId()))
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
    this.router.navigate(["/tickets/weekly-report-preview"]);
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
      pageSize: currentSize,
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
    this.router.navigate(["/tickets/work-plan-preview"]);
  }

  onRowReorder(_event: { dragIndex: number; dropIndex: number }): void {
    // PrimeNG mutates the value array before emitting this event, so the array is already correctly ordered
    const items = [...this.dataSignal().items];
    this.dataSignal.update((current) => ({ ...current, items }));
    const ids = items.map((item) => item.id);
    this.apiS.onPut(Endpoints.Tasks.updateOrder, ids);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { SplitButtonModule } from "@ui/web/primeng-splitbutton/primeng-splitbutton";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { TaskGroupService } from "@operations.luxuryapp/task-engine/tasks/task.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { TaskForm } from "../task-message/task-form";

@Component({
  selector: "app-task-report-work-plan",
  templateUrl: "./task-report-work-plan.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DataViewMobile,
    MobileListItem,
    PrimeNgCustomCaption,
    AppIcon,
    WebButtonLabel,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    AppImage,
    AppAvatar,
    SplitButtonModule,
    CustomInputSelectSignal,
    ReactiveFormsModule,
  ],
})
export class TaskReportWorkPlan implements OnInit {
  onUpdatePriority(taskId: string): void {
    this.apiResponseS
      .onGetItem(
        Endpoints.Tasks.updatePriorityLower(taskId, this.authS.applicationUserId),
      )
      .then((result: boolean) => {
        if (!result) return;
        this.dataSignal.update((items) =>
          items.map((item) =>
            item.id === taskId
              ? { ...item, priority: item.priority === "High" ? "Low" : "High" }
              : item,
          ),
        );
      });
  }
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  TaskGroupService = inject(TaskGroupService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  router = inject(Router);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  originalData: any[] = [];
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  assigneeControl = new FormControl<string>(null);
  cb_assignee: SelectItemDto[] = [];
  status: number = this.TaskGroupService.taskGroupMessageStatus;
  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.TaskWorkPlans.pending(this.customerIdS.customerId()))
      .then((result: any) => {
        this.dataSignal.set(result);
        this.originalData = JSON.parse(JSON.stringify(result)); // Copia profunda
        const uniqueResponsibles = Array.from(
          new Map(
            this.originalData.map((item) => [item.assigneeId, item]),
          ).values(),
        );

        this.cb_assignee = uniqueResponsibles.map((item: any) => ({
          value: item.assigneeId,
          label: item.assignee,
        }));

        this.cb_assignee.push({
          value: null,
          label: "Mostrar todos",
        });
      });
  }

  onResponsibleChange(event: any) {
    const selected = this.assigneeControl.value;
    if (selected === null || event.target.value === "null") {
      // Mostrar todos los elementos
      this.dataSignal.set([...this.originalData]); // Restaura todos
    } else {
      // Filtrar por el responsable seleccionado
      const result = this.originalData.filter(
        (resp: any) => resp.assigneeId == selected,
      );
      this.dataSignal.set([...result]); // Crea una nueva referencia
    }
  }

  onPreviewClicked(): void {
    // Lígica para la vista previa
    this.router.navigate(ROUTES.TICKETS.PLAN_TRABAJO_VISTA);
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskForm,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        "Agregar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
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
}



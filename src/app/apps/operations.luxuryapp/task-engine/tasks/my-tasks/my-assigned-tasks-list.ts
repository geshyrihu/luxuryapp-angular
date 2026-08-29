import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { AppImage } from "@ui/web/image/image";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { CardEmployee } from "src/app/shared/integration/recursos-humanos";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PrintService } from "src/app/core/services/print.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { InitialsAbbrPipe } from "src/app/shared/pipes/initials-abbr.pipe";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import Swal from "sweetalert2";
import { TaskClose } from "../task-close";
import { TaskFollowup } from "../task-follow-up/task-followup";
import { TaskForm } from "../task-message/task-form";
import { TaskReopen } from "../task-reopen";
import { TaskStatus } from "../task-status/task-status";
import { MyTaskForm } from "./my-task-form";
import { MyTaskProgram } from "./my-task-program";

import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";

@Component({
  selector: "app-my-assigned-tasks-list",
  templateUrl: "./my-assigned-tasks-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    TaskStatus,
    TableModule,
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    ActionMenu,
    WebButtonLabel,
    FormsModule,
    LxTooltipDirective,
    AppImage,
    AppAvatar,
    PrimeNgCustomCaption,
    InitialsAbbrPipe,
    AppIcon,
  ],
})
export class MyAssignedTasksList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  TaskGroupService = inject(TaskGroupService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  activatedRoute = inject(ActivatedRoute);
  printS = inject(PrintService);
  status: string = this.TaskGroupService.taskGroupMessageStatus;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(this.status);
      }
    });
  }

  dataSignal = signal<any[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  searchTextSignal = signal("");

  readonly today = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  readonly pendingItems = computed(() =>
    this.dataSignal().filter((i) => i.status !== "Completed"),
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
    this.printS.printElement(undefined, "Reporte de Mis Tareas Pendientes");
  }

  filteredDataSignal = computed(() => {
    const text = this.searchTextSignal().toLowerCase();
    const data = this.dataSignal();
    if (!text) return data;
    return data.filter((item) => item.description.toLowerCase().includes(text));
  });

  onLoadData(status: any) {
    this.apiResponseS
      .onGetList(
        Endpoints.Tasks.myAssignedTickets(
          this.authS.applicationUserId,
          status,
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => {
        this.dataSignal.set(result);
        this.status = status;
      });
  }

  getTruncatedDescription(description: string): string {
    return description.length > 100
      ? description.slice(0, 100) + "..."
      : description;
  }

  onProgram(id: string) {
    this.dialogHandlerS
      .openDialog(
        MyTaskProgram,
        { id: id },
        "Programar actividad",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
  onClosed(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskClose,
        { id: id },
        "Cerrar ticket",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
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
          this.dataSignal.update((items) =>
            items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    ticketMessageFollowUp: result.count,
                    lastFollowUp: result.lastFollowUp,
                    lastFollowUpDate: result.lastFollowUpDate,
                  }
                : item,
            ),
          );
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskForm,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
      });
  }

  onModalAdd(data: any) {
    this.dialogHandlerS
      .openDialog(
        MyTaskForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
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
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
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

  onProgress(id: string) {
    Swal.fire({
      title: "Confirmar",
      text: "Se colocara el ticket en proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d3b66",
      cancelButtonColor: "#9B1B30",
      confirmButtonText: "Si, en proceso!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.apiResponseS
          .onGetItem(
            Endpoints.Tasks.inProgress(id, this.authS.applicationUserId),
          )
          .then(() => {
            // Actualizamos el valor del signal con los datos recibidos
            this.onLoadData(this.status);
          });
      }
    });
  }
}

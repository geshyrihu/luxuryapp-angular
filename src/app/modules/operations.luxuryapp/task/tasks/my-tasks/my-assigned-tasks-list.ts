import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { PrintService } from "@core/services/print.service";
import { SwalService } from "@core/services/swal.service";
import { TaskGroupService } from "@operations.luxuryapp/task/tasks/task.service";
import { CardEmployee } from "@shared/integration/recursos-humanos";
import { TaskClose } from "../task-close";
import { TaskFollowup } from "../task-follow-up/task-followup";
import { TaskForm } from "../task-message/task-form";
import { TaskReopen } from "../task-reopen";
import { MyAssignedTasksListDesktop } from "./desktop/my-assigned-tasks-list-desktop";
import { MyAssignedTasksListMobile } from "./mobile/my-assigned-tasks-list-mobile";
import { MyTaskProgram } from "./my-task-program";

@Component({
  selector: "app-my-assigned-tasks-list",
  templateUrl: "./my-assigned-tasks-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MyAssignedTasksListDesktop, MyAssignedTasksListMobile],
})
export class MyAssignedTasksList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  TaskGroupService = inject(TaskGroupService);
  customerIdS = inject(CustomerIdService);
  activatedRoute = inject(ActivatedRoute);
  printS = inject(PrintService);
  platformS = inject(PlatformService);
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
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
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
    this.loading.set(true);
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
      })
      .catch(() => undefined)
      .finally(() => this.loading.set(false));
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
      }>(TaskFollowup, { id: id }, "Seguimiento", this.dialogHandlerS.sizeXl)
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
        this.dialogHandlerS.sizeXl,
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
        TaskForm,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        data.title,
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
      this.dialogHandlerS.sizeXl,
    );
  }

  onProgress(id: string) {
    SwalService.show({
      title: "Confirmar",
      text: "Se colocara el ticket en proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d3b66",
      cancelButtonColor: "#9B1B30",
      confirmButtonText: "Si, en proceso!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiResponseS
          .onGetItem(
            Endpoints.Tasks.inProgress(id, this.authS.applicationUserId),
          )
          .then(() => {
            this.onLoadData(this.status);
          });
      }
    });
  }
}

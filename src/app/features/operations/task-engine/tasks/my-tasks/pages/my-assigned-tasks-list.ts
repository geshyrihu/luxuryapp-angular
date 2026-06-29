import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonAdd } from "src/app/core/components/web/buttons/custom-button-add";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/web/buttons/custom-button-item";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { InitialsAbbrPipe } from "src/app/core/pipes/initials-abbr.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PrintService } from "src/app/core/services/print.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CardEmployee } from "src/app/features/hr/expediente-del-empleado/employees/employees/pages/card-employee";
import { TaskGroupService } from "src/app/features/operations/task-engine/tasks/task.service";
import Swal from "sweetalert2";
import { TaskClose } from "../../components/task-close";
import { TaskReopen } from "../../components/task-reopen";
import { TaskStatus } from "../../components/task-status/task-status";
import { TaskFollowup } from "../../task-follow-up/pages/task-followup";
import { TaskForm } from "../../task-message/pages/task-form";
import { MyTaskForm } from "./my-task-form";
import { MyTaskProgram } from "./my-task-program";

@Component({
  selector: "app-my-assigned-tasks-list",
  templateUrl: "./my-assigned-tasks-list.html",
  imports: [
    CustomButtonEdit,
    CustomButtonItem,
    TaskStatus,
    CommonModule,
    TableModule,
    CustomButtonAdd,
    ActionMenu,
    CustomButton,
    FormsModule,
    TooltipModule,
    ImageModule,
    AvatarModule,
    PrimeNgCustomCaption,
    CustomInputTextSignal,
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

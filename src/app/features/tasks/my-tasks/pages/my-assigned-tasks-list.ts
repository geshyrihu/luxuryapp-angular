import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonAdd } from "src/app/core/components/buttons/web/custom-button-add";
import { CustomButtonTracking } from "src/app/core/components/buttons/web/custom-button-tracking";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CardEmployee } from "src/app/features/employees/employees/pages/card-employee";
import { TaskGroupService } from "src/app/features/tasks/task.service";
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
  imports: [IonButtonEdit, IonButtonItem, 
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
    CustomButtonTracking,
    CustomInputTextSignal,
  ],
})
export class MyAssignedTasksList {
  onDelete(arg0: any) {
    throw new Error("Method not implemented");
  }
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  TaskGroupService = inject(TaskGroupService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  activatedRoute = inject(ActivatedRoute);
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
      .openDialog(
        TaskFollowup,
        { id: id },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
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
          .onGetItem(Endpoints.Tasks.inProgress(id, this.authS.applicationUserId))
          .then(() => {
          // Actualizamos el valor del signal con los datos recibidos
          this.onLoadData(this.status);
        });
      }
    });
  }
}

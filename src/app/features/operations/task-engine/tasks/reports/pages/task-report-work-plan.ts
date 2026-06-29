import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ImageModule } from "primeng/image";
import { SplitButtonModule } from "primeng/splitbutton";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CardEmployee } from "src/app/features/hr/expediente-del-empleado/employees/employees/pages/card-employee";
import { TaskGroupService } from "src/app/features/operations/task-engine/tasks/task.service";
import { TaskForm } from "../../task-message/pages/task-form";

@Component({
  selector: "app-task-report-work-plan",
  templateUrl: "./task-report-work-plan.html",
  imports: [
    CustomButton,

    TableModule,
    ImageModule,
    AvatarModule,
    SplitButtonModule,
    CustomInputSelectSignal,
    ReactiveFormsModule,
    TooltipModule,
  ],
})
export class TaskReportWorkPlan implements OnInit {
  onUpdatePriority(arg0: any) {
    throw new Error("Method not implemented");
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
  cb_assignee: ISelectItem[] = [];
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
    // Lógica para la vista previa
    this.router.navigate(["/tickets/work-plan-preview"]);
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

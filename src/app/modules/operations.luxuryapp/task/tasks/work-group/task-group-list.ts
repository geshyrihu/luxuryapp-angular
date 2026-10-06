import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { TaskGroupParticipant } from "@operations.luxuryapp/task/tasks/participants/task-group-participant";
import { TaskGroupService } from "@operations.luxuryapp/task/tasks/task.service";
import { addIcons } from "ionicons";
import {
  chatbubblesOutline,
  lockClosedOutline,
  lockOpenOutline,
  mailOutline,
  peopleOutline,
} from "ionicons/icons";
import { ROUTES } from "src/app/routing/route-paths";
import { EITaskMessageDTOStatus } from "../shared/enums/task-message-status.enum";
import { TaskGroupListDesktop } from "./desktop/task-group-list-desktop";
import { TaskGroupListMobile } from "./mobile/task-group-list-mobile";
import { TaskGroupForm } from "./task-group-form";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-task-group-list",
  templateUrl: "./task-group-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TaskGroupListDesktop, TaskGroupListMobile],
})
export class TaskGroupList {
  authS = inject(AuthService);
  confirmS = inject(ConfirmService);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  TaskGroupService = inject(TaskGroupService);
  aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);
  error: string = "";
  dataSignal = signal<any[]>([]);
  hasLegal = this.aspRoleS.roleSignal(ApplicationRole.Legal);
  hasSuperUsuario = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  readonly searchTerm = signal<string>("");
  readonly filteredData = computed(() => {
    const data = this.dataSignal();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return data;

    const fields = this.globalFilterFields();
    return data.filter((item) =>
      fields.some((field) =>
        String(item[field] ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  });
  loading = signal(true);

  readonly value = signal<boolean>(true);

  constructor() {
    addIcons({
      chatbubblesOutline,
      peopleOutline,
      mailOutline,
      lockClosedOutline,
      lockOpenOutline,
    });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const applicationUserId = this.authS.applicationUserId;

    this.loading.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.TaskGroups.list(customerId, this.value(), applicationUserId),
      )
      .then((result: any) => {
        this.dataSignal.set(result || []);
        this.loading.set(false);
      });
  }
  onChange(value: boolean) {
    this.value.set(value);
    this.onLoadData();
  }
  onToggleStatus(id: string) {
    this.apiResponseS
      .onPatch(Endpoints.TaskGroups.toggleStatus(id), null)
      .then(() => {
        this.onLoadData();
      });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(TaskGroupForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalParticipants(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskGroupParticipant,
        data,
        "Integrantes del grupo",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onNavigateMessage(
    ticketGroupId: string,
    taskGroupMessageStatus: EITaskMessageDTOStatus,
  ) {
    this.TaskGroupService.taskGroupMessageStatus = taskGroupMessageStatus;
    this.TaskGroupService.setStatus(taskGroupMessageStatus);
    const ticketGroupIdStr = ticketGroupId;
    this.router.navigate(ROUTES.TICKETS.MENSAJES(ticketGroupIdStr));
  }

  async onDelete(id: string) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.TaskGroups.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.set(
            this.dataSignal().filter((item) => item.id !== id),
          );
      });
  }

  SendReportPendingTicketGroupAsync(item: any) {
    this.apiResponseS
      .onPost(Endpoints.TaskGroups.sendReportPendingByGroup(item.id), null)
      .then((result: any) => {
        if (result) {
        }
      });
  }

  SendReportPendingTicketGroupAllAsync() {
    this.apiResponseS
      .onPost(Endpoints.TaskGroups.sendReportPendingAll, null)
      .then((result: any) => {
        if (result) {
        }
      });
  }
}
export interface WorkGroupDTO {
  id: string;
  nameGroup: string;
  customerId: string;
  customer: string;
  dateCreation: string;
  description: string;
  userCreate: string;
  visibility: string;
  emoji: string;
  color: string;
  TaskGroupParticipant: number;
  open: number;
  inProgress: number;
  closed: number;
  reopened: number;
  totalPending: number;
  active: boolean;
  isLegalGroup: boolean;
}

import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { addIcons } from "ionicons";
import {
  chatbubblesOutline,
  lockClosedOutline,
  lockOpenOutline,
  mailOutline,
  peopleOutline,
} from "ionicons/icons";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import {
  WebButtonLabelActiveDesactive,
  WebButtonLabel,
  WebButtonLabelDelete,
  WebButtonLabelEdit,
  WebButtonLabelItem,
} from "src/app/core/components/buttons/web-label";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { StatusBadge } from "src/app/core/components/shared/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ROUTES } from "src/app/routing/route-paths";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskGroupParticipant } from "src/app/features/operations/task-engine/tasks/participants/pages/task-group-participant";
import { TaskGroupService } from "src/app/features/operations/task-engine/tasks/task.service";
import { EITaskMessageDTOStatus } from "../../task-message-status.enum";
import { TaskGroupForm } from "./task-group-form";

@Component({
  selector: "app-task-group-list",
  templateUrl: "./task-group-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    NgbDropdownModule,
    DataViewModule,
    CardModule,
    TableModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    WebButtonLabel,
    WebButtonLabelActiveDesactive,
    TagModule,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    WebButtonLabelActiveDesactive,
    TooltipModule,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    PrimeNgCustomCaption,
    StatusBadge,
  ],
})
export class TaskGroupList {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  router = inject(Router); // Injectamos Router.
  TaskGroupService = inject(TaskGroupService);
  aspRoleS = inject(AspRoleService);
  error: string = "";
  dataSignal = signal<any[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  hasLegal = this.aspRoleS.roleSignal(EApplicationRole.Legal);
  hasSuperUsuario = this.aspRoleS.roleSignal(EApplicationRole.SuperUsuario);

  /*
  /PRIME NG TABLE OPTIONS
  */
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  /*
  /PRIME NG TABLE OPTIONS
  */
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
      .openDialog(TaskGroupForm, data, data.title, this.dialogHandlerS.sizeLg)
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
        this.dialogHandlerS.sizeLg,
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

  onDelete(id: string) {
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

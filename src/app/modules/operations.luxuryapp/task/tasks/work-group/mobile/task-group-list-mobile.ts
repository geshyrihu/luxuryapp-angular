import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

import { EITaskMessageDTOStatus } from "../../shared/enums/task-message-status.enum";
import { WorkGroupDTO } from "../task-group-list";

@Component({
  selector: "app-task-group-list-mobile",
  templateUrl: "./task-group-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonMobile, MobileActionMenu, LuxDataViewMobile, LxIcon],
})
export class TaskGroupListMobile {
  data = input.required<WorkGroupDTO[]>();
  globalFilterFields = input<string[]>([]);
  loading = input<boolean>(false);
  value = input<boolean>(true);
  hasSuperUsuario = input<boolean>(false);
  customerId = input<string>("");

  add = output<void>();
  change = output<boolean>();
  navigateMessage = output<{
    ticketGroupId: string;
    status: EITaskMessageDTOStatus;
  }>();
  participants = output<WorkGroupDTO>();
  report = output<WorkGroupDTO>();
  edit = output<{ id: string; title: string }>();
  toggleStatus = output<string>();
  delete = output<string>();
}

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

import { TaskStatus } from "../../task-status/task-status";

@Component({
  selector: "app-my-assigned-tasks-list-mobile",
  templateUrl: "./my-assigned-tasks-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LuxDataViewMobile,
    MobileListItem,
    MobileActionMenu,
    TaskStatus,
  ],
})
export class MyAssignedTasksListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  statusChange = output<string>();
  add = output<{ id: string; title: string }>();
  followUp = output<string>();
  program = output<string>();
  progress = output<string>();
  closed = output<string>();
  reopen = output<string>();
  edit = output<{ id: string; title: string; ticketGroupId?: string }>();
}

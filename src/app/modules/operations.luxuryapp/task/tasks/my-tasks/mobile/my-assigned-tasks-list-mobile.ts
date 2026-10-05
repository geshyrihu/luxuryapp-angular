import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { TaskStatus } from "../../task-status/task-status";

@Component({
  selector: "app-my-assigned-tasks-list-mobile",
  templateUrl: "./my-assigned-tasks-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    TaskStatus,
    AppAvatar,
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

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { TaskInstance } from "@core/interfaces/recurring-tasks/task-instance.interface";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { MobileButtonLabelConfirm } from "@ui/buttons/mobile-label/button-confirm";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { StatusBadge } from "@ui/web/status-badge/status-badge";

@Component({
  selector: "app-task-instance-list-mobile",
  templateUrl: "./task-instance-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelConfirm,
    ApiDatePipe,
    DataViewMobile,
    StatusBadge,
    MobileListItem,
    AppIcon,
  ],
})
export class TaskInstanceListMobile {
  data = input.required<TaskInstance[]>();

  complete = output<TaskInstance>();
  reopen = output<string>();
}

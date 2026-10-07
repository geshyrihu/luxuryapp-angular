import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { TaskInstance } from "@core/interfaces/recurring-tasks/task-instance.interface";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { StatusBadge } from "@ui/web/status-badge/status-badge";

@Component({
  selector: "app-task-instance-list-mobile",
  templateUrl: "./task-instance-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    ApiDatePipe,
    LuxDataViewMobile,
    StatusBadge,
    MobileListItem,
    LxIcon,
  ],
})
export class TaskInstanceListMobile {
  data = input.required<TaskInstance[]>();

  complete = output<TaskInstance>();
  reopen = output<string>();
}

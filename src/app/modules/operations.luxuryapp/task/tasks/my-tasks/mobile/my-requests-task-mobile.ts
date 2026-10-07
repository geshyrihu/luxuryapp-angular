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
import { MobileListItem } from "@ui/mobile/list-item/list-item";

import { TaskStatus } from "../../task-status/task-status";

@Component({
  selector: "app-my-requests-task-mobile",
  templateUrl: "./my-requests-task-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    LuxDataViewMobile,
    TaskStatus,
    MobileListItem,
    LxIcon,
  ],
})
export class MyRequestsTaskMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  statusChange = output<string>();
  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string; ticketGroupId?: string }>();
  followUp = output<string>();
}

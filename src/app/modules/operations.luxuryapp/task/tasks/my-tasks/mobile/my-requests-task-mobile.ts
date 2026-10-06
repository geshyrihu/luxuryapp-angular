import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { AppImage } from "@ui/web/image/image";
import { TaskStatus } from "../../task-status/task-status";

@Component({
  selector: "app-my-requests-task-mobile",
  templateUrl: "./my-requests-task-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    DataViewMobile,
    TaskStatus,
    AppImage,
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

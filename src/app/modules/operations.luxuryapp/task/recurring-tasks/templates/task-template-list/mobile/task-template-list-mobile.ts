import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { TaskTemplate } from "@core/interfaces/recurring-tasks/task-template.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-task-template-list-mobile",
  templateUrl: "./task-template-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    DataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class TaskTemplateListMobile {
  data = input.required<TaskTemplate[]>();
  state = input<boolean>(true);

  add = output<void>();
  manageItems = output<string>();
  edit = output<TaskTemplate>();
  delete = output<string>();
  changeState = output<boolean>();
}

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { TaskTemplate } from "@core/interfaces/recurring-tasks/task-template.interface";
import { MobileButtonLabelActiveDesactive } from "@ui/buttons/mobile-label/button-active-desactive";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-task-template-list-mobile",
  templateUrl: "./task-template-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    MobileButtonLabelActiveDesactive,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    DataViewMobile,
    MobileListItem,
    AppIcon,
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

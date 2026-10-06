import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, FormsModule } from "@angular/forms";
import { IonButton } from "@ionic/angular";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { InitialsAbbrPipe } from "@shared/pipes/initials-abbr.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonIcon } from "@ui/buttons/mobile-icon/button";
import { ButtonMobile } from "@ui/buttons/mobile";
import { IonInputSelect } from "@ui/inputs/mobile/ion-input-select";
import { IonInputText } from "@ui/inputs/mobile/ion-input-text";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { TaskStatus } from "../../task-status/task-status";
import { ITaskMessageDTO } from "../interfaces/task-message.dto";

@Component({
  selector: "app-task-list-mobile",
  templateUrl: "./task-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxTag,
    IonButton,
    IonInputSelect,
    IonInputText,
    MobileActionMenu,
    MobileListItem,
    MobileButtonIcon,
    TaskStatus,
    AppAvatar,
    CustomInputToggleSwitch,
    FormsModule,
    InitialsAbbrPipe,
    AppIcon,
    DataViewMobile,
  ],
})
export class TaskListMobile {
  data = input.required<ITaskMessageDTO[]>();
  nameGroup = input<string>("");
  loading = input<boolean>(false);
  isSuperUser = input<boolean>(false);
  cbAssignee = input<SelectItemDto[]>([]);
  assigneeControl = input.required<FormControl<string | null>>();
  weekInputValueControl = input.required<FormControl<string>>();
  chainedTaskIds = input.required<Set<string>>();
  chainStepMap = input.required<Map<string, number>>();

  add = output<void>();
  search = output<string>();
  nextPage = output<any>();
  statusChange = output<string>();
  responsibleChange = output<any>();
  weekChange = output<Event>();
  pendingBoard = output<void>();
  previewWorkPlan = output<void>();
  previewWeeklyReport = output<void>();
  sendWeeklyReport = output<void>();
  clearDependency = output<string>();
  followUp = output<string>();
  program = output<string>();
  closed = output<string>();
  progress = output<string>();
  reopen = output<string>();
  edit = output<any>();
  delete = output<any>();
  viewPhotos = output<ITaskMessageDTO>();
  viewAdditionalImages = output<ITaskMessageDTO>();
  updateStateTicket = output<any>();

  statusBorderVar(status: string): string {
    const map: Record<string, string> = {
      NotStarted: "var(--task-not-started)",
      InProgress: "var(--task-in-progress)",
      Reopened: "var(--task-reopened)",
      Completed: "var(--task-completed)",
    };
    return map[status] ?? "transparent";
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";

import { ButtonWeb } from "@ui/buttons/web";
import { LuxSearchInput } from "@ui/inputs/web/lux-search-input-signal";
import { LxIcon } from "@ui/adaptive/icon/icon";


import { EITaskMessageDTOStatus } from "../../shared/enums/task-message-status.enum";
import { WorkGroupDTO } from "../task-group-list";

@Component({
  selector: "app-task-group-list-desktop",
  templateUrl: "./task-group-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxTag,
    LxIcon,
    LuxSearchInput],
})
export class TaskGroupListDesktop {
  data = input.required<WorkGroupDTO[]>();
  value = input<boolean>(true);
  hasSuperUsuario = input<boolean>(false);
  customerId = input<string>("");

  add = output<void>();
  change = output<boolean>();
  searchChange = output<string>();
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

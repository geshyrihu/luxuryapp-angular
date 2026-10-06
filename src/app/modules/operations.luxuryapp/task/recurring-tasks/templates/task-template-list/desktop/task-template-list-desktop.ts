import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { TaskTemplate } from "@core/interfaces/recurring-tasks/task-template.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-task-template-list-desktop",
  templateUrl: "./task-template-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIconActiveDesactive,
    LxTooltipDirective,
    TableEmptyMessage,
    LuxTableCaption,
    AppTable,
  ],
})
export class TaskTemplateListDesktop {
  data = input.required<TaskTemplate[]>();
  loading = input<boolean>(false);
  state = input<boolean>(true);

  add = output<void>();
  manageItems = output<string>();
  edit = output<TaskTemplate>();
  delete = output<string>();
  changeState = output<boolean>();

  private tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, FormsModule } from "@angular/forms";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { LxImage } from "@ui/adaptive/image/image";
import { LxPopover } from "@ui/adaptive/popover/popover";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ButtonWeb } from "@ui/buttons/web";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { InitialsAbbrPipe } from "@shared/pipes/initials-abbr.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppReorderableRow,
  AppReorderableRowHandle,
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { TaskStatus } from "../../task-status/task-status";
import { ITaskMessageDTO } from "../interfaces/task-message.dto";

@Component({
  selector: "app-task-list-desktop",
  templateUrl: "./task-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host ::ng-deep lux-table-caption > div {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep app-task-status > div {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep base-input-signal .field {
        margin-bottom: 0 !important;
      }
      :host ::ng-deep tr.task-link-source > td {
        opacity: 0.55;
      }
      :host ::ng-deep tr.task-link-target > td {
        background-color: color-mix(
          in srgb,
          var(--ds-ai) 10%,
          transparent
        ) !important;
        outline: 2px dashed color-mix(in srgb, var(--ds-ai) 55%, transparent);
        outline-offset: -2px;
      }
      :host ::ng-deep tr.task-chain-member > td:nth-child(2) {
        border-left: 3px solid color-mix(in srgb, var(--ds-ai) 45%, transparent);
      }
      :host ::ng-deep .task-evidence-thumb {
        display: block;
        width: 2.75rem;
        height: 2.75rem;
        object-fit: cover;
        border-radius: 0.375rem;
        border: 1px solid var(--ds-border, #dee2e6);
      }
    `,
  ],
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppReorderableRow,
    AppReorderableRowHandle,
    AppSortableColumn,
    AppSorticon,
    ActionMenu,
    CustomInputTextSignal,
    TaskStatus,
    CustomInputSelectSignal,
    WebButtonLabel,
    WebButtonIcon,
    AppAvatar,
    CustomInputToggleSwitch,
    FormsModule,
    LuxTableCaption,
    LxTooltipDirective,
    LxPopover,
    LxImage,
    InitialsAbbrPipe,
    AppIcon,
  ],
})
export class TaskListDesktop {
  data = input.required<ITaskMessageDTO[]>();
  nameGroup = input<string>("");
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  globalFilterFields = input<string[]>([]);
  scrollHeight = input<string>("600px");
  isSuperUser = input<boolean>(false);
  cbAssignee = input<SelectItemDto[]>([]);
  assigneeControl = input.required<FormControl<string | null>>();
  weekInputValueControl = input.required<FormControl<string>>();
  wekklyIsNullOrEmpty = input<boolean>(true);
  linkDragSourceId = input<string | null>(null);
  linkDragTargetId = input<string | null>(null);
  chainedTaskIds = input.required<Set<string>>();
  chainStepMap = input.required<Map<string, number>>();

  lazyLoad = output<any>();
  rowReorder = output<{ dragIndex: number; dropIndex: number }>();
  add = output<void>();
  search = output<string>();
  statusChange = output<string>();
  responsibleChange = output<any>();
  weekChange = output<Event>();
  pendingBoard = output<void>();
  previewWorkPlan = output<void>();
  previewWeeklyReport = output<void>();
  sendWeeklyReport = output<void>();
  printReport = output<void>();
  summaryReport = output<void>();
  cardEmployee = output<string>();
  updatePriority = output<string>();
  clearDependency = output<string>();
  linkDragStart = output<{ event: DragEvent; id: string }>();
  linkDragOver = output<{ event: DragEvent; id: string }>();
  linkDragLeave = output<{ event: DragEvent; id: string }>();
  linkDrop = output<{ event: DragEvent; id: string }>();
  linkDragEnd = output<void>();
  followUp = output<string>();
  program = output<string>();
  closed = output<string>();
  progress = output<string>();
  reopen = output<string>();
  edit = output<any>();
  delete = output<any>();
  viewAdditionalImages = output<any>();
  updateStateTicket = output<any>();

  readonly Math = Math;
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

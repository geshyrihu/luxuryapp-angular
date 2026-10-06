import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { rowsPerPageOptions } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { LogEntry } from "../interfaces/log-entry.interface";

@Component({
  selector: "app-log-api-report-desktop",
  templateUrl: "./log-api-report-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableEmptyMessage,
    CommonModule,
    ApiDatePipe,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxCard,
    LxTag,
    WebButtonLabel,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    WebButtonIcon,
    LuxTableCaption,
    LxIcon,
  ],
})
export class LogApiReportDesktop {
  data = input.required<LogEntry[]>();
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  rows = input<number>(0);
  globalFilterFields = input<string[]>([]);
  levelOptions = input<SelectItemDto[]>([]);
  filterLevelControl = input.required<FormControl<string | null>>();
  filterDateRangeControl = input.required<FormControl<Date[] | null>>();
  isSearchDisabled = input<boolean>(true);

  pageChange = output<any>();
  search = output<string>();
  loadData = output<void>();
  deleteAll = output<void>();
  toggleExpand = output<LogEntry>();

  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  getLevelSeverity(level: string): "success" | "info" | "warn" | "danger" {
    switch (level?.toLowerCase()) {
      case "information":
        return "info";
      case "warning":
        return "warn";
      case "error":
      case "critical":
        return "danger";
      default:
        return "info";
    }
  }
}

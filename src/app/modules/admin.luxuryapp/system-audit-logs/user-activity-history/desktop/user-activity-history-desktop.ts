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
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-user-activity-history-desktop",
  templateUrl: "./user-activity-history-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    LuxTableCaption,
  ],
})
export class UserActivityHistoryDesktop {
  data = input.required<any[]>();
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  rows = input<number>(0);
  globalFilterFields = input<string[]>([]);
  customerOptions = input<SelectItemDto[]>([]);
  userTypeOptions = input<SelectItemDto[]>([]);
  filterCustomerIdControl = input.required<FormControl<string | null>>();
  filterUserTypeControl = input.required<FormControl<any | null>>();
  filterDateRangeControl = input.required<FormControl<Date[] | null>>();
  isSearchDisabled = input<boolean>(true);

  pageChange = output<any>();
  search = output<string>();
  loadData = output<void>();

  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

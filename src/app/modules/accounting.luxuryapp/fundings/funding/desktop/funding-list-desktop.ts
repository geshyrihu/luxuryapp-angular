import { ButtonWeb } from "@ui/buttons/web";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-funding-list-desktop",
  templateUrl: "./funding-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb, 
    CommonModule,
    LxTag,
    LxIcon,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon],
})
export class FundingListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  details = output<string>();
  faqs = output<void>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { BankDto } from "../interfaces/banks.dto";

@Component({
  selector: "app-bank-list-desktop",
  templateUrl: "./bank-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonIconDelete,
    WebButtonIconEdit,
  ],
})
export class BankListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<BankDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  loading = signal(true);
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}

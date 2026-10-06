import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-projected-expenses-list-desktop",
  templateUrl: "./projected-expenses-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    DecimalPipe,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon],
})
export class ProjectedExpensesListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  loading = input<boolean>(false);
  scrollHeight = input<string>("600px");

  modal = output<any>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

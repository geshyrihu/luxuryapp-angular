import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-product-entry-list-desktop",
  templateUrl: "./product-entry-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    ApiDatePipe,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    LuxTableCaption,
    TableFooter],
})
export class ProductEntryListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isSuperUsuario = input<boolean>(false);

  edit = output<any>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ButtonWeb } from "@ui/buttons/web";
import { StatusBadge } from "@ui/web/status-badge/status-badge";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-aspel-customer-empresa-list-desktop",
  templateUrl: "./aspel-customer-empresa-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    StatusBadge,
    TableEmptyMessage,
    LuxTableCaption,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon],
})
export class AspelCustomerEmpresaListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  modalForm = output<any>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

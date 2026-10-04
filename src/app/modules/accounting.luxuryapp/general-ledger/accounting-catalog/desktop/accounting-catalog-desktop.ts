import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { AccountingCatalogWithParent } from "../interfaces/AccountingCatalogWithParent";

@Component({
  selector: "app-accounting-catalog-desktop",
  templateUrl: "./accounting-catalog-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonLabel,
    AppIcon,
    LuxTableCaption,
    TableFooter,
    AppSortableColumn,
    AppSorticon,
    AppTable,
  ],
})
export class AccountingCatalogDesktop {
  data = input.required<AccountingCatalogWithParent[]>();
  globalFilterFields = input<string[]>([]);

  export = output<void>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

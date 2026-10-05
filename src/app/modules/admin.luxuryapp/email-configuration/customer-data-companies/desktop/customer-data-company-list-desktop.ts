import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { CustomerDataCompanyDto } from "../customer-data-company.dto";

@Component({
  selector: "app-customer-data-company-list-desktop",
  templateUrl: "./customer-data-company-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LuxTableCaption,
    TableFooter,
    TableEmptyMessage,
    CustomInputSelectSignal,
    AppIcon,
  ],
})
export class CustomerDataCompanyListDesktop {
  data = input.required<CustomerDataCompanyDto[]>();
  sortedData = input.required<CustomerDataCompanyDto[]>();
  globalFilterFields = input<string[]>([]);
  groupingOptions = input<{ label: string; value: string }[]>([]);
  groupingOption = input<string>("numeroCliente");
  groupingOptionControl = input<FormControl<string> | null>(null);

  add = output<any>();
  edit = output<any>();
  delete = output<string>();
  groupingChange = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

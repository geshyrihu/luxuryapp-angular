import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
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
    ButtonWeb,
    FormsModule,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
    TableEmptyMessage,
    LuxInputSelectSignal,
    LxIcon,
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

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";

import { ButtonWeb } from "@ui/buttons/web";
import { InputDatepicker } from "@ui/inputs/adaptive/input-datepicker/input-datepicker";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-product-output-list-desktop",
  templateUrl: "./product-output-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    TableFooter,
    LuxInputTextSignal,
    ReactiveFormsModule,
    InputDatepicker,
  ],
})
export class ProductOutputListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  totalRecords = input<number>(0);
  loading = input<boolean>(false);
  selectedDateControl = input.required<FormControl<Date | null>>();
  filterControl = input.required<FormControl<string | null>>();
  isSuperUsuario = input<boolean>(false);

  lazyLoad = output<any>();
  loadData = output<void>();
  clearFilter = output<void>();
  generateReport = output<void>();
  edit = output<any>();
  returnProduct = output<any>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

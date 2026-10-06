import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { CustomerDto } from "../interfaces/customer.dto";

@Component({
  selector: "app-customer-list-desktop",
  templateUrl: "./customer-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxAvatar,
    NgbTooltipModule,
    LuxTableCaption,
    TableFooter,
  ],
})
export class CustomerListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<CustomerDto[]>();
  globalFilterFields = input<string[]>([]);
  state = input<boolean>(false);
  stateOptions = input<SelectItemDto[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  updateImages = output<string>();
  updateAddress = output<string>();
  manageLocations = output<{ id: string; name?: string }>();
  sortChange = output<boolean>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  getStateLabel(stateValue: number): string {
    const found = this.stateOptions().find((opt) => opt.value === stateValue);
    return found?.label ?? "Desconocido";
  }
}

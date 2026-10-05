import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import {
  CustomerLocationType,
  CustomerLocationTypeLabels,
} from "../interfaces/customer-location-type.enum";
import { CustomerLocationDto } from "../interfaces/customer-location.dto";

@Component({
  selector: "app-customer-location-list-desktop",
  templateUrl: "./customer-location-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    NgbTooltipModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
  ],
})
export class CustomerLocationListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<CustomerLocationDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<CustomerLocationDto>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  getLocationTypeLabel(type: string): string {
    return CustomerLocationTypeLabels[type as CustomerLocationType] || type;
  }
}

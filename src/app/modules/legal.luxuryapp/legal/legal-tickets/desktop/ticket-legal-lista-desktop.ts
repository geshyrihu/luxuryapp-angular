import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
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

@Component({
  selector: "app-ticket-legal-lista-desktop",
  templateUrl: "./ticket-legal-lista-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CustomInputSelectSignal,
    TableEmptyMessage,
    FormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTooltipDirective,
    LxTag,
    LuxTableCaption,
    TableFooter,
    ButtonWeb,
    AppIcon,
  ],
})
export class TicketLegalListaDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  cbCustomer = input<SelectItemDto[]>([]);
  canChangeCustomer = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  updateStatus = output<{ id: string }>();
  seguimiento = output<any>();
  reasignarCliente = output<any>();
  exportExcel = output<void>();
  customerFilter = output<string | undefined>();
}

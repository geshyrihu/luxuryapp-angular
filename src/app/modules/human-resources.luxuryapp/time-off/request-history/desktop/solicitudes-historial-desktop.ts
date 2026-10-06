import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-solicitudes-historial-desktop",
  templateUrl: "./solicitudes-historial-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxTag,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    ApiDatePipe,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    LuxTableCaption,
    TableEmptyMessage],
})
export class SolicitudesHistorialDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  form = input.required<FormGroup>();
  data = input.required<any[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);
  employees = input<SelectItemDto[]>([]);
  requestTypes = input<SelectItemDto[]>([]);
  statuses = input<SelectItemDto[]>([]);
  canCancel = input<boolean>(false);

  search = output<void>();
  reset = output<void>();
  showDetail = output<any>();
  cancel = output<any>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}

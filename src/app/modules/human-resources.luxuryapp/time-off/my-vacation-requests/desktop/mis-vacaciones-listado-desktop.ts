import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { VacationRequestMyDTO } from "@human-resources.luxuryapp/interfaces/vacation-request.interface";
import { getStatusSeverity } from "@human-resources.luxuryapp/shared/helpers/status-severity.helper";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-mis-vacaciones-listado-desktop",
  templateUrl: "./mis-vacaciones-listado-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonLabel,
    ButtonWeb,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
  ],
})
export class MisVacacionesListadoDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<VacationRequestMyDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  detail = output<string>();
  delete = output<string>();
  navSaldo = output<void>();

  getStatusSeverity = getStatusSeverity;

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}

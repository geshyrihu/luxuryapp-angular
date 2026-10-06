import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LeaveRequestMyDTO } from "@human-resources.luxuryapp/interfaces/leave-request.interface";
import { getStatusSeverity } from "@human-resources.luxuryapp/shared/helpers/status-severity.helper";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
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
  selector: "app-mis-permisos-listado-desktop",
  templateUrl: "./mis-permisos-listado-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
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
export class MisPermisosListadoDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<LeaveRequestMyDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  detail = output<{ id: string; title: string }>();
  delete = output<string>();

  getStatusSeverity = getStatusSeverity;

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}

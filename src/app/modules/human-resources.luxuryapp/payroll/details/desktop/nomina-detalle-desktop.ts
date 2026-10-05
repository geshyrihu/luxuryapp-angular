import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { NominaDetalleDTO } from "../../interfaces/nomina-detalle.interface";

@Component({
  selector: "app-nomina-detalle-desktop",
  templateUrl: "./nomina-detalle-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WebButtonIcon,
    ButtonWeb,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonLabel,
    LuxTableCaption,
  ],
})
export class NominaDetalleDesktop {
  private tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<NominaDetalleDTO[]>();
  globalFilterFields = input<string[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  edit = output<NominaDetalleDTO>();
  downloadReceipt = output<NominaDetalleDTO>();
  exportExcel = output<void>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

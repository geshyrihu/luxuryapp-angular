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
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { PrestamoEmpleadoDTO } from "../../interfaces/prestamo-empleado.interface";

@Component({
  selector: "app-prestamos-empleado-desktop",
  templateUrl: "./prestamos-empleado-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LxTag,
    WebButtonIcon,
    WebButtonIconDelete,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
  ],
})
export class PrestamosEmpleadoDesktop {
  private tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<PrestamoEmpleadoDTO[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  add = output<void>();
  view = output<PrestamoEmpleadoDTO>();
  delete = output<PrestamoEmpleadoDTO>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  getEstadoSeverity(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: "warn",
      Autorizado: "success",
      Cancelado: "danger",
      Liquidado: "secondary",
    };
    return map[estado] ?? "secondary";
  }

  getProgreso(item: PrestamoEmpleadoDTO): number {
    if (item.numeroPagos === 0) return 0;
    return Math.round((item.pagosRealizados / item.numeroPagos) * 100);
  }
}

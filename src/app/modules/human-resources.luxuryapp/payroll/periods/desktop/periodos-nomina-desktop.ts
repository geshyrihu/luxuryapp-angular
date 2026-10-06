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
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { PeriodoNominaDTO } from "../../interfaces/periodo-nomina.interface";

@Component({
  selector: "app-periodos-nomina-desktop",
  templateUrl: "./periodos-nomina-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    LxTag,
    ButtonWeb,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    LuxTableCaption],
})
export class PeriodosNominaDesktop {
  private tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<PeriodoNominaDTO[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  add = output<void>();
  edit = output<PeriodoNominaDTO>();
  nonWorkingDays = output<PeriodoNominaDTO>();
  delete = output<PeriodoNominaDTO>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  getEstadoSeverity(estado: string): string {
    const map: Record<string, string> = {
      Abierto: "success",
      EnProceso: "info",
      Cerrado: "secondary",
    };
    return map[estado] ?? "secondary";
  }
}

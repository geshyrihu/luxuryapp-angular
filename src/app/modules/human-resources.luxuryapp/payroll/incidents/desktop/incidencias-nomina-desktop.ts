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
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { IncidenciaNominaDTO } from "../../interfaces/incidencia-nomina.interface";

@Component({
  selector: "app-incidencias-nomina-desktop",
  templateUrl: "./incidencias-nomina-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    LxTag,
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption],
})
export class IncidenciasNominaDesktop {
  private tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<IncidenciaNominaDTO[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);
  sincronizando = input<boolean>(false);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  add = output<void>();
  delete = output<IncidenciaNominaDTO>();
  syncVacations = output<void>();
  syncPermissions = output<void>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  getTipoSeverity(tipo: number): string {
    const map: Record<number, string> = {
      0: "danger",
      1: "warn",
      2: "warn",
      3: "info",
      4: "success",
      5: "secondary",
      6: "contrast",
      7: "secondary",
      8: "danger",
    };
    return map[tipo] ?? "secondary";
  }
}

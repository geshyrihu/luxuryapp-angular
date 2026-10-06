import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ButtonWeb } from "@ui/buttons/web";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-lista-evaluacion-realizada-desktop",
  templateUrl: "./lista-evaluacion-realizada-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    ApiDatePipe,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon],
})
export class ListaEvaluacionRealizadaDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  downloadAll = output<void>();
  edit = output<string>();
  detail = output<string>();
  downloadIndividual = output<{ id: string; employeeName: string }>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

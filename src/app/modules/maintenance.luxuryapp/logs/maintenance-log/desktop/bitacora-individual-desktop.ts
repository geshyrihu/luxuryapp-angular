import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-bitacora-individual-desktop",
  templateUrl: "./bitacora-individual-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RangoCalendarioyyyymmdd, ApiDatePipe, AppTable, LuxTableCaption, TableFooter],
})
export class BitacoraIndividualDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  nameMachinery = input<string>("");

  cardEmployee = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

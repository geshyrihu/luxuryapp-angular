import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { LxImage } from "@ui/adaptive/image/image";
import { LxTag } from "@ui/adaptive/tag/tag";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { FormsModule } from "@angular/forms";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { IRegistroChecador } from "../interfaces/chekador-empleados.models";

@Component({
  selector: "app-chekador-list-desktop",
  templateUrl: "./chekador-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    LxImage,
    CustomInputCheckSignal,
    FormsModule,
    LuxTableCaption,
    TableFooter],
})
export class ChekadorListDesktop {
  data = input.required<IRegistroChecador[]>();
  globalFilterFields = input<string[]>([]);
  loading = input<boolean>(false);
  desde = input<string>("");
  hasta = input<string>("");
  soloAnomalias = input<boolean>(false);

  desdeChange = output<string>();
  hastaChange = output<string>();
  soloAnomaliasChange = output<boolean>();
  applyFilters = output<void>();
  clearFilters = output<void>();
  approve = output<IRegistroChecador>();
  reject = output<IRegistroChecador>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  getBadgeSeverity(
    estadoAnomalia: string | null,
  ): "success" | "danger" | "warn" | "secondary" {
    if (!estadoAnomalia) return "secondary";
    if (estadoAnomalia === "Aprobada") return "success";
    if (estadoAnomalia === "Rechazada") return "danger";
    return "warn";
  }
}

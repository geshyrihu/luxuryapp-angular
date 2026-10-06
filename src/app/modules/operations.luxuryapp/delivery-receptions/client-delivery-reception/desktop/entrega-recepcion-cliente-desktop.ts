import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ButtonWeb } from "@ui/buttons/web";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-entrega-recepcion-cliente-lista-desktop",
  templateUrl: "./entrega-recepcion-cliente-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxIcon,
    TableEmptyMessage,
    AppTable,
    ActionMenu,
    LuxTableCaption],
})
export class EntregaRecepcionClienteListaDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  departamentos = input<{ value: string }[]>([]);
  selectedDepartamento = input<string>("");
  showDepartmentFilter = input<boolean>(false);

  add = output<void>();
  edit = output<{ id: string; title: string }>();
  validar = output<string>();
  invalidar = output<string>();
  deleteFile = output<string>();
  departamentoChange = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}

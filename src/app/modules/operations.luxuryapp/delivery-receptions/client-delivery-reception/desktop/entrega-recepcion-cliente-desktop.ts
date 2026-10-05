import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { ButtonWeb } from "@ui/buttons/web";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
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
    AppIcon,
    WebButtonIconViewPdf,
    TableEmptyMessage,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    AppTable,
    WebButtonLabel,
    ActionMenu,
    LuxTableCaption,
  ],
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

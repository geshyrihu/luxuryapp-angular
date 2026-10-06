import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { ComiteVigilancia } from "@core/interfaces/comite-vigilancia.interface";

export interface ComiteVigilanciaFormData {
  id: string;
  title: string;
  nameProperty?: string;
}

@Component({
  selector: "app-comite-vigilancia-list-desktop",
  templateUrl: "./comite-vigilancia-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class ComiteVigilanciaListDesktop {
  data = input.required<ComiteVigilancia[]>();
  globalFilterFields = input<string[]>([]);
  loading = input<boolean>(false);

  add = output<ComiteVigilanciaFormData>();
  edit = output<ComiteVigilanciaFormData>();
  delete = output<string>();
  sendCredential = output<string>();

  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
}

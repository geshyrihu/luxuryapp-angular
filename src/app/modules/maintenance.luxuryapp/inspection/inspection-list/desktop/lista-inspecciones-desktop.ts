import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "@ui/web/table/table";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppToolbar } from "@ui/web/toolbar/toolbar";
import { AppCard } from "@ui/web/card/card";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  InspectionListItem,
  InspectionSummary,
} from "../../models/inspection.model";

type InspectionTableRow = InspectionSummary & {
  departament: string;
  areaResponsable: string;
};

@Component({
  selector: "app-lista-inspecciones-desktop",
  templateUrl: "./lista-inspecciones-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    LxTooltipDirective,
    CustomInputSelectSignal,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableEmptyMessage,
    TableFooter,
    WebButtonLabel,
    WebButtonIconDelete,
    WebButtonIconEdit,
    WebButtonIconItem,
    AppToolbar,
    AppCard,
  ],
})
export class ListaInspeccionesDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<InspectionListItem[]>();
  areasResponsables = input<SelectItemDto[]>([]);
  selectedArea = input("");
  selectedRecurrence = input("");

  add = output<void>();
  edit = output<{ id: string; title: string }>();
  detalles = output<string>();
  delete = output<string>();
  reportes = output<void>();
  filterAreaChange = output<string>();
  filterRecurrenceChange = output<string>();

  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = ["name", "frequency", "departament"];

  readonly rows = computed<InspectionTableRow[]>(() =>
    this.data().flatMap((group) =>
      group.inspecciones.map((item) => ({
        ...item,
        departament: group.departament,
        areaResponsable: group.areaResponsable,
      })),
    ),
  );
}

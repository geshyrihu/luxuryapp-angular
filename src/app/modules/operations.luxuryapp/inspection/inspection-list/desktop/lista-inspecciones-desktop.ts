import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
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
  styleUrl: "./lista-inspecciones-desktop.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    FormsModule,
    LxTooltipDirective,
    LuxInputSelectSignal,
    AppTable,
    AppSortableColumn,
    TableEmptyMessage,
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
  applyFilters = output<void>();
  clearFilters = output<void>();

  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = [
    "name",
    "recurrenceUnitDisplayName",
    "departament",
  ];

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

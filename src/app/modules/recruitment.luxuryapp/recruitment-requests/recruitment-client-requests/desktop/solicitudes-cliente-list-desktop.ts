import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-solicitudes-cliente-list-desktop",
  templateUrl: "./solicitudes-cliente-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
    LxTag,
  ],
})
export class SolicitudesClienteListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  editSolicitudAlta = output<{ id: string }>();
  editVacante = output<{ id: string }>();
  editSolicitudBaja = output<{ id: string }>();
  editModificacionSalario = output<{ id: string }>();

  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  getTagSeverity(
    status: string,
  ): "success" | "warning" | "danger" | "secondary" {
    switch (status) {
      case "Concluido":
        return "success";
      case "Proceso":
      case "Pendiente":
        return "warning";
      case "Cancelado":
        return "danger";
      default:
        return "secondary";
    }
  }
}

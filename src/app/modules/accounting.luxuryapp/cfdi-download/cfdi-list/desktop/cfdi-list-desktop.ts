import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { SatCfdiRecibidoDto } from "../../interfaces/cfdi-download.interfaces";

@Component({
  selector: "app-cfdi-list-desktop",
  templateUrl: "./cfdi-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LxTag,
    AppIcon,
    WebButtonLabel,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
  ],
})
export class CfdiListDesktop {
  data = input.required<SatCfdiRecibidoDto[]>();
  globalFilterFields = input<string[]>([]);

  verPdf = output<string>();
  exportarExcel = output<void>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  efosSeverity(efosEstado: string | null): "danger" | "warning" | "success" {
    if (!efosEstado) return "success";
    if (efosEstado === "Definitivo") return "danger";
    return "warning";
  }
}

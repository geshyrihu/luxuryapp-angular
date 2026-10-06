import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { UpperCasePipe } from "@angular/common";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { LxIcon } from '@ui/adaptive/icon/icon';
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-resumen-minuta-desktop",
  templateUrl: "./resumen-minuta-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperCasePipe,
    ApiDatePipe,
    SanitizeHtmlPipe,
    LxTag,
    LxTooltipDirective,
    LxIcon,
    LuxTableCaption,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon],
})
export class ResumenMinutaDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<any[]>();
  loading = input<boolean>(false);

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  getSeverity(
    status: number,
  ): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    switch (status) {
      case 0: // Pendiente
        return "danger";
      case 1: // Concluido
        return "success";
      case 2: // No Autorizado
        return "warn";
      default:
        return "secondary";
    }
  }

  getSeverityText(status: number): string {
    switch (status) {
      case 0:
        return "Pendiente";
      case 1:
        return "Concluido";
      case 2:
        return "No Autorizado";
      default:
        return "Desconocido";
    }
  }
}
